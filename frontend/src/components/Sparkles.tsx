import {useEffect, useState} from "react";

type Sparkle = {
    id: number;
    x: number;
    y: number;
    size: number;
};

export default function Sparkles() {
    const [sparkles, setSparkles] = useState<Sparkle[]>([]);

    useEffect(() => {
        let id = 0;

        const handleMove = (e: MouseEvent) => {
            // Create multiple sparkles per move
            for (let i = 0; i < 3; i++) {
                const offsetX = (Math.random() - 0.5) * 60; // random spread
                const offsetY = (Math.random() - 0.5) * 60;

                const sparkle: Sparkle = {
                    id: id++,
                    x: e.clientX + offsetX,
                    y: e.clientY + offsetY,
                    size: 2 + Math.random() * 3, // random size
                };

                setSparkles((prev) => [...prev, sparkle]);

                // remove after animation
                setTimeout(() => {
                    setSparkles((prev) => prev.filter((s) => s.id !== sparkle.id));
                }, 700);
            }
        };

        window.addEventListener("mousemove", handleMove);

        return () => window.removeEventListener("mousemove", handleMove);
    }, []);

    return (
        <>
            {sparkles.map((s) => (
                <span key={s.id}
                      className="pointer-events-none fixed w-2 h-2 rounded-full bg-cyan-400 animate-ping opacity-70"
                      style={{
                          left: s.x,
                          top: s.y,
                          width: s.size,
                          height: s.size,
                          transform: "translate(-50%, -50%)",
                      }}/>
            ))}
        </>
    );
}
