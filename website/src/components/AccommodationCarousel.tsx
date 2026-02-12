"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./AccommodationCarousel.module.css";

gsap.registerPlugin(ScrollTrigger);

// Placeholder images — replace with real accommodation photos
const slides = [
    { id: 1, alt: "Salon et espace de vie", color: "#1a2332" },
    { id: 2, alt: "Chambre avec vue montagne", color: "#1b2535" },
    { id: 3, alt: "Cuisine équipée", color: "#1c2638" },
    { id: 4, alt: "Salle de bain", color: "#1d273b" },
    { id: 5, alt: "Vue extérieure", color: "#1e283e" },
    { id: 6, alt: "Terrasse panoramique", color: "#1f2941" },
];

const AUTOPLAY_MS = 4000;

export default function AccommodationCarousel() {
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(1);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const goTo = useCallback((index: number, dir: number) => {
        setDirection(dir);
        setCurrent(index);
    }, []);

    const next = useCallback(() => {
        goTo((current + 1) % slides.length, 1);
    }, [current, goTo]);

    const prev = useCallback(() => {
        goTo((current - 1 + slides.length) % slides.length, -1);
    }, [current, goTo]);

    // Auto-advance
    useEffect(() => {
        timerRef.current = setInterval(next, AUTOPLAY_MS);
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [next]);

    // Scroll-triggered entrance
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(containerRef.current,
                { y: 60, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 85%",
                        toggleActions: "play none none none",
                    },
                }
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const variants = {
        enter: (dir: number) => ({
            x: dir > 0 ? 400 : -400,
            opacity: 0,
            scale: 0.95,
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1,
        },
        exit: (dir: number) => ({
            x: dir > 0 ? -400 : 400,
            opacity: 0,
            scale: 0.95,
        }),
    };

    return (
        <div ref={containerRef} className={styles.carousel}>
            {/* Slide area */}
            <div className={styles.slideArea}>
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                        key={slides[current].id}
                        className={styles.slide}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                            background: `linear-gradient(135deg, ${slides[current].color} 0%, ${slides[current].color}88 100%)`,
                        }}
                    >
                        <div className={styles.slideInner}>
                            <span className={styles.slideNumber}>
                                {String(current + 1).padStart(2, "0")}
                            </span>
                            <span className={styles.slideLabel}>{slides[current].alt}</span>
                            <span className={styles.slidePlaceholder}>📸 Ajoutez une photo ici</span>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Arrows */}
                <button
                    className={`${styles.arrow} ${styles.arrowLeft}`}
                    onClick={prev}
                    aria-label="Photo précédente"
                >
                    ←
                </button>
                <button
                    className={`${styles.arrow} ${styles.arrowRight}`}
                    onClick={next}
                    aria-label="Photo suivante"
                >
                    →
                </button>
            </div>

            {/* Dots */}
            <div className={styles.dots}>
                {slides.map((s, i) => (
                    <button
                        key={s.id}
                        className={`${styles.dot} ${i === current ? styles.dotActive : ""}`}
                        onClick={() => goTo(i, i > current ? 1 : -1)}
                        aria-label={`Photo ${i + 1}`}
                    />
                ))}
            </div>

            {/* Counter */}
            <div className={styles.counter}>
                <span className={styles.counterCurrent}>{String(current + 1).padStart(2, "0")}</span>
                <span className={styles.counterSep}>/</span>
                <span className={styles.counterTotal}>{String(slides.length).padStart(2, "0")}</span>
            </div>
        </div>
    );
}
