import { useState, useEffect } from "react"

const LINKS = [
  { label: "Hem", link: "/", icon: true },
  { label: "Detaljer", link: "/detaljerna" },
  { label: "Tipsa andra", link: "/tipsa" },
  { label: "Anmälan", link: "/anmalan" },
  { label: "Musiken", link: "/musiken" },
  { label: "Om Messias", link: "/om" },
  { label: "Kontakt", link: "/kontakt" },
]

function HomeIcon({ color }: { color: string }) {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

export default function SideNav() {
  const [hovered, setHovered] = useState<number | null>(null)
  const [rightOffset, setRightOffset] = useState(50)

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      setRightOffset(w < 810 ? 8 : w < 1200 ? 16 : 50)
    }
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  return (
    <div style={{
      position: "fixed",
      right: `${rightOffset}px`,
      top: "50%",
      transform: "translateY(-50%)",
      zIndex: 9999,
      transition: "right 0.3s ease",
    }}>
      <div style={{
        backgroundColor: "rgba(0,0,0,0.25)",
        borderRadius: "20px",
        padding: "12px 10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}>
        {LINKS.map((item, i) => {
          const color = hovered === i ? "rgb(232, 160, 53)" : "rgba(255,255,255,0.7)"
          return (
            <a key={i} href={item.link}
              style={{
                textDecoration: "none",
                color,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: item.icon ? "6px" : "0px",
                writingMode: item.icon ? "horizontal-tb" : "vertical-rl",
                textOrientation: item.icon ? undefined : "mixed",
                transform: item.icon ? "none" : "rotate(180deg)",
                transition: "color 0.2s ease",
                cursor: "pointer",
                padding: "4px 2px",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                whiteSpace: "nowrap",
                fontSize: "10px",
                fontWeight: 500,
                fontFamily: "Montserrat, sans-serif",
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {item.icon && <HomeIcon color={color} />}
              {item.label}
            </a>
          )
        })}
      </div>
    </div>
  )
}
