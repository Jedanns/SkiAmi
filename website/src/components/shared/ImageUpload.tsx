"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface ImageUploadProps {
    url: string | null;
    onUpload: (url: string) => void;
    bucket?: string;
    aspectRatio?: "square" | "video" | "wide";
    className?: string;
}

export default function ImageUpload({
    url,
    onUpload,
    bucket = "images",
    aspectRatio = "wide",
    className
}: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const supabase = createClient();

    async function uploadImage(event: React.ChangeEvent<HTMLInputElement>) {
        try {
            setUploading(true);

            if (!event.target.files || event.target.files.length === 0) {
                return;
            }

            const file = event.target.files[0];
            const fileExt = file.name.split(".").pop();
            const filePath = `${Math.random()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
            onUpload(data.publicUrl);
            toast.success("Image téléchargée !");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setUploading(false);
        }
    }

    const removeImage = () => {
        onUpload("");
    };

    return (
        <div className={`relative flex flex-col items-center justify-center w-full border-2 border-dashed border-border rounded-lg bg-card/50 hover:bg-card/80 transition-colors ${className}`}>
            {url ? (
                <div className="relative w-full h-full min-h-[200px] overflow-hidden rounded-lg">
                    <Image
                        src={url}
                        alt="Uploaded image"
                        fill
                        className="object-cover"
                    />
                    <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={removeImage}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            ) : (
                <label className="flex flex-col items-center justify-center w-full h-full min-h-[200px] cursor-pointer">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {uploading ? (
                            <Loader2 className="h-10 w-10 text-muted-foreground animate-spin mb-3" />
                        ) : (
                            <Upload className="h-10 w-10 text-muted-foreground mb-3" />
                        )}
                        <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-semibold">Cliquez pour télécharger</span> ou glissez-déposez
                        </p>
                        <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF (MAX. 2MB)</p>
                    </div>
                    <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={uploadImage}
                        disabled={uploading}
                    />
                </label>
            )}
        </div>
    );
}
