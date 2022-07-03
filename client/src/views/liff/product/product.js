import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  getMyProduct
} from "@services/liff.services";
import ImageUC from "components/Image/index";
import Spinner from "components/Loadings/spinner/Spinner";
import { path } from "services/liff.services";
import EmptyOrder from "../emptyOrder";
// components

const Product = () => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [MyProduct, setMyProduct] = useState([]);
  const GetMyProduct = async () => {
    setIsLoading(true);
    getMyProduct(
      (res) => {
        if (res.data.status) {
          setMyProduct(res.data.product);
        }
      },
      () => { },
      () => {
        setIsLoading(false);
      }
    );
  };
  useEffect(() => {
    GetMyProduct();
  }, []);
  return (
    <>
      {isLoading ? <Spinner customText={"Loading"} /> : null}
      {/* card */}
      {/* <div style={{ marginTop: "-90px", position: "absolute", width: "100%" }}>
        <div className="line-text-brown noselect">
          <div className=" text-xl text-center mt-4">ของสมนาคุณของฉัน</div>
        </div>
      </div> */}
      <div className="bg-green-mbk">
        <div
          style={{ height: "40px" }}
          className=" noselect text-lg text-white font-bold text-center "
        >
          ของสมนาคุณของฉัน
        </div>
      </div>
      <div>
        {/* <div className="flex w-full" style={{ marginTop: "55px", height: "50px", fontSize: "18px" }}>
          <div className="flex" style={{
            width: "100%", textAlign: "center", justifyContent: "center",
            alignItems: "center",
            borderBottom: "5px solid #007a40"
          }} >ของสมนา</div>

        </div> */}
        <div className="line-scroll" style={{
          width: "90%", margin: "auto", height: "calc(100vh - 140px)",
        }}>
          {MyProduct.length > 0 ?
            <div className="w-full mt-2">
              <div style={{ width: "90%", margin: "auto" }}> </div>
              {[...MyProduct].map((e, i) => {
                return (
                  <div key={i} >
                    {i > 0 && <div className="liff-inline mb-2" />}
                    <div className="flex mb-2" onClick={() => {
                      history.push(path.infoproduct.replace(":id", e.productId))
                    }}>

                      <div style={{ width: "30%" }}>
                        <div style={{ width: "100px", height: "120px" }}>
                          <ImageUC
                            find={1}
                            relatedid={e.id}
                            relatedtable={["tbRedemptionProduct"]}
                            alt="flash_sale"
                            className=" border-2 border-blueGray-50 animated-img"
                            divimage="flex items-center"
                          ></ImageUC>
                        </div>
                      </div>
                      <div className="px-2 py-2 relative " style={{ width: "70%" }}>
                        <div className="font-bold line-clamp-1 text-12"> {e.productName} </div>
                        <div className="text-xs pl-2">รายละเอียด </div>
                        <div className="line-clamp-2 text-xs  pl-2" style={{ wordBreak: "break-all" }}>{e.description} </div>
                        <div className="absolute w-full text-xs  pl-2" style={{ bottom: "0", color: "#ddd" }}>
                          <div className="flex relative w-full " style={{ color: e.status < 3 ? "#c7b15e" : "#007a40" }}>
                            {e.status == 1 ?
                              <i className="flex fas fa-hourglass-end  mr-2" style={{ alignItems: "center" }}></i>
                              : e.status == 2 ?
                                < i className="flex fas fa-truck mr-2" style={{ alignItems: "center" }}></i>
                                :
                                <i className="flex fas fa-check-circle mr-2" style={{ alignItems: "center" }}></i>
                            }

                            <div>{e.status == 1 ? "เตรียมจัดส่ง" : e.status == 2 ? "อยู่ระหว่างจัดส่ง" : "ส่งแล้ว"}</div>
                            {e.trackingNo != null ?
                              <div className="absolute" style={{ right: "0" }}>{e.trackingNo}</div>
                              : null}

                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}

            </div> :
            <EmptyOrder text={"ยังไม่มีของสมนาคุณ"} />

          }

        </div>
      </div>
    </>
  );
};
export default Product;
