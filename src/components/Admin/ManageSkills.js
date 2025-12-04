import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert, Card, Row, Col, Tabs, Tab, Table } from "react-bootstrap";
import { getSkills, addSkill, updateSkill, deleteSkill } from "../../supabase/database";
import { defaultTechStack, defaultToolStack } from "../../utils/content";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSave, FaPlus, FaEdit, FaTrash } from "react-icons/fa";

// Tech Stack Icons (90+ options)
const TECH_ICONS = {
    // Languages
    DiJava: "Java",
    DiJavascript1: "JavaScript",
    DiPython: "Python",
    SiHtml5: "HTML5",
    SiCss3: "CSS3",
    SiTypescript: "TypeScript",
    SiCplusplus: "C++",
    SiC: "C",
    SiCsharp: "C#",
    SiPhp: "PHP",
    SiRuby: "Ruby",
    SiGo: "Go",
    SiRust: "Rust",
    SiKotlin: "Kotlin",
    SiSwift: "Swift",
    SiScala: "Scala",
    SiPerl: "Perl",
    SiR: "R",
    SiElixir: "Elixir",
    SiDart: "Dart",
    SiLua: "Lua",
    // Frontend Frameworks
    DiReact: "React",
    SiAngular: "Angular",
    SiVuedotjs: "Vue.js",
    SiNextdotjs: "Next.js",
    SiNuxtdotjs: "Nuxt.js",
    SiSvelte: "Svelte",
    SiFlutter: "Flutter",
    SiRedux: "Redux",
    SiTailwindcss: "Tailwind CSS",
    SiBootstrap: "Bootstrap",
    SiMui: "Material-UI",
    SiSass: "Sass",
    SiLess: "Less",
    SiStyledcomponents: "Styled Components",
    SiJquery: "jQuery",
    // Backend Frameworks
    DiNodejs: "Node.js",
    SiExpress: "Express",
    SiDjango: "Django",
    SiFlask: "Flask",
    SiSpring: "Spring",
    SiFastapi: "FastAPI",
    SiNestjs: "NestJS",
    SiLaravel: "Laravel",
    SiRubyonrails: "Ruby on Rails",
    SiDotnet: ".NET",
    SiAdonisjs: "AdonisJS",
    SiKoa: "Koa",
    SiPhoenixframework: "Phoenix",
    // Databases
    DiMongodb: "MongoDB",
    DiMysql: "MySQL",
    DiPostgresql: "PostgreSQL",
    DiRedis: "Redis",
    SiSqlite: "SQLite",
    SiMariadb: "MariaDB",
    SiCassandra: "Cassandra",
    SiElasticsearch: "Elasticsearch",
    SiOracle: "Oracle",
    SiMicrosoftsqlserver: "SQL Server",
    SiCouchbase: "Couchbase",
    SiNeo4J: "Neo4j",
    SiInfluxdb: "InfluxDB",
    // DevOps & Cloud
    DiDocker: "Docker",
    SiKubernetes: "Kubernetes",
    SiJenkins: "Jenkins",
    SiGithubactions: "GitHub Actions",
    SiGitlab: "GitLab CI",
    SiTerraform: "Terraform",
    SiAnsible: "Ansible",
    SiPrometheus: "Prometheus",
    SiGrafana: "Grafana",
    SiNginx: "Nginx",
    SiApache: "Apache",
    // Version Control
    DiGit: "Git",
    // APIs & Tools
    SiGraphql: "GraphQL",
    SiFirebase: "Firebase",
    SiSupabase: "Supabase",
    SiApachekafka: "Kafka",
    SiRabbitmq: "RabbitMQ",
    SiSocketdotio: "Socket.io",
    SiJest: "Jest",
    SiCypress: "Cypress",
    SiSelenium: "Selenium",
    SiPlaywright: "Playwright",
    SiVitest: "Vitest",
    SiMocha: "Mocha",
    FaCode: "Data Structures",
    FaAws: "AWS"
};

