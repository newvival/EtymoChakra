# EtymoChakra

A React component library featuring **ResultsDisplay** - a beautiful, themed markdown renderer with chakra-inspired styling and dynamic glow effects.

## Features

- **Themed Display**: Dynamic color themes with custom glow effects
- **Markdown Rendering**: Supports headings, bullet points, and bold text
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **TypeScript**: Full type safety and IntelliSense support
- **Modern Stack**: Built with React 18, Vite, and Tailwind CSS

## Project Structure

```
EtymoChakra/
├── src/
│   ├── components/
│   │   ├── ResultsDisplay.tsx    # Main component
│   │   └── index.ts              # Component exports
│   ├── types.ts                  # TypeScript type definitions
│   ├── App.tsx                   # Demo application
│   ├── main.tsx                  # React entry point
│   └── index.css                 # Global styles
├── index.html                    # HTML entry point
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── vite.config.ts                # Vite build configuration
├── tailwind.config.js            # Tailwind CSS configuration
└── postcss.config.js             # PostCSS configuration
```

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn/pnpm

### Installation

```bash
# Install dependencies
npm install

# Or with yarn
yarn install

# Or with pnpm
pnpm install
```

### Development

```bash
# Start development server
npm run dev

# The app will be available at http://localhost:5173
```

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Usage

### Basic Example

```tsx
import { ResultsDisplay } from './components';
import { ChakraTheme } from './types';

const theme: ChakraTheme = {
  tw: 'purple',    // Tailwind color name
  hex: '#a855f7'   // Hex color for glow effect
};

const content = `### Example Heading

This is a paragraph with **bold text**.

* First bullet point
* Second bullet point with **emphasis**
* Third bullet point`;

function MyComponent() {
  return <ResultsDisplay result={content} theme={theme} />;
}
```

### Supported Markdown Syntax

The ResultsDisplay component currently supports:

- **Headings**: Lines starting with `### ` (H3)
- **Bullet Lists**: Lines starting with `* `
- **Bold Text**: Text wrapped in `**` (e.g., `**bold**`)
- **Paragraphs**: Regular text lines

### Theme Configuration

Create custom themes by providing:

```tsx
const customTheme: ChakraTheme = {
  tw: 'emerald',    // Used for text color (text-{tw}-400)
  hex: '#10b981'    // Used for glow effects (CSS variable)
};
```

Available Tailwind colors: purple, blue, emerald, rose, amber, cyan, etc.

## Component Props

### ResultsDisplay

| Prop | Type | Description |
|------|------|-------------|
| `result` | `string` | Markdown-formatted text to display |
| `theme` | `ChakraTheme` | Theme configuration object |

### ChakraTheme Type

```typescript
interface ChakraTheme {
  tw: string;   // Tailwind color name
  hex: string;  // Hex color code for glow effects
}
```

## Styling

The component uses Tailwind CSS with custom configurations:

- Dark theme with slate colors
- Responsive padding (p-6 on mobile, p-8 on larger screens)
- CSS custom properties for dynamic theming
- Drop shadows and glow effects

## Technologies

- **React 18.2**: UI library
- **TypeScript 5.2**: Type safety
- **Vite 5.0**: Build tool and dev server
- **Tailwind CSS 3.4**: Utility-first CSS framework
- **PostCSS & Autoprefixer**: CSS processing

## Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Lint code with ESLint

## Browser Support

- Modern browsers with ES2020 support
- Chrome/Edge 88+
- Firefox 78+
- Safari 14+

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## Roadmap

Future enhancements may include:

- [ ] Support for additional markdown features (links, code blocks, images)
- [ ] Animation options for content transitions
- [ ] Customizable styling props
- [ ] Accessibility improvements
- [ ] Unit tests and E2E tests
- [ ] Storybook integration
- [ ] NPM package publication

## Demo

The included demo application showcases three chakra-themed examples:

1. Root Chakra (Purple theme)
2. Throat Chakra (Blue theme)
3. Heart Chakra (Emerald theme)

Run `npm run dev` to see it in action!
