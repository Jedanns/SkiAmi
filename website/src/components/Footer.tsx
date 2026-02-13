"use client";

import styles from "./Footer.module.css";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className="divider" />
            <div className={styles.inner}>
                <div className={styles.brand}>
                    <span className={styles.logo}>
                        SkiAmi
                    </span>
                    <span className={styles.tagline}>Val Cenis · Hiver {currentYear}</span>
                </div>

                <nav className={styles.links}>
                    <a href="#sejour">Le Séjour</a>
                    <a href="#budget">Budget</a>
                    <a href="#cta">Participer</a>
                </nav>

                <p className={styles.credit}>
                    Made by Lucas Dias (T’as vu je bosse dur au boulot promis juré)
                </p>
            </div>
        </footer>
    );
}
