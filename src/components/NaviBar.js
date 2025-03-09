import { useState, useEffect } from "react";
import { Navbar, Container, Nav } from 'react-bootstrap';
import linkedin from "../assets/img/linkedin.svg"
import github from "../assets/img/github.svg"
import instagram from "../assets/img/instagram.svg"

export const NavBar = () => {
    const [link, setLink] = useState("home");
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 50);
        }
        window.addEventListener("scroll", onScroll);
        
        return () => window.removeEventListener("scroll", onScroll);
    }, [])

    const onUpdateLink = (value) => {
        setLink(value);
    }

    return (
        <Navbar expand="md" className={scrolled ? "scrolled": ""}>
            <Container>
                <Navbar.Toggle aria-controls="basic-navbar-nav">
                    <span className="navbar-toggler-icon"></span>
                </Navbar.Toggle>
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link href="#home" className={link === "home" ? "active navbar-link" : "navbar-link"} onClick={() => onUpdateLink("home")}>Home</Nav.Link>
                    <Nav.Link href="#projects" className={link === "projects" ? "active navbar-link" : "navbar-link"} onClick={() => onUpdateLink("projects")}>Projects</Nav.Link>
                    <Nav.Link href="#resume" className={link === "resume" ? "active navbar-link" : "navbar-link"} onClick={() => onUpdateLink("resume")}>Resume</Nav.Link>
                </Nav>
                <span className="navbar-text">
                    <div className="social-icon">
                        <a href="https://www.linkedin.com/in/aaron-yang-9b0767269/" target="_blank" rel="noopener noreferrer" title="LinkedIn"><img src={linkedin} alt="LinkedIn" /></a>
                        <a href="https://www.instagram.com/squishyguy10/" target="_blank" rel="noopener noreferrer" title="Instagram"><img src={instagram} alt="Instagram" /></a>
                        <span className="github">
                            <a href="https://github.com/Squishyguy10" target="_blank" rel="noopener noreferrer" title="Github"><img src={github} alt="Github" /></a>
                        </span>
                    </div>
                </span>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}