// Tool Stack Icons (90+ options)
const TOOL_ICONS = {
    // Operating Systems
    SiWindows: "Windows",
    SiMacos: "macOS",
    SiLinux: "Linux",
    SiUbuntu: "Ubuntu",
    SiDebian: "Debian",
    SiCentos: "CentOS",
    SiAndroid: "Android",
    SiIos: "iOS",
    SiFedora: "Fedora",
    SiArchlinux: "Arch Linux",
    // IDEs & Editors
    SiVisualstudiocode: "VS Code",
    SiIntellijidea: "IntelliJ IDEA",
    SiPycharm: "PyCharm",
    SiWebstorm: "WebStorm",
    SiEclipseide: "Eclipse",
    SiVisualstudio: "Visual Studio",
    SiSublimetext: "Sublime Text",
    SiVim: "Vim",
    SiNeovim: "Neovim",
    SiAtom: "Atom",
    SiAndroidstudio: "Android Studio",
    SiXcode: "Xcode",
    SiRider: "Rider",
    SiPhpstorm: "PhpStorm",
    // Cloud & Hosting
    SiVercel: "Vercel",
    SiNetlify: "Netlify",
    SiHeroku: "Heroku",
    SiAmazonaws: "AWS",
    SiGooglecloud: "Google Cloud",
    SiMicrosoftazure: "Azure",
    SiDigitalocean: "DigitalOcean",
    SiCloudflare: "Cloudflare",
    SiRender: "Render",
    SiRailway: "Railway",
    SiFly: "Fly.io",
    // Version Control
    SiGithub: "GitHub",
    SiGitlab: "GitLab",
    SiBitbucket: "Bitbucket",
    SiGit: "Git",
    SiGitea: "Gitea",
    // API & Testing
    SiPostman: "Postman",
    SiInsomnia: "Insomnia",
    SiSwagger: "Swagger",
    SiSonarqube: "SonarQube",
    SiSonarcloud: "SonarCloud",
    // Design Tools
    SiFigma: "Figma",
    SiAdobexd: "Adobe XD",
    SiSketch: "Sketch",
    SiCanva: "Canva",
    SiAdobephotoshop: "Photoshop",
    SiAdobeillustrator: "Illustrator",
    SiBlender: "Blender",
    SiInvision: "InVision",
    // Communication
    SiSlack: "Slack",
    SiDiscord: "Discord",
    SiMicrosoftteams: "Microsoft Teams",
    SiZoom: "Zoom",
    SiSkype: "Skype",
    SiTelegram: "Telegram",
    // Project Management
    SiNotion: "Notion",
    SiTrello: "Trello",
    SiJira: "Jira",
    SiAsana: "Asana",
    SiConfluence: "Confluence",
    SiClickup: "ClickUp",
    SiMonday: "Monday.com",
    SiLinear: "Linear",
    // Package Managers & Build Tools
    SiNpm: "npm",
    SiYarn: "Yarn",
    SiPnpm: "pnpm",
    SiWebpack: "Webpack",
    SiVite: "Vite",
    SiBabel: "Babel",
    SiEslint: "ESLint",
    SiPrettier: "Prettier",
    SiGulp: "Gulp",
    SiGrunt: "Grunt",
    SiRollup: "Rollup",
    SiTurbo: "Turborepo",
    // Containers & Orchestration
    SiDocker: "Docker",
    SiKubernetes: "Kubernetes",
    SiHelm: "Helm",
    // Browsers
    SiGooglechrome: "Chrome",
    SiFirefox: "Firefox",
    SiSafari: "Safari",
    SiMicrosoftedge: "Edge",
    SiBrave: "Brave",
    // Other Tools
    SiGithubcopilot: "GitHub Copilot",
    SiStackoverflow: "Stack Overflow",
    SiReplit: "Replit",
    SiCodepen: "CodePen",
    SiCodesandbox: "CodeSandbox",
    SiObsidian: "Obsidian",
    SiMiro: "Miro",
    SiAirtable: "Airtable"
};

