import React, { useState, useEffect } from "react";
import Preloader from "./components/Pre";
import Navbar from "./components/layout/Navbar/Navbar";
import Home from "./components/Home/Home";
import About from "./components/About/About";
import Projects from "./components/Projects/Projects";
import Footer from "./components/layout/Footer/Footer";
import Resume from "./components/Resume/ResumeNew";
import Certificates from "./components/Certificates/Certificates";
import Contact from "./components/Contact/Contact";
import Login from "./components/Admin/Login";
import AdminPanel from "./components/Admin/AdminPanel";
import UploadResume from "./components/Admin/UploadResume";
import ManageProjects from "./components/Admin/ManageProjects";
import ManageCertificates from "./components/Admin/ManageCertificates";
import ManageHome from "./components/Admin/ManageHome";
import ManageAbout from "./components/Admin/ManageAbout";
import ManageSkills from "./components/Admin/ManageSkills";
import ProtectedRoute from "./components/ProtectedRoute";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Particle from "./components/Particle";
import PageTransition from "./components/PageTransition";
import BackToTop from "./components/BackToTop/BackToTop";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/variables.css";
import { supabase } from "./supabaseClient";
import "./styles/global.css";
import "./styles/animations.css";
import "./App.css";

function App() {
  const [load, upadateLoad] = useState(true);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      upadateLoad(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  // Check active session
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Router>
      <Preloader load={load} />
      <div className="App" id={load ? "no-scroll" : "scroll"}>
        <Particle />
        <Navbar />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/project" element={<PageTransition><Projects /></PageTransition>} />
          <Route path="/about" element={<PageTransition><About /></PageTransition>} />
          <Route path="/resume" element={<PageTransition><Resume /></PageTransition>} />
          <Route path="/Certificates" element={<PageTransition><Certificates /></PageTransition>} />
          <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute user={user} loading={authLoading}>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/resume"
            element={
              <ProtectedRoute user={user} loading={authLoading}>
                <UploadResume />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/projects"
            element={
              <ProtectedRoute user={user} loading={authLoading}>
                <ManageProjects />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/certificates"
            element={
              <ProtectedRoute user={user} loading={authLoading}>
                <ManageCertificates />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/home"
            element={
              <ProtectedRoute user={user} loading={authLoading}>
                <ManageHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/about"
            element={
              <ProtectedRoute user={user} loading={authLoading}>
                <ManageAbout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/skills"
            element={
              <ProtectedRoute user={user} loading={authLoading}>
                <ManageSkills />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Footer />
        <BackToTop />
      </div>
    </Router>
  );
}

export default App;
