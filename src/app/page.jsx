import Vision from "@/components/Vision/Vision";
import "./home.css";
import Preloader from "@/components/Preloader/Preloader";

export default function Home() {
  return (
    <>
      <Preloader/>  
        {/* <section className="hero">
            <video
                className="hero__media"
                src="/hero/video.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
            />

            <div className="container">
                    <div className="hero__content">
                        <p className="hero__description">
                            We convene extraordinary people, in transformative places,
                            with design-based processes to challenge how the world is,
                            so we can build what it can become.
                        </p>

                        <h1 className="hero__title">
                            A <span>Collective Capacity</span> <br /> To Articulate Better Futures
                        </h1>
                    </div>
            </div>
        </section> */}
        {/* <Vision/> */}
    </>
  );
}