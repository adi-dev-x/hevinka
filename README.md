# HEVINKA Website — Claude Code Kit

Everything Claude Code needs to build a premium, heavily animated website for HEVINKA Technologies in your brochure's look.

## What's inside
```
hevinka-claude-kit/
├── CLAUDE.md                     ← project rules Claude Code reads automatically
├── PROMPT.md                     ← the prompts to paste, phase by phase
├── .mcp.json                     ← Playwright browser so Claude can screenshot & check its own work
├── .claude/skills/
│   ├── hevinka-brand/            ← colours, fonts, logo, shapes, voice (+ tokens.css)
│   ├── cinematic-scroll-motion/  ← GSAP / ScrollTrigger / SplitText / Lenis / Motion patterns
│   ├── webgl-network-globe/      ← 3D glowing globe hero (React Three Fiber)
│   ├── premium-section-blueprints/ ← every page & section: layout + animation spec
│   └── launch-qa/                ← screenshots, Lighthouse, accessibility, SEO checks
├── content/site-content.md       ← all website copy, taken from your brochure
├── brand-reference/brochure-pages/ ← your 17 brochure pages as images
└── public/brand/                 ← logo reference crops
```

## Setup (5 minutes)
1. **Unzip** this folder where you want the website project to live, then open a terminal in it.
2. **Start Claude Code:** `claude`
3. **Install the official add-ons** (inside Claude Code):
   ```
   /plugin install frontend-design@claude-plugins-official
   /reload-plugins
   ```
   Then, in a normal terminal in the same folder, add GreenSock's official GSAP skills:
   ```
   npx skills add https://github.com/greensock/gsap-skills --agent claude-code
   ```
   (If the frontend-design command fails, run `/plugin marketplace add anthropics/claude-code` and then `/plugin install frontend-design@claude-code-plugins`.)
4. Approve the **Playwright** MCP server when Claude Code asks (it comes from `.mcp.json`).
5. Open `PROMPT.md` and paste **Prompt 1**. Go phase by phase (1 → 5) and review in the browser (`npm run dev` → http://localhost:3000) between phases.

## Tech stack chosen
Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · GSAP (all plugins now free) + ScrollTrigger + SplitText · Lenis smooth scroll · Motion · React Three Fiber (3D globe) · Vercel hosting.

## Colour theme (kept from the brochure, slightly evolved)
| Abyss | Navy | Midnight | Cobalt | Royal | Electric | Sky | Mist | + Ion (new glow) |
|---|---|---|---|---|---|---|---|---|
| `#000E21` | `#001C3D` | `#04224C` | `#0047A8` | `#0B5BD3` | `#00A8FC` | `#60A8E4` | `#F4F7FB` | `#7FE3FF` |

## Things to send Claude Code when you have them
- **Original logo as SVG** (Claude will otherwise recreate it from the brochure; have it approved).
- Real photos (office, team, projects) — otherwise blue-graded placeholders are used and listed in `content/IMAGE-TODO.md`.
- Client logos/testimonials, if you want those sections (nothing will be invented).

## Brochure typos (not carried onto the site)
The back page says "TECHNOLOGIES **PRIVIATE** LIMITED" and "**wwwhevinka.com**", and page 15 says "**JMC** Chambers". The site uses PRIVATE, www.hevinka.com and JC Chambers. You may want to fix the brochure too.
