# Realtor AI Landing Page

## Overview
Interactive landing page for Realtor AI with email waitlist functionality and engaging UI effects. The codebase is now organized into modular components for better maintainability.

## Features

### Core Components
- **Email Waitlist Form**: Validates email and collects user signups
- **Magnetic Form Effect**: Form subtly moves toward cursor for enhanced interactivity
- **Animated Grid Background**: Subtle animated grid pattern for visual depth
- **Attention Border**: Nav button triggers form highlighting
- **Loading States**: Smooth transitions and loading indicators

### Visual Design
- Clean, modern SaaS aesthetic suitable for Series A funding level
- Custom typography with Sora and Poppins fonts
- Responsive design with proper spacing and hierarchy
- Professional color scheme (#1c1348 primary, #e3e3e3 form background)

### User Experience
1. User lands on page with house background
2. Can interact with magnetic email form or nav button
3. Nav button draws attention to main form with pulse effect
4. Email validation with real-time feedback
5. Loading state during submission
6. Thank you page after successful signup

### Technical Implementation
- React hooks for state management
- Mouse tracking for interactive effects
- Email validation with regex
- Smooth CSS transitions and animations
- Modular component architecture

## File Structure
```
app/
├── components/
│   ├── email-input-form.tsx     # Email form with validation
│   ├── magnetic-form.tsx        # Magnetic container wrapper
│   ├── nav-button.tsx           # Top-right navigation button
│   ├── header-group.tsx         # Header with logo text and nav
│   ├── coastal-logo.tsx         # Coastal Elements logo image
│   ├── AnimatedGrid.tsx         # Animated grid background
│   ├── landing-page.tsx         # Main landing page layout
│   ├── thank-you-page.tsx       # Success confirmation page
│   └── svg-paths.ts            # SVG path definitions (legacy)
├── page.tsx                     # Main page entry point
├── layout.tsx                   # Updated with custom fonts
└── globals.css                  # Enhanced with custom styles
docs/
└── landing-page.md              # This documentation file
```

## Component Architecture

### Core Components
- **`EmailInputForm`**: The main email collection form with validation
- **`MagneticForm`**: Wrapper that adds magnetic mouse-following effect
- **`NavButton`**: Top-right button that triggers attention effects
- **`HeaderGroup`**: Contains site title and navigation elements
- **`CoastalLogo`**: Displays the company logo from images folder

### Effect Components
- **Magnetic Form Effect**: Form follows cursor movement for enhanced interactivity
- **Animated Grid**: Interactive grid with real estate data points, mini charts, and NYPictogram background

### Page Components
- **`LandingPage`**: Main landing view combining all elements
- **`ThankYouPage`**: Success state after email submission
- **`Home`**: Root component managing application state

### Component Hierarchy
```
Home (app/page.tsx)
├── AnimatedGrid (AnimatedGrid.tsx)
├── LandingPage (landing-page.tsx)
│   ├── Background Image
│   ├── MagneticForm (magnetic-form.tsx)
│   │   └── EmailInputForm (email-input-form.tsx)
│   ├── HeaderGroup (header-group.tsx)
│   │   ├── Site Title Text
│   │   └── NavButton (nav-button.tsx)
│   ├── CoastalLogo (coastal-logo.tsx)
│   ├── Main Title ("Realtor AI.")
│   └── Subtitle ("Coastal Elements Presents")
└── ThankYouPage (thank-you-page.tsx)
```

## Dependencies
- Next.js 14+
- React 18+
- Tailwind CSS
- Google Fonts (Sora, Poppins)

## Benefits of Modular Architecture
1. **Maintainability**: Each component has a single responsibility
2. **Reusability**: Components can be easily reused or modified
3. **Testing**: Individual components can be tested in isolation
4. **Code Organization**: Logical separation of concerns
5. **Collaboration**: Multiple developers can work on different components
6. **Bundle Optimization**: Better tree-shaking and code splitting

## Security & Performance
- Email validation on frontend
- Optimized animations with CSS transforms
- Responsive design for all screen sizes
- Accessibility-compliant interactions 