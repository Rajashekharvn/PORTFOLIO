export const defaultHomeContent = {
    heading: "Hi There!",
    name: "RAJASHEKHAR V N",
    introTitle: "LET ME INTRODUCE MYSELF",
    introBody: `I fell in love with programming and I have at least learnt something, I think… 🤷‍♂️

I am fluent in classics like HTML, Javascript and Java.

My field of Interest's are building new Web Technologies and Products and also in areas related to Blockchain.

Whenever possible, I also apply my passion for developing products with Node.js and Modern Javascript Library and Frameworks like React.js and Next.js`,
    githubLink: "https://github.com/Rajashekharvn",
    linkedinLink: "https://www.linkedin.com/in/rajashekhar-naduvinahalli",
    instagramLink: "https://www.instagram.com/rajashekhar_v_n?igsh=MTM0bmJhZ2d4dWFnbg=="
};

/**
 * Default about page content configuration
 * Used as fallback when database content is not available
 * @type {Object}
 */
export const defaultAboutContent = {
    heading: "Know Who I'M",
    description: `Hi Everyone, I am Rajashekhar N from Karnataka, India.
I am recent graduate Computer Science engineer.

Apart from coding, some other activities that I love to do!`,
    activities: [
        "Playing Chess",
        "Travelling",
        "Open Source Contribution"
    ],
    quote: "Strive to build things that make a difference!",
    quoteAuthor: "Rajashekhar"
};

/**
 * Default technology stack - array of skills with icon names
 * @type {Array<{name: string, iconName: string}>}
 */
export const defaultTechStack = [
    { name: "Java", iconName: "DiJava" },
    { name: "JavaScript", iconName: "DiJavascript1" },
    { name: "HTML", iconName: "SiHtml5" },
    { name: "CSS", iconName: "SiCss3" },
    { name: "Python", iconName: "DiPython" },
    { name: "Data Structures", iconName: "FaCode" },
    { name: "Git", iconName: "DiGit" },
    { name: "AWS", iconName: "FaAws" }
];

/**
 * Default tool stack - array of development tools with icon names
 * @type {Array<{name: string, iconName: string}>}
 */
export const defaultToolStack = [
    { name: "Windows", iconName: "SiWindows" },
    { name: "VS Code", iconName: "SiVisualstudiocode" },
    { name: "Vercel", iconName: "SiVercel" },
    { name: "Netlify", iconName: "SiNetlify" }
];

