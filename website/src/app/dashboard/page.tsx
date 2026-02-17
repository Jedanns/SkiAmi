"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Loader2,
    Plus,
    LogOut,
    Ticket,
    Users,
    MapPin,
    Calendar,
    ArrowRight,
    TrendingUp,
    Briefcase
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

// --- Components ---

const StatCard = ({ title, value, icon: Icon, color, delay }: { title: string, value: string | number, icon: any, color: string, delay: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.4 }}
    >
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
                    <h3 className="text-2xl font-bold">{value}</h3>
                </div>
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${color}`}>
                    <Icon className="h-6 w-6 text-white" />
                </div>
            </CardContent>
        </Card>
    </motion.div>
);

const TripCard = ({ trip, index }: { trip: any, index: number }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 + (index * 0.1), duration: 0.4 }}
    >
        <Link href={`/trips/${trip.id}`}>
            <Card className="group cursor-pointer border-none shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden h-full">
                <div className="relative h-48 w-full overflow-hidden">
                    {trip.image_url ? (
                        <img
                            src={trip.image_url}
                            alt={trip.name}
                            className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                            <MapPin className="h-10 w-10 text-primary/40" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <span className="text-white font-medium flex items-center gap-2">
                            Voir le voyage <ArrowRight className="h-4 w-4" />
                        </span>
                    </div>
                </div>
                <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{trip.name}</h3>
                        {trip.is_admin && <span className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-full font-bold uppercase tracking-wide">Admin</span>}
                    </div>

                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                        <MapPin className="mr-1 h-3.5 w-3.5" />
                        {trip.location}
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                        <div className="flex items-center text-xs font-medium text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md">
                            <Calendar className="mr-1.5 h-3.5 w-3.5" />
                            {trip.start_date ? format(new Date(trip.start_date), "d MMM", { locale: fr }) : "Date inconnue"}
                        </div>
                        <div className="flex -space-x-2">
                            {/* Placeholder for member avatars */}
                            <div className="h-6 w-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[8px] font-bold">You</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    </motion.div>
);

// --- Main Page ---

export default function DashboardPage() {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [trips, setTrips] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchTrips = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login");
                return;
            }
            setUser(user);

            // Fetch trips where user is a member
            const { data } = await supabase
                .from("trips")
                .select("*, trip_members!inner(user_id, role)")
                .eq("trip_members.user_id", user.id);

            if (data) {
                // Annotate with is_admin
                const processed = data.map((t: any) => ({
                    ...t,
                    is_admin: t.trip_members[0]?.role === 'admin'
                }));
                setTrips(processed);
            }
            setLoading(false);
        };
        fetchTrips();
    }, [router, supabase]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    if (loading) return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50/50">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );

    return (
        <div className="min-h-screen pb-20">
            {/* Top Navigation Bar style */}
            <div className="sticky top-0 z-30 flex h-16 items-center px-6 bg-white/80 backdrop-blur-md border-b border-border/40 justify-between">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                        <span className="font-bold text-white">S</span>
                    </div>
                    <span className="font-bold text-lg tracking-tight">SkiAmi</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground hidden sm:inline-block">
                        Bonjour, <span className="font-medium text-foreground">{user?.user_metadata?.full_name || user?.email}</span>
                    </span>
                    <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-muted-foreground hover:text-destructive">
                        <LogOut className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Déconnexion</span>
                    </Button>
                </div>
            </div>

            <main className="container max-w-7xl mx-auto px-6 py-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Tableau de bord</h1>
                        <p className="text-muted-foreground mt-1">Gérez vos séjours, vos groupes et préparez votre départ.</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex gap-3"
                    >
                        <Button onClick={() => router.push("/trips/new")} className="shadow-lg shadow-primary/20 transition-all hover:scale-105">
                            <Plus className="mr-2 h-4 w-4" /> Nouveau Voyage
                        </Button>
                    </motion.div>
                </div>


                {/* Content Grid */}
                <div className="space-y-6 mt-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold tracking-tight">Vos Aventures</h2>
                    </div>

                    {trips.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-card border rounded-2xl p-12 text-center shadow-sm"
                        >
                            <div className="mx-auto h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                <Plus className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Aucun voyage pour le moment</h3>
                            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                                Créez votre premier séjour ski entre amis.
                            </p>
                            <Button onClick={() => router.push("/trips/new")}>
                                Créer un voyage
                            </Button>
                        </motion.div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {/* Create New Trip Card (Clean Integration) */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 }}
                            >
                                <div
                                    onClick={() => router.push("/trips/new")}
                                    className="h-full min-h-[300px] border-2 border-dashed border-border hover:border-primary/50 hover:bg-accent/50 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group"
                                >
                                    <div className="h-14 w-14 rounded-full bg-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Plus className="h-7 w-7 text-primary" />
                                    </div>
                                    <h3 className="font-semibold text-lg text-foreground">Nouveau Voyage</h3>
                                    <p className="text-sm text-muted-foreground mt-1">Organiser un séjour</p>
                                </div>
                            </motion.div>

                            {trips.map((trip, idx) => (
                                <TripCard key={trip.id} trip={trip} index={idx} />
                            ))}
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
}
