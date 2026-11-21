export function ProjectCard({ project, index, isActive }) {
    return (
        <article
            className={`project-card ${index % 2 === 0 ? "is-image-right" : "is-image-left"} ${isActive ? "is-active" : ""}`}
        >
            <a className="project-image project-image-link" href={project.link} target="_blank" rel="noreferrer">
                <img src={project.image} alt={`${project.title} project`} />
                <span className="project-number">{project.number}</span>
                <span className="project-arrow" aria-hidden="true">↗</span>
            </a>
            <div className="project-details">
                <div>
                    <p className="project-type">{project.type}</p>
                    <h3>{project.title}</h3>
                </div>
                <p className="project-description">{project.description}</p>
                <div className="project-tags">
                    {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
            </div>
        </article>
    );
}
