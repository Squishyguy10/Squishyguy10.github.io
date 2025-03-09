import { Col } from "react-bootstrap";

export const ProjectCard = ({ title, description, imgUrl, github, noScale}) => {
    return (
        <Col sm={6} md={4}>
            <a href={github} target="_blank" rel="noopener noreferrer" className="proj-card-link">
                <div className="proj-card">
                    <div className="proj-title">{title}</div>
                    <div className={`proj-imgbx ${noScale ? noScale : ""}`}> 
                        <img src={imgUrl} alt={title} />
                        <div className="proj-txtx">
                            <span>{description}</span>
                        </div>
                    </div>
                </div>
            </a>
        </Col>
    )
}