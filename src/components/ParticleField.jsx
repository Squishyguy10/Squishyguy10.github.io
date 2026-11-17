import { useEffect, useRef } from "react";

const PARTICLE_COUNT = 720;
const TWO_PI = Math.PI * 2;
const FIELD_SCALE = 1.18;
const MAX_DPR = 1.5;
const FRAME_INTERVAL = 1000 / 45;

const seeded = (index, salt = 0) => {
    const value = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453;
    return value - Math.floor(value);
};

const constrainDonutHole = (x, y, index, total, scale = 1) => {
    const holeX = 0.095 * scale;
    const holeY = 0.068 * scale;
    const rotation = -0.28;
    const offsetX = x - 0.5;
    const offsetY = y - 0.5;
    const localX = offsetX * Math.cos(rotation) + offsetY * Math.sin(rotation);
    const localY = -offsetX * Math.sin(rotation) + offsetY * Math.cos(rotation);
    const distance = Math.hypot(localX / holeX, localY / holeY);

    if (distance >= 1) return { x, y };

    const angle = distance > 0
        ? Math.atan2(localY / holeY, localX / holeX)
        : (index / total) * TWO_PI;
    const boundaryX = Math.cos(angle) * holeX;
    const boundaryY = Math.sin(angle) * holeY;
    return {
        x: 0.5 + boundaryX * Math.cos(rotation) - boundaryY * Math.sin(rotation),
        y: 0.5 + boundaryX * Math.sin(rotation) + boundaryY * Math.cos(rotation),
    };
};

