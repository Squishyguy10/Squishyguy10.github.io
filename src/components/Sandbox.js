import { useEffect, useRef } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const FISH_COLORS = ['#ff9ad5', '#a58bff', '#ffd08a', '#ff8f9c', '#8fe3ff'];

const CFG = {
    maxSpeed: 2.4,
    minSpeed: 1.0,
    maxForce: 0.055,
    perception: 62,
    separation: 24,
    alignWeight: 1.0,
    cohesionWeight: 0.85,
    separationWeight: 1.6,
    fleeRadius: 135,
    fleeWeight: 3.2,
    rippleBand: 26,
};

const TAU = Math.PI * 2;
const TILE = 384;

// Bakes a tileable caustic texture: several sine gratings interfere, and the
// near-zero crossings of their sum become the bright filaments seen on a pool floor.
const buildCausticTile = () => {
    const tile = document.createElement('canvas');
    tile.width = TILE;
    tile.height = TILE;
    const tctx = tile.getContext('2d');
    const img = tctx.createImageData(TILE, TILE);
    const data = img.data;
    const k = TAU / TILE;
    const waves = [
        { fx: 3, fy: 2, p: 0 },
        { fx: -2, fy: 4, p: 1.7 },
        { fx: 5, fy: -3, p: 3.4 },
        { fx: 1, fy: 6, p: 5.1 },
    ];

    for (let y = 0; y < TILE; y++) {
        for (let x = 0; x < TILE; x++) {
            let v = 0;
            for (let w = 0; w < waves.length; w++) {
                v += Math.sin(k * (waves[w].fx * x + waves[w].fy * y) + waves[w].p);
            }
            v /= waves.length;
            const a = Math.pow(Math.max(0, 1 - Math.abs(v) / 0.17), 2.6);
            const i = (y * TILE + x) * 4;
            data[i] = 186;
            data[i + 1] = 238;
            data[i + 2] = 255;
            data[i + 3] = (a * 255) | 0;
        }
    }

    tctx.putImageData(img, 0, 0);
    return tile;
};

const createFish = (w, h) => {
    const angle = Math.random() * TAU;
    const speed = CFG.minSpeed + Math.random();
    return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 4.5 + Math.random() * 3,
        color: FISH_COLORS[Math.floor(Math.random() * FISH_COLORS.length)],
        phase: Math.random() * TAU,
    };
};

