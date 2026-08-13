import Cloud from "./Cloud Animation/Cloud";
import "./Vision.css"; 
 
export default function Vision() { 
  return ( 
    <> 
        <section className="vision"> 
            <div className="vision__container container"> 
                <div className="vision__intro"> 
                    <div className="vision__content"> 
                        <h2 className="vision__title font-primary">The next century of innovation <br/>
will be the design of better systems.</h2> 
                        <p className="vision__description">If Imagination is our collective capacity to articulate better futures. Design is the method to rigorously bring them to fruition by building new models.</p> 
                    </div> 
                </div> 
                <div className="vision__systems"> 
                    <div className="vision__systems-content"> 
                        <div className="vision__categories"> 
                            <p className="vision__category">Adaptive Health</p> 
                            <p className="vision__category">Catalytic Philanthropy</p> 
                        </div> 
                        <div className="vision__active"> 
                            <h6 className="vision__active-title">Communities of Tomorrow</h6> 
                        </div> 
                        <div className="vision__list-wrapper"> 
                            <ul className="vision__list"> 
                                <li className="vision__list-item"> 
                                    Communities of Tomorrow 
                                </li> 
                                <li className="vision__list-item"> 
                                    Civic Life 
                                </li> 
                                <li className="vision__list-item"> 
                                    Experiential Learning 
                                </li> 
                                <li className="vision__list-item"> 
                                    Regenerative Homes 
                                </li> 
                                <li className="vision__list-item"> 
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