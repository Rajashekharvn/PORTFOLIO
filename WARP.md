# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project overview
- Stack: Create React App (react-scripts 5), React 17, React Router v6, React-Bootstrap
- Testing: Jest via react-scripts with Testing Library
- Entry: src/index.js renders <App /> into #root
- Routing: Defined in src/App.js using <Routes> with paths /, /about, /project, /resume, /Certificates, /contact
- Styling: Bootstrap plus local styles in src/style.css, src/App.css, src/index.css
- Assets: Images and PDFs in src/Assets; public HTML template in public/index.html

Common commands
- Install dependencies
  ```bash path=null start=null
  npm install
  ```
- Start dev server (localhost:3000)
  ```bash path=null start=null
  npm start
  ```
- Build for production (outputs to build/)
  ```bash path=null start=null
  npm run build
  ```
- Run tests (watch mode)
  ```bash path=null start=null
  npm test
  ```
- Run a single test
  - By file pattern:
    ```bash path=null start=null
    npm test -- App.test.js
    ```
  - By test name pattern (Jest -t):
    ```bash path=null start=null
    npm test -- -t "<pattern>"
    ```
Notes on linting
- There is no dedicated lint script. Linting is applied by react-scripts during development/build based on the eslintConfig in package.json (extends: react-app, react-app/jest).

Environment configuration (Contact page)
- The Contact page reads configuration from src/config/contact.js which uses these environment variables at build time:
  - REACT_APP_FORMSPREE_ENDPOINT
  - REACT_APP_EMAIL
  - REACT_APP_PHONE
  - REACT_APP_LOCATION
- To run locally with custom values in PowerShell (Windows), set env vars before starting:
  ```bash path=null start=null
  $env:REACT_APP_EMAIL="{{CONTACT_EMAIL}}"
  $env:REACT_APP_PHONE="{{CONTACT_PHONE}}"
  $env:REACT_APP_LOCATION="{{CONTACT_LOCATION}}"
  $env:REACT_APP_FORMSPREE_ENDPOINT="{{FORMSPREE_ENDPOINT}}"
  npm start
  ```

High-level architecture
- Application bootstrap
  - src/index.js mounts <App /> and calls reportWebVitals().
- Routing and layout
  - src/App.js wraps the app with <BrowserRouter> and declares routes. Global layout includes:
    - <Navbar /> at the top (react-bootstrap based; links to routes via react-router-dom)
    - <ScrollToTop /> to reset scroll on route change
    - <Footer /> at the bottom
    - <Preloader /> shown briefly on initial load
- Pages (route elements)
  - Home: src/components/Home/Home.js
    - Hero with typewriter effect and Particle background
  - About: src/components/About/*
    - AboutCard, Techstack, Toolstack, Github widgets
  - Projects: src/components/Projects/*
    - Grid of ProjectCard components with images from src/Assets/Projects
  - Resume: src/components/Resume/ResumeNew.js
    - Renders local PDF using react-pdf and provides View/Download buttons
  - Certificates: src/components/Certificates/Certificates.js
    - Lists local PDF certificates with view/download actions
  - Contact: src/components/Contact/Contact.js
    - Form posts to FORMSPREE_ENDPOINT if configured; otherwise opens a mailto: using EMAIL
- Styling and theming
  - Bootstrap CSS is imported globally. Additional styles live in src/style.css, src/App.css, src/components/** (some components include local CSS files).

Important notes from README
- Prereqs: Node.js and git installed
- Quick start: npm install then npm start
- Primary content is under src/components; edit those to update portfolio details

Testing details
- Tests run with react-scripts (Jest + Testing Library). A starter test exists at src/App.test.js. Use the single-test commands above to target specific files or test names.
