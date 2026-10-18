# Synotix Website — Ausgangsstand Port 3120

Eigenstaendiger Export der bestehenden Synotix-Webseite. Kein neues Design.

## Herkunft

- Quelle: `Webseite/Synotix-Demo` im lokalen Beratungsmodell-Checkout
- Ursprungscommit: `df3bfd0f7cbf70d672763fcc280c3c15588e87e1`
- Export: 2026-10-18
- Die Hauptueberschrift dieses Quellstands entspricht der auf Port 3120 geprueften Seite:
  „Erst verstehen wir Ihre Abläufe. Dann bauen wir, was Ihr Betrieb braucht.“
- Spaetere, abgelehnte Designaenderungen sind nicht enthalten.
- Der Export enthaelt Quellcode, keine laufende Serverinstanz und keine Build-Artefakte.

## Stack

Next.js 15, React 19, TypeScript, Tailwind CSS 4, Motion.

## Lokal starten

```bash
npm ci --legacy-peer-deps
npm run dev
```

Standard-Port: 3000. Wenn Port 3120 frei ist:

```bash
npx next dev --port 3120
```

## Pruefen

```bash
npm run lint
npm run build
npm run test:contact
```

Keine `.env`-Dateien, Zugangsdaten, `node_modules` oder `.next`-Artefakte enthalten.
Kontaktversand, KI-Schnittstellen und andere externe Dienste benoetigen eine separate
Konfiguration. Dieses Repository wurde nicht auf einer oeffentlichen Website deployed.
