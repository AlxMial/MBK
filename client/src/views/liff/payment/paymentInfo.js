import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Spinner from "components/Loadings/spinner/Spinner";
import { useToasts } from "react-toast-notifications";
import FilesService from "services/files";
import { path } from "services/liff.services";
import * as fn from "@services/default.service";
import ImageUC from "components/Image/index";
import { triggerBase64Download } from 'common-base64-downloader-react';
import {
    getOrder,
    doSaveSlip
} from "@services/liff.services";
import liff from "@line/liff";
import config from "@services/helpers";
import { CopyToClipboard } from "react-copy-to-clipboard";

const PaymentInfo = () => {
    let { id } = useParams();
    const history = useHistory();
    const { addToast } = useToasts();
    const [isLoading, setIsLoading] = useState(false);
    const [OrderHD, setOrderHD] = useState(null);
    const [isAttachLater, setisAttachLater] = useState(false);
    const [SlipImage, setSlipImage] = useState(null)
    const GetOrder = () => {
        setIsLoading(true)
        getOrder({ orderId: id }, (res) => {
            if (res.status) {
                if (res.data.status) {
                    setOrderHD(res.data.OrderHD)
                }
            } else {

            }
        }, () => { }, () => {
            setIsLoading(false)
        })
    }

    //รูปสลิป 
    const onChangeslip = async (e) => {
        const image = document.getElementById("SlipImage");
        image.src = URL.createObjectURL(e.target.files[0]);
        const base64 = await FilesService.convertToBase64(e.target.files[0]);
        setSlipImage(base64);
        addToast("อัพโหลดสลิปเรียบร้อยแล้ว", {
            appearance: "success",
            autoDismiss: true,
        });
    }
    const saveSlip = () => {
        if (SlipImage != null) {
            doSaveSlip({ data: { id: id, Image: SlipImage } }, (res) => {
                if (res.status === 200) {
                    if (res.data.status) {
                        addToast("บันทึกสลิปเรียบร้อยแล้ว", {
                            appearance: "success",
                            autoDismiss: true,
                        });
                        history.push(path.myorder.replace(":id", "1"))
                    } else {
                        addToast("เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้ง", {
                            appearance: "warning",
                            autoDismiss: true,
                        });
                    }
                } else {
                    addToast("เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้ง", {
                        appearance: "warning",
                        autoDismiss: true,
                    });
                }
            })
        } else {
            addToast("กรุณาอัพโหลดสลิปโอนเงิน", {
                appearance: "warning",
                autoDismiss: true,
            });
        }
    }
    useEffect(() => {
        GetOrder()
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
                                <div className="text-green-mbk " style={{ width: "50%", textAlign: "end" }}>{"฿ " + fn.formatMoney((OrderHD == null ? 0 : OrderHD.price))}</div>
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
                            {OrderHD != null ?
                                <div className="w-full  relative">

                                    <div className="flex w-full font-bold" style={{ fontSize: "14px" }}>
                                        <div style={{ width: "15px" }}>
                                            <ImageUC
                                                style={{ height: "15px", width: "15px" }}
                                                find={1}
                                                relatedid={OrderHD.Payment.id}
                                                relatedtable={["payment"]}
                                                alt=""
                                                className=" animated-img "
                                            ></ImageUC>
                                        </div>
                                        <div className="px-2" style={{ width: "calc(100% - 15px )" }}>{OrderHD.Payment.bankName}</div>

                                    </div>
                                    <div className="w-full " style={{ fontSize: "14px", color: "var(--mq-txt-color, rgb(170, 170, 170))" }}>{"สาขา : " + OrderHD.Payment.bankBranchName}</div>
                                    <div className="w-full flex" style={{ fontSize: "20px" }}>
                                        <div className="flex " style={{ fontSize: "14px", width: "70%", color: "var(--mq-txt-color, rgb(170, 170, 170))" }}>
                                            เลขบัญชี : <div className="text-green-mbk px-2 font-bold " >{OrderHD.Payment.accountNumber}</div>
                                        </div>
                                        <CopyToClipboard text={OrderHD.Payment.accountNumber}
                                            onCopy={() => {
                                                addToast("คัดลอกเรียบร้อยแล้ว", {
                                                    appearance: "success",
                                                    autoDismiss: true,
                                                });
                                            }}>
                                            <div style={{ width: "30%", textAlign: "end", color: "var(--mq-txt-color, rgb(170, 170, 170))", fontSize: "13px" }}>
                                                คัดลอก
                                            </div>
                                        </CopyToClipboard>
                                    </div>

                                </div>
                                : null}
                        </div>
                    </div>

                    <div className="liff-inline" />

                    <div className="line-scroll" style={{
                        height: "calc(100% - 320px)",
                    }}>
                        <div
                            className="w-full  relative mt-2"
                            style={{
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <div className="w-full " style={{ width: "90%", margin: "auto" }}>
                                {OrderHD != null ?
                                    <div style={{ width: "80%", margin: "auto" }}>
                                        <div className="mb-2">
                                            <div className="mb-2">
                                                <div style={{ width: "150px", height: "150px", margin: "auto" }}>
                                                    {OrderHD != null ?
                                                        <ImageUC
                                                            style={{ height: "150px", width: "150px" }}
                                                            find={1}
                                                            relatedid={OrderHD.Payment.id}
                                                            relatedtable={["paymentQrCode"]}
                                                            alt=""
                                                            className=" animated-img "
                                                        ></ImageUC> : null}
                                                </div>
                                            </div>
                                            <div className="flex">
                                                <div className="px-2" style={{ width: "50%" }}>
                                                    <div className="flex outline-gold-mbk  text-gold-mbk text-center text-lg  font-bold bt-line "

                                                        onClick={() => {
                                                            liff.init(
                                                                { liffId: config.liffId },
                                                                () => {
                                                                    if (liff.isLoggedIn()) {
                                                                        liff.shareTargetPicker(
                                                                            [
                                                                                {
                                                                                    type: "text",
                                                                                    text: "Hello, World!",
                                                                                },
                                                                                {
                                                                                    "type": "image",
                                                                                    "originalContentUrl": "https://undefined.ddns.net/mahboonkrongserver/image/getImgQrCode/" + OrderHD.Payment.id,
                                                                                    "previewImageUrl": "https://undefined.ddns.net/mahboonkrongserver/image/getImgQrCode/" + OrderHD.Payment.id
                                                                                }
                                                                            ],
                                                                            {
                                                                                isMultiple: true,
                                                                            }
                                                                        )
                                                                            .then(function (res) {
                                                                                if (res) {
                                                                                    // succeeded in sending a message through TargetPicker
                                                                                    console.log(`[${res.status}] Message sent!`)
                                                                                } else {
                                                                                    const [majorVer, minorVer] = (liff.getLineVersion() || "").split('.');
                                                                                    if (parseInt(majorVer) == 10 && parseInt(minorVer) < 11) {
                                                                                        // LINE 10.3.0 - 10.10.0
                                                                                        // Old LINE will access here regardless of user's action
                                                                                        console.log('TargetPicker was opened at least. Whether succeeded to send message is unclear')
                                                                                    } else {
                                                                                        // LINE 10.11.0 -
                                                                                        // sending message canceled
                                                                                        console.log('TargetPicker was closed!')
                                                                                    }
                                                                                }
                                                                            }).catch(function (error) {
                                                                                // something went wrong before sending a message
                                                                                console.log('something wrong happen')
                                                                            })
                                                                    } else {

                                                                        liff.login();
                                                                    }
                                                                },
                                                                (err) => console.error(err)
                                                            );


                                                        }
                                                        }
                                                    >
                                                        {"แชร์ QR"}
                                                    </div>
                                                </div>
                                                <div className="px-2" style={{ width: "50%" }}>
                                                    <div className="flex outline-gold-mbk  text-gold-mbk text-center text-lg  font-bold bt-line "

                                                        onClick={() => {
                                                            const image = document.getElementById(OrderHD.Payment.id + "paymentQrCode");

                                                            triggerBase64Download(image.src, 'paymentQrCode')
                                                        }}
                                                    >
                                                        {"บันทึก QR"}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div> : null}

                                <div className="w-full mb-2">
                                    <div
                                        className="flex bg-gold-mbk  text-white text-center text-lg  font-bold bt-line  "
                                    >

                                        <label id="getFileLabel" className="w-full" htmlFor="transfer-slip" style={{

                                            justifyContent: "center",
                                            alignItems: "center",
                                            display: "flex",

                                        }}>แนบสลิปโอนเงิน</label>
                                        <input id="transfer-slip" type="file" onChange={onChangeslip} accept="image/*" style={{ display: "none" }} />
                                    </div>


                                </div>
                                <div className="w-full">
                                    <div
                                        className="flex outline-gold-mbk  text-gold-mbk text-center text-lg  font-bold bt-line "
                                        onClick={() => {
                                            setisAttachLater(true)
                                        }}
                                    >
                                        {"แนบทีหลัง"}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            className="w-full  relative mt-2"
                            style={{
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <img src={SlipImage} id={"SlipImage"}
                                style={{
                                    width: "90%",
                                    margin: "auto"
                                }} />
                        </div>
                    </div>

                    <div className="overflow-scroll line-scroll" style={{ height: "calc(100% - 200px)" }}>

                        <div className="absolute w-full flex" style={{ bottom: "10px" }}>
                            <div className="w-full px-4">
                                <div
                                    className="flex bg-green-mbk text-white text-center text-lg  font-bold bt-line "
                                    onClick={saveSlip}
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
                            <div className="px-2" style={{ width: "50%" }}>
                                <div className="flex bg-green-mbk text-white text-center text-base  font-bold bt-line "
                                    onClick={() => {
                                        history.push(path.shopList)
                                    }}
                                >
                                    {"กลับไปที่ร้านค้า"}
                                </div>
                            </div>
                            <div className="px-2" style={{ width: "50%" }}>
                                <div className="flex bg-gold-mbk  text-white text-center text-base  font-bold bt-line  "
                                    onClick={() => {
                                        history.push(path.myorder.replace(":id", "1"))
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
