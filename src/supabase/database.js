import { supabase } from '../supabaseClient';

// ===== RESUME OPERATIONS =====

export const getResume = async () => {
    try {
        const { data, error } = await supabase
            .from('resume')
            .select('*')
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null; // No rows found
            throw error;
        }
        return data;
    } catch (error) {
        console.error('Error fetching resume:', error);
        return null;
    }
};

export const updateResume = async (resumeData) => {
    try {
        // Convert camelCase to snake_case for database
        const dbData = {
            url: resumeData.url,
            file_name: resumeData.fileName,
            uploaded_at: resumeData.uploadedAt
        };

        // Check if resume exists
        const { data: existing } = await supabase
            .from('resume')
            .select('id')
            .single();

        if (existing) {
            const { error } = await supabase
                .from('resume')
                .update(dbData)
                .eq('id', existing.id);
            if (error) throw error;
        } else {
            const { error } = await supabase
                .from('resume')
                .insert([dbData]);
            if (error) throw error;
        }
    } catch (error) {
        console.error('Error updating resume:', error);
        throw error;
    }
};

// ===== PROJECTS OPERATIONS =====

export const getProjects = async () => {
    try {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
};

export const addProject = async (project) => {
    try {
        const { data, error } = await supabase
            .from('projects')
            .insert([{
                title: project.title,
                description: project.description,
                technologies: project.technologies, // Array is auto-handled
                img_path: project.imgPath,
                gh_link: project.ghLink,
                demo_link: project.demoLink,
                is_blog: project.isBlog,
                created_at: new Date().toISOString()
            }])
            .select();

        if (error) throw error;
        return data[0];
    } catch (error) {
        console.error('Error adding project:', error);
        throw error;
    }
};

export const deleteProject = async (projectId) => {
    try {
        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', projectId);

        if (error) throw error;
    } catch (error) {
        console.error('Error deleting project:', error);
        throw error;
    }
};

// ===== CERTIFICATES OPERATIONS =====

export const getCertificates = async () => {
    try {
        const { data, error } = await supabase
            .from('certificates')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching certificates:', error);
        return [];
    }
};

export const addCertificate = async (certificate) => {
    try {
        const { data, error } = await supabase
            .from('certificates')
            .insert([{
                title: certificate.title,
                issuer: certificate.issuer,
                date: certificate.date,
                img_path: certificate.imgPath,
                created_at: new Date().toISOString()
            }])
            .select();

        if (error) throw error;
        return data[0];
    } catch (error) {
        console.error('Error adding certificate:', error);
        throw error;
    }
};

export const deleteCertificate = async (certId) => {
    try {
        const { error } = await supabase
            .from('certificates')
            .delete()
            .eq('id', certId);

        if (error) throw error;
    } catch (error) {
        console.error('Error deleting certificate:', error);
        throw error;
    }
};

// ===== HOME CONTENT OPERATIONS =====

export const getHomeData = async () => {
    try {
        const { data, error } = await supabase
            .from('home_content')
            .select('*')
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null; // No rows found
            throw error;
        }
        return data;
    } catch (error) {
        console.error('Error fetching home data:', error);
        return null;
    }
};

export const updateHomeData = async (homeData) => {
    try {
        const dbData = {
            heading: homeData.heading,
            name: homeData.name,
            intro_title: homeData.introTitle,
            intro_body: homeData.introBody,
            github_link: homeData.githubLink,
            linkedin_link: homeData.linkedinLink,
            instagram_link: homeData.instagramLink,
            updated_at: new Date().toISOString()
        };

        // Check if exists
        const { data: existing } = await supabase
            .from('home_content')
            .select('id')
            .single();

        if (existing) {
            const { error } = await supabase
                .from('home_content')
                .update(dbData)
                .eq('id', existing.id);
            if (error) throw error;
        } else {
            const { error } = await supabase
                .from('home_content')
                .insert([dbData]);
            if (error) throw error;
        }
    } catch (error) {
        console.error('Error updating home data:', error);
        throw error;
    }
};

// ===== ABOUT CONTENT OPERATIONS =====

export const getAboutData = async () => {
    try {
        const { data, error } = await supabase
            .from('about_content')
            .select('*')
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null; // No rows found
            throw error;
        }
        return data;
    } catch (error) {
        console.error('Error fetching about data:', error);
        return null;
    }
};

export const updateAboutData = async (aboutData) => {
    try {
        const dbData = {
            heading: aboutData.heading,
            description: aboutData.description,
            activities: aboutData.activities,
            quote: aboutData.quote,
            quote_author: aboutData.quoteAuthor,
            updated_at: new Date().toISOString()
        };

        // Check if exists
        const { data: existing } = await supabase
            .from('about_content')
            .select('id')
            .single();

        if (existing) {
            const { error } = await supabase
                .from('about_content')
                .update(dbData)
                .eq('id', existing.id);
            if (error) throw error;
        } else {
            const { error } = await supabase
                .from('about_content')
                .insert([dbData]);
            if (error) throw error;
        }
    } catch (error) {
        console.error('Error updating about data:', error);
        throw error;
    }
};

// ===== SKILLS OPERATIONS =====

export const getSkills = async (category) => {
    try {
        let query = supabase
            .from('skills')
            .select('*')
            .order('display_order', { ascending: true });

        if (category) {
            query = query.eq('category', category);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching skills:', error);
        return [];
    }
};

export const addSkill = async (skill) => {
    try {
        const { data, error } = await supabase
            .from('skills')
            .insert([{
                name: skill.name,
                icon_name: skill.iconName,
                category: skill.category,
                display_order: skill.displayOrder || 999,
                created_at: new Date().toISOString()
            }])
            .select();

        if (error) throw error;
        return data[0];
    } catch (error) {
        console.error('Error adding skill:', error);
        throw error;
    }
};

export const updateSkill = async (id, skill) => {
    try {
        const { error } = await supabase
            .from('skills')
            .update({
                name: skill.name,
                icon_name: skill.iconName,
                display_order: skill.displayOrder
            })
            .eq('id', id);

        if (error) throw error;
    } catch (error) {
        console.error('Error updating skill:', error);
        throw error;
    }
};

export const deleteSkill = async (id) => {
    try {
        const { error } = await supabase
            .from('skills')
            .delete()
            .eq('id', id);

        if (error) throw error;
    } catch (error) {
        console.error('Error deleting skill:', error);
        throw error;
    }
};
