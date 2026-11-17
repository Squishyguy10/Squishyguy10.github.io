import spareLink from "../assets/img/sparelinklogo.png";
import tableTablet from "../assets/img/tabletablet.jpg";
import t3r from "../assets/img/t3r.png";
import goockGames from "../assets/img/goockgames.png";
import tag from "../assets/img/tag.png";

export const projects = [
    {
        number: "01",
        title: "SpareLink",
        type: "Desktop dashboard",
        description: "A focused tool for teachers to manage student spares, attendance, and timetables without a stack of paper.",
        tags: ["Java", "Swing", "OOP"],
        image: spareLink,
        link: "https://github.com/Squishyguy10/SpareLink",
    },
    {
        number: "02",
        title: "Table Tablet",
        type: "Computer vision",
        description: "Turns any flat surface into a drawing tablet using a webcam and real-time hand tracking.",
        tags: ["Python", "MediaPipe", "OpenCV"],
        image: tableTablet,
        link: "https://github.com/Squishyguy10/table-tablet",
    },
    {
        number: "03",
        title: "The 3 Rs",
        type: "Sustainability app",
        description: "A rewards experience that pairs recycling incentives with everyday grocery shopping.",
        tags: ["React", "Node.js", "MongoDB"],
        image: t3r,
        link: "https://github.com/Squishyguy10/t3r",
    },
    {
        number: "04",
        title: "Goock Games",
        type: "Competitive coding",
        description: "A competitive arena where you write the algorithm and your code plays the game for you.",
        tags: ["React", "Tailwind", "Node.js"],
        image: goockGames,
        link: "https://github.com/Squishyguy10/goock",
    },
    {
        number: "05",
        title: "Tag",
        type: "Game",
        description: "A couch party game modelled after playground tag, built from scratch on a bare-bones graphics library.",
        tags: ["Python", "CMU Graphics"],
        image: tag,
        link: "https://github.com/Squishyguy10/School/blob/master/ICS3U/tag.py",
    },
];
