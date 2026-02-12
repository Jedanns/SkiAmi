"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./ScrollRevealText.module.css";

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealTextProps {
    text: string;
    subtitle?: string;
}

export default function ScrollRevealText({ text, subtitle }: ScrollRevealTextProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "+=100%",
                    pin: true,
                    scrub: 0.6,
                    pinSpacing: true,
                },
            });

            // Text: scale up from small + blur → crisp → scale up more + blur back out
            tl.fromTo(textRef.current,
                { scale: 0.5, opacity: 0, filter: "blur(20px)" },
                { scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.5, ease: "none" }
            );

            if (subtitleRef.current) {
                tl.fromTo(subtitleRef.current,
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 0.2, ease: "none" },
                    0.35
                );
            }

            tl.to(textRef.current, {
                scale: 1.3,
                opacity: 0,
                filter: "blur(15px)",
                duration: 0.5,
                ease: "none",
            });

            if (subtitleRef.current) {
                tl.to(subtitleRef.current, {
                    opacity: 0,
                    y: -30,
                    duration: 0.3,
                    ease: "none",
                }, "-=0.4");
            }

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className={styles.container}>
            <div className={styles.inner}>
                <h2 ref={textRef} className={styles.text}>{text}</h2>
                {subtitle && (
                    <p ref={subtitleRef} className={styles.subtitle}>{subtitle}</p>
                )}
            </div>
        </div>
    );
}
