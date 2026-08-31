import { Col } from "react-bootstrap";

export const ProjectCard = ({ title, description, imgUrl, github, tags = [], noScale }) => {
    return (
        <Col sm={6} md={4} className="proj-col">
            <a href={github} target="_blank" rel="noopener noreferrer" className="proj-card-link">
                <article className="proj-card">
                    <div className={`proj-imgbx ${noScale ? noScale : ""}`}>
                        <img src={imgUrl} alt={title} />
                        <div className="proj-overlay">
                            <span className="proj-cta">View on GitHub</span>
                        </div>
                    </div>
                    <div className="proj-body">
                        <h3 className="proj-title">{title}</h3>
                        <p className="proj-desc">{description}</p>
                        <ul className="proj-tags">
                            {tags.map((tag) => (
                                <li key={tag}>{tag}</li>
                            ))}
                        </ul>
                    </div>
                </article>
            </a>
        </Col>
    )
}