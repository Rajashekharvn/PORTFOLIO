import { supabase } from '../supabaseClient';

export const uploadFile = async (file, path) => {
    try {
        let bucket = '';
        let filePath = path;

        if (path.startsWith('resumes/')) {
            bucket = 'resumes';
            filePath = path.replace('resumes/', '');
        } else if (path.startsWith('projects/')) {
            bucket = 'projects';
            filePath = path.replace('projects/', '');
        } else if (path.startsWith('certificates/')) {
            bucket = 'certificates';
            filePath = path.replace('certificates/', '');
        } else if (path.startsWith('portfolio-images/')) {
            bucket = 'portfolio-images';
            filePath = path.replace('portfolio-images/', '');
        } else {
            throw new Error('Unknown storage path');
        }

        const { error } = await supabase.storage
            .from(bucket)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: true
            });

        if (error) throw error;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        return publicUrl;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
};

export const deleteFile = async (path) => {
    try {
        let bucket = '';
        let filePath = path;

        if (path.startsWith('resumes/')) {
            bucket = 'resumes';
            filePath = path.replace('resumes/', '');
        } else if (path.startsWith('projects/')) {
            bucket = 'projects';
            filePath = path.replace('projects/', '');
        } else if (path.startsWith('certificates/')) {
            bucket = 'certificates';
            filePath = path.replace('certificates/', '');
        } else if (path.startsWith('portfolio-images/')) {
            bucket = 'portfolio-images';
            filePath = path.replace('portfolio-images/', '');
        }

        const { error } = await supabase.storage
            .from(bucket)
            .remove([filePath]);

        if (error) throw error;
    } catch (error) {
        console.error('Error deleting file:', error);
        throw error;
    }
};
