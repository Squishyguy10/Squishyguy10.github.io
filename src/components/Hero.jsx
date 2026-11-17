import { useEffect, useState } from "react";
import { ParticleField } from "./ParticleField";
import profileImage from "../assets/img/aaron-profile.jpg";
import characterImage from "../assets/img/toopy.jpg";

const shapes = [
    { id: "donut" },
    { id: "vase" },
    { id: "pencil" },
];

export function Hero() {
    const [shapeIndex, setShapeIndex] = useState(0);
    const shape = shapes[shapeIndex].id;

    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

        const interval = window.setInterval(() => {
            setShapeIndex((currentIndex) => (currentIndex + 1) % shapes.length);
        }, 10000);

        return () => window.clearInterval(interval);
    }, []);

    return (
        <section className="hero" id="home">
            <div className="hero-grid" aria-hidden="true" />
            <div className="profile-badge">
                <div className="profile-coin" tabIndex="0" aria-label="Flip profile image">
                    <div className="profile-coin-inner">
                        <div className="profile-coin-face profile-coin-front">
                            <img src={profileImage} alt="Aaron Yang" />
                        </div>
                        <div className="profile-coin-face profile-coin-back">
                            <img src={characterImage} alt="Toopy and Binoo" />
                        </div>
                    </div>
                </div>
                <span>Aaron Yang</span>
            </div>
            <div className="hero-copy">
                <p className="eyebrow"><span className="eyebrow-dot" /> Computer science student / builder</p>
                <h1>Hi, I&apos;m Aaron.</h1>
                <p className="hero-intro">
                    <span className="hero-school">
                        I study computer science at the{" "}
                        <a href="https://uwaterloo.ca/" target="_blank" rel="noreferrer">
                            University of Waterloo
                        </a>
                        .
                    </span>
                    <br />
                    I enjoy making things and solving problems.
                </p>
            </div>

            <div className="hero-art">
                <ParticleField shape={shape} />
            </div>

        </section>
    );
}
