import { supabase } from '../supabaseClient';

// ===== RESUME OPERATIONS =====

/**
 * Fetches the resume data from the database
 * @returns {Promise<Object|null>} Resume object containing url, file_name, and uploaded_at, or null if not found
 */
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

/**
 * Updates or inserts resume data in the database
 * @param {Object} resumeData - Resume data object
 * @param {string} resumeData.url - URL of the resume file
 * @param {string} resumeData.fileName - Name of the resume file
 * @param {string} resumeData.uploadedAt - ISO timestamp of upload
 * @throws {Error} If database operation fails
 */
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

/**
 * Fetches all projects from the database, ordered by creation date (newest first)
 * @returns {Promise<Array>} Array of project objects
 */
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

/**
 * Adds a new project to the database
 * @param {Object} project - Project data object
 * @param {string} project.title - Project title
 * @param {string} project.description - Project description
 * @param {Array<string>} project.technologies - Array of technology names
 * @param {string} project.imgPath - Path to project image
 * @param {string} project.ghLink - GitHub repository link
 * @param {string} project.demoLink - Live demo link
 * @param {boolean} project.isBlog - Whether this is a blog post
 * @returns {Promise<Object>} The created project object
 * @throws {Error} If database operation fails
 */
export const addProject = async (project) => {
    try {
        const { data, error } = await supabase
            .from('projects')
            .insert([{
                title: project.title,
                description: project.description,
                technologies: project.technologies,
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

/**
 * Deletes a project from the database
 * @param {number} projectId - ID of the project to delete
 * @throws {Error} If database operation fails
 */
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

/**
 * Updates an existing project in the database
 * @param {number} id - Project ID to update
 * @param {Object} project - Updated project data (same structure as addProject)
 * @throws {Error} If database operation fails
 */
export const updateProject = async (id, project) => {
    try {
        const { error } = await supabase
            .from('projects')
            .update({
                title: project.title,
                description: project.description,
                technologies: project.technologies,
                img_path: project.imgPath,
                gh_link: project.ghLink,
                demo_link: project.demoLink,
                is_blog: project.isBlog,
                updated_at: new Date().toISOString()
            })
            .eq('id', id);

        if (error) throw error;
    } catch (error) {
        console.error('Error updating project:', error);
        throw error;
    }
};

// ===== CERTIFICATES OPERATIONS =====

/**
 * Fetches all certificates from the database, ordered by creation date (newest first)
 * @returns {Promise<Array>} Array of certificate objects
 */
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

/**
 * Adds a new certificate to the database
 * @param {Object} certificate - Certificate data object
 * @param {string} certificate.title - Certificate title
 * @param {string} certificate.issuer - Issuing organization
 * @param {string} certificate.date - Date of issuance
 * @param {string} certificate.imgPath - Path to certificate image
 * @returns {Promise<Object>} The created certificate object
 * @throws {Error} If database operation fails
 */
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

/**
 * Deletes a certificate from the database
 * @param {number} certId - ID of the certificate to delete
 * @throws {Error} If database operation fails
 */
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

/**
 * Uploads an image file to Supabase storage
 * @param {File} file - File object to upload
 * @param {string} bucket - Storage bucket name
 * @param {string} path - Path within the bucket
 * @returns {Promise<string>} Public URL of the uploaded image
 * @throws {Error} If upload fails
 */
export const uploadImage = async (file, bucket, path) => {
    try {
        const { error } = await supabase.storage
            .from(bucket)
            .upload(path, file, { upsert: true });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(path);

        return publicUrl;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

/**
 * Fetches home page content from the database
 * @returns {Promise<Object|null>} Home content object or null if not found
 */
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

/**
 * Updates or inserts home page content in the database
 * @param {Object} homeData - Home page data object
 * @param {string} homeData.heading - Main heading text
 * @param {string} homeData.name - Name to display
 * @param {string} homeData.introTitle - Introduction section title
 * @param {string} homeData.introBody - Introduction section body text
 * @param {string} homeData.githubLink - GitHub profile URL
 * @param {string} homeData.linkedinLink - LinkedIn profile URL
 * @param {string} homeData.instagramLink - Instagram profile URL
 * @param {string} homeData.avatarUrl - Avatar image URL
 * @param {string} homeData.mainImgUrl - Main image URL
 * @throws {Error} If database operation fails
 */
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
            avatar_url: homeData.avatarUrl,
            main_img_url: homeData.mainImgUrl,
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

// ===== CONTACT CONTENT OPERATIONS =====

/**
 * Fetches contact page content from the database
 * @returns {Promise<Object|null>} Contact content object or null if not found
 */
export const getContactData = async () => {
    try {
        const { data, error } = await supabase
            .from('contact_content')
            .select('*')
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null; // No rows found
            throw error;
        }
        return data;
    } catch (error) {
        console.error('Error fetching contact data:', error);
        return null;
    }
};

/**
 * Updates or inserts contact content data in the database
 * @param {Object} contactData - Contact data object
 * @param {string} contactData.email - Email address
 * @param {string} contactData.phone - Phone number
 * @param {string} contactData.location - Location/address
 * @param {string} contactData.github - GitHub profile URL
 * @param {string} contactData.linkedin - LinkedIn profile URL
 * @param {string} contactData.instagram - Instagram profile URL
 * @throws {Error} If database operation fails
 */
export const updateContactData = async (contactData) => {
    try {
        const dbData = {
            email: contactData.email,
            phone: contactData.phone,
            location: contactData.location,
            github: contactData.github,
            linkedin: contactData.linkedin,
            instagram: contactData.instagram,
            updated_at: new Date().toISOString()
        };

        // Check if exists
        const { data: existing, error: selectError } = await supabase
            .from('contact_content')
            .select('id')
            .single();

        // PGRST116 means no rows found, which is fine - we'll insert
        if (selectError && selectError.code !== 'PGRST116') {
            throw selectError;
        }

        if (existing) {
            const { error } = await supabase
                .from('contact_content')
                .update(dbData)
                .eq('id', existing.id);
            if (error) throw error;
        } else {
            const { error } = await supabase
                .from('contact_content')
                .insert([dbData]);
            if (error) throw error;
        }
    } catch (error) {
        console.error('Error updating contact data:', error);
        throw error;
    }
};

// ===== TIMELINE CONTENT OPERATIONS =====

/**
 * Fetches all timeline items from the database, ordered by creation date (newest first)
 * @returns {Promise<Array>} Array of timeline item objects
 */
export const getTimelineData = async () => {
    try {
        const { data, error } = await supabase
            .from('timeline_content')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching timeline data:', error);
        return [];
    }
};

/**
 * Adds a new timeline item to the database
 * @param {Object} itemData - Timeline item data object
 * @throws {Error} If database operation fails
 */
export const addTimelineItem = async (itemData) => {
    try {
        const { error } = await supabase
            .from('timeline_content')
            .insert([itemData]);
        if (error) throw error;
    } catch (error) {
        console.error('Error adding timeline item:', error);
        throw error;
    }
};

/**
 * Updates an existing timeline item in the database
 * @param {number} id - Timeline item ID to update
 * @param {Object} itemData - Updated timeline item data
 * @throws {Error} If database operation fails
 */
export const updateTimelineItem = async (id, itemData) => {
    try {
        const { error } = await supabase
            .from('timeline_content')
            .update(itemData)
            .eq('id', id);
        if (error) throw error;
    } catch (error) {
        console.error('Error updating timeline item:', error);
        throw error;
    }
};

/**
 * Deletes a timeline item from the database
 * @param {number} id - Timeline item ID to delete
 * @throws {Error} If database operation fails
 */
export const deleteTimelineItem = async (id) => {
    try {
        const { error } = await supabase
            .from('timeline_content')
            .delete()
            .eq('id', id);
        if (error) throw error;
    } catch (error) {
        console.error('Error deleting timeline item:', error);
        throw error;
    }
};

// ===== ABOUT CONTENT OPERATIONS =====

/**
 * Fetches about page content from the database
 * @returns {Promise<Object|null>} About content object or null if not found
 */
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

/**
 * Updates or inserts about page content in the database
 * @param {Object} aboutData - About page data object
 * @param {string} aboutData.heading - Page heading
 * @param {string} aboutData.description - About description text
 * @param {Array<string>} aboutData.activities - List of activities/hobbies
 * @param {string} aboutData.quote - Inspirational quote
 * @param {string} aboutData.quoteAuthor - Quote author name
 * @param {Object} aboutData.skillBars - Skill bars data organized by category
 * @throws {Error} If database operation fails
 */
export const updateAboutData = async (aboutData) => {
    try {
        const dbData = {
            heading: aboutData.heading,
            description: aboutData.description,
            activities: aboutData.activities,
            quote: aboutData.quote,
            quote_author: aboutData.quoteAuthor,
            skill_bars: aboutData.skillBars || {
                frontend: [],
                backend: [],
                tools: []
            },
            updated_at: new Date().toISOString()
        };

        // Check if exists
        const { data: existing, error: selectError } = await supabase
            .from('about_content')
            .select('id')
            .single();

        // PGRST116 means no rows found, which is fine - we'll insert
        if (selectError && selectError.code !== 'PGRST116') {
            throw selectError;
        }

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

/**
 * Fetches skills from the database, optionally filtered by category
 * @param {string} [category] - Optional category filter (e.g., 'frontend', 'backend', 'tools')
 * @returns {Promise<Array>} Array of skill objects ordered by display_order
 */
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

/**
 * Adds a new skill to the database
 * @param {Object} skill - Skill data object
 * @param {string} skill.name - Skill name
 * @param {string} skill.iconName - Icon component name (e.g., 'DiJava', 'SiReact')
 * @param {string} skill.category - Skill category
 * @param {number} [skill.displayOrder=999] - Display order (lower numbers appear first)
 * @returns {Promise<Object>} The created skill object
 * @throws {Error} If database operation fails
 */
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

/**
 * Updates an existing skill in the database
 * @param {number} id - Skill ID to update
 * @param {Object} skill - Updated skill data
 * @param {string} skill.name - Skill name
 * @param {string} skill.iconName - Icon component name
 * @param {number} skill.displayOrder - Display order
 * @throws {Error} If database operation fails
 */
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

/**
 * Deletes a skill from the database
 * @param {number} id - Skill ID to delete
 * @throws {Error} If database operation fails
 */
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

// ===== STATS OPERATIONS =====

/**
 * Fetches the current view count from the database
 * @returns {Promise<number>} Current view count, or 0 if not found
 */
export const getStats = async () => {
    try {
        const { data, error } = await supabase
            .from('app_stats')
            .select('views')
            .eq('id', 'portfolio')
            .single();

        if (error) throw error;
        return data ? data.views : 0;
    } catch (error) {
        console.error('Error fetching stats:', error);
        return 0;
    }
};

/**
 * Increments the portfolio view count by 1
 * @returns {Promise<number|null>} New view count, or null if operation fails
 */
export const incrementViews = async () => {
    try {
        // Get current views
        const { data: currentData, error: fetchError } = await supabase
            .from('app_stats')
            .select('views')
            .eq('id', 'portfolio')
            .single();

        if (fetchError) throw fetchError;

        const newViews = (currentData?.views || 0) + 1;

        // Update views
        const { error: updateError } = await supabase
            .from('app_stats')
            .update({ views: newViews })
            .eq('id', 'portfolio');

        if (updateError) throw updateError;

        return newViews;
    } catch (error) {
        console.error('Error incrementing views:', error);
        return null;
    }
};

// ===== MESSAGE OPERATIONS =====

/**
 * Submits a new contact message to the database
 * @param {Object} messageData - Message data object
 * @param {string} messageData.name - Sender's name
 * @param {string} messageData.email - Sender's email
 * @param {string} messageData.message - Message content
 * @returns {Promise<boolean>} True if submission successful
 * @throws {Error} If database operation fails
 */
export const submitMessage = async (messageData) => {
    try {
        const { error } = await supabase
            .from('messages')
            .insert([{
                name: messageData.name,
                email: messageData.email,
                message: messageData.message,
                created_at: new Date().toISOString()
            }]);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error submitting message:', error);
        throw error;
    }
};

/**
 * Fetches all messages from the database, ordered by creation date (newest first)
 * @returns {Promise<Array>} Array of message objects
 */
export const getMessages = async () => {
    try {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching messages:', error);
        return [];
    }
};

/**
 * Deletes a message from the database
 * @param {number} id - Message ID to delete
 * @throws {Error} If database operation fails
 */
export const deleteMessage = async (id) => {
    try {
        const { error } = await supabase
            .from('messages')
            .delete()
            .eq('id', id);

        if (error) throw error;
    } catch (error) {
        console.error('Error deleting message:', error);
        throw error;
    }
};
