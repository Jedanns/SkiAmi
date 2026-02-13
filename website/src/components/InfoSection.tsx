"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AccommodationCarousel from "./AccommodationCarousel";
import styles from "./InfoSection.module.css";
import { getMediaUrl } from "@/utils/supabase/storage";

gsap.registerPlugin(ScrollTrigger);

const infoCards = [
    {
        label: "Destination",
        title: "Val Cenis",
        subtitle: "Savoie, France",
        stats: [
            { value: "125 km", label: "de pistes" },
            { value: "2 800m", label: "d'altitude max" },
        ],
        link: "https://www.google.com/maps/place/Val+Cenis",
        linkLabel: "Google Maps",
        image: getMediaUrl("images/val-cenis.jpg"),
        icon: "📍",
    },
    {
        label: "Dates",
        title: "28 Déc.",
        titleEnd: "3 Jan.",
        subtitle: "Vacances de Noël",
        stats: [
            { value: "7", label: "jours" },
            { value: "6", label: "nuits" },
        ],
        link: null,
        linkLabel: null,
        image: getMediaUrl("images/winter.jpg"),
        icon: "📅",
    },
];

export default function InfoSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const cardsRowRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const accomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Staggered card entrance animation
            const cards = cardRefs.current.filter(Boolean);

            cards.forEach((card, i) => {
                gsap.fromTo(card,
                    { y: 60, opacity: 0, scale: 0.96 },
                    {
                        y: 0,
                        opacity: 1,
                        scale: 1,
                        duration: 0.8,
                        delay: i * 0.15,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: card,
                            start: "top 85%",
                            end: "top 50%",
                            toggleActions: "play none none reverse",
                        },
                    }
                );
            });

            // Accommodation section reveal
            gsap.fromTo(accomRef.current,
                { y: 80, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: accomRef.current,
                        start: "top 80%",
                        end: "top 40%",
                        scrub: 0.5,
                    },
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="sejour" className={styles.info}>
            {/* Side-by-side cards */}
            <div ref={cardsRowRef} className={styles.cardsRow}>
                {infoCards.map((card, i) => (
                    <div
                        key={card.label}
                        ref={(el) => { cardRefs.current[i] = el; }}
                        className={styles.card}
                    >
                        {/* Background image */}
                        <div className={styles.cardImageWrap}>
                            <img
                                src={card.image}
                                alt={card.title}
                                className={styles.cardImage}
                            />
                            <div className={styles.cardOverlay} />
                        </div>

                        {/* Content */}
                        <div className={styles.cardContent}>
                            <div className={styles.cardTop}>
                                <span className={styles.cardIcon}>{card.icon}</span>
                                <span className={styles.cardLabel}>{card.label}</span>
                            </div>

                            <div className={styles.cardMain}>
                                {"titleEnd" in card && card.titleEnd ? (
                                    <h3 className={styles.cardTitle}>
                                        {card.title} <span className={styles.cardArrow}>→</span> {card.titleEnd}
                                    </h3>
                                ) : (
                                    <h3 className={styles.cardTitle}>{card.title}</h3>
                                )}
                                <p className={styles.cardSubtitle}>{card.subtitle}</p>
                            </div>

                            {/* Stats row */}
                            <div className={styles.statsRow}>
                                {card.stats.map((stat) => (
                                    <div key={stat.label} className={styles.stat}>
                                        <span className={styles.statValue}>{stat.value}</span>
                                        <span className={styles.statLabel}>{stat.label}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Link */}
                            {card.link && (
                                <a
                                    href={card.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.cardLink}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                                        <circle cx="12" cy="10" r="3" />
                                    </svg>
                                    {card.linkLabel}
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                                        <polyline points="15 3 21 3 21 9" />
                                        <line x1="10" y1="14" x2="21" y2="3" />
                                    </svg>
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Accommodation — below cards */}
            <div ref={accomRef} className={styles.accommodation}>
                <div className={styles.accomInner}>
                    <div className={styles.accomHeader}>
                        <span className={styles.accomLabel}>Hébergement</span>
                        <h3 className={styles.accomTitle}>Notre Résidence</h3>
                        <p className={styles.accomSubtitle}>
                            Confort et vue sur les pistes — le camp de base idéal.
                        </p>
                    </div>
                    <AccommodationCarousel />
                </div>
            </div>
        </section>
    );
}
