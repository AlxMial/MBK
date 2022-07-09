import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import axios from "services/axios";
import { fetchLoading, fetchSuccess } from "redux/actions/common";
import * as yup from "yup";
import { useToasts } from "react-toast-notifications";
import InputSearchUC from "components/InputSearchUC";
import ButtonModalUC from "components/ButtonModalUC";
import PageTitle from "views/admin/PageTitle";
import FilesService from "../../../../services/files";
import { onSaveImage } from "services/ImageService";
import { useDispatch } from "react-redux";
import OrderList from "./OrderList";
import { EncodeKey } from "services/default.service";
import OrderDetail from "./OrderDetail";
import ConfirmEdit from "components/ConfirmDialog/ConfirmEdit";
import * as Address from "../../../../services/GetAddress.js";
import { exportExcel } from "services/exportExcel";
import moment from "moment";

const Order = () => {
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const [orderList, setOrderList] = useState([]);
  const [listSearch, setListSearch] = useState([]);
  const [open, setOpen] = useState(false);
  const [orderHD, setOrderHD] = useState({});
  const [orderDT, setOrderDT] = useState([]);
  const [orderImage, setOrderImage] = useState(null);
  const [memberData, setMemberData] = useState(null);
  const [transportStatus, setTransportStatus] = useState(null);
  const [isChangeOrderNumber, setIsChangeOrderNumber] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const [isCancel, setIsCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelStatus, setcancelStatus] = useState(null);
  const [ismodalIsOpenEdit, setmodalIsOpenEdit] = useState({
    open: false,
    callback: () => {},
  });

  const [tbCancelOrder, settbCancelOrder] = useState(null);
  const [paymentStatus, setpaymentStatus] = useState(null); //สถานะการจ่ายเงิน
  // const [transportStatus, settransportStatus] = useState(null);//สถานะการจ่ายเงิน

  const fetchData = async () => {
    dispatch(fetchLoading());
    setOrderImage(null);

    await axios.get("order/orderHD").then(async (response) => {

      if (!response.data.error && response.data.tbOrderHD) {
        let _orderData = response.data.tbOrderHD;
        console.log(_orderData)
        await response.data.tbOrderHD.map(async (e, i) => {
          e.province = await Address.getAddressName("province", e.province);
          e.subDistrict = await Address.getAddressName("subDistrict", e.subDistrict);
          e.district = await Address.getAddressName("district", e.district);
        });

        await axios.get("members").then((res) => {
          _orderData = _orderData.map((order) => {
            const member = res.data.tbMember.filter(
              (member) => member.id === EncodeKey(order.memberId)
            );

            if (member && member.length > 0) {
              order.memberName = member[0].firstName + " " + member[0].lastName;
              order.phone = member[0].phone;
              setMemberData(member[0]);
            }
            return order;
          });
          dispatch(fetchSuccess());
        });

        setOrderList(_orderData);
        setListSearch(_orderData);
      }
    });
  };

  useEffect(() => {
    // fetchPermission();
    fetchData();
  }, []);

  const InputSearch = (e) => {
    e = e.toLowerCase();
    if (e === "") {
      setOrderList(listSearch);
    } else {
      setOrderList(
        listSearch.filter(
          (x) =>
            x.orderNumber.toLowerCase().includes(e) ||
            x.memberName.toLowerCase().includes(e) ||
            (x.orderDate ?? "").toString().includes(e) ||
            (x.netTotal ?? "").toString().includes(e) ||
            (x.paymentStatus === "1"
              ? "รอการชำระเงิน"
              : x.paymentStatus === "2"
              ? "รอตรวจสอบ"
              : "ชำระเงินแล้ว"
            ).includes(e) ||
            (x.transportStatus === "1"
              ? "เตรียมส่ง"
              : x.transportStatus === "2"
              ? "อยู่ระหว่างจัดส่ง"
              : "ส่งแล้ว"
            ).includes(e) ||
            (x.tbCancelOrder != null
              ? x.tbCancelOrder.cancelDetail
              : x.tbReturnOrder != null
              ? x.tbReturnOrder.returnDetail
              : ""
            ).includes(e) ||
            (x.tbCancelOrder != null ? "ยกเลิกคำสั่งซื้อ" : "").includes(e)
        )
      );
    }
  };

  const openModal = async (id) => {
    dispatch(fetchLoading());
    settbCancelOrder(null);
    setOrderImage(null);

    const data = orderList.filter((x) => x.id === id);
    if (data && data.length > 0) {
      setOrderHD(data[0]);
      setOrderNumber(data[0].orderNumber);
      setTransportStatus(data[0].transportStatus);
      setIsCancel(data[0].isCancel);
      setpaymentStatus(data[0].paymentStatus);
      // settransportStatus(data[0].transportStatus)

      if (data[0].isCancel) {
        const res = await axios.get("cancelOrder/byOrderId/" + id);
        if (!res.data.error && res.data.tbCancelOrder) {
          setCancelReason(res.data.tbCancelOrder.cancelOtherRemark);
          setcancelStatus(
            res.data.tbCancelOrder.cancelStatus == 2 ? true : false
          );
          settbCancelOrder(res.data.tbCancelOrder);
        }
      }
      const res = await axios.get("order/orderDT/byOrderId/" + id);
      if (!res.data.error && res.data.tbOrderDT) {
        const _orderDT = res.data.tbOrderDT;
        setOrderDT(
          _orderDT.map((x) => {
            if (x.image) {
              const base64 = FilesService.buffer64UTF8(x.image);
              return { ...x, image: base64 };
            }
            return x;
          })
        );
      }

      const resMember = await axios.get(
        "/members/byIdOrder/" + data[0].memberId
      );
      if (!resMember.data.error && resMember.data.tbMember) {
        const _tbMember = resMember.data.tbMember;
        setMemberData(_tbMember);
      }

      const _orderImage = await axios.get(`image/byRelated/${id}/tbOrderHD`);
      if (_orderImage && _orderImage.data.tbImage) {
        const image = FilesService.buffer64UTF8(_orderImage.data.tbImage.image);
        setOrderImage(image);
      }

      dispatch(fetchSuccess());
      setOpen(true);
    } else {
      dispatch(fetchSuccess());
    }
  };

  const handleModal = async (value) => {
    if (value === "save") {
      dispatch(fetchLoading());
      if (
        (!isCancel || isCancel) &&
        ((orderNumber !== orderHD.orderNumber &&
          isChangeOrderNumber &&
          orderNumber !== "") ||
          !isChangeOrderNumber)
      ) {
        const res = await axios.get("order/orderHD/ById/" + orderHD.id);
        if (!res.data.error && res.data.tbOrderHD) {
          dispatch(fetchSuccess());
          setmodalIsOpenEdit({
            open: true,
            callback: async () => {
              const _dataHD = res.data.tbOrderHD;
              _dataHD.transportStatus = transportStatus;
              _dataHD.paymentStatus = paymentStatus;
              _dataHD.trackNo = orderHD.trackNo;
              _dataHD.isCancel = isCancel;
              // _dataHD.transportStatus = orderHD.transportStatus;

              await axios.put("order/orderHD", _dataHD).then(async (res) => {
                if (res.data.error) {
                  dispatch(fetchSuccess());
                  addToast("บันทึกข้อมูลไม่สำเร็จ", {
                    appearance: "warning",
                    autoDismiss: true,
                  });
                } else if (isCancel) {
                  // insert into tbCancelOrder
                  const _dataCancel = {
                    id: "",
                    orderId: orderHD.id,
                    cancelStatus: cancelStatus ? 2 : 3,
                    cancelDetail:
                      tbCancelOrder.cancelDetail == undefined
                        ? ""
                        : tbCancelOrder.cancelDetail,
                    description: tbCancelOrder.description,
                    cancelOtherRemark: tbCancelOrder.cancelOtherRemark,
                    cancelType: 1,
                    addBy: sessionStorage.getItem("user"),
                    updateBy: sessionStorage.getItem("user"),
                    isDeleted: false,
                  };

                  await axios
                    .post("cancelOrder", _dataCancel)
                    .then(async (res) => {
                      if (res.data.status) {
                        console.log(_dataHD);
                        axios
                          .post("mails/cancelsuccess", {
                            // frommail: "noreply@undefined.co.th",
                            // password: "Has88149*",
                            frommail: "no-reply@prg.co.th",
                            password: "Tus92278",
                            tomail: _dataHD.email,
                            orderNumber: _dataHD.orderNumber,
                            memberName:
                              _dataHD.firstName + " " + _dataHD.lastName,
                            cancelOtherRemark: tbCancelOrder.cancelOtherRemark,
                            cancelDetail:
                              tbCancelOrder.cancelDetail === undefined
                                ? ""
                                : tbCancelOrder.cancelDetail,
                            orderDate: moment(_dataHD.orderDate).format(
                              "DD/MM/YYYY"
                            ),
                          })
                          .then((res) => {})
                          .catch((error) => {})
                          .finally((final) => {});

                        addToast("บันทึกข้อมูลสำเร็จ", {
                          appearance: "success",
                          autoDismiss: true,
                        });
                      } else {
                        addToast("บันทึกข้อมูลไม่สำเร็จ", {
                          appearance: "warning",
                          autoDismiss: true,
                        });
                      }
                      dispatch(fetchSuccess());
                    });
                } else {
                  if (paymentStatus.toString() === "3") {
                    axios
                      .post("mails/paymentsuccessadmin", {
                        // frommail: "noreply@undefined.co.th",
                        // password: "Has88149*",
                        frommail: "no-reply@prg.co.th",
                        password: "Tus92278",
                        tomail: _dataHD.email,
                        orderNumber: _dataHD.orderNumber,
                        memberName: _dataHD.firstName + " " + _dataHD.lastName,
                        orderPrice: _dataHD.netTotal,
                        orderDate: moment(_dataHD.orderDate).format(
                          "DD/MM/YYYY"
                        ),
                      })
                      .then((res) => {})
                      .catch((error) => {})
                      .finally((final) => {});
                  }
                }
              });

              await fetchData();
              setOpen(false);
            },
          });
        }
      } else {
        dispatch(fetchSuccess());
      }

      // await saveImage(orderHD.id);
    } else {
      setOpen(false);
    }
  };

  const handleExport = async () => {};

  const Excel = async (sheetname) => {
    dispatch(fetchLoading());
    let order = await axios.get("order/orderHD/export");
    const TitleColumns = [
      "หมายเลขคำสั่งซื้อ",
      "วันที่สั่งซื้อ",
      "ชื่อ",
      "นามสกุล",
      "รหัสสมาชิก",
      "หมวดหมู่สินค้า",
      "ชื่อสินค้า",
      "จำนวน",
      "ราคาต่อหน่วย",
      "ค่าจัดส่ง",
      "ยอดสุทธิ",
      "สถานะโปรโมชั่น Flashsale",
      "ส่วนลดโปรโมชั่นร้านค้า",
      "ส่วนลดโปรโมชั่นสินค้า",
      "ส่วนลดจากคูปอง",
      "รหัสคูปอง",
      "ช่องทางการชำระเงิน",
      "สถานะการชำระเงิน",
      "วันที่ชำระเงินสำเร็จ",
      "ตัวเลือกการจัดส่ง",
      "สถานะการจัดส่ง",
      "หมายเลขติดตามพัสดุ",
      "วันที่จัดส่งสำเร็จ",
      "สถานะการยกเลิก",
      "สถานะการคืนสินค้า",
      // "วันที่ยกเลิก/คืนสินค้า",
      "สาเหตุที่ยกเลิก",
      "สาเหตุที่คืน",
      // "รายละเอียด",
      // "หมายเหตุ",
      "คะแนนสะสมที่ได้รับ",
      "เบอร์โทร",
      "อีเมล์",
      "ที่อยู่",
      "จังหวัด",
      "อำเภอ",
      "ตำบล",
      "รหัสไปรษณีย์",
    ];
    const columns = [
      "orderNumber",
      "orderDate",
      "firstName",
      "lastName",
      "memberCard",
      "categoryName",
      "productName",
      "amount",
      "price",
      "deliveryCost",
      "netTotal",
      "isFlashSale",
      "discountStorePromotion",
      "discount",
      "discountCoupon",
      "codeCoupon",
      "paymentType",
      "paymentStatus",
      "paymentDate",
      "logisticCategory",
      "transportStatus",
      "trackNo",
      "doneDate",
      "returnDate",
      "cancelDate",
      "returnDetail",
      "cancelDetail",
      "points",
      "phone",
      "email",
      "address",
      "province",
      "district",
      "subDistrict",
      "postcode",
    ];
    for (var i = 0; i < order.data.tbOrder.length; i++) {
      order.data.tbOrder[i]["province"] = await Address.getAddressName(
        "province",
        order.data.tbOrder[i]["province"]
      );
      order.data.tbOrder[i]["district"] = await Address.getAddressName(
        "district",
        order.data.tbOrder[i]["district"]
      );
      order.data.tbOrder[i]["subDistrict"] = await Address.getAddressName(
        "subDistrict",
        order.data.tbOrder[i]["subDistrict"]
      );

      order.data.tbOrder[i]["isFlashSale"] =
        order.data.tbOrder[i]["isFlashSale"] === "1" ? "Flash Sale" : "";

      order.data.tbOrder[i]["paymentType"] =
        order.data.tbOrder[i]["paymentType"] === "1" ? "โอนเงิน" : "2c2p";
      order.data.tbOrder[i]["paymentStatus"] =
        order.data.tbOrder[i]["paymentStatus"] === "1"
          ? "รอการชำระ"
          : order.data.tbOrder[i]["paymentStatus"] === "2"
          ? "รอการตรวจสอบ"
          : "สำเร็จ";
      order.data.tbOrder[i]["transportStatus"] =
        order.data.tbOrder[i]["transportStatus"] === "1"
          ? "รอการขนส่ง"
          : order.data.tbOrder[i]["transportStatus"] === "2"
          ? "กำลังขนส่ง"
          : "สำเร็จ";

      order.data.tbOrder[i]["codeCoupon"] =
        order.data.tbOrder[i]["codeCoupon"] === null
          ? ""
          : order.data.tbOrder[i]["codeCoupon"];

      order.data.tbOrder[i]["paymentDate"] =
        order.data.tbOrder[i]["paymentDate"] === null
          ? ""
          : order.data.tbOrder[i]["paymentDate"];

      order.data.tbOrder[i]["doneDate"] =
        order.data.tbOrder[i]["doneDate"] === null
          ? ""
          : order.data.tbOrder[i]["doneDate"];

      order.data.tbOrder[i]["trackNo"] =
        order.data.tbOrder[i]["trackNo"] === null
          ? ""
          : order.data.tbOrder[i]["trackNo"];

      order.data.tbOrder[i]["returnStatus"] =
        order.data.tbOrder[i]["returnStatus"] === null
          ? ""
          : order.data.tbOrder[i]["returnStatus"];

      order.data.tbOrder[i]["cancelStatus"] =
        order.data.tbOrder[i]["cancelStatus"] === null
          ? ""
          : order.data.tbOrder[i]["cancelStatus"];

      order.data.tbOrder[i]["returnDetail"] =
        order.data.tbOrder[i]["returnDetail"] === null
          ? ""
          : order.data.tbOrder[i]["returnDetail"];

      order.data.tbOrder[i]["cancelDetail"] =
        order.data.tbOrder[i]["cancelDetail"] === null
          ? ""
          : order.data.tbOrder[i]["cancelDetail"];
    }

    exportExcel(
      order.data.tbOrder,
      sheetname,
      TitleColumns,
      columns,
      sheetname
    );
    dispatch(fetchSuccess());
  };

  return (
    <>
      <PageTitle page="order" />
      <div className="w-full">
        <div
          className={
            "py-4 relative flex flex-col min-w-0 break-words w-full mb-6 border rounded-b bg-white Overflow-list "
          }
  
        >
          <div className="rounded-t mb-0 px-4 py-3 border-0">
            <div className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap ">
              <div className="w-full lg:w-6/12">
                <InputSearchUC onChange={(e) => InputSearch(e.target.value)} />
              </div>
              <div className="w-full lg:w-6/12">
                <div className="flex mt-2 float-right">
                  <img
                    src={require("assets/img/mbk/excel.png").default}
                    alt="..."
                    onClick={() => Excel("รายการสั่งซื้อ")}
                    className="imgExcel margin-auto-t-b cursor-pointer "
                  ></img>
                </div>
              </div>
            </div>
          </div>
          <OrderList orderList={orderList} openModal={openModal} />
        </div>
      </div>
      <ConfirmEdit
        showModal={ismodalIsOpenEdit.open}
        message={"รายละเอียดการสั่งซื้อ"}
        hideModal={() => {
          setmodalIsOpenEdit({ open: false });
        }}
        confirmModal={() => {
          setmodalIsOpenEdit({ open: false });
          ismodalIsOpenEdit.callback();
        }}
        returnModal={() => {
          setmodalIsOpenEdit({ open: false });
        }}
      />

      {open && (
        <OrderDetail
          open={open}
          orderImage={orderImage}
          orderHD={orderHD}
          orderHDold={orderHD}
          orderDT={orderDT}
          memberData={memberData}
          handleExport={handleExport}
          isChangeOrderNumber={isChangeOrderNumber}
          setIsChangeOrderNumber={setIsChangeOrderNumber}
          setOrderNumber={setOrderNumber}
          isCancel={isCancel}
          setIsCancel={setIsCancel}
          orderNumber={orderNumber}
          cancelReason={cancelReason}
          setCancelReason={setCancelReason}
          transportStatus={transportStatus}
          setTransportStatus={setTransportStatus}
          handleModal={handleModal}
          setOrderHD={setOrderHD}
          cancelStatus={cancelStatus}
          setcancelStatus={setcancelStatus}
          tbCancelOrder={tbCancelOrder}
          settbCancelOrder={settbCancelOrder}
          paymentStatus={paymentStatus}
          setpaymentStatus={setpaymentStatus}
        />
      )}
    </>
  );
};

export default Order;
