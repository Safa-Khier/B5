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
│  │  ├─ 📄index-3Nz7iKXt.js
│  │  ├─ 📄index-bQ9Zgb_f.css
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
│  │  │  ├─ 📄homeScreenLogo.png
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
│  │  │  ├─ 📄halving.jsx
│  │  │  ├─ 📄navigationBar.css
│  │  │  └─ 📄navigationBar.jsx
│  │  ├─ 📁screens
│  │  │  ├─ 📁home
│  │  │  │  ├─ 📁dashboard
│  │  │  │  │  ├─ 📁cashIn
│  │  │  │  │  │  ├─ 📄buy.currencey.screen.jsx
│  │  │  │  │  │  ├─ 📄cashIn.jsx
│  │  │  │  │  │  └─ 📄trade.currencey.screen.jsx
│  │  │  │  │  ├─ 📁withdraw
│  │  │  │  │  │  └─ 📄withdraw.jsx
│  │  │  │  │  ├─ 📄dashboard.css
│  │  │  │  │  └─ 📄dashboard.jsx
│  │  │  │  ├─ 📄coins.screen.jsx
│  │  │  │  ├─ 📄home.jsx
│  │  │  │  ├─ 📄news.screen.jsx
│  │  │  │  ├─ 📄settings.jsx
│  │  │  │  └─ 📄transactionsHistory.jsx
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
│  │  │  ├─ 📁newsTable
│  │  │  │  ├─ 📄newsTab.jsx
│  │  │  │  └─ 📄newsTable.jsx
│  │  │  ├─ 📁transactionsTable
│  │  │  │  ├─ 📁buyTable
│  │  │  │  │  ├─ 📄transactionsBuyRow.jsx
│  │  │  │  │  └─ 📄transactionsBuyTable.jsx
│  │  │  │  ├─ 📁tradeTable
│  │  │  │  │  ├─ 📄transactionsTradeRow.jsx
│  │  │  │  │  └─ 📄transactionsTradeTable.jsx
│  │  │  │  └─ 📁withdrawTable
│  │  │  │     ├─ 📄transactionsWithdrawRow.jsx
│  │  │  │     └─ 📄transactionsWithdrawTable.jsx
│  │  │  ├─ 📄loading.data.screen.jsx
│  │  │  └─ 📄paging.jsx
│  │  ├─ 📁userMenu
│  │  │  ├─ 📄userMenu.css
│  │  │  └─ 📄userMenu.jsx
│  │  ├─ 📄footer.jsx
│  │  ├─ 📄loading.screen.jsx
│  │  └─ 📄particlesBackground.jsx
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