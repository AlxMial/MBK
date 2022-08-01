import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Spinner from "components/Loadings/spinner/Spinner";
import { useToasts } from "react-toast-notifications";
import FilesService from "services/files";
import { path } from "services/liff.services";
import * as fn from "@services/default.service";
import ImageUC from "components/Image/index";
import { getOrder, doSaveSlip } from "@services/liff.services";
import liff from "@line/liff";
import config from "@services/helpers";
import { CopyToClipboard } from "react-copy-to-clipboard";
import WaitingPayment from "./waitingPayment";
import Error from "../error";
import { sendEmailWaiting } from "services/liff.services";
import { useDispatch } from "react-redux";
import { backPage } from "redux/actions/common";
import jsQR from "jsqr";
const PaymentInfo = () => {
  const dispatch = useDispatch();
  let { id } = useParams();
  const history = useHistory();
  const { addToast } = useToasts();
  const [isLoading, setIsLoading] = useState(false);
  const [OrderHD, setOrderHD] = useState(null);
  const [isAttachLater, setisAttachLater] = useState(false);
  const [SlipImage, setSlipImage] = useState(null);

  const [modeldata, setmodeldata] = useState({
    open: false,
    title: "",
    msg: "",
  });

  const [statuspayment, setstatuspayment] = useState(true);
  // const [status, setstatus] = useState(true);

  const GetOrder = () => {
    setIsLoading(true);
    getOrder(
      { orderId: id },
      (res) => {
        if (res.status) {
          if (res.data.status) {
            setOrderHD(res.data.OrderHD);
            setstatuspayment(res.data.status);
          } else {
            setOrderHD(res.data.OrderHD);
            setstatuspayment(res.data.status);
            setmodeldata({
              open: true,
              title: "สถานะคำสั่งซื้อ",
              msg: res.data.msg,
            });
          }
        } else {
          // setstatus(false);
          setstatuspayment(false);
        }
      },
      () => { },
      () => {
        setIsLoading(false);
      }
    );
  };

  //รูปสลิป
  const onChangeslip = async (e) => {
    const image = document.getElementById("SlipImage");

    let base64 = await FilesService.convertToBase64(e.target.files[0]);
    if (await verifyslip(base64)) {
      base64 = await reduce_image_file_size(base64);
      setSlipImage(base64);
      image.src = URL.createObjectURL(e.target.files[0]);
    } else {
      addToast("แนบได้เฉพาะสลิปโอนเงินเท่านั้น", {
        appearance: "warning",
        autoDismiss: true,
      });
    }
  };
  const reduce_image_file_size = async (
    base64Str,
    MAX_WIDTH = 450,
    MAX_HEIGHT = 450
  ) => {
    let resized_base64 = await new Promise((resolve) => {
      let img = new Image();
      img.src = base64Str;
      img.onload = () => {
        let canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL()); // this will return base64 image results after resize
      };
    });
    return resized_base64;
  };
  const verifyslip = async (base64Str) => {
    let isVerity = await new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const c2d = canvas.getContext("2d");
      let img = new Image();
      img.src = base64Str;
      img.onload = () => {
        try {
          const [width, height] = [img.naturalWidth, img.naturalHeight];
          canvas.width = width;
          canvas.height = height;
          c2d.drawImage(img, 0, 0);
          const imageData = c2d.getImageData(0, 0, width, height);
          const jsqrResult = jsQR(
            imageData.data,
            imageData.width,
            imageData.height
          );
          if (jsqrResult !== null) {
            resolve(true);
          } else {
            resolve(false);
          }
        } catch (error) {
          resolve(false);
        }
      };
    });
    return isVerity;
  };

  const saveSlip = () => {
    if (SlipImage != null) {
      setIsLoading(true);
      doSaveSlip(
        { data: { id: id, Image: SlipImage } },
        (res) => {
          if (res.status === 200) {
            if (res.data.status) {
              sendEmailWaiting(
                {
                  // frommail: "noreply@undefined.co.th",
                  // password: "Has88149*",
                  frommail: "no-reply@prg.co.th",
                  password: "Tus92278",
                  tomail: OrderHD.email,
                  orderNumber: OrderHD.orderNumber,
                  memberName: OrderHD.memberName,
                },
                (res) => {
                  console.log(res);
                }
              );
              addToast("บันทึกสลิปเรียบร้อยแล้ว", {
                appearance: "success",
                autoDismiss: true,
              });
              history.push(path.myorder.replace(":id", "1"));
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
        },
        () => { },
        () => {
          setIsLoading(true);
        }
      );
    } else {
      addToast("กรุณาอัพโหลดสลิปโอนเงิน", {
        appearance: "warning",
        autoDismiss: true,
      });
    }
  };
  useEffect(() => {
    dispatch(backPage(true));
    GetOrder();
  }, []);

  return (
    <>
      <Error data={modeldata} setmodeldata={setmodeldata} />
      {isLoading ? <Spinner customText={"Loading"} /> : null}
      <div className="bg-green-mbk">
        <div
          style={{ height: "40px" }}
          className=" noselect text-lg text-white font-bold text-center "
        >
          {"ข้อมูลการชำระเงิน"}
        </div>
      </div>
      {!isAttachLater ? (
        <>
          <div
            className="w-full  relative mt-2"
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div className="w-full" style={{ width: "90%", margin: "auto" }}>
              <div className="w-full flex font-bold relative text-sm">
                <div style={{ width: "50%" }}>ยอดชำระเงินทั้งหมด</div>
                <div
                  className="text-green-mbk "
                  style={{ width: "50%", textAlign: "end" }}
                >
                  {"฿ " + fn.formatMoney(OrderHD == null ? 0 : OrderHD.price)}
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
            <div className="w-full" style={{ width: "90%", margin: "auto" }}>
              {OrderHD != null ? (
                <div className="w-full  relative">
                  <div
                    className="flex w-full font-bold text-sm"
                    style={{ alignItems: "center" }}
                  >
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
                    <div
                      className="px-2"
                      style={{ width: "calc(100% - 15px )" }}
                    >
                      {OrderHD.Payment.bankName}
                    </div>
                  </div>
                  <div className="w-full text-liff-gray-mbk text-sm ">
                    {"สาขา : " + OrderHD.Payment.bankBranchName}
                  </div>
                  <div className="w-full flex" style={{ fontSize: "20px" }}>
                    <div
                      className="flex text-liff-gray-mbk text-sm"
                      style={{ width: "70%" }}
                    >
                      เลขบัญชี :{" "}
                      <div className="text-green-mbk px-2 font-bold ">
                        {OrderHD.Payment.accountNumber}
                      </div>
                    </div>
                    <CopyToClipboard
                      text={OrderHD.Payment.accountNumber}
                      onCopy={() => {
                        addToast("คัดลอกเรียบร้อยแล้ว", {
                          appearance: "success",
                          autoDismiss: true,
                        });
                      }}
                    >
                      <div
                        className="text-liff-gray-mbk text-sm"
                        style={{
                          width: "30%",
                          textAlign: "end",
                        }}
                      >
                        {"คัดลอก"}
                      </div>
                    </CopyToClipboard>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="liff-inline" />

          <div
            className="line-scroll"
            style={{
              height: "calc(100% - 320px)",
            }}
          >
            <div
              className="w-full  relative mt-2"
              style={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                className="w-full "
                style={{
                  width: "90%",
                  margin: "auto",
                  filter: statuspayment ? "" : "grayscale(1)",
                }}
              >
                {OrderHD != null ? (
                  <div style={{ width: "80%", margin: "auto" }}>
                    <div className="mb-2">
                      <div className="mb-2">
                        <div
                          style={{
                            width: "150px",
                            height: "150px",
                            margin: "auto",
                          }}
                        >
                          {OrderHD != null ? (
                            <ImageUC
                              style={{ height: "150px", width: "150px" }}
                              find={1}
                              relatedid={OrderHD.Payment.id}
                              relatedtable={["paymentQrCode"]}
                              alt=""
                              className=" animated-img "
                            ></ImageUC>
                          ) : null}
                        </div>
                      </div>
                      <div className="flex">
                        <div className="px-2" style={{ width: "50%" }}>
                          <div
                            className="flex border-gold-mbk  text-gold-mbk text-center text-lg  font-bold bt-line "
                            style={{ borderRadius: "10px" }}
                            onClick={() => {
                              liff.init(
                                { liffId: config.liffId },
                                () => {
                                  if (liff.isLoggedIn()) {
                                    liff
                                      .shareTargetPicker(
                                        [
                                          {
                                            type: "image",
                                            originalContentUrl:
                                              config._baseURL +
                                              "image/getImgQrCode/" +
                                              OrderHD.Payment.id,
                                            previewImageUrl:
                                              config._baseURL +
                                              "image/getImgQrCode/" +
                                              OrderHD.Payment.id,
                                          },
                                        ],
                                        {
                                          isMultiple: true,
                                        }
                                      )
                                      .then(function (res) {
                                        if (res) {
                                          addToast(
                                            "แชร์ QRCode เรียบร้อยแล้ว",
                                            {
                                              appearance: "success",
                                              autoDismiss: true,
                                            }
                                          );
                                        } else {
                                          const [majorVer, minorVer] = (
                                            liff.getLineVersion() || ""
                                          ).split(".");
                                          if (
                                            parseInt(majorVer) === 10 &&
                                            parseInt(minorVer) < 11
                                          ) {
                                            // LINE 10.3.0 - 10.10.0
                                            // Old LINE will access here regardless of user's action
                                            console.log(
                                              "TargetPicker was opened at least. Whether succeeded to send message is unclear"
                                            );
                                          } else {
                                            // LINE 10.11.0 -
                                            // sending message canceled
                                            console.log(
                                              "TargetPicker was closed!"
                                            );
                                          }
                                        }
                                      })
                                      .catch(function (error) {
                                        // something went wrong before sending a message
                                        console.log("something wrong happen");
                                        console.log(error);
                                      });
                                  } else {
                                    liff.login();
                                  }
                                },
                                (err) => console.error(err)
                              );
                            }}
                          >
                            {"แชร์ QR"}
                          </div>
                        </div>
                        <div className="px-2" style={{ width: "50%" }}>
                          <div
                            className="flex border-gold-mbk  text-gold-mbk text-center text-lg  font-bold bt-line "
                            style={{ borderRadius: "10px" }}
                            onClick={() => {
                              liff.init(
                                { liffId: config.liffId },
                                () => {
                                  if (liff.isLoggedIn()) {
                                    // console.log("openWindow")
                                    // liff.openWindow({
                                    //   url: config._baseURL + "image/getImgQrCode/" +
                                    //     OrderHD.Payment.id,
                                    //   external: true
                                    // })

                                    liff
                                      .sendMessages([
                                        {
                                          type: "image",
                                          originalContentUrl:
                                            config._baseURL +
                                            "image/getImgQrCode/" +
                                            OrderHD.Payment.id,
                                          previewImageUrl:
                                            config._baseURL +
                                            "image/getImgQrCode/" +
                                            OrderHD.Payment.id,
                                        },
                                        {
                                          type: "text",
                                          text:
                                            OrderHD.Payment.bankName +
                                            " สาขา : " +
                                            OrderHD.Payment.bankBranchName +
                                            " เลขบัญชี : " +
                                            OrderHD.Payment.accountNumber,
                                        },
                                      ])
                                      .then(() => {
                                        addToast(
                                          "บันทึก QR Code เรียบร้อยแล้ว",
                                          {
                                            appearance: "success",
                                            autoDismiss: true,
                                          }
                                        );
                                        console.log("message sent");
                                      })
                                      .catch((err) => {
                                        console.log("error", err);
                                      });
                                  } else {
                                    console.log("Login" + config.liffId);
                                    liff.login();
                                  }
                                },
                                (err) => console.error(err)
                              );
                            }}
                          >
                            {"บันทึก QR"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className="w-full mb-2">
                  <div className="flex bg-gold-mbk  text-white text-center text-lg  font-bold bt-line  ">
                    <label
                      id="getFileLabel"
                      className="w-full"
                      htmlFor="transfer-slip"
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        display: "flex",
                      }}
                    >
                      แนบสลิปโอนเงิน
                    </label>
                    {statuspayment ? (
                      <input
                        id="transfer-slip"
                        type="file"
                        onChange={onChangeslip}
                        accept="image/*"
                        style={{ display: "none" }}
                      />
                    ) : null}
                  </div>
                </div>
                <div className="w-full">
                  <div
                    className="flex border-gold-mbk  text-gold-mbk text-center text-lg  font-bold bt-line "
                    style={{ borderRadius: "10px" }}
                    onClick={() => {
                      if (statuspayment) {
                        setisAttachLater(true);
                      }
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
              <img
                src={SlipImage}
                id={"SlipImage"}
                style={{
                  width: "90%",
                  margin: "auto",
                }}
              />
            </div>
          </div>

          <div
            className="overflow-scroll line-scroll"
            style={{ height: "calc(100% - 200px)" }}
          >
            <div className="absolute w-full flex" style={{ bottom: "10px" }}>
              <div className="w-full px-4">
                <div
                  className="flex bg-green-mbk text-white text-center text-lg  font-bold bt-line "
                  onClick={() => {
                    if (statuspayment) {
                      saveSlip();
                    } else {
                      history.push(path.myorder.replace(":id", "1"));
                    }
                  }}
                >
                  {statuspayment ? "ตกลง" : "ดูคำสั่งซื้อของฉัน"}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        // รอการชำระเงิน
        <WaitingPayment
          price={"฿ " + fn.formatMoney(OrderHD == null ? 0 : OrderHD.price)}
        />
      )}
    </>
  );
};

export default PaymentInfo;
