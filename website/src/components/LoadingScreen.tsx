import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styles from "./LoadingScreen.module.css";

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const duration = 3000; // Exact 3 seconds
        const interval = 16;
        const totalSteps = duration / interval;
        const increment = 100 / totalSteps;

        const timer = setInterval(() => {
            setProgress((prev) => {
                const next = prev + increment;
                if (next >= 100) {
                    clearInterval(timer);
                    return 100;
                }
                return next;
            });
        }, interval);

        const completionTimeout = setTimeout(() => {
            onComplete();
        }, duration);

        return () => {
            clearInterval(timer);
            clearTimeout(completionTimeout);
        };
    }, [onComplete]);

    return (
        <motion.div
            className={styles.screen}
            initial={{ opacity: 1 }}
            exit={{
                y: "-100%",
                transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
            }}
        >
            <div className={styles.content}>
                {/* Logo / Text Reveal */}
                <div className={styles.logoWrapper}>
                    <motion.h1
                        className={styles.logo}
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        Ski Ami<span className={styles.dot}>.</span>
                    </motion.h1>
                </div>

                {/* Progress Bar */}
                <div className={styles.progressContainer}>
                    <motion.div
                        className={styles.progressBar}
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Percentage */}
                <span className={styles.percentage}>
                    {Math.round(progress).toString().padStart(3, "0")}%
                </span>
            </div>
        </motion.div>
    );
}
