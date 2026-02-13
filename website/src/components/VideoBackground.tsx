"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./VideoBackground.module.css";
import { getMediaUrl } from "@/utils/supabase/storage";

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
                crossOrigin="anonymous"
                preload="auto"
                poster={getMediaUrl("images/hero-poster.jpg")}
            >
                <source src="https://pub-cae9f65980aa4fec812cc520a67fe57d.r2.dev/SKI%20Poudreuse%20%20Les%203%20vall%C3%A9es.mp4" type="video/mp4" />
            </video>
            <div className={styles.fallback} />
        </div>
    );
}

