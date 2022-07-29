import React from 'react'
import Slider from "react-slick";
import { useHistory } from "react-router-dom";
import { path } from "services/liff.services";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Slide = (prop) => {
    const { ImgBanner } = prop;
    const history = useHistory();
    const settings = {
        dots: true,
        centerMode: true,
        centerPadding: '60px',
        slidesToShow: 1,
        // autoplaySpeed: 2000,
        autoplay: true,
        responsive: [
            {
                breakpoint: 1000,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: '60px',
                    slidesToShow: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: '40px',
                    slidesToShow: 1
                }
            }
        ]
    };

    const renderSlides = () =>
        ImgBanner.map((e, i) => {
            return (
                <div className="px-2 h-full py-4 md:py-8 box-image" key={i}>
                    <img
                        src={e.url}
                        alt="..."
                        className='h-full object-fill blur-xs w-full'
                        style={{ height: _img_height, borderRadius: "15px" }}
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
            )
        });

    const _img_h = (window.innerWidth - (window.innerWidth >= 768 ? 180 : 96)) * 2 / 3;
    const _img_height = (`calc(${_img_h - 32}px)`);
    return (
        <Slider {...settings} >
            {renderSlides()}
        </Slider>
    )
}

export default Slide