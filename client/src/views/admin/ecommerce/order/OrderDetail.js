import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import {
  customStyles,
  customStylesMobile,
} from "assets/styles/theme/ReactModal";
import LabelUC from "components/LabelUC";
import useWindowDimensions from "services/useWindowDimensions";
// import InputUC from 'components/InputUC';
// import ProfilePictureUC from 'components/ProfilePictureUC';
// import FilesService from "services/files";
// import ValidateService from "services/validateValue";
import ButtonUCSaveModal from "components/ButtonUCSaveModal";
import ModalHeader from "views/admin/ModalHeader";
import PurchaseOrder from "./PurchaseOrder";
import CustomerName from "./CustomerName";
import Payment from "./Payment";
import Logistic from "./Logistic";
import ExportPdf from "./Export/ExportPdf";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
// import ExportHeader from './ExportHeader';
import { useDispatch } from "react-redux";
import { fetchLoading, fetchSuccess } from "redux/actions/common";
import * as Address from "services/GetAddress.js";
import ExportHeader from "./Export/ExportHeader";

const OrderDetail = ({
  open,
  handleModal,
  orderHD,
  orderHDold,
  orderDT,
  memberData,
  orderImage,
  handleExport,
  transportStatus,
  setTransportStatus,
  isChangeOrderNumber,
  setIsChangeOrderNumber,
  orderNumber,
  setOrderNumber,
  isCancel,
  setIsCancel,
  cancelReason,
  setCancelReason,
  setOrderHD,
  cancelStatus,
  setcancelStatus,
  tbCancelOrder,
  settbCancelOrder,
  paymentStatus,
  setpaymentStatus,
}) => {
  Modal.setAppElement("#root");
  const dispatch = useDispatch();
  const useStyle = customStyles();
  const useStyleMobile = customStylesMobile();
  const [isCanEdit, setIsCanEdit] = useState(true);
  const { width } = useWindowDimensions();
  const [openExport, setOpenExport] = useState(false);
  const [dataExport, setDataExport] = useState({});
  const [clickExport, setClickExport] = useState(false);

  const propsPurchaseOrder = { orderHD, orderDT, openExport };
  const propsPayment = {
    orderHD,
    orderHDold,
    orderDT,
    isCanEdit,
    paymentStatus,
    setpaymentStatus,
    transportStatus,
    setTransportStatus,
  };
  const propsLogistic = {
    orderHD,
    orderDT,
    orderHDold,
    memberData,
    setIsChangeOrderNumber,
    isCanEdit,
    orderNumber,
    setOrderNumber,
    isCancel,
    setIsCancel,
    isChangeOrderNumber,
    cancelReason,
    setCancelReason,
    transportStatus,
    setTransportStatus,
    cancelStatus,
    paymentStatus,
  };

  // change file name while exporting
  useEffect(() => {
    if (clickExport && orderHD) {
      document.title = orderHD.orderNumber;
    } else {
      document.title = "Mah Boonkrong Rice";
    }
  }, [clickExport]);

  useEffect(async () => {
    //?????????????????????????????????
    if (orderHDold.isCancel) {
      setIsCanEdit(false);
    }
    //???????????????????????????????????????
    if (orderHD.tbCancelOrder != null) {
      setIsCanEdit(false);
    }

    const subDistrict = await Address.getAddressName(
      "subDistrict",
      memberData.subDistrict
    );
    const district = await Address.getAddressName(
      "district",
      memberData.district
    );
    const _province = await Address.getAddressName(
      "province",
      memberData.province
    );

    setDataExport({
      name: orderHD.memberName,
      orderNumber: orderHD.orderNumber,
      address:
        (subDistrict ? "????????????/???????????? " + subDistrict : "") +
        " " +
        (district ? "???????????????/????????? " + district : "") +
        " " +
        (_province
          ? (_province !== "???????????????????????????????????????" ? "????????????????????? " : "") + _province
          : "") +
        " " +
        memberData.postcode +
        " " +
        memberData.country,
      phone: memberData.phone,
      email: memberData.email,
    });
  }, []);

  useEffect(async () => {
    if (openExport && dataExport) {
      dispatch(fetchLoading());
      const pdf = new jsPDF("portrait", "px", "a4");
      const data = await html2canvas(document.querySelector("#purchaseOrder"));
      const img = data.toDataURL("image/png");
      const imgProperties = pdf.getImageProperties(img);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
      pdf.addImage(img, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("Export ??????????????????????????????.pdf");
      setOpenExport(false);
      dispatch(fetchSuccess());
    }
  }, [openExport, dataExport]);

  // console.log(orderHD)

  return (
    <Modal
      isOpen={open}
      onRequestClose={() => handleModal("save")}
      style={width <= 1180 ? useStyleMobile : useStyle}
      contentLabel="Example Modal"
      shouldCloseOnOverlayClick={false}
    >
      <div className="flex flex-wrap">
        <div className="w-full flex-auto mt-2">
          <div className="flex flex-wrap justify-center" style={{ height: "3.5rem" }}>
            <div className="w-full lg:w-6/12">
              <ModalHeader
                isClose={false}
                title="???????????????????????????????????????????????????????????????"
              />
            </div>
            <div className="w-full lg:w-6/12">
              <div className="flex flex-wrap justify-end">
                <ExportPdf
                  props={propsPurchaseOrder}
                  dataExport={dataExport}
                  setClickExport={setClickExport}
                />
                <ButtonUCSaveModal
                  onClick={() => {
                    if (isCanEdit) {
                      handleModal("save");
                    }
                  }}
                />
                <div className=" border-t-0 py-3 px-6 align-middle border-l-0 border-r-0 text-sm text-red-500 font-bold whitespace-nowrap">
                  <label
                    className="cursor-pointer"
                    onClick={() => handleModal()}
                  >
                    X
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className={"flex flex-wrap justify-center  Overflow-info"}>
            {/* <ExportHeader dataExport={dataExport} />
            <PurchaseOrder props={propsPurchaseOrder} /> */}
            <div className={"w-full p-4 margin-auto-t-b flex flex-wrap " + ((clickExport) ? " hidden" : " ")}>
              <div className="w-full lg:w-8/12 px-4  flex flex-col">
                <div className="w-full" id="purchaseOrder">
                  <div className="flex py-2">
                    <div className="font-bold" style={{ width: "100px" }}>
                      ????????????????????????????????????????????????
                    </div>
                    <div
                      style={{ width: "calc(100% - 100px)", textAlign: "end" }}
                    >
                      {"??????????????????????????????????????????????????? " + orderHD.orderNumber}
                    </div>
                  </div>
                  <PurchaseOrder props={propsPurchaseOrder} />
                </div>
                <div className="w-full">
                  <LabelUC label="??????????????????????????????????????????" moreClassName="py-2" />
                  <div className="pt-2 text-center px-12">
                    <img src={orderImage} className="image-slip" />
                  </div>
                </div>
              </div>
              <div className="w-full h-full lg:w-4/12 px-4 flex flex-col">
                <div className="w-full">
                  <LabelUC label="??????????????????????????????" moreClassName="border-b py-2" />
                  <CustomerName orderHD={orderHD} />
                </div>
                <div className="w-full mt-4">
                  <LabelUC label="?????????????????????????????????" moreClassName="border-b py-2" />
                  <Payment props={propsPayment} setOrderHD={setOrderHD} />
                </div>
                <div className="w-full mt-4">
                  <LabelUC label="???????????????????????????" moreClassName="border-b py-2" />
                  <Logistic
                    props={propsLogistic}
                    setOrderHD={setOrderHD}
                    cancelStatus={cancelStatus}
                    setcancelStatus={setcancelStatus}
                    tbCancelOrder={tbCancelOrder}
                    settbCancelOrder={settbCancelOrder}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default OrderDetail;
