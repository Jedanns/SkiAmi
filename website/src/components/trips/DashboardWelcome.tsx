"use client";

import { motion } from "framer-motion";
import SplitText from "@/components/react-bits/SplitText";

interface DashboardWelcomeProps {
    tripName: string;
}

export default function DashboardWelcome({ tripName }: DashboardWelcomeProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
        >
            <h1 className="text-4xl font-bold mb-2">
                <SplitText
                    text={tripName}
                    delay={50}
                    className="text-4xl font-bold"
                />
            </h1>
            <p className="text-muted-foreground">
                Prêt pour l'aventure ? Organisez tout ici.
            </p>
        </motion.div>
    );
}
