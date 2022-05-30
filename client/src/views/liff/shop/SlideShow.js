import React from "react";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
const properties = {
  duration: 5000,
  transitionDuration: 500,
  infinite: true,
  indicators: true,
  arrows: true,
  pauseOnHover: true,
  onChange: (oldIndex, newIndex) => {
    console.log(`slide transition from ${oldIndex} to ${newIndex}`);
  },
};

const SlideShow = (prop) => {
  const { img, ...other } = prop;
  return (
    <>
      <div className="slide-container">
        <Slide {...properties}>
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
