"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Car, Home, MessageSquare, LayoutDashboard } from "lucide-react";
import TransportDashboard from "@/components/trips/TransportDashboard"; // We will create this

interface Group {
    id: string;
    name: string;
    description: string;
    trip_id: string;
}

export default function GroupPage() {
    const params = useParams();
    const [group, setGroup] = useState<Group | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const getGroup = async () => {
            const { data, error } = await supabase
                .from("groups")
                .select("*")
                .eq("id", params.groupId)
                .single();

            if (data) setGroup(data);
            setLoading(false);
        };
        getGroup();
    }, [params.groupId, supabase]);

    if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;
    if (!group) return <div>Groupe introuvable</div>;

    return (
        <div className="container py-8 pb-24">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">{group.name}</h1>
                <p className="text-muted-foreground">{group.description}</p>
            </div>

            <Tabs defaultValue="transport" className="w-full">
                <TabsList className="w-full justify-start overflow-x-auto h-auto p-1 bg-transparent border-b rounded-none mb-6">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-4 py-2">
                        <LayoutDashboard className="mr-2 h-4 w-4" /> Vue d'ensemble
                    </TabsTrigger>
                    <TabsTrigger value="transport" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-4 py-2">
                        <Car className="mr-2 h-4 w-4" /> Ka-chow (Transport)
                    </TabsTrigger>
                    <TabsTrigger value="housing" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-4 py-2">
                        <Home className="mr-2 h-4 w-4" /> Mimir (Logement)
                    </TabsTrigger>
                    <TabsTrigger value="chat" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-4 py-2">
                        <MessageSquare className="mr-2 h-4 w-4" /> Chat
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                    <Card>
                        <CardHeader>
                            <CardTitle>Membres du groupe</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Liste des membres à venir...</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="transport">
                    <TransportDashboard groupId={group.id} />
                </TabsContent>

                <TabsContent value="housing">
                    <div className="p-10 text-center text-muted-foreground">
                        Module Mimir à venir...
                    </div>
                </TabsContent>

                <TabsContent value="chat">
                    <div className="p-10 text-center text-muted-foreground">
                        Chat de groupe à venir...
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
