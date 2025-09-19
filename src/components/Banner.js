import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap"
import profilePic from "../assets/img/aaron.jpg"
import sealPic from "../assets/img/seal.jpg"

export const Banner = () => {
    const [loopNum, setLoopNum] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const toRotate = ["Hi!", "I am Aaron"];
    const [text, setText] = useState("");
    const [delta, setDelta] = useState(160);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        let ticker = setInterval(() => {
            tick();
        }, delta)
        return () => {clearInterval(ticker)};
    })

    const tick = () => {
        let updatedText = isDeleting ? toRotate[loopNum%toRotate.length].substring(0, text.length-1) : toRotate[loopNum%toRotate.length].substring(0, text.length+1);
        setText(updatedText);
        
        if(isDeleting && updatedText === "") {
            setIsDeleting(false);
            setLoopNum(loopNum+1);
            setDelta(600);
        }
        else if(isDeleting) {
            setDelta(70);
        }
        else if(!isDeleting && updatedText === toRotate[loopNum%toRotate.length]) {
            setIsDeleting(true);
            setDelta(2300);
        }
        else if(!isDeleting){
            setDelta(140);
        }
    }

    return (
        <section className="banner" id="home">
            <Container>
                <Row className="align-items-centre">
                    <Col cs={12} md={6} xl={7}>
                    <h1>{" "}<span className="wrap">{text || "\u00A0"}</span>{" "}</h1>
                        <p> Hi! I'm Aaron Yang. I am currently in my 2A term in the University of Waterloo, studying Computer Science 🐸. 
                            I have experience with a variety of languages, such as C++, Java, Python, Javascript, and R.  
                        </p>
                        <p> This website was created with React, CSS, and Bootstrap. Please feel free to check around! </p>
                    </Col>
                    <Col cs={12} md={6} xl={4}>
                        <div className="profile-pic-container" 
                            onMouseEnter={() => setIsHovered(true)} 
                            onMouseLeave={() => setIsHovered(false)}>
                            <img src={profilePic} alt="Pic of me" className={`profile-pic ${!isHovered ? "visible" : "hidden"}`} />
                            <img src={sealPic} alt="Seal Pic" className={`profile-pic ${isHovered ? "visible" : "hidden"}`} />
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}