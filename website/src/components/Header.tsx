"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import styles from "./Header.module.css";

const navLinks = [
    { label: "Le Séjour", href: "#sejour" },
    { label: "Budget", href: "#budget" },
    { label: "Participer", href: "#cta" },
    { label: "Organisation", href: "/dashboard" },
];

export default function Header() {
    const [visible, setVisible] = useState(false);
    const { scrollY } = useScroll();

    // All hooks must be called unconditionally — outside any conditional render
    const backdropBlur = useTransform(scrollY, [600, 800], [10, 20]);
    const bgOpacity = useTransform(scrollY, [600, 800], [0.6, 0.85]);
    const backdropFilterValue = useTransform(backdropBlur, (v) => `blur(${v}px)`);
    const bgColorValue = useTransform(bgOpacity, (v) => `rgba(10, 14, 23, ${v})`);

    useEffect(() => {
        const budgetEl = document.getElementById("budget");
        if (!budgetEl) return;

        const observer = new IntersectionObserver(
            ([entry]) => setVisible(entry.isIntersecting || entry.boundingClientRect.top < 0),
            { threshold: 0, rootMargin: "-10% 0px 0px 0px" }
        );
        observer.observe(budgetEl);
        return () => observer.disconnect();
    }, []);

    return (
        <AnimatePresence>
            {visible && (
                <motion.header
                    className={styles.header}
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                        backdropFilter: backdropFilterValue,
                        WebkitBackdropFilter: backdropFilterValue,
                        backgroundColor: bgColorValue,
                    }}
                >
                    <div className={styles.inner}>
                        <a href="#" className={styles.logo}>
                            <span className={styles.logoIcon}>◆</span>
                            SkiAmi
                        </a>
                        <nav className={styles.nav}>
                            {navLinks.map((link) => (
                                <a key={link.href} href={link.href} className={styles.navLink}>
                                    {link.label}
                                </a>
                            ))}
                        </nav>
                    </div>
                </motion.header>
            )}
        </AnimatePresence>
    );
}
