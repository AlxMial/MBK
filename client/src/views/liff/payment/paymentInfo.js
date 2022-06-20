import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Spinner from "components/Loadings/spinner/Spinner";
import { useToasts } from "react-toast-notifications";
import axios from "services/axios";
import { path } from "services/liff.services";
import * as Storage from "@services/Storage.service";
import * as fn from "@services/default.service";
import ImageUC from "components/Image/index";

import { CopyToClipboard } from "react-copy-to-clipboard";

const PaymentInfo = () => {
    let { id } = useParams();
    const history = useHistory();
    const { addToast } = useToasts();
    const [isLoading, setIsLoading] = useState(false);

    const [isAttachLater, setisAttachLater] = useState(false);

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
                    {"ข้อมูลการชำระเงิน"}
                </div>
            </div>
            {!isAttachLater ?
                <>
                    <div
                        className="w-full  relative mt-2"
                        style={{
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <div className="w-full" style={{ width: "90%", margin: "auto" }}>
                            <div className="w-full flex font-bold relative" style={{ fontSize: "14px" }}>
                                <div style={{ width: "50%" }}>ยอดชำระเงินทั้งหมด</div>
                                <div className="text-green-mbk " style={{ width: "50%", textAlign: "end" }}>฿ 1,426.00</div>
                            </div>

                        </div>
                    </div>
                    <div className="liff-inline" />
                    <div
                        className="w-full  relative mt-2"
                        style={{
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <div className="w-full" style={{ width: "90%", margin: "auto" }}>

                            <div className="w-full  relative">

                                <div className="w-full font-bold" style={{ fontSize: "13px" }}>ธนาคารกสิกรไทย จำกัด (มหาชน)</div>
                                <div className="w-full " style={{ fontSize: "13px", color: "var(--mq-txt-color, rgb(170, 170, 170))" }}>สาขา : อำเภอเมือง</div>
                                <div className="w-full flex" style={{ fontSize: "20px" }}>
                                    <div className="flex " style={{ width: "70%", color: "var(--mq-txt-color, rgb(170, 170, 170))" }}>
                                        เลขบัญชี : <div className="text-green-mbk px-2 font-bold " >123-4-56789-0</div>
                                    </div>
                                    <CopyToClipboard text={"123-4-56789-0"}>
                                        <div style={{ width: "30%", textAlign: "end", color: "var(--mq-txt-color, rgb(170, 170, 170))", fontSize: "13px" }}>
                                            คัดลอก
                                        </div>
                                    </CopyToClipboard>
                                </div>

                            </div>

                        </div>
                    </div>

                    <div className="liff-inline" />

                    <div
                        className="w-full  relative mt-2"
                        style={{
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <div className="w-full " style={{ width: "90%", margin: "auto" }}>

                            <div style={{ width: "80%", border: "1px solid ", margin: "auto" }}>
                                <div className="mb-2">
                                    <div className="mb-2">
                                        <div style={{ width: "150px", height: "150px", border: "1px solid ", margin: "auto" }}>
                                            รูป
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <div style={{ width: "50%" }}>
                                            <div
                                                className="flex outline-gold-mbk  text-gold-mbk text-center text-lg  font-bold "
                                                style={{
                                                    margin: "auto",
                                                    borderRadius: "5px",
                                                    padding: "5px",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    fontSize: "14px", width: "90%"
                                                }}
                                                onClick={() => {
                                                    // history.goBack()
                                                }}
                                            >
                                                {"แชร์ QR"}
                                            </div>
                                        </div>
                                        <div style={{ width: "50%" }}>
                                            <div
                                                className="flex outline-gold-mbk  text-gold-mbk text-center text-lg  font-bold "
                                                style={{
                                                    margin: "auto",
                                                    borderRadius: "10px",
                                                    padding: "5px",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    fontSize: "14px", width: "90%"
                                                }}
                                                onClick={() => {
                                                    // history.goBack()
                                                }}
                                            >
                                                {"บันทึก QR"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full mb-2">
                                <div
                                    className="flex bg-gold-mbk  text-white text-center text-lg  font-bold "
                                    style={{
                                        margin: "auto",
                                        height: "45px",
                                        borderRadius: "10px",
                                        padding: "5px",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                    onClick={() => {
                                        // history.goBack()
                                    }}
                                >
                                    {"แนบสลิปโอนเงิน"}
                                </div>
                            </div>
                            <div className="w-full">
                                <div
                                    className="flex outline-gold-mbk  text-gold-mbk text-center text-lg  font-bold "
                                    style={{
                                        margin: "auto",
                                        height: "45px",
                                        borderRadius: "10px",
                                        padding: "5px",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                    onClick={() => {
                                        setisAttachLater(true)
                                    }}
                                >
                                    {"แนบทีหลัง"}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-scroll line-scroll" style={{ height: "calc(100% - 200px)" }}>

                        <div className="absolute w-full flex" style={{ bottom: "0" }}>
                            <div style={{ width: "100%", padding: "10px" }}>
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
                                        // history.goBack()
                                    }}
                                >
                                    {"ตกลง"}
                                </div>
                            </div>

                        </div>
                    </div>
                </>
                :
                // รอการชำระเงิน
                <div
                    className="w-full  relative mt-2"
                    style={{
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <div className="w-full mb-2" style={{ width: "90%", margin: "auto" }}>
                        <div className="w-full flex font-bold relative" style={{ fontSize: "14px", justifyContent: "center" }}>
                            <div className="flex">
                                <i className="fas fa-exclamation-circle flex" style={{ alignItems: "center" }}></i>
                                <div className="w-full px-2">รอการชำระเงิน</div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full " style={{ width: "90%", margin: "auto" }}>
                        <div className="w-full flex font-bold relative mb-2" style={{ fontSize: "14px", justifyContent: "center" }}>
                            <div className="flex">
                                <div className="w-full">{"    กรุณาชำระเงินจำนวน ฿ 1,426.00 ภายใน 48 ชั่วโมง เพื่อไม่ให้คำสั่งซื้อถูกยกเลิก คุณสามารถตรวจสอบข้อูลเพิ่มเติมได้ที่หน้า คำสั่งซื้อของฉัน "}</div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full" style={{ width: "90%", margin: "auto" }}>
                        <div className="flex">
                            <div style={{ width: "50%" }}>
                                <div
                                    className="flex bg-green-mbk text-white text-center text-lg  font-bold "
                                    style={{
                                        margin: "auto",
                                        borderRadius: "5px",
                                        padding: "5px",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "14px", width: "90%"
                                    }}
                                    onClick={() => {
                                        // history.goBack()
                                    }}
                                >
                                    {"กลับไปที่ร้านค้า"}
                                </div>
                            </div>
                            <div style={{ width: "50%" }}>
                                <div
                                    className="flex bg-gold-mbk  text-white text-center text-lg  font-bold "
                                    style={{
                                        margin: "auto",
                                        borderRadius: "5px",
                                        padding: "5px",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "14px", width: "90%"
                                    }}
                                    onClick={() => {
                                        // history.goBack()
                                    }}
                                >
                                    {"ไปหน้า คำสั่งซื้อของฉัน"}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="liff-inline" />
                </div>


            }

        </>
    );
};


export default PaymentInfo;
