"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./VideoBackground.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function VideoBackground() {
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Video blur/scale driven by hero scroll — targets this element by ID
        // The HeroSection's GSAP code will target #video-bg
    }, []);

    return (
        <div id="video-bg" ref={wrapperRef} className={styles.wrapper}>
            <video
                className={styles.video}
                autoPlay
                muted
                loop
                playsInline
                poster="/images/hero-poster.jpg"
            >
                <source src="/videos/hero.mp4" type="video/mp4" />
            </video>
            <div className={styles.fallback} />
        </div>
    );
}
