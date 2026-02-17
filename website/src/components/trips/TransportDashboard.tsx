"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, Car, User, Plus, X } from "lucide-react";
import AddCarDialog from "./AddCarDialog";

interface Props {
    groupId: string;
}

interface TransportProfile {
    user_id: string;
    has_license: boolean;
    has_car: boolean;
    driving_rating?: number;
}

interface CarData {
    id: string;
    name: string;
    capacity: number;
    owner_id: string;
    description?: string;
    owner?: { full_name: string }; // Joined
    passengers?: { user_id: string, user: { full_name: string, avatar_url: string } }[]; // Joined
}

interface GroupMember {
    user_id: string;
    profiles: { full_name: string, avatar_url: string };
}

export default function TransportDashboard({ groupId }: Props) {
    const [loading, setLoading] = useState(true);
    const [myProfile, setMyProfile] = useState<TransportProfile | null>(null);
    const [cars, setCars] = useState<CarData[]>([]);
    const [members, setMembers] = useState<GroupMember[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const supabase = createClient();

    const fetchData = useCallback(async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            setUserId(user.id);

            // 1. Fetch Transport Profile
            const { data: tp } = await supabase
                .from("transport_profiles")
                .select("*")
                .eq("group_id", groupId)
                .eq("user_id", user.id)
                .single();
            setMyProfile(tp);

            // 2. Fetch Cars with passengers
            const { data: carsData } = await supabase
                .from("cars")
                .select(`
                    *,
                    owner:profiles!owner_id(full_name),
                    passengers:car_passengers(
                        user_id,
                        user:profiles!user_id(full_name, avatar_url)
                    )
                `)
                .eq("group_id", groupId)
                .eq("is_active", true);
            setCars(carsData as any || []);

            // 3. Fetch Group Members to calculate pedestrians
            const { data: membersData } = await supabase
                .from("group_members")
                .select("user_id, profiles(full_name, avatar_url)")
                .eq("group_id", groupId);
            setMembers(membersData as any || []);

        } catch (error) {
            console.error("Error fetching transport data", error);
        } finally {
            setLoading(false);
        }
    }, [groupId, supabase]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Actions
    async function updatePreference(field: "has_license" | "has_car", value: boolean) {
        if (!userId) return;
        const updates = {
            group_id: groupId,
            user_id: userId,
            [field]: value,
            updated_at: new Date().toISOString(),
        };

        const { error } = await supabase.from("transport_profiles").upsert(updates);
        if (error) toast.error("Erreur mise à jour");
        else {
            fetchData(); // Refresh to ensure sync
        }
    }

    async function joinCar(carId: string) {
        if (!userId) return;
        // Check if already in a car
        const inCar = cars.some(c => c.passengers?.some(p => p.user_id === userId));
        if (inCar) {
            toast.error("Vous êtes déjà dans une voiture ! Quittez-la d'abord.");
            return;
        }

        const { error } = await supabase.from("car_passengers").insert({
            car_id: carId,
            user_id: userId
        });

        if (error) toast.error(error.message);
        else {
            toast.success("Embarquement réussi !");
            fetchData();
        }
    }

    async function leaveCar(carId: string) {
        if (!userId) return;
        const { error } = await supabase
            .from("car_passengers")
            .delete()
            .eq("car_id", carId)
            .eq("user_id", userId);

        if (error) toast.error(error.message);
        else {
            toast.success("Vous êtes piéton.");
            fetchData();
        }
    }

    // Derived State
    const passengersDict = new Set<string>();
    cars.forEach(c => c.passengers?.forEach(p => passengersDict.add(p.user_id)));
    const pedestrians = members.filter(m => !passengersDict.has(m.user_id));

    if (loading) return <Loader2 className="animate-spin" />;

    return (
        <div className="space-y-8">
            {/* 1. Preferences */}
            <Card>
                <CardHeader>
                    <CardTitle>Mes Préférences</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-8">
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="license"
                            checked={myProfile?.has_license || false}
                            onCheckedChange={(c: boolean) => updatePreference("has_license", c)}
                        />
                        <Label htmlFor="license">J'ai le permis</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="has_car"
                            checked={myProfile?.has_car || false}
                            onCheckedChange={(c: boolean) => {
                                updatePreference("has_car", c);
                                if (c && !cars.some(car => car.owner_id === userId)) {
                                    // Could trigger add car dialog automatically here
                                }
                            }}
                        />
                        <Label htmlFor="has_car">J'ai ma voiture</Label>
                    </div>
                    {myProfile?.has_car && (
                        <AddCarDialog groupId={groupId} onCarAdded={fetchData} />
                    )}
                </CardContent>
            </Card>

            {/* 2. Cars Grid */}
            <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Car className="h-6 w-6" /> Voitures ({cars.length})
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {cars.map((car) => {
                        const isPassenger = car.passengers?.some(p => p.user_id === userId);
                        const isFull = (car.passengers?.length || 0) >= car.capacity;

                        return (
                            <Card key={car.id} className="relative">
                                <CardHeader className="pb-2">
                                    <CardTitle>{car.name}</CardTitle>
                                    <CardDescription>Conduit par {car.owner?.full_name || "Inconnu"}</CardDescription>
                                    <Badge variant="secondary" className="absolute top-4 right-4">
                                        {car.passengers?.length || 0}/{car.capacity} places
                                    </Badge>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {car.passengers?.map((p) => (
                                            <div key={p.user_id} className="flex items-center gap-2">
                                                <Avatar className="h-6 w-6">
                                                    <AvatarImage src={p.user.avatar_url} />
                                                    <AvatarFallback className="text-[10px]">{p.user.full_name?.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm">{p.user.full_name}</span>
                                            </div>
                                        ))}
                                        {Array.from({ length: Math.max(0, car.capacity - (car.passengers?.length || 0)) }).map((_, i) => (
                                            <div key={i} className="flex items-center gap-2 opacity-30">
                                                <div className="h-6 w-6 rounded-full bg-muted" />
                                                <span className="text-sm italic">Place libre</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    {isPassenger ? (
                                        <Button variant="destructive" className="w-full" onClick={() => leaveCar(car.id)}>
                                            <X className="mr-2 h-4 w-4" /> Quitter
                                        </Button>
                                    ) : (
                                        <Button
                                            className="w-full"
                                            disabled={isFull}
                                            onClick={() => joinCar(car.id)}
                                        >
                                            {isFull ? "Complet" : "Monter !"}
                                        </Button>
                                    )}
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            </div>

            {/* 3. Pedestrians */}
            <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <User className="h-6 w-6" /> Piétons ({pedestrians.length})
                </h2>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-wrap gap-4">
                            {pedestrians.length === 0 ? (
                                <p className="text-muted-foreground italic">Tout le monde a une place ! 🎉</p>
                            ) : (
                                pedestrians.map((m) => (
                                    <div key={m.user_id} className="flex flex-col items-center gap-1">
                                        <Avatar>
                                            <AvatarImage src={m.profiles.avatar_url} />
                                            <AvatarFallback>{m.profiles.full_name?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-xs text-muted-foreground">{m.profiles.full_name.split(' ')[0]}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
