"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./HeroSection.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const titleLeftRef = useRef<HTMLSpanElement>(null);
  const titleRightRef = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animations (time-based)
      const tl = gsap.timeline({ delay: 0.3 });
      tl.fromTo(badgeRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      )
        .fromTo([titleLeftRef.current, titleRightRef.current],
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.1 },
          "-=0.4"
        )
        .fromTo(subtitleRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
          "-=0.5"
        )
        .fromTo(dateRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
          "-=0.4"
        )
        .fromTo(scrollRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 1, ease: "power2.out" },
          "-=0.2"
        );

      // Scroll-driven: Pin hero + transform elements
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=150%",
          pin: true,
          scrub: 0.8,
          pinSpacing: true,
        },
      });

      // Video zooms in
      scrollTl.to(videoRef.current, {
        scale: 1.4,
        ease: "none",
        duration: 1,
      }, 0);

      // Title splits apart
      scrollTl.to(titleLeftRef.current, {
        x: "-30vw",
        opacity: 0,
        ease: "none",
        duration: 1,
      }, 0);

      scrollTl.to(titleRightRef.current, {
        x: "30vw",
        opacity: 0,
        ease: "none",
        duration: 1,
      }, 0);

      // Subtitle fades out
      scrollTl.to(subtitleRef.current, {
        y: -60,
        opacity: 0,
        ease: "none",
        duration: 0.6,
      }, 0);

      // Date fades out
      scrollTl.to(dateRef.current, {
        y: -40,
        opacity: 0,
        ease: "none",
        duration: 0.5,
      }, 0);

      // Badge fades out
      scrollTl.to(badgeRef.current, {
        y: -30,
        opacity: 0,
        ease: "none",
        duration: 0.4,
      }, 0);

      // Scroll indicator fades
      scrollTl.to(scrollRef.current, {
        opacity: 0,
        ease: "none",
        duration: 0.3,
      }, 0);

      // Overlay darkens
      scrollTl.to(overlayRef.current, {
        opacity: 1,
        ease: "none",
        duration: 1,
      }, 0);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className={styles.hero}>
      {/* Background Video */}
      <div ref={videoRef} className={styles.videoWrapper}>
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
        <div className={styles.videoFallback} />
      </div>

      {/* Gradient Overlay — intensifies on scroll */}
      <div ref={overlayRef} className={styles.overlay} />

      {/* Content */}
      <div className={styles.content}>
        <div ref={badgeRef} className={styles.badge}>
          <span className={styles.badgeDot} />
          Hiver 2025–2026
        </div>

        <h1 className={styles.title}>
          <span ref={titleLeftRef} className={styles.titlePart}>Ski</span>
          <span ref={titleRightRef} className={styles.titleAccent}>Ami</span>
        </h1>

        <p ref={subtitleRef} className={styles.subtitle}>Val Cenis</p>

        <div ref={dateRef} className={styles.dateLine}>
          28 Décembre — 3 Janvier
        </div>
      </div>

      {/* Scroll Indicator */}
      <div ref={scrollRef} className={styles.scrollIndicator}>
        <span className={styles.scrollText}>Découvrir</span>
        <div className={styles.scrollLine}>
          <div className={styles.scrollDot} />
        </div>
      </div>
    </section>
  );
}
