import React, { useEffect } from "react";
import Modal from "react-modal";
import {
  customStyles,
  customStylesMobile,
} from "assets/styles/theme/ReactModal";
import LabelUC from "components/LabelUC";
import useWindowDimensions from "services/useWindowDimensions";
import TextAreaUC from "components/InputUC/TextAreaUC";
import ModalHeader from "views/admin/ModalHeader";

const ConfirmDialog = ({ open, formik, handleModal, status, type }) => {
  Modal.setAppElement("#root");
  const useStyle = customStyles();
  const useStyleMobile = customStylesMobile();
  const { width } = useWindowDimensions();

  const cancelList = [
    { label: "รอยกเลิก", value: 1 },
    { label: "คืนเงิน", value: 2 },
    { label: "ไม่คืนเงิน", value: 3 },
  ];

  const returnList = [
    { label: "รอการคืนสินค้า", value: 1 },
    { label: "คืนสำเร็จ", value: 2 },
    { label: "ปฎิเสธ", value: 3 },
  ];

  return (
    <Modal
      isOpen={open}
      onRequestClose={handleModal}
      style={width <= 1180 ? useStyleMobile : useStyle}
      contentLabel="Example Modal"
      shouldCloseOnOverlayClick={false}
    >
      <form onSubmit={formik.handleSubmit}>
        <div className="flex flex-wrap">
          <div className="w-full flex-auto mt-2">
            <ModalHeader
              title={`${type === "cancel" ? "ยกเลิกสินค้า" : "คืนสินค้า"}`}
              handleModal={handleModal}
            />
            <div className="flex flex-wrap px-24 justify-center">
              <div className="w-full px-4 margin-auto-t-b ">
                <LabelUC
                  label={`ต้องการเปลี่ยนสถานะเป็น ${
                    (type === "cancel" ? cancelList : returnList).filter(
                      (item) => item.value === status
                    )[0].label
                  } ใช่หรือไม่?`}
                />
                <div className="flex flex-wrap mt-4">
                  <div className="w-full lg:w-12/12 margin-auto-t-b ">
                    <LabelUC
                      label={`รายละเอียดที่${
                        type === "cancel" ? "ยกเลิก" : "รับคืน/ปฏิเสธ"
                      }`}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap mt-4">
                  <div className="w-full lg:w-12/12 margin-auto-t-b">
                    <div className="relative w-full">
                      <TextAreaUC
                        name="description"
                        onBlur={formik.handleBlur}
                        value={formik.values.description}
                        onChange={(e) => {
                          formik.handleChange(e);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative w-full mb-3">
              <div className=" flex justify-end align-middle ">
                <div
                  className={
                    "border-t-0 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4 px-0"
                  }
                >
                  <button
                    className={
                      "px-24 bg-gold-mbk text-white active:bg-gold-mbk font-bold uppercase text-sm  py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                    }
                    type="button"
                    onClick={() => handleModal("save")}
                  >
                    บันทึก
                  </button>
                </div>
                <div className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4">
                  <button
                    className={
                      "px-24 text-gold-mbk bg-white active:bg-gold-mbk font-bold uppercase text-sm  py-2 rounded shadow hover:shadow-md outline-gold-mbk mr-1 ease-linear transition-all duration-150"
                    }
                    type={"button"}
                    onClick={() => handleModal("cancel")}
                  >
                    ยกเลิก
                  </button>
                </div>
                {/* </div> */}
              </div>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ConfirmDialog;
