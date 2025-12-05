import { useState, useEffect } from "react";
import { getHomeData } from "../supabase/database";
import { defaultHomeContent } from "../utils/content";

const useHomeContent = () => {
    const [content, setContent] = useState(defaultHomeContent);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadContent = async () => {
            try {
                const data = await getHomeData();
                if (data) {
                    setContent({
                        heading: data.heading,
                        name: data.name,
                        introTitle: data.intro_title,
                        introBody: data.intro_body,
                        githubLink: data.github_link,
                        linkedinLink: data.linkedin_link,
                        instagramLink: data.instagram_link,
                        avatarUrl: data.avatar_url,
                        mainImgUrl: data.main_img_url,
                    });
                }
            } catch (error) {
                console.error("Error fetching home content:", error);
            } finally {
                setLoading(false);
            }
        };
        loadContent();
    }, []);

    return { content, loading };
};

export default useHomeContent;
