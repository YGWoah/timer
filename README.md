# FocusTimer - Productivity Timer Application

A simple, effective focus timer designed to help you track your work sessions and boost productivity. Built with React, TypeScript, and Firebase.

## Features

- **Focus Session Tracking**: Set topics and track your focused work time
- **User Authentication**: Secure login with Google authentication
- **Session History**: View detailed analytics of your productivity patterns
- **Real-time Timer**: Live timer updates in browser tab title
- **Data Persistence**: Your sessions are saved and synced across devices
- **Responsive Design**: Works great on desktop and mobile devices

## Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Backend**: Firebase (Authentication & Firestore)
- **Build Tool**: Vite
- **Charts**: Recharts for analytics visualization
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. Clone the repository
```bash
git clone https://github.com/YGWoah/timer.git
cd timer
```

2. Install dependencies
```bash
pnpm install
# or
npm install
```

3. Set up Firebase configuration
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Authentication with Google provider
   - Create a Firestore database
   - Copy your Firebase config to `src/firebase.ts`

4. Start the development server
```bash
pnpm dev
# or
npm run dev
```

### Build for Production

```bash
pnpm build
# or
npm run build
```

## Usage

1. **Sign In**: Use Google authentication to create an account
2. **Start Timer**: Set a topic for your focus session and start timing
3. **Track Progress**: Monitor your time in real-time
4. **Save Sessions**: Complete sessions are automatically saved
5. **View Analytics**: Check your productivity patterns in the Sessions page

## Project Structure

```
src/
├── components/         # Reusable UI components
├── context/           # React context providers
├── entities/          # TypeScript type definitions
├── lib/              # Utility functions
├── pages/            # Main application pages
├── services/         # API and data services
└── utils/            # Helper functions
```

## SEO & Performance

- Semantic HTML structure with proper ARIA labels
- Meta tags for social media sharing
- Structured data (JSON-LD) for search engines
- Progressive Web App (PWA) support
- Optimized loading states and error handling

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue on GitHub or contact the development team.

---

Built with ❤️ for productivity enthusiasts
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## Added: Router + Google-only Auth pages

This project now includes a simple router with two pages: `Login` and `Signup`, and a minimal Firebase helper for Google-only authentication.

Quick setup:

1. Install new dependencies:

```bash
npm install
```

2. Replace the placeholders in `src/firebase.ts` with your Firebase project's config (apiKey, authDomain, projectId).

3. Start the dev server:

```bash
npm run dev
```

Notes:
- The Google sign-in uses Firebase Authentication with popup flow.
- `Login` and `Signup` pages both trigger Google sign-in (signup is the same flow for Google-only onboarding).

Environment variables for Firebase
----------------------------------

Create a local env file by copying `.env.example` to `.env.local` and filling in your Firebase project's values. Vite will expose these to the client because they start with `VITE_`.

Example:

```
cp .env.example .env.local
# then edit .env.local and add your Firebase credentials
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
