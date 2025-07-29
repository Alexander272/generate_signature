package signature

import (
	"net/http"
	"os"

	"github.com/Alexander272/generate_signature/backend/internal/models"
	"github.com/Alexander272/generate_signature/backend/internal/models/response"
	"github.com/Alexander272/generate_signature/backend/internal/services"
	"github.com/Alexander272/generate_signature/backend/pkg/error_bot"
	"github.com/Alexander272/generate_signature/backend/pkg/logger"
	"github.com/gin-gonic/gin"
)

type Handler struct {
	services services.Signature
}

func NewHandler(services services.Signature) *Handler {
	return &Handler{
		services: services,
	}
}

func Register(api *gin.RouterGroup, service services.Signature) {
	handler := NewHandler(service)

	sign := api.Group("/signature")
	{
		sign.GET("/download", handler.download)
		sign.POST("", handler.render)
		sign.POST("/file", handler.processFile)
	}
}

func (h *Handler) download(c *gin.Context) {
	filePath := "assets/csv/template.csv"
	logger.Debug("download file", logger.StringAttr("filePath", filePath))

	c.Header("Content-Description", "File Transfer")
	c.Header("Content-Transfer-Encoding", "binary")
	c.Header("Content-Disposition", "attachment; filename=Шаблон.csv")
	c.Header("Content-Type", "application/octet-stream")
	c.File(filePath)
}

func (h *Handler) render(c *gin.Context) {
	dto := &models.RenderData{}
	if err := c.BindJSON(dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправьте корректные данные")
		return
	}

	body, err := h.services.Render(c, dto)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		error_bot.Send(c, err.Error(), dto)
		return
	}

	c.Writer.Header().Set("Content-Type", "text/html")
	c.Writer.WriteHeader(http.StatusOK)
	c.Writer.Write([]byte(body))
}

func (h *Handler) processFile(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправьте корректные данные")
		return
	}

	kind := c.PostForm("kind")
	if kind == "" {
		response.NewErrorResponse(c, http.StatusBadRequest, "kind is empty", "Отправьте корректные данные")
		return
	}

	f, err := file.Open()
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		error_bot.Send(c, err.Error(), nil)
		return
	}
	defer f.Close()

	if kind == "file" {
		fileName, err := h.services.ProcessFile(c, f)
		if err != nil {
			response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
			error_bot.Send(c, err.Error(), nil)
			return
		}

		defer os.Remove(fileName)
		c.Header("Content-Description", "File Transfer")
		c.Header("Content-Transfer-Encoding", "binary")
		c.Header("Content-Disposition", "attachment; filename="+fileName)
		c.Header("Content-Type", "application/octet-stream")
		c.File(fileName)
	} else {
		data, err := h.services.ExtractFromFile(c, f)
		if err != nil {
			response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
			error_bot.Send(c, err.Error(), nil)
			return
		}
		c.JSON(http.StatusOK, response.DataResponse{Data: data, Total: len(data)})
	}
}
