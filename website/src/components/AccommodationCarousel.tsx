"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./AccommodationCarousel.module.css";

gsap.registerPlugin(ScrollTrigger);

// Placeholder images — user will replace these
const images = [
    { alt: "Salon et espace de vie", color: "#1a2332" },
    { alt: "Chambre avec vue montagne", color: "#1b2535" },
    { alt: "Cuisine équipée", color: "#1c2638" },
    { alt: "Salle de bain", color: "#1d273b" },
    { alt: "Vue extérieure de la résidence", color: "#1e283e" },
    { alt: "Terrasse avec panorama", color: "#1f2941" },
];

export default function AccommodationCarousel() {
    const trackRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const track = trackRef.current;
            const container = containerRef.current;
            if (!track || !container) return;

            const totalScroll = track.scrollWidth - container.offsetWidth;

            gsap.to(track, {
                x: -totalScroll,
                ease: "none",
                scrollTrigger: {
                    trigger: container,
                    start: "top 20%",
                    end: `+=${totalScroll}`,
                    scrub: 0.8,
                    pin: true,
                    pinSpacing: true,
                    anticipatePin: 1,
                },
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className={styles.container}>
            <div ref={trackRef} className={styles.track}>
                {images.map((img, i) => (
                    <div
                        key={i}
                        className={styles.slide}
                        style={{
                            background: `linear-gradient(135deg, ${img.color} 0%, ${img.color}88 100%)`,
                        }}
                    >
                        <div className={styles.slideContent}>
                            <span className={styles.slideNumber}>
                                {String(i + 1).padStart(2, "0")}
                            </span>
                            <span className={styles.slideLabel}>{img.alt}</span>
                            <span className={styles.slidePlaceholder}>📸</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
