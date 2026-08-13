"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { CustomEase } from "gsap/CustomEase";
import { SplitText } from "gsap/SplitText";

import "./Preloader.css";
import Copy from "@/components/Copy/Copy";

gsap.registerPlugin(Flip, CustomEase, SplitText);

const Preloader = () => {
const preloader = useRef(null);

    useGSAP(() => {
    const waitForAssets = async () => {
        await document.fonts.ready;

        const images = Array.from(document.images);
        const videos = Array.from(document.querySelectorAll("video"));

        const imagePromises = images.map((img) => {
            if (img.complete) return Promise.resolve();

            return new Promise((resolve) => {
                img.addEventListener("load", resolve, { once: true });
                img.addEventListener("error", resolve, { once: true });
            });
        });

        const videoPromises = videos.map((video) => {
            if (video.readyState >= 3) return Promise.resolve();

            return new Promise((resolve) => {
                video.addEventListener("canplaythrough", resolve, { once: true });
                video.addEventListener("error", resolve, { once: true });
            });
        });

        await Promise.all([
            ...imagePromises,
            ...videoPromises,
        ]);

        await new Promise((resolve) => setTimeout(resolve, 200));
    };

        const animatePreloader = () => {
            const q = gsap.utils.selector(preloader);
            const image = q(".preloader__image")[0];
            const imageAnimations = q(".preloader__image-animation");
            const heroContent = new SplitText(q(".preloader__hero-content")[0], { type: "words", mask: "words" });

            gsap.set(heroContent.words, { yPercent: 100 });
            gsap.set(imageAnimations, { clipPath: "circle(0% at 50% 50%)", yPercent: 7.5 });
            gsap.set(q(".preloader__hero-content")[0], { opacity: 1 });

            const startAnimation = () => {
                CustomEase.create("custom", "M0,0 C.7,0 .3,1 1,1");

                const anim = {
                    duration: 1.2,
                    ease: "custom",
                };

                const state = Flip.getState(image);

                q(".preloader__hero")[0].prepend(image);

                const tl = gsap.timeline();

                tl.to(q(".preloader__image-inner")[0], { rotationX: 0, rotationY: 0, rotationZ: 0, ...anim }, 0);
                tl.to(q(".preloader__image-layer"), { rotationX: 50, rotationY: -15, rotationZ: 0, stagger: .02, scale: 1.6, ...anim }, .02);
                tl.to(q(".preloader__video")[0], { scale: 1, ...anim }, 0)
                tl.to(heroContent.words, { yPercent: 0, duration: .8, ease: "power2.out", stagger: 0.012 }, "-=.65");

                Flip.from(state, {
                    absolute: true,
                    ...anim,
                    onComplete: () => {
                        gsap.set(image, { clearProps: "transform" });
                        window.dispatchEvent(new Event("preloaderComplete"));
                    },
                });
            };

            gsap.to(imageAnimations, {
                clipPath: "circle(75% at 50% 50%)",
                duration: 1.05,
                yPercent: 0,
                ease: "power2.out",
                stagger: {
                    each: .1,
                    from: "end",
                },
                onComplete: () => {
                    gsap.delayedCall(.25, startAnimation);
                    gsap.to(q(".preloader__text .word"), { yPercent: -100, duration: 0.8, ease: "power3.inOut", stagger: 0.04 });
                }
            });
        };

        const init = async () => {
            await waitForAssets();
            animatePreloader();
        };

        init();
    }, { scope: preloader });

    return (
        <section className="preloader" ref={preloader}>
            <div className="preloader__content">
                <Copy
                    animateOnScroll={false}
                    type="words"
                    stagger={0.04}
                >
                    {/* <p className="preloader__text">What if</p>

                    <p className="preloader__text">
                        Philanthropy was the first investor in new social systems
                    </p> */}
                    <p className="preloader__text">Imagination is the most valuable natural resource on earth.</p>
                </Copy>
            </div>

            <div className="preloader__image-container">
                <div className="preloader__image">
                    <div className="preloader__image-inner preloader__image-animation">
                        <video
                            className="preloader__video"
                            src="/hero/video.mp4"
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="auto"
                        />
                    </div>
                </div>

                <div className="preloader__image-stack">
                    <div className="preloader__image-layer preloader__image-animation">
                        <img src="/preloader/1.jpg" alt="" className="preloader__image-layer-media" />
                    </div>

                    {/* <div className="preloader__image-layer preloader__image-animation">
                        <img src="/preloader/2.jpg" alt="" className="preloader__image-layer-media" />
                    </div> */}

                    <div className="preloader__image-layer preloader__image-animation">
                        <img src="/preloader/3.jpg" alt="" className="preloader__image-layer-media" />
                    </div>
                </div>
            </div>

            <div className="preloader__hero">
                <div className="container">
                    <div className="preloader__hero-content">
                        <p className="preloader__hero-description">
                            We convene extraordinary people, in transformative places,
                            with design-based processes to challenge how the world is,
                            so we can build what it can become.
                        </p>

                        <h1 className="preloader__hero-title">
                            A <span>Collective Capacity</span> <br /> To Articulate Better Futures
                        </h1>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Preloader;