const getShapePoint = (shape, index, total) => {
    const randomX = seeded(index, 2);
    const randomY = seeded(index, 7);
    const t = index / total;
    const edgeParticle = shape === "donut" || shape === "pencil"
        ? index % 2 === 0
        : index % 4 === 0;
    const vaseRimParticle = shape === "vase" && index % 13 === 0;
    const outlineParticle = edgeParticle || vaseRimParticle;
    let x = randomX;
    let y = randomY;
    let depth = (randomX - 0.5) * 0.35;
    let edgeStrength = edgeParticle ? 1 : 0;
    let tipParticle = false;

    if (shape === "donut") {
        const majorRadius = 0.18;
        const tubeRadius = 0.085;
        const tiltX = -0.48;
        const tiltY = 0.25;
        const slant = -0.28;
        const projectDonut = (rawX, rawY, rawZ) => {
            const tiltedY = rawY * Math.cos(tiltX) - rawZ * Math.sin(tiltX);
            const tiltedZ = rawY * Math.sin(tiltX) + rawZ * Math.cos(tiltX);
            const rotatedX = rawX * Math.cos(tiltY) + tiltedZ * Math.sin(tiltY);
            const rotatedZ = -rawX * Math.sin(tiltY) + tiltedZ * Math.cos(tiltY);
            const slantedX = rotatedX * Math.cos(slant) - tiltedY * Math.sin(slant);
            const slantedY = rotatedX * Math.sin(slant) + tiltedY * Math.cos(slant);
            const perspective = 1 + rotatedZ * 0.65;

            return {
                x: 0.5 + slantedX * perspective,
                y: 0.5 + slantedY * perspective * 0.8,
                depth: rotatedZ / 0.25,
            };
        };

        if (edgeParticle) {
            const lineIndex = Math.floor(index / 2);
            const linesPerDirection = 6;
            const pointsPerLine = 30;
            let aroundRing;
            let aroundTube;

            if (lineIndex < linesPerDirection * pointsPerLine) {
                const line = lineIndex % linesPerDirection;
                const point = Math.floor(lineIndex / linesPerDirection);
                aroundRing = (point / pointsPerLine) * TWO_PI;
                aroundTube = (line / linesPerDirection) * TWO_PI;
            } else {
                const minorIndex = lineIndex - linesPerDirection * pointsPerLine;
                const line = minorIndex % linesPerDirection;
                const point = Math.floor(minorIndex / linesPerDirection);
                aroundRing = (line / linesPerDirection) * TWO_PI;
                aroundTube = (point / pointsPerLine) * TWO_PI;
            }
            if (lineIndex < linesPerDirection * pointsPerLine) {
                const line = lineIndex % linesPerDirection;
                edgeStrength = line === 0 || line === 3 ? 1 : 0.68;
            } else {
                edgeStrength = 0.58;
            }

            const tubeCenter = majorRadius + tubeRadius * Math.cos(aroundTube);
            const edgePoint = projectDonut(
                Math.cos(aroundRing) * tubeCenter,
                Math.sin(aroundRing) * tubeCenter,
                tubeRadius * Math.sin(aroundTube)
            );
            x = edgePoint.x;
            y = edgePoint.y;
            depth = edgePoint.depth;
        } else {
            const aroundRing = t * TWO_PI;
            const aroundTube = seeded(index, 13) * TWO_PI;
            const tubeCenter = majorRadius + tubeRadius * Math.cos(aroundTube);
            const donutPoint = projectDonut(
                Math.cos(aroundRing) * tubeCenter,
                Math.sin(aroundRing) * tubeCenter,
                tubeRadius * Math.sin(aroundTube)
            );
            x = donutPoint.x;
            y = donutPoint.y;
            depth = donutPoint.depth;
        }

        const constrainedHole = constrainDonutHole(x, y, index, total);
        x = constrainedHole.x;
        y = constrainedHole.y;
    } else if (shape === "vase") {
        const vaseY = 0.13 + randomY * 0.72;
        const progress = (vaseY - 0.13) / 0.72;
        let bodyWidth;
        if (progress < 0.12) {
            bodyWidth = 0.1 - (progress / 0.12) * 0.055;
        } else if (progress < 0.3) {
            bodyWidth = 0.045 + ((progress - 0.12) / 0.18) * 0.12;
        } else if (progress < 0.72) {
            bodyWidth = 0.165 + ((progress - 0.3) / 0.42) * 0.025;
        } else {
            bodyWidth = 0.19 + ((progress - 0.72) / 0.28) * 0.015;
        }
        const bottomCurve = progress > 0.84
            ? Math.cos(((progress - 0.84) / 0.16) * Math.PI * 0.5)
            : 1;
        const roundedFootWidth = 0.055;
        const widthAtHeight = progress > 0.84
            ? roundedFootWidth + (bodyWidth - roundedFootWidth) * bottomCurve
            : bodyWidth;

        if (vaseRimParticle) {
            const openingAngle = seeded(index, 73) * TWO_PI;
            x = 0.5 + Math.cos(openingAngle) * 0.1;
            y = 0.13 + Math.sin(openingAngle) * 0.018;
            depth = Math.sin(openingAngle);
        } else if (edgeParticle) {
            const side = seeded(index, 73) < 0.5 ? -1 : 1;
            x = 0.5 + side * widthAtHeight;
            y = vaseY;
            depth = 0.8;
        } else {
            x = 0.5 + (randomX - 0.5) * widthAtHeight * 2;
            y = vaseY;
            depth = (randomX - 0.5) * 0.7;
        }
    } else if (shape === "pencil") {
        const pencilLineIndex = edgeParticle ? Math.floor(index / 2) : 0;
        const pencilLine = pencilLineIndex % 6;
        const pencilLinePoint = Math.floor(pencilLineIndex / 6);
        const pencilLineCount = 60;
        const axial = edgeParticle
            ? -0.32 + (pencilLinePoint / (pencilLineCount - 1)) * 0.64
            : -0.32 + randomY * 0.64;
        const tipEnd = -0.12;
        tipParticle = axial < tipEnd;
        const radius = axial < tipEnd
            ? 0.065 * Math.max(0, (axial + 0.32) / (tipEnd + 0.32))
            : 0.065;
        const radial = edgeParticle
            ? Math.cos((pencilLine / 6) * TWO_PI) * radius
            : (randomX - 0.5) * 2 * radius;
        const pencilAngle = -0.65;
        const axisX = Math.cos(pencilAngle);
        const axisY = Math.sin(pencilAngle);
        const normalX = -Math.sin(pencilAngle);
        const normalY = Math.cos(pencilAngle);

        x = 0.5 + axisX * axial + normalX * radial;
        y = 0.5 + axisY * axial + normalY * radial;
        depth = edgeParticle
            ? Math.sin((pencilLine / 6) * TWO_PI) * 0.75
            : (randomX - 0.5) * 0.7;
    } else {
        const angle = seeded(index, 31) * TWO_PI;
        const radius = Math.sqrt(seeded(index, 37)) * 0.31;
        x = 0.5 + Math.cos(angle) * radius;
        y = 0.5 + Math.sin(angle) * radius;
    }

    if (shape === "vase") {
        const tilt = -0.14;
        const offsetX = x - 0.5;
        const offsetY = y - 0.5;
        x = 0.5 + offsetX * Math.cos(tilt) - offsetY * Math.sin(tilt);
        y = 0.5 + offsetX * Math.sin(tilt) + offsetY * Math.cos(tilt);
    }

    const shapeScale = shape === "donut"
        ? FIELD_SCALE
        : shape === "vase"
            ? 0.84
            : shape === "pencil"
                ? 0.95
                : 1.02;
    x = 0.5 + (x - 0.5) * shapeScale;
    y = 0.5 + (y - 0.5) * shapeScale;

    return {
        x,
        y,
        depth,
        edge: outlineParticle,
        edgeStrength,
        tip: tipParticle,
        visible: true,
    };
};

