"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import AvatarUpload from "@/components/profile/AvatarUpload";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const profileSchema = z.object({
    username: z.string().min(2, "Le pseudo doit faire au moins 2 caractères.").optional().or(z.literal("")),
    full_name: z.string().min(2, "Le nom doit faire au moins 2 caractères.").optional().or(z.literal("")),
    phone: z.string().optional(),
    address: z.string().optional(),
    bio: z.string().max(500, "La bio ne peut pas dépasser 500 caractères.").optional(),
    whatsapp: z.string().optional(), // Could add regex for URL validation
    avatar_url: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const supabase = createClient();

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            username: "",
            full_name: "",
            phone: "",
            address: "",
            bio: "",
            whatsapp: "",
            avatar_url: "",
        },
    });

    useEffect(() => {
        getProfile();
    }, []);

    async function getProfile() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();

            if (data) {
                form.reset({
                    username: data.username || "",
                    full_name: data.full_name || "",
                    phone: data.phone || "",
                    address: data.address || "",
                    bio: data.bio || "",
                    whatsapp: data.social_links?.whatsapp || "",
                    avatar_url: data.avatar_url || "",
                });
            }
        } catch (error: any) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function onSubmit(data: ProfileFormValues) {
        setSaving(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            setSaving(false);
            return;
        }

        const updates = {
            id: user.id,
            username: data.username,
            full_name: data.full_name,
            phone: data.phone,
            address: data.address,
            bio: data.bio,
            avatar_url: data.avatar_url,
            social_links: { whatsapp: data.whatsapp },
            updated_at: new Date().toISOString(),
        };

        const { error } = await supabase.from("profiles").upsert(updates);

        if (error) {
            toast.error(error.message);
        } else {
            toast.success("Profil mis à jour !");
        }
        setSaving(false);
    }

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container max-w-2xl py-10">
            <Card>
                <CardHeader>
                    <CardTitle>Votre Profil</CardTitle>
                    <CardDescription>
                        Gérez vos informations personnelles et votre apparence sur SkiAmi.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-8">
                        <AvatarUpload
                            url={form.watch("avatar_url") || null}
                            onUpload={(url) => form.setValue("avatar_url", url, { shouldDirty: true })}
                            fullName={form.watch("full_name")}
                        />
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Pseudo</FormLabel>
                                            <FormControl>
                                                <Input placeholder="SkiLover88" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="full_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nom complet</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Jean Bon" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="bio"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bio</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Dites-nous en plus sur vous..."
                                                className="resize-none"
                                                rows={4}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Brève description affichée sur votre profil.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid gap-4 sm:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Téléphone</FormLabel>
                                            <FormControl>
                                                <Input placeholder="06 12 34 56 78" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="whatsapp"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>WhatsApp</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://wa.me/..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Adresse</FormLabel>
                                        <FormControl>
                                            <Input placeholder="123 rue de la Glisse" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" disabled={saving}>
                                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Enregistrer les modifications
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
