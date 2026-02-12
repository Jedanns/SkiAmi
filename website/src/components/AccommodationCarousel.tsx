"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./AccommodationCarousel.module.css";
import { getMediaUrl } from "@/utils/supabase/storage";

gsap.registerPlugin(ScrollTrigger);

import Image from "next/image";

// Real accommodation photos
const slides = [
    { id: 1, src: getMediaUrl("images/accommodation/1.avif"), alt: "Vue extérieure de la résidence" },
    { id: 2, src: getMediaUrl("images/accommodation/2.avif"), alt: "Salon spacieux et lumineux" },
    { id: 3, src: getMediaUrl("images/accommodation/3.avif"), alt: "Coin repas convivial" },
    { id: 4, src: getMediaUrl("images/accommodation/4.avif"), alt: "Chambre confortable" },
    { id: 5, src: getMediaUrl("images/accommodation/5.avif"), alt: "Cuisine moderne équipée" },
    { id: 6, src: getMediaUrl("images/accommodation/6.avif"), alt: "Salle de bain élégante" },
    { id: 7, src: getMediaUrl("images/accommodation/7.avif"), alt: "Vue depuis le balcon" },
    { id: 8, src: getMediaUrl("images/accommodation/8.avif"), alt: "Espace détente" },
    { id: 9, src: getMediaUrl("images/accommodation/9.avif"), alt: "Chambre avec lits jumeaux" },
    { id: 10, src: getMediaUrl("images/accommodation/10.avif"), alt: "Détails de décoration" },
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
                    >
                        <Image
                            src={slides[current].src}
                            alt={slides[current].alt}
                            fill
                            className={styles.slideImage}
                            sizes="(max-width: 768px) 100vw, 80vw"
                            priority
                            style={{ objectFit: 'cover' }}
                        />
                        {/* Overlay gradient for text readability */}
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)',
                            zIndex: 1
                        }} />

                        <div className={styles.slideInner}>
                            <span className={styles.slideNumber}>
                                {String(current + 1).padStart(2, "0")}
                            </span>
                            <span className={styles.slideLabel}>{slides[current].alt}</span>
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

            {/* Thumbnails */}
            <div className={styles.thumbnails}>
                {slides.map((s, i) => (
                    <button
                        key={s.id}
                        className={`${styles.thumb} ${i === current ? styles.thumbActive : ""}`}
                        onClick={() => goTo(i, i > current ? 1 : -1)}
                        aria-label={`Photo ${i + 1}`}
                    >
                        <Image
                            src={s.src}
                            alt=""
                            fill
                            className={styles.thumbImage}
                            sizes="80px"
                        />
                    </button>
                ))}
            </div>

            {/* Counter */}
            <div className={styles.counter}>
                <span className={styles.counterCurrent}>{String(current + 1).padStart(2, "0")}</span>
                <span className={styles.counterSep}>/</span>
                <span className={styles.counterTotal}>{String(slides.length).padStart(2, "0")}</span>
            </div>
        </div >
    );
}
