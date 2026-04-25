# Körfest 2026 — webbplats

Astro + React-projekt. Ersätter Framer-versionen på struktiv.se/korfest.
Ska driftsättas på körfest.se via inleed.se (statisk hosting).

## Stack
- Astro 4 (output: static)
- React 18 (endast för RegistrationForm)
- CSS: custom properties, inga externa CSS-ramverk

## Färger & typografi
Alla CSS-variabler definieras i `src/styles/global.css`.
Typsnitt: Montserrat (Google Fonts), vikterna 300/500/600/700.

## Formulär
`RegistrationForm.tsx` skickar via formsubmit.co till perhansson@outlook.com.
Webhookurl för Google Sheets är valfri prop.
Redirect efter skickat formulär: `/anmald`

## Driftsättning
Bygg med `npm run build` → ladda upp `dist/`-mappen via FTP till inleed.se.
