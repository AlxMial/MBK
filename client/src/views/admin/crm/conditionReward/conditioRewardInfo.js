import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import axios from "services/axios";
import axiosUpload from "services/axiosUpload";
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
import { Radio } from "antd";
import CheckBoxUC from "components/CheckBoxUC";
export default function ConditioRewardInfo() {
  /* Option Select */
  const redemptionType = [
    { value: "1", label: "Standard" },
    { value: "2", label: "Game" },
  ];
  const options = [
    { label: "เปิดการใช้งาน", value: true },
    { label: "ปิดการใช้งาน", value: false },
  ];

  const rewardType = [
    { value: "1", label: "E-Coupon" },
    { value: "2", label: "ของสมนาคุณ" },
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
  const [file, setFile] = useState();
  const [isClick, setIsClick] = useState({
    redemptionStart: false,
    redemptionEnd: false,
    couponStart: false,
    couponEnd: false,
    expired: false,
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
  const [listGameSearch, setListGameSearch] = useState([]);
  const [errorImage, setErrorImage] = useState(false);
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
      couponType: false,
      points: 0,
      isNotExpired: true,
      rewardGameAmount: 0,
      startDate: new Date(),
      endDate: moment(new Date()).add(1, "days").toDate(),
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
      startDate: Yup.string().required(
        Storage.GetLanguage() === "th"
          ? "* กรุณากรอก วันที่เริ่มต้น"
          : "* Please enter Start Date"
      ),
      endDate: Yup.string().when("isNotExpired", {
        is: false,
        then: Yup.string().required(
          Storage.GetLanguage() === "th"
            ? "* กรุณากรอก วันที่สิ้นสุด"
            : "* Please enter End Date"
        ),
        otherwise: Yup.string(),
      }),
    }),
    onSubmit: (values) => {
      let ImageSave = {};
      if (!errorImage) {
        if (formik.values.redemptionType === "2") {
          values["listGame"] = listGame;
          if (isNew) {
            dispatch(fetchLoading());
            formik.values.addBy = sessionStorage.getItem("user");
            axios.post("redemptions/game", values).then(async (res) => {
              if (res.data.status) {
                setIsNew(false);
                formik.values.id = res.data.tbRedemptionConditionsHD.id;
                history.push(
                  `/admin/redemptionsinfo/${res.data.tbRedemptionConditionsHD.id}`
                );
                dispatch(fetchSuccess());
                formik.setTouched({});
                fetchData();
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
            formik.values.updateBy = sessionStorage.getItem("user");
            axios.put("redemptions/game", values).then(async (res) => {
              if (res.data.status) {
                dispatch(fetchSuccess());
                formik.setTouched({});
                fetchData();
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
          let formData = new FormData();
          if (isImport) {
            values["coupon"] = formikCouponImport.values;
            values["couponType"] = true;
            formik.values.couponType = true;
            formData.append("file", file);
            ImageSave = {
              ...imageCoupon,
              image: formikCouponImport.values.pictureCoupon,
              relatedTable: "tbRedemptionCoupon",
            };
          } else if (formik.values.rewardType === "1") {
            values["coupon"] = formikCoupon.values;
            values["couponType"] = false;
            ImageSave = {
              ...imageCoupon,
              image: formikCoupon.values.pictureCoupon,
              relatedTable: "tbRedemptionCoupon",
            };
          } else if (formik.values.rewardType === "2") {
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
              formik.values.addBy = sessionStorage.getItem("user");
              axios.post("redemptions", values).then(async (res) => {
                if (res.data.status) {
                  setIsNew(false);
                  formik.values.id = res.data.tbRedemptionConditionsHD.id;
                  formikCoupon.setFieldValue(
                    "pictureCoupon",
                    isImport
                      ? formikCouponImport.values.pictureCoupon
                      : formikCoupon.values.pictureCoupon
                  );
                  if (isImport) {
                    for (var columns in res.data.tbRedemptionCoupon) {
                      formikCoupon.setFieldValue(
                        columns,
                        res.data.tbRedemptionCoupon[columns]
                      );
                    }
                  }
                  ImageSave = {
                    ...ImageSave,
                    relatedId:
                      formik.values.rewardType === "1"
                        ? res.data.tbRedemptionCoupon.id
                        : res.data.tbRedemptionProduct.id,
                  };
                  await onSaveImage(ImageSave, async (resImages) => {
                    if (formik.values.rewardType === "1") {
                      formikCoupon.values.id = res.data.tbRedemptionCoupon.id;
                      if (isImport) {
                        formData.append("id", res.data.tbRedemptionCoupon.id);
                        formData.append(
                          "addBy",
                          sessionStorage.getItem("user")
                        );
                        await axiosUpload
                          .post("api/coupon/uploadCoupon", formData)
                          .then(async (resExcel) => {
                            if (resExcel.data.status) {
                              await axios
                                .post("/uploadExcel/coupon", {
                                  couponId: res.data.tbRedemptionCoupon.id,
                                })
                                .then((resUpload) => {
                                  dispatch(fetchSuccess());
                                  fetchData();
                                  addToast(
                                    Storage.GetLanguage() === "th"
                                      ? "บันทึกข้อมูลสำเร็จ"
                                      : "Save data successfully",
                                    { appearance: "success", autoDismiss: true }
                                  );
                                });
                            } else {
                              dispatch(fetchSuccess());
                              addToast(
                                Storage.GetLanguage() === "th"
                                  ? "บันทึกข้อมูลไม่สำเร็จ"
                                  : "Unsuccessfully",
                                { appearance: "error", autoDismiss: true }
                              );
                            }
                          });
                      } else {
                        fetchData();
                        addToast(
                          Storage.GetLanguage() === "th"
                            ? "บันทึกข้อมูลสำเร็จ"
                            : "Save data successfully",
                          { appearance: "success", autoDismiss: true }
                        );
                        dispatch(fetchSuccess());
                      }
                    } else if (formik.values.rewardType === "2") {
                      formikProduct.values.id = res.data.tbRedemptionProduct.id;
                      fetchData();
                      dispatch(fetchSuccess());
                      addToast(
                        Storage.GetLanguage() === "th"
                          ? "บันทึกข้อมูลสำเร็จ"
                          : "Save data successfully",
                        { appearance: "success", autoDismiss: true }
                      );
                    }
                    dispatch(fetchSuccess());
                    history.push(
                      `/admin/redemptionsinfo/${res.data.tbRedemptionConditionsHD.id}`
                    );
                    // window.location.href( `/admin/redemptionsinfo/${res.data.tbRedemptionConditionsHD.id}`);
                    setIsImport(false);
                  });
                } else {
                  dispatch(fetchSuccess());
                  addToast(
                    "บันทึกข้อมูลไม่สำเร็จ เนื่องจากชื่อเงื่อนไขซ้ำกับในระบบ",
                    {
                      appearance: "warning",
                      autoDismiss: true,
                    }
                  );
                }
                formik.setTouched({});
              });
            } else {
              formik.values.updateBy = sessionStorage.getItem("user");
              dispatch(fetchLoading());
              // formik.setFieldValue("expired", null);
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
                  fetchData();
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
      isNotExpired: true,
      expired: moment(new Date()).add(1, "days").toDate(),
      expireDate: moment(new Date()).add(1, "days").toDate(),
      couponCount: 0,
      isNoLimitPerDayCount: false,
      usedPerDayCount: 0,
      description: "",
      isSelect: false,
      isCancel: false,
      isDeleted: false,
      isImport: false,
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
          "* จำนวนส่วนลดต้องมากกว่า 0",
          (value) => value > 0
        ),
      pictureCoupon: Yup.string().required("* กรุณาเลือก รูปคูปอง"),
      startDate: Yup.string().required(
        Storage.GetLanguage() === "th"
          ? "* กรุณากรอก วันที่เริ่มต้น"
          : "* Please enter Start Date"
      ),
      expired: Yup.string().when("isNotExpired", {
        is: false,
        then: Yup.string().required(
          Storage.GetLanguage() === "th"
            ? "* กรุณากรอก วันที่สิ้นสุด"
            : "* Please enter End Date"
        ),
        otherwise: Yup.string(),
      }),
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
      isNotExpired: true,
      expired: moment(new Date()).add(1, "days").toDate(),
      expireDate: moment(new Date()).add(1, "days").toDate(),
      couponCount: "",
      isNoLimitPerDayCount: false,
      usedPerDayCount: 0,
      description: "",
      isSelect: false,
      isCancel: false,
      isDeleted: false,
      isImport: true,
      addBy: "",
      updateBy: "",
    },
    validationSchema: Yup.object({
      couponName: Yup.string().required("* กรุณากรอก ชื่อคูปอง"),
      discount: Yup.number()
        .required("* กรุณากรอก ส่วนลด")
        .test(
          "Is positive?",
          "* จำนวนส่วนลดต้องมากกว่า 0",
          (value) => value > 0
        ),
      pictureCoupon: Yup.string().required("* กรุณาเลือก รูปคูปอง"),
      fileName: Yup.string().required("* กรุณาเลือก ไฟล์"),
      startDate: Yup.string().required(
        Storage.GetLanguage() === "th"
          ? "* กรุณากรอก วันที่เริ่มต้น"
          : "* Please enter Start Date"
      ),
      expired: Yup.string().when("isNotExpired", {
        is: false,
        then: Yup.string().required(
          Storage.GetLanguage() === "th"
            ? "* กรุณากรอก วันที่สิ้นสุด"
            : "* Please enter End Date"
        ),
        otherwise: Yup.string(),
      }),
    }),
  });

  const formikProduct = useFormik({
    initialValues: {
      id: "",
      pictureProduct: "",
      productName: "",
      rewardCount: 0,
      isNoLimitReward: true,
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
                response.data.listGame[i]["index"] = i;
                if (response.data.listGame[i].rewardType === "1") {
                  if (response.data.listGame[i]["pictureCoupon"] !== null) {
                    response.data.listGame[i]["pictureCoupon"] =
                      FilesService.buffer64UTF8(
                        response.data.listGame[i]["pictureCoupon"]
                      );
                  }
                } else {
                  if (response.data.listGame[i]["pictureProduct"] !== null) {
                    response.data.listGame[i]["pictureProduct"] =
                      FilesService.buffer64UTF8(
                        response.data.listGame[i]["pictureProduct"]
                      );
                  }
                }
              }

              setListGame(response.data.listGame);
              setListGameSearch(response.data.listGame);
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
            formik.setFieldValue("isActive", true);
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
                  <div className="w-full lg:w-12/12 margin-auto-t-b">
                    <div className="flex" style={{ justifyContent: "end" }}>
                      <CheckBoxUC
                        text="Partner"
                        checked={isImport ? true : false}
                        classLabel="mt-2 mb-4 w-full justify-end"
                        disabled={true}
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-1/12 margin-auto-t-b">
                    <div className="relative w-full">
                      <LabelUC label="ชื่อแคมเปญ" isRequired={true} />

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
                      <LabelUC label="ประเภทแคมเปญ" isRequired={true} />
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
                        type="number"
                        maxLength={7}
                        onBlur={formik.handleBlur}
                        value={formik.values.points}
                        onChange={(e) => {
                          setStateDelay(ValidateService.onHandleNumber(e));
                          formik.values.points =
                            ValidateService.onHandleNumberValue(e);
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
                    <div className="text-sm py-2 px-2  text-red-500">
                      &nbsp;
                    </div>
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
                            formik.setFieldValue("startDate", "", false);
                            formik.setFieldValue("endDate", "", false);
                          } else {
                            formik.handleChange({
                              target: {
                                name: "startDate",
                                value: moment(e).toDate(),
                              },
                            });
                            if (formik.values.endDate != null) {
                              if (moment(e).toDate() >= formik.values.endDate) {
                                formik.handleChange({
                                  target: {
                                    name: "endDate",
                                    value: moment(e).add(1, "days").toDate(),
                                  },
                                });
                              }
                            }
                          }
                        }}
                       
                        value={
                          !isClick.redemptionStart
                            ? formik.values.startDate == ""
                              ? null
                              : moment(
                                  new Date(formik.values.startDate),
                                  "DD/MM/YYYY"
                                )
                            : null
                        }
                      />
                      <div className="text-sm py-2 px-2  text-red-500">
                        &nbsp;
                      </div>
                    </div>
                    <div className="relative w-full px-4">
                      {formik.touched.startDate && formik.errors.startDate ? (
                        <div className="text-sm py-2 px-2  text-red-500">
                          {formik.errors.startDate}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div
                    className={"w-full" + (width < 764 ? " block" : " hidden")}
                  >
                    &nbsp;
                  </div>
                  <div className="w-full lg:w-1/12 px-4 margin-auto-t-b ">
                    <LabelUC label="สิ้นสุด" isRequired={true} />
                    <div className="text-sm py-2 px-2  text-red-500">
                      &nbsp;
                    </div>
                  </div>
                  <div className="w-full lg:w-5/12 px-4 margin-auto-t-b">
                    <div className="relative">
                      <DatePickerUC
                        placeholder={
                          formik.values.isNotExpired
                            ? "ไม่มีวันหมดอายุ"
                            : "เลือกวันที่"
                        }
                        disabled={formik.values.isNotExpired ==true ?true : false}
                        disabledValue={
                          formik.values.isNotExpired ? true : false
                        }
                        onClick={(e) => {
                          setIsClick({
                            ...isClick,
                            expired: formik.values.isNotExpired ? false : true,
                          });
                        }}
                        onBlur={(e) => {
                          setIsClick({ ...isClick, redemptionEnd: false });
                        }}
                        onChange={(e) => {
                          setIsClick({ ...isClick, redemptionEnd: false });
                          if (e === null) {
                            formik.setFieldValue("endDate", "", false);
                          } else {
                            formik.handleChange({
                              target: { name: "endDate", value: e },
                            });
                            formik.setFieldValue(
                              "endDate",
                              moment(e).toDate(),
                              false
                            );
                          }
                        }}
                        value={
                          !isClick.redemptionEnd
                            ? formik.values.endDate == ""
                              ? null
                              : moment(
                                  new Date(formik.values.endDate),
                                  "DD/MM/YYYY"
                                )
                            : null
                        }
                        disabledDate={(current) => {
                          if (formik.values.startDate != null) {
                            let day = formik.values.startDate;
                            return (
                              current &&
                              current <= moment(new Date(day)).endOf("day")
                            );
                          }
                        }}
                      />
                      <CheckBoxUC
                        text="ไม่มีวันหมดอายุ"
                        name="isNotExpired"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        checked={formik.values.isNotExpired}
                        classLabel="mt-2 w-full"
                      />
                      <div className="relative w-full px-4">
                        {formik.touched.endDate && formik.errors.endDate ? (
                          <div className="text-sm py-2 px-2  text-red-500">
                            {formik.errors.endDate}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="w-full">&nbsp;</div>
                  <div
                    className="w-full lg:w-1/12 margin-auto-t-b "
                    style={{ display: "none" }}
                  >
                    <LabelUC label="รายละเอียดคูปอง" isRequired={false} />
                  </div>

                  <div
                    className="w-full lg:w-11/12 px-4 margin-auto-t-b"
                    style={{ display: "none" }}
                  >
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
                  <div className="w-full lg:w-1/12 margin-auto-t-b "></div>
                  <div className="w-full lg:w-11/12 px-4 margin-auto-t-b ">
                    <Radio.Group
                      options={options}
                      onChange={(e) => {
                        formik.setFieldValue("isActive", e.target.value);
                      }}
                      value={formik.values.isActive}
                    />
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
                    <ImportCoupon
                      formik={formikCouponImport}
                      setFile={setFile}
                      errorImage={errorImage}
                      setErrorImage={setErrorImage}
                    />
                  ) : !isRedemptionType ? (
                    !isRewardType ? (
                      <StandardCoupon
                        formik={formikCoupon}
                        errorImage={errorImage}
                        setErrorImage={setErrorImage}
                      />
                    ) : (
                      <StandardProduct
                        formik={formikProduct}
                        errorImage={errorImage}
                        setErrorImage={setErrorImage}
                      />
                    )
                  ) : (
                    <GameList
                      id={id}
                      setListGame={setListGame}
                      listGame={listGame}
                      setListGameSearch={setListGameSearch}
                      listGameSearch={listGameSearch}
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
