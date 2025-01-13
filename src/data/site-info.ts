export type SocialLink = {
	text: string
	icon: string
	href: string
	platform: string
	footerOnly?: boolean
}

export type HeaderLink = {
	label: string
	href: string
	isAnchor?: boolean
}

export type SiteInfo = {
	url: string
	name: string
	title: string
	description: string
	image: {
		src: string
		alt: string
	}
	rss?: boolean
	socialLinks: SocialLink[]
	headerLinks: HeaderLink[]
}

const headerLinks: HeaderLink[] = [{ label: "首页", href: "/" }]

const siteInfo: SiteInfo = {
	url: "https://astro-cn.com",
	name: "Astro 中文社区",
	title: "Astro 中文社区",
	description: "Astro 中文社区",
	image: {
		src: "/og.jpg",
		alt: "Astro 中文社区",
	},
	rss: false,
	socialLinks: [
		{
			platform: "twitter",
			icon: "social/twitter",
			href: "https://x.com/liruifengv",
			text: "在 Twitter 上关注我们",
		},
	],
	headerLinks,
}

export default siteInfo
