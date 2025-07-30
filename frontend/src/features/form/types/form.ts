export interface IForm {
	setting?: ISetting
	header: IHeader
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

export interface ISetting {
	fontSize?: string
}

export interface IHeader {
	isNotEmpty: boolean
	values: IHeaderValue[]
}
export interface IHeaderValue {
	isImage: boolean
	value: string
	isLink?: boolean
}

export interface IFooter {
	isNotEmpty: boolean
	hasEDI: boolean
}
