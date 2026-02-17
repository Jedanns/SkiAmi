"use client";

import { useSpring, animated } from "@react-spring/web";
import { useEffect, useRef, useState } from "react";

interface SplitTextProps {
    text: string;
    className?: string;
    delay?: number;
}

export default function SplitText({ text, className = "", delay = 100 }: SplitTextProps) {
    const letters = text.split("");
    const [inView, setInView] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref} className={`inline-block overflow-hidden ${className}`}>
            {letters.map((letter, index) => (
                <AnimatedLetter key={index} letter={letter} index={index} delay={delay} inView={inView} />
            ))}
        </div>
    );
}

const AnimatedLetter = ({ letter, index, delay, inView }: { letter: string; index: number; delay: number; inView: boolean }) => {
    const spring = useSpring({
        from: { opacity: 0, transform: "translate3d(0, 40px, 0)" },
        to: inView ? { opacity: 1, transform: "translate3d(0, 0, 0)" } : { opacity: 0, transform: "translate3d(0, 40px, 0)" },
        delay: index * delay,
        config: { mass: 1, tension: 280, friction: 60 } // stiff reset
    });

    return (
        <animated.span style={spring} className="inline-block relative">
            {letter === " " ? "\u00A0" : letter}
        </animated.span>
    );
};
