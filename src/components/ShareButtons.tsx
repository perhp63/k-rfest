import { useState, useCallback } from "react"

const ICONS: Record<string, string> = {
  email:    `<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>`,
  whatsapp: `<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>`,
  facebook: `<path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>`,
  linkedin: `<path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>`,
  sms:      `<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>`,
  copy:     `<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>`,
}

const LABELS: Record<string, string> = {
  email: "E-post", whatsapp: "WhatsApp", facebook: "Facebook",
  linkedin: "LinkedIn", sms: "SMS", copy: "Kopiera",
}

const SHARE_URL = "https://www.struktiv.se/korfest"
const SUBJECT   = "Körfest i Stockholm"
const BODY      = `Hej\n\nHär kommer ett tips om ett kul event på Nationaldagskvällen, som jag kanske tänkte vara med på. En fest för körsångare där man dricker öl eller vin och sjunger Händels Messias - kan det vara något för dig?\n\n${SHARE_URL}`

export default function ShareButtons() {
  const [hovered, setHovered]   = useState<string | null>(null)
  const [copied,  setCopied]    = useState(false)

  const encodedSubject = encodeURIComponent(SUBJECT)
  const encodedBody    = encodeURIComponent(BODY)
  const encodedUrl     = encodeURIComponent(SHARE_URL)

  const links: Record<string, string> = {
    email:    `mailto:?subject=${encodedSubject}&body=${encodedBody}`,
    whatsapp: `https://wa.me/?text=${encodedBody}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    sms:      `sms:?&body=${encodedBody}`,
  }

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(`${SUBJECT}\n\n${BODY}`)
    } catch {
      const ta = document.createElement("textarea")
      ta.value = `${SUBJECT}\n\n${BODY}`
      document.body.appendChild(ta)
      ta.select()
      document.execCommand("copy")
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [])

  const platforms = ["email", "sms", "copy", "whatsapp", "facebook", "linkedin"]

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "16px",
      justifyItems: "center",
      maxWidth: "280px",
      margin: "0 auto",
    }}>
      {platforms.map(platform => {
        const isHov   = hovered === platform
        const isCopy  = platform === "copy"
        const color   = isHov ? "rgb(232,160,53)" : "rgba(255,255,255,0.6)"
        const label   = isCopy && copied ? "Kopierat!" : LABELS[platform]

        const inner = (
          <div
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
              cursor: "pointer",
              transform: isHov ? "scale(1.1)" : "scale(1)",
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={() => setHovered(platform)}
            onMouseLeave={() => setHovered(null)}
          >
            <div style={{
              width: "40px", height: "40px", borderRadius: "50%",
              backgroundColor: isHov ? "rgba(232,160,53,0.15)" : "rgba(255,255,255,0.06)",
              border: `1px solid ${isHov ? "rgb(232,160,53)" : "rgba(255,255,255,0.12)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s ease",
            }}>
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none"
                stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                dangerouslySetInnerHTML={{ __html: ICONS[platform] }}
              />
            </div>
            <span style={{
              color: isHov ? "rgb(232,160,53)" : "rgba(255,255,255,0.45)",
              fontSize: "10px", fontFamily: "Montserrat, sans-serif",
              fontWeight: 500, letterSpacing: "0.05em",
              textTransform: "uppercase", whiteSpace: "nowrap",
              transition: "color 0.2s ease",
            }}>
              {label}
            </span>
          </div>
        )

        if (isCopy) {
          return (
            <div key={platform} onClick={handleCopy} role="button" tabIndex={0}
              onKeyDown={e => e.key === "Enter" && handleCopy()}>
              {inner}
            </div>
          )
        }

        return (
          <a key={platform} href={links[platform]}
            target="_blank" rel="noopener noreferrer"
            style={{ textDecoration: "none" }}>
            {inner}
          </a>
        )
      })}
    </div>
  )
}
