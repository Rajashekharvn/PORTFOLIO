import React from "react";
import { Helmet } from "react-helmet-async";

const SEO = ({
    title = "Rajashekhar V N - Full Stack Developer Portfolio",
    description = "Full Stack Developer specializing in React.js, PHP, and modern web technologies. View my projects, skills, and experience.",
    keywords = "Rajashekhar, Full Stack Developer, React Developer, Web Developer, PHP Developer, Portfolio, JavaScript, HTML, CSS",
    author = "Rajashekhar V N",
    image = "https://rajashekharvn.vercel.app/og-image.png",
    url = "https://rajashekharvn.vercel.app",
    type = "website",
}) => {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Rajashekhar V N",
        url: url,
        image: image,
        sameAs: [
            "https://github.com/Rajashekharvn",
            "https://www.linkedin.com/in/rajashekhar-naduvinahalli",
            "https://www.instagram.com/rajashekhar_v_n",
        ],
        jobTitle: "Full Stack Developer",
        worksFor: {
            "@type": "Organization",
            name: "Freelance",
        },
        description: description,
    };

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="author" content={author} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url} />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={image} />

            {/* Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify(structuredData)}
            </script>
        </Helmet>
    );
};

export default SEO;
