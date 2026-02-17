"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";

interface AvatarUploadProps {
    url: string | null;
    onUpload: (url: string) => void;
    fullName?: string;
}

export default function AvatarUpload({ url, onUpload, fullName }: AvatarUploadProps) {
    const [uploading, setUploading] = useState(false);
    const supabase = createClient();

    async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
        try {
            setUploading(true);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error("Vous devez sélectionner une image.");
            }

            const file = event.target.files[0];
            const fileExt = file.name.split(".").pop();
            const filePath = `${Math.random()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from("avatars")
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
            onUpload(data.publicUrl);
            toast.success("Avatar mis à jour !");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setUploading(false);
        }
    }

    return (
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
            <Avatar className="h-24 w-24 border-2 border-border">
                <AvatarImage src={url || ""} alt="Avatar" />
                <AvatarFallback className="text-2xl">{fullName?.charAt(0) || "?"}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
                <Button variant="outline" size="sm" className="relative cursor-pointer" disabled={uploading}>
                    {uploading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Upload className="mr-2 h-4 w-4" />
                    )}
                    {uploading ? "Envoi..." : "Changer l'avatar"}
                    <input
                        type="file"
                        className="absolute inset-0 cursor-pointer opacity-0"
                        accept="image/*"
                        onChange={uploadAvatar}
                        disabled={uploading}
                    />
                </Button>
                <p className="text-xs text-muted-foreground text-center sm:text-left">
                    JPG, PNG ou GIF. Max 2MB.
                </p>
            </div>
        </div>
    );
}
