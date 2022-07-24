import React from "react";
import { Slide } from "react-slideshow-image";
import { useHistory } from "react-router-dom";
import { path } from "services/liff.services";
import "react-slideshow-image/dist/styles.css";
import './../shop.scss'

const SlideShow = (prop) => {
  console.log('SlideShow', prop);
  const history = useHistory();
  const { img, duration, ...other } = prop;
  const properties = {
    // duration: duration,
    transitionDuration: 500,
    infinite: true,
    indicators: true,
    arrows: true,
    autoplay: false,
    pauseOnHover: true,
    onChange: (oldIndex, newIndex) => {
      // console.log(`slide transition from ${oldIndex} to ${newIndex}`);
    },
  };

  const _height = window.innerWidth + 'px';
  const _img_height = (`calc(${_height} - 140px)`);
  return (
    <>
      <div className="slide-container" style={{ height: "100%" }}>
        <Slide {...properties} style={{ height: "100%" }}>
          {[...img].map((e, i) => {
            return (
              <div key={i} className="each-slide" style={{ margin: "auto" }}>
                <img
                  style={{ width: '90%', height: _img_height, borderRadius: '10px' }}
                  src={e.url}
                  alt="..."
                  className="w-15 h-15 mx-auto"
                  onClick={() => {
                    if (e.typeLink != null) {
                      if (!e.typeLink) {
                        history.push(path.showProducts.replace(":id", e.stockId));

                      } else {
                        prop.setcategoryview(e.productCategoryId, prop.selectMenu)
                      }
                    }
                  }}
                >

                </img>
              </div>
            );
          })}
        </Slide>
      </div >
    </>
  );
};

export default SlideShow;
