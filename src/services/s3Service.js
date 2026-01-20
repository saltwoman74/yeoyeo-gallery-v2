import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const BUCKET_NAME = import.meta.env.VITE_AWS_BUCKET_NAME;
const REGION = import.meta.env.VITE_AWS_REGION || 'ap-southeast-2';

// Check if AWS credentials exist
const isAwsConfigured = import.meta.env.VITE_AWS_ACCESS_KEY_ID && import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;

let s3Client;
if (isAwsConfigured) {
    s3Client = new S3Client({
        region: REGION,
        credentials: {
            accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
            secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
        },
    });
}

// Generate presigned URL for upload
async function getPresignedUploadUrl(key, contentType) {
    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        ContentType: contentType,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return url;
}

export const uploadImage = async (file, folderPath) => {
    if (!isAwsConfigured) {
        console.log("AWS Not Configured. Mocking Upload.");
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { success: true, url: URL.createObjectURL(file), key: `${folderPath}/${file.name}` };
    }

    try {
        const key = `${folderPath}/${Date.now()}_${file.name}`;

        // Get presigned URL
        const presignedUrl = await getPresignedUploadUrl(key, file.type);

        // Upload directly to S3 using presigned URL (no SDK needed!)
        const uploadResponse = await fetch(presignedUrl, {
            method: 'PUT',
            body: file,
            headers: {
                'Content-Type': file.type,
            },
        });

        if (!uploadResponse.ok) {
            throw new Error(`Upload failed: ${uploadResponse.statusText}`);
        }

        return {
            success: true,
            url: `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${key}`,
            key: key
        };
    } catch (error) {
        console.error("S3 Upload Error:", error);
        alert(`Upload Failed (업로드 실패): ${error.message}\nCheck console for details.`);
        throw error;
    }
};

export const listImages = async (folderPath) => {
    // Keep existing implementation
    if (!isAwsConfigured) {
        console.log("AWS Not Configured. Returning Mock Data.");
        return [
            { id: '1', url: 'https://images.unsplash.com/photo-1600585154340-be6191da95b4?w=800', key: 'living_room_01.jpg' },
            { id: '2', url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800', key: 'kitchen_01.jpg' },
            { id: '3', url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800', key: 'bedroom_01.jpg' },
        ];
    }

    try {
        const { ListObjectsV2Command } = await import("@aws-sdk/client-s3");
        const command = new ListObjectsV2Command({
            Bucket: BUCKET_NAME,
            Prefix: folderPath,
        });

        const response = await s3Client.send(command);

        if (!response.Contents) return [];

        return response.Contents.map((item) => ({
            id: item.Key, // Use S3 key as stable ID instead of index
            url: `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${item.Key}`,
            key: item.Key
        }));
    } catch (error) {
        console.error("S3 List Error:", error);
        return [];
    }
};

export const deleteImage = async (key) => {
    if (!isAwsConfigured) {
        console.log("AWS Not Configured. Mocking Delete.");
        await new Promise(resolve => setTimeout(resolve, 500));
        return { success: true };
    }

    try {
        const { DeleteObjectCommand } = await import("@aws-sdk/client-s3");
        const command = new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
        });

        await s3Client.send(command);
        return { success: true };
    } catch (error) {
        console.error("S3 Delete Error:", error);
        alert(`Delete Failed (삭제 실패): ${error.message}`);
        throw error;
    }
};

// Video functions - use Supabase for cross-device sync
import { supabase } from '../lib/supabase';

export const listVideos = async () => {
    try {
        const { data, error } = await supabase
            .from('videos')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Supabase error loading videos:', error);
            return [];
        }

        console.log('Loaded videos from Supabase:', data);
        return data || [];
    } catch (error) {
        console.error('Error loading videos:', error);
        return [];
    }
};

export const addVideo = async (title, url) => {
    try {
        const { data, error } = await supabase
            .from('videos')
            .insert([{ title, url }])
            .select()
            .single();

        if (error) {
            console.error('Supabase error adding video:', error);
            throw error;
        }

        console.log('Video added to Supabase:', data);
        return { success: true, video: data };
    } catch (error) {
        console.error('Error adding video:', error);
        throw error;
    }
};

export const deleteVideo = async (id) => {
    try {
        const { error } = await supabase
            .from('videos')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Supabase error deleting video:', error);
            throw error;
        }

        console.log('Video deleted from Supabase:', id);
        return { success: true };
    } catch (error) {
        console.error('Error deleting video:', error);
        throw error;
    }
};
