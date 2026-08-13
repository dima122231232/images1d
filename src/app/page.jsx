"use client";

import Vision from "@/components/Vision/Vision";
import "./home.css";
import Preloader from "@/components/Preloader/Preloader";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


gsap.registerPlugin(ScrollTrigger);

export default function Home() {
    const page = useRef(null);

    useGSAP(() => {
        const q = gsap.utils.selector(page);

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger:q(".vision"),
                start:"top bottom",
                end:() => `+=${window.innerHeight}px`,
                scrub:true,
            }
        });

        tl.to(q(".vision"), {
            y:"-75vh",
            ease:"none",
        }, 0);

        tl.fromTo(q(".preloader"),
            {
                filter: "brightness(1)",
            },
            {
                filter: "brightness(-.35)",
                ease: "none",
            },
            0
        );

        tl.to(q(".preloader__hero-content"), {
            scale:.8,
            ease:"none",
        }, 0);



    }, { scope: page })
  return (
    <>
        <main ref={page}>
            <Preloader/>  
            <Vision/>
        </main>
    </>
  );
}