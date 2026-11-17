import { projects } from "../data/projects";
import { ProjectCard } from "./ProjectCard";

export function Projects() {
    return (
        <section className="content-section projects-section" id="projects">
            <div className="section-index">02 <span>/</span> Projects</div>
            <p className="projects-kicker eyebrow">A few things I made</p>
            <div className="project-grid">
                {projects.map((project) => <ProjectCard key={project.title} project={project} />)}
            </div>
        </section>
    );
}
