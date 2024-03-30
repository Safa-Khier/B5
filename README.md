# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

```
b5
├─ 📁build
│  ├─ 📁assets
│  │  ├─ 📄china-BJC3NXIF.png
│  │  ├─ 📄germany-RcDfzgS0.webp
│  │  ├─ 📄index-7r8mnWkT.js
│  │  ├─ 📄index-BieqCWuh.css
│  │  ├─ 📄italy-k4diam-A.webp
│  │  ├─ 📄logo-DRWUd7yX.png
│  │  ├─ 📄logoB-BNS7NqN4.png
│  │  ├─ 📄russia-BFOhkMUR.png
│  │  └─ 📄usa-BeFRcQv-.png
│  ├─ 📁locales
│  │  ├─ 📁de
│  │  │  └─ 📄translation.json
│  │  ├─ 📁en
│  │  │  └─ 📄translation.json
│  │  ├─ 📁it
│  │  │  └─ 📄translation.json
│  │  ├─ 📁ru
│  │  │  └─ 📄translation.json
│  │  └─ 📁zh
│  │     └─ 📄translation.json
│  ├─ 📄favicon.ico
│  ├─ 📄index.html
│  ├─ 📄mockData.jsx
│  ├─ 📄publicFunctions.jsx
│  └─ 📄vite.svg
├─ 📁functions
│  ├─ 📄.gitignore
│  ├─ 📄index.js
│  ├─ 📄package-lock.json
│  └─ 📄package.json
├─ 📁public
│  ├─ 📁locales
│  │  ├─ 📁de
│  │  │  └─ 📄translation.json
│  │  ├─ 📁en
│  │  │  └─ 📄translation.json
│  │  ├─ 📁it
│  │  │  └─ 📄translation.json
│  │  ├─ 📁ru
│  │  │  └─ 📄translation.json
│  │  └─ 📁zh
│  │     └─ 📄translation.json
│  ├─ 📄favicon.ico
│  ├─ 📄mockData.jsx
│  ├─ 📄publicFunctions.jsx
│  └─ 📄vite.svg
├─ 📁src
│  ├─ 📁assets
│  │  ├─ 📁icons
│  │  │  ├─ 📄china.png
│  │  │  ├─ 📄germany.webp
│  │  │  ├─ 📄italy.webp
│  │  │  ├─ 📄logo.png
│  │  │  ├─ 📄logoB.png
│  │  │  ├─ 📄russia.png
│  │  │  ├─ 📄usa.png
│  │  │  └─ 📄userIcon.webp
│  │  └─ 📄react.svg
│  ├─ 📁atoms
│  │  ├─ 📄cryptoData.js
│  │  ├─ 📄cryptoNews.js
│  │  ├─ 📄userData.js
│  │  └─ 📄webSettings.js
│  ├─ 📁components
│  │  ├─ 📁alert
│  │  │  ├─ 📄alert.css
│  │  │  └─ 📄alert.jsx
│  │  ├─ 📁creditCard
│  │  │  ├─ 📄creditCardForm.css
│  │  │  └─ 📄creditCardForm.jsx
│  │  ├─ 📁navigationBar
│  │  │  ├─ 📄authenticatedNavBar.css
│  │  │  ├─ 📄authenticatedNavBar.jsx
│  │  │  └─ 📄navBar.jsx
│  │  ├─ 📁phoneUserMenu
│  │  │  ├─ 📄phoneUserMenu.css
│  │  │  └─ 📄phoneUserMenu.jsx
│  │  ├─ 📁screens
│  │  │  ├─ 📁home
│  │  │  │  ├─ 📁dashboard
│  │  │  │  │  ├─ 📄cashIn.jsx
│  │  │  │  │  ├─ 📄dashboard.css
│  │  │  │  │  └─ 📄dashboard.jsx
│  │  │  │  ├─ 📄coins.screen.jsx
│  │  │  │  ├─ 📄compare.screen.jsx
│  │  │  │  ├─ 📄home.jsx
│  │  │  │  └─ 📄news.screen.jsx
│  │  │  └─ 📁welcome
│  │  │     ├─ 📄login.jsx
│  │  │     ├─ 📄signup.jsx
│  │  │     └─ 📄welcome.jsx
│  │  ├─ 📁searchBar
│  │  │  ├─ 📄searchBar.css
│  │  │  └─ 📄searchBar.jsx
│  │  ├─ 📁table
│  │  │  ├─ 📁currenciesTable
│  │  │  │  ├─ 📄currenciesRow.jsx
│  │  │  │  ├─ 📄currenciesTable.jsx
│  │  │  │  └─ 📄dataSparkline.jsx
│  │  │  ├─ 📁holdingCoinsTable
│  │  │  │  ├─ 📄holdingCoinsRow.jsx
│  │  │  │  └─ 📄holdingCoinsTable.jsx
│  │  │  └─ 📁newsTable
│  │  │     ├─ 📄newsTab.jsx
│  │  │     └─ 📄newsTable.jsx
│  │  ├─ 📁userMenu
│  │  │  ├─ 📄userMenu.css
│  │  │  └─ 📄userMenu.jsx
│  │  ├─ 📄AnimatedBackground.jsx
│  │  ├─ 📄footer.jsx
│  │  └─ 📄loading.screen.jsx
│  ├─ 📄App.jsx
│  ├─ 📄AuthContext.js
│  ├─ 📄firebase.js
│  ├─ 📄i18n.js
│  ├─ 📄index.css
│  ├─ 📄main.jsx
│  └─ 📄protectedRoute.jsx
├─ 📄.eslintrc.cjs
├─ 📄.firebaserc
├─ 📄.gitignore
├─ 📄.prettierignore
├─ 📄.prettierrc
├─ 📄firebase.json
├─ 📄index.html
├─ 📄package-lock.json
├─ 📄package.json
├─ 📄postcss.config.cjs
├─ 📄README.md
├─ 📄tailwind.config.cjs
└─ 📄vite.config.js
```
