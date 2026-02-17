"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, Plus } from "lucide-react";

const carSchema = z.object({
    name: z.string().min(2, "Nom du véhicule requis"),
    capacity: z.number().min(1, "Au moins 1 place").max(9, "Max 9 places"),
    description: z.string().optional(),
});

interface AddCarDialogProps {
    groupId: string;
    onCarAdded?: () => void;
}

export default function AddCarDialog({ groupId, onCarAdded }: AddCarDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const form = useForm<z.infer<typeof carSchema>>({
        resolver: zodResolver(carSchema),
        defaultValues: {
            name: "",
            capacity: 4,
            description: "",
        },
    });

    async function onSubmit(values: z.infer<typeof carSchema>) {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Non connecté");

            const { error } = await supabase.from("cars").insert({
                group_id: groupId,
                owner_id: user.id,
                name: values.name,
                capacity: values.capacity,
                description: values.description,
                is_active: true, // Auto-activate for now
            });

            if (error) throw error;

            toast.success("Voiture ajoutée !");
            setOpen(false);
            form.reset();
            if (onCarAdded) onCarAdded();

        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" /> Ajouter une voiture
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Ajouter un véhicule</DialogTitle>
                    <DialogDescription>
                        Proposez votre voiture pour le covoiturage.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nom du véhicule</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Peugeot 208" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="capacity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre de places (chauffeur inclus)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min={1}
                                            max={9}
                                            {...field}
                                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description (Optionnel)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Avec coffre de toit..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Ajouter
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
