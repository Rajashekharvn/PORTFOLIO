import React from "react";
import { Helmet } from "react-helmet-async";

const SEO = ({ title, description, keywords, image, url, type = "website" }) => {
    const siteTitle = "Rajashekhar | Portfolio";
    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const siteDescription = description || "Self Developed personal website build with React.js. Showcasing projects, skills, and professional journey.";
    const siteUrl = "https://rajashekharvn.vercel.app/";
    const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
    const siteImage = image || `${siteUrl}favicon.png`; // Fallback to favicon or a dedicated social image

    // Schema.org JSON-LD for Person and Website
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Rajashekhar",
        "url": siteUrl,
        "jobTitle": "Full Stack Developer",
        "sameAs": [
            "https://github.com/Rajashekharvn",
            "https://linkedin.com/in/rajashekharvn"
        ]
    };

    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={siteDescription} />
            {keywords && <meta name="keywords" content={keywords} />}
            <link rel="canonical" href={fullUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={siteDescription} />
            <meta property="og:image" content={siteImage} />
            <meta property="og:url" content={fullUrl} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={siteDescription} />
            <meta name="twitter:image" content={siteImage} />

            {/* Schema.org JSON-LD */}
            <script type="application/ld+json">
                {JSON.stringify(structuredData)}
            </script>
        </Helmet>
    );
};

export default SEO;
