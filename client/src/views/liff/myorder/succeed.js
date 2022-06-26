import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Spinner from "components/Loadings/spinner/Spinner";
import { path } from "services/liff.services";
import * as fn from "@services/default.service";
import ImageUC from "components/Image/index";
import ProfilePictureUC from 'components/ProfilePictureUC';
import {
    getOrderHD,
    returnOrder
} from "@services/liff.services";
import Modal from "react-modal";
import ModalHeader from 'views/admin/ModalHeader';
import Select from "react-select";
import FilesService from "services/files";
const Toreceive = () => {
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(false);
    const [OrderHD, setOrderHD] = useState([]);

    const [isOpenmodel, setisOpenmodel] = useState(false);
    const [ReturnOrderID, setReturnOrderID] = useState("")
    const [remark, setremark] = useState("");
    const [ReturnImage, setReturnImage] = useState(null)

    // const OpenmodelCancel = [{ value: "ไม่ได้รับสินค้า (เช่น พัสดุสูญหายระหว่างทาง)", label: "ไม่ได้รับสินค้า (เช่น พัสดุสูญหายระหว่างทาง)" },
    // { value: "ได้รับสินค้าไม่ครบ (เช่น สินค้าบางส่วนขาดหายไป)", label: "ได้รับสินค้าไม่ครบ (เช่น สินค้าบางส่วนขาดหายไป)" },
    // { value: "ได้รับสินค้าที่ไม่ตรงตามที่สั่งซื้อ (เช่น ขนาดผิด, ไม่ใช่สินค้าที่สั่งซื้อ)", label: "ได้รับสินค้าที่ไม่ตรงตามที่สั่งซื้อ (เช่น ขนาดผิด, ไม่ใช่สินค้าที่สั่งซื้อ)" },
    // { value: "ได้รับสินค้ามีตำหนิ ได้รับสินค้าที่เสียหาย (เช่น  มีรอยแตก))", label: "ได้รับสินค้ามีตำหนิ ได้รับสินค้าที่เสียหาย (เช่น  มีรอยแตก))" }]
    // const [ReturnOrdervalue, setReturnOrdervalue] = useState("ไม่ได้รับสินค้า (เช่น พัสดุสูญหายระหว่างทาง)");

    const OpenmodelCancel = [{ value: "ไม่ได้รับสินค้า", label: "ไม่ได้รับสินค้า" },
    { value: "ได้รับสินค้าไม่ครบ", label: "ได้รับสินค้าไม่ครบ" },
    { value: "ได้รับสินค้าที่ไม่ตรงตามที่สั่งซื้อ", label: "ได้รับสินค้าที่ไม่ตรงตามที่สั่งซื้อ" },
    { value: "ได้รับสินค้ามีตำหนิ ได้รับสินค้าที่เสียหาย", label: "ได้รับสินค้ามีตำหนิ ได้รับสินค้าที่เสียหาย" }]
    const [ReturnOrdervalue, setReturnOrdervalue] = useState("ไม่ได้รับสินค้า");

    const ReturnOrder = () => {
        if (ReturnImage != null) {
            let data = { orderId: ReturnOrderID, returnDetail: ReturnOrdervalue, description: remark, returnImage: ReturnImage }
            // console.log(data)
            setIsLoading(true)
            returnOrder(data, (res) => {
                setisOpenmodel(false)
                GetOrderHD();
            }, () => {

            }, () => {
                setIsLoading(false)
            })
        } else {

        }
    }


    const GetOrderHD = () => {
        setIsLoading(true)
        getOrderHD({ PaymentStatus: "Done", isCancel: false, TransportStatus: "Done", isReturn: false }, (res) => {
            if (res.status) {
                setOrderHD(res.data.OrderHD)
            }
        }, () => { }, () => { setIsLoading(false) })
    }


    const handleChangeImage = async (e) => {
        const image = document.getElementById("ReturnImage");
        image.src = URL.createObjectURL(e.target.files[0]);
        const base64 = await FilesService.convertToBase64(e.target.files[0]);
        setReturnImage(base64);
        image.blur();
    };
    useEffect(() => {
        GetOrderHD()
    }, []);


    return (
        <> {isLoading ? <Spinner customText={"Loading"} /> : null}
            <div className="line-scroll" style={{ width: "95%", margin: "auto", height: "100%", overflow: "scroll" }}>
                {OrderHD.length > 0 ?
                    <div className="w-full" >
                        {[...OrderHD].map((e, i) => {
                            return (
                                <div key={i}>
                                    <div className="w-full" >
                                        <div className="w-full flex mb-2" style={{ fontSize: "12px" }}>
                                            <div className="flex" style={{ width: "calc(100% - 120px)" }}>
                                                <div className="font-bold">หมายเลขคำสั่งซื้อ : </div>
                                                <div >{e.orderNumber} </div>
                                            </div>
                                            {
                                                e.returnStatus != null ?
                                                    <div className="flex" style={{
                                                        width: "120px",
                                                        backgroundColor: "#ebebeb",
                                                        borderRadius: "10px",
                                                        textAlign: "center", color: "var(--mq-txt-color, rgb(20, 100, 246))", fontSize: "13px",
                                                        justifyContent: "center",
                                                        alignItems: "center"
                                                    }}>
                                                        {"การคืนถูกปฏิเสธ"}
                                                    </div>
                                                    : null
                                            }
                                        </div>
                                        {[...e.dt].length > 0 ?
                                            [...e.dt].map((dt, j) => {
                                                return <div key={j} className="w-full flex mb-2" style={{ fontSize: "12px" }}>
                                                    <div style={{ width: "80px", height: "80px" }}>
                                                        <ImageUC
                                                            style={{
                                                                width: "80px", height: "80px"
                                                            }}
                                                            find={1}
                                                            relatedid={dt.id}
                                                            relatedtable={["stock1"]}
                                                            alt="flash_sale"
                                                            className=" border-2 border-blueGray-50  animated-img"
                                                        ></ImageUC>
                                                    </div>
                                                    <div className=" px-2 relative " style={{ width: "calc(100% - 80px)" }}>
                                                        <div className="font-bold line-clamp-1">{dt.productName}</div>

                                                        <div className="flex" style={{ fontSize: "14px" }}>
                                                            <div className="flex absolute" style={{ right: "0" }}>
                                                                <div style={{
                                                                    textDecoration:
                                                                        dt.discount > 0 ? "line-through" : "none",
                                                                    color: dt.discount > 0 ? "#ddd" : "#047738"

                                                                }}>{"฿ " + fn.formatMoney(dt.price)}</div>
                                                                {dt.discount > 0 ?
                                                                    <div className="px-2" style={{ color: "red" }}>{"฿ " + fn.formatMoney(dt.discount)}</div> : null}
                                                            </div>
                                                            <div className="" style={{ color: "#ddd" }}>{"x" + dt.amount}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            })
                                            : null}

                                        <div className="w-full flex mb-2" style={{ fontSize: "12px", justifyContent: "end", color: "#ddd" }}>

                                            <div className="font-bold"
                                                onClick={() => {
                                                    history.push(path.orderpaymentdone.replace(":id", e.id))
                                                }}>
                                                {"ดูรายละเอียดคำสั่งซื้อ >"}
                                            </div>
                                        </div>

                                        <div className="w-full flex mb-2" style={{ fontSize: "12px", justifyContent: "end", color: "#ddd" }}>
                                            <div
                                                className="flex outline-gold-mbk text-gold-mbk text-center text-lg"
                                                style={{
                                                    margin: "auto",
                                                    height: "35px",
                                                    borderRadius: "5px",
                                                    padding: "5px",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    width: "80%",
                                                    fontSize: "12px"
                                                }}
                                                onClick={() => {
                                                    setisOpenmodel(true)
                                                    setReturnOrderID(e.id)

                                                }}
                                            >
                                                <i className="fas fa-reply"></i>
                                                <div className="px-2">{"คืนสินค้า"}</div>
                                            </div>
                                        </div>


                                    </div>
                                    <div className="liff-inline mb-2" />
                                    <div className="flex relative">
                                        <div className="font-bold">{"ยอดรวมสินค้า ( " + e.amount + " ชิ้น)"}</div>
                                        <div className="font-bold absolute " style={{ right: "0", color: "#047738" }}>{"฿ " + fn.formatMoney(e.price)}</div>
                                    </div>
                                    <div className="liff-inline mb-2" />
                                </div>
                            )
                        })}
                    </div>
                    :
                    <div className="flex mb-2" style={{
                        height: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "#ddd"

                    }}>
                        <div >
                            <i className="flex fas fa-box-open mb-2" style={{
                                alignItems: "center", justifyContent: "center",
                                fontSize: "28px"
                            }}></i>
                            <div> ยังไม่คำสั่งซื้อที่สำเร็จ </div>
                        </div>
                    </div>

                }
            </div>

            <Modal
                isOpen={isOpenmodel}
                className="Modal-line"
                style={{ borderRadius: "10px" }}
            >
                <div className="w-full flex flex-wrap">
                    <div className="w-full flex-auto mt-2">
                        <ModalHeader title="คืนสินค้า" handleModal={() => {
                            setisOpenmodel(false)
                        }} />
                        <div id="remark" className="px-2 mb-2 text-green-mbk font-bold flex">
                            อัพโหลดรูป <p style={{ color: "red" }}>*</p>
                        </div>
                        <div>
                            <ProfilePictureUC
                                className='pr-4'
                                id={"ReturnImage"}
                                hoverText='เลือกรูปสินค้า'
                                src={ReturnImage}
                                onChange={handleChangeImage}
                            />
                        </div>
                        <div className="mb-2">
                            <Select
                                className="text-gray-mbk mt-1 text-sm w-full border-none  select-remark "
                                isSearchable={false}
                                value={OpenmodelCancel.filter(o => o.value === ReturnOrdervalue)}

                                options={OpenmodelCancel}

                                onChange={(e) => {
                                    setReturnOrdervalue(e.value)
                                    setremark("")
                                }}
                            />
                        </div>
                        <div id="remark" className="px-2 mb-2 text-green-mbk font-bold">
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
                            borderRadius: "10px",
                            maxHeight: "200px",
                            overflow: "auto"
                        }}>
                            <div className="font-bold px-1"> ข้อกำหนดและเงื่อนไข การขอคืนเงิน/คืนสินค้า/แจ้งเคลม</div>
                            <div className="flex px-2">
                                <div className="px-1">1.</div>
                                <div> ผู้ซื้อสามารถคืนสินค้าได้ด้วยเหตุผลดังต่อไปนี้:</div>
                            </div>
                            <div className="px-3">
                                <div className="flex ">
                                    <div className="px-1">1.1</div>
                                    <div> ไม่ได้รับสินค้า (เช่น พัสดุสูญหายระหว่างทาง)</div>
                                </div>
                                <div className="flex ">
                                    <div className="px-1">1.2</div>
                                    <div> ได้รับสินค้าไม่ครบ (เช่น สินค้าบางส่วนขาดหายไป)</div>
                                </div>
                                <div className="flex">
                                    <div className="px-1">1.3</div>
                                    <div> ได้รับสินค้าที่ไม่ตรงตามที่สั่งซื้อ เช่น ขนาดผิด หรือ ไม่ใช่สินค้าที่สั่งซื้อ เป็นต้น</div>
                                </div>
                                <div className="flex">
                                    <div className="px-1">1.4</div>
                                    <div> ได้รับสินค้ามีตำหนิ ได้รับสินค้าที่เสียหาย (เช่น  มีรอยแตก)</div>
                                </div>
                            </div>
                            <div className="flex px-2">
                                <div className="px-1">2.</div>
                                <div> การส่งหลักฐาน แจ้งเคลม หรือ คืนสินค้า</div>
                            </div>
                            <div className="px-3">
                                <div className="flex ">
                                    <div className="px-1">2.1</div>
                                    <div>ผู้ซื้อต้องส่งหลักฐานภาพถ่ายหรือวิดีโอ หรือทั้งคู่ ที่ ชัดเจนโดยจะต้องสนับสนุนเหตุผลในขอคืนสินค้า/คืนเงินอย่างชัดเจน  ตัวอย่างเช่น : ภาพถ่ายหรือวิดีโอ หรือทั้งคู่ ที่แสดงถึงความผิดปกติของสินค้า(สำหรับสินค้าที่เสียหาย)</div>
                                </div>
                                <div className="flex ">
                                    <div className="px-1">2.2</div>
                                    <div>ภาพถ่ายหน้ากล่องพัสดุ และภาพถ่ายสินค้าภายในกล่องพัสดุ</div>
                                </div>
                                <div className="flex">
                                    <div className="px-1">2.3</div>
                                    <div>ต้องแจ้งภายใน 7 วัน นับตั้งแต่วันที่ขึ้นสถานะจัดส่งสำเร็จ</div>
                                </div>

                            </div>

                            <div className="flex px-2">
                                <div className="px-1">3.</div>
                                <div> ระยะเวลา และวิธีการรับเงินคืนระยะเวลาการคืนเงินจะขึ้นอยู่กับช่องทางการชำระเงินของลูกค้า โดยมีรายละเอียดดังต่อไปนี้ </div>
                            </div>
                            <div className="px-3">
                                <div className="flex ">
                                    <div className="px-1">3.1</div>
                                    <div> ชำระผ่านบัตรเครดิตหรือการผ่อนชำระ 7-15 วันทำการ </div>
                                </div>
                                <div className="flex ">
                                    <div className="px-1">2.2</div>
                                    <div> ชำระผ่านบัตรเดบิต 15-45 วันทำการ</div>
                                </div>
                            </div>

                            <div className="px-1"> หากชำระเงินผ่าน  ATM, โอนผ่านช่องทางธนาคาร เจ้าหน้าที่จะ
                                ดำเนินการคืนเงินภายใน 48 ชั่วโมง หากมีข้อสงสัยกรุณาติดต่อ
                                เจ้าหน้าที่
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
                                onClick={ReturnOrder}
                            >
                                {"ตกลง"}
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default Toreceive;
