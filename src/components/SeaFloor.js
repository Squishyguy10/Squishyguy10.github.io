import { useState } from 'react';

const WEEDS = [
    { left: 3, h: 160, hue: 168, light: 26, dur: 7.4, delay: -1.2, sway: 7 },
    { left: 9, h: 108, hue: 158, light: 31, dur: 5.8, delay: -3.4, sway: 9 },
    { left: 15, h: 196, hue: 172, light: 22, dur: 8.6, delay: -0.5, sway: 6 },
    { left: 22, h: 124, hue: 150, light: 29, dur: 6.4, delay: -2.7, sway: 8 },
    { left: 29, h: 172, hue: 165, light: 24, dur: 7.9, delay: -4.1, sway: 7 },
    { left: 36, h: 96, hue: 154, light: 33, dur: 5.2, delay: -1.9, sway: 10 },
    { left: 42, h: 142, hue: 170, light: 27, dur: 6.9, delay: -3.1, sway: 8 },
    { left: 60, h: 132, hue: 160, light: 28, dur: 6.2, delay: -2.2, sway: 8 },
    { left: 67, h: 188, hue: 174, light: 23, dur: 8.2, delay: -0.9, sway: 6 },
    { left: 74, h: 104, hue: 152, light: 32, dur: 5.5, delay: -3.8, sway: 9 },
    { left: 81, h: 166, hue: 166, light: 25, dur: 7.6, delay: -1.6, sway: 7 },
    { left: 88, h: 118, hue: 158, light: 30, dur: 6.0, delay: -4.4, sway: 9 },
    { left: 95, h: 178, hue: 171, light: 22, dur: 8.9, delay: -2.5, sway: 6 },
];

const BUBBLES = [
    { left: 12, size: 6, dur: 11, delay: 0 },
    { left: 31, size: 4, dur: 14, delay: -5 },
    { left: 58, size: 7, dur: 9.5, delay: -2.5 },
    { left: 77, size: 5, dur: 12.5, delay: -7.5 },
    { left: 92, size: 4, dur: 13.5, delay: -3.5 },
];

export const SeaFloor = () => {
    const [open, setOpen] = useState(false);

    return (
        <section className='seafloor' aria-label='Ocean floor'>
            {BUBBLES.map((b, i) => (
                <span
                    key={i}
                    className='sf-bubble'
                    style={{
                        left: `${b.left}%`,
                        width: b.size,
                        height: b.size,
                        animationDuration: `${b.dur}s`,
                        animationDelay: `${b.delay}s`,
                    }}
                />
            ))}

            <div className='sf-plants'>
                {WEEDS.map((w, i) => (
                    <span
                        key={i}
                        className='sf-weed'
                        style={{
                            left: `${w.left}%`,
                            height: w.h,
                            animationDuration: `${w.dur}s`,
                            animationDelay: `${w.delay}s`,
                            '--sway': `${w.sway}deg`,
                        }}
                    >
                        <svg viewBox='0 0 40 200' preserveAspectRatio='none' aria-hidden='true'>
                            <path
                                d='M20,200 C8,158 32,132 18,94 C6,62 28,38 20,0'
                                fill='none'
                                stroke={`hsl(${w.hue}, 42%, ${w.light}%)`}
                                strokeWidth='9'
                                strokeLinecap='round'
                            />
                            <path
                                d='M20,200 C13,160 27,136 19,100'
                                fill='none'
                                stroke={`hsl(${w.hue}, 38%, ${w.light + 8}%)`}
                                strokeWidth='3'
                                strokeLinecap='round'
                                opacity='0.55'
                            />
                        </svg>
                    </span>
                ))}
            </div>

            <button
                type='button'
                className={`sf-clam ${open ? 'is-open' : ''}`}
                onClick={() => setOpen((o) => !o)}
                aria-pressed={open}
                aria-label={open ? 'Close the clam' : 'Open the clam'}
            >
                <span className='sf-clam-glow' aria-hidden='true' />
                <span className='sf-clam-interior' aria-hidden='true' />
                <span className='sf-clam-pearl' aria-hidden='true' />

                <svg className='sf-shell sf-shell-top' viewBox='0 0 160 50' aria-hidden='true'>
                    <path d='M4,48 C4,18 38,4 80,4 C122,4 156,18 156,48 Z' fill='url(#shellTop)' />
                    <g stroke='rgba(94, 62, 74, 0.32)' strokeWidth='1.5' fill='none' strokeLinecap='round'>
                        <path d='M80,5 L80,48' />
                        <path d='M80,5 C58,14 44,30 42,48' />
                        <path d='M80,5 C102,14 116,30 118,48' />
                        <path d='M80,6 C50,13 26,29 20,48' />
                        <path d='M80,6 C110,13 134,29 140,48' />
                    </g>
                    <defs>
                        <linearGradient id='shellTop' x1='0' y1='0' x2='0' y2='1'>
                            <stop offset='0%' stopColor='#f3dcd8' />
                            <stop offset='100%' stopColor='#c19aa0' />
                        </linearGradient>
                    </defs>
                </svg>

                <svg className='sf-shell sf-shell-bottom' viewBox='0 0 160 50' aria-hidden='true'>
                    <path d='M4,2 C4,32 38,46 80,46 C122,46 156,32 156,2 Z' fill='url(#shellBottom)' />
                    <g stroke='rgba(94, 62, 74, 0.26)' strokeWidth='1.5' fill='none' strokeLinecap='round'>
                        <path d='M80,45 L80,2' />
                        <path d='M80,45 C58,36 44,20 42,2' />
                        <path d='M80,45 C102,36 116,20 118,2' />
                    </g>
                    <defs>
                        <linearGradient id='shellBottom' x1='0' y1='0' x2='0' y2='1'>
                            <stop offset='0%' stopColor='#b78e95' />
                            <stop offset='100%' stopColor='#e4cbc9' />
                        </linearGradient>
                    </defs>
                </svg>
            </button>

            <svg className='sf-sand' viewBox='0 0 1440 150' preserveAspectRatio='none' aria-hidden='true'>
                <path
                    d='M0,66 C130,32 250,88 420,68 C580,49 700,98 880,74 C1040,52 1210,94 1440,60 L1440,150 L0,150 Z'
                    fill='url(#sandGrad)'
                />
                <g stroke='rgba(44, 54, 60, 0.3)' strokeWidth='2' fill='none' strokeLinecap='round'>
                    <path d='M90,108 C190,96 280,116 380,104' />
                    <path d='M520,124 C640,112 730,132 860,118' />
                    <path d='M960,102 C1080,92 1180,110 1310,98' />
                    <path d='M180,136 C300,128 400,142 520,134' />
                </g>
                <path
                    d='M0,66 C130,32 250,88 420,68 C580,49 700,98 880,74 C1040,52 1210,94 1440,60'
                    fill='none'
                    stroke='rgba(196, 226, 240, 0.22)'
                    strokeWidth='2.5'
                />
                <defs>
                    <linearGradient id='sandGrad' x1='0' y1='0' x2='0' y2='1'>
                        <stop offset='0%' stopColor='#9d9078' />
                        <stop offset='55%' stopColor='#6d6351' />
                        <stop offset='100%' stopColor='#48423a' />
                    </linearGradient>
                </defs>
            </svg>
        </section>
    );
};
