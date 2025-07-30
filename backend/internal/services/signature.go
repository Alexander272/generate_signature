package services

import (
	"archive/zip"
	"bytes"
	"context"
	"encoding/csv"
	"fmt"
	"io"
	"net/url"
	"os"
	"strings"
	"time"

	htmlTemplate "html/template"

	"github.com/Alexander272/generate_signature/backend/assets/templates"
	"github.com/Alexander272/generate_signature/backend/internal/constants"
	"github.com/Alexander272/generate_signature/backend/internal/funcs"
	"github.com/Alexander272/generate_signature/backend/internal/models"
	"github.com/tdewolff/minify/v2"
	"github.com/tdewolff/minify/v2/css"
	"github.com/tdewolff/minify/v2/html"
)

type SignatureService struct{}

func NewSignatureService() *SignatureService {
	return &SignatureService{}
}

type Signature interface {
	Render(ctx context.Context, dto *models.RenderData) (string, error)
	ExtractFromFile(ctx context.Context, reader io.Reader) ([]*models.RenderData, error)
	PrepareArchive(ctx context.Context, data []*models.RenderData) (string, error)
	ProcessFile(ctx context.Context, reader io.Reader) (string, error)
}

func (s *SignatureService) Render(ctx context.Context, dto *models.RenderData) (string, error) {
	dto.Base.HasPhone = dto.Base.Phone != ""
	dto.Base.HasMobile = dto.Base.Mobile != ""
	if _, err := url.ParseRequestURI(dto.Base.Logo); err == nil {
		dto.Base.IsLogoLink = true
	}

	patterns := []string{"partials/head.tmpl", "partials/edi.tmpl", "partials/header.tmpl", "signature.tmpl"}
	ts, err := htmlTemplate.New("").Funcs(funcs.TemplateFuncs).ParseFS(templates.Templates, patterns...)
	if err != nil {
		return "", fmt.Errorf("failed to create html template set. error: %w", err)
	}

	htmlBody := new(bytes.Buffer)
	err = ts.ExecuteTemplate(htmlBody, "htmlBody", dto)
	if err != nil {
		return "", fmt.Errorf("failed to execute html template. error: %w", err)
	}

	m := minify.New()
	m.AddFunc("text/css", css.Minify)
	// m.AddFunc("text/html", html.Minify)
	m.Add("text/html", &html.Minifier{KeepEndTags: true})

	body, err := m.String("text/html", htmlBody.String())
	if err != nil {
		return "", fmt.Errorf("failed to minify html. error: %w", err)
	}

	return body, nil
}

func (s *SignatureService) ExtractFromFile(ctx context.Context, reader io.Reader) ([]*models.RenderData, error) {
	csvReader := csv.NewReader(reader)
	csvReader.Comma = ';'
	data := make([]*models.RenderData, 0, 20)

	for {
		record, err := csvReader.Read()
		if err == io.EOF {
			break // End of file reached
		}
		if err != nil {
			return nil, fmt.Errorf("failed to read csv file. error: %w", err)
		}
		if len(record) == 0 || record[0] == "" || record[0] == "№" {
			continue
		}

		data = append(data, &models.RenderData{
			Base: &models.Base{
				Name:       record[1],
				Position:   record[2],
				Phone:      record[3],
				Mobile:     record[4],
				Email:      record[5],
				Logo:       constants.DefaultLogo,
				IsLogoLink: false,
			},
			Footer: &models.Footer{
				IsNotEmpty: record[6] == "1",
				HasEDI:     record[6] == "1",
			},
		})
	}

	return data, nil
}

func (s *SignatureService) PrepareArchive(ctx context.Context, data []*models.RenderData) (string, error) {
	zipName := fmt.Sprintf("Подписи-%s.zip", time.Now().Format("2006-01-02:15-04-05"))
	archive, err := os.Create(zipName)
	if err != nil {
		return "", fmt.Errorf("failed to create zip. error: %w", err)
	}
	defer archive.Close()

	zipWriter := zip.NewWriter(archive)

	for _, d := range data {
		html, err := s.Render(ctx, d)
		if err != nil {
			return "", err
		}

		zipFile, err := zipWriter.Create(strings.Split(d.Base.Email, "@")[0] + ".html")
		if err != nil {
			return "", fmt.Errorf("failed to create zip file. error: %w", err)
		}
		if _, err := zipFile.Write([]byte(html)); err != nil {
			return "", fmt.Errorf("failed to write zip file. error: %w", err)
		}
	}

	if err := zipWriter.Close(); err != nil {
		return "", fmt.Errorf("failed to close writer. err %w", err)
	}

	return zipName, nil
}

func (s *SignatureService) ProcessFile(ctx context.Context, reader io.Reader) (string, error) {
	data, err := s.ExtractFromFile(ctx, reader)
	if err != nil {
		return "", err
	}

	fileName, err := s.PrepareArchive(ctx, data)
	if err != nil {
		return "", err
	}

	return fileName, nil
}
