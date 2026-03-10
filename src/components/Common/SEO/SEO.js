import React from "react";
import { Helmet } from "react-helmet-async";

const SEO = ({
    title,
    description,
    keywords,
    author = "Rajashekhar V N",
    image,
    url,
    type = "website"
}) => {
    const siteTitle = "Rajashekhar V N | Full Stack Developer Portfolio";
    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const siteDescription = description || "Full Stack Developer specializing in React.js, PHP, and modern web technologies. View my projects, skills, and professional journey.";
    const siteUrl = "https://rajashekharvn.vercel.app";
    const activeUrl = url ? `${siteUrl}${url}` : siteUrl;
    const siteImage = image || `${siteUrl}/og-image.png`;
    const siteKeywords = keywords || "Rajashekhar, Full Stack Developer, React Developer, Web Developer, PHP Developer, Portfolio, JavaScript, HTML, CSS";

    // Schema.org JSON-LD for Person and Website
    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Person",
                "@id": `${siteUrl}/#person`,
                "name": "Rajashekhar V N",
                "url": siteUrl,
                "image": siteImage,
                "sameAs": [
                    "https://github.com/Rajashekharvn",
                    "https://www.linkedin.com/in/rajashekhar-naduvinahalli",
                    "https://www.instagram.com/rajashekhar_v_n"
                ],
                "jobTitle": "Full Stack Developer",
                "worksFor": {
                    "@type": "Organization",
                    "name": "Freelance"
                },
                "description": siteDescription
            },
            {
                "@type": "WebSite",
                "@id": `${siteUrl}/#website`,
                "url": siteUrl,
                "name": "Rajashekhar V N Portfolio",
                "publisher": {
                    "@id": `${siteUrl}/#person`
                }
            }
        ]
    };

    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={siteDescription} />
            <meta name="keywords" content={siteKeywords} />
            <meta name="author" content={author} />
            <link rel="canonical" href={activeUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={siteDescription} />
            <meta property="og:image" content={siteImage} />
            <meta property="og:url" content={activeUrl} />
            <meta property="og:site_name" content="Rajashekhar V N Portfolio" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={siteDescription} />
            <meta name="twitter:image" content={siteImage} />
            <meta name="twitter:site" content="@rajashekharvn" />

            {/* Schema.org JSON-LD */}
            <script type="application/ld+json">
                {JSON.stringify(structuredData)}
            </script>
        </Helmet>
    );
};

export default SEO;
