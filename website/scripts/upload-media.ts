/**
 * Upload all media files from public/ to Supabase Storage bucket "media".
 *
 * Prerequisites:
 *   1. Create a PUBLIC bucket named "media" in your Supabase dashboard
 *   2. Set SUPABASE_SERVICE_ROLE_KEY in your .env.local (temporary, for upload only)
 *
 * Usage:
 *   npx tsx scripts/upload-media.ts
 */

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error(
        "❌ Missing env vars. Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local"
    );
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const BUCKET = "media";
const PUBLIC_DIR = path.resolve(__dirname, "../public");

// Files to upload (relative to public/)
const mediaFiles = [
    "images/hero-poster.jpg",
    "images/val-cenis.jpg",
    "images/winter.jpg",
    "images/accommodation/1.avif",
    "images/accommodation/2.avif",
    "images/accommodation/3.avif",
    "images/accommodation/4.avif",
    "images/accommodation/5.avif",
    "images/accommodation/6.avif",
    "images/accommodation/7.avif",
    "images/accommodation/8.avif",
    "images/accommodation/9.avif",
    "images/accommodation/10.avif",
    "videos/hero.mp4",
];

const MIME_TYPES: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".avif": "image/avif",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".mp4": "video/mp4",
    ".webm": "video/webm",
};

async function uploadFile(filePath: string) {
    const absolutePath = path.join(PUBLIC_DIR, filePath);

    if (!fs.existsSync(absolutePath)) {
        console.warn(`⚠️  File not found, skipping: ${absolutePath}`);
        return;
    }

    const fileBuffer = fs.readFileSync(absolutePath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    const { error } = await supabase.storage
        .from(BUCKET)
        .upload(filePath, fileBuffer, {
            contentType,
            upsert: true,
        });

    if (error) {
        console.error(`❌ Failed to upload ${filePath}:`, error.message);
    } else {
        console.log(`✅ Uploaded: ${filePath}`);
    }
}

async function main() {
    console.log(`\n📦 Uploading ${mediaFiles.length} files to bucket "${BUCKET}"...\n`);

    for (const file of mediaFiles) {
        await uploadFile(file);
    }

    console.log("\n🎉 Done!\n");
}

main();
