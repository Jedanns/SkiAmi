"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Users, Calendar, MessageSquare, Car, Home } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import CreateGroupDialog from "@/components/trips/CreateGroupDialog";

interface Trip {
    id: string;
    name: string;
    description: string;
    location: string;
    start_date: string;
    end_date: string;
    image_url: string;
}

interface Group {
    id: string;
    name: string;
    description: string;
    member_count?: number; // Calculated field if possible, or fetch separately
}

export default function TripDashboard() {
    const params = useParams();
    const router = useRouter();
    const [trip, setTrip] = useState<Trip | null>(null);
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    const fetchTripData = useCallback(async () => {
        try {
            // Fetch Trip
            const { data: tripData, error: tripError } = await supabase
                .from("trips")
                .select("*")
                .eq("id", params.id)
                .single();

            if (tripError) throw tripError;
            setTrip(tripData);

            // Fetch Groups
            const { data: groupsData, error: groupsError } = await supabase
                .from("groups")
                .select("*")
                .eq("trip_id", params.id);

            if (groupsError) throw groupsError;
            setGroups(groupsData || []);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [params.id, supabase]);

    useEffect(() => {
        fetchTripData();
    }, [fetchTripData]);

    if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;
    if (!trip) return <div>Voyage introuvable</div>;

    return (
        <div className="min-h-screen pb-20">
            {/* Hero Header */}
            <div className="relative h-[300px] w-full bg-muted">
                {trip.image_url ? (
                    <Image src={trip.image_url} alt={trip.name} fill className="object-cover" />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-20" />
                )}
                <div className="absolute inset-0 bg-black/40" />
                <div className="container relative h-full flex flex-col justify-end pb-8 text-white">
                    <h1 className="text-4xl font-bold mb-2">{trip.name}</h1>
                    <div className="flex items-center gap-4 text-sm opacity-90">
                        <span>{trip.location}</span>
                        <span>•</span>
                        <span>
                            {format(new Date(trip.start_date), "d MMM", { locale: fr })} - {format(new Date(trip.end_date), "d MMM yyyy", { locale: fr })}
                        </span>
                    </div>
                </div>
            </div>

            <div className="container py-8">
                <Tabs defaultValue="groups" className="w-full">
                    <TabsList className="w-full justify-start overflow-x-auto h-auto p-1 bg-transparent border-b rounded-none mb-6">
                        <TabsTrigger value="groups" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-4 py-2">
                            <Users className="mr-2 h-4 w-4" /> Groupes
                        </TabsTrigger>
                        <TabsTrigger value="planning" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-4 py-2">
                            <Calendar className="mr-2 h-4 w-4" /> Planning
                        </TabsTrigger>
                        <TabsTrigger value="chat" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-4 py-2">
                            <MessageSquare className="mr-2 h-4 w-4" /> Chat Global
                        </TabsTrigger>
                        <TabsTrigger value="transport" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-4 py-2">
                            <Car className="mr-2 h-4 w-4" /> Ka-chow
                        </TabsTrigger>
                        <TabsTrigger value="housing" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-4 py-2">
                            <Home className="mr-2 h-4 w-4" /> Mimir
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="groups" className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-semibold">Les Groupes</h2>
                            <CreateGroupDialog tripId={trip.id as string} onGroupCreated={fetchTripData} />
                        </div>

                        {groups.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 border border-dashed rounded-lg bg-card/50">
                                <Users className="h-10 w-10 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-medium">Aucun groupe pour le moment</h3>
                                <p className="text-sm text-muted-foreground mb-4">Créez le premier groupe pour commencer l'organisation.</p>
                                <CreateGroupDialog tripId={trip.id as string} onGroupCreated={fetchTripData} />
                            </div>
                        ) : (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {groups.map((group) => (
                                    <Card key={group.id} className="hover:shadow-md transition-shadow">
                                        <CardHeader>
                                            <CardTitle>{group.name}</CardTitle>
                                            <CardDescription>{group.description || "Pas de description"}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <Button variant="outline" className="w-full" onClick={() => router.push(`/trips/${trip.id}/groups/${group.id}`)}>
                                                Voir le groupe
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="planning">
                        <div className="p-10 text-center text-muted-foreground">
                            Planning global à venir...
                        </div>
                    </TabsContent>

                    <TabsContent value="chat">
                        <div className="p-10 text-center text-muted-foreground">
                            Chat global à venir...
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
