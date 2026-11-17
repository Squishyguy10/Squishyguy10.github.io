export function ProjectCard({ project }) {
    return (
        <a className="project-card" href={project.link} target="_blank" rel="noreferrer">
            <div className="project-image">
                <img src={project.image} alt={`${project.title} project`} />
                <span className="project-number">{project.number}</span>
                <span className="project-arrow" aria-hidden="true">↗</span>
            </div>
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
        </a>
    );
}
