# Case Study: HireTrack Modern Recruiter Pipeline

A short write-up detailing the problem, our technical approach, the results, and key learnings from developing and polishing the HireTrack Applicant Tracking System (ATS).

---

## 1. The Problem
Recruitment teams need a fast, intuitive interface to register candidates, move them through hiring stages, schedule interviews, and evaluate performance via star-rated scorecards. 

During user testing, two major layout issues were identified on mobile viewports:
1. **Sticky Hamburger Navbar**: When clicking navigation links inside the mobile hamburger sidebar, the page navigated successfully but the overlay menu remained open. Users had to manually tap the backdrop to close it.
2. **Theme Legibility Issues**: The customized branding footer logo text was rendered in white, making it completely invisible when the application was in Light Theme mode.
3. **Sluggish Mobile Feedback**: Slow data queries during page transitions on mobile left the user in a state of uncertainty, requiring a clear, instant visual transition behavior.

---

## 2. The Approach

### Instant Navigation Close & Viewport Transition
Rather than listening to delayed page load events, we modified the `Sidebar` and `Topbar` relationship:
- Introduced an optional `onClose` callback hook to the `Sidebar` component.
- Implemented `onClick` intercepts on all `<Link>` components in the navigation menu.
- Passed `onClose={() => setIsOpen(false)}` from the mobile `Sheet` container in `Topbar`.
- Now, clicking a link instantly closes the sheet overlay, revealing the main layout which automatically displays the native Next.js `loading.tsx` skeleton loader during transition.

### Cross-Theme Branding Filter
To resolve the light mode logo visibility issue without introducing duplicate image assets or complex JS theme hooks:
- Standardized on a single, high-quality transparent asset `/digital.png`.
- Applied Tailwind CSS filters: `invert dark:invert-0`.
- In **Light Mode**, the white text in `/digital.png` is inverted to solid black (perfect contrast against white backgrounds).
- In **Dark Mode**, the inversion is bypassed (`dark:invert-0`), preserving the original white color.

### Clean Footer Layout Architecture
- Wrapped the main page content inside a CSS flex container (`flex flex-col min-h-screen`).
- Set the main wrapper to `flex-1` and the footer to `mt-auto`.
- This ensures the footer rests perfectly at the bottom of short pages, but flows naturally underneath on scrollable pages.

---

## 3. The Result
- **Seamless Mobile UX**: Tapping sidebar links on mobile now closes the sidebar overlay instantly and provides immediate visual feedback.
- **Flawless Contrast**: The "Made for digital.heroes" footer renders in a crisp, readable brand green (`text-emerald-600 dark:text-emerald-400`) and the logo adapts perfectly across both theme modes.
- **Production Grade Quality**: Run linter and build check validations are clean with `0 errors` and fully optimized static page generation.

---

## 4. What We Learned
- **Next.js Route Interception**: Leveraging React's concurrent navigation by coupling click intercepts with standard page suspense boundaries is much faster and cleaner than managing global router loading state hooks.
- **CSS-Only Theme Adaptability**: Simple filters like `invert` are incredibly powerful for adjusting transparent branding logos across light/dark modes without generating additional network payload.
- **Flexbox Positioning**: Sticking layout footers cleanly to the bottom using `mt-auto` and `flex-col` keeps layouts extremely stable, preventing jumps on dynamic page hydration.
