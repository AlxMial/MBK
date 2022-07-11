import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import {
  customStyles,
  customStylesMobile,
} from "assets/styles/theme/ReactModal";
import LabelUC from "components/LabelUC";
import useWindowDimensions from "services/useWindowDimensions";
import InputUC from "components/InputUC";
import { Radio } from "antd";
import SelectUC from "components/SelectUC";
import ValidateService from "services/validateValue";
import TextAreaUC from "components/InputUC/TextAreaUC";
import axios from "services/axios";
import ButtonUCSaveModal from "components/ButtonUCSaveModal";
import ModalHeader from "views/admin/ModalHeader";
import ConfirmEdit from "components/ConfirmDialog/ConfirmEdit";

const PromotionModal = ({
  open,
  formik,
  handleModal,
  errorDiscout,
  errorPercentDiscount,
  errorPercentDiscountAmount,
  errorStockId,
  setErrorDiscout,
  setErrorPercentDiscount,
  setErrorPercentDiscountAmount,
  setErrorStockId,
}) => {
  Modal.setAppElement("#root");
  const useStyle = customStyles();
  const useStyleMobile = customStylesMobile();
  const { width } = useWindowDimensions();
  const [stockList, setStockList] = useState([]);
  const [isModify, setisModify] = useState(false);

  const [modalIsOpenEdit, setmodalIsOpenEdit] = useState(false);

  const conditionType = [
    { label: "ส่วนลด", value: "1" },
    { label: "% ส่วนลด", value: "2" },
    { label: "สินค้าสมนาคุณ", value: "3" },
  ];

  const nonSelect = [];
  const options = [
    { label: "เปิดการใช้งาน", value: true },
    { label: "ปิดการใช้งาน", value: false },
  ];

  useEffect(async () => {
    const _stockResponse = await axios.get("stock");
    const stock = await _stockResponse.data.tbStock;
    if (stock) {
      setStockList(
        stock.map((item) => ({
          label: item.productName,
          value: item.id,
        }))
      );
      if (!formik.values.stockId && stockList && stockList.length > 0) {
        formik.setFieldValue("stockId", stockList[0].value);
      }
      if (
        formik.values.stockId === "" &&
        _stockResponse.data.tbStock.length > 0
      ) {
        formik.setFieldValue("stockId", _stockResponse.data.tbStock[0].id);
      }
    }
  }, []);

  const closeModel = () => {
    if (!isModify) {
      handleModal();
    } else {
      setmodalIsOpenEdit(true);
    }
  };
  return (
    <>
      <Modal
        isOpen={open}
        onRequestClose={closeModel}
        style={width <= 1180 ? useStyleMobile : useStyle}
        contentLabel="Example Modal"
        shouldCloseOnOverlayClick={false}
      >
        <form onSubmit={formik.handleSubmit}>
          <div className="flex flex-wrap">
            <div className="w-full flex-auto mt-2">
              <ModalHeader
                title={"เพิ่มโปรโมชั่นหน้าร้าน"}
                handleModal={closeModel}
              />
              <div className="flex flex-wrap justify-center">
                <div className="w-full lg:w-12/12 px-4 margin-auto-t-b ">
                  <div className="flex flex-wrap justify-center">
                    <div className="w-full lg:w-2/12 px-4 margin-auto-t-b ">
                      <LabelUC label="ชื่อแคมเปญ" isRequired={true} />
                      <div className="relative w-full px-4">
                        {formik.touched.campaignName &&
                        formik.errors.campaignName ? (
                          <div className="text-sm py-2 px-2  text-red-500">
                            &nbsp;
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 margin-auto-t-b">
                      <div className="relative w-full px-4">
                        <InputUC
                          name="campaignName"
                          maxLength={100}
                          onBlur={formik.handleBlur}
                          value={formik.values.campaignName}
                          onChange={(e) => {
                            setisModify(true);
                            formik.handleChange(e);
                          }}
                        />
                      </div>
                      <div className="relative w-full px-4">
                        {formik.touched.campaignName &&
                        formik.errors.campaignName ? (
                          <div className="text-sm py-2 px-2  text-red-500">
                            {formik.errors.campaignName}
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="w-full lg:w-1/12 px-4 margin-auto-t-b ">
                      <LabelUC label="" />
                    </div>
                  </div>
                  <div className="flex flex-wrap mt-4 justify-center">
                    <div className="w-full lg:w-2/12 px-4 margin-auto-t-b ">
                      <LabelUC label="ซื้อครบ" isRequired={true} />
                      <div className="relative w-full px-4">
                        {formik.touched.campaignName &&
                        formik.errors.campaignName ? (
                          <div className="text-sm py-2 px-2  text-red-500">
                            &nbsp;
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 margin-auto-t-b">
                      <div className="relative w-full px-4">
                        <InputUC
                          type="text"
                          name="buy"
                          id="buy"
                          className="border-0 px-2 w-full text-right py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                          value={formik.values.buy}
                          onChange={(e) => {
                            setisModify(true);
                            if (e.target.value > 99999.99) {
                              formik.handleChange({
                                target: {
                                  name: "buy",
                                  value: 99999.99,
                                },
                              });
                            } else {
                              formik.handleChange({
                                target: {
                                  name: "buy",
                                  value: parseFloat(e.target.value) || 0,
                                },
                              });
                            }
                          }}
                          onBlur={(e) => {
                            if (e.target.value > 99999.99) {
                              e.preventDefault();
                            } else {
                              formik.handleChange({
                                target: {
                                  name: "buy",
                                  value:
                                    parseFloat(e.target.value).toFixed(2) || 0,
                                },
                              });
                            }
                          }}
                        />
                      </div>
                      <div className="relative w-full px-4">
                        {formik.touched.buy && formik.errors.buy ? (
                          <div className="text-sm py-2 px-2  text-red-500">
                            {formik.errors.buy}
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="w-full lg:w-1/12 px-4 margin-auto-t-b ">
                      <LabelUC label="บาท" />
                    </div>
                  </div>
                  <div className="flex flex-wrap mt-4 justify-center">
                    <div className="w-full lg:w-2/12 px-4 margin-auto-t-b ">
                      <LabelUC label="เงื่อนไข" />
                    </div>
                    <div className="w-full lg:w-6/12 margin-auto-t-b">
                      <div className="relative w-full px-4">
                        <Radio.Group
                          options={conditionType}
                          onChange={(e) => {
                            setisModify(true);
                            if (e.target.value === "1") {
                              formik.values.percentDiscount = "";
                              formik.values.percentDiscountAmount = "";
                            } else if (e.target.value === "2") {
                              formik.values.discount = "";
                            } else {
                            }
                            setErrorDiscout(false);
                            setErrorPercentDiscount(false);
                            setErrorPercentDiscountAmount(false);
                            setErrorStockId(false);
                            formik.setFieldValue("condition", e.target.value);
                          }}
                          value={formik.values.condition}
                        />
                      </div>
                      <div className="relative w-full px-4">
                        {formik.touched.condition && formik.errors.condition ? (
                          <div className="text-sm py-2 px-2  text-red-500">
                            {formik.errors.condition}
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="w-full lg:w-1/12 px-4 margin-auto-t-b ">
                      <LabelUC label="" />
                    </div>
                  </div>
                  <div className="flex flex-wrap mt-4 justify-center">
                    <div className="w-full lg:w-2/12 px-4 margin-auto-t-b ">
                      <LabelUC label="ส่วนลด" isRequired={true} />
                    </div>
                    <div className="w-full lg:w-6/12 margin-auto-t-b">
                      <div className="relative w-full px-4">
                        <InputUC
                          disabled={
                            formik.values.condition === "1" ? false : true
                          }
                          type="text"
                          id="discount"
                          className="border-0 px-2 w-full text-right py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                          name="discount"
                          value={formik.values.discount}
                          onChange={(e) => {
                            setisModify(true);
                            if (e.target.value > 99999.99) {
                              formik.handleChange({
                                target: {
                                  name: "discount",
                                  value: 99999.99,
                                },
                              });
                            } else {
                              formik.handleChange({
                                target: {
                                  name: "discount",
                                  value: parseFloat(e.target.value) || 0,
                                },
                              });
                            }
                          }}
                          onBlur={(e) => {
                            if (e.target.value > 99999.99) {
                              e.preventDefault();
                            } else {
                              formik.handleChange({
                                target: {
                                  name: "discount",
                                  value:
                                    parseFloat(e.target.value).toFixed(2) || 0,
                                },
                              });
                            }
                          }}
                        />
                      </div>
                      <div className="relative w-full px-4">
                        {formik.touched.discount && formik.errors.discount ? (
                          <div className="text-sm py-2 px-2  text-red-500">
                            {formik.errors.discount}
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="w-full lg:w-1/12 px-4 margin-auto-t-b ">
                      <LabelUC label="บาท" />
                    </div>
                  </div>
                  <div className="flex flex-wrap mt-4 justify-center">
                    <div className="w-full lg:w-2/12 px-4 margin-auto-t-b ">
                      <LabelUC label="% ส่วนลด" isRequired={true} />
                    </div>
                    <div className="w-full lg:w-1/12 margin-auto-t-b">
                      <div className="relative w-full px-4">
                        <InputUC
                          name="percentDiscount"
                          maxLength={3}
                          disabled={
                            formik.values.condition === "2" ? false : true
                          }
                          type="text"
                          id="percentDiscount"
                          className="border-0 px-2 w-full text-right py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                          value={formik.values.percentDiscount}
                          onChange={(e) => {
                            setisModify(true);
                            if (e.target.value > 100) {
                              formik.handleChange({
                                target: {
                                  name: "percentDiscount",
                                  value: 100,
                                },
                              });
                            } else {
                              formik.handleChange({
                                target: {
                                  name: "percentDiscount",
                                  value: parseFloat(e.target.value) || 0,
                                },
                              });
                            }
                          }}
                          onBlur={(e) => {
                            if (e.target.value > 100) {
                              e.preventDefault();
                            } else {
                              formik.handleChange({
                                target: {
                                  name: "percentDiscount",
                                  value:
                                    parseFloat(e.target.value).toFixed(2) || 0,
                                },
                              });
                            }
                          }}
                        />
                      </div>
                      <div className="relative w-full px-4">
                        {formik.touched.percentDiscount &&
                        formik.errors.percentDiscount ? (
                          <div className="text-sm py-2 px-2  text-red-500">
                            {formik.errors.percentDiscount}
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div
                      className={
                        "w-full lg:w-1/12 px-4 margin-auto-t-b flex justify-between " +
                        (width < 768 ? "flex-wrap" : "")
                      }
                    >
                      <LabelUC label="%" />
                      <LabelUC label="สูงสุด" isRequired={true} />
                    </div>
                    <div className="w-full lg:w-2/12 margin-auto-t-b">
                      <div className="relative w-full px-4">
                        <InputUC
                          name="percentDiscountAmount"
                          id="percentDiscountAmount"
                          type="text"
                          disabled={
                            formik.values.condition === "2" ? false : true
                          }
                          className="border-0 px-2 w-full text-right py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                          value={formik.values.percentDiscountAmount}
                          onChange={(e) => {
                            setisModify(true);
                            if (e.target.value > 99999.99) {
                              formik.handleChange({
                                target: {
                                  name: "percentDiscountAmount",
                                  value: 99999.99,
                                },
                              });
                            } else {
                              formik.handleChange({
                                target: {
                                  name: "percentDiscountAmount",
                                  value: parseFloat(e.target.value) || 0,
                                },
                              });
                            }
                          }}
                          onBlur={(e) => {
                            if (e.target.value > 99999.99) {
                              e.preventDefault();
                            } else {
                              formik.handleChange({
                                target: {
                                  name: "percentDiscountAmount",
                                  value:
                                    parseFloat(e.target.value).toFixed(2) || 0,
                                },
                              });
                            }
                          }}
                        />
                      </div>
                      <div className="relative w-full px-4">
                        {formik.touched.percentDiscountAmount &&
                        formik.errors.percentDiscountAmount ? (
                          <div className="text-sm py-2 px-2  text-red-500">
                            {formik.errors.percentDiscountAmount}
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="w-full lg:w-1/12 px-4 margin-auto-t-b">
                      <LabelUC label="บาท" />
                    </div>
                  </div>
                  <div className="flex flex-wrap mt-4 justify-center">
                    <div className="w-full lg:w-2/12 px-4 margin-auto-t-b ">
                      <LabelUC label="สินค้าจากคลัง" isRequired={true} />
                    </div>
                    <div className="w-full lg:w-6/12 margin-auto-t-b">
                      <div className="relative w-full px-4">
                        <SelectUC
                          id="stockId"
                          isDisabled={
                            formik.values.condition === "3" ? false : true
                          }
                          name="stockId"
                          onChange={(e) => {
                            setisModify(true);
                            setErrorStockId(false);
                            formik.setFieldValue("stockId", e.value);
                          }}
                          placeholder=""
                          options={
                            formik.values.condition === "3"
                              ? stockList
                              : nonSelect
                          }
                          value={
                            formik.values.condition === "3"
                              ? ValidateService.defaultValue(
                                  stockList,
                                  formik.values.stockId
                                )
                              : ""
                          }
                        />
                      </div>
                      <div className="relative w-full px-4">
                        {errorStockId ? (
                          <div className="text-sm py-2 px-2  text-red-500">
                            * กรุณาเลือก สินค้าจากคลัง
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="w-full lg:w-1/12 px-4 margin-auto-t-b ">
                      <LabelUC label="" />
                    </div>
                  </div>
                  <div className="flex flex-wrap mt-4 justify-center">
                    <div className="w-full lg:w-2/12 px-4 ">
                      <LabelUC label="รายละเอียด" />
                    </div>
                    <div className="w-full lg:w-6/12 margin-auto-t-b">
                      <div className="relative w-full px-4">
                        <TextAreaUC
                          name="description"
                          onBlur={formik.handleBlur}
                          value={formik.values.description}
                          onChange={(e) => {
                            setisModify(true);
                            formik.handleChange(e);
                          }}
                        />
                      </div>
                    </div>
                    <div className="w-full lg:w-1/12 px-4 margin-auto-t-b ">
                      <LabelUC label="" />
                    </div>
                  </div>
                  <div className="flex flex-wrap mt-4 justify-center">
                    <div className="w-full lg:w-2/12 px-4 margin-auto-t-b ">
                      <LabelUC label="" />
                    </div>
                    <div className="w-full lg:w-6/12 margin-auto-t-b">
                      <div className="relative w-full px-4">
                        <Radio.Group
                          options={options}
                          onChange={(e) => {
                            setisModify(true);
                            formik.setFieldValue("isInactive", e.target.value);
                          }}
                          value={formik.values.isInactive}
                        />
                      </div>
                    </div>
                    <div className="w-full lg:w-1/12 px-4 margin-auto-t-b ">
                      <LabelUC label="" />
                    </div>
                  </div>
                </div>
              </div>
              <ButtonUCSaveModal />
            </div>
          </div>
        </form>
      </Modal>
      <ConfirmEdit
        showModal={modalIsOpenEdit}
        message={"เงื่อนไขแลกของรางวัล"}
        hideModal={() => {
          handleModal();
        }}
        confirmModal={() => {
          formik.handleSubmit();
          setmodalIsOpenEdit(false);
        }}
        returnModal={() => {
          handleModal();
        }}
      />
    </>
  );
};

export default PromotionModal;
