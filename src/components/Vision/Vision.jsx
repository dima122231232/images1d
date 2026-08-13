import Cloud from "./Cloud Animation/Cloud";
import "./Vision.css"; 
import Copy from "@/components/Copy/Copy";

export default function Vision() { 

  return ( 
    <> 
        <section className="vision"> 
            <div className="vision__container container"> 
                <div className="vision__intro"> 
                    <div className="vision__content"> 
                        <Copy
                            type="words"
                            stagger={0.04}
                        >
                        <h2 className="vision__title font-primary">The next century of innovation <br/>
will be the design of better systems.</h2> 
                        </Copy>

                        <Copy
                            type="words"
                            start="top bottom"
                            stagger={0.04}
                        >
                        <p className="vision__description">If Imagination is our collective capacity to articulate better futures. Design is the method to rigorously bring them to fruition by building new models.</p> 
                        </Copy>
                    </div> 
                </div> 
                <div className="vision__systems"> 
                    <div className="vision__systems-content"> 
                        <div className="vision__categories"> 
                            <p className="vision__category font-additional">Adaptive Health</p> 
                            <p className="vision__category font-additional">Catalytic Philanthropy</p> 
                        </div> 
                        <div className="vision__active"> 
                            <h6 className="vision__active-title">Communities of Tomorrow</h6> 
                        </div> 
                        <div className="vision__list-wrapper"> 
                            <ul className="vision__list"> 
                                <li className="vision__list-item font-additional"> 
                                    Communities of Tomorrow 
                                </li> 
                                <li className="vision__list-item font-additional"> 
                                    Civic Life 
                                </li> 
                                <li className="vision__list-item font-additional"> 
                                    Experiential Learning 
                                </li> 
                                <li className="vision__list-item font-additional"> 
                                    Regenerative Homes 
                                </li> 
                                <li className="vision__list-item font-additional"> 
                                    Transformative Travel 
                                </li> 
                            </ul> 
                        </div> 
                    </div> 
                    <div className="vision__background"> 
                        <Cloud/>
                    </div> 
                </div> 
            </div> 
        </section> 
    </> 
  ); 
}