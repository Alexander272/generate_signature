package services

type Services struct {
	Signature
}

type Deps struct {
}

func NewServices(deps *Deps) *Services {
	sign := NewSignatureService()

	return &Services{
		Signature: sign,
	}
}
