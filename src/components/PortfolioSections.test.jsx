import { Experience } from "./Experience";
import { render, screen } from "@testing-library/react";
import { Projects } from "./Projects";

test("renders the portfolio's core sections", () => {
    render(
        <>
            <Projects />
            <Experience />
        </>
    );

});
