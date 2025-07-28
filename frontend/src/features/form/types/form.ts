export interface IForm {
	base: IBase
	footer: IFooter
}

export interface IBase {
	email: string
	phone?: string
	mobile?: string
	name: string
	position: string

	logo: string
}

export interface IFooter {
	isNotEmpty: boolean
	hasEDI: boolean
}
