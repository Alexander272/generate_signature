package models

type RenderData struct {
	Setting *Setting `json:"setting"`
	Header  *Header  `json:"header"`
	Base    *Base    `json:"base" binding:"required"`
	Footer  *Footer  `json:"footer"`
}

type Setting struct {
	FontSize    string `json:"fontSize"`
	Color       string `json:"color"`
	AccentColor string `json:"accentColor"`
}

type Header struct {
	IsNotEmpty bool          `json:"isNotEmpty"`
	Values     []HeaderValue `json:"values"`
}
type HeaderValue struct {
	IsLink  bool   `json:"isLink"`
	IsImage bool   `json:"isImage"`
	Value   string `json:"value"`
}

type Base struct {
	Email      string `json:"email" binding:"required,email"`
	HasPhone   bool   `json:"hasPhone"`
	Phone      string `json:"phone"`
	Mobile     string `json:"mobile"`
	HasMobile  bool   `json:"hasMobile"`
	Name       string `json:"name" binding:"required"`
	Position   string `json:"position"`
	Logo       string `json:"logo"`
	IsLogoLink bool   `json:"isLogoLink"`
}

type Footer struct {
	IsNotEmpty bool `json:"isNotEmpty"`
	HasEDI     bool `json:"hasEDI"`
}
