import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import axios from "services/axios";
import { useToasts } from "react-toast-notifications";
/* Service */
import useWindowDimensions from "services/useWindowDimensions";
import ValidateService from "services/validateValue";
import * as Storage from "../../../../services/Storage.service";
import "antd/dist/antd.css";
import moment from "moment";
import "moment/locale/th";
import useMenu from "services/useMenu";
import ConfirmEdit from "components/ConfirmDialog/ConfirmEdit";
import InputUC from "components/InputUC";
import LabelUC from "components/LabelUC";
import SelectUC from "components/SelectUC";
import DatePickerUC from "components/DatePickerUC";
import { fetchLoading, fetchSuccess } from "redux/actions/common";
import StandardCoupon from "./StandardCoupon";
import StandardProduct from "./StandardProduct";
import { onSaveImage } from "services/ImageService";
import FilesService from "../../../../services/files";
import GameList from "./GameList";
import TextAreaUC from "components/InputUC/TextAreaUC";
import ImportCoupon from "./ImportCoupon";

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
  const { width } = useWindowDimensions();
  const { menu } = useMenu();
  let { id } = useParams();

  /* Set useState */
  const [isNew, setIsNew] = useState(false);
  const [isImport, setIsImport] = useState("");
  const [typePermission, setTypePermission] = useState("");
  const [modalIsOpenEdit, setIsOpenEdit] = useState(false);
  const [isClick, setIsClick] = useState({
    redemptionStart: false,
    redemptionEnd: false,
    couponStart: false,
    couponEnd: false,
    expireDate: false,
  });

  const [stateDelay, setStateDelay] = useState("");

  const [isCancel, setIsCancel] = useState(false);

  const imageData = {
    id: null,
    image: null,
    relatedId: null,
    relatedTable: "",
    isDeleted: false,
    addBy: null,
    updateBy: null,
  };

  const [imageCoupon, setImageCoupon] = useState(imageData);
  const [imageProduct, setImageProduct] = useState(imageData);
  const [isRewardType, setIsRewardType] = useState(false);
  const [isRedemptionType, setIsRedemptionType] = useState(false);
  const [isDisableType, setIsDisableType] = useState(false);
  const [listGame, setListGame] = useState([]);
  const dispatch = useDispatch();
  let history = useHistory();

  const { addToast } = useToasts();
  /* Method Condition */
  const OnBack = () => {
    if (JSON.stringify(formik.touched).length > 2) {
      openModalSubject();
    } else {
      history.push("/admin/redemptions");
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
    setIsOpenEdit(false);
    if (valueError.length <= 2) {
      history.push("/admin/redemptions");
    }
  };

  const onReturn = () => {
    history.push("/admin/redemptions");
  };

  /* Form insert value */
  const formik = useFormik({
    initialValues: {
      id: "",
      redemptionName: "",
      redemptionType: "",
      rewardType: "",
      points: 0,
      rewardGameAmount: 0,
      startDate: new Date(),
      endDate: new Date(),
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
      let ImageSave = {};
      if (formik.values.redemptionType === "2") {
        values["listGame"] = listGame;
        if (isNew) {
          dispatch(fetchLoading());
          formik.values.addBy = localStorage.getItem("user");
          axios.post("redemptions/game", values).then(async (res) => {
            if (res.data.status) {
              setIsNew(false);
              formik.values.id = res.data.tbRedemptionConditionsHD.id;
              history.push(
                `/admin/redemptionsinfo/${res.data.tbRedemptionConditionsHD.id}`
              );
              dispatch(fetchSuccess());
              formik.setTouched({});
              addToast(
                Storage.GetLanguage() === "th"
                  ? "บันทึกข้อมูลสำเร็จ"
                  : "Save data successfully",
                { appearance: "success", autoDismiss: true }
              );
            } else {
              dispatch(fetchSuccess());
              formik.setTouched({});
              addToast(
                "บันทึกข้อมูลไม่สำเร็จ เนื่องจากชื่อเงื่อนไขซ้ำกับในระบบ",
                {
                  appearance: "warning",
                  autoDismiss: true,
                }
              );
            }
          });
        } else {
          dispatch(fetchLoading());
          formik.values.updateBy = localStorage.getItem("user");
          axios.put("redemptions/game", values).then(async (res) => {
            if (res.data.status) {
              dispatch(fetchSuccess());
              formik.setTouched({});
              addToast(
                Storage.GetLanguage() === "th"
                  ? "บันทึกข้อมูลสำเร็จ"
                  : "Save data successfully",
                { appearance: "success", autoDismiss: true }
              );
            } else {
              dispatch(fetchSuccess());
              formik.setTouched({});
              addToast(
                "บันทึกข้อมูลไม่สำเร็จ เนื่องจากชื่อเงื่อนไขซ้ำกับในระบบ",
                {
                  appearance: "warning",
                  autoDismiss: true,
                }
              );
            }
          });
        }
      } else {
        if (formik.values.rewardType === "1") {
          values["coupon"] = formikCoupon.values;
          ImageSave = {
            ...imageCoupon,
            image: formikCoupon.values.pictureCoupon,
            relatedTable: "tbRedemptionCoupon",
          };
        } else {
          values["product"] = formikProduct.values;
          ImageSave = {
            ...imageProduct,
            image: formikProduct.values.pictureProduct,
            relatedTable: "tbRedemptionProduct",
          };
        }
        if (
          (formik.values.rewardType === "1" && formikCoupon.isValid) ||
          (formik.values.rewardType === "2" && formikProduct.isValid) ||
          (formikCouponImport.isValid && isImport)
        ) {
          if (isNew) {
            dispatch(fetchLoading());
            formik.values.addBy = localStorage.getItem("user");
            axios.post("redemptions", values).then(async (res) => {
              if (res.data.status) {
                setIsNew(false);
                formik.values.id = res.data.tbRedemptionConditionsHD.id;
                ImageSave = {
                  ...ImageSave,
                  relatedId:
                    formik.values.rewardType === "1"
                      ? res.data.tbRedemptionCoupon.id
                      : res.data.tbRedemptionProduct.id,
                };
                await onSaveImage(ImageSave, async (res) => {});
                history.push(
                  `/admin/redemptionsinfo/${res.data.tbRedemptionConditionsHD.id}`
                );
                addToast(
                  Storage.GetLanguage() === "th"
                    ? "บันทึกข้อมูลสำเร็จ"
                    : "Save data successfully",
                  { appearance: "success", autoDismiss: true }
                );
              } else {
                addToast(
                  "บันทึกข้อมูลไม่สำเร็จ เนื่องจากชื่อเงื่อนไขซ้ำกับในระบบ",
                  {
                    appearance: "warning",
                    autoDismiss: true,
                  }
                );
              }
              formik.setTouched({});
              dispatch(fetchSuccess());
            });
          } else {
            formik.values.updateBy = localStorage.getItem("user");
            dispatch(fetchLoading());
            formik.setFieldValue("expireDate", null);
            axios.put("redemptions", values).then(async (res) => {
              if (res.data.status) {
                ImageSave = {
                  ...ImageSave,
                  relatedId:
                    formik.values.rewardType === "1"
                      ? formikCoupon.values.id
                      : formikProduct.values.id,
                };
                await onSaveImage(ImageSave, async (res) => {});
                addToast(
                  Storage.GetLanguage() === "th"
                    ? "บันทึกข้อมูลสำเร็จ"
                    : "Save data successfully",
                  { appearance: "success", autoDismiss: true }
                );
              } else {
                addToast(
                  "บันทึกข้อมูลไม่สำเร็จ เนื่องจากชื่อเงื่อนไขซ้ำกับในระบบ",
                  {
                    appearance: "warning",
                    autoDismiss: true,
                  }
                );
              }
              formik.setTouched({});
              dispatch(fetchSuccess());
            });
          }
        }
      }
    },
  });

  const formikCoupon = useFormik({
    initialValues: {
      id: "",
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
  });

  const formikCouponImport = useFormik({
    initialValues: {
      id: "",
      pictureCoupon: "",
      fileName: "",
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
      fileName: Yup.string().required("* กรุณาเลือก ไฟล์"),
    }),
  });

  const formikProduct = useFormik({
    initialValues: {
      id: "",
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
  });

  async function fetchData() {
    dispatch(fetchLoading());
    let response = await axios
      .get(`/redemptions/byId/${id}`)
      .then((response) => {
        if (response.data.error) {
        } else {
          if (response.data.tbRedemptionConditionsHD) {
            setIsNew(false);
            setIsDisableType(true);
            let reademptionType =
              response.data.tbRedemptionConditionsHD["redemptionType"];
            for (var columns in response.data.tbRedemptionConditionsHD) {
              if (response.data.tbRedemptionConditionsHD[columns] === null) {
                formik.setFieldValue(columns, "", false);
              } else {
                if (columns === "rewardType") {
                  setIsRewardType(
                    response.data.tbRedemptionConditionsHD[columns] === "1"
                      ? false
                      : true
                  );
                } else if (columns === "redemptionType") {
                  setIsRedemptionType(
                    response.data.tbRedemptionConditionsHD[columns] === "1"
                      ? false
                      : true
                  );
                }
                formik.setFieldValue(
                  columns,
                  response.data.tbRedemptionConditionsHD[columns],
                  false
                );
              }
            }
            if (reademptionType === "2") {
              for (var i = 0; i < response.data.listGame.length; i++) {
                if (response.data.listGame[i].rewardType === "1") {
                  response.data.listGame[i]["pictureCoupon"] =
                    FilesService.buffer64UTF8(
                      response.data.listGame[i]["pictureCoupon"]
                    );
                } else {
                  response.data.listGame[i]["pictureProduct"] =
                    FilesService.buffer64UTF8(
                      response.data.listGame[i]["pictureProduct"]
                    );
                }
              }
              setListGame(response.data.listGame);
            } else {
              for (var columnsCoupon in response.data.tbRedemptionCoupon) {
                if (response.data.tbRedemptionCoupon[columnsCoupon] === null) {
                  formikCoupon.setFieldValue(columnsCoupon, "", false);
                } else {
                  formikCoupon.setFieldValue(
                    columnsCoupon,
                    response.data.tbRedemptionCoupon[columnsCoupon],
                    false
                  );
                }
              }
              for (var columnsProduct in response.data.tbRedemptionProduct) {
                if (
                  response.data.tbRedemptionProduct[columnsProduct] === null
                ) {
                  if (
                    columnsProduct === "rewardCount" &&
                    response.data.tbRedemptionProduct["isNoLimitReward"]
                  ) {
                    formikProduct.setFieldValue(columnsProduct, 1, false);
                  } else formikProduct.setFieldValue(columnsProduct, "", false);
                } else {
                  formikProduct.setFieldValue(
                    columnsProduct,
                    response.data.tbRedemptionProduct[columnsProduct],
                    false
                  );
                }
              }

              if (response.data.tbImage !== null) {
                if (
                  response.data.tbRedemptionConditionsHD["rewardType"] === "1"
                ) {
                  formikCoupon.setFieldValue(
                    "pictureCoupon",
                    FilesService.buffer64UTF8(response.data.tbImage["image"])
                  );
                  setImageCoupon({ ...imageCoupon, ...response.data.tbImage });
                } else {
                  formikProduct.setFieldValue(
                    "pictureProduct",
                    FilesService.buffer64UTF8(response.data.tbImage["image"])
                  );
                  setImageProduct({
                    ...imageProduct,
                    ...response.data.tbImage,
                  });
                }
              }
            }
          } else {
            setIsNew(true);
            formik.setFieldValue("redemptionType", "1");
            formik.setFieldValue("rewardType", "1");
            formikCoupon.setFieldValue("discountType", "1");
          }
          dispatch(fetchSuccess());
        }
      });
  }

  const defaultValue = () => {
    formik.setFieldValue("redemptionType", "2");
    setIsRedemptionType(true);
    formik.setFieldValue("rewardType", "1");
    setIsRewardType(false);
    formik.setFieldValue("redemptionName", "ส่วนลดที่หาไม่ได้");
    formik.setFieldValue("points", 10);
    formik.setFieldValue("isDeleted", false);

    formikCoupon.setFieldValue("couponName", "รหัสในตำนาน");
    formikCoupon.setFieldValue("couponCount", 10);
    formikCoupon.setFieldValue("isDeleted", false);

    formikProduct.setFieldValue("productName", "รหัสในตำนาน");
    formikProduct.setFieldValue("rewardCount", 10);
    formikProduct.setFieldValue("isDeleted", false);
  };

  useEffect(() => {
    /* Default Value for Testing */
    setIsNew(true);
    // defaultValue();
    fetchData();
    setIsImport(window.location.href.includes("redemptionsimport"));
    if (window.location.href.includes("redemptionsimport")) {
      setIsDisableType(true);
    }
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
                        if (!isImport) {
                          if (!isRedemptionType) {
                            if (!isRewardType) {
                              formikCoupon.handleSubmit();
                            } else {
                              formikProduct.handleSubmit();
                            }
                          }
                        } else {
                          formikCouponImport.handleSubmit();
                        }
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
                            if (!isImport) {
                              if (!isRedemptionType) {
                                if (!isRewardType) {
                                  formikCoupon.handleSubmit();
                                } else {
                                  formikProduct.handleSubmit();
                                }
                              }
                            } else {
                              formikCouponImport.handleSubmit();
                            }
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
                        isDisabled={isDisableType}
                        onChange={(value) => {
                          setIsRedemptionType(
                            value.value === "1" ? false : true
                          );
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
                  <div
                    className={"w-full" + (isRedemptionType ? " hidden" : " ")}
                  >
                    &nbsp;
                  </div>
                  <div
                    className={
                      "w-full lg:w-1/12 margin-auto-t-b" +
                      (isRedemptionType ? " hidden" : " ")
                    }
                  >
                    <div className="relative w-full">
                      <LabelUC label="ประเภทรางวัล" isRequired={true} />
                    </div>
                  </div>
                  <div
                    className={
                      "w-full lg:w-11/12 margin-auto-t-b" +
                      (isRedemptionType ? " hidden" : " ")
                    }
                  >
                    <div className="relative w-full px-4">
                      <SelectUC
                        name="rewardType"
                        isDisabled={isDisableType}
                        onChange={(value) => {
                          setIsRewardType(value.value === "1" ? false : true);
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
                          setStateDelay(ValidateService.onHandleNumber(e));
                          formik.values.points =
                            ValidateService.onHandleNumber(e);
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
                    <LabelUC label="สิ้นสุด" isRequired={true} />
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
                  <div className="w-full lg:w-1/12 margin-auto-t-b ">
                    <LabelUC label="รายละเอียดคูปอง" isRequired={false} />
                  </div>
                  <div className="w-full lg:w-11/12 px-4 margin-auto-t-b">
                    <div className="relative">
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
                  <div className="w-full">&nbsp;</div>
                  <span className="text-lg  text-green-mbk margin-auto font-bold">
                    <div className="w-full mb-2">
                      {!isRedemptionType
                        ? !isRewardType
                          ? "กำหนดคูปอง"
                          : "กำหนดสินค้าสัมนาคุณ"
                        : "กำหนด Game"}
                    </div>
                  </span>
                  {isImport ? (
                    <ImportCoupon formik={formikCouponImport} />
                  ) : !isRedemptionType ? (
                    !isRewardType ? (
                      <StandardCoupon formik={formikCoupon} />
                    ) : (
                      <StandardProduct formik={formikProduct} />
                    )
                  ) : (
                    <GameList
                      id={id}
                      setListGame={setListGame}
                      listGame={listGame}
                    />
                  )}
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
