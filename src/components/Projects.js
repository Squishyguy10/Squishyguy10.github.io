import { Container, Row, Col } from 'react-bootstrap';
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
            description: "A desktop dashboard that lets teachers track student spares, attendance and timetables in one place instead of a stack of paper.",
            tags: ["Java", "Swing", "OOP"],
            imgUrl: spareLink,
            github: "https://github.com/Squishyguy10/SpareLink",
            noScale: "no-scale",
        },
        {
            title: "Table Tablet",
            description: "Turns any flat surface into a drawing tablet using nothing but a webcam and real-time hand tracking.",
            tags: ["Python", "MediaPipe", "OpenCV"],
            imgUrl: tableTablet,
            github: "https://github.com/Squishyguy10/table-tablet",
        },
        {
            title: "The 3 Rs",
            description: "A sustainability app that pairs a supermarket rewards program with recycling incentives to cut down household waste.",
            tags: ["React", "Tailwind", "Node.js", "MongoDB"],
            imgUrl: t3r,
            github: "https://github.com/Squishyguy10/t3r",
        },
        {
            title: "Goock Games",
            description: "A competitive arena where you write the algorithm and your code plays the game for you against everyone else.",
            tags: ["React", "Tailwind", "Node.js"],
            imgUrl: goockGames,
            github: "https://github.com/Squishyguy10/goock",
        },
        {
            title: "Tag",
            description: "A couch party game modelled after playground tag, built from scratch on a bare-bones graphics library.",
            tags: ["Python", "CMU Graphics"],
            imgUrl: tag,
            github: "https://github.com/Squishyguy10/School/blob/master/ICS3U/tag.py",
        },
    ]

    return (
        <section className='project'>
            <Container id='projects'>
                <Row>
                    <Col>
                        <span className='section-eyebrow'>Portfolio</span>
                        <h2> Projects </h2>
                        <p className='project-intro'>
                            A mix of things I've built to scratch an itch, win a hackathon, or just
                            see if it was possible. Click any card to dig through the code.
                        </p>
                    </Col>
                </Row>
                <Row>
                    {
                        projects.map((project, index) => (
                            <ProjectCard key={index} {...project} />
                        ))
                    }
                </Row>
            </Container>
            <img className='background-image-right' src={colorSharp2} alt="" />
        </section>
    )
}