"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar"; // Ensure this exists (DayPicker)
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import ImageUpload from "@/components/shared/ImageUpload";

const tripSchema = z.object({
    name: z.string().min(3, "Le nom doit faire au moins 3 caractères"),
    description: z.string().optional(),
    location: z.string().min(2, "Veuillez indiquer un lieu"),
    dateRange: z.object({
        from: z.date(),
        to: z.date(),
    }).required(),
    image_url: z.string().optional(),
});

type TripFormValues = z.infer<typeof tripSchema>;

export default function CreateTripPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const form = useForm<TripFormValues>({
        resolver: zodResolver(tripSchema),
        defaultValues: {
            name: "",
            description: "",
            location: "",
            image_url: "",
        },
    });

    async function onSubmit(data: TripFormValues) {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Vous devez être connecté.");

            // 1. Create Trip
            const { data: trip, error: tripError } = await supabase
                .from("trips")
                .insert({
                    name: data.name,
                    description: data.description,
                    location: data.location,
                    start_date: data.dateRange.from.toISOString(),
                    end_date: data.dateRange.to.toISOString(),
                    image_url: data.image_url,
                    created_by: user.id
                })
                .select()
                .single();

            if (tripError) throw tripError;

            // 2. Add creator as Admin Member
            const { error: memberError } = await supabase
                .from("trip_members")
                .insert({
                    trip_id: trip.id,
                    user_id: user.id,
                    role: "admin"
                });

            if (memberError) {
                // If this fails, we might want to delete the trip or warn user. 
                // For now just throw.
                throw memberError;
            }

            toast.success("Voyage créé avec succès !");
            router.push(`/trips/${trip.id}`);
            router.refresh();

        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container max-w-3xl py-10">
            <Card>
                <CardHeader>
                    <CardTitle>Nouveau Voyage</CardTitle>
                    <CardDescription>
                        Créez un nouveau voyage pour inviter vos amis.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                            <FormField
                                control={form.control}
                                name="image_url"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Image de couverture</FormLabel>
                                        <FormControl>
                                            <ImageUpload
                                                url={field.value || null}
                                                onUpload={field.onChange}
                                                bucket="trips"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid gap-4 sm:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nom du voyage</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ski à Val Tho" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="location"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Destination</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Val Thorens, France" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="dateRange"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Dates du séjour</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        id="date"
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full justify-start text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {field.value?.from ? (
                                                            field.value.to ? (
                                                                <>
                                                                    {format(field.value.from, "LLL dd, y", { locale: fr })} -{" "}
                                                                    {format(field.value.to, "LLL dd, y", { locale: fr })}
                                                                </>
                                                            ) : (
                                                                format(field.value.from, "LLL dd, y", { locale: fr })
                                                            )
                                                        ) : (
                                                            <span>Choisir une période</span>
                                                        )}
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    initialFocus
                                                    mode="range"
                                                    defaultMonth={field.value?.from}
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    numberOfMonths={2}
                                                    disabled={{ before: new Date() }}
                                                    locale={fr}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormDescription>
                                            Sélectionnez la période de votre séjour au ski.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Quelques mots sur le voyage..."
                                                className="resize-none"
                                                rows={4}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" size="lg" className="w-full" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Créer le voyage
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
