<h2 align="center">
  Portfolio Website - v3.0.0 🚀<br/>
  <a href="https://rajashekharvn.netlify.app/" target="_blank">Raju.tech</a>
</h2>

<br/>

<p align="center">
  <a href="https://forthebadge.com" target="_blank">
    <img src="https://forthebadge.com/images/badges/built-with-love.svg"/>
  </a>&nbsp;
  <a href="https://forthebadge.com" target="_blank">
    <img src="https://forthebadge.com/images/badges/made-with-javascript.svg"/>
  </a>&nbsp;
  <a href="https://forthebadge.com" target="_blank">
    <img src="https://forthebadge.com/images/badges/open-source.svg"/>
  </a>&nbsp;
  <img src="https://img.shields.io/github/stars/Rajashekharvn/PORTFOLIO?color=red&logo=github&style=for-the-badge"/>
  &nbsp;
  <img src="https://img.shields.io/github/forks/Rajashekharvn/PORTFOLIO?color=red&logo=github&style=for-the-badge"/>
</p>

---

# 📌 Portfolio Website – v3.0.0 (Major Release)

## ⭐ What's New in v3.0.0
This major release includes powerful upgrades to the UI/UX, Admin Panel, Supabase integration, and overall performance.

### 🚀 Major Improvements
- Full UI/UX redesign
- Improved animations and transitions
- Advanced Admin Panel (Projects, Certificates, Resume, About)
- Supabase v3 integration with optimized queries
- Storage-based file uploads (images, PDFs)
- Protected admin routes
- Faster loading and better component structure

---

# 📖 Description
A modern, dynamic, and fully responsive portfolio website built using **React.js**, featuring:

- A **secure Admin Panel** powered by Supabase
- Real-time database updates
- PDF viewer for Resume and Certificates
- Dynamic project and certificate management
- Modern animations and clean UI

Version **v3.0.0** enhances stability, performance, and extensibility.

---

# ✨ Features

### 🎨 UI Features
- Glassmorphism UI
- Smooth animations
- Responsive design
- Modern icons & visuals

### ⚡ Dynamic Content
Admin Panel allows updating:

- Projects (CRUD)
- Certificates (PDF upload + delete)
- Resume (PDF)
- About content

### 🔐 Admin Features
- Supabase Authentication (Email login)
- Protected routes (/admin)
- Dashboard view
- Instant updates via database syncing

### 📄 PDF Viewer
- Inline viewing for Resume and Certificates

---

# 💻 Tech Stack

### **Frontend**
- React.js  
- React Bootstrap  
- CSS3  

### **Backend & Database**
- Supabase (PostgreSQL + Storage + Auth)  

### **Libraries**
- react-pdf  
- react-icons  
- react-tsparticles  
- axios  
- typewriter-effect  

---

# 🛠 Getting Started

## Prerequisites
- Node.js v14+
- npm v6+
- Supabase account

---

# 🚀 Installation

### 1️⃣ Clone the Repository  
```bash
git clone https://github.com/Rajashekharvn/PORTFOLIO.git
cd PORTFOLIO
2️⃣ Install Dependencies
bash
Copy code
npm install
3️⃣ Configure Supabase
Create:

bash
Copy code
src/supabaseClient.js
Add:

javascript
Copy code
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
4️⃣ Start the App
bash
Copy code
npm start
App opens at:
👉 http://localhost:3000

📂 Project Structure
pgsql
Copy code
PORTFOLIO
├── public/                 
├── src/
│   ├── Assets/             
│   ├── components/
│   │   ├── About/
│   │   ├── Admin/          # Admin Login, Dashboard, Project Manager, etc.
│   │   ├── Certificates/
│   │   ├── Contact/
│   │   ├── Home/
│   │   ├── Projects/
│   │   ├── Resume/
│   │   ├── Navbar.js
│   │   └── Footer.js
│   ├── styles/
│   ├── supabase/           # All database CRUD helper functions
│   ├── App.js              
│   ├── index.js            
│   └── supabaseClient.js   
├── .gitignore              
├── package.json            
└── README.md               
🔐 Admin Panel
🔗 Access URL
bash
Copy code
http://localhost:3000/admin/login
🔥 Admin Features
Login (Supabase Auth)

Dashboard Overview

Manage Projects (Add/Edit/Delete)

Manage Certificates (Upload/Delete PDF)

Upload Resume (PDF)

Edit About Section

Instant content updates

🗄 Supabase Setup
1️⃣ Create a Supabase Project
https://supabase.com/

2️⃣ Create Database Tables
projects
bash
Copy code
id
title
description
ghLink
demoLink
imgPath
certificates
bash
Copy code
id
title
issuer
date
pdfPath
resume
bash
Copy code
id
file_path
updated_at
3️⃣ Create Storage Buckets
Make these public:

project-images

certificates

resumes

4️⃣ Add Keys to supabaseClient.js
Use the anon key for client-side requests.

🤝 Contributing
Steps:
bash
Copy code
git checkout -b feature/new-feature
git commit -m "Added new feature"
git push origin feature/new-feature
Open a Pull Request.

📜 License
This project is licensed under the MIT License.

📬 Contact
Rajashekhar V N

LinkedIn: https://www.linkedin.com/in/rajashekhar-naduvinahalli-476b15253/

Instagram: https://www.instagram.com/rajashekhar_v_n

Email: raju.naduvinahalli@gmail.com

yaml
Copy code

---

If you'd like, I can also generate:

✅ `CHANGELOG.md` for v3.0.0  
✅ GitHub Release Notes (professional formatting)  
✅ A minimal version of the README for NPM-style documentation  

Just tell me!
