import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  getRedemptionconditionshdById,
  useCoupon,
  useProduct,
  useGame
} from "@services/liff.services";
import Spinner from "components/Loadings/spinner/Spinner";
import ImageUC from "components/Image/index";
import Error from "../error"
import CouponSucceed from "./coupon.succeed"
import ProductSucceed from "./product.succeed"
import GameSucceed from "./game.succeed"
import GameUC from "./gameUC"
// components

const InfoReward = () => {
  let { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [modeldata, setmodeldata] = useState({ open: false, title: "", msg: "" });
  const [page, setpage] = useState("main");
  const [gameData, setgameData] = useState(null);
  const [Redemptionconditionshd, setRedemptionconditionshd] = useState(null);
  const GetRedemptionconditionshdById = async () => {
    setIsLoading(true);
    getRedemptionconditionshdById(
      { Id: id },
      (res) => {
        if (res.data.status) {
          setRedemptionconditionshd(res.data.Redemptionconditionshd);
        } else {
          setmodeldata({ open: true, title: "เกิดข้อผิดพลาด", msg: "กรุณาลองใหม่อีกครั้ง" })
        }
      },
      () => { setmodeldata({ open: true, title: "เกิดข้อผิดพลาด", msg: "กรุณาลองใหม่อีกครั้ง" }) },
      () => {
        setIsLoading(false);
      }
    );
  };

  const UseCoupon = () => {
    setIsLoading(true);
    useCoupon(
      { Id: id },
      (res) => {
        if (res.status == 200) {
          if (res.data.status) {
            setpage("CouponSucceed")
          }
          else {
            setmodeldata({ open: true, title: "", msg: res.data.message })
          }
        } else {
          setmodeldata({ open: true, title: "เกิดข้อผิดพลาด", msg: "กรุณาลองใหม่อีกครั้ง" })
        }
      },
      (e) => { setmodeldata({ open: true, title: "เกิดข้อผิดพลาด", msg: "กรุณาลองใหม่อีกครั้ง" }) },
      () => {
        setIsLoading(false);
      }
    );
  }
  const UseProduct = () => {
    setIsLoading(true);
    useProduct(
      { Id: id },
      (res) => {
        if (res.status == 200) {
          if (res.data.status) {
            setpage("ProductSucceed")
          }
          else {
            setmodeldata({ open: true, title: "", msg: res.data.message })
          }
        } else {
          setmodeldata({ open: true, title: "เกิดข้อผิดพลาด", msg: "กรุณาลองใหม่อีกครั้ง" })
        }
      },
      (e) => { setmodeldata({ open: true, title: "เกิดข้อผิดพลาด", msg: "กรุณาลองใหม่อีกครั้ง" }) },
      () => {
        setIsLoading(false);
      }
    );
  }
  const openGameUC = () => {
    setpage("gameUC")
  }
  const UseGame = () => {
    console.log("UseGame")

    useGame(
      { Id: id },
      (res) => {
        if (res.status == 200) {
          if (res.data.status) {
            setpage("GameSucceed")
            setgameData(res.data.itemrendom)
          }
          else {
            setmodeldata({ open: true, title: "", msg: res.data.message })
          }
        } else {
          setmodeldata({ open: true, title: "เกิดข้อผิดพลาด", msg: "กรุณาลองใหม่อีกครั้ง" })
        }
      },
      (e) => { setmodeldata({ open: true, title: "เกิดข้อผิดพลาด", msg: "กรุณาลองใหม่อีกครั้ง" }) },
      () => {
        setIsLoading(false);
      }
    );
  }

  useEffect(() => {
    GetRedemptionconditionshdById();
  }, []);
  return (
    <>
      <Error data={modeldata} setmodeldata={setmodeldata} />
      {isLoading ? <Spinner customText={"Loading"} /> : null}
      {/* card */}
      {page == "main" ?
        <div style={{ height: "250px", backgroundColor: "#007a40" }}>
          {Redemptionconditionshd != null ?
            <>
              <div className="w-full h-full absolute" >
                <div className="mb-4" style={{ height: "150px" }}>
                  <div style={{ width: "220px", height: "100px", margin: "auto" }}>
                    {Redemptionconditionshd.redemptionType == 1 ?
                      <ImageUC
                        find={1}
                        relatedid={Redemptionconditionshd.redemptionId}
                        relatedtable={[(Redemptionconditionshd.rewardType == 1 ? "tbRedemptionCoupon" : "tbRedemptionProduct")]}
                        alt="tbRedemptionCoupon"
                        className=" animated-img"
                      ></ImageUC> :
                      <img
                        id={"img-gane-" + Redemptionconditionshd.id}
                        className={"object-cover w-full h-ful"}
                        src={require("assets/img/mbk/gameInfo.jpg").default}
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null;
                          currentTarget.src = require("assets/img/mbk/no-image.png").default;
                        }}
                      ></img>
                    }
                  </div>

                </div>
                <div className="px-8 py-2" style={{
                  width: "90%", margin: "auto",
                  borderRadius: "40px",
                  backgroundColor: "#FFFFFF",
                  boxShadow: "0px -2px 10px 0px #aba6a6"
                }}>

                  <div className="font-bold mt-4  mb-4 text-center text-xl" >{Redemptionconditionshd.redemptionName}</div>
                  <div className="liff-inline" />
                  <div className="font-bold text-center mt-2 mb-4 text-sm">รายละเอียด</div>
                  <div className="liff-inline" />
                  <div className="text-sm p-4" style={{ minHeight: "150px" }}>{Redemptionconditionshd.description}</div>
                  <div className="text-sm text-liff-gray-mbk" style={{ textAlign: "center" }}>{"ใช้ " + Redemptionconditionshd.points + " คะแนน"}</div>
                </div>
              </div>

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

                      Redemptionconditionshd.redemptionType == 2 ?
                        openGameUC() :
                        Redemptionconditionshd.rewardType == 1 ?
                          UseCoupon() :
                          UseProduct()
                    }}
                  >
                    {Redemptionconditionshd.redemptionType == 2 ? "หมุนวงล้อ" : Redemptionconditionshd.rewardType == 1 ? "แลกคูปอง" : "แลกสินค้า"}
                  </div>
                </div>

              </div>
            </>
            : null}
        </div>
        : null}
      {
        page == "CouponSucceed" ?
          <CouponSucceed /> : null
      }
      {
        page == "ProductSucceed" ?
          <ProductSucceed /> : null
      }
      {
        page == "gameUC" ?
          <GameUC UseGame={UseGame} /> : null
      }
      {
        page == "GameSucceed" ?
          <GameSucceed data={gameData} /> : null
      }

    </>
  );
};
export default InfoReward;
