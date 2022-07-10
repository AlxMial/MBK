import React, { useState, useEffect } from "react";
/* Service */
import useWindowDimensions from "services/useWindowDimensions";
import { Radio } from "antd";
import "antd/dist/antd.css";
import "moment/locale/th";
import moment from "moment";
import CreatableSelect from "react-select/creatable";
import Modal from "react-modal";
import LabelUC from "components/LabelUC";
import {
  customStyles,
  customStylesMobile,
} from "assets/styles/theme/ReactModal";
import ProfilePictureUC from "components/ProfilePictureUC";
import InputUC from "components/InputUC";
import SelectUC from "components/SelectUC";
import ValidateService from "services/validateValue";
import TextAreaUC from "components/InputUC/TextAreaUC";
import Switch from "react-switch";
import DatePickerUC from "components/DatePickerUC";
import ButtonUCSaveModal from "components/ButtonUCSaveModal";
import axios from "services/axios";
import { useToasts } from "react-toast-notifications";
import ModalHeader from "views/admin/ModalHeader";
import ButtonModalUC from "components/ButtonModalUC";
import { styleSelect } from "assets/styles/theme/ReactSelect.js";
import Categorylist from "./Categorylist";

import TimePicker from "react-awesome-time-picker";
import "react-awesome-time-picker/assets/index.css";

