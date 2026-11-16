import { useCallback, useRef, useState } from "react";
import { Col } from "react-bootstrap";

const DROPLETS = 10;

export const ProjectCard = ({ title, description, imgUrl, github, tags = [], noScale }) => {
    const [splashes, setSplashes] = useState([]);
    const nextId = useRef(0);

    const splash = useCallback((e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const id = nextId.current++;
        setSplashes((prev) => [
            ...prev.slice(-2),
            { id, x: e.clientX - rect.left, y: e.clientY - rect.top },
        ]);
    }, []);

    // The wrapper's own animation marks the end of the splash; children fire this too.
    const clear = useCallback((e, id) => {
        if (e.target !== e.currentTarget) return;
        setSplashes((prev) => prev.filter((s) => s.id !== id));
    }, []);

    return (
        <Col sm={6} md={4} className="proj-col">
            <a href={github} target="_blank" rel="noopener noreferrer" className="proj-card-link">
                <article className="proj-card">
                    <div
                        className={`proj-imgbx ${noScale ? noScale : ""}`}
                        onPointerEnter={splash}
                        onPointerDown={splash}
                    >
                        <img src={imgUrl} alt={title} />
                        {splashes.map((s) => (
                            <span
                                key={s.id}
                                className="proj-splash"
                                style={{ left: s.x, top: s.y }}
                                onAnimationEnd={(e) => clear(e, s.id)}
                            >
                                <span className="proj-splash-ring" />
                                <span className="proj-splash-ring" />
                                <span className="proj-splash-ring" />
                                {Array.from({ length: DROPLETS }, (_, i) => (
                                    <span
                                        key={i}
                                        className="proj-splash-drop"
                                        style={{
                                            '--a': `${(360 / DROPLETS) * i + (i % 2 ? 9 : 0)}deg`,
                                            '--d': `${44 + (i % 3) * 15}px`,
                                        }}
                                    />
                                ))}
                            </span>
                        ))}
                    </div>
                    <div className="proj-body">
                        <h3 className="proj-title">{title}</h3>
                        <p className="proj-desc">{description}</p>
                        <ul className="proj-tags">
                            {tags.map((tag) => (
                                <li key={tag}>{tag}</li>
                            ))}
                        </ul>
                        <span className="proj-link-hint">View on GitHub</span>
                    </div>
                </article>
            </a>
        </Col>
    )
}