import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  getMyProductById
} from "@services/liff.services";
import { path } from "services/liff.services";
import ImageUC from "components/Image/index";
import Spinner from "components/Loadings/spinner/Spinner";
import { useDispatch } from "react-redux";
import { backPage } from "redux/actions/common";
// components

const InfoProduct = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  let { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [Product, setProduct] = useState(null);
  const GetMyProductById = async () => {
    setIsLoading(true);
    getMyProductById(
      { Id: id },
      (res) => {
        if (res.data.status) {
          setProduct(res.data.Product);
        }
      },
      () => { },
      () => {
        setIsLoading(false);
      }
    );
  };
  useEffect(() => {
    dispatch(backPage(true));
    GetMyProductById();
  }, []);
  return (
    <>
      {isLoading ? <Spinner customText={"Loading"} /> : null}
      {/* card */}
      <div style={{ height: "calc(50% - 160px)" }} className="bg-green-mbk">
        {Product != null ?
          <div className="w-full absolute" style={{ height: "100%" }}>
            <div className="mb-4" style={{ height: "150px" }}>
              <div style={{ width: "220px", height: "150px", margin: "auto" }}>
                <ImageUC
                  find={1}
                  relatedid={Product.id}
                  relatedtable={["tbRedemptionProduct"]}
                  alt="tbRedemptionProduct"
                  className=" animated-img"
                ></ImageUC>
              </div>
            </div>
            <div className="px-8 py-2 line-scroll shadow-lg" style={{
              width: "90%", margin: "auto",
              borderRadius: "40px",
              backgroundColor: "#FFFFFF",
              // boxShadow: "0px -2px 10px 0px #aba6a6"
            }}>

              <div className="font-bold mt-4  mb-4 text-center line-clamp-2" style={{ fontSize: "18px" }}>{Product.productName}</div>
              <div className="mb-4" style={{ borderBottom: "1px solid #ddd" }}></div>
              <div className="font-bold text-center mb-4" style={{ fontSize: "15px" }}>รายละเอียด</div>
              <div className="mb-4" style={{ borderBottom: "1px solid #ddd" }}></div>
              <div className="" style={{ fontSize: "12px", minHeight: "150px", wordBreak: "break-word" }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{Product.description}</div>
              <div className="" style={{ fontSize: "12px", minHeight: "25px" }}>
                <div className="flex relative w-full" style={{ color: Product.status < 3 ? "#c7b15e" : "#007a40" }}>
                  {Product.status == 1 ?
                    <i className="flex fas fa-hourglass-end  px-2" style={{ alignItems: "center" }}></i>
                    : Product.status == 2 ?
                      < i className="flex fas fa-truck px-2" style={{ alignItems: "center" }}></i>
                      :
                      <i className="flex fas fa-check-circle px-2" style={{ alignItems: "center" }}></i>
                  }

                  <div>{Product.status == 1 ? "เตรียมจัดส่ง" : Product.status == 2 ? "อยู่ระหว่างจัดส่ง" : "ส่งแล้ว"}</div>
                  {Product.trackingNo != null ?
                    <div className="absolute" style={{ right: "0" }}>{Product.trackingNo}</div>
                    : null}

                </div>
              </div>
            </div>
          </div> : null}

        <div className="absolute w-full flex" style={{ bottom: "10px" }}>
          <div className=" w-full" style={{
            padding: "10px", margin: "auto",
            width: "50%"
          }}>
            <div
              className="flex bg-green-mbk text-white text-center text-lg  font-bold "
              style={{
                margin: "auto",
                height: "45px",
                borderRadius: "10px",
                padding: "5px",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => {
                history.push(path.product)
              }}
            >
              {"กลับ"}
            </div>
          </div>

        </div>
      </div>

    </>
  );
};
export default InfoProduct;
