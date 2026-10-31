## Styling Guide --- Restaurant Website
This document defines the visual styling conventions used across the
restaurant website, including colors, typography, layout, imagery, and
motion.

1. Visual Direction
The website uses a refined, editorial restaurant aesthetic:
- Dark, nature-inspired backgrounds
- Warm gold accents
- Elegant serif headlines
- Quiet, readable body text
- Large food and restaurant photography
- Generous spacing and restrained decoration
- Lightweight motion that supports the content rather than distracting
  from it
The Hero and About sections share the same visual identity while using
different compositions.

######
2. Color Palette
Core colors
  Token                   Hex value                  Usage
  --color-page          #000000                  Outer page background

  --color-surface       #111512                  Hero and dark section
surfaces

  --color-about         #252B23                  Editorial About section
background

  --color-text          #FFFFFF                  Primary text on dark
surfaces

  --color-text-soft     #C1C2B7                  Paragraph text on olive
backgrounds

  --color-text-muted    rgba(255,255,255,0.55)   Secondary text

  --color-gold          #D9A34D                  Primary accent, labels,
buttons, details

  --color-orange        #D9823D                  Highlighted headline
text

  --color-gold-soft     #C5A66B                  About section accents
--color-border        rgba(255,255,255,0.10)   Subtle section borders

** Usage guidance **
- Use gold for small emphasis elements, buttons, labels, and selected
  headline words.
- Avoid using gold for large paragraph blocks.
- Use muted text colors for secondary descriptions.
- Keep borders subtle and low contrast.
- Use #111512 for contained dark panels and #252B23 for the
  full-width editorial About section.
Suggested CSS variables
:root {
  --color-page: #000000;
  --color-surface: #111512;
  --color-about: #252b23;

  --color-text: #ffffff;
  --color-text-soft: #c1c2b7;
  --color-text-muted: rgba(255, 255, 255, 0.55);

  --color-gold: #d9a34d;
  --color-orange: #d9823d;
  --color-gold-soft: #c5a66b;

  --color-border: rgba(255, 255, 255, 0.1);
}


3. Typography
Font families
The design uses two font categories:
  Role                    Font family             Usage
  Display                 Serif                   Hero headlines, About
headings, editorial
statements
Interface/body          Sans-serif              Paragraphs, buttons,
labels, navigation,
captions
Current Tailwind usage:
font-serif  → display headings and editorial text
default sans-serif → body copy and interface text
For a consistent production setup, define the actual font families in
the global stylesheet or Tailwind theme. Recommended direction:
- Display: a refined serif such as Cormorant Garamond, DM Serif
  Display, or Playfair Display
- Body: a clean sans-serif such as Inter, Manrope, or DM
  Sans
These are recommendations; use the font already configured in the
project if one exists.
Typography scale
  Element           Typical size           Weight / style    Notes
  Hero headline     3rem–4.5rem          Serif, regular    Responsive, tight
line height

  About main        2rem–4.5rem          Serif, regular    Editorial,
heading                                                    generous line
breaks

  Editorial menu    3rem–4.5rem          Serif, uppercase  Large visual
heading                                                    statement

  Section heading   1.5rem–2rem          Serif             Card or feature
titles

  Body text         0.875rem–1rem        Sans-serif,       Comfortable line
regular           height

  Eyebrow label     0.625rem             Sans-serif,       Wide tracking
semibold,
uppercase         

  Button text       0.625rem–0.6875rem   Sans-serif, bold, Letter spacing
uppercase         
Caption           0.5625rem–0.75rem    Sans-serif        Muted and compact
Typography rules
- Use serif typography for emotional, brand-focused headlines.
- Use sans-serif typography for readability and functional content.
- Keep headline line heights tight, typically 1.1–1.2.
- Body text should use a line height around 1.7–1.9.
- Eyebrow labels use uppercase text and wide letter spacing, typically
  0.25em–0.35em.
- Use italic serif text sparingly for accent phrases.
4. Layout and Spacing
Content width
- Main maximum width: 1440px
- Editorial content width: 1280px (max-w-7xl)
- Text blocks: generally max-w-xl or max-w-2xl
- Maintain centered content with mx-auto.
Spacing conventions
  Context                    Typical spacing
  Section vertical padding   5rem–8rem
Desktop section padding    6rem–9rem
Heading to paragraph       1.5rem
Paragraph spacing          1rem–1.5rem
Grid gap                   2rem–6rem
Eyebrow to heading         1.25rem–1.5rem

Use generous whitespace for the editorial About section. Avoid
compressing the content to match the denser Hero layout.
Section composition
- Hero: contained dark panel, rounded corners, two-column layout.
- About: full-width olive background, editorial asymmetry, no
  repeated hero card framing.
