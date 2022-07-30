import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Spinner from "components/Loadings/spinner/Spinner";
import { useToasts } from "react-toast-notifications";
import { path } from "services/liff.services";
import { useDispatch } from "react-redux";
import { backPage } from "redux/actions/common";
import Tobepaid from "./tobepaid";
import Prepare from "./prepare";
import Toreceive from "./toreceive";
import Succeed from "./succeed";
import Cancel from "./cancel";
import Return from "./return";

const MyOrder = () => {
  const dispatch = useDispatch();
  let { id } = useParams();
  const history = useHistory();
  const { addToast } = useToasts();
  const [isLoading, setIsLoading] = useState(false);
  const [selectMenu, setselectMenu] = useState(null);
  // setselectMenu(id);

  useEffect(() => {
    // setselectMenu(id);
    dispatch(backPage(true));
  }, []);

  const MenuUC = ({ num, width, minWidth, text }) => {
    return (
      <div
        className="px-1"
        style={{
          width: width,
          minWidth: minWidth,
          textAlign: "center",
          color: id == num ? "#007a40" : "#000",
          textDecoration: id == num ? "underline" : "",
        }}
        onClick={() => {
          history.push(path.myorder.replace(":id", num));
          // setselectMenu(num);
        }}
      >
        {text}
      </div>
    );
  };
  return (
    <>
      {isLoading ? <Spinner customText={"Loading"} /> : null}
      <div className="bg-green-mbk">
        <div
          style={{ height: "40px" }}
          className=" noselect text-lg text-white font-bold text-center "
        >
          {"คำสั่งซื้อของฉัน"}
        </div>
      </div>

      <div
        className="w-full  relative mt-2 mb-2 "
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          className="w-full line-scroll"
          style={{ width: "98%", margin: "auto" }}
        >
          <div
            className="w-full flex font-bold relative"
            style={{ fontSize: "12px" }}
          >
            <MenuUC
              num={1}
              width={"16.6%"}
              minWidth={"70px"}
              text={"ที่ต้องชำระ"}
            />
            <MenuUC
              num={2}
              width={"18%"}
              minWidth={"75px"}
              text={"เตรียมสินค้า"}
            />
            <MenuUC
              num={3}
              width={"17%"}
              minWidth={"70px"}
              text={"ที่ต้องได้รับ"}
            />
            <MenuUC num={4} width={"16%"} minWidth={""} text={"สำเร็จ"} />
            <MenuUC num={5} width={"16.2%"} minWidth={""} text={"ยกเลิก"} />
            <MenuUC
              num={6}
              width={"16.2%"}
              minWidth={"57px"}
              text={"คืนสินค้า"}
            />
          </div>
        </div>
      </div>

      <div
        className="w-full  relative mt-2 mb-2 "
        style={{
          alignItems: "center",
          justifyContent: "center",
          height: "calc(100% - 280px)",
        }}
      >
        <div className="w-full h-full" style={{ width: "98%", margin: "auto" }}>
          {id == 1 ? (
            <Tobepaid />
          ) : id == 2 ? (
            <Prepare />
          ) : id == 3 ? (
            <Toreceive />
          ) : id == 4 ? (
            <Succeed />
          ) : id == 5 ? (
            <Cancel />
          ) : id == 6 ? (
            <Return />
          ) : (
            <div> 404 </div>
          )}
        </div>
      </div>
      {/* <div className="absolute w-full flex" style={{ bottom: "100px" }}>
        <div className=" w-full" style={{ padding: "10px" }}>
          <div
            className="flex bg-green-mbk text-white text-center text-lg  font-bold bt-line"
            onClick={() => {
              history.push(path.shopList);
            }}
          >
            {"กลับไปหน้าร้านค้า"}
          </div>
        </div>
      </div> */}
    </>
  );
};

export default MyOrder;
