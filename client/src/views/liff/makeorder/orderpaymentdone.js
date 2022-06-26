import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Spinner from "components/Loadings/spinner/Spinner";
import { useToasts } from "react-toast-notifications";
import * as fn from "@services/default.service";
import ImageUC from "components/Image/index";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Select from "react-select";
import moment from "moment";
import {
    getOrderHDById,
    cancelOrder
} from "@services/liff.services";
import Modal from "react-modal";
import ModalHeader from 'views/admin/ModalHeader';
// components

const OrderPaymentDone = () => {
    const { id } = useParams();
    const history = useHistory();
    const { addToast } = useToasts();
    const [isLoading, setIsLoading] = useState(false);
    const [OrderHD, setOrderHD] = useState(null);
    const [discount, setdiscount] = useState(null);
    const [remark, setremark] = useState("");
    const [isOpenmodelimg, setisOpenmodelimg] = useState(false);

    const [isOpenmodel, setisOpenmodel] = useState(false);
    const OpenmodelCancel = [{ value: "ต้องการเปลี่ยนแปลงที่อยู่ในการจัดส่งสินค้า", label: "ต้องการเปลี่ยนแปลงที่อยู่ในการจัดส่งสินค้า" },
    { value: "ผู้ขายไม่ตอบสนองในการสอบถามข้อมูล", label: "ผู้ขายไม่ตอบสนองในการสอบถามข้อมูล" },
    { value: "สั่งสินค้าผิด", label: "สั่งสินค้าผิด" },
    { value: "เปลี่ยนใจ", label: "เปลี่ยนใจ" },
    { value: "อื่นๆ", label: "อื่นๆ" }]
    const [Cancelvalue, setCancelvalue] = useState("ต้องการเปลี่ยนแปลงที่อยู่ในการจัดส่งสินค้า");
    const getProducts = async () => {
        if (!fn.IsNullOrEmpty(id)) {
            getOrderHDById({ Id: id }, (res) => {
                if (res.status) {
                    let OrderHD = res.data.OrderHD
                    setOrderHD(OrderHD)
                    if (!fn.IsNullOrEmpty(OrderHD.couponCodeId)) {
                        setdiscount(OrderHD.RedemptionCoupon.tbRedemptionCoupon.discount)
                    }
                }
            }, () => { }, () => { setIsLoading(false) })
        }
    };

    const Cancelorder = () => {
        console.log(id)
        setIsLoading(true)
        cancelOrder({ orderId: id, cancelDetail: Cancelvalue, description: remark }, (res) => {
            setisOpenmodel(false)
            getProducts();
        }, () => {

        }, () => {
            setIsLoading(false)
        })
    }
    useEffect(() => {
        getProducts();
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
            <div className="overflow-scroll line-scroll" style={{ height: "calc(100% - 200px)" }}>

                {OrderHD != null ?
                    <>

                        {/* ยกเลิก */}
                        {OrderHD.tbCancelOrder != null ?
                            <>
                                <div className="flex mt-2 " style={{
                                    width: "95%",
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                }}>
                                    <div className="flex" style={{ width: "calc(100% - 90px)", color: "red" }}>
                                        <i className="flex fas fa-backspace" style={{ alignItems: "center" }}></i>
                                        <div className="px-2">ยกเลิกคำสั่งซื้อ</div>
                                    </div>

                                    <div className="flex" style={{
                                        width: "90px",
                                        backgroundColor: "#ebebeb",
                                        borderRadius: "10px",
                                        textAlign: "center", color: "var(--mq-txt-color, rgb(20, 100, 246))", fontSize: "13px",
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}>
                                        {OrderHD.tbCancelOrder.cancelStatus === "Wait" ? "รอดำเนินการ" : OrderHD.tbCancelOrder.cancelStatus === "Refund" ? "คืนเงิน" : "ไม่คืนเงิน"}
                                    </div>
                                </div>

                                <div className=" mt-2 py-2 px-2" style={{
                                    width: "100%",
                                    backgroundColor: "#ffe9e2"
                                }}>
                                    <div className="flex mb-2" style={{ width: "100%", color: "var(--mq-txt-color, rgb(122, 122, 122))" }}>
                                        <i className="flex fas fa-times" style={{ alignItems: "center" }}></i>
                                        <div className="px-2">{"ประเภทการยกเลิก : " + (OrderHD.tbCancelOrder.cancelType === "User" ? "ยกเลิกโดยผู้ใช้" : OrderHD.tbCancelOrder.cancelType === "Admin" ? "ผู้ดูแลระบบ" : "ยกเลิกอัตโนมัติ")}</div>
                                    </div>
                                    <div className="flex" style={{ width: "100%", color: "var(--mq-txt-color, rgb(122, 122, 122))" }}>
                                        <i className="flex fas fa-clock" style={{ alignItems: "center" }}></i>
                                        <div className="px-2">{"วันที่ยกเลิก : " + moment(OrderHD.tbCancelOrder.createdAt).format("DD-MM-YYYY")}</div>
                                    </div>
                                    <div className="liff-inline" />
                                    <div className="flex mb-2" style={{ width: "100%", color: "var(--mq-txt-color, rgb(122, 122, 122))" }}>
                                        <i className="flex fas fa-clipboard" style={{ alignItems: "center" }}></i>
                                        <div className="px-2">{"สาเหตุ : " + OrderHD.tbCancelOrder.cancelDetail}</div>
                                    </div>
                                    <div className="flex" style={{ width: "100%", color: "var(--mq-txt-color, rgb(122, 122, 122))" }}>
                                        <i className="flex fas fa-question-circle" style={{ alignItems: "center" }}></i>
                                        <div className="px-2">{"รายละเอียด : " + OrderHD.tbCancelOrder.description}</div>
                                    </div>
                                </div>

                            </>
                            : null
                        }
                        {/* คืนสินค้า */}
                        {OrderHD.tbReturnOrder != null ?
                            <>
                                <div className="flex mt-2 " style={{
                                    width: "95%",
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                }}>
                                    <div className="flex" style={{ width: "calc(100% - 90px)", color: "red" }}>
                                        <i className="flex fas fa-long-arrow-alt-left" style={{ alignItems: "center" }}></i>
                                        <div className="px-2">คืนสินค้า</div>
                                    </div>

                                    <div className="flex" style={{
                                        width: "90px",
                                        backgroundColor: "#ebebeb",
                                        borderRadius: "10px",
                                        textAlign: "center", color: "var(--mq-txt-color, rgb(20, 100, 246))", fontSize: "13px",
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}>
                                        {OrderHD.tbReturnOrder.returnStatus === "Wait" ? "รอดำเนินการ" : OrderHD.tbReturnOrder.returnStatus === "Done" ? "คืนสำเร็จ" : "การคืนถูกปฏิเสธ"}
                                    </div>
                                </div>

                                <div className=" mt-2 py-2 px-2" style={{
                                    width: "100%",
                                    backgroundColor: "#ffe9e2"
                                }}>

                                    <div className="flex" style={{ width: "100%", color: "var(--mq-txt-color, rgb(122, 122, 122))" }}>
                                        <i className="flex fas fa-clock" style={{ alignItems: "center" }}></i>
                                        <div className="px-2">{"วันที่ยกเลิก : " + moment(OrderHD.tbReturnOrder.createdAt).format("DD-MM-YYYY")}</div>
                                    </div>
                                    <div className="flex mb-2" style={{ width: "100%", color: "var(--mq-txt-color, rgb(122, 122, 122))" }}>
                                        <i className="flex fas fa-paperclip" style={{ alignItems: "center" }}></i>
                                        <div className="px-2 flex">{"รูปภาพ  : "}<div className="px-2" style={{
                                            textDecoration: "underline", color: "blue"
                                        }} onClick={() => {
                                            setisOpenmodelimg(true)
                                        }}>ดูรูปภาพ</div>
                                        </div>
                                    </div>
                                    <div className="liff-inline" />
                                    <div className="flex mb-2" style={{ width: "100%", color: "var(--mq-txt-color, rgb(122, 122, 122))" }}>
                                        <i className="flex fas fa-clipboard" style={{ alignItems: "center" }}></i>
                                        <div className="px-2">{"สาเหตุ : " + OrderHD.tbReturnOrder.returnDetail}</div>
                                    </div>
                                    <div className="flex" style={{ width: "100%", color: "var(--mq-txt-color, rgb(122, 122, 122))" }}>
                                        <i className="flex fas fa-question-circle" style={{ alignItems: "center" }}></i>
                                        <div className="px-2">{"รายละเอียด : " + OrderHD.tbReturnOrder.description}</div>
                                    </div>
                                </div>

                            </>
                            : null
                        }


                        <div className="flex mt-2 " style={{
                            width: "95%",
                            marginLeft: "auto",
                            marginRight: "auto",
                        }}>
                            <div className="font-bold" style={{ width: "110px" }}>หมายเลขคำสั่งซื้อ : </div>
                            <div style={{ width: "calc(100% - 160px)" }}>{OrderHD.orderNumber}</div>
                            <CopyToClipboard text={OrderHD.orderNumber}>
                                <div style={{ width: "50px", textAlign: "end", color: "var(--mq-txt-color, rgb(170, 170, 170))", fontSize: "13px" }}>
                                    คัดลอก
                                </div>
                            </CopyToClipboard>
                        </div>

                        {(OrderHD.paymentStatus === "Done" && OrderHD.transportStatus === "Prepare" || OrderHD.transportStatus === "In Transit") ?
                            <div>
                                <div className="flex mt-2 " style={{
                                    width: "95%",
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                    color: "#ddd"
                                }}>
                                    <div className="" style={{ width: "100px" }}>เวลาสั่งซื้อ  </div>
                                    <div style={{ width: "calc(100% - 100px)", textAlign: "end", fontSize: "13px" }}>
                                        {moment(OrderHD.orderDate).add(543, "years").format("DD MMM yyyy")}
                                    </div>
                                </div>
                                <div className="flex mt-2 " style={{
                                    width: "95%",
                                    marginLeft: "auto",
                                    marginRight: "auto"
                                    , color: "#ddd"
                                }}>
                                    <div className="" style={{ width: "100px" }}>เวลาชำระเงิน  </div>
                                    <div style={{ width: "calc(100% - 100px)", textAlign: "end", fontSize: "13px" }}>
                                        {moment(OrderHD.paymentDate).add(543, "years").format("DD MMM yyyy")}
                                    </div>
                                </div>
                            </div>

                            : null}

                        <div
                            className="mt-2 line-scroll"
                            style={{
                                maxHeight: "calc(100% - 420px)",
                                width: "95%",
                                marginLeft: "auto",
                                marginRight: "auto",
                            }}
                        >
                            {[...OrderHD.dt].map((e, i) => {
                                return (
                                    <div key={i}>
                                        <div className="flex mt-2" style={{ height: "90px " }}>
                                            <div style={{ width: "30%" }}>
                                                <ImageUC
                                                    style={{ margin: "auto", height: "90px" }}
                                                    find={1}
                                                    relatedid={e.id}
                                                    relatedtable={["stock1"]}
                                                    alt="flash_sale"
                                                    className="w-32 border-2 border-blueGray-50  animated-img"
                                                ></ImageUC>
                                            </div>
                                            <div className="px-2" style={{ width: "70%" }}>
                                                <div className="flex" style={{ height: "60%" }}>
                                                    <div className="font-bold" style={{ width: "80%", fontSize: "11px" }}>{e.productName}</div>
                                                </div>
                                                <div style={{ height: "15%" }}>
                                                    <div className="font-bold" style={{ width: "80%", fontSize: "11px" }}>{"จำนวน : " + e.amount}</div>
                                                </div>
                                                <div style={{ height: "15%" }}>
                                                    <div className="flex relative font-bold" style={{ fontSize: "11px" }} >
                                                        <div
                                                            style={{
                                                                color: e.discount > 0 ? "rgba(0,0,0,.54)" : "",
                                                                textDecoration:
                                                                    e.discount > 0 ? "line-through" : "none",
                                                            }}
                                                        >
                                                            {"฿ " + fn.formatMoney(e.price)}
                                                        </div>
                                                        {e.discount > 0 ? (
                                                            <div style={{ color: "red", paddingLeft: "10px" }}>
                                                                {"฿ " + fn.formatMoney(e.discount)}
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                        <div className="liff-inline" />
                                    </div>
                                );
                            })}
                        </div>
                    </> : null
                }

                {OrderHD != null ?
                    <>
                        <div
                            className="w-full  relative mt-2"
                            style={{

                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >

                            <div style={{ width: "90%", margin: "auto" }}>
                                <div>
                                    <div className="flex relative mb-2">
                                        <div>ยอดรวมสิ้นค้า : </div>
                                        <div className="absolute" style={{ right: "0" }}>
                                            {"฿ " + fn.formatMoney(OrderHD.sumprice)}
                                        </div>
                                    </div>
                                    <div className="flex relative mb-2">
                                        <div>รวมการจัดส่ง : </div>
                                        <div className="absolute" style={{ right: "0" }}>
                                            {"฿ " + fn.formatMoney(OrderHD.deliveryCost)}

                                        </div>
                                    </div>
                                    <div className="flex relative mb-2">
                                        <div>ส่วนลด : </div>
                                        {discount != null ?
                                            <div className="absolute text-gold-mbk" style={{ right: "0" }}>
                                                {"-฿ " + fn.formatMoney(OrderHD.discount)}
                                            </div> : <div className="absolute" style={{ right: "0" }}>
                                                {"฿ " + fn.formatMoney(0)}
                                            </div>}
                                    </div>
                                    <div className="flex relative mb-2">
                                        <div>ยอดรวมสินค้า : </div>
                                        <div className="absolute text-green-mbk font-blod " style={{ right: "0", fontSize: "20px" }}>
                                            {"฿ " + fn.formatMoney(OrderHD.total)}

                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>

                        <div className="w-full  relative mt-2" style={{ alignItems: "center", justifyContent: "center", }} >
                            {OrderHD != null ?
                                OrderHD.transportStatus == "Prepare" || OrderHD.transportStatus == "In Transit" ?
                                    <><div style={{ width: "90%", margin: "auto" }}>
                                        <div>
                                            <div className="flex relative mb-2 text-gold-mbk ">
                                                <div>
                                                    {OrderHD.transportStatus == "Prepare" ?
                                                        <i class="fas fa-shopping-bag"></i>
                                                        :
                                                        <i className="fas fa-truck"></i>}
                                                </div>
                                                <div className=" px-2 ">{OrderHD.transportStatus == "Prepare" ? "เตรียมสินค้า" : OrderHD.transportStatus == "In Transit" ? "อยู่ระหว่างการจัดส่ง" : ""} </div>
                                            </div>

                                        </div>
                                    </div>
                                        <div className="liff-inline" />
                                    </>
                                    : null
                                :
                                null}
                        </div>
                        <div className="w-full  relative mt-2" style={{ alignItems: "center", justifyContent: "center", }} >
                            <div className="flex">
                                <div style={{ width: "50%", padding: "10px" }}>
                                    <div
                                        className="flex  text-center text-lg  font-bold "
                                        style={{
                                            margin: "auto",
                                            height: "45px",
                                            borderRadius: "10px",
                                            padding: "5px",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            backgroundColor: (OrderHD != null ? (OrderHD.transportStatus == "Prepare" ? (OrderHD.tbCancelOrder == null ? "red" : "") : "") : ""),
                                            border: ("1px solid " + (OrderHD != null ? (OrderHD.transportStatus == "Prepare" ? (OrderHD.tbCancelOrder == null ? "red" : "#ddd") : "#ddd") : "#ddd")),
                                            color: (OrderHD != null ? (OrderHD.transportStatus == "Prepare" ? (OrderHD.tbCancelOrder == null ? "#FFFFFF" : "#ddd") : "#ddd") : "#ddd"),
                                        }}
                                        onClick={() => {
                                            if (OrderHD.transportStatus == "Prepare" && OrderHD.tbCancelOrder == null) {

                                                setisOpenmodel(true)
                                            }
                                        }}
                                    >
                                        <i className="fas fa-backspace"></i>
                                        <div className="px-2">ยกเลิกคำสั่งซื้อ</div>
                                    </div>
                                </div>
                                <div style={{ width: "50%", padding: "10px" }}>
                                    <div
                                        className="flex  text-gold-mbk outline-gold-mbk text-center text-lg  font-bold "
                                        style={{
                                            margin: "auto",
                                            height: "45px",
                                            borderRadius: "10px",
                                            padding: "5px",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                        onClick={() => {
                                            history.goBack()
                                        }}
                                    >
                                        {"แนบสลิปโอนเงิน"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                    : null}




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
                                history.goBack()
                            }}
                        >
                            {"กลับไปที่ร้านค้า"}
                        </div>
                    </div>

                </div>
            </div>
            <div>
                <Modal
                    isOpen={isOpenmodel}
                    className="Modal-line"
                    style={{ borderRadius: "10px" }}
                >
                    <div className="w-full flex flex-wrap">
                        <div className="w-full flex-auto mt-2">
                            <ModalHeader title="ยกเลิกสินค้า" handleModal={() => {
                                setisOpenmodel(false)
                            }} />
                            <div className="mb-2">
                                <Select
                                    className="text-gray-mbk mt-1 text-sm w-full border-none  select-remark "
                                    isSearchable={false}
                                    value={OpenmodelCancel.filter(o => o.value === Cancelvalue)}

                                    options={OpenmodelCancel}

                                    onChange={(e) => {
                                        setCancelvalue(e.value)
                                        setremark("")
                                    }}
                                />
                            </div>
                            <div className="px-2 mb-2 text-green-mbk font-bold">
                                สาเหตุอื่นๆ โปรดระบุ
                            </div>
                            <div className="mb-2">
                                <textarea
                                    className="w-full border-green-mbk"
                                    style={{ borderRadius: "20px", padding: "15px", height: "150px" }}
                                    name="CancelOtherRemark "
                                    onBlur={(e) => {
                                        setremark(e.target.value)
                                    }}
                                />
                            </div>
                            <div className="mb-2 text-green-mbk" style={{
                                backgroundColor: "#f7f6f6",
                                padding: "10px",
                                borderRadius: "10px"
                            }}>
                                <div className="font-bold">ข้อกำหนดและเงื่อนไขในการยกเลิกคำสั่งซื้อ</div>
                                <div className="flex">
                                    <div>1.</div>
                                    <div>ผู้ซื้อสามารถยกเลิกคำสั่งซื้อได้ทันที ก่อนร้านค้านัดส่งสินค้า มิฉะนั้นจะต้องขออนุมัติการยกเลิกจากผู้ขาย</div>
                                </div>
                                <div className="flex">
                                    <div>2.</div>
                                    <div>เมื่อคำสั่งซื้อถูกยกเลิกสำเร็จ ค่าสินค้าจะถูกดำเนินการคืนให้คุณตามข้อกำหนดของช่องทางที่คุณชำระเงิน</div>
                                </div>
                                <div className="flex">
                                    <div>3.</div>
                                    <div>เมื่อสินค้าถูกนำส่งแล้ว คุณจะไม่สามารถยกเลิกคำสั่งซื้อได้</div>
                                </div>
                            </div>
                            <div >
                                <div
                                    className="flex outline-gold-mbk text-gold-mbk text-center text-lg  font-bold "
                                    style={{
                                        margin: "auto",
                                        height: "45px",
                                        borderRadius: "10px",
                                        padding: "5px",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                    onClick={Cancelorder}
                                >
                                    {"ตกลง"}
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>


            {OrderHD != null ?
                OrderHD.tbReturnOrder != null ?
                    <Modal
                        isOpen={isOpenmodelimg}
                        className="Modal-line"
                        style={{ borderRadius: "10px" }}
                    >
                        <div className="w-full flex flex-wrap">
                            <div className="w-full flex-auto mt-2">
                                <ModalHeader title="รูปภาพ" handleModal={() => {
                                    setisOpenmodelimg(false)
                                }} />

                                <div>
                                    <ImageUC
                                        style={{ margin: "auto", height: "90px" }}
                                        find={1}
                                        relatedid={OrderHD.tbReturnOrder.id}
                                        relatedtable={["tbReturnOrder"]}
                                        alt="flash_sale"
                                        className="w-32 border-2 border-blueGray-50"
                                    ></ImageUC>
                                </div>

                            </div>
                        </div>
                    </Modal> : null : null}
        </>
    );
};


export default OrderPaymentDone;
