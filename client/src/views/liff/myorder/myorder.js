import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Spinner from "components/Loadings/spinner/Spinner";
import { useToasts } from "react-toast-notifications";
import axios from "services/axios";
import { path } from "services/liff.services";
import * as Storage from "@services/Storage.service";
import * as fn from "@services/default.service";

import Tobepaid from "./tobepaid"
import Prepare from "./prepare"
import Toreceive from "./toreceive"
import Succeed from "./succeed"
import Cancel from "./cancel"
import Return from "./return"



const MyOrder = () => {
    let { id } = useParams();
    const history = useHistory();
    const { addToast } = useToasts();
    const [isLoading, setIsLoading] = useState(false);
    const [selectMenu, setselectMenu] = useState(id);
    useEffect(() => {

    }, []);


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
                <div className="w-full" style={{ width: "98%", margin: "auto" }}>
                    <div className="w-full flex font-bold relative" style={{ fontSize: "12px" }}>
                        <div className="px-1" style={{ width: "16.6%", textAlign: "center", textDecoration: selectMenu === "1" ? "underline" : "" }}
                            onClick={() => { history.push(path.myorder.replace(":id", "1")); setselectMenu("1") }}>ที่ต้องชำระ</div>
                        <div className="px-1" style={{ width: "17.6%", textAlign: "center", textDecoration: selectMenu === "2" ? "underline" : "" }}
                            onClick={() => { history.push(path.myorder.replace(":id", "2")); setselectMenu("2") }}>เตรียมสินค้า</div>
                        <div className="px-1" style={{ width: "16.6%", textAlign: "center", textDecoration: selectMenu === "3" ? "underline" : "" }}
                            onClick={() => { history.push(path.myorder.replace(":id", "3")); setselectMenu("3") }}>ที่ต้องได้รับ</div>
                        <div className="px-1" style={{ width: "16%", textAlign: "center", textDecoration: selectMenu === "4" ? "underline" : "" }}
                            onClick={() => { history.push(path.myorder.replace(":id", "4")); setselectMenu("4") }}>สำเร็จ</div>
                        <div className="px-1" style={{ width: "16.6%", textAlign: "center", textDecoration: selectMenu === "5" ? "underline" : "" }}
                            onClick={() => { history.push(path.myorder.replace(":id", "5")); setselectMenu("5") }}>ยกเลิก</div>
                        <div className="px-1" style={{ width: "16.6%", textAlign: "center", textDecoration: selectMenu === "6" ? "underline" : "" }}
                            onClick={() => { history.push(path.myorder.replace(":id", "6")); setselectMenu("6") }}>คืนสินค้า</div>
                    </div>

                </div>
            </div>


            <div
                className="w-full  relative mt-2 mb-2 "
                style={{
                    alignItems: "center",
                    justifyContent: "center",
                    height: "calc(100% - 235px)"
                }}
            >
                <div className="w-full" style={{ width: "98%", margin: "auto", height: "100%" }}>


                    {selectMenu === "1" ?
                        <Tobepaid /> : selectMenu === "2" ?
                            <Prepare /> : selectMenu === "3" ?
                                <Toreceive /> : selectMenu === "4" ?
                                    <Succeed /> : selectMenu === "5" ?
                                        <Cancel /> : selectMenu === "6" ? <Return /> :
                                            <div> 404 </div>}

                </div>
            </div>



            <div className="absolute w-full flex" style={{ bottom: "0" }}>
                <div className=" w-full" style={{ padding: "10px" }}>
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
                            history.push(path.shopList)
                        }}
                    >
                        {"กลับไปหน้าร้านค้า"}
                    </div>
                </div>

            </div>

        </>
    );
};

export default MyOrder;
