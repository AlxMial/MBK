import React from "react";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";


const SlideShow = (prop) => {
  const { img, duration, ...other } = prop;
  const properties = {
    duration: duration,
    transitionDuration: 500,
    infinite: true,
    indicators: true,
    arrows: true,
    pauseOnHover: true,
    onChange: (oldIndex, newIndex) => {
      console.log(`slide transition from ${oldIndex} to ${newIndex}`);
    },
  };
  return (
    <>
      <div className="slide-container" style={{ height: "100%" }}>
        <Slide {...properties} style={{ height: "100%" }}>
          {[...img].map((e, i) => {
            return (
              <div key={i} className="each-slide" style={{ margin: "auto" }}>
                {/* <object className="w-32" data={require("assets/img/mbk/no-image.png").default} type="image/png"> */}
                <img
                  src={e.url}
                  alt="..."
                  className="w-15 h-15  border-2 border-blueGray-50 shadow"
                ></img>
                {/* </object> */}
              </div>
            );
          })}
        </Slide>
      </div>
    </>
  );
};

export default SlideShow;
