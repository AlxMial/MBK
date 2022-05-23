import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import axios from "services/axios";
import { useToasts } from "react-toast-notifications";
/* Service */
import useWindowDimensions from "services/useWindowDimensions";
import ValidateService from "services/validateValue";
import { styleSelect } from "assets/styles/theme/ReactSelect.js";
import * as Storage from "../../../../services/Storage.service";
import "antd/dist/antd.css";
import moment from "moment";
import "moment/locale/th";
import locale from "antd/lib/locale/th_TH";
import { DatePicker, Space, ConfigProvider, Radio } from "antd";
import * as Address from "../../../../services/GetAddress.js";
import useMenu from "services/useMenu";
import { GetPermissionByUserName } from "services/Permission";
import ConfirmEdit from "components/ConfirmDialog/ConfirmEdit";
import InputUC from "components/InputUC";
import LabelUC from "components/LabelUC";
import SelectUC from "components/SelectUC";
import DatePickerUC from "components/DatePickerUC";
import ProfilePictureUC from "components/ProfilePictureUC";
import CheckBoxUC from "components/CheckBoxUC";
import TextAreaUC from "components/InputUC/TextAreaUC";

export default function ConditioRewardInfo() {
  /* Option Select */
  const redemptionType = [
    { value: "1", label: "Standard" },
    { value: "2", label: "Game" },
  ];

  const rewardType = [
    { value: "1", label: "E-Coupon" },
    { value: "2", label: "สินค้า" },
  ];

  /* Service Function */
  const { height, width } = useWindowDimensions();
  const { menu } = useMenu();
  let { id } = useParams();

  /* Set useState */
  const [enableControl, setIsEnableControl] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState(0);
  const [number, setNumber] = useState(0);
  const [isNew, setIsNew] = useState(false);
  const [typePermission, setTypePermission] = useState("");
  const [modalIsOpenEdit, setIsOpenEdit] = useState(false);
  const [isClick, setIsClick] = useState({
    redemptionStart: false,
    redemptionEnd: false,
    couponStart: false,
    couponEnd: false,
    expireDate: false,
  });
  const [isClickEndDate, setIsClickEndDate] = useState(false);
  const [stateDelay, setStateDelay] = useState("");
  const [selectedImage, setSelectedImage] = useState();
  const [isCancel, setIsCancel] = useState(false);
  // const [coupon, setCoupon] = useState({
  //   pictureCoupon: "",
  //   couponName: "",
  //   startDate: new Date(),
  //   endDate: new Date(),
  //   expiredDate: new Date(),
  //   couponCount: 0,
  //   usedPerDayCount: 0,
  //   description: "",
  //   isCancelReclaim: "",
  //   isCancel: "",
  //   isReclaim: "",
  //   isDeleted: false,
  //   isNotExpired: false,
  //   addBy: "",
  //   updateBy: "",
  // });

  let history = useHistory();

  const options = [
    { label: "เปิดการใช้งาน", value: "1" },
    { label: "ปิดการใช้งาน", value: "2" },
  ];

  const { addToast } = useToasts();
  /* Method Condition */
  const OnBack = () => {
    if (formik.dirty > 0) {
      openModalSubject();
    } else {
      history.push("/admin/members");
    }
  };

  function openModalSubject() {
    setIsOpenEdit(true);
  }

  function closeModalSubject() {
    setIsOpenEdit(false);
  }

  const onEditValue = async () => {
    formik.handleSubmit();
    const valueError = JSON.stringify(formik.errors);

    if (valueError.length > 2) setIsOpenEdit(false);
  };

  const onReturn = () => {
    history.push("/admin/members");
  };

  const handleChangeImage = (e) => {
    const image = document.getElementById("eCouponImage");
    image.src = URL.createObjectURL(e.target.files[0]);
    formikCoupon.setFieldValue("pictureCoupon", e.target.files[0]);
    // setCoupon((prevState) => {
    //   return {
    //     ...prevState,
    //     pictureCoupon: e.target.files[0],
    //   };
    // });
    // //setSelectedImage(e.target.files[0]);
  };

  /* Form insert value */
  const formik = useFormik({
    initialValues: {
      id: "",
      redemptionName: "",
      redemptionType: "",
      rewardType: "",
      points: 0,
      startDate: new Date(),
      endDate: new Date(),
      rewardGameCount: 0,
      isNotLimitRewardGame: false,
      description: "",
      isDeleted: false,
      addBy: "",
      updateBy: "",
    },
    validationSchema: Yup.object({
      redemptionName: Yup.string().required(
        Storage.GetLanguage() === "th"
          ? "* กรุณากรอก ชื่อเงื่อนไขการแลกรางวัล"
          : "* Please enter your Member Card"
      ),
      points: Yup.number()
        .required(
          Storage.GetLanguage() === "th"
            ? "* กรุณากรอก จำนวนคะแนน"
            : "* Please enter your Member Card"
        )
        .test(
          "Is positive?",
          "* จำนวนคะแนนต้องมากกว่า 0",
          (value) => value > 0
        ),
    }),
    onSubmit: (values) => {
      if (formikCoupon.isValid) {
        console.log(values)
      }
    },
  });

  const formikCoupon = useFormik({
    initialValues: {
      id: "",
      pictureCoupon: "",
      couponName: "",
      startDate: new Date(),
      endDate: new Date(),
      expiredDate: new Date(),
      couponCount: 0,
      usedPerDayCount: 0,
      description: "",
      isCancelReclaim: "",
      isCancel: "",
      isReclaim: "",
      isDeleted: false,
      isNotExpired: false,
      addBy: "",
      updateBy: "",
    },
    validationSchema: Yup.object({
      couponName: Yup.string().required("* กรุณากรอก ชื่อคูปอง"),
      couponCount: Yup.number().required("* กรุณากรอก จำนวนคูปอง").test(
        "Is positive?",
        "* จำนวนคูปองต้องมากกว่า 0",
        (value) => value > 0
      ),
      pictureCoupon: Yup.string().required("* กรุณาเลือก รูปคูปอง"),
    }),
  });

  async function fetchData() {}

  const fetchPermission = async () => {
    const role = await GetPermissionByUserName();
    setTypePermission(role);
  };

  const defaultValue = () => {
    formik.setFieldValue("rewardType", "1");
    formik.setFieldValue("redemptionType", "1");
    formikCoupon.setFieldValue("isDeleted", false);
  };

  useEffect(() => {
    /* Default Value for Testing */
    fetchPermission();
    defaultValue();
    fetchData();
  }, []);

  return (
    <>
      <div className="flex flex-warp mb-4">
        <span className="text-sm margin-auto-t-b font-bold ">
          <i className="fas fa-cog"></i>&nbsp;&nbsp;
        </span>
        <span className="text-base margin-auto-t-b font-bold">
          CRM&nbsp;&nbsp;/&nbsp;&nbsp;
        </span>
        <span className="text-sm margin-auto-t-b font-bold ">
          <i className="fas fa-gift"></i>&nbsp;&nbsp;
        </span>
        <span className="text-base margin-auto font-bold">
          เงื่อนไขแลกของรางวัล
        </span>
      </div>
      <div className="w-full">
        <form>
          <div className="w-full">
            <div className="flex justify-between py-2 mt-4">
              <span className="text-lg  text-green-mbk margin-auto font-bold">
                เพิ่มเงื่อนไขการแลกของรางวัล
              </span>
              <div
                className={
                  "margin-auto-t-b" + (width < 764 ? " hidden" : " block")
                }
              >
                <div className="w-full px-4">
                  <div className="relative w-full text-right">
                    <button
                      className="bg-rose-mbk text-white active:bg-rose-mbk font-bold uppercase text-sm px-2 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => {
                        OnBack();
                      }}
                    >
                      ย้อนกลับ
                    </button>
                    <button
                      className={
                        " bg-gold-mbk text-white active:bg-gold-mbk font-bold uppercase text-sm px-2 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150 "
                      }
                      type="button"
                      onClick={() => {
                        formikCoupon.handleSubmit();
                        formik.handleSubmit();
                      }}
                    >
                      บันทึกข้อมูล
                    </button>
                  </div>
                </div>
              </div>
              <div
                className={
                  "margin-auto-t-b" + (width < 764 ? " block" : " hidden")
                }
              >
                <button
                  className="flex items-center py-4 px-2 w-full text-base font-normal bg-transparent outline-none button-focus"
                  type="button"
                >
                  <i
                    className="fas fa-bars"
                    id={menu ? "dropdownDefaults" : "dropdownDefault"}
                  ></i>
                </button>
                <div
                  id="dropdownmenu"
                  className={
                    "z-10 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 buttonInfo" +
                    (menu ? " block absolute isMenu" : " hidden")
                  }
                >
                  <ul
                    className="py-1 text-sm text-gray-700 dark:text-gray-200"
                    aria-labelledby="dropdownDefault"
                  >
                    <li className={typePermission === "1" ? " " : " hidden"}>
                      <div className="flex flex-wrap" id="save">
                        <span
                          id="save"
                          onClick={() => {
                            formikCoupon.handleSubmit();
                            formik.handleSubmit();
                          }}
                          className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white font-bold text-sm w-8/12"
                        >
                          <i className="fas fa-save mr-2"></i>
                          บันทึก
                        </span>
                      </div>
                    </li>
                    <li>
                      <div className="flex flex-wrap" id="back">
                        <span
                          onClick={() => {
                            OnBack();
                          }}
                          id="back"
                          className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white font-bold text-sm w-8/12"
                        >
                          <i className="fas fa-arrow-left mr-2"></i>
                          ย้อนกลับ
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 border bg-white rounded-lg Overflow-info ">
              <div className="flex-auto lg:px-10 py-10">
                <div className="flex flex-wrap">
                  <div className="w-full lg:w-1/12 margin-auto-t-b">
                    <div className="relative w-full">
                      <LabelUC
                        label="ชื่อเงื่อนไขการแลกรางวัล"
                        isRequired={true}
                      />

                      {formik.touched.redemptionName &&
                      formik.errors.redemptionName ? (
                        <div className="text-sm py-2 px-2 text-red-500">
                          &nbsp;
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="w-full lg:w-11/12 margin-auto-t-b">
                    <div className="relative w-full px-4">
                      <InputUC
                        name="redemptionName"
                        maxLength={100}
                        onBlur={formik.handleBlur}
                        value={formik.values.redemptionName}
                        onChange={(e) => {
                          formik.handleChange(e);
                        }}
                      />
                    </div>
                    <div className="relative w-full px-4">
                      {formik.touched.redemptionName &&
                      formik.errors.redemptionName ? (
                        <div className="text-sm py-2 px-2  text-red-500">
                          {formik.errors.redemptionName}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="w-full">&nbsp;</div>
                  <div className="w-full lg:w-1/12 margin-auto-t-b">
                    <div className="relative w-full">
                      <LabelUC
                        label="ประเภทเงื่อนไขการแลกรางวัล"
                        isRequired={true}
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-11/12 margin-auto-t-b">
                    <div className="relative w-full px-4">
                      <SelectUC
                        name="redemptionType"
                        onChange={(value) => {
                          formik.setFieldValue("redemptionType", value.value);
                        }}
                        options={redemptionType}
                        value={ValidateService.defaultValue(
                          redemptionType,
                          formik.values.redemptionType
                        )}
                      />
                    </div>
                  </div>
                  <div className="w-full">&nbsp;</div>
                  <div className="w-full lg:w-1/12 margin-auto-t-b">
                    <div className="relative w-full">
                      <LabelUC label="ประเภทรางวัล" isRequired={true} />
                    </div>
                  </div>
                  <div className="w-full lg:w-11/12 margin-auto-t-b">
                    <div className="relative w-full px-4">
                      <SelectUC
                        name="rewardType"
                        onChange={(value) => {
                          formik.setFieldValue("rewardType", value.value);
                        }}
                        options={rewardType}
                        value={ValidateService.defaultValue(
                          rewardType,
                          formik.values.rewardType
                        )}
                      />
                    </div>
                  </div>
                  <div className="w-full">&nbsp;</div>
                  <div className="w-full lg:w-1/12 margin-auto-t-b">
                    <div className="relative w-full">
                      <LabelUC label="จำนวนคะแนน" isRequired={true} />
                      {formik.touched.points && formik.errors.points ? (
                        <div className="text-sm py-2 px-2 text-red-500">
                          &nbsp;
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div
                    className="w-full lg:w-5/12 margin-auto-t-b"
                    // style={{ width: width < 764 ? "100%" : "39.7%" }}
                  >
                    <div className="relative flex px-4">
                      <InputUC
                        name="points"
                        type="text"
                        maxLength={7}
                        onBlur={formik.handleBlur}
                        value={formik.values.points}
                        onChange={(e) => {
                          setStateDelay(ValidateService.onHandleScore(e));
                          formik.values.points =
                            ValidateService.onHandleScore(e);
                        }}
                        min="0"
                      />
                      <span
                        className="margin-auto-t-b font-bold"
                        style={{ marginLeft: width < 764 ? "1rem" : "2rem" }}
                      >
                        คะแนน
                      </span>
                    </div>
                    <div className="relative px-4">
                      {formik.touched.points && formik.errors.points ? (
                        <div className="text-sm py-2 px-2 text-red-500">
                          {formik.errors.points}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="w-full">&nbsp;</div>
                  <div className="w-full lg:w-1/12 margin-auto-t-b ">
                    <LabelUC label="วันที่เริ่มต้น" isRequired={true} />
                  </div>
                  <div className="w-full lg:w-5/12 px-4 margin-auto-t-b">
                    <div className="relative">
                      <DatePickerUC
                        onClick={(e) => {
                          setIsClick({ ...isClick, redemptionStart: true });
                        }}
                        onBlur={(e) => {
                          setIsClick({ ...isClick, redemptionStart: false });
                        }}
                        onChange={(e) => {
                          setIsClick({ ...isClick, redemptionStart: false });
                          if (e === null) {
                            formik.setFieldValue(
                              "startDate",
                              new Date(),
                              false
                            );
                          } else {
                            formik.setFieldValue(
                              "startDate",
                              moment(e).toDate(),
                              false
                            );
                          }
                        }}
                        value={
                          !isClick.redemptionStart
                            ? moment(
                                new Date(formik.values.startDate),
                                "DD/MM/YYYY"
                              )
                            : null
                        }
                      />
                    </div>
                  </div>
                  <div
                    className={"w-full" + (width < 764 ? " block" : " hidden")}
                  >
                    &nbsp;
                  </div>
                  <div className="w-full lg:w-1/12 px-4 margin-auto-t-b ">
                    <LabelUC label="วันที่สิ้นสุด" isRequired={true} />
                  </div>
                  <div className="w-full lg:w-5/12 px-4 margin-auto-t-b">
                    <div className="relative">
                      <DatePickerUC
                        onClick={(e) => {
                          setIsClick({ ...isClick, redemptionEnd: true });
                        }}
                        onBlur={(e) => {
                          setIsClick({ ...isClick, redemptionEnd: false });
                        }}
                        onChange={(e) => {
                          setIsClick({ ...isClick, redemptionEnd: false });
                          if (e === null) {
                            formik.setFieldValue("endDate", new Date(), false);
                          } else {
                            formik.setFieldValue(
                              "endDate",
                              moment(e).toDate(),
                              false
                            );
                          }
                        }}
                        value={
                          !isClick.redemptionEnd
                            ? moment(
                                new Date(formik.values.endDate),
                                "DD/MM/YYYY"
                              )
                            : null
                        }
                      />
                    </div>
                  </div>
                  <div className="w-full">&nbsp;</div>
                  <div className="w-full">&nbsp;</div>
                  <span className="text-lg  text-green-mbk margin-auto font-bold">
                    <div className="w-full mb-2">
                      {formik.values.rewardType === "1"
                        ? "กำหนดคูปอง"
                        : "กำหนดสินค้าสัมนาคุณ"}
                    </div>
                  </span>

                  <div className="relative flex flex-col min-w-0 break-words w-full mb-6 border bg-white rounded-lg ">
                    <div className="flex-auto lg:px-8 py-10">
                      <div className="flex flex-wrap">
                        <div className="w-full lg:w-1/12 margin-auto-t-b">
                          <div className="relative w-full">
                            <LabelUC label="รูปคูปอง" isRequired={true} />
                            {formikCoupon.touched.pictureCoupon &&
                            formikCoupon.errors.pictureCoupon ? (
                              <div className="text-sm py-2 px-2 text-red-500">
                                &nbsp;
                              </div>
                            ) : null}
                          </div>
                        </div>
                        <div className="w-full lg:w-11/12 margin-auto-t-b">
                          <div className="relative w-full px-4">
                            <ProfilePictureUC
                              id="eCouponImage"
                              hoverText="เลือกรูปภาพคูปอง"
                              onChange={handleChangeImage}
                            />

                            {formikCoupon.touched.pictureCoupon &&
                            formikCoupon.errors.pictureCoupon ? (
                              <div className="text-sm py-2 px-2  text-red-500">
                                {formikCoupon.errors.pictureCoupon}
                              </div>
                            ) : null}
                          </div>
                        </div>
                        <div className="w-full">&nbsp;</div>
                        <div className="w-full lg:w-1/12 margin-auto-t-b">
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
                        <div className="w-full lg:w-11/12 margin-auto-t-b">
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
                            ) : null}
                          </div>
                        </div>
                        <div className="w-full">&nbsp;</div>
                        <div className="w-full lg:w-1/12 margin-auto-t-b ">
                          <LabelUC label="วันที่เริ่มต้น" isRequired={true} />
                        </div>
                        <div className="w-full lg:w-5/12 px-4 margin-auto-t-b">
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
                          </div>
                        </div>
                        <div
                          className={
                            "w-full" + (width < 764 ? " block" : " hidden")
                          }
                        >
                          &nbsp;
                        </div>
                        <div className="w-full lg:w-1/12 px-4 margin-auto-t-b ">
                          <LabelUC label="วันที่สิ้นสุด" isRequired={true} />
                        </div>
                        <div className="w-full lg:w-5/12 px-4 margin-auto-t-b">
                          <div className="relative">
                            <DatePickerUC
                              onClick={(e) => {
                                setIsClick({ ...isClick, couponEnd: true });
                              }}
                              onBlur={(e) => {
                                setIsClick({ ...isClick, couponEnd: false });
                              }}
                              onChange={(e) => {
                                setIsClick({ ...isClick, couponEnd: false });
                                if (e === null) {
                                  formikCoupon.setFieldValue(
                                    "endDate",
                                    new Date(),
                                    false
                                  );
                                } else {
                                  formikCoupon.setFieldValue(
                                    "endDate",
                                    moment(e).toDate(),
                                    false
                                  );
                                }
                              }}
                              value={
                                !isClick.couponEnd
                                  ? moment(
                                      new Date(formikCoupon.values.endDate),
                                      "DD/MM/YYYY"
                                    )
                                  : null
                              }
                            />
                          </div>
                        </div>
                        <div className="w-full">&nbsp;</div>
                        <div className="w-full lg:w-1/12 margin-auto-t-b ">
                          <LabelUC label="วันที่หมดอายุ" isRequired={true} />
                          <div className="text-sm py-2 px-2  text-red-500">
                            &nbsp;
                          </div>
                        </div>
                        <div className="w-full lg:w-5/12 px-4 margin-auto-t-b">
                          <div className="relative">
                            <DatePickerUC
                              onClick={(e) => {
                                setIsClick({ ...isClick, expireDate: true });
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
                                      new Date(formikCoupon.values.expiredDate),
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
                            "w-full" + (width < 764 ? " block" : " hidden")
                          }
                        >
                          &nbsp;
                        </div>
                        <div className="w-full lg:w-1/12 margin-auto-t-b "></div>
                        <div className="w-full lg:w-5/12 px-4 margin-auto-t-b">
                          <div className="relative"></div>
                        </div>
                        <div className="w-full">&nbsp;</div>
                        <div className="w-full lg:w-1/12 margin-auto-t-b ">
                          <LabelUC label="จำนวนคูปอง" isRequired={true} />
                          {formikCoupon.touched.couponCount &&
                          formikCoupon.errors.couponCount ? (
                            <div className="text-sm py-2 px-2  text-red-500">
                              &nbsp;
                            </div>
                          ) : null}
                        </div>
                        <div className="w-full lg:w-5/12 px-4 margin-auto-t-b">
                          <div className="relative">
                            <InputUC
                              name="couponCount"
                              type="text"
                              maxLength={7}
                              // value={coupon.couponCount}
                              // onChange={(e) => {
                              //   setCoupon((prevState) => {
                              //     return {
                              //       ...prevState,
                              //       couponCount: e.target.value,
                              //     };
                              //   });
                              // }}
                              onBlur={formikCoupon.handleBlur}
                              value={formikCoupon.values.couponCount}
                              onChange={(e) => {
                                formikCoupon.handleChange(e);
                              }}
                              min="0"
                            />
                            {formikCoupon.touched.couponCount &&
                            formikCoupon.errors.couponCount ? (
                              <div className="text-sm py-2 px-2  text-red-500">
                                {formikCoupon.errors.couponCount}
                              </div>
                            ) : null}
                          </div>
                        </div>
                        <div
                          className={
                            "w-full" + (width < 764 ? " block" : " hidden")
                          }
                        >
                          &nbsp;
                        </div>
                        <div className="w-full lg:w-1/12 margin-auto-t-b "></div>
                        <div className="w-full lg:w-5/12 px-4 margin-auto-t-b">
                          <div className="relative"></div>
                        </div>
                        <div className="w-full">&nbsp;</div>
                        <div className="w-full lg:w-1/12 margin-auto-t-b ">
                          <LabelUC
                            label="จำนวนที่ใช้แลกต่อวัน"
                            isRequired={false}
                          />
                        </div>
                        <div className="w-full lg:w-5/12 px-4 margin-auto-t-b">
                          <div className="relative">
                            <InputUC
                              name="usedPerDayCount"
                              type="text"
                              maxLength={7}
                              // value={coupon.usedPerDayCount}
                              // onChange={(e) => {
                              //   setCoupon((prevState) => {
                              //     return {
                              //       ...prevState,
                              //       usedPerDayCount: e.target.value,
                              //     };
                              //   });
                              // }}
                              onBlur={formikCoupon.handleBlur}
                              value={formikCoupon.values.usedPerDayCount}
                              onChange={(e) => {
                                formikCoupon.handleChange(e);
                              }}
                              min="0"
                            />
                          </div>
                        </div>
                        <div
                          className={
                            "w-full" + (width < 764 ? " block" : " hidden")
                          }
                        >
                          &nbsp;
                        </div>
                        <div className="w-full lg:w-1/12 margin-auto-t-b "></div>
                        <div className="w-full lg:w-5/12 px-4 margin-auto-t-b">
                          <div className="relative"></div>
                        </div>
                        <div className="w-full">&nbsp;</div>
                        <div className="w-full lg:w-1/12 margin-auto-t-b ">
                          <LabelUC label="รายละเอียดคูปอง" isRequired={false} />
                        </div>
                        <div className="w-full lg:w-11/12 px-4 margin-auto-t-b">
                          <div className="relative">
                            <TextAreaUC
                              name="description"
                              onBlur={formikCoupon.handleBlur}
                              value={formikCoupon.values.description}
                              onChange={(e) => {
                                formikCoupon.handleChange(e);
                              }}
                              // value={coupon.description}
                              // onChange={(e) => {
                              //   setCoupon((prevState) => {
                              //     return {
                              //       ...prevState,
                              //       description: e.target.value,
                              //     };
                              //   });
                              // }}
                            />
                          </div>
                        </div>
                        <div className="w-full">&nbsp;</div>
                        <div className="w-full lg:w-1/12 margin-auto-t-b ">
                          <CheckBoxUC
                            text="ยกเลิก / เรียกคืน"
                            name="isCancelReclaim"
                            // onChange={(e) => {
                            //   setIsCancel(e.target.checked);
                            //   setCoupon((prevState) => {
                            //     return {
                            //       ...prevState,
                            //       isCancelReclaim: e.target.checked,
                            //     };
                            //   });
                            // }}
                            // checked={coupon.isCancelReclaim}
                            onChange={(e) => {
                              setIsCancel(e.target.checked);
                              formikCoupon.setFieldValue(
                                "isCancelReclaim",
                                e.target.checked
                              );
                            }}
                            onBlur={formikCoupon.handleBlur}
                            checked={formikCoupon.values.isCancelReclaim}
                          />
                        </div>
                        <div className="w-full lg:w-11/12 px-4 margin-auto-t-b">
                          <div
                            className={
                              "relative border rounded px-2 py-2 " +
                              (!isCancel ? " disabled" : " ")
                            }
                          >
                            <Radio.Group
                              disabled={!isCancel}
                              onChange={(e) => {
                                formikCoupon.setFieldValue(
                                  "isCancel",
                                  e.target.value === 1 ? true : false
                                );
                                formikCoupon.setFieldValue(
                                  "isReclaim",
                                  e.target.value === 2 ? true : false
                                );
                                // setCoupon((prevState) => {
                                //   return {
                                //     ...prevState,
                                //     isCancel:
                                //       e.target.value === 1 ? true : false,
                                //     isReclaim:
                                //       e.target.value === 2 ? true : false,
                                //   };
                                // });
                              }}
                              onBlur={formikCoupon.handleBlur}
                              value={
                                !formikCoupon.values.isCancelReclaim
                                  ? 3
                                  : formikCoupon.values.isReclaim
                                  ? 2
                                  : 1
                              }
                            >
                              <Space direction="vertical">
                                <Radio value={1}>ยกเลิกคูปอง</Radio>
                                <Radio value={2}>
                                  เรียกคืนคูปอง
                                  (เฉพาะที่ถูกนำไปใช้งานแล้วเท่านั้น)
                                </Radio>
                              </Space>
                            </Radio.Group>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      <ConfirmEdit
        showModal={modalIsOpenEdit}
        message={"เงื่อนไขแลกของรางวัล"}
        hideModal={() => {
          closeModalSubject();
        }}
        confirmModal={() => {
          onEditValue();
        }}
        returnModal={() => {
          onReturn();
        }}
      />
    </>
  );
}
