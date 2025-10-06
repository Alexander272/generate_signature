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
	hasWhatsApp?: boolean
	hasTelegram?: boolean

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
	hasLinks: boolean
	linksTitle: string
	column: number
	links: IFooterLink[]
}
// export interface IFooterLinks {
// 	title: string
// 	data: IFooterLink[]
// }
export interface IFooterLink {
	label: string
	imageLink: string
	link: string
}
