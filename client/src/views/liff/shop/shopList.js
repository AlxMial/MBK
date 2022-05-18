import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import Spinner from "components/Loadings/spinner/Spinner";
import { useToasts } from "react-toast-notifications";
import { path } from "services/liff.services";
import SlideShow from "./SlideShow";
// components

const Cancel = () => {
  const history = useHistory();
  const { addToast } = useToasts();
  const [isLoading, setIsLoading] = useState(false);
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
      img: require("assets/img/mbk/no-image.png").default,
      detail:
        "flashsale 1flashsale 1flashsale 1flashsale 1flashsale 1flashsale 1",
      endtime: "2022-05-19 13:00",
      time: "",
    },
    {
      img: require("assets/img/mbk/no-image.png").default,
      detail: "flashsale 2",
      endtime: "2022-05-19 14:00",
      time: "",
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
      <div className="" style={{ width: "100%", height: "100px" }}>
        <SlideShow img={img} />
        <div className="flex relative">
          <div className="px-2">สินค้าทั้งหมด</div>
          <div className="px-2">สิ้นค้าขายดี</div>
          <div className="px-2">สินค้าตามหมวดหมู</div>
          <div className="px-2 absolute" style={{ right: "0" }}>
            <i className="fas fa-cart-plus"></i>
          </div>
        </div>
        <div
          className="mt-2"
          style={{ width: "100%", borderBottom: "1px solid #eee" }}
        ></div>
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
                <img
                  src={require("assets/img/mbk/flash_sale.png").default}
                  alt="..."
                  className="w-32 border-2 border-blueGray-50"
                ></img>
                <div className="flex mt-2">
                  {[...flashsale].map((e, i) => {
                    return (
                      <div
                        key={i}
                        className="relative"
                        style={{ width: "50%",  paddingBottom: "25px"}}
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
                          className="absolute"
                          style={{ bottom: "0", right: "0" }}
                        >
                          <i className="fas fa-cart-plus"></i>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-2">
            <div className="line-row ">
              <div className="line-column mt-2">
                <div className="line-card">
                  <h3>Card 1</h3>
                  <p>Some text</p>
                  <p>Some text</p>
                </div>
              </div>

              <div className="line-column mt-2">
                <div className="line-card">
                  <h3>Card 2</h3>
                  <p>Some text</p>
                  <p>Some text</p>
                </div>
              </div>

              <div className="line-column mt-2">
                <div className="line-card">
                  <h3>Card 3</h3>
                  <p>Some text</p>
                  <p>Some text</p>
                </div>
              </div>

              <div className="line-column mt-2">
                <div className="line-card">
                  <h3>Card 4</h3>
                  <p>Some text</p>
                  <p>Some text</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Cancel;