export function ParticleField({ shape = "donut" }) {
    const canvasRef = useRef(null);
    const shapeRef = useRef(shape);

    useEffect(() => {
        shapeRef.current = shape;
    }, [shape]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const particles = Array.from({ length: PARTICLE_COUNT }, (_, index) => {
            const point = getShapePoint(shapeRef.current, index, PARTICLE_COUNT);
            const initialJitter = point.edge ? 0.006 : 0.025;
            return {
                x: point.x + (Math.random() - 0.5) * initialJitter,
                y: point.y + (Math.random() - 0.5) * initialJitter,
                vx: 0,
                vy: 0,
                targetX: point.x,
                targetY: point.y,
                depth: point.depth,
                targetDepth: point.depth,
                edge: point.edge,
                edgeStrength: point.edgeStrength,
                tip: point.tip,
                visible: point.visible,
                visibility: point.visible ? 1 : 0,
                targetVisibility: point.visible ? 1 : 0,
                size: 0.8 + seeded(index, 43) * 2.2,
                alpha: 0.2 + seeded(index, 47) * 0.8,
                phase: seeded(index, 53) * TWO_PI,
                floatScale: 5 + seeded(index, 59) * 15,
                shade: 0.48 + seeded(index, 61) * 0.82,
            };
        });
        const pointer = { x: 0.5, y: 0.5, active: false };
        let width = 0;
        let height = 0;
        let dpr = 1;
        let previousShape = shapeRef.current;
        let glowGradient = null;
        let animationFrame = null;
        let lastFrameTime = 0;
        let isVisible = true;
        let shapeTransition = null;

        const resize = () => {
            const bounds = canvas.getBoundingClientRect();
            width = bounds.width;
            height = bounds.height;
            dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
            canvas.width = Math.round(width * dpr);
            canvas.height = Math.round(height * dpr);
            context.setTransform(dpr, 0, 0, dpr, 0, 0);
            glowGradient = context.createRadialGradient(width * 0.53, height * 0.46, 0, width * 0.53, height * 0.46, width * 0.54);
            glowGradient.addColorStop(0, "rgba(98, 182, 255, 0.11)");
            glowGradient.addColorStop(1, "rgba(98, 182, 255, 0)");
        };

        const updateTargets = (time) => {
            if (previousShape === shapeRef.current) return;
            previousShape = shapeRef.current;
            shapeTransition = {
                startedAt: time,
                from: particles.map((particle) => ({
                    x: particle.targetX,
                    y: particle.targetY,
                    depth: particle.targetDepth,
                    visibility: particle.visibility,
                })),
                to: particles.map((particle, index) => {
                    const point = getShapePoint(previousShape, index, PARTICLE_COUNT);
                    return {
                        x: point.x,
                        y: point.y,
                        depth: point.depth,
                        edge: point.edge,
                        edgeStrength: point.edgeStrength,
                        tip: point.tip,
                        visible: point.visible,
                        visibility: point.visible ? 1 : 0,
                    };
                }),
            };
        };

        const updateTransition = (time) => {
            if (!shapeTransition) return;
            const rawProgress = Math.min(1, (time - shapeTransition.startedAt) / 2800);
            const easedProgress = rawProgress * rawProgress * (3 - 2 * rawProgress);

            particles.forEach((particle, index) => {
                const from = shapeTransition.from[index];
                const to = shapeTransition.to[index];
                particle.targetX = from.x + (to.x - from.x) * easedProgress;
                particle.targetY = from.y + (to.y - from.y) * easedProgress;
                particle.targetDepth = from.depth + (to.depth - from.depth) * easedProgress;
                particle.visibility = from.visibility + (to.visibility - from.visibility) * easedProgress;

                if (rawProgress === 1) {
                    particle.edge = to.edge;
                    particle.edgeStrength = to.edgeStrength;
                    particle.tip = to.tip;
                    particle.visible = to.visible;
                    particle.targetVisibility = to.visibility;
                }
            });

            if (rawProgress === 1) shapeTransition = null;
        };

        const handlePointerMove = (event) => {
            const bounds = canvas.getBoundingClientRect();
            pointer.x = (event.clientX - bounds.left) / bounds.width;
            pointer.y = (event.clientY - bounds.top) / bounds.height;
            pointer.active = true;
        };

        const clearPointer = () => {
            pointer.active = false;
        };

        const draw = (time) => {
            if (!isVisible) {
                animationFrame = null;
                return;
            }
            if (time - lastFrameTime < FRAME_INTERVAL) {
                animationFrame = window.requestAnimationFrame(draw);
                return;
            }
            lastFrameTime = time;
            updateTargets(time);
            updateTransition(time);
            context.clearRect(0, 0, width, height);

            context.fillStyle = glowGradient;
            context.fillRect(0, 0, width, height);

            const inverseWidth = 1 / Math.max(width, 1);
            const inverseHeight = 1 / Math.max(height, 1);
            const pointerX = pointer.x * width;
            const pointerY = pointer.y * height;
            particles.forEach((particle, index) => {
                const floatX = reduceMotion
                    ? 0
                    : Math.sin(time * 0.00032 + particle.phase) * particle.floatScale
                        + Math.cos(time * 0.00019 + particle.phase * 1.7) * particle.floatScale * 0.45;
                const floatY = reduceMotion
                    ? 0
                    : Math.cos(time * 0.00028 + particle.phase * 1.2) * particle.floatScale
                        + Math.sin(time * 0.00017 + particle.phase * 0.8) * particle.floatScale * 0.5;
                const floatMultiplier = particle.edge ? 0.12 : particle.tip ? 0.3 : 1;
                const targetX = particle.targetX * width + floatX * floatMultiplier;
                const targetY = particle.targetY * height + floatY * floatMultiplier;
                const drift = reduceMotion ? 0 : Math.sin(time * 0.0007 + index) * 0.18;
                const dx = targetX - particle.x * width;
                const dy = targetY - particle.y * height;
                const pointerDistance = Math.hypot(pointerX - particle.x * width, pointerY - particle.y * height);
                const repel = pointer.active && pointerDistance < 120 ? (1 - pointerDistance / 120) * 0.65 : 0;

                particle.vx += dx * 0.0019 + Math.cos(time * 0.00055 + index) * 0.0015 + repel * (particle.x * width - pointer.x * width) / Math.max(pointerDistance, 1) * 0.04;
                particle.vy += dy * 0.0019 + drift * 0.0008;
                particle.vx *= 0.94;
                particle.vy *= 0.94;
                particle.x += particle.vx * inverseWidth;
                particle.y += particle.vy * inverseHeight;
                particle.depth += (particle.targetDepth - particle.depth) * 0.015;
                particle.renderX = particle.x * width;
                particle.renderY = particle.y * height;
            });

            particles.forEach((particle) => {
                if (particle.visibility <= 0.01) {
                    return;
                }
                const sparkleWave = reduceMotion ? 0 : Math.sin(time * 0.0032 + particle.phase * 2.4);
                const sparkle = sparkleWave > 0.68 ? (sparkleWave - 0.68) / 0.32 : 0;
                const shadePulse = 0.72 + Math.sin(time * 0.0012 + particle.phase) * 0.28;
                const brightness = Math.min(1, particle.shade * shadePulse + sparkle * 0.55);
                const materialBrightness = particle.tip ? brightness * 0.72 : brightness;
                const red = Math.round(135 + materialBrightness * 100);
                const green = Math.round(195 + materialBrightness * 60);
                const blue = Math.round(225 + materialBrightness * 30);
                const pulse = 0.66 + shadePulse * 0.34 + sparkle * 0.5;
                const particleX = particle.renderX;
                const particleY = particle.renderY;
                const depthScale = 0.82 + ((particle.depth + 1) / 2) * 0.38;
                const edgeBoost = particle.edge ? 0.2 + particle.edgeStrength * 0.22 : 0;
                const edgeSize = particle.edge ? 0.35 + particle.edgeStrength * 0.25 : 0;
                const tipSize = particle.tip ? 0.72 : 1;
                const sparkleSize = particle.tip ? sparkle * 0.3 : sparkle;

                context.fillStyle = `rgb(${red}, ${green}, ${blue})`;
                context.globalAlpha = Math.min(1, particle.alpha * pulse + edgeBoost)
                    * (0.55 + brightness * 0.45)
                    * particle.visibility;
                context.beginPath();
                context.arc(particleX, particleY, particle.size * depthScale * tipSize + sparkleSize * 1.25 + edgeSize, 0, TWO_PI);
                context.fill();

                if (sparkle > 0.9 && !particle.tip) {
                    const ray = particle.size * (2.5 + sparkle * 2);
                    context.globalAlpha = sparkle * 0.7;
                    context.strokeStyle = "rgb(225, 248, 255)";
                    context.lineWidth = 0.6;
                    context.beginPath();
                    context.moveTo(particleX - ray, particleY);
                    context.lineTo(particleX + ray, particleY);
                    context.moveTo(particleX, particleY - ray);
                    context.lineTo(particleX, particleY + ray);
                    context.stroke();
                }
            });
            context.globalAlpha = 1;

            animationFrame = window.requestAnimationFrame(draw);
        };

        const observer = new ResizeObserver(resize);
        const visibilityObserver = new IntersectionObserver(([entry]) => {
            isVisible = entry.isIntersecting;
            if (isVisible && animationFrame === null) {
                animationFrame = window.requestAnimationFrame(draw);
            }
        });
        observer.observe(canvas);
        visibilityObserver.observe(canvas);
        canvas.addEventListener("pointermove", handlePointerMove);
        canvas.addEventListener("pointerleave", clearPointer);
        resize();
        animationFrame = window.requestAnimationFrame(draw);

        return () => {
            observer.disconnect();
            visibilityObserver.disconnect();
            canvas.removeEventListener("pointermove", handlePointerMove);
            canvas.removeEventListener("pointerleave", clearPointer);
            window.cancelAnimationFrame(animationFrame);
        };
    }, []);

    return <canvas ref={canvasRef} className="particle-field" aria-label="Animated particle sculpture" role="img" />;
}
