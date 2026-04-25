import { useState, useCallback, startTransition } from "react"
import type { CSSProperties } from "react"

const RECIPIENT = "perhansson@outlook.com"
const REDIRECT  = "/anmald"

function generateCaptcha() {
  const a = Math.floor(Math.random() * 10) + 1
  const b = Math.floor(Math.random() * 10) + 1
  return { a, b, answer: a + b }
}

export default function RegistrationForm({ webhookUrl = "" }: { webhookUrl?: string }) {
  const [formData, setFormData] = useState({ name: "", email: "", stemma: "", kor: "" })
  const [captchaInput, setCaptchaInput] = useState("")
  const [captcha, setCaptcha] = useState(generateCaptcha)
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle")
  const [captchaError, setCaptchaError] = useState(false)

  const handleChange = useCallback((field: string, value: string) => {
    startTransition(() => {
      setFormData(prev => ({ ...prev, [field]: value }))
      setCaptchaError(false)
    })
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (parseInt(captchaInput) !== captcha.answer) {
      startTransition(() => {
        setCaptchaError(true)
        setCaptcha(generateCaptcha())
        setCaptchaInput("")
      })
      return
    }
    startTransition(() => setStatus("sending"))
    try {
      const body = new FormData()
      body.append("Namn", formData.name)
      body.append("E-post", formData.email)
      body.append("Stämma", formData.stemma)
      body.append("Kör", formData.kor || "(ej angiven)")
      body.append("_subject", "Ny föranmälan till Körfest 2026")
      body.append("_captcha", "false")
      body.append("_template", "table")

      const emailRes = await fetch(`https://formsubmit.co/ajax/${RECIPIENT}`, { method: "POST", body })

      if (webhookUrl) {
        fetch(webhookUrl, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            namn: formData.name, epost: formData.email,
            stamma: formData.stemma, kor: formData.kor || "",
            datum: new Date().toISOString(),
          }),
        })
      }

      if (emailRes.ok) {
        window.location.href = REDIRECT
      } else {
        startTransition(() => setStatus("error"))
      }
    } catch {
      startTransition(() => setStatus("error"))
    }
  }, [formData, captchaInput, captcha, webhookUrl])

  const base: CSSProperties = {
    width: "100%", padding: "14px 16px",
    border: "1px solid rgba(255,255,255,0.15)", borderRadius: "6px",
    color: "rgba(255,255,255,0.9)", outline: "none", boxSizing: "border-box",
    fontFamily: "inherit", fontSize: "15px", fontWeight: 300,
    transition: "border-color 0.2s, background-color 0.3s",
  }
  const filled = (v: string): CSSProperties => ({
    ...base,
    backgroundColor: v.trim() ? "rgba(232,160,53,0.12)" : "rgba(255,255,255,0.08)",
  })
  const label: CSSProperties = {
    display: "block", marginBottom: "6px",
    color: "rgba(255,255,255,0.7)",
    fontSize: "11px", fontWeight: 600,
    letterSpacing: "0.08em", textTransform: "uppercase",
  }
  const focus = (e: React.FocusEvent<HTMLElement>) => {
    (e.currentTarget as HTMLElement).style.borderColor = "rgb(232,160,53)"
  }
  const blur = (e: React.FocusEvent<HTMLElement>) => {
    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)"
  }

  return (
    <form onSubmit={handleSubmit} autoComplete="on" style={{
      width: "100%", display: "flex", flexDirection: "column", gap: "28px",
      padding: "32px 28px", backgroundColor: "rgba(255,255,255,0.04)",
      borderRadius: "12px", border: "1px solid rgba(255,255,255,0.15)", boxSizing: "border-box",
    }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label style={label}>Namn *</label>
        <input type="text" name="name" autoComplete="name" required value={formData.name}
          onChange={e => handleChange("name", e.target.value)}
          style={filled(formData.name)} onFocus={focus} onBlur={blur} />
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <label style={label}>E-post *</label>
        <input type="email" name="email" autoComplete="email" required value={formData.email}
          onChange={e => handleChange("email", e.target.value)}
          style={filled(formData.email)} onFocus={focus} onBlur={blur} />
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <label style={label}>Min stämma *</label>
        <select required value={formData.stemma}
          onChange={e => handleChange("stemma", e.target.value)}
          style={{
            ...filled(formData.stemma), appearance: "none",
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='rgba(255,255,255,0.5)' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", paddingRight: "40px",
          }}
          onFocus={focus} onBlur={blur}>
          <option value="" disabled></option>
          <option value="Sopran">Sopran</option>
          <option value="Alt">Alt</option>
          <option value="Tenor">Tenor</option>
          <option value="Bas">Bas</option>
        </select>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <label style={label}>Min kör (om jag sjunger i en)</label>
        <input type="text" name="organization" autoComplete="organization" value={formData.kor}
          onChange={e => handleChange("kor", e.target.value)}
          style={filled(formData.kor)} onFocus={focus} onBlur={blur} />
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <label style={{ ...label, borderColor: captchaError ? "rgb(220,80,80)" : undefined }}>
          Verifiering: Vad är {captcha.a} + {captcha.b}? *
        </label>
        <input type="number" required value={captchaInput} autoComplete="off"
          onChange={e => { startTransition(() => { setCaptchaInput(e.target.value); setCaptchaError(false) }) }}
          style={{ ...filled(captchaInput), borderColor: captchaError ? "rgb(220,80,80)" : "rgba(255,255,255,0.15)" }}
          onFocus={focus}
          onBlur={e => { e.currentTarget.style.borderColor = captchaError ? "rgb(220,80,80)" : "rgba(255,255,255,0.15)" }} />
        {captchaError && <p style={{ color: "rgb(220,80,80)", margin: "8px 0 0", fontSize: "13px" }}>Fel svar, försök igen.</p>}
      </div>

      <button type="submit" disabled={status === "sending"} style={{
        width: "100%", padding: "16px 48px",
        backgroundColor: status === "sending" ? "rgba(232,160,53,0.6)" : "rgb(232,160,53)",
        color: "rgb(13,21,32)", border: "none", borderRadius: "6px",
        cursor: status === "sending" ? "wait" : "pointer",
        fontFamily: "inherit", fontSize: "13px", fontWeight: 700,
        letterSpacing: "0.12em", textTransform: "uppercase",
        transition: "transform 0.2s, opacity 0.2s", marginTop: "8px",
      }}
        onMouseEnter={e => { if (status !== "sending") e.currentTarget.style.transform = "scale(1.02)" }}
        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)" }}>
        {status === "sending" ? "Skickar..." : "Föranmäl dig"}
      </button>

      {status === "error" && (
        <p style={{ color: "rgb(220,80,80)", textAlign: "center", fontSize: "14px" }}>
          Något gick fel. Försök igen eller kontakta korfest@struktiv.se
        </p>
      )}

      <input type="text" name="_honey" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />
      <style>{`
        select option { background-color: rgb(13,21,32); color: rgba(255,255,255,0.9); }
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; }
        input[type="number"] { -moz-appearance: textfield; }
      `}</style>
    </form>
  )
}
