import { Container, Row, Col, Nav, Tab } from 'react-bootstrap';
import { ProjectCard } from "./ProjectCard";
import colorSharp2 from '../assets/img/color-sharp2.png';
import spareLink from '../assets/img/sparelinklogo.png';
import tableTablet from '../assets/img/tabletablet.jpg';
import t3r from '../assets/img/t3r.png';
import goockGames from '../assets/img/goockgames.png';
import tag from '../assets/img/tag.png';

export const Projects = () => {
    const projects = [
        {
            title: "SpareLink",
            description: "Student schedule organizer/tracker designed for teachers. Made with Java and Java Swing, with lots of Object-Oriented Programming. ",
            imgUrl: spareLink,
            github: "https://github.com/Squishyguy10/SpareLink",
            noScale: "no-scale",
        },
        {
            title: "Table Tablet",
            description: "Turn any flat surface into a drawing tablet with just a webcam. Made with Python, using MediaPipe and OpenCV. ",
            imgUrl: tableTablet,
            github: "https://github.com/Squishyguy10/table-tablet",
        },
        {
            title: "The 3 Rs",
            description: "An app that aims to improve environmental sustainability through a supermarket and recycling program. Built with React, Tailwind CSS, NodeJS, and MongoDB Atlas. ",
            imgUrl: t3r,
            github: "https://github.com/Squishyguy10/t3r",
        },
        {
            title: "Goock Games",
            description: "A platform where you code algorithms to play games for you against other players. Built with React, Tailwind CSS, and NodeJS. ",
            imgUrl: goockGames,
            github: "https://github.com/Squishyguy10/goock",
        },
        {
            title: "Tag",
            description: "A couch party game modelled after the playground Tag game. Made with Python, using the CMU Graphics Library.",
            imgUrl: tag,
            github: "https://github.com/Squishyguy10/School/blob/master/ICS3U/tag.py",
        },
    ]

    return (
        <section className='project'>
            <Container id='projects'>
                <Row>
                    <Col>
                        <h2> Projects </h2>
                        <p> Here are some of my projects that I am most proud of. </p>
                        
                        <Tab.Container id="project-tabs" defaultActiveKey="first">
                            {/*
                            <Nav variant="pills" className="nav-pills mb-5 justify-content-center align-items-center" id="pills-tab">
                                <Nav.Item>
                                    <Nav.Link eventKey="first">Goock Games</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="second">Table Tablet</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="third">SpareLink</Nav.Link>
                                </Nav.Item>
                            </Nav>
                            */}

                            <Tab.Content>
                                <Tab.Pane eventKey='first'>
                                    <Row>
                                        {
                                            projects.map((project, index) => {
                                                return (
                                                    <ProjectCard
                                                        key={index}
                                                        {...project}
                                                    />
                                                )
                                            })
                                        }
                                    </Row>
                                </Tab.Pane>
                            </Tab.Content>
                        </Tab.Container>
                    </Col>
                </Row>
            </Container>
            <img className='background-image-right' src={colorSharp2} />    
        </section>
    )
}