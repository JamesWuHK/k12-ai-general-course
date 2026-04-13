# K12 AI General Course

Standalone repository for the K12 AI general course introduction deck.

Repository structure:

- `project/`: editable Reveal.js + Vite source project
- `site/`: published static site and PDF deliverables for GitHub Pages

Live site:

- `https://jameswuhk.github.io/k12-ai-general-course/`
- `https://jameswuhk.github.io/k12-ai-general-course/school.html`
- `https://jameswuhk.github.io/k12-ai-general-course/institution.html`

PDF deliverables:

- `site/ai-course-intro-deck.pdf`
- `site/ai-course-intro-deck-school.pdf`
- `site/ai-course-intro-deck-institution.pdf`

Local development:

```bash
cd project
npm ci
npm run dev
```

Build the static site:

```bash
cd project
npm run build
```

Build the site and export all PDF versions:

```bash
cd project
npm run export:pdf:all
```
