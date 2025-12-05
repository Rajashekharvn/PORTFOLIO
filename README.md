<h2 align="center">
  Portfolio Website - v3.0.0<br/>
  <a href="https://rajashekharvn.netlify.app/" target="_blank">Raju.tech</a>
</h2>
<br/>
<center>
[![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com) &nbsp;
[![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://forthebadge.com) &nbsp;
[![forthebadge](https://forthebadge.com/images/badges/open-source.svg)](https://forthebadge.com) &nbsp;
![GitHub Repo stars](https://img.shields.io/github/stars/Rajashekharvn/raj-portfolio?color=red&logo=github&style=for-the-badge) &nbsp;
![GitHub forks](https://img.shields.io/github/forks/Rajashekharvn/raj-portfolio?color=red&logo=github&style=for-the-badge)
</center>
# Portfolio Website - v3.0.0 🚀
## Description
A premium, personal portfolio website built with React.js, showcasing projects, resume, and technical skills. This project features a modern glassmorphism design, interactive animations, and a fully functional Admin Panel for managing content dynamically via Supabase.
## Features ✨
- **Modern UI/UX**: Glassmorphism design, particle backgrounds, and smooth page transitions.
- **Dynamic Content**: Manage Projects, Certificates, and Resume directly from the Admin Panel.
- **Admin Panel**: Secure login and dashboard to update portfolio content without code changes.
- **Supabase Integration**: Real-time database and storage for dynamic content management.
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices.
- **Interactive Components**: Typewriter effects, tilt animations, and GitHub contribution calendar.
- **PDF Viewer**: Integrated PDF viewer for Certificates and Resume.
## Tech Stack 💻
- **Frontend**: React.js, React Bootstrap, CSS3
- **Backend/Database**: Supabase (PostgreSQL, Storage, Auth)
- **Libraries**: `react-pdf`, `react-icons`, `react-tsparticles`, `typewriter-effect`, `axios`
## Getting Started 🛠️
### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- A Supabase account
### Installation
1. **Clone the repository**
   ```bash
   git clone https://github.com/Rajashekharvn/PORTFOLIO.git
   cd PORTFOLIO
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Configure Environment Variables**
   - Create a `.env` file in the root directory.
   - Add your Supabase keys (see [Configuration](#configuration-⚙️) below).
4. **Run the application**
   ```bash
   npm start
   ```
   The app will open at [http://localhost:3000](http://localhost:3000).
## Project Structure 📂
```
PORTFOLIO
├── public/                 # Static assets (index.html, manifest, etc.)
├── src/
│   ├── Assets/             # Local images and static files
│   ├── components/         # React Components
│   │   ├── About/          # About page components (Techstack, Toolstack)
│   │   ├── Admin/          # Admin Panel components (Login, Dashboard, Managers)
│   │   ├── Certificates/   # Certificates page with PDF viewer
│   │   ├── Contact/        # Contact form
│   │   ├── Home/           # Landing page components
│   │   ├── Projects/       # Projects page components
│   │   ├── Resume/         # Resume page components
│   │   ├── Navbar.js       # Main navigation bar
│   │   └── Footer.js       # Application footer
│   ├── styles/             # Global styles and animations
│   ├── supabase/           # Supabase helper functions
│   ├── App.js              # Main application component with Routes
│   ├── index.js            # Entry point
│   └── supabaseClient.js   # Supabase client initialization
├── .env                    # Environment variables (Gitignored)
├── .gitignore              # Git ignore rules
├── package.json            # Project dependencies
└── README.md               # Project documentation
```
## Admin Panel 🔐
The Admin Panel allows you to manage the content of your portfolio dynamically.
### How to Access
1. Navigate to `/admin/login` (e.g., `http://localhost:3000/admin/login`).
2. Log in with your Supabase authentication credentials.
### Features
- **Dashboard**: Overview of your portfolio stats.
- **Manage Projects**: Add, edit, or delete projects. Upload project images directly.
- **Manage Certificates**: Upload new certificates (PDF) and manage existing ones.
- **Update Resume**: Upload the latest version of your resume.
## Supabase Setup 🗄️
To make the dynamic features work, you need to set up a Supabase project.
1. **Create a Project**: Go to [Supabase](https://supabase.com/) and create a new project.
2. **Database Schema**:
   Create the following tables in your Supabase database:
   - `projects`: `id`, `title`, `description`, `ghLink`, `demoLink`, `imgPath` (text)
   - `certificates`: `id`, `title`, `issuer`, `date`, `pdfPath` (text)
   - `resume`: `id`, `file_path` (text), `updated_at`
3. **Storage Buckets**:
   Create two public storage buckets:
   - `project-images`
   - `certificates`
   - `resumes`
4. **Connect to App**:
   The app uses environment variables for security. Create a `.env` file in the root directory:
   ```env
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   **Do not commit `.env` to GitHub.**
## Deployment 🚀
### Vercel Deployment & Environment Variables
1. **Import Project**: Connect your GitHub repository to Vercel.
2. **Configure Environment Variables** (Critical Step):
   - In the Vercel Dashboard, go to **Settings** > **Environment Variables**.
   - Add the following keys (copy values from your local `.env` or Supabase):
     - `REACT_APP_SUPABASE_URL`
     - `REACT_APP_SUPABASE_ANON_KEY`
3. **Deploy**: Click **Deploy**. If the project is already deployed, go to **Deployments** and click **Redeploy** on the latest commit to apply the new variables.
## Contributing 🤝
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/improvement`).
3. Commit your changes.
4. Push to the branch.
5. Open a Pull Request.
## License 📜
This project is open source and available under the [MIT License](LICENSE).
## Contact 📧
**Rajashekhar V N**
- [LinkedIn](https://www.linkedin.com/in/rajashekhar-naduvinahalli-476b15253/)
- [Instagram](https://www.instagram.com/rajashekhar_v_n)
- Email: raju.naduvinahalli@gmail.com