function ManageSkills() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("tech");
    const [techSkills, setTechSkills] = useState([]);
    const [toolSkills, setToolSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        iconName: "",
        category: "tech"
    });

    useEffect(() => {
        loadSkills();
    }, []);

    const loadSkills = async () => {
        try {
            const techData = await getSkills("tech");
            const toolData = await getSkills("tool");

            setTechSkills(techData.length > 0 ? techData : defaultTechStack.map((s, i) => ({ ...s, id: `default-${i}`, category: "tech", display_order: i })));
            setToolSkills(toolData.length > 0 ? toolData : defaultToolStack.map((s, i) => ({ ...s, id: `default-${i}`, category: "tool", display_order: i })));
        } catch (error) {
            console.error("Error loading skills:", error);
            setMessage({ type: "danger", text: "Failed to load skills" });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

        try {
            const skillData = {
                name: formData.name,
                iconName: formData.iconName,
                category: activeTab,
                displayOrder: activeTab === "tech" ? techSkills.length : toolSkills.length
            };

            if (editingId) {
                await updateSkill(editingId, skillData);
                setMessage({ type: "success", text: "Skill updated successfully!" });
            } else {
                await addSkill(skillData);
                setMessage({ type: "success", text: "Skill added successfully!" });
            }

            setFormData({ name: "", iconName: "", category: activeTab });
            setEditingId(null);
            loadSkills();
        } catch (error) {
            console.error("Error saving skill:", error);
            setMessage({ type: "danger", text: "Failed to save skill" });
        }
    };

    const handleEdit = (skill) => {
        setFormData({
            name: skill.name,
            iconName: skill.icon_name || skill.iconName,
            category: skill.category
        });
        setEditingId(skill.id);
        setActiveTab(skill.category);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this skill?")) return;

        try {
            await deleteSkill(id);
            setMessage({ type: "success", text: "Skill deleted successfully!" });
            loadSkills();
        } catch (error) {
            console.error("Error deleting skill:", error);
            setMessage({ type: "danger", text: "Failed to delete skill" });
        }
    };

    const handleCancel = () => {
        setFormData({ name: "", iconName: "", category: activeTab });
        setEditingId(null);
    };

    if (loading) {
        return (
            <Container fluid className="admin-section">
                <Container className="text-center text-white">Loading...</Container>
            </Container>
        );
    }

    const currentSkills = activeTab === "tech" ? techSkills : toolSkills;
    const currentIcons = activeTab === "tech" ? TECH_ICONS : TOOL_ICONS;

    return (
        <Container fluid className="admin-section">
            <Container>
                <Button
                    variant="outline-light"
                    className="mb-4"
                    onClick={() => navigate("/admin/dashboard")}
                >
                    <FaArrowLeft /> Back to Dashboard
                </Button>

                <h2 className="text-white mb-4">Manage Skills</h2>

                {message && (
                    <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>
                        {message.text}
                    </Alert>
                )}

                <Tabs
                    activeKey={activeTab}
                    onSelect={(k) => {
                        setActiveTab(k);
                        setFormData({ name: "", iconName: "", category: k });
                        setEditingId(null);
                    }}
                    className="mb-4"
                >
                    <Tab eventKey="tech" title="Tech Stack">
                        <Card className="admin-card mb-4">
                            <Card.Body>
                                <h4 className="text-white mb-3">{editingId ? "Edit" : "Add"} Tech Skill</h4>
                                <Form onSubmit={handleSubmit}>
                                    <Row>
                                        <Col md={5}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="text-white">Skill Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    placeholder="e.g., React"
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={5}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="text-white">Icon</Form.Label>
                                                <Form.Select
                                                    name="iconName"
                                                    value={formData.iconName}
                                                    onChange={handleChange}
                                                    required
                                                >
                                                    <option value="">Select an icon...</option>
                                                    {Object.entries(currentIcons).map(([key, label]) => (
                                                        <option key={key} value={key}>{label}</option>
                                                    ))}
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col md={2} className="d-flex align-items-end">
                                            <Button
                                                variant="primary"
                                                type="submit"
                                                className="mb-3 w-100"
                                                style={{ backgroundColor: "#c770f0", border: "none" }}
                                            >
                                                {editingId ? <><FaSave /> Update</> : <><FaPlus /> Add</>}
                                            </Button>
                                        </Col>
                                    </Row>
                                    {editingId && (
                                        <Button variant="secondary" onClick={handleCancel} size="sm">
                                            Cancel
                                        </Button>
                                    )}
                                </Form>
                            </Card.Body>
                        </Card>

                        <Card className="admin-card">
                            <Card.Body>
                                <h4 className="text-white mb-3">Current Tech Skills</h4>
                                <Table striped bordered hover variant="dark">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Icon</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentSkills.map((skill) => (
                                            <tr key={skill.id}>
                                                <td>{skill.name}</td>
                                                <td>{skill.icon_name || skill.iconName}</td>
                                                <td>
                                                    <Button
                                                        variant="warning"
                                                        size="sm"
                                                        className="me-2"
                                                        onClick={() => handleEdit(skill)}
                                                    >
                                                        <FaEdit />
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => handleDelete(skill.id)}
                                                        disabled={typeof skill.id === 'string' && skill.id.startsWith('default')}
                                                    >
                                                        <FaTrash />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Tab>

                    <Tab eventKey="tool" title="Tool Stack">
                        <Card className="admin-card mb-4">
                            <Card.Body>
                                <h4 className="text-white mb-3">{editingId ? "Edit" : "Add"} Tool</h4>
                                <Form onSubmit={handleSubmit}>
                                    <Row>
                                        <Col md={5}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="text-white">Tool Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    placeholder="e.g., VS Code"
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={5}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="text-white">Icon</Form.Label>
                                                <Form.Select
                                                    name="iconName"
                                                    value={formData.iconName}
                                                    onChange={handleChange}
                                                    required
                                                >
                                                    <option value="">Select an icon...</option>
                                                    {Object.entries(currentIcons).map(([key, label]) => (
                                                        <option key={key} value={key}>{label}</option>
                                                    ))}
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col md={2} className="d-flex align-items-end">
                                            <Button
                                                variant="primary"
                                                type="submit"
                                                className="mb-3 w-100"
                                                style={{ backgroundColor: "#c770f0", border: "none" }}
                                            >
                                                {editingId ? <><FaSave /> Update</> : <><FaPlus /> Add</>}
                                            </Button>
                                        </Col>
                                    </Row>
                                    {editingId && (
                                        <Button variant="secondary" onClick={handleCancel} size="sm">
                                            Cancel
                                        </Button>
                                    )}
                                </Form>
                            </Card.Body>
                        </Card>

                        <Card className="admin-card">
                            <Card.Body>
                                <h4 className="text-white mb-3">Current Tools</h4>
                                <Table striped bordered hover variant="dark">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Icon</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentSkills.map((skill) => (
                                            <tr key={skill.id}>
                                                <td>{skill.name}</td>
                                                <td>{skill.icon_name || skill.iconName}</td>
                                                <td>
                                                    <Button
                                                        variant="warning"
                                                        size="sm"
                                                        className="me-2"
                                                        onClick={() => handleEdit(skill)}
                                                    >
                                                        <FaEdit />
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => handleDelete(skill.id)}
                                                        disabled={typeof skill.id === 'string' && skill.id.startsWith('default')}
                                                    >
                                                        <FaTrash />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Tab>
                </Tabs>
            </Container>
        </Container>
    );
}

export default ManageSkills;
