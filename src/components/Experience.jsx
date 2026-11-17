import ez32Logo from "../assets/img/ez32-logo.png";
import kinaxisLogo from "../assets/img/kinaxis-logo.png";

const experiences = [
    { date: "May 2025 - Aug 2025", title: "Embedded Systems Software Developer Intern", detail: "Built firmware for an ESP-32 JTAG/SWD debugger, including a web-based logic analyzer app", logo: ez32Logo },
    { date: "May 2026 - Present", title: "Software Developer Intern", detail: "Built core supply planning algorithms, while improving performance and memory usage", logo: kinaxisLogo },
];

export function Experience() {
    return (
        <section className="content-section experience-section" id="experience">
            <div className="section-index">01 <span>/</span> Experience</div>
            <div className="experience-timeline" aria-label="Experience timeline">
                {experiences.map((experience, index) => (
                    <article
                        className={`timeline-item ${index % 2 === 0 ? "is-above" : "is-below"}`}
                        key={experience.title}
                    >
                        <div
                            className={`timeline-card ${experience.logo ? "has-logo" : ""}`}
                        >
                            {experience.logo && <img className="timeline-logo" src={experience.logo} alt={`${experience.title} company logo`} />}
                            <span className="timeline-date">{experience.date}</span>
                            <h3>{experience.title}</h3>
                            <p className="timeline-detail">{experience.detail}</p>
                        </div>
                        <span className="timeline-node" aria-hidden="true" />
                    </article>
                ))}
                <span className="timeline-arrow" aria-hidden="true">
                    <svg viewBox="0 0 24 18">
                        <path d="M10 3 L21 9 L10 15" />
                    </svg>
                </span>
            </div>
        </section>
    );
}