const StockInfo = ({
  handleModal,
  formik,
  open,
  handleChangeImage,
  stockImage,
  isImageCoverNull = false,
  errorImage
}) => {
  Modal.setAppElement("#root");
  const useStyleCreate = styleSelect();

  const inactiveList = [
    { label: "เปิดการใช้งาน", value: true },
    { label: "ปิดการใช้งาน", value: false },
  ];

  const { addToast } = useToasts();
  const useStyle = customStyles();
  const useStyleMobile = customStylesMobile();
  /* Service Function */
  const { width } = useWindowDimensions();
  const [isLoadingSelect, setIsLoadingSelect] = useState(false);
  const [productCategoryList, setProductCategoryList] = useState([]);
  const [categoryValue, setCategoryValue] = useState(null);
  const [delayValue, setDelayValue] = useState("");
  const [delayValue2, setDelayValue2] = useState("");

  const [openCategory, setOpenCategory] = useState(false);

  const onOpenModal = () => {
    console.log(openCategory);
    setOpenCategory(true);
  };

  const onCloseModal = () => {
    setOpenCategory(false);
  };

  useEffect(async () => {
    await fetchData();
  }, []);

  const fetchData = async () => {
    const res = await axios.get("productCategory");
    const productCategory = await res.data.tbProductCategory;
    if (productCategory) {
      // console.log('setProductCategoryList', productCategory);
      setProductCategoryList(
        productCategory.map((item) => ({
          label: item.categoryName,
          value: item.id,
        }))
      );
    }
  };

  useEffect(() => {
    // default
    if (productCategoryList && productCategoryList.length > 0) {
      if (!formik.values.productCategoryId) {
        setCategoryValue(productCategoryList[0]);
        formik.setFieldValue("productCategoryId", productCategoryList[0].value);
      } else {
        setCategoryValue(
          productCategoryList.find(
            (item) => item.value === formik.values.productCategoryId
          )
        );
      }
    }
  }, [productCategoryList]);

  const createOption = (label) => ({
    label,
    value: label.toLowerCase().replace(/\W/g, ""),
  });

  const handleChange = (newValue, actionMeta) => {
    console.log(newValue);
    if (newValue !== null) {
      const _categoryValue =
        productCategoryList &&
        productCategoryList.filter((item) => item.value === newValue);
      if (_categoryValue) {
        setCategoryValue(_categoryValue[0]);
      }
    }

    formik.setFieldValue(
      "productCategoryId",
      newValue !== null ? newValue.value : "",
      false
    );
  };

  const handleCreate = (inputValue) => {
    setIsLoadingSelect(true);

    const newOption = createOption(inputValue);
    const newItem = {
      id: "",
      categoryName: inputValue,
      isDeleted: false,
      addBy: sessionStorage.getItem("user"),
      updateBy: sessionStorage.getItem("user"),
    };
    axios.post("productCategory", newItem).then((res) => {
      if (res.data.status) {
        console.groupEnd();
        // setProductCategoryList([...productCategoryList, newOption]);
        newOption.value = res.data.tbProductCategory.id;
        setProductCategoryList((s) => {
          return [
            ...s,
            {
              value: newOption.value,
              label: newOption.label,
            },
          ];
        });

        setDelayValue2("setvalue");
        setIsLoadingSelect(false);
        setCategoryValue(newOption);
        console.log(res.data.tbProductCategory);
        formik.setFieldValue("productCategoryId", newOption.value);
      } else {
        setIsLoadingSelect(false);
        addToast("บันทึกข้อมูลหมวดหมู่สินค้าไม่สำเร็จ", {
          appearance: "warning",
          autoDismiss: true,
        });
      }
    });
  };

  const calculateValue = (value, type) => {
    var Calculate = 0;
    if (type === "percent") {
      if (value !== "" && value > 0) {
        if (formik.values.price !== "" && formik.values.price > 0) {
          Calculate = formik.values.price * (value / 100);
          formik.setFieldValue("discount", Calculate.toFixed(2));
        }
      } else {
        formik.setFieldValue("discount", "0");
      }
    } else if (type === "discount") {
      if (value !== "" && value > 0) {
        if (formik.values.price !== "" && formik.values.price > 0) {
          Calculate = (value / formik.values.price) * 100;
          formik.setFieldValue("percent", Calculate.toFixed(2));
        }
      } else {
        formik.setFieldValue("percent", "0");
      }
    } else {
      if (value !== "" && value > 0) {
        formik.setFieldValue("percent", "");
        formik.setFieldValue("discount", "");
      }
    }
  };
  const calculateSaleValue = (value, type) => {
    var Calculate = 0;
    if (formik.values.price == 0) {
      formik.setFieldValue("salePercent", "");
      formik.setFieldValue("saleDiscount", "");
    } else {
      if (type === "percent") {
        if (value !== "" && value > 0) {
          if (formik.values.price !== "" && formik.values.price > 0) {
            Calculate = formik.values.price * (value / 100);
            formik.setFieldValue("saleDiscount", Calculate.toFixed(2));
          }
        } else {
          formik.setFieldValue("saleDiscount", "0");
        }
      } else if (type === "discount") {
        if (value !== "" && value > 0) {
          if (formik.values.price !== "" && formik.values.price > 0) {
            Calculate = (value / formik.values.price) * 100;
            formik.setFieldValue("salePercent", Calculate.toFixed(2));
          }
        } else {
          formik.setFieldValue("salePercent", "0");
        }
      } else {
        if (value !== "" && value > 0) {
          formik.setFieldValue("salePercent", "");
          formik.setFieldValue("saleDiscount", "");
        }
      }
    }
  };

  return (
    <>
      <Modal
        isOpen={open}
        onRequestClose={handleModal}
        style={width <= 1180 ? useStyleMobile : useStyle}
        contentLabel="Example Modal"
        shouldCloseOnOverlayClick={false}
      >
        <div className="flex flex-wrap">
          <div className="w-full flex-auto mt-2">
            <form onSubmit={formik.handleSubmit}>
              <ModalHeader title="เพิ่มสินค้า" handleModal={handleModal} />
              <div className="flex flex-wrap px-24 py-10 justify-center Overflow-Banner">
                <div className="w-full lg:w-12/12 px-4 margin-auto-t-b">
                  {/* อิสขายดี */}
                  <div className="flex flex-wrap mt-4">
                    <div className="w-full lg:w-2/12 px-4 margin-auto-t-b ">
                      <LabelUC label="สินค้าขายดี" isRequired={true} />
                    </div>
                    <div className="w-full lg:w-6/12 margin-auto-t-b">
                      <div className="relative w-full px-4">
                        <Switch
                          uncheckedIcon={false}
                          checkedIcon={false}
                          onChange={(value) => {
                            formik.setFieldValue("isBestSeller", value);
                          }}
                          checked={formik.values.isBestSeller}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap">
                    {/* รูปสินค้า */}
                    <div className="w-full lg:w-2/12 px-4 margin-auto-t-b ">
                      <LabelUC label="รูปสินค้า" isRequired={true} />{" "}
                      <span className="text-red-500 text-xs">600*600 px</span>
                    </div>
                    <div className="w-full lg:w-10/12 margin-auto-t-b">
                      <div className="relative w-full px-4 flex">
                        {stockImage.map((item, i) => {
                          return (
                            <div key={i + 1}>
                              <div className="flex justify-center flex-col">
                                <ProfilePictureUC
                                  className="pr-4"
                                  id={i + 1}
                                  hoverText="เลือกรูปสินค้า"
                                  src={item.image}
                                  onChange={handleChangeImage}
                                />
                                <LabelUC
                                  moreClassName="text-center mt-2 pr-4"
                                  label={
                                    i === 0
                                      ? "รูปปกสินค้า"
                                      : "รูปสินค้า " + (i + 1)
                                  }
                                  isRequired={i === 0}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      {errorImage ? (
                        <div className="text-sm py-2 px-2  text-red-500">
                          * ประเภทไฟล์รูปภาพไม่ถูกต้อง
                        </div>
                      ) : null}
                      {isImageCoverNull && (
                        <div className="relative w-full px-4">
                          <div className="text-sm py-2 px-2  text-red-500">
                            กรุณาเลือก รูปปกสินค้า
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap mt-4">
                    <div className="w-full lg:w-2/12 px-4 margin-auto-t-b ">
                      <LabelUC label="ชื่อสินค้า" isRequired={true} />
                    </div>
                    <div className="w-full lg:w-8/12 margin-auto-t-b">
                      <div className="relative w-full px-4">
                        <InputUC
                          name="productName"
                          maxLength={100}
                          onBlur={formik.handleBlur}
                          value={formik.values.productName}
                          onChange={(e) => {
                            formik.handleChange(e);
                          }}
                        />
                      </div>
                      <div className="relative w-full px-4">
                        {formik.touched.productName &&
                        formik.errors.productName ? (
                          <div className="text-sm py-2 px-2  text-red-500">
                            {formik.errors.productName}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  {/* หมวดหมู่สินค้า */}
                  <div className="flex flex-wrap  mt-4">
                    <div className="w-full lg:w-2/12 px-4 margin-auto-t-b ">
                      <LabelUC label="หมวดหมู่สินค้า" isRequired={true} />
                    </div>
                    <div className="w-full lg:w-8/12 margin-auto-t-b">
                      <div className="relative w-full px-4">
                        <div className="flex flex-warp">
                          <div className="relative w-full ">
                            <CreatableSelect
                              isClearable
                              className="border-0 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                              styles={useStyleCreate}
                              menuPortalTarget={document.body}
                              menuPosition="fixed"
                              isLoading={isLoadingSelect}
                              options={productCategoryList}
                              onChange={handleChange}
                              placeholder="เลือกข้อมูล / เพิ่มข้อมูล"
                              onCreateOption={handleCreate}
                              value={categoryValue}
                            />
                          </div>
                          <div className="relative px-4 margin-a ">
                            <i
                              className=" cursor-pointer fas fa-bars"
                              onClick={() => {
                                onOpenModal();
                              }}
                            ></i>
                          </div>
                        </div>
                      </div>
                      <div className="relative w-full px-4">
                        {formik.touched.productCategoryId &&
                        formik.errors.productCategoryId ? (
                          <div className="text-sm py-2 px-2  text-red-500">
                            {formik.errors.productCategoryId}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap mt-4">
                    <div className="w-full lg:w-2/12 px-4 margin-auto-t-b ">
                      <LabelUC label="ราคา" isRequired={true} />
                      <div className="relative w-full px-4">
                        {formik.touched.price && formik.errors.price ? (
                          <div className="text-sm py-2 px-2  text-red-500">
                            &nbsp;
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="w-full lg:w-2/12 margin-auto-t-b">
                      <div className="relative w-full px-4">
                        <InputUC
                          type="text"
                          className="border-0 px-2 w-full text-right py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                          id="price"
                          name="price"
                          onBlur={formik.handleBlur}
                          value={formik.values.price}
                          // disabled={typePermission !== "1"}
                          onChange={(e) => {
                            var start = e.target.selectionStart;
                            setDelayValue(
                              ValidateService.onHandleDecimalChange(e)
                            );
                            formik.values.price =
                              ValidateService.onHandleDecimalChange(e);
                            e.target.setSelectionRange(start, start);
                            calculateValue(formik.values.price, "price");
                          }}
                        />
                      </div>
                      <div className="relative w-full px-4">
                        {formik.touched.price && formik.errors.price ? (
                          <div className="text-sm py-2 px-2  text-red-500">
                            {formik.errors.price}
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="w-full lg:w-1/12 px-4 margin-auto-t-b flex justify-between">
                      <LabelUC label="บาท" />
                      {/* <LabelUC label="ส่วนลด" /> */}
                    </div>
                    {/* ส่วนลด */}
                    <div className="w-full lg:w-1/12 margin-auto-t-b">
                      <div className="relative w-full px-4">&nbsp;</div>
                    </div>
                    <div className="w-full lg:w-1/12 pl-4 margin-auto-t-b ">
                      &nbsp;
                    </div>
                  </div>
                  <div className="flex flex-wrap mt-4">
                    <div className="w-full lg:w-2/12 px-4 margin-auto-t-b ">
                      <LabelUC label="ส่วนลด" />
                      <div className="relative w-full px-4">
                        {/* {formik.touched.discount && formik.errors.discount ? (
                          <div className="text-sm py-2 px-2  text-red-500">
                            &nbsp;
                          </div>
                        ) : null} */}
                      </div>
                    </div>
                    <div className="w-full lg:w-2/12 margin-auto-t-b">
                      <div className="relative w-full px-4">
                        <InputUC
                          type="text"
                          className="border-0 px-2 w-full text-right py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                          id="discount"
                          name="discount"
                          onBlur={formik.handleBlur}
                          value={formik.values.discount}
                          onChange={(e) => {
                            var start = e.target.selectionStart;
                            setDelayValue(
                              ValidateService.onHandleDecimalChange(e)
                            );
                            formik.values.discount =
                              ValidateService.onHandleDecimalChange(e);
                            if (
                              formik.values.discount !== "" &&
                              formik.values.price !== ""
                            ) {
                              if (
                                parseInt(formik.values.discount) >
                                parseInt(formik.values.price)
                              ) {
                                formik.values.discount = formik.values.price;
                              }
                            }
                            e.target.setSelectionRange(start, start);
                            calculateValue(formik.values.discount, "discount");
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
                    <div className="w-full lg:w-1/12 px-4 margin-auto-t-b flex justify-between">
                      <LabelUC label="บาท" />
                      <div className="relative w-full px-4">
                        {formik.touched.discount && formik.errors.discount ? (
                          <div className="text-sm py-2 px-2  text-red-500">
                            &nbsp;
                          </div>
                        ) : null}
                      </div>
                    </div>
                    {/* ส่วนลด */}
                    <div className="w-full lg:w-1/12 margin-auto-t-b">
                      <div className="relative w-full px-4">
                        <InputUC
                          type="text"
                          className="border-0 px-2 w-full text-right py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                          id="percent"
                          name="percent"
                          onBlur={formik.handleBlur}
                          value={formik.values.percent}
                          onChange={(e) => {
                            var start = e.target.selectionStart;
                            if (
                              ValidateService.onHandleDecimalChange(e) > 100.0
                            )
                              e.target.value = 100;
                            setDelayValue(
                              ValidateService.onHandleDecimalChange(e)
                            );
                            formik.values.percent =
                              ValidateService.onHandleDecimalChange(e);
                            if (
                              formik.values.percent !== "" &&
                              formik.values.price !== ""
                            ) {
                              if (
                                parseInt(formik.values.percent) >
                                parseInt(formik.values.price)
                              ) {
                                formik.values.percent = formik.values.price;
                              }
                            }
                            e.target.setSelectionRange(start, start);
                            calculateValue(formik.values.percent, "percent");
                          }}
                        />
                      </div>
                      <div className="relative w-full px-4">
                        {formik.touched.discount && formik.errors.discount ? (
                          <div className="text-sm py-2 px-2  text-red-500">
                            &nbsp;
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="w-full lg:w-1/12 pl-4 margin-auto-t-b ">
                      <LabelUC label="เปอร์เซ็นต์" />
                      <div className="relative w-full px-4">
                        {formik.touched.discount && formik.errors.discount ? (
                          <div className="text-sm py-2 px-2  text-red-500">
                            &nbsp;
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  {/* จำนวนสินค้าในคลัง */}
                  <div className="flex flex-wrap mt-4">
                    <div className="w-full lg:w-2/12 px-4 margin-auto-t-b ">
                      <LabelUC label="จำนวนสินค้าในคลัง" />
                    </div>
                    <div className="w-full lg:w-2/12 margin-auto-t-b">
                      <div className="relative w-full px-4">
                        <InputUC
                          type="text"
                          maxLength={5}
                          id="productCount"
                          className="border-0 px-2 w-full text-right py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                          name="productCount"
                          onBlur={formik.handleBlur}
                          value={formik.values.productCount}
                          // disabled={typePermission !== "1"}
                          onChange={(e) => {
                            setDelayValue(ValidateService.onHandleNumber(e));
                            formik.values.productCount =
                              ValidateService.onHandleNumber(e);
                          }}
                        />
                      </div>
                    </div>
                    <div className="w-full lg:w-1/12 px-4 margin-auto-t-b ">
                      <LabelUC label="ชิ้น" />
                    </div>
                  </div>
                  {/* น้ำหนัก */}
                  <div className="flex flex-wrap mt-4">
                    <div className="w-full lg:w-2/12 px-4 margin-auto-t-b ">
                      <LabelUC label="น้ำหนัก" />
                    </div>
                    <div className="w-full lg:w-2/12 margin-auto-t-b">
                      <div className="relative w-full px-4">
                        <InputUC
                          type="text"
                          name="weight"
                          id="weight"
                          maxLength={3}
                          className="border-0 px-2 w-full text-right py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                          onBlur={formik.handleBlur}
                          value={formik.values.weight}
                          // disabled={typePermission !== "1"}
                          onChange={(e) => {
                            setDelayValue(ValidateService.onHandleNumber(e));
                            formik.values.weight =
                              ValidateService.onHandleNumber(e);
                          }}
                        />
                      </div>
                    </div>
                    <div className="w-full lg:w-1/12 px-4 margin-auto-t-b ">
                      <LabelUC label="กิโลกรัม" />
                    </div>
                  </div>
                  {/* รายละเอียด */}
                  <div className="flex flex-wrap mt-4">
                    <div className="w-full lg:w-2/12 px-4 margin-auto-t-b ">
                      <LabelUC label="รายละเอียด" />
                    </div>
                    <div className="w-full lg:w-8/12 margin-auto-t-b">
                      <div className="relative w-full px-4">
                        <TextAreaUC
                          rows={10}
                          name="description"
                          onBlur={formik.handleBlur}
                          value={formik.values.description}
                          maxLength={255}
                          onChange={(e) => {
                            formik.handleChange(e);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  {/* รายละเอียดโปรโมชั่น */}
                  <div className="flex flex-wrap mt-4">
                    <div className="w-full lg:w-2/12 px-4 margin-auto-t-b ">
                      <LabelUC label="รายละเอียดโปรโมชั่น" />
                    </div>
                    <div className="w-full lg:w-8/12 margin-auto-t-b">
                      <div className="relative w-full px-4">
                        <TextAreaUC
                          rows={10}
                          name="descriptionPromotion"
                          onBlur={formik.handleBlur}
                          value={formik.values.descriptionPromotion}
                          onChange={(e) => {
                            formik.handleChange(e);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  {/* FLASH SALE */}
                  <div className="flex flex-wrap mt-4">
                    <div className="w-full lg:w-2/12 px-4 margin-auto-t-b ">
                      <LabelUC label="FLASH SALE" isRequired={true} />
                    </div>
                    <div className="w-full lg:w-6/12 margin-auto-t-b">
                      <div className="relative w-full px-4">
                        <Switch
                          uncheckedIcon={false}
                          checkedIcon={false}
                          onChange={(value) => {
                            // if(value){
                            //   formik.setFieldValue('startDateCampaign',moment(
                            //     new Date(),
                            //     "DD/MM/YYYY"
                            //   ));
                            //   formik.setFieldValue('endDateCampaign',moment(
                            //     new Date(),
                            //     "DD/MM/YYYY"
                            //   ));
                            //   formik.setFieldValue('startTimeCampaign',"");
                            //   formik.setFieldValue('endTimeCampaign',"");
                            //   formik.setFieldValue("isFlashSale", value);
                            // } else {
                            //   formik.setFieldValue('startDateCampaign',"");
                            //   formik.setFieldValue('endDateCampaign',"");
                            //   formik.setFieldValue('startTimeCampaign',"");
                            //   formik.setFieldValue('endTimeCampaign',"");
                            //   formik.setFieldValue("isFlashSale", value);
                            // }
                            formik.setFieldValue("isFlashSale", value);
                            formik.setFieldValue("salepercent", "");
                            formik.setFieldValue("saleDiscount", "");
                          }}
                          checked={formik.values.isFlashSale}
                        />
                      </div>
                    </div>
                  </div>
                  {/* ระยะเวลาแคมเปญ */}
                  <div className="flex flex-wrap mt-4">
                    <div className="w-full lg:w-2/12 px-4 margin-auto-t-b ">
                      <LabelUC label="ระยะเวลาแคมเปญ" />
                    </div>
                    <div className="w-full lg:w-2/12 margin-auto-t-b">
                      <div className="relative w-full px-4">
                        <DatePickerUC
                          disabled={!formik.values.isFlashSale}
                          onChange={(e) => {
                            formik.setFieldValue(
                              "startDateCampaign",
                              moment(e).toDate(),
                              false
                            );
                          }}
                          value={
                            formik.values.startDateCampaign
                              ? moment(
                                  new Date(formik.values.startDateCampaign),
                                  "DD/MM/YYYY"
                                )
                              : null
                          }
                        />
                      </div>
                    </div>
                    <div className="w-full lg:w-1/12 px-4 margin-auto-t-b">
                      <LabelUC label="ถึง" moreClassName=" text-center" />
                    </div>
                    <div className="w-full lg:w-2/12 margin-auto-t-b">
                      <div className="relative w-full px-4">
                        <DatePickerUC
                          disabled={!formik.values.isFlashSale}
                          onChange={(e) => {
                            formik.setFieldValue(
                              "endDateCampaign",
                              moment(e).toDate(),
                              false
                            );
                          }}
                          value={
                            formik.values.endDateCampaign
                              ? moment(
                                  new Date(formik.values.endDateCampaign),
                                  "DD/MM/YYYY"
                                )
                              : null
                          }
                        />
                      </div>
                    </div>
                  </div>
                  {/*  ช่วงเวลาแคมเปญ */}
                  <div className="flex flex-wrap mt-4">
                    <div className="w-full lg:w-2/12 px-4 margin-auto-t-b ">
                      <LabelUC label="ช่วงเวลาแคมเปญ" />
                    </div>
                    <div className="w-full lg:w-2/12 margin-auto-t-b">
                      <div className="relative w-full px-4">
                        {/* <InputUC
                          disabled={!formik.values.isFlashSale}
                          type="time"
                          name="startTimeCampaign"
                          maxLength={10}
                          onBlur={formik.handleBlur}
                          value={formik.values.startTimeCampaign}
                          // disabled={typePermission !== "1"}
                          onChange={(e) => {
                            formik.handleChange(e);
                          }}
                        /> */}
                        <TimePicker
                          className={
                            "time-picker-input w-full " +
                            (formik.values.startTimeCampaign == null ||
                            formik.values.startTimeCampaign == "" ||
                            formik.values.startTimeCampaign == undefined
                              ? "hidtext"
                              : "")
                          }
                          value={
                            formik.values.startTimeCampaign == null
                              ? ""
                              : moment(
                                  new Date(
                                    "1990-01-01 " +
                                      formik.values.startTimeCampaign
                                  )
                                )
                          }
                          format={"HH:mm:ss"}
                          use12Hours={false}
                          disabled={!formik.values.isFlashSale}
                          onChange={(e) => {
                            if (e == null) {
                              formik.handleChange({
                                target: {
                                  name: "startTimeCampaign",
                                  value: "",
                                },
                              });
                              formik.handleChange({
                                target: {
                                  name: "endTimeCampaign",
                                  value: "",
                                },
                              });
                            } else {
                              formik.handleChange({
                                target: {
                                  name: "startTimeCampaign",
                                  value: moment(e).format("HH:mm:ss"),
                                },
                              });
                              if (formik.values.endTimeCampaign != null) {
                                let start = moment(e);
                                let end = moment(
                                  new Date(
                                    "1990-01-01 " +
                                      formik.values.endTimeCampaign
                                  )
                                );
                                if (start > end) {
                                  formik.handleChange({
                                    target: {
                                      name: "endTimeCampaign",
                                      value: moment(e)
                                        .add(1, "seconds")
                                        .format("HH:mm:ss"),
                                    },
                                  });
                                }
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="w-full lg:w-1/12 px-4 margin-auto-t-b">
                      <LabelUC label="ถึง" moreClassName=" text-center" />
                    </div>
                    <div className="w-full lg:w-2/12 margin-auto-t-b">
                      <div className="relative w-full px-4">
                        {/* <InputUC
                          disabled={!formik.values.isFlashSale}
                          type="time"
                          name="endTimeCampaign"
                          maxLength={10}
                          onBlur={formik.handleBlur}
                          value={formik.values.endTimeCampaign}
                          // disabled={typePermission !== "1"}
                          onChange={(e) => {
                            formik.handleChange(e);
                          }}
                        /> */}
                        <TimePicker
                          className={
                            "time-picker-input w-full " +
                            (formik.values.endTimeCampaign == null ||
                            formik.values.endTimeCampaign == "" ||
                            formik.values.endTimeCampaign == undefined
                              ? "hidtext"
                              : "")
                          }
                          value={
                            formik.values.endTimeCampaign == null
                              ? ""
                              : moment(
                                  new Date(
                                    "1990-01-01 " +
                                      formik.values.endTimeCampaign
                                  )
                                )
                          }
                          format={"HH:mm:ss"}
                          use12Hours={false}
                          disabled={!formik.values.isFlashSale}
                          onChange={(e) => {
                            if (e == null) {
                              formik.handleChange({
                                target: {
                                  name: "endTimeCampaign",
                                  value: "",
                                },
                              });
                            } else {
                              formik.handleChange({
                                target: {
                                  name: "endTimeCampaign",
                                  value: moment(e).format("HH:mm:ss"),
                                },
                              });
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap mt-4">
                    <div className="w-full lg:w-2/12 px-4 margin-auto-t-b ">
                      <LabelUC label="ราคา" />
                      <div className="relative w-full px-4"></div>
                    </div>
                    <div className="w-full lg:w-2/12 margin-auto-t-b">
                      <div className="relative w-full px-4">
                        <InputUC
                          type="text"
                          className="border-0 px-2 w-full text-right py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                          id="saleDiscount"
                          name="saleDiscount"
                          onBlur={formik.handleBlur}
                          value={formik.values.saleDiscount}
                          disabled={!formik.values.isFlashSale}
                          onChange={(e) => {
                            var start = e.target.selectionStart;
                            setDelayValue(
                              ValidateService.onHandleDecimalChange(e)
                            );
                            formik.values.saleDiscount =
                              ValidateService.onHandleDecimalChange(e);
                            if (
                              formik.values.saleDiscount !== "" &&
                              formik.values.price !== ""
                            ) {
                              if (
                                parseInt(formik.values.saleDiscount) >
                                parseInt(formik.values.price)
                              ) {
                                formik.values.saleDiscount =
                                  formik.values.price;
                              }
                            }
                            e.target.setSelectionRange(start, start);
                            calculateSaleValue(
                              formik.values.saleDiscount,
                              "discount"
                            );
                          }}
                        />
                      </div>
                      <div className="relative w-full px-4">
                        {formik.touched.saleDiscount &&
                        formik.errors.saleDiscount ? (
                          <div className="text-sm py-2 px-2  text-red-500">
                            {formik.errors.saleDiscount}
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="w-full lg:w-1/12 px-4 margin-auto-t-b flex justify-between">
                      <LabelUC label="บาท" />
                      <div className="relative w-full px-4">
                        {formik.touched.saleDiscount &&
                        formik.errors.saleDiscount ? (
                          <div className="text-sm py-2 px-2  text-red-500">
                            &nbsp;
                          </div>
                        ) : null}
                      </div>
                    </div>
                    {/* ส่วนลด */}
                    <div className="w-full lg:w-1/12 margin-auto-t-b">
                      <div className="relative w-full px-4">
                        <InputUC
                          type="text"
                          className="border-0 px-2 w-full text-right py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                          id="salePercent"
                          name="salePercent"
                          onBlur={formik.handleBlur}
                          value={formik.values.salePercent}
                          disabled={!formik.values.isFlashSale}
                          onChange={(e) => {
                            var start = e.target.selectionStart;
                            if (
                              ValidateService.onHandleDecimalChange(e) > 100.0
                            )
                              e.target.value = 100;
                            setDelayValue(
                              ValidateService.onHandleDecimalChange(e)
                            );
                            formik.values.salePercent =
                              ValidateService.onHandleDecimalChange(e);
                            if (
                              formik.values.salePercent !== "" &&
                              formik.values.price !== ""
                            ) {
                              if (
                                parseInt(formik.values.salePercent) >
                                parseInt(formik.values.price)
                              ) {
                                formik.values.salePercent = formik.values.price;
                              }
                            }
                            e.target.setSelectionRange(start, start);
                            calculateSaleValue(
                              formik.values.salePercent,
                              "percent"
                            );
                          }}
                        />
                      </div>
                      <div className="relative w-full px-4">
                        {formik.touched.discount && formik.errors.discount ? (
                          <div className="text-sm py-2 px-2  text-red-500">
                            &nbsp;
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="w-full lg:w-1/12 pl-4 margin-auto-t-b ">
                      <LabelUC label="เปอร์เซ็นต์" />
                      <div className="relative w-full px-4">
                        {formik.touched.discount && formik.errors.discount ? (
                          <div className="text-sm py-2 px-2  text-red-500">
                            &nbsp;
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap mt-4 ">
                    <div className="w-full lg:w-2/12 px-4 margin-auto-t-b ">
                      <LabelUC label="" />
                    </div>
                    <div className="w-full lg:w-6/12 margin-auto-t-b">
                      <div className="relative w-full px-4">
                        <Radio.Group
                          options={inactiveList}
                          onChange={(e) => {
                            formik.setFieldValue("isInactive", e.target.value);
                          }}
                          value={formik.values.isInactive}
                        />
                      </div>
                    </div>
                  </div>
                  <ButtonUCSaveModal />
                </div>
              </div>
            </form>
          </div>
        </div>
      </Modal>
      <Categorylist
        listCategory={productCategoryList}
        setProductCategoryList={setProductCategoryList}
        showModal={openCategory}
        hideModal={() => setOpenCategory(false)}
      />
    </>
  );
};

export default StockInfo;
