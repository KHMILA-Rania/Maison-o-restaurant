# Technical Documentation
## Restaurant Website — Hero & About Sections

### 1. Project Overview

This document describes the implementation of the Hero and About sections of the restaurant website.

The objective is to create a modern, elegant, and responsive restaurant landing page using a dark visual identity, refined typography, high-quality photography, and lightweight animations.

The two sections have distinct visual purposes:

- **Hero:** Introduces the restaurant and encourages visitors to make a reservation.
- **About:** Presents the restaurant's story, culinary philosophy, chef, and menu through an editorial-style layout.

### 2. Technologies Used

| Technology | Purpose |
|---|---|
| React | Component-based UI development |
| TypeScript | Type safety and maintainability |
| Next.js | Application framework and client-side components |
| Tailwind CSS | Responsive styling and layout |
| CSS Animations | Reveal effects and transitions |
| React Hooks | DOM references and lifecycle management |
| Intersection Observer API | Detecting section visibility |
| RequestAnimationFrame | Smooth scroll-based animations |
| Unsplash | Placeholder photography |

### 3. Component Architecture

The sections are implemented as independent React components.

```text
src/
├── components/
│   ├── Hero.tsx
│   └── About.tsx
└── app/
    └── page.tsx
```

Each component manages its own structure, styling, and animations.

The homepage imports and renders the components in sequence:

```tsx
import Hero from "@/components/Hero"
import About from "@/components/About"

export default function Home() {
  return (
    <>
      <Hero />
      <About />
    </>
  )
}
```

### 4. Hero Section

#### 4.1 Purpose

The Hero section serves as the primary introduction to the restaurant. It highlights the dining experience and provides a direct reservation action.

#### 4.2 Layout

The section uses a two-column layout on desktop:

- Left column: introductory text, headline, description, reservation button, and supporting message.
- Right column: large food photograph with a decorative gold frame.

On mobile devices, the layout adapts to a vertically stacked structure.

#### 4.3 Main Elements

- Restaurant introduction label
- Main headline
- Short promotional description
- Reservation call-to-action
- Food photography
- Decorative image frame
- Scroll-to-About button
- Ambient background lighting

#### 4.4 Animations

| Animation | Description |
|---|---|
| Text reveal | Text elements appear with a vertical movement |
| Line reveal | Headline lines animate into view |
| Image entrance | Image fades in while moving upward and scaling |
| Frame reveal | Decorative frame slides into position |
| Background drift | Subtle movement of ambient lighting |
| Scroll parallax | Text and image move at different speeds during scrolling |
| Scroll indicator | Small vertical movement draws attention to the next section |

The scroll effect uses `requestAnimationFrame` to update transforms and opacity directly on DOM elements without triggering React re-renders.

### 5. About Section

#### 5.1 Purpose

The About section provides information about the restaurant's identity, culinary philosophy, and dining experience.

Unlike the Hero section, it uses an editorial layout inspired by restaurant brand storytelling.

#### 5.2 Visual Design

The section uses:

- Dark olive-green background
- Warm gold accent color
- Serif typography for headings
- Muted text for descriptions
- Large rectangular photography
- Asymmetrical content positioning
- Minimal decorative elements

The layout avoids repeating the Hero's rounded card and two-column promotional structure.

#### 5.3 Content Structure

**Upper section — Restaurant story**

- Chef or kitchen portrait
- Chef caption
- Restaurant introduction
- Culinary philosophy
- Supporting paragraphs
- Short signature statement

**Lower section — Menu introduction**

- Large editorial heading
- Menu description
- Link to the menu section
- Food photography with scroll-based fade-out

**Footer detail**

- Decorative divider
- Short restaurant brand statement

#### 5.4 Scroll Reveal Animation

The About section uses the `IntersectionObserver` API to detect when the section enters the viewport.

When the section becomes visible:

1. The section receives a visibility attribute.
2. Text elements transition from transparent to visible.
3. Elements move vertically into their final positions.
4. Staggered delays create a sequential reveal.
5. The observer disconnects after the initial reveal.

The animation uses CSS transitions based on opacity and transform.

#### 5.5 Scroll-Based Image Fade-Out

The lower food image includes a scroll-driven animation.

The effect is implemented using:

- `useRef` to access the image wrapper
- `useEffect` to register and clean up event listeners
- `requestAnimationFrame` to schedule visual updates
- `getBoundingClientRect()` to determine image position
- CSS custom properties to control opacity, translation, and scale

As the user scrolls:

- The image gradually fades out.
- The image moves slightly upward.
- The image scales down subtly.
- The animation progresses smoothly over an extended scroll distance.

The effect is isolated to the image wrapper so it does not interfere with the text reveal animations.

### 6. Responsive Design

Both components use Tailwind CSS responsive breakpoints.

| Screen size | Layout behavior |
|---|---|
| Mobile | Stacked content, reduced typography, smaller image heights |
| Tablet | Flexible spacing and adjusted image proportions |
| Desktop | Multi-column layouts and larger typography |
| Large desktop | Maximum content width and expanded spacing |

Responsive classes include:

- `sm:` for small screens and above
- `md:` for medium screens and above
- `lg:` for desktop layouts
- `xl:` for larger typography

Images use `object-cover` to maintain visual proportions.

### 7. Performance Optimization

The implementation prioritizes lightweight animations and efficient rendering.

- CSS transitions are used instead of animation libraries.
- Scroll animations use `requestAnimationFrame`.
- Passive scroll listeners improve scrolling responsiveness.
- Intersection Observer limits when reveal animations are triggered.
- Animation updates use direct DOM style properties instead of React state.
- Images use lazy loading and asynchronous decoding where appropriate.
- No continuous scroll animation is applied to every section element.

The Hero's ambient background drift is limited to a single decorative element.

### 8. Accessibility

The components include accessibility considerations:

- Descriptive `alt` attributes for meaningful images
- Semantic section elements
- Proper heading hierarchy
- Accessible labels for icon-only navigation links
- Reduced-motion support using `prefers-reduced-motion`
- Standard anchor links for section navigation

When reduced motion is enabled, animations are disabled or simplified.

### 9. Navigation and Integration

The Hero section includes a reservation link:

```tsx
<a href="#reservation">
  Book Your Table
</a>
```

The About section includes a menu link:

```tsx
<a href="#menu">
  View Menu
</a>
```

These links depend on the corresponding sections being present in the homepage with matching IDs.

### 10. Future Improvements

Potential enhancements include:

- Replace placeholder photography with restaurant-specific images.
- Add real chef information and restaurant history.
- Connect the reservation button to the reservation system.
- Implement a dedicated menu component.
- Optimize images using Next.js Image.
- Add content management capabilities for restaurant information.
- Improve SEO using structured metadata and restaurant schema.
- Add analytics to measure reservation button interactions.

### 11. Conclusion

The Hero and About sections establish the restaurant website's visual identity and provide the foundation for the homepage.

The Hero focuses on visual impact and reservation conversion, while the About section communicates the restaurant's story through an editorial design.

Both components are modular, responsive, and optimized for lightweight animations, allowing future sections to be developed independently while maintaining a consistent visual identity.