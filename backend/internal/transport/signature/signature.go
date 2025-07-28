package signature

import (
	"net/http"

	"github.com/Alexander272/generate_signature/backend/internal/models"
	"github.com/Alexander272/generate_signature/backend/internal/models/response"
	"github.com/Alexander272/generate_signature/backend/internal/services"
	"github.com/Alexander272/generate_signature/backend/pkg/error_bot"
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
	}
}

func (h *Handler) download(c *gin.Context) {}

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
