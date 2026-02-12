const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const BUCKET_NAME = "media";

/**
 * Returns the public URL for a file in the Supabase Storage `media` bucket.
 * @param path - Path relative to the bucket root, e.g. "images/hero-poster.jpg"
 */
export function getMediaUrl(path: string): string {
    return `${supabaseUrl}/storage/v1/object/public/${BUCKET_NAME}/${path}`;
}
