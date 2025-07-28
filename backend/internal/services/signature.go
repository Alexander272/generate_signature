package services

import (
	"bytes"
	"context"
	"fmt"
	"net/url"

	htmlTemplate "html/template"

	"github.com/Alexander272/generate_signature/backend/internal/assets/templates"
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
}

func (r *SignatureService) Render(ctx context.Context, dto *models.RenderData) (string, error) {
	dto.Base.HasMobile = dto.Base.Mobile != ""
	if _, err := url.ParseRequestURI(dto.Base.Logo); err == nil {
		dto.Base.IsLogoLink = true
	}

	patterns := []string{"partials/head.tmpl", "partials/edi.tmpl", "signature.tmpl"}
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
