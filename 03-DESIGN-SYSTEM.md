# 🎨 Design System — Midnight Aubergine

The visual language of Agent OS.

Drop these tokens into any Next.js dashboard.

You'll have the same look in 30 seconds.

---

## 🪶 The four voices

Every piece of text uses one of four fonts. No exceptions.

**Bricolage Grotesque** → every heading, every page title.

Weight 500. Letter-spacing -0.025em to -0.035em.

**Manrope** → every body line, button label, small-caps tag.

Weights 300, 400, 500, 600, 700.

**Caveat** (hand-script) → every gold roman numeral, every accent number, every italic emphasis word inside a heading.

Weight 500. Always non-italic — Caveat is naturally hand-drawn.

**JetBrains Mono** → every path, every code block, every model ID.

Weights 400, 500, 600.

---

## 🎨 The palette

Midnight Aubergine background.

Cream foreground.

Gold accents.

```css
/* Backgrounds (warm darks) */
--bg-deep:    #15101a;
--bg-mid:     #1c1622;
--bg-card:    #251d2c;
--bg-elev:    #2e2436;

/* Text (cream, never pure white) */
--cream:      #f3ebda;
--cream-soft: #ddd0bb;
--cream-dim:  #a59783;
--cream-mute: #6e6353;

/* Gold (accent) */
--gold:       #d4a574;
--gold-soft:  #e6c69a;
--gold-deep:  #a87f54;

/* Status colours */
--emerald:    #5ab896;  /* good / online */
--plum:       #c4607e;  /* bad / error */
--rust:       #c97c5e;  /* secondary accent */

/* Lines + shadows (gold-tinted, low opacity) */
--line:       rgba(212, 165, 116, 0.20);
--line-soft:  rgba(243, 235, 218, 0.08);
--shadow-1:   0 1px 0 rgba(243, 235, 218, 0.03), 0 8px 24px rgba(0,0,0,0.5);
--shadow-2:   0 2px 0 rgba(243, 235, 218, 0.04), 0 20px 60px rgba(0,0,0,0.55);
```

---

## 📄 Paper-grain overlay

Every page has subtle paper-grain noise + warm ambient gradients.

Drop this on `<body>`:

```css
body {
  background: var(--bg-deep);
  position: relative;
}

/* Paper-grain noise — fixed, low-opacity, blended */
body::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.95  0 0 0 0 0.9  0 0 0 0 0.85  0 0 0 0.035 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
  opacity: 0.55;
  mix-blend-mode: overlay;
}

/* Warm ambient gradients */
body::after {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background:
    radial-gradient(ellipse 65% 45% at 12% 6%, rgba(212, 165, 116, 0.09), transparent 60%),
    radial-gradient(ellipse 55% 40% at 88% 22%, rgba(201, 124, 94, 0.07), transparent 60%),
    radial-gradient(ellipse 70% 50% at 50% 95%, rgba(196, 96, 126, 0.06), transparent 60%);
}

main, header, aside, nav { position: relative; z-index: 2; }
```

---

## 🎭 The eyebrow pattern

Every page section starts with one:

`I. ───── CHAPTER LABEL`

The roman numeral is Caveat gold.

The line is gold at 60% opacity.

The label is small-caps Manrope.

```html
<div class="eyebrow">
  <span class="num">I.</span>
  <span class="line"></span>
  <span class="label">Mission Control</span>
</div>
```

```css
.eyebrow { display: inline-flex; align-items: center; gap: 14px; margin-bottom: 18px; }
.eyebrow .num { font-family: 'Caveat', cursive; font-weight: 500; font-size: 1.4rem; color: var(--gold); line-height: 0.9; }
.eyebrow .line { width: 32px; height: 1px; background: var(--gold); opacity: 0.6; }
.eyebrow .label { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 0.72rem; letter-spacing: 0.22em; text-transform: uppercase; color: var(--cream-dim); }
```

---

## 🎬 Section dividers

Between major sections — `✦` ornament with gold rules either side.

```html
<div class="divider">
  <span class="rule"></span>
  <span class="ornament">✦</span>
  <span class="rule"></span>
</div>
```

```css
.divider { display: flex; align-items: center; justify-content: center; margin: 70px 0; gap: 24px; }
.divider .ornament { color: var(--gold); opacity: 0.7; font-family: 'Caveat', cursive; font-size: 1.6rem; }
.divider .rule { flex: 1; height: 1px; background: var(--line); max-width: 160px; }
```

---

## 📐 Rules of thumb

1. Every gold accent number → Caveat
2. Every heading → Bricolage Grotesque 500
3. Every body line → Manrope
4. Every path / code → JetBrains Mono
5. Borders are gold-tinted, not white
6. Shadows are warm + subtle, not pure black
7. Status: emerald = good, gold = warning, plum = bad
8. Use `✦` dividers between major page sections

That's it.

Same look, every page.

Member sees one screen → understands the whole product.

---

## 📂 Drop-in files

In this pack:

`design/tokens.css` → the full token set + component primitives
`design/fonts.html` → the Google Fonts links to paste in your `<head>`

Drop both into your project. Refresh. You're done.
