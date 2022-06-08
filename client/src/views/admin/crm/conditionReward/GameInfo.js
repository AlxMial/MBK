import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import {
  customStyles,
  customStylesMobile,
} from "assets/styles/theme/ReactModal";
import LabelUC from "components/LabelUC";
import useWindowDimensions from "services/useWindowDimensions";
import ValidateService from "services/validateValue";
import FilesService from "services/files";
import SelectUC from "components/SelectUC";
import ProfilePictureUC from "components/ProfilePictureUC";
import InputUC from "components/InputUC";
import moment from "moment";
import DatePickerUC from "components/DatePickerUC";
import CheckBoxUC from "components/CheckBoxUC";
import TextAreaUC from "components/InputUC/TextAreaUC";
import { useFormik } from "formik";
import * as Yup from "yup";

const GameInfo = ({
  open,
  handleModal,
  name,
  modalData,
  handleSubmitModal,
}) => {
  Modal.setAppElement("#root");
  const useStyle = customStyles();
  const useStyleMobile = customStylesMobile();
  const [data, setData] = useState(modalData);
  const { width } = useWindowDimensions();
  const [isClick, setIsClick] = useState(false);
  const [delay, setDelay] = useState();
  const formikCoupon = useFormik({
    initialValues: {
      id: "",
      rewardType: "",
      pictureCoupon: "",
      couponName: "",
      discount: 0,
      discountType: "1",
      startDate: new Date(),
      isNotExpired: false,
      expiredDate: new Date(),
      couponCount: 0,
      isNoLimitPerDayCount: false,
      usedPerDayCount: 0,
      description: "",
      isSelect: false,
      isCancel: false,
      isDeleted: false,
      addBy: "",
      updateBy: "",
    },
    validationSchema: Yup.object({
      couponName: Yup.string().required("* กรุณากรอก ชื่อคูปอง"),
      couponCount: Yup.number()
        .required("* กรุณากรอก จำนวนคูปอง")
        .test(
          "Is positive?",
          "* จำนวนคูปองต้องมากกว่า 0",
          (value) => value > 0
        ),
      discount: Yup.number()
        .required("* กรุณากรอก ส่วนลด")
        .test(
          "Is positive?",
          "* จำนวนคูปองต้องมากกว่า 0",
          (value) => value > 0
        ),
      pictureCoupon: Yup.string().required("* กรุณาเลือก รูปคูปอง"),
    }),
    onSubmit: (values) => {
      if (formikCoupon.isValid) {
        formikCoupon.values.rewardType = data.rewardType;
        onValidate(values);
      }
    },
  });

  const formikProduct = useFormik({
    initialValues: {
      id: "",
      rewardType: "",
      pictureProduct: "",
      productName: "",
      rewardCount: 0,
      isNoLimitReward: false,
      description: "",
      isSelect: false,
      isDeleted: false,
      addBy: "",
      updateBy: "",
    },
    validationSchema: Yup.object({
      productName: Yup.string().required("* กรุณากรอก ชื่อสินค้าสัมนาคุณ"),
      rewardCount: Yup.number()
        .required("* กรุณากรอก จำนวนสูงสุด")
        .test(
          "Is positive?",
          "* จำนวนสูงสุดต้องมากกว่า 0",
          (value) => value > 0
        ),
      pictureProduct: Yup.string().required("* กรุณาเลือก รูปสินค้าสัมนาคุณ"),
    }),
    onSubmit: (values) => {
      if (formikProduct.isValid) {
        formikProduct.values.rewardType = data.rewardType;
        onValidate(values);
      }
    },
  });

  const discountType = [
    { value: "1", label: "บาท" },
    { value: "2", label: "%" },
  ];

  const rewardType = [
    { value: "1", label: "E-Coupon" },
    { value: "2", label: "สินค้า" },
  ];

  useEffect(() => {
    setData((prevState) => {
      return {
        ...prevState,
        rewardType:
          prevState.rewardType === undefined ? "1" : prevState.rewardType,
        startDate:
          prevState.startDate === undefined ? new Date() : prevState.startDate,
      };
    });
    fetchData();
  }, []);

  const handleSeletectImage = async (e) => {
    const image = document.getElementById("eProductImage");
    image.src = URL.createObjectURL(e.target.files[0]);
    const base64 = await FilesService.convertToBase64(e.target.files[0]);
    formikProduct.setFieldValue("pictureProduct", base64);
    // setData((prevState) => {
    //   return {
    //     ...prevState,
    //     pictureProduct: base64,
    //   };
    // });
  };

  const handleChangeImage = async (e) => {
    const image = document.getElementById("eCouponImage");
    image.src = URL.createObjectURL(e.target.files[0]);
    const base64 = await FilesService.convertToBase64(e.target.files[0]);
    formikCoupon.setFieldValue("pictureCoupon", base64);
    // setData((prevState) => {
    //   return {
    //     ...prevState,
    //     pictureCoupon: base64,
    //   };
    // });
  };

  const fetchData = async () => {
    console.log(data);
    for (var columns in data) {
      if (data.rewardType === "1") {
        if (data[columns] === null) {
          formikCoupon.setFieldValue(columns, "", false);
        } else {
          formikCoupon.setFieldValue(columns, data[columns], false);
        }
      } else {
        if (data[columns] === null) {
          formikProduct.setFieldValue(columns, "", false);
        } else {
          formikProduct.setFieldValue(columns, data[columns], false);
        }
      }
    }
  };

  const onValidate = (data) => {
    handleSubmitModal(data);
  };

  return (
    <Modal
      isOpen={open}
      onRequestClose={handleModal}
      style={width <= 1180 ? useStyleMobile : useStyle}
      contentLabel="Example Modal"
      shouldCloseOnOverlayClick={false}
    >
      <div className="flex flex-wrap">
        <div className="w-full flex-auto mt-2">
          <form>
            <div className=" flex justify-between align-middle ">
              <div className=" align-middle  mb-3">
                <div className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-base text-green-mbk font-bold whitespace-nowrap p-4">
                  <label>เพิ่มของสัมนาคุณ</label>
                </div>
              </div>
              <div className="  text-right align-middle  mb-3">
                <div className=" border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm text-red-500 font-bold whitespace-nowrap p-4">
                  <label
                    className="cursor-pointer"
                    onClick={() => {
                      handleModal();
                    }}
                  >
                    X
                  </label>
                </div>
              </div>
            </div>
            <div
              className="flex flex-wrap px-24 py-4 justify-center"
              style={{ height: "100%", overflowY: "auto" }}
            >
              <div className="w-full lg:w-1/12 margin-auto-t-b ">
                <LabelUC label="ประเภท" isRequired={true} />
              </div>
              <div className="w-full  lg:w-11/12 px-4 margin-auto-t-b ">
                <SelectUC
                  name="rewardType"
                  value={ValidateService.defaultValue(
                    rewardType,
                    data.rewardType
                  )}
                  onChange={(value) => {
                    setData((prevState) => {
                      return {
                        ...prevState,
                        rewardType: value.value,
                      };
                    });
                  }}
                  options={rewardType}
                />
              </div>
              <div className="w-full">&nbsp;</div>
              <div
                className={
                  "w-full lg:w-1/12 margin-auto-t-b" +
                  (data.rewardType === "2" ? " hidden" : " ")
                }
              >
                <div className="relative w-full">
                  <LabelUC label="รูปคูปอง" isRequired={true} />
                  {formikCoupon.touched.pictureCoupon &&
                  formikCoupon.errors.pictureCoupon ? (
                    <div className="text-sm py-2 px-2 text-red-500">&nbsp;</div>
                  ) : null}
                </div>
              </div>
              <div
                className={
                  "w-full lg:w-11/12 margin-auto-t-b" +
                  (data.rewardType === "2" ? " hidden" : " ")
                }
              >
                <div className="relative w-full px-4">
                  <ProfilePictureUC
                    id="eCouponImage"
                    hoverText="เลือกรูปภาพคูปอง"
                    onChange={handleChangeImage}
                    src={formikCoupon.values.pictureCoupon}
                  />

                  {formikCoupon.touched.pictureCoupon &&
                  formikCoupon.errors.pictureCoupon ? (
                    <div className="text-sm py-2 px-2  text-red-500">
                      {formikCoupon.errors.pictureCoupon}
                    </div>
                  ) : (
                    <div className="w-full">&nbsp;</div>
                  )}
                </div>
              </div>
              <div
                className={
                  "w-full lg:w-1/12 margin-auto-t-b" +
                  (data.rewardType === "2" ? " hidden" : " ")
                }
              >
                <div className="relative w-full">
                  <LabelUC label="ชื่อคูปอง" isRequired={true} />
                  {formikCoupon.touched.couponName &&
                  formikCoupon.errors.couponName ? (
                    <div className="text-sm py-2 px-2  text-red-500">
                      &nbsp;
                    </div>
                  ) : null}
                </div>
              </div>
              <div
                className={
                  "w-full lg:w-11/12 margin-auto-t-b" +
                  (data.rewardType === "2" ? " hidden" : " ")
                }
              >
                <div className="relative w-full px-4">
                  <InputUC
                    name="couponName"
                    type="text"
                    maxLength={255}
                    onBlur={formikCoupon.handleBlur}
                    value={formikCoupon.values.couponName}
                    onChange={(e) => {
                      formikCoupon.handleChange(e);
                    }}
                  />
                  {formikCoupon.touched.couponName &&
                  formikCoupon.errors.couponName ? (
                    <div className="text-sm py-2 px-2  text-red-500">
                      {formikCoupon.errors.couponName}
                    </div>
                  ) : (
                    <div className="w-full">&nbsp;</div>
                  )}
                </div>
              </div>
              <div
                className={
                  "w-full lg:w-1/12 margin-auto-t-b" +
                  (data.rewardType === "2" ? " hidden" : " ")
                }
              >
                <div className="relative w-full">
                  <LabelUC label="ส่วนลด" isRequired={true} />
                  {formikCoupon.touched.discount &&
                  formikCoupon.errors.discount ? (
                    <div className="text-sm py-2 px-2  text-red-500">
                      &nbsp;
                    </div>
                  ) : null}
                </div>
              </div>
              <div
                className={
                  "w-full lg:w-5/12 margin-auto-t-b" +
                  (data.rewardType === "2" ? " hidden" : " ")
                }
              >
                <div className="relative flex justify-between px-4">
                  <InputUC
                    name="discount"
                    type="text"
                    maxLength={7}
                    onBlur={formikCoupon.handleBlur}
                    value={formikCoupon.values.discount}
                    onChange={(e) => {
                      setDelay(ValidateService.onHandleNumber(e));
                      formikCoupon.values.discount =
                        ValidateService.onHandleNumber(e);
                    }}
                    min="0"
                  />
                  <span className="margin-auto-t-b font-bold ml-2 widthDigi">
                    <SelectUC
                      options={discountType}
                      name="discountType"
                      onChange={(value) => {
                        formikCoupon.setFieldValue("discountType", value.value);
                      }}
                      value={ValidateService.defaultValue(
                        discountType,
                        formikCoupon.values.discountType
                      )}
                    />
                  </span>
                </div>
                <div className="w-full px-4">
                  {formikCoupon.touched.discount &&
                  formikCoupon.errors.discount ? (
                    <div className="text-sm py-2 px-2  text-red-500">
                      {formikCoupon.errors.discount}
                    </div>
                  ) : (
                    <div className="w-full">&nbsp;</div>
                  )}
                </div>
              </div>
              <div
                className={
                  "w-full lg:w-1/12 margin-auto-t-b" +
                  (data.rewardType === "2" ? " hidden" : " ")
                }
              >
                &nbsp;
              </div>
              <div
                className={
                  "w-full lg:w-5/12 margin-auto-t-b" +
                  (data.rewardType === "2" ? " hidden" : " ")
                }
              >
                &nbsp;
              </div>
              {/* <div className="w-full">&nbsp;</div> */}
              <div
                className={
                  "w-full lg:w-1/12 margin-auto-t-b " +
                  (data.rewardType === "2" ? " hidden" : " ")
                }
              >
                <LabelUC label="วันที่เริ่มใช้คูปอง" isRequired={true} />
                <div className="text-sm py-2 px-2  text-red-500">&nbsp;</div>
              </div>
              <div
                className={
                  "w-full lg:w-5/12 px-4 margin-auto-t-b" +
                  (data.rewardType === "2" ? " hidden" : " ")
                }
              >
                <div className="relative">
                  <DatePickerUC
                    onClick={(e) => {
                      setIsClick({ ...isClick, couponStart: true });
                    }}
                    onBlur={(e) => {
                      setIsClick({ ...isClick, couponStart: false });
                    }}
                    onChange={(e) => {
                      setIsClick({ ...isClick, couponStart: false });
                      if (e === null) {
                        formikCoupon.setFieldValue(
                          "startDate",
                          new Date(),
                          false
                        );
                      } else {
                        formikCoupon.setFieldValue(
                          "startDate",
                          moment(e).toDate(),
                          false
                        );
                      }
                    }}
                    value={
                      !isClick.couponStart
                        ? moment(
                            new Date(formikCoupon.values.startDate),
                            "DD/MM/YYYY"
                          )
                        : null
                    }
                  />
                  <div className="text-sm py-2 px-2  text-red-500">&nbsp;</div>
                </div>
              </div>
              <div
                className={
                  "w-full" +
                  (width < 764 ? " block" : " hidden") +
                  (data.rewardType === "2" ? " hidden" : " ")
                }
              >
                &nbsp;
              </div>
              <div
                className={
                  "w-full lg:w-1/12 px-4 margin-auto-t-b " +
                  (data.rewardType === "2" ? " hidden" : " ")
                }
              >
                <LabelUC label="วันที่หมดอายุ" isRequired={true} />
                <div className="text-sm py-2 px-2  text-red-500">&nbsp;</div>
              </div>
              <div
                className={
                  "w-full lg:w-5/12 px-4 margin-auto-t-b" +
                  (data.rewardType === "2" ? " hidden" : " ")
                }
              >
                <div className="relative">
                  <DatePickerUC
                    placeholder={
                      formikCoupon.values.isNotExpired
                        ? "ไม่มีวันหมดอายุ"
                        : "เลือกวันที่"
                    }
                    disabledValue={
                      formikCoupon.values.isNotExpired ? true : false
                    }
                    disabled={formikCoupon.values.isNotExpired ? true : false}
                    onClick={(e) => {
                      setIsClick({
                        ...isClick,
                        expireDate: formikCoupon.values.isNotExpired
                          ? false
                          : true,
                      });
                      //   setIsClick({ ...isClick, expireDate: true });
                    }}
                    onBlur={(e) => {
                      setIsClick({ ...isClick, expireDate: false });
                    }}
                    onChange={(e) => {
                      setIsClick({ ...isClick, expireDate: false });
                      if (e === null) {
                        formikCoupon.setFieldValue(
                          "expiredDate",
                          new Date(),
                          false
                        );
                      } else {
                        formikCoupon.setFieldValue(
                          "expiredDate",
                          moment(e).toDate(),
                          false
                        );
                      }
                    }}
                    value={
                      !isClick.expireDate
                        ? moment(
                            new Date(
                              formikCoupon.values.expiredDate
                                ? formikCoupon.values.expiredDate
                                : new Date()
                            ),
                            "DD/MM/YYYY"
                          )
                        : null
                    }
                  />
                  <CheckBoxUC
                    text="ไม่มีวันหมดอายุ"
                    name="isNotExpired"
                    onChange={formikCoupon.handleChange}
                    onBlur={formikCoupon.handleBlur}
                    checked={formikCoupon.values.isNotExpired}
                    classLabel="mt-2"
                  />
                </div>
              </div>
              <div
                className={
                  "w-full" + (data.rewardType === "2" ? " hidden" : " ")
                }
              >
                &nbsp;
              </div>
              <div
                className={
                  "w-full lg:w-1/12  margin-auto-t-b " +
                  (data.rewardType === "2" ? " hidden" : " ")
                }
              >
                <LabelUC label="จำนวนคูปอง" isRequired={true} />
                {formikCoupon.touched.couponCount &&
                formikCoupon.errors.couponCount ? (
                  <div className="text-sm py-2 px-2  text-red-500">&nbsp;</div>
                ) : null}
              </div>
              <div
                className={
                  "w-full lg:w-5/12 px-4 margin-auto-t-b" +
                  (data.rewardType === "2" ? " hidden" : " ")
                }
              >
                <div className="relative">
                  <InputUC
                    name="couponCount"
                    type="text"
                    maxLength={7}
                    onBlur={formikCoupon.handleBlur}
                    value={formikCoupon.values.couponCount}
                    onChange={(e) => {
                      //   formik.handleChange(e);
                      setDelay(ValidateService.onHandleNumber(e));
                      formikCoupon.values.couponCount =
                        ValidateService.onHandleNumber(e);
                    }}
                    min="0"
                  />
                  {formikCoupon.touched.couponCount &&
                  formikCoupon.errors.couponCount ? (
                    <div className="text-sm py-2 px-2  text-red-500">
                      {formikCoupon.errors.couponCount}
                    </div>
                  ) : (
                    <div className="w-full">&nbsp;</div>
                  )}
                </div>
              </div>
              <div
                className={
                  "w-full" +
                  (width < 764 ? " block" : " hidden") +
                  (data.rewardType === "2" ? " hidden" : " ")
                }
              >
                &nbsp;
              </div>
              <div
                className={
                  "w-full lg:w-1/12 px-4 margin-auto-t-b " +
                  (data.rewardType === "2" ? " hidden" : " ")
                }
              >
                <LabelUC label="จำนวนที่ใช้แลกต่อวัน" isRequired={false} />
                {formikCoupon.touched.couponCount &&
                formikCoupon.errors.couponCount ? (
                  <div className="text-sm py-2 px-2  text-red-500">&nbsp;</div>
                ) : null}
              </div>
              <div
                className={
                  "w-full lg:w-5/12 px-4 margin-auto-t-b" +
                  (data.rewardType === "2" ? " hidden" : " ")
                }
              >
                <div className="relative">
                  <InputUC
                    name="usedPerDayCount"
                    type="text"
                    maxLength={7}
                    onBlur={formikCoupon.handleBlur}
                    value={formikCoupon.values.usedPerDayCount}
                    onChange={(e) => {
                      setDelay(ValidateService.onHandleNumber(e));
                      formikCoupon.values.usedPerDayCount =
                        ValidateService.onHandleNumber(e);
                    }}
                    min="0"
                  />
                  {formikCoupon.touched.couponCount &&
                  formikCoupon.errors.couponCount ? (
                    <div className="text-sm py-2 px-2  text-red-500">
                      &nbsp;
                    </div>
                  ) : (
                    <div className="w-full">&nbsp;</div>
                  )}
                </div>
              </div>
              {/* 
              <div className="w-full">&nbsp;</div> */}
              <div
                className={
                  "w-full lg:w-1/12 margin-auto-t-b " +
                  (data.rewardType === "2" ? " hidden" : " ")
                }
              >
                <LabelUC label="รายละเอียดคูปอง" isRequired={false} />
              </div>
              <div
                className={
                  "w-full lg:w-11/12 px-4 margin-auto-t-b" +
                  (data.rewardType === "2" ? " hidden" : " ")
                }
              >
                <div className="relative">
                  <TextAreaUC
                    name="description"
                    onBlur={formikCoupon.handleBlur}
                    value={formikCoupon.values.description}
                    onChange={(e) => {
                      formikCoupon.handleChange(e);
                    }}
                  />
                </div>
              </div>
              <div
                className={
                  "w-full lg:w-1/12 margin-auto-t-b " +
                  (data.rewardType === "2" ? " hidden" : " ")
                }
              ></div>
              <div
                className={
                  "w-full lg:w-11/12 px-4 margin-auto-t-b" +
                  (data.rewardType === "2" ? " hidden" : " ")
                }
              >
                <CheckBoxUC
                  text="ยกเลิกคูปอง"
                  name="isCancel"
                  onChange={formikCoupon.handleChange}
                  onBlur={formikCoupon.handleBlur}
                  checked={formikCoupon.values.isCancel}
                  classLabel="mt-2"
                />
              </div>
              <div
                className={
                  "w-full lg:w-1/12 margin-auto-t-b" +
                  (data.rewardType === "1" ? " hidden" : " ")
                }
              >
                <div className="relative w-full">
                  <LabelUC label="รูปสินค้าสัมนาคุณ" isRequired={true} />
                  {formikProduct.touched.pictureProduct &&
                  formikProduct.errors.pictureProduct ? (
                    <div className="text-sm py-2 px-2 text-red-500">&nbsp;</div>
                  ) : null}
                </div>
              </div>
              <div
                className={
                  "w-full lg:w-11/12 margin-auto-t-b" +
                  (data.rewardType === "1" ? " hidden" : " ")
                }
              >
                <div className="relative w-full px-4">
                  <ProfilePictureUC
                    id="eProductImage"
                    hoverText="เลือกรูปสินค้าสัมนาคุณ"
                    onChange={handleSeletectImage}
                    src={formikProduct.values.pictureProduct}
                  />

                  {formikProduct.touched.pictureProduct &&
                  formikProduct.errors.pictureProduct ? (
                    <div className="text-sm py-2 px-2  text-red-500">
                      {formikProduct.errors.pictureProduct}
                    </div>
                  ) : null}
                </div>
              </div>
              <div
                className={
                  "w-full" + (data.rewardType === "1" ? " hidden" : " ")
                }
              >
                &nbsp;
              </div>
              <div
                className={
                  "w-full lg:w-1/12 margin-auto-t-b" +
                  (data.rewardType === "1" ? " hidden" : " ")
                }
              >
                <div className="relative w-full">
                  <LabelUC label="ชื่อสินค้าสัมนาคุณ" isRequired={true} />
                  {formikProduct.touched.productName &&
                  formikProduct.errors.productName ? (
                    <div className="text-sm py-2 px-2  text-red-500">
                      &nbsp;
                    </div>
                  ) : null}
                </div>
              </div>
              <div
                className={
                  "w-full lg:w-11/12 margin-auto-t-b" +
                  (data.rewardType === "1" ? " hidden" : " ")
                }
              >
                <div className="relative w-full px-4">
                  <InputUC
                    name="productName"
                    type="text"
                    maxLength={255}
                    onBlur={formikProduct.handleBlur}
                    value={formikProduct.values.productName}
                    onChange={(e) => {
                      formikProduct.handleChange(e);
                    }}
                  />
                  {formikProduct.touched.productName &&
                  formikProduct.errors.productName ? (
                    <div className="text-sm py-2 px-2  text-red-500">
                      {formikProduct.errors.productName}
                    </div>
                  ) : null}
                </div>
              </div>

              <div
                className={
                  "w-full " +
                  (formikProduct.touched.productName &&
                  formikProduct.errors.productName
                    ? " hidden"
                    : "") +
                  (data.rewardType === "1" ? " hidden" : " ")
                }
              >
                &nbsp;
              </div>
              <div
                className={
                  "w-full lg:w-1/12 margin-auto-t-b " +
                  (data.rewardType === "1" ? " hidden" : " ")
                }
              >
                <LabelUC label="จำนวนสูงสุด" isRequired={true} />
                <div className="text-sm py-2 px-2  text-red-500">&nbsp;</div>
                {formikProduct.touched.couponCount &&
                formikProduct.errors.couponCount ? (
                  <div className="text-sm py-2 px-2  text-red-500">&nbsp;</div>
                ) : null}
              </div>
              <div
                className={
                  "w-full lg:w-5/12 px-4 margin-auto-t-b" +
                  (data.rewardType === "1" ? " hidden" : " ")
                }
              >
                <div className="relative flex">
                  <InputUC
                    name="rewardCount"
                    type="text"
                    maxLength={7}
                    onBlur={formikProduct.handleBlur}
                    value={
                      !formikProduct.values.isNoLimitReward
                        ? formikProduct.values.rewardCount
                        : "ไม่จำกัด"
                    }
                    onChange={(e) => {
                      setDelay(ValidateService.onHandleNumber(e));
                      formikProduct.values.rewardCount =
                        ValidateService.onHandleNumber(e);
                    }}
                    disabled={
                      formikProduct.values.isNoLimitReward ? true : false
                    }
                    min="0"
                  />
                  <span
                    className="margin-auto-t-b font-bold"
                    style={{ marginLeft: width < 764 ? "1rem" : "2rem" }}
                  >
                    ชิ้น
                  </span>
                </div>
                <div className="relative">
                  <CheckBoxUC
                    text="ไม่มีวันหมดอายุ"
                    name="isNoLimitReward"
                    onChange={formikProduct.handleChange}
                    onBlur={formikProduct.handleBlur}
                    checked={formikProduct.values.isNoLimitReward}
                    classLabel="mt-2"
                  />
                </div>
              </div>
              <div
                className={
                  "w-full lg:w-1/12 margin-auto-t-b " +
                  (data.rewardType === "1" ? " hidden" : " ")
                }
              >
                &nbsp;
              </div>
              <div
                className={
                  "w-full lg:w-5/12 px-4 margin-auto-t-b" +
                  (data.rewardType === "1" ? " hidden" : " ")
                }
              >
                &nbsp;
              </div>
              <div
                className={
                  "w-full lg:w-1/12 margin-auto-t-b " +
                  (data.rewardType === "1" ? " hidden" : " ")
                }
              ></div>
              <div
                className={
                  "w-full lg:w-11/12 px-4 margin-auto-t-b" +
                  (data.rewardType === "1" ? " hidden" : " ")
                }
              >
                <div className="relative">
                  {formikProduct.touched.rewardCount &&
                  formikProduct.errors.rewardCount ? (
                    <div className="text-sm py-2 px-2  text-red-500">
                      {formikProduct.errors.rewardCount}
                    </div>
                  ) : (
                    <div>&nbsp;</div>
                  )}
                </div>
              </div>
              <div
                className={
                  "w-full lg:w-1/12 margin-auto-t-b " +
                  (data.rewardType === "1" ? " hidden" : " ")
                }
              >
                <LabelUC label="รายละเอียดคูปอง" isRequired={false} />
              </div>
              <div
                className={
                  "w-full lg:w-11/12 px-4 margin-auto-t-b" +
                  (data.rewardType === "1" ? " hidden" : " ")
                }
              >
                <div className="relative">
                  <TextAreaUC
                    name="description"
                    onBlur={formikProduct.handleBlur}
                    value={formikProduct.values.description}
                    onChange={(e) => {
                      formikProduct.handleChange(e);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="relative w-full mb-3">
              <div className=" flex justify-between align-middle ">
                <div></div>
                <div className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4">
                  <button
                    className={
                      "bg-gold-mbk text-white active:bg-gold-mbk font-bold uppercase text-sm px-2 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                    }
                    type="button"
                    onClick={() => {
                      if (data.rewardType === "1") formikCoupon.handleSubmit();
                      else formikProduct.handleSubmit();
                    }}
                  >
                    บันทึกข้อมูล
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default GameInfo;