export const Sandbox = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        let width = 0;
        let height = 0;
        let fish = [];
        let ripples = [];
        let droplets = [];
        let motes = [];
        let wakeL = [];
        let wakeR = [];
        let wakeNoise = 0;
        let waterGradient = null;
        let depthGradient = null;
        let vignette = null;
        let frame = null;
        let visible = true;
        const pointer = {
            x: 0, y: 0, prevX: 0, prevY: 0, vx: 0, vy: 0,
            active: false, primed: false,
            angle: 0, targetAngle: 0, moveAngle: 0, turnRate: 0,
            wakeDist: 0, bowDist: 0,
        };

        const causticPattern = ctx.createPattern(buildCausticTile(), 'repeat');

        const paintWater = (t) => {
            ctx.fillStyle = waterGradient;
            ctx.fillRect(0, 0, width, height);

            ctx.save();
            ctx.globalCompositeOperation = 'lighter';

            ctx.globalAlpha = 0.26 + Math.sin(t * 0.0006) * 0.05;
            ctx.save();
            const s1 = 1.45;
            ctx.scale(s1, s1);
            const ax = (t * 0.006) % TILE;
            const ay = (t * 0.004) % TILE;
            ctx.translate(ax, ay);
            ctx.fillStyle = causticPattern;
            ctx.fillRect(-ax, -ay, width / s1, height / s1);
            ctx.restore();

            ctx.globalAlpha = 0.12 + Math.cos(t * 0.0004) * 0.035;
            ctx.save();
            const s2 = 2.7;
            ctx.scale(s2, s2);
            const bx = (-t * 0.009) % TILE;
            const by = (t * 0.003) % TILE;
            ctx.translate(bx, by);
            ctx.fillStyle = causticPattern;
            ctx.fillRect(-bx, -by, width / s2, height / s2);
            ctx.restore();

            // Soft elliptical light pools stand in for sun shafts; radial falloff keeps every edge feathered.
            ctx.globalAlpha = 1;
            for (let i = 0; i < 4; i++) {
                const sway = Math.sin(t * 0.00022 + i * 1.7) * width * 0.06;
                const x = width * (0.14 + i * 0.25) + sway;
                const radius = width * 0.085;
                ctx.save();
                ctx.translate(x, height * 0.02);
                ctx.scale(1, 5.5);
                const shaft = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
                shaft.addColorStop(0, 'rgba(154, 226, 255, 0.13)');
                shaft.addColorStop(0.55, 'rgba(154, 226, 255, 0.05)');
                shaft.addColorStop(1, 'rgba(154, 226, 255, 0)');
                ctx.fillStyle = shaft;
                ctx.beginPath();
                ctx.arc(0, 0, radius, 0, TAU);
                ctx.fill();
                ctx.restore();
            }

            ctx.restore();

            ctx.fillStyle = depthGradient;
            ctx.fillRect(0, 0, width, height);

            for (let i = 0; i < motes.length; i++) {
                const m = motes[i];
                ctx.fillStyle = `rgba(198, 235, 255, ${m.alpha})`;
                ctx.beginPath();
                ctx.arc(m.x, m.y, m.size, 0, TAU);
                ctx.fill();
            }
        };

        const resize = () => {
            const rect = canvas.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) return;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = rect.width;
            height = rect.height;
            canvas.width = Math.round(width * dpr);
            canvas.height = Math.round(height * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            waterGradient = ctx.createLinearGradient(0, 0, width * 0.25, height);
            waterGradient.addColorStop(0, '#13455c');
            waterGradient.addColorStop(0.45, '#0d3048');
            waterGradient.addColorStop(1, '#061a2c');

            depthGradient = ctx.createLinearGradient(0, 0, 0, height);
            depthGradient.addColorStop(0, 'rgba(5, 22, 38, 0)');
            depthGradient.addColorStop(1, 'rgba(4, 16, 30, 0.5)');

            vignette = ctx.createRadialGradient(
                width / 2, height / 2, Math.min(width, height) * 0.2,
                width / 2, height / 2, Math.max(width, height) * 0.72
            );
            vignette.addColorStop(0, 'rgba(2, 12, 22, 0)');
            vignette.addColorStop(1, 'rgba(2, 12, 22, 0.6)');

            const target = Math.round(Math.min(130, Math.max(35, (width * height) / 7200)));
            while (fish.length < target) fish.push(createFish(width, height));
            fish.length = Math.min(fish.length, target);

            const moteTarget = Math.round(Math.min(90, (width * height) / 11000));
            motes = [];
            for (let i = 0; i < moteTarget; i++) {
                motes.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.16,
                    vy: -0.05 - Math.random() * 0.14,
                    size: 0.5 + Math.random() * 1.3,
                    alpha: 0.06 + Math.random() * 0.16,
                });
            }
        };

        // Returns an acceleration vector steering toward the desired heading, capped at maxForce.
        const steer = (dx, dy, f, out) => {
            const m = Math.hypot(dx, dy);
            if (m === 0) {
                out[0] = 0;
                out[1] = 0;
                return out;
            }
            let sx = (dx / m) * CFG.maxSpeed - f.vx;
            let sy = (dy / m) * CFG.maxSpeed - f.vy;
            const sm = Math.hypot(sx, sy);
            if (sm > CFG.maxForce) {
                sx = (sx / sm) * CFG.maxForce;
                sy = (sy / sm) * CFG.maxForce;
            }
            out[0] = sx;
            out[1] = sy;
            return out;
        };

        const perceptionSq = CFG.perception * CFG.perception;
        const separationSq = CFG.separation * CFG.separation;
        const tmp = [0, 0];

        const addWake = (x, y, angle, amp, brk) => {
            const nx = Math.cos(angle);
            const ny = Math.sin(angle);
            // A correlated random walk, so neighbouring points drift together and the arm
            // undulates instead of zigzagging.
            wakeNoise = Math.max(-0.25, Math.min(0.25, wakeNoise * 0.86 + (Math.random() - 0.5) * 0.12));
            const spread = (0.75 + amp * 0.45) * (1 + wakeNoise);
            if (wakeL.length > 150) wakeL.shift();
            if (wakeR.length > 150) wakeR.shift();
            wakeL.push({ x, y, vx: -ny * spread - nx * 0.2, vy: nx * spread - ny * 0.2, life: 1, amp, brk });
            wakeR.push({ x, y, vx: ny * spread - nx * 0.2, vy: -nx * spread - ny * 0.2, life: 1, amp, brk });
        };

        const update = () => {
            // Derive the heading from a smoothed per-frame velocity: raw mouse deltas are
            // too small and noisy to steer from directly, which left the shark stuck facing one way.
            const mx = pointer.x - pointer.prevX;
            const my = pointer.y - pointer.prevY;
            pointer.prevX = pointer.x;
            pointer.prevY = pointer.y;
            pointer.vx += (mx - pointer.vx) * 0.14;
            pointer.vy += (my - pointer.vy) * 0.14;

            const speed = Math.hypot(pointer.vx, pointer.vy);
            if (speed > 0.35) {
                pointer.moveAngle = Math.atan2(pointer.vy, pointer.vx);
                pointer.targetAngle = pointer.moveAngle;
            }

            let turn = pointer.targetAngle - pointer.angle;
            turn = Math.atan2(Math.sin(turn), Math.cos(turn));
            // Angular rate scales with speed the way a real turn radius does (omega = v / R),
            // so a fast shark can still carve; the eased rate keeps it from snapping.
            const agility = Math.min(0.16, 0.02 + speed * 0.012);
            const wanted = Math.max(-agility, Math.min(agility, turn * 0.12));
            pointer.turnRate += (wanted - pointer.turnRate) * 0.15;
            pointer.angle += pointer.turnRate;

            // The body lags the travel direction through a turn; water is displaced along the
            // path, not along the nose, so waves key off moveAngle and this slip angle.
            let slip = pointer.moveAngle - pointer.angle;
            slip = Math.atan2(Math.sin(slip), Math.cos(slip));

            if (pointer.active && speed > 0.55) {
                const amp = Math.min(1, speed / 8);
                const leadX = pointer.x + Math.cos(pointer.moveAngle) * 24;
                const leadY = pointer.y + Math.sin(pointer.moveAngle) * 24;
                pointer.wakeDist += speed;
                pointer.bowDist += speed;

                if (pointer.wakeDist > 7) {
                    const brk = pointer.wakeDist > 90;
                    pointer.wakeDist = 0;
                    addWake(leadX, leadY, pointer.moveAngle, amp, brk);
                }
                if (pointer.bowDist > 18) {
                    pointer.bowDist = 0;
                    addBowWave(leadX, leadY, pointer.moveAngle, amp, slip);
                }
            } else {
                pointer.wakeDist = 999;
            }

            for (let i = 0; i < fish.length; i++) {
                const f = fish[i];
                let alignX = 0, alignY = 0, cohX = 0, cohY = 0, sepX = 0, sepY = 0, n = 0;

                for (let j = 0; j < fish.length; j++) {
                    if (i === j) continue;
                    const o = fish[j];
                    const dx = o.x - f.x;
                    const dy = o.y - f.y;
                    const d2 = dx * dx + dy * dy;
                    if (d2 === 0 || d2 > perceptionSq) continue;

                    alignX += o.vx;
                    alignY += o.vy;
                    cohX += o.x;
                    cohY += o.y;
                    n++;

                    if (d2 < separationSq) {
                        sepX -= dx / d2;
                        sepY -= dy / d2;
                    }
                }

                let ax = 0;
                let ay = 0;

                if (n > 0) {
                    steer(alignX / n, alignY / n, f, tmp);
                    ax += tmp[0] * CFG.alignWeight;
                    ay += tmp[1] * CFG.alignWeight;

                    steer(cohX / n - f.x, cohY / n - f.y, f, tmp);
                    ax += tmp[0] * CFG.cohesionWeight;
                    ay += tmp[1] * CFG.cohesionWeight;

                    if (sepX !== 0 || sepY !== 0) {
                        steer(sepX, sepY, f, tmp);
                        ax += tmp[0] * CFG.separationWeight;
                        ay += tmp[1] * CFG.separationWeight;
                    }
                }

                if (pointer.active) {
                    const dx = f.x - pointer.x;
                    const dy = f.y - pointer.y;
                    const d = Math.hypot(dx, dy);
                    if (d < CFG.fleeRadius && d > 0) {
                        const panic = (1 - d / CFG.fleeRadius) * CFG.fleeWeight;
                        steer(dx, dy, f, tmp);
                        ax += tmp[0] * panic;
                        ay += tmp[1] * panic;
                    }
                }

                for (let r = 0; r < ripples.length; r++) {
                    const ring = ripples[r];
                    if (ring.push === 0) continue;
                    const dx = f.x - ring.x;
                    const dy = f.y - ring.y;
                    const d = Math.hypot(dx, dy);
                    if (d === 0) continue;
                    let rel = Math.atan2(dy, dx) - ring.dir;
                    rel = Math.atan2(Math.sin(rel), Math.cos(rel));
                    if (Math.abs(rel - ring.skew) > ring.spread) continue;
                    const front = ring.radius * (1 + ring.stretch * (1 - Math.cos(rel - ring.skew)) * 0.5);
                    if (Math.abs(d - front) < CFG.rippleBand) {
                        const strength = ring.push * ring.amp;
                        ax += (dx / d) * strength;
                        ay += (dy / d) * strength;
                    }
                }

                f.vx += ax;
                f.vy += ay;

                const speed = Math.hypot(f.vx, f.vy);
                if (speed > CFG.maxSpeed) {
                    f.vx = (f.vx / speed) * CFG.maxSpeed;
                    f.vy = (f.vy / speed) * CFG.maxSpeed;
                } else if (speed < CFG.minSpeed && speed > 0) {
                    f.vx = (f.vx / speed) * CFG.minSpeed;
                    f.vy = (f.vy / speed) * CFG.minSpeed;
                }

                f.x += f.vx;
                f.y += f.vy;

                const margin = 20;
                if (f.x < -margin) f.x = width + margin;
                if (f.x > width + margin) f.x = -margin;
                if (f.y < -margin) f.y = height + margin;
                if (f.y > height + margin) f.y = -margin;
            }

            const reach = Math.max(width, height);
            for (let i = ripples.length - 1; i >= 0; i--) {
                const r = ripples[i];
                r.radius += r.speed;
                r.speed = Math.max(1.15, r.speed * 0.992);
                r.amp *= r.decay;
                if (r.amp < 0.015 || r.radius - r.crests * r.wavelength > reach) ripples.splice(i, 1);
            }

            for (let i = droplets.length - 1; i >= 0; i--) {
                const d = droplets[i];
                d.x += d.vx;
                d.y += d.vy;
                d.vx *= 0.93;
                d.vy *= 0.93;
                d.life -= 0.028;
                if (d.life <= 0) droplets.splice(i, 1);
            }

            for (const list of [wakeL, wakeR]) {
                for (let i = list.length - 1; i >= 0; i--) {
                    const p = list[i];
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vx *= 0.978;
                    p.vy *= 0.978;
                    p.life -= 0.009;
                    if (p.life <= 0) list.splice(i, 1);
                }
            }

            for (let i = 0; i < motes.length; i++) {
                const m = motes[i];
                m.x += m.vx;
                m.y += m.vy;
                if (m.y < -4) {
                    m.y = height + 4;
                    m.x = Math.random() * width;
                }
                if (m.x < -4) m.x = width + 4;
                if (m.x > width + 4) m.x = -4;
            }
        };

        const drawFish = (f, t) => {
            const s = f.size;
            const wag = Math.sin(t * 0.011 + f.phase) * s * 0.35;
            const angle = Math.atan2(f.vy, f.vx);

            const body = () => {
                ctx.beginPath();
                ctx.moveTo(s * 1.7, 0);
                ctx.quadraticCurveTo(0, s * 0.72, -s * 0.9, 0);
                ctx.quadraticCurveTo(0, -s * 0.72, s * 1.7, 0);
                ctx.fill();
                ctx.beginPath();
                ctx.moveTo(-s * 0.8, 0);
                ctx.lineTo(-s * 1.75, s * 0.6 + wag);
                ctx.lineTo(-s * 1.75, -s * 0.6 + wag);
                ctx.closePath();
                ctx.fill();
            };

            ctx.save();
            ctx.translate(f.x + 4, f.y + 7);
            ctx.rotate(angle);
            ctx.fillStyle = 'rgba(2, 14, 26, 0.3)';
            body();
            ctx.restore();

            ctx.save();
            ctx.translate(f.x, f.y);
            ctx.rotate(angle);
            ctx.fillStyle = f.color;
            body();
            ctx.restore();
        };

        const ARC_SEGMENTS = 32;
        const ARC_SUBDIV = 3;

        // Stretching the crest with the angle off the bow turns a plain circle into a teardrop
        // that hugs the flanks and trails behind, the way water actually parts around a moving body.
        const crestRadius = (rad, rel, stretch) => rad * (1 + stretch * (1 - Math.cos(rel)) * 0.5);

        const crestLight = (a) => `rgba(202, 243, 255, ${a})`;
        const crestDark = (a) => `rgba(3, 24, 42, ${a})`;

        const strokeCrest = (r, rad, base, colour, lineW) => {
            const span = r.spread * 2;
            for (let s = 0; s < ARC_SEGMENTS; s++) {
                const rel0 = -r.spread + (span * s) / ARC_SEGMENTS;
                const rel1 = -r.spread + (span * (s + 1)) / ARC_SEGMENTS;

                let fall = 1;
                if (r.feather) {
                    const u = Math.min(1, Math.abs((rel0 + rel1) * 0.5 - r.skew) / r.spread);
                    fall = 0.5 + 0.5 * Math.cos(Math.PI * u);
                }
                const alpha = base * fall;
                if (alpha < 0.008) continue;

                ctx.beginPath();
                for (let k = 0; k <= ARC_SUBDIV; k++) {
                    const rel = rel0 + ((rel1 - rel0) * k) / ARC_SUBDIV;
                    const rr = crestRadius(rad, rel - r.skew, r.stretch);
                    const ang = r.dir + rel;
                    const px = r.x + Math.cos(ang) * rr;
                    const py = r.y + Math.sin(ang) * rr;
                    if (k === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
                ctx.strokeStyle = colour(alpha);
                ctx.lineWidth = lineW;
                ctx.stroke();
            }
        };

        const drawRipple = (r) => {
            for (let k = 0; k < r.crests; k++) {
                const rad = r.radius - k * r.wavelength;
                if (rad <= 1) continue;
                // Trailing crests fade, and the front loses height as its energy spreads along a longer crest.
                const env = r.amp * Math.exp(-k * 0.45) * Math.sqrt(34 / (rad + 34));
                if (env < 0.012) continue;

                const trough = rad - r.wavelength * 0.45;
                if (trough > 1) strokeCrest(r, trough, env * 0.5, crestDark, 2.4 - k * 0.25);
                strokeCrest(r, rad, env * 0.9, crestLight, 1.7 - k * 0.18);
            }
        };

        const drawWakeArm = (list) => {
            for (let i = 1; i < list.length; i++) {
                const p = list[i - 1];
                const q = list[i];
                if (q.brk) continue;
                const life = Math.min(p.life, q.life);
                ctx.lineWidth = 0.9 + life * 1.9;
                ctx.strokeStyle = `rgba(208, 242, 255, ${life * life * 0.7 * p.amp})`;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(q.x, q.y);
                ctx.stroke();
            }
        };

        const sharkShape = (s, wag) => {
            ctx.beginPath();
            ctx.moveTo(s * 2.05, 0);
            ctx.bezierCurveTo(s * 1.15, s * 0.5, s * -0.1, s * 0.58, s * -1.05, s * 0.2);
            ctx.lineTo(s * -1.05, s * -0.2);
            ctx.bezierCurveTo(s * -0.1, s * -0.58, s * 1.15, s * -0.5, s * 2.05, 0);
            ctx.closePath();
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(s * 0.55, s * 0.34);
            ctx.lineTo(s * -0.55, s * 1.3);
            ctx.lineTo(s * -0.1, s * 0.28);
            ctx.closePath();
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(s * 0.55, s * -0.34);
            ctx.lineTo(s * -0.55, s * -1.3);
            ctx.lineTo(s * -0.1, s * -0.28);
            ctx.closePath();
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(s * -0.95, wag * 0.3);
            ctx.lineTo(s * -2.0, s * 0.78 + wag);
            ctx.quadraticCurveTo(s * -1.5, wag * 0.5, s * -2.0, s * -0.78 + wag);
            ctx.closePath();
            ctx.fill();
        };

        const drawShark = (t) => {
            const s = 15;
            const wag = Math.sin(t * 0.006) * s * 0.28;

            ctx.save();
            ctx.translate(pointer.x + 6, pointer.y + 10);
            ctx.rotate(pointer.angle);
            ctx.fillStyle = 'rgba(2, 14, 26, 0.34)';
            sharkShape(s, wag);
            ctx.restore();

            ctx.save();
            ctx.translate(pointer.x, pointer.y);
            ctx.rotate(pointer.angle);

            ctx.fillStyle = '#5d7183';
            sharkShape(s, wag);

            const skin = ctx.createLinearGradient(0, -s * 0.6, 0, s * 0.6);
            skin.addColorStop(0, '#61768a');
            skin.addColorStop(0.45, '#a9bccc');
            skin.addColorStop(1, '#5c7285');
            ctx.fillStyle = skin;
            ctx.beginPath();
            ctx.moveTo(s * 2.05, 0);
            ctx.bezierCurveTo(s * 1.15, s * 0.5, s * -0.1, s * 0.58, s * -1.05, s * 0.2);
            ctx.lineTo(s * -1.05, s * -0.2);
            ctx.bezierCurveTo(s * -0.1, s * -0.58, s * 1.15, s * -0.5, s * 2.05, 0);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = '#455a6b';
            ctx.beginPath();
            ctx.moveTo(s * 0.35, 0);
            ctx.lineTo(s * -0.7, s * 0.13);
            ctx.lineTo(s * -0.7, s * -0.13);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = '#16222c';
            ctx.beginPath();
            ctx.arc(s * 1.25, s * 0.22, s * 0.09, 0, TAU);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(s * 1.25, s * -0.22, s * 0.09, 0, TAU);
            ctx.fill();

            ctx.restore();
        };

        const draw = (t) => {
            paintWater(t);

            for (let i = 0; i < fish.length; i++) drawFish(fish[i], t);

            if (pointer.active) drawShark(t);

            ctx.lineCap = 'round';
            drawWakeArm(wakeL);
            drawWakeArm(wakeR);

            for (let i = 0; i < ripples.length; i++) drawRipple(ripples[i]);
            ctx.lineCap = 'butt';

            if (pointer.active) {
                const speed = Math.hypot(pointer.vx, pointer.vy);
                const dimple = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 30);
                dimple.addColorStop(0, 'rgba(4, 24, 40, 0.3)');
                dimple.addColorStop(0.72, 'rgba(170, 232, 255, 0.1)');
                dimple.addColorStop(1, 'rgba(170, 232, 255, 0)');
                ctx.fillStyle = dimple;
                ctx.beginPath();
                ctx.arc(pointer.x, pointer.y, 30, 0, TAU);
                ctx.fill();

                // Water piling up against the snout.
                if (speed > 0.8) {
                    const bow = Math.min(1, speed / 9);
                    ctx.lineWidth = 1.4 + bow * 1.6;
                    ctx.strokeStyle = `rgba(216, 246, 255, ${bow * 0.5})`;
                    ctx.beginPath();
                    ctx.arc(pointer.x, pointer.y, 30 + bow * 5, pointer.moveAngle - 0.85, pointer.moveAngle + 0.85);
                    ctx.stroke();
                }
            }

            for (let i = 0; i < droplets.length; i++) {
                const d = droplets[i];
                ctx.fillStyle = `rgba(224, 248, 255, ${d.life * 0.8})`;
                ctx.beginPath();
                ctx.arc(d.x, d.y, d.size * d.life, 0, TAU);
                ctx.fill();
            }

            ctx.fillStyle = vignette;
            ctx.fillRect(0, 0, width, height);
        };

        const loop = (t) => {
            update();
            draw(t);
            frame = requestAnimationFrame(loop);
        };

        const addBowWave = (x, y, dir, amp, slip) => {
            if (ripples.length > 30) ripples.shift();
            const skew = Math.max(-0.55, Math.min(0.55, slip * 0.7));
            ripples.push({
                x, y, dir,
                spread: 1.75 + Math.min(0.5, Math.abs(slip) * 0.6),
                skew,
                stretch: 0.6,
                feather: true,
                radius: 8,
                speed: 2.2,
                amp: amp * 0.95,
                wavelength: 12,
                crests: 3,
                push: amp * 0.5,
                decay: 0.972,
            });
        };

        const addSplash = (x, y) => {
            if (ripples.length > 30) ripples.shift();
            ripples.push({
                x, y,
                dir: 0,
                spread: Math.PI,
                skew: 0,
                stretch: 0,
                feather: false,
                radius: 2,
                speed: 3.1,
                amp: 1,
                wavelength: 15,
                crests: 5,
                push: 0.85,
                decay: 0.987,
            });
        };

        const onPointerMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            const nx = e.clientX - rect.left;
            const ny = e.clientY - rect.top;
            if (!pointer.primed) {
                pointer.primed = true;
                pointer.prevX = nx;
                pointer.prevY = ny;
            }
            pointer.x = nx;
            pointer.y = ny;
            pointer.active = true;
        };

        const onPointerLeave = () => {
            pointer.active = false;
            pointer.primed = false;
            pointer.vx = 0;
            pointer.vy = 0;
        };

        const onPointerDown = (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            addSplash(x, y);
            for (let i = 0; i < 16; i++) {
                const a = Math.random() * TAU;
                const sp = 1.4 + Math.random() * 3.2;
                droplets.push({
                    x,
                    y,
                    vx: Math.cos(a) * sp,
                    vy: Math.sin(a) * sp,
                    life: 1,
                    size: 0.9 + Math.random() * 1.7,
                });
            }
        };

        resize();

        if (reduceMotion) {
            paintWater(0);
            for (let i = 0; i < fish.length; i++) drawFish(fish[i], 0);
            ctx.fillStyle = vignette;
            ctx.fillRect(0, 0, width, height);
            return () => {};
        }

        canvas.addEventListener('pointermove', onPointerMove);
        canvas.addEventListener('pointerleave', onPointerLeave);
        canvas.addEventListener('pointerdown', onPointerDown);

        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(canvas);

        // Only burn frames while the sandbox is actually on screen.
        const intersectionObserver = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            if (visible && frame === null) {
                frame = requestAnimationFrame(loop);
            } else if (!visible && frame !== null) {
                cancelAnimationFrame(frame);
                frame = null;
            }
        }, { threshold: 0 });
        intersectionObserver.observe(canvas);

        frame = requestAnimationFrame(loop);

        return () => {
            if (frame !== null) cancelAnimationFrame(frame);
            resizeObserver.disconnect();
            intersectionObserver.disconnect();
            canvas.removeEventListener('pointermove', onPointerMove);
            canvas.removeEventListener('pointerleave', onPointerLeave);
            canvas.removeEventListener('pointerdown', onPointerDown);
        };
    }, []);

    return (
        <section className='sandbox' id='sandbox'>
            <Container>
                <Row>
                    <Col>
                        <span className='section-eyebrow'>Sandbox</span>
                        <h2> Flocking </h2>
                        <p className='sandbox-intro'>
                            A school of boids running Reynolds' three rules &mdash; separation, alignment
                            and cohesion. Your cursor is the shark: swim it through the tank to push
                            ripples ahead of you and scatter the school, then click to make a splash.
                        </p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div className='sandbox-tank'>
                            <canvas ref={canvasRef} className='sandbox-canvas' />
                        </div>
                        <ul className='sandbox-legend'>
                            <li><strong>Separation</strong> steer away from crowding</li>
                            <li><strong>Alignment</strong> match the heading of neighbours</li>
                            <li><strong>Cohesion</strong> drift toward the local centre</li>
                            <li><strong>Flee</strong> escape the shark and its ripple fronts</li>
                        </ul>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};
