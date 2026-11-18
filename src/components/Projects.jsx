import { useEffect, useRef, useState } from "react";
import { projects } from "../data/projects";
import { ProjectCard } from "./ProjectCard";

export function Projects() {
    const showcaseRef = useRef(null);
    const [activeProject, setActiveProject] = useState(0);
    const [lineProgress, setLineProgress] = useState(0);

    useEffect(() => {
        let frameId = null;

        const updateActiveProject = () => {
            if (frameId !== null) window.cancelAnimationFrame(frameId);
            frameId = window.requestAnimationFrame(() => {
                const cards = Array.from(showcaseRef.current?.querySelectorAll(".project-card") || []);
                if (!cards.length) return;

                const showcaseBounds = showcaseRef.current.getBoundingClientRect();
                const progressStart = window.innerHeight * 0.6;
                const progressEnd = window.innerHeight * 0.4;
                const progressRange = showcaseBounds.height + progressStart - progressEnd;
                const nextLineProgress = Math.min(
                    1,
                    Math.max(0, (progressStart - showcaseBounds.top) / progressRange)
                );
                const focusPoint = window.innerHeight * 0.45;
                const nextActiveProject = cards.reduce((closestIndex, card, index) => {
                    const closestCard = cards[closestIndex];
                    const cardDistance = Math.abs(card.getBoundingClientRect().top + card.offsetHeight / 2 - focusPoint);
                    const closestDistance = Math.abs(closestCard.getBoundingClientRect().top + closestCard.offsetHeight / 2 - focusPoint);
                    return cardDistance < closestDistance ? index : closestIndex;
                }, 0);

                setLineProgress((currentProgress) => Math.abs(currentProgress - nextLineProgress) < 0.002
                    ? currentProgress
                    : nextLineProgress);
                setActiveProject((currentProject) => currentProject === nextActiveProject ? currentProject : nextActiveProject);
            });
        };

        updateActiveProject();
        window.addEventListener("scroll", updateActiveProject, { passive: true });
        window.addEventListener("resize", updateActiveProject);

        return () => {
            if (frameId !== null) window.cancelAnimationFrame(frameId);
            window.removeEventListener("scroll", updateActiveProject);
            window.removeEventListener("resize", updateActiveProject);
        };
    }, []);

    const progress = `${lineProgress * 100}%`;

    return (
        <section className="content-section projects-section" id="projects">
            <div className="section-index">02 <span>/</span> Projects</div>
            <p className="projects-kicker eyebrow">A few things I made</p>
            <div
                ref={showcaseRef}
                className="projects-showcase"
                style={{ "--projects-progress": progress }}
            >
                <div className="project-grid">
                    {projects.map((project, index) => (
                        <ProjectCard
                            key={project.title}
                            project={project}
                            index={index}
                            isActive={activeProject === index}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