- Use section-specific composition while preserving shared colors and
  typography.
5. Borders, Shapes, and Decoration
- Hero outer container: approximately 30px corner radius.
- About section: full-width background without a rounded card
  container.
- Hero image: asymmetric rounded corner treatment.
- About photography: rectangular editorial crops.
- Borders: thin, low-opacity white or gold.
- Gold frames should be reserved for the Hero, not repeated in About.
- Decorative background shapes should remain low contrast and
  non-interactive.


6. Photography
Image direction
Use high-quality imagery that communicates:
- Freshly prepared food
- Restaurant atmosphere
- Chef or kitchen activity
- Ingredients and culinary details
- Table settings and dining experiences
Image treatment
- Use object-cover for consistent cropping.
- Prefer landscape photography for panoramic images.
- Use portrait crops for chef imagery.
- Avoid excessive overlays; use subtle gradients only when needed for
  text contrast.
- Keep image colors warm and natural to complement the olive and gold
  palette.
Image performance
- Use loading="lazy" for below-the-fold images.
- Use decoding="async" where appropriate.
- The Hero's main image may use high fetch priority because it appears
  above the fold.
- For production Next.js projects, consider next/image with
  configured image domains.
7. Buttons and Links
Primary button
Used for the Hero reservation action.
- Background: #D9A34D
- Text: white or dark text depending on contrast requirements
- Uppercase, bold, compact text
- Comfortable horizontal and vertical padding
- Hover: darker gold (#BD8736)
- Small arrow icon may be used as a directional cue
Secondary link
Used for editorial actions such as "View menu".
- Transparent background
- Gold text or white text with gold hover
- Thin border or underline
- Small uppercase label
- Subtle color transition
Interaction
Use a transition duration around 250–350ms for hover states. Avoid
large movement or strong scaling on buttons.



8. Animation and Motion
General principles
- Motion should be subtle, smooth, and purposeful.
- Prefer transform and opacity.
- Avoid animating layout properties such as width, height, margin, or
  padding.
- Use CSS transitions and the Web Animations/CSS animation
  capabilities already available; no animation library is required for
  the current sections.
Easing
cubic-bezier(0.16, 1, 0.3, 1)
This easing is used for smooth entrance and reveal animations.
Reveal animations
- Initial state: opacity 0, translateY around 20–28px.
- Visible state: opacity 1, transform reset.
- Duration: approximately 900–1300ms.
- Use staggered delays to reveal related elements sequentially.
- Trigger reveals with IntersectionObserver.
Scroll-based image fade
The About food image uses scroll progress to control:
- Opacity from 1 to 0
- Upward translation of approximately 70px
- Slight scale reduction of approximately 4–6%
The effect should span a long scroll distance for a slow, noticeable
fade.

Use requestAnimationFrame to throttle scroll updates and remove event
listeners during cleanup.
Reduced motion
Respect the user's motion preference:
@media (prefers-reduced-motion: reduce) {
  /* Disable transitions and transforms */
}
Elements should remain visible when animations are disabled.
9. Responsive Breakpoints
The current implementation follows Tailwind's responsive breakpoint
conventions.

  Breakpoint   Typical behavior
  Base         Mobile layout, stacked content
sm         Larger mobile and small tablet adjustments
md         Three-column philosophy layout
lg         Desktop multi-column compositions
xl         Larger display typography

Responsive requirements:
- Stack columns on narrow screens.
- Reduce heading sizes on mobile.
- Keep body text readable and line lengths controlled.
- Reduce image heights on mobile.
- Ensure decorative elements do not cause horizontal overflow.
- Maintain sufficient spacing between stacked content blocks.
10. Accessibility and Contrast
- Maintain readable contrast between text and backgrounds.
- Use meaningful alt text for content images.
- Mark purely decorative elements with aria-hidden="true".
- Use semantic headings and sections.
- Provide accessible names for icon-only links.
- Respect prefers-reduced-motion.
- Do not rely on color alone to communicate actions or information.
11. Styling Consistency Checklist
When adding a new section:
- [ ] Use the established dark, olive, and gold palette.
- [ ] Use serif typography for display headings.
- [ ] Use sans-serif typography for body and interface text.
- [ ] Keep accent gold limited to highlights and actions.
- [ ] Use generous spacing and controlled text widths.
- [ ] Make the section composition distinct from adjacent sections.
- [ ] Use responsive Tailwind classes.
- [ ] Prefer opacity and transform for animation.
- [ ] Respect reduced-motion preferences.
- [ ] Optimize images and provide descriptive alt text.
12. Notes
The values in this guide are based on the current Hero and About
implementation. Where a font family has not yet been explicitly
configured, the document describes the intended font category and
provides optional recommendations rather than assuming a specific
installed font.