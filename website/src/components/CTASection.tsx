"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import styles from "./CTASection.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function CTASection() {
    const containerRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(contentRef.current,
                { scale: 0.8, opacity: 0, filter: "blur(8px)" },
                {
                    scale: 1,
                    opacity: 1,
                    filter: "blur(0px)",
                    ease: "none",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 70%",
                        end: "top 20%",
                        scrub: 0.6,
                    },
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} id="cta" className={`section ${styles.cta}`}>
            {/* Mountain silhouette */}
            <div className={styles.mountainBg} />

            <div className="section-inner">
                <div ref={contentRef} className={styles.content}>
                    <h2 className={styles.title}>Chaud ?</h2>
                    <p className={styles.subtitle}>
                        On va se la donner j’ai juré Tartiflette – piste noire day 1
                    </p>

                    <a href="/dashboard" className={styles.buttonLink}>
                        <motion.button
                            className={styles.button}
                            whileHover={{ scale: 1.04, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                        >
                            <span className={styles.buttonText}>Organisation</span>
                        </motion.button>
                    </a>
                </div>
            </div>
        </section>
    );
}
