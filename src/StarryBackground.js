import React, { useEffect } from "react";
import "./StarryBackground.css";

const StarryBackground = () => {
    useEffect(() => {
        createStars();
    }, []);

    const createStars = () => {
        for (let i = 0; i < 150; i++) {
            const star = document.createElement("div");
            star.className = "star";
            star.style.top = `${Math.random() * 100}vh`;
            star.style.left = `${Math.random() * 100}vw`;
            star.style.animationDuration = `${1.5 + Math.random() * 3}s`;
            star.style.animationDelay = `${Math.random() * 1.5}s`;
            document.body.appendChild(star);
        }
    };

    return null;
};

export default StarryBackground;
