"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./HeroSection.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const titleLeftRef = useRef<HTMLSpanElement>(null);
  const titleRightRef = useRef<HTMLSpanElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const scrollIndRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=200%",
          pin: true,
          scrub: true,
          pinSpacing: true,
        },
      });

      // ─── Phase 1: 0 → 40% ──────────────────────────────
      // Video blurs + overlay lightens

      tl.to(scrollIndRef.current, {
        opacity: 0, duration: 0.06, ease: "none",
      }, 0);

      tl.to(videoRef.current, {
        filter: "blur(8px)",
        scale: 1.12,
        duration: 0.40,
        ease: "none",
      }, 0);

      tl.to(overlayRef.current, {
        opacity: 0.08,
        duration: 0.35,
        ease: "none",
      }, 0);

      // ─── Phase 2: 15% → 55% ────────────────────────────
      // SKI + AMI fly off-screen while fading out

      tl.to(titleLeftRef.current, {
        x: "-60vw", opacity: 0, duration: 0.40, ease: "power1.in",
      }, 0.15);

      tl.to(titleRightRef.current, {
        x: "60vw", opacity: 0, duration: 0.40, ease: "power1.in",
      }, 0.15);

      // ─── Phase 2b: 20% → 45% ───────────────────────────
      // Badge, subtitle, dateline fade out + drift up

      tl.to(badgeRef.current, {
        opacity: 0, y: -30, duration: 0.25, ease: "power1.in",
      }, 0.20);

      tl.to(subtitleRef.current, {
        opacity: 0, y: -20, duration: 0.25, ease: "power1.in",
      }, 0.22);

      tl.to(dateRef.current, {
        opacity: 0, y: -15, duration: 0.25, ease: "power1.in",
      }, 0.24);

      // ─── Phase 3: 62% → 100% ───────────────────────────
      // Full blackout

      tl.to(overlayRef.current, {
        opacity: 1, duration: 0.38, ease: "none",
      }, 0.62);

      tl.to(videoRef.current, {
        filter: "blur(16px)",
        scale: 1.25,
        duration: 0.38,
        ease: "none",
      }, 0.62);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className={styles.hero}>
      <div ref={videoRef} className={styles.videoWrapper}>
        <video
          className={styles.video}
          autoPlay muted loop playsInline
          poster="/images/hero-poster.jpg"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
        <div className={styles.videoFallback} />
      </div>

      <div ref={overlayRef} className={styles.overlay} />

      <div ref={heroContentRef} className={styles.content}>
        <div ref={badgeRef} className={styles.badge}>
          <span className={styles.badgeDot} />
          Hiver 2025–2026
        </div>
        <h1 className={styles.title}>
          <span ref={titleLeftRef} className={styles.titlePart}>Ski</span>
          <span ref={titleRightRef} className={styles.titleAccent}>Ami</span>
        </h1>
        <p ref={subtitleRef} className={styles.subtitle}>Val Cenis</p>
        <div ref={dateRef} className={styles.dateLine}>28 Décembre — 3 Janvier</div>
      </div>

      <div ref={scrollIndRef} className={styles.scrollIndicator}>
        <span className={styles.scrollText}>Découvrir</span>
        <div className={styles.scrollLine}>
          <div className={styles.scrollDot} />
        </div>
      </div>
    </div>
  );
}
