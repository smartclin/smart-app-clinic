'use client';

import { motion } from 'motion/react';

const DURATION = 0.25;
const STAGGER = 0.025;

type Props = {
    children: string;
    href: string;
};

const FlipLink = ({ children, href }: Props) => {
    return (
        <motion.a
            className='relative block overflow-hidden whitespace-nowrap font-light uppercase'
            href={href}
            initial='initial'
            style={{
                lineHeight: 0.75
            }}
            whileHover='hovered'
        >
            <div>
                {children.split('').map((l, i) => (
                    <motion.span
                        className='inline-block'
                        key={l.length}
                        transition={{
                            duration: DURATION,
                            ease: 'easeInOut',
                            delay: STAGGER * i
                        }}
                        variants={{
                            initial: {
                                y: 0
                            },
                            hovered: {
                                y: '-100%'
                            }
                        }}
                    >
                        {l}
                    </motion.span>
                ))}
            </div>
            <div className='absolute inset-0'>
                {children.split('').map((l, i) => (
                    <motion.span
                        className='inline-block'
                        key={l.length}
                        transition={{
                            duration: DURATION,
                            ease: 'easeInOut',
                            delay: STAGGER * i
                        }}
                        variants={{
                            initial: {
                                y: '100%'
                            },
                            hovered: {
                                y: 0
                            }
                        }}
                    >
                        {l}
                    </motion.span>
                ))}
            </div>
        </motion.a>
    );
};

export default FlipLink;
