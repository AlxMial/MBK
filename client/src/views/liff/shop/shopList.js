import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import Spinner from "components/Loadings/spinner/Spinner";
import { useToasts } from "react-toast-notifications";
import { path } from "services/liff.services";
import SlideShow from "./SlideShow";
import * as fn from "services/default.service";
// components

const Cancel = () => {
  const history = useHistory();
  const { addToast } = useToasts();
  const [isLoading, setIsLoading] = useState(false);
  const [cartNumberBadge, setcartNumberBadge] = useState(fn.getCartNumberBadge());
  const [tbshop, settbshop] = useState([
    {
      id: 1,
      img: require("assets/img/mbk/no-image.png").default,
      detail:
        "test 1",
      endtime: "2022-05-24 13:00",
      time: "",
      price: 100,
      discount: null,
      status: null
    },
    {
      id: 2,
      img: require("assets/img/mbk/no-image.png").default,
      detail: "test 2",
      endtime: "2022-05-24 14:00",
      time: "",
      price: 200,
      discount: 100,
      status: "new"
    },
    {
      id: 3,
      img: require("assets/img/mbk/no-image.png").default,
      detail: "test 3",
      endtime: "2022-05-24 14:00",
      time: "",
      price: 300,
      discount: null,
      status: "hot"
    },
    {
      id: 4,
      img: require("assets/img/mbk/no-image.png").default,
      detail: "test 4",
      endtime: "2022-05-24 14:00",
      time: "",
      price: 400,
      discount: 100,
      status: null
    },
    {
      id: 5,
      img: require("assets/img/mbk/no-image.png").default,
      detail: "test 5",
      endtime: "2022-05-24 14:00",
      time: "",
      price: 500,
      discount: 100,
      status: null
    },
  ]);
  const img = [
    {
      url: "https://www.w3schools.com/howto/img_nature_wide.jpg",
    },
    {
      url: "https://www.w3schools.com/howto/img_snow_wide.jpg",
    },
    {
      url: "https://www.w3schools.com/howto/img_mountains_wide.jpg",
    },
  ];
  const [flashsale, setflashsale] = useState([
    {
      id: 6,
      img: require("assets/img/mbk/no-image.png").default,
      detail:
        "flashsale 1flashsale 1flashsale 1flashsale 1flashsale 1flashsale 1",
      endtime: "2022-05-24 13:00",
      time: "",
      price: 100,
      discount: null,
      status: null
    },
    {
      id: 7,
      img: require("assets/img/mbk/no-image.png").default,
      detail: "flashsale 2",
      endtime: "2022-05-24 14:00",
      time: "",
      price: 200,
      discount: 100,
      status: "new"
    },
    {
      id: 8,
      img: require("assets/img/mbk/no-image.png").default,
      detail: "flashsale 2",
      endtime: "2022-05-24 14:00",
      time: "",
      price: 200,
      discount: 100,
      status: "new"
    },
    {
      id: 9,
      img: require("assets/img/mbk/no-image.png").default,
      detail: "flashsale 2",
      endtime: "2022-05-24 14:00",
      time: "",
      price: 200,
      discount: 100,
      status: "new"
    },
  ]);

  const pad = (n) => {
    return (n < 10 ? "0" : "") + n;
  };

  const Counter = ({ time }) => {
    const [count, setCount] = useState("");

    useInterval(() => {
      const current_date = new Date().getTime();
      let seconds_left = (new Date(time).getTime() - current_date) / 1000;

      let hours = pad(parseInt(seconds_left / 3600));
      seconds_left = seconds_left % 3600;

      let minutes = pad(parseInt(seconds_left / 60));
      let seconds = pad(parseInt(seconds_left % 60));

      setCount(hours + ":" + minutes + ":" + seconds);
    }, 1000);

    return <span>{count}</span>;
  };
  const useInterval = (callback, delay) => {
    const savedCallback = useRef();

    // Remember the latest function.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  };

  return (
    <>
      {isLoading ? <Spinner customText={"Loading"} /> : null}
      <div >
        <SlideShow img={img} />
        <div className="flex relative flex" style={{ height: "35px", alignItems: "center" }}>
          <div className="px-2">สินค้าทั้งหมด</div>
          <div className="px-2">สิ้นค้าขายดี</div>
          <div className="px-2">สินค้าตามหมวดหมู</div>
          <div className="px-2 absolute flex" style={{ right: "0" }}>
            <i className="fas fa-cart-plus relative icon-cart"></i>
            {!fn.IsNullOrEmpty(cartNumberBadge) ?
              <div className="cart-number-badge" style={{
              }}>{cartNumberBadge} </div>
              : null}
          </div>
        </div>
        <div className="liff-inline" />
        <div style={{ width: "90%", margin: "auto" }}>
          {/* flash_sale */}
          <div className="mt-2">
            <div
              className="shadow"
              style={{
                border: "1px solid #FFF",
                height: "180px",
                borderRadius: "10px",
                display: "inline-table",
                width: "100%",
              }}
            >
              <div className="mt-2 px-2 py-2">
                <div>
                  <img
                    src={require("assets/img/mbk/flash_sale.png").default}
                    alt="..."
                    className="w-32 border-2 border-blueGray-50"
                  ></img>
                </div>
                <div className="flex mt-2" style={{
                  overflowX: "auto",
                  width: "100%",
                  maxWidth: "340px"
                }}>
                  {[...flashsale].map((e, i) => {
                    return (
                      <div
                        key={i}
                        className="relative"
                        style={{ minWidth: "170px", paddingBottom: "25px" }}
                        onClick={() => {
                          history.push(path.showProducts.replace(":id", e.id))
                        }}
                      >
                        <div className="relative" style={{}}>
                          <div
                            className="absolute text-white font-bold"
                            style={{
                              backgroundColor: "rgb(213 183 65 / 59%)",
                              width: "80%",
                              bottom: "0",
                              left: "10%",
                              height: "30px",
                              borderRadius: "10px 0 10px 0",
                              padding: "5px",
                              textAlign: "center",
                            }}
                          >
                            <Counter time={e.endtime} />
                          </div>
                          <img
                            style={{ margin: "auto" }}
                            src={e.img}
                            alt="flash_sale"
                            className="w-32 border-2 border-blueGray-50"
                          ></img>


                        </div>

                        <div className="px-2 py-2">{e.detail}</div>
                        <div
                          className="flex absolute"
                          style={{ bottom: "0", left: "10px" }}
                        >
                          <div
                            style={{
                              color:
                                e.discount !== null
                                  ? "rgba(0,0,0,.54)"
                                  : "#000",
                              textDecoration:
                                e.discount !== null ? "line-through" : "none",
                            }}
                          >
                            {"฿" + e.price}
                          </div>
                          {e.discount !== null ? (
                            <div style={{ color: "red", paddingLeft: "10px" }}>
                              {"฿" + e.discount}
                            </div>
                          ) : null}
                        </div>
                        <div
                          className="absolute"
                          style={{ bottom: "0", right: "10px" }}
                        >
                          <i className="fas fa-cart-plus"></i>
                        </div>

                        {!fn.IsNullOrEmpty(e.status) ? <div className="absolute" style={{ top: "0", right: "0" }}>{
                          <img
                            style={{ margin: "auto", width: "2rem" }}
                            src={e.status === "new" ? require("assets/img/mbk/icon_new.png").default : require("assets/img/mbk/icon_hot.png").default}
                            alt="flash_sale"
                            className="w-32 border-2 border-blueGray-50"
                          ></img>
                        }</div> : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-2">
            <div
              className="line-row "
              style={{
                maxHeight: "400px",
                overflow: "scroll",
              }}
            >
              {[
                ...tbshop.map((e, i) => {
                  return (
                    <div key={i} className="line-column mt-2"
                      onClick={() => {
                        history.push(path.showProducts.replace(":id", e.id))
                      }}
                    >
                      <div className="line-card relative">
                        <div className="relative" style={{}}>
                          <img
                            style={{ margin: "auto" }}
                            src={e.img}
                            alt="flash_sale"
                            className="w-32 border-2 border-blueGray-50"
                          ></img>
                        </div>
                        <div
                          className="px-2 py-2"
                          style={{
                            height: "40px",
                            lineHeight: "15px",
                            overflow: "auto",
                            marginBottom: "10px",
                          }}
                        >
                          {e.detail}
                        </div>
                        <div
                          className="flex absolute"
                          style={{ bottom: "0", left: "10px" }}
                        >
                          <div
                            style={{
                              color:
                                e.discount !== null
                                  ? "rgba(0,0,0,.54)"
                                  : "#000",
                              textDecoration:
                                e.discount !== null ? "line-through" : "none",
                            }}
                          >
                            {"฿" + e.price}
                          </div>
                          {e.discount !== null ? (
                            <div style={{ color: "red", paddingLeft: "10px" }}>
                              {"฿" + e.discount}
                            </div>
                          ) : null}
                        </div>
                        <div
                          className="absolute"
                          style={{ bottom: "0", right: "10px" }}
                        >
                          <i className="fas fa-cart-plus"></i>
                        </div>
                        {!fn.IsNullOrEmpty(e.status) ? <div className="absolute" style={{ top: "0", right: "0" }}>{
                          <img
                            style={{ margin: "auto", width: "2rem" }}
                            src={e.status === "new" ? require("assets/img/mbk/icon_new.png").default : require("assets/img/mbk/icon_hot.png").default}
                            alt="flash_sale"
                            className="w-32 border-2 border-blueGray-50"
                          ></img>
                        }</div> : null}
                      </div>
                    </div>
                  );
                }),
              ]}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Cancel;
