import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, InputGroup } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import editor from "../../Assets/Projects/codeEditor.png";
import chatify from "../../Assets/Projects/chatify.png";
import bitsOfCode from "../../Assets/Projects/blog.png";
import useScrollReveal from "../../hooks/useScrollReveal";
import { getProjects } from "../../supabase/database";
import "./Projects.css";

// Fallback hardcoded projects
const fallbackProjects = [
  {
    imgPath: chatify,
    isBlog: false,
    title: "Centralized Certificate Collection",
    description: "Developed a centralized system for collecting certificates for a college-level Faculty-Student Development Program using PHP and HTML.",
    technologies: ["PHP", "HTML", "MySQL", "CSS"],
    ghLink: "https://github.com/Rajashekharvn/centralized_certificate_collection",
  },
  {
    imgPath: bitsOfCode,
    isBlog: false,
    title: "Data Hub Collaboration",
    description: "A secure data-sharing platform built with PHP and HTML during a National Hackathon. Enables safe collaboration with data protection and an intuitive interface.",
    technologies: ["PHP", "HTML", "Security", "MySQL"],
    ghLink: "https://github.com/Rajashekharvn/secured-data-hub-collaboration",
  },
  {
    imgPath: editor,
    isBlog: false,
    title: "Hamster Combat",
    description: "Hamster Combat Key Generator bot and web app built with JavaScript, HTML, and CSS. Generates unique keys and offers an intuitive interface for management.",
    technologies: ["JavaScript", "HTML", "CSS", "Bot"],
    ghLink: "https://github.com/Rajashekharvn/hmkey",
    demoLink: "https://hmkey.vercel.app/",
  },
];

function Projects() {
  // Use custom hook for fade-up elements
  useScrollReveal();

  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [projectsData, setProjectsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch projects from Supabase
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const supabaseProjects = await getProjects();
        if (supabaseProjects && supabaseProjects.length > 0) {
          // Transform Supabase data to match component format
          const transformedProjects = supabaseProjects.map(project => ({
            imgPath: project.img_path,
            isBlog: project.is_blog,
            title: project.title,
            description: project.description,
            technologies: project.technologies,
            ghLink: project.gh_link,
            demoLink: project.demo_link
          }));
          setProjectsData(transformedProjects);
        } else {
          setProjectsData(fallbackProjects);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjectsData(fallbackProjects);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Get all unique technologies
  const allTechnologies = ["All", ...new Set(projectsData.flatMap(p => p.technologies || []))];

  // Filter projects based on selected filter and search term
  const filteredProjects = projectsData.filter(project => {
    const matchesFilter = selectedFilter === "All" || (project.technologies && project.technologies.includes(selectedFilter));
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Keep custom card animation logic
  useEffect(() => {
    const cards = document.querySelectorAll(".project-card-view");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting && entry.target.classList.contains("project-card-view")) {
            setTimeout(() => entry.target.classList.add("show"), i * 120);
          }
        });
      },
      { threshold: 0.1 }
    );

    cards.forEach((card) => observer.observe(card));
    return () => cards.forEach((card) => observer.unobserve(card));
  }, [filteredProjects]);

  return (
    <Container fluid className="project-section fade-up">
      <Container>
        <h1 className="project-heading">
          My Recent <strong className="purple">Works </strong>
        </h1>
        <p style={{ color: "white", textAlign: "center", marginBottom: "2rem" }}>
          Here are a few projects I've worked on recently.
        </p>

        {/* Search Bar */}
        <Row className="justify-content-center mb-4">
          <Col md={6}>
            <InputGroup className="project-search">
              <InputGroup.Text>
                <i className="fas fa-search"></i>
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
        </Row>

        {/* Filter Buttons */}
        <Row className="justify-content-center mb-4">
          <Col md={10} className="text-center">
            <div className="filter-buttons">
              {allTechnologies.map((tech) => (
                <button
                  key={tech}
                  className={`filter-btn ${selectedFilter === tech ? "active" : ""}`}
                  onClick={() => setSelectedFilter(tech)}
                >
                  {tech}
                </button>
              ))}
            </div>
          </Col>
        </Row>

        {loading ? (
          <div style={{ color: '#fff', textAlign: 'center', padding: '50px' }}>
            <h3>Loading projects...</h3>
          </div>
        ) : (
          <Row className="project-grid">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project, index) => (
                <Col key={index} md={6} lg={4} xs={12} className="d-flex justify-content-center">
                  <ProjectCard {...project} />
                </Col>
              ))
            ) : (
              <Col className="text-center">
                <p style={{ color: "white", fontSize: "1.2em", marginTop: "2rem" }}>
                  No projects found matching your criteria.
                </p>
              </Col>
            )}
          </Row>
        )}
      </Container>
    </Container>
  );
}

export default Projects;
