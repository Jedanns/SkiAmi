"use client";

import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import LoadingScreen from "./LoadingScreen";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    const lenisRef = useRef<Lenis | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const pathname = usePathname();

    const loadingDuration = pathname === "/" ? 3000 : 750;

    useEffect(() => {
        // Force scroll to top on load/refresh
        if (typeof window !== "undefined") {
            window.scrollTo(0, 0);
            if ("scrollRestoration" in history) {
                history.scrollRestoration = "manual";
            }
        }

        const lenis = new Lenis({
            lerp: 0.1,             // lighter/standard feel
            wheelMultiplier: 1,    // standard speed
            touchMultiplier: 1.5,
        });

        lenisRef.current = lenis;

        // Sync Lenis scroll with GSAP ScrollTrigger
        lenis.on("scroll", ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);

        // Lock scroll while loading
        if (isLoading) {
            lenis.stop();
        } else {
            lenis.start();
        }

        return () => {
            gsap.ticker.remove((time) => { lenis.raf(time * 1000); });
            lenis.destroy();
        };
    }, [isLoading]); // Re-run or re-evaluate when loading changes

    return (
        <>
            <AnimatePresence mode="wait">
                {isLoading && (
                    <LoadingScreen
                        onComplete={() => setIsLoading(false)}
                        duration={loadingDuration}
                    />
                )}
            </AnimatePresence>
            {children}
        </>
    );
}
