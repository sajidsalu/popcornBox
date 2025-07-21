🍿 PopcornBox

PopcornBox is a movie and TV show listing application built with React, TypeScript, and Vite. It features real-time data from the TMDB API, internationalization, dark/light themes, accessibility, and responsive design.

🚀 Tech Stack
React + TypeScript

Vite (super fast dev server)

React Query for API state

Redux Toolkit for global state (theme, favorites)

Material UI for modern responsive UI

React Router DOM for routing

i18next for internationalization (i18n)

Jest (for future unit tests)

TMDB API for fetching movie and TV data

🔧 Features
🎬 Movie & TV show listing with categories:

Top 10 this week

Fan favorites

Coming soon

💡 Toggle between light and dark theme

🔍 Search with instant feedback

❤️ Add/remove favorites (persistent)

🌐 Multi-language support: English 🇺🇸, French 🇫🇷, Spanish 🇪🇸

🧭 Sidebar with navigation and language selector

📱 Fully responsive with scrollable horizontal lists

🧪 ESLint with type-aware rules & React best practices

🛠️ Development Setup
bash
Copy
Edit
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build locally
npm run preview
📦 ESLint Setup (optional advanced)
To enable type-aware linting, you can use:

ts
Copy
Edit
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.app.json', './tsconfig.node.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
Add React-specific linting with:

ts
Copy
Edit
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

extends: [
  reactX.configs['recommended-typescript'],
  reactDom.configs.recommended,
]
🌍 Environment Variables
To run in production (e.g., Vercel/Netlify), make sure to set:

ini
Copy
Edit
VITE_API_URL=https://api.themoviedb.org/3
VITE_API_KEY=your_tmdb_api_key



<img width="1843" height="1093" alt="Screenshot from 2025-07-21 19-12-06" src="https://github.com/user-attachments/assets/4fd3b72d-e72c-4c97-8778-74a9bf2ccc34" />
<img width="1843" height="1093" alt="Screenshot from 2025-07-21 19-11-55" src="https://github.com/user-attachments/assets/cdaf3796-2671-49e6-963a-bfafb6b4010e" />
