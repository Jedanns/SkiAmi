"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./PreparationSection.module.css";

gsap.registerPlugin(ScrollTrigger);

const budgetItems = [
    { icon: "🏠", label: "Hébergement", amount: 200, description: "Résidence partagée à 8" },
    { icon: "🎿", label: "Forfait ski", amount: 250, description: "6 jours de ski sur le domaine" },
    { icon: "⛷️", label: "Location matériel", amount: 100, description: "Ski, chaussures, bâtons" },
    { icon: "🚗", label: "Transport", amount: 60, description: "Covoiturage aller-retour" },
    { icon: "🍕", label: "Nourriture", amount: 20, description: "Courses communes sur place" },
];

function AnimatedCounter({ target }: { target: number }) {
    const [value, setValue] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const obj = { val: 0 };
            gsap.to(obj, {
                val: target,
                duration: 2,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: ref.current,
                    start: "top 80%",
                    toggleActions: "play none none none",
                },
                onUpdate: () => setValue(Math.round(obj.val)),
            });
        });
        return () => ctx.revert();
    }, [target]);

    return <span ref={ref}>{value}</span>;
}

export default function PreparationSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Items wipe in with clip-path
            itemRefs.current.filter(Boolean).forEach((item, i) => {
                gsap.fromTo(item!,
                    { clipPath: "inset(0 100% 0 0)", opacity: 0 },
                    {
                        clipPath: "inset(0 0% 0 0)",
                        opacity: 1,
                        duration: 0.8,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: item!,
                            start: "top 85%",
                            toggleActions: "play none none none",
                        },
                        delay: i * 0.08,
                    }
                );
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="budget" className={`section ${styles.preparation}`}>
            <div className="section-inner">
                <div className="section-label">Préparation</div>
                <h2 className="section-title">
                    Le budget estimé<span>.</span>
                </h2>

                {/* Budget Total Card */}
                <div className={styles.totalCard}>
                    <div className={styles.totalInner}>
                        <span className={styles.totalLabel}>Budget estimé par personne</span>
                        <div className={styles.totalAmount}>
                            <span className={styles.totalCurrency}>€</span>
                            <span className={styles.totalRange}>
                                <AnimatedCounter target={500} /> – <AnimatedCounter target={700} />
                            </span>
                        </div>
                        <span className={styles.totalNote}>
                            Estimation pour 7 jours · 6 nuits
                        </span>
                    </div>
                    <div className={styles.totalGlow} />
                </div>

                {/* Budget Breakdown */}
                <div className={styles.budgetList}>
                    <div className={styles.budgetListHeader}>
                        <span>Détail des dépenses</span>
                    </div>
                    {budgetItems.map((item, i) => (
                        <div
                            key={item.label}
                            ref={(el) => { itemRefs.current[i] = el; }}
                            className={styles.budgetItem}
                        >
                            <div className={styles.budgetInfo}>
                                <span className={styles.budgetLabel}>{item.label}</span>
                                <span className={styles.budgetDesc}>{item.description}</span>
                            </div>
                            <span className={styles.budgetAmount}>~{item.amount} €</span>
                        </div>
                    ))}
                    <div className={styles.budgetTotal}>
                        <span>Total estimé</span>
                        <span className={styles.budgetTotalAmount}>
                            ~<AnimatedCounter target={630} /> €
                        </span>
                    </div>
                </div>

                <p className={styles.note}>
                    💡 Ces montants sont des estimations et peuvent varier. Le budget
                    nourriture est calculé sur une base de courses communes.
                </p>
            </div>
        </section>
    );
}
