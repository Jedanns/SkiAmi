"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AccommodationCarousel from "./AccommodationCarousel";
import styles from "./InfoSection.module.css";

gsap.registerPlugin(ScrollTrigger);

const infoCards = [
    {
        icon: "📍",
        label: "Destination",
        title: "Val Cenis, Savoie",
        description: "125 km de pistes · 1 300 – 2 800m d'altitude",
        link: "https://www.google.com/maps/place/Val+Cenis",
        linkLabel: "Voir sur Google Maps →",
        bgHint: "linear-gradient(135deg, #1a2332 0%, #0d1926 100%)",
        image: "/images/val-cenis.jpg",
    },
    {
        icon: "📅",
        label: "Dates",
        title: "28 Déc. → 3 Jan.",
        description: "7 jours · 6 nuits · Vacances de Noël",
        link: null,
        linkLabel: null,
        bgHint: "linear-gradient(135deg, #1b2230 0%, #111827 100%)",
        image: "/images/winter.jpg",
    },
    {
        icon: "👥",
        label: "Le Groupe",
        title: "8 amis",
        description: "Une semaine de glisse, de rire et de souvenirs",
        link: null,
        linkLabel: null,
        bgHint: "linear-gradient(135deg, #1a1f2e 0%, #0f1520 100%)",
        image: null,
    },
];

export default function InfoSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const cardsContainerRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const accomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Pinned horizontal card reveal
            const cards = cardRefs.current.filter(Boolean);

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: cardsContainerRef.current,
                    start: "top top",
                    end: `+=${cards.length * 100}%`,
                    pin: true,
                    scrub: 0.8,
                    pinSpacing: true,
                },
            });

            // Each card slides in from right
            cards.forEach((card, i) => {
                if (i === 0) {
                    // First card starts visible
                    tl.fromTo(card!,
                        { xPercent: 100, opacity: 0, scale: 0.9 },
                        { xPercent: 0, opacity: 1, scale: 1, duration: 1, ease: "none" }
                    );
                } else {
                    // Subsequent cards: previous slides out left, new comes from right
                    tl.to(cards[i - 1]!, {
                        xPercent: -100,
                        opacity: 0,
                        scale: 0.9,
                        duration: 0.5,
                        ease: "none",
                    });
                    tl.fromTo(card!,
                        { xPercent: 100, opacity: 0, scale: 0.9 },
                        { xPercent: 0, opacity: 1, scale: 1, duration: 0.5, ease: "none" },
                        "-=0.3"
                    );
                }

                // Hold on each card for a moment
                tl.to({}, { duration: 0.3 });
            });

            // Accommodation section: scroll-triggered reveal
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
            {/* Pinned cards viewport */}
            <div ref={cardsContainerRef} className={styles.cardsViewport}>
                {infoCards.map((card, i) => (
                    <div
                        key={card.label}
                        ref={(el) => { cardRefs.current[i] = el; }}
                        className={styles.fullCard}
                        style={{ background: card.bgHint }}
                    >
                        <div className={styles.fullCardInner}>
                            <span className={styles.cardIcon}>{card.icon}</span>
                            <span className={styles.cardLabel}>{card.label}</span>
                            <h3 className={styles.cardTitle}>{card.title}</h3>
                            <p className={styles.cardDesc}>{card.description}</p>
                            {card.link && (
                                <a
                                    href={card.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.cardLink}
                                >
                                    {card.linkLabel}
                                </a>
                            )}
                        </div>
                        <div className={styles.cardImageSlot}>
                            {card.image ? (
                                <img
                                    src={card.image}
                                    alt={card.title}
                                    className={styles.cardImage}
                                />
                            ) : (
                                <span className={styles.imagePlaceholder}>📸 Image à ajouter</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Accommodation — below pinned area */}
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
