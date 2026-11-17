const socialLinks = [
    {
        href: "https://github.com/Squishyguy10",
        label: "GitHub",
        icon: (
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2.5a9.5 9.5 0 0 0-3 18.52c.48.09.65-.21.65-.46v-1.67c-2.65.58-3.21-1.13-3.21-1.13-.43-1.1-1.06-1.4-1.06-1.4-.87-.6.07-.59.07-.59.96.07 1.47.99 1.47.99.85 1.46 2.22 1.04 2.76.8.09-.62.33-1.04.6-1.28-2.12-.24-4.35-1.06-4.35-4.72 0-1.04.37-1.89.99-2.56-.1-.24-.43-1.21.09-2.52 0 0 .8-.26 2.62.98A9.1 9.1 0 0 1 12 7.15c.8 0 1.6.11 2.35.31 1.82-1.24 2.62-.98 2.62-.98.52 1.31.19 2.28.1 2.52.61.67.98 1.52.98 2.56 0 3.67-2.23 4.48-4.36 4.72.34.3.65.88.65 1.77v2.61c0 .25.17.55.66.46A9.5 9.5 0 0 0 12 2.5Z" />
            </svg>
        ),
    },
    {
        href: "https://www.linkedin.com/in/aaron-yang-/",
        label: "LinkedIn",
        icon: (
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5.2 7.1a1.7 1.7 0 1 0 0-3.4 1.7 1.7 0 0 0 0 3.4ZM3.7 20.3h3V8.4h-3v11.9ZM8.6 8.4h2.9v1.63h.04c.4-.77 1.38-1.99 3.7-1.99 3.96 0 4.7 2.6 4.7 5.98v6.28h-3v-5.57c0-1.33-.03-3.03-1.84-3.03-1.84 0-2.12 1.44-2.12 2.93v5.67h-3V8.4Z" />
            </svg>
        ),
    },
    {
        href: "mailto:ayyang2006@gmail.com",
        label: "Email Aaron",
        icon: (
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3.5 5.5h17A1.5 1.5 0 0 1 22 7v10a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 2 17V7a1.5 1.5 0 0 1 1.5-1.5Zm.2 2.1 8.3 5.78 8.3-5.78V7l-8.3 5.77L3.7 7v.6Z" />
            </svg>
        ),
    },
];

export function SiteHeader() {
    return (
        <aside className="social-rail" aria-label="Social links">
            {socialLinks.map((link) => (
                <a
                    key={link.label}
                    className="social-rail-link"
                    href={link.href}
                    target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                    aria-label={link.label}
                >
                    {link.icon}
                </a>
            ))}
        </aside>
    );
}
