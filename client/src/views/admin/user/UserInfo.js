import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
// import Select from "react-select";
import axios from "services/axios";
import { useToasts } from "react-toast-notifications";

/* Service */
import useWindowDimensions from "services/useWindowDimensions";
import ValidateService from "services/validateValue";
import * as Storage from "../../../services/Storage.service";
import { styleSelect } from "assets/styles/theme/ReactSelect.js";
import useMenu from "services/useMenu";
import ConfirmEdit from "components/ConfirmDialog/ConfirmEdit";
import SelectUC from "components/SelectUC";

export default function UserInfo() {
  /* Option Select */
  const options = [
    { value: "1", label: "ผู้ดูแลระบบ" },
    { value: "2", label: "บัญชี" },
    { value: "3", label: "การตลาด" },
  ];

  /* Service Function */
  const { height, width } = useWindowDimensions();
  const { menu } = useMenu();
  let { id } = useParams();

  /* RegEx formatter */
  const EmailRegExp = /^[A-Za-z0-9_.@]+$/;

  /* Set useState */
  const [inputIdentityCard, setinputIdentityCard] = useState();
  const [confirmPassword, setConfirmPassword] = useState(false);
  const [valueConfirm, setValueConfirm] = useState("");
  const [enableControl, setIsEnableControl] = useState(true);
  const [enablePassword, setenablePassword] = useState(true);
  const [errorPassword, setErrorPassword] = useState(false);
  const [errorCurrentPassword, seterrorCurrentPassword] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmpasswordShown, setConfirmpasswordShown] = useState(false);
  const [currentpasswordShown, setcurrentpasswordShown] = useState(false);
  const [modalIsOpenEdit, setIsOpenEdit] = useState(false);
  const [isUserSpace, setIsUserSpace] = useState(false);
  const [errorPassword1, setErrorPassword1] = useState(false);
  const [errorPassword2, setErrorPassword2] = useState(false);
  const [errorPassword3, setErrorPassword3] = useState(false);
  const [errorPassword4, setErrorPassword4] = useState(false);
  const [errorPassword5, setErrorPassword5] = useState(false);
  const [poorPassword, setPoorPassword] = useState(false);
  const [weakPassword, setWeakPassword] = useState(false);
  const [strongPassword, setStrongPassword] = useState(false);
  // const [isMenu, setIsMenu] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const useStyle = styleSelect();
  let history = useHistory();
  const { addToast } = useToasts();
  const [isModefied, setIsModified] = useState(false);
  const [isBack, setIsBack] = useState(false);

  const poorRegExp = /[a-zA-Z]/;
  const weakRegExp = /(?=.*?[0-9])/;
  const strongRegExp = /(?=.*?[#?!@$%^&*-])/;
  const whitespaceRegExp = /^$|\s+/;

  /* Method Condition */
  const togglePassword = () => {
    if (!enablePassword && formik.values.password !== "")
      setPasswordShown(!passwordShown);
  };

  const toggleConfirmPassword = () => {
    if (!enablePassword && formik.values.confirmPassword !== "")
      setConfirmpasswordShown(!confirmpasswordShown);
  };

  const toggleCurrentPassword = () => {
    if (!enablePassword && formik.values.currentPassword !== "")
      setcurrentpasswordShown(!currentpasswordShown);
  };

  /*ตรวจสอบข้อมูล รหัสผ่านตรงกัน*/
  const validateConfirm = (e) => {
    if (e !== formik.values.password) setConfirmPassword(true);
    else setConfirmPassword(false);
  };

  const OnBack = () => {
    if (isModefied) {
      openModalSubject();
    } else {
      history.push("/admin/users");
    }
  };

  function openModalSubject() {
    setIsOpenEdit(true);
  }

  function closeModalSubject() {
    setIsOpenEdit(false);
  }

  const onEditValue = () => {
    if (isModefied) {
      setIsBack(true);
      formik.handleSubmit();
      if (formik.values.password === "" && !enablePassword) {
        setErrorPassword(true);
      }
      setIsOpenEdit(false);
    } else {
      if (!isModefied) history.push("/admin/users");
    }
    // setIsModified(false);
    // history.push("/admin/users");
  };

  const onReturn = () => {
    setIsModified(false);
    history.push("/admin/users");
  };

  /* Form insert value */
  const formik = useFormik({
    initialValues: {
      id: "",
      userName: "",
      password: "",
      role: "",
      firstName: "",
      lastName: "",
      email: "",
      identityCard: "",
      isDeleted: false,
      empCode: "",
      position: "",
      currentPassword: "",
      confirmPassword: "",
      addBy: "",
      updateBy: "",
    },
    validationSchema: Yup.object({
      userName: Yup.string().required(
        Storage.GetLanguage() === "th"
          ? "* กรุณากรอก Username"
          : "* Please enter your username"
      ),
      firstName: Yup.string().required(
        Storage.GetLanguage() === "th"
          ? "* กรุณากรอก ชื่อ"
          : "* Please enter your first name"
      ),
      lastName: Yup.string().required(
        Storage.GetLanguage() === "th"
          ? "* กรุณากรอก นามสกุล"
          : "* Please enter your last name"
      ),
      email: Yup.string()
        .matches(
          EmailRegExp,
          Storage.GetLanguage() === "th"
            ? "* ขออภัย อนุญาตให้ใช้เฉพาะตัวอักษร (a-z), ตัวเลข (0-9) และเครื่องหมายมหัพภาค (.) เท่านั้น"
            : "* Sorry, only letters (a-z), numbers (0-9), and periods (.) are allowed."
        )
        .email(
          Storage.GetLanguage() === "th"
            ? "* รูปแบบ Email ไม่ถูกต้อง"
            : "Invalid email format"
        )
        .required(
          Storage.GetLanguage() === "th"
            ? "* กรุณากรอก Email"
            : "* Please enter your email"
        ),
      empCode: Yup.string().required(
        Storage.GetLanguage() === "th"
          ? "* กรุณากรอก รหัสพนักงาน"
          : "* Please enter your emp code"
      ),
      position: Yup.string().required(
        Storage.GetLanguage() === "th"
          ? "* กรุณากรอก ตำแหน่ง"
          : "* Please enter your position"
      ),
    }),
    onSubmit: (values) => {
      if (values.userName.split(" ").length > 1) {
        setIsUserSpace(true);
      }
      setIsBack(false);
      if (
        !errorCurrentPassword &&
        !errorPassword &&
        !errorPassword1 &&
        !errorPassword2 &&
        !errorPassword3 &&
        !errorPassword4 &&
        !errorPassword5 &&
        values.userName.split(" ").length === 1
      ) {
        if (isNew) {
          formik.values.role =
            formik.values.role === "" ? "1" : formik.values.role;
          formik.values.addBy = sessionStorage.getItem("user");
          axios.post("users", values).then((res) => {
            if (res.data.status) {
              setIsNew(false);
              formik.values.id = res.data.tbUser.id;
              setenablePassword(true);
              formik.setFieldValue("confirmPassword", "");
              formik.setFieldValue("password", "");
              setIsModified(false);
              if (isBack) history.push("/admin/users");
              if (modalIsOpenEdit) history.push("/admin/users");
              else history.push(`/admin/usersinfo/${res.data.tbUser.id}`);

              // formik.setFieldValue("currentPassword", "");
              // formik.resetForm();
              // fetchData();
              addToast(
                Storage.GetLanguage() === "th"
                  ? "บันทึกข้อมูลสำเร็จ"
                  : "Save data successfully",
                { appearance: "success", autoDismiss: true }
              );
              setConfirmPassword(false);
            } else {
              setIsOpenEdit(false);
              addToast(
                Storage.GetLanguage() === "th"
                  ? res.data.message
                  : res.data.message,
                { appearance: "warning", autoDismiss: true }
              );
            }
          });
        } else {
          formik.values.role =
            formik.values.role === "" ? "1" : formik.values.role;
          formik.values.updateBy = sessionStorage.getItem("user");
          axios.put("users", values).then((res) => {
            if (res.data.status) {
              setenablePassword(true);
              setPoorPassword(false);
              setWeakPassword(false);
              setStrongPassword(false);
              setIsModified(false);
              formik.resetForm();
              fetchData();
              setConfirmPassword(false);
              setIsOpenEdit(false);

              if (isBack) history.push("/admin/users");
              if (modalIsOpenEdit) history.push("/admin/users");
              // formik.setFieldValue("confirmPassword", "");
              // formik.setFieldValue("password", "");
              // formik.setFieldValue("currentPassword", "");
              addToast(
                Storage.GetLanguage() === "th"
                  ? "บันทึกข้อมูลสำเร็จ"
                  : "Save data successfully",
                { appearance: "success", autoDismiss: true }
              );
              setConfirmPassword(false);
            } else if (res.data.isMatch === false) {
              addToast(
                "บันทึกข้อมูลไม่สำเร็จ เนื่องจากรหัสผ่านปัจจุบันไม่ถูกต้อง",
                { appearance: "warning", autoDismiss: true }
              );
            } else {
              addToast(
                Storage.GetLanguage() === "th"
                  ? res.data.message
                  : res.data.message,
                { appearance: "warning", autoDismiss: true }
              );
            }
          });
        }
      }
    },
  });

  async function fetchData() {
    let response = await axios.get(`/users/byId/${id}`);
    let user = await response.data.tbUser;
    formik.resetForm();
    setValueConfirm("");
    validateConfirm("");
    if (user !== null) {
      for (var columns in response.data.tbUser) {
        if (columns !== "password") {
          formik.setFieldValue(columns, response.data.tbUser[columns], false);
        }
        // if(columns === "role") {
        // }
      }
      setIsNew(false);
      // setValueConfirm(response.data.tbUser.password);
      setenablePassword(true);
      setConfirmPassword(false);
    } else {
      setenablePassword(false);
      setIsNew(true);
    }
  }

  useEffect(() => {
    /* Default Value for Testing */
    // formik.values.firstName = "ชาคริต";
    // formik.values.lastName = "กันพรมกาศ";
    // formik.values.identityCard = "1-5099-00956-04-8";
    // formik.values.email = "weatherzilla@gmail.com";
    // formik.values.userName = "weatherzilla";
    // formik.values.empCode = "CM56-218";
    // formik.values.position = "โปรแกรมเมอร์";
    fetchData();
  }, []);

  return (
    <>
      <div className="flex flex-warp">
        <span className="text-base font-bold margin-auto-t-b">
          <i className="fas fa-user-friends"></i>&nbsp;
        </span>
        <span className="text-base margin-auto font-bold">
          จัดการผู้ดูแลระบบ
        </span>
      </div>
      <div className="w-full">
        <form>
          <div className="w-full">
            <div className="flex justify-between py-2 mt-4">
              <span className="text-lg  text-green-mbk margin-auto font-bold">
                เพิ่ม / แก้ไข ข้อมูลผู้ดูแลระบบ
              </span>
              <div
                className={
                  "margin-auto-t-b" + (width < 1024 ? " hidden" : " block")
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
                        "bg-gold-mbk text-white active:bg-gold-mbk font-bold uppercase text-sm px-2 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                      }
                      type="button"
                      onClick={() => {
                        if (!enablePassword) {
                          if (
                            formik.values.password === "" ||
                            formik.values.password === undefined
                          )
                            setErrorPassword(true);
                          if (
                            (formik.values.currentPassword === "" ||
                              formik.values.currentPassword === undefined) &&
                            !isNew
                          )
                            seterrorCurrentPassword(true);
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
                  "margin-auto-t-b" + (width < 1024 ? " block" : " hidden")
                }
              >
                <button
                  // data-dropdown-toggle="dropdownmenu"
                  className="flex items-center py-4 px-2 w-full text-base font-normal bg-transparent outline-none button-focus"
                  type="button"
                  // onClick={() => ClickMenu()}
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
                    <li>
                      <div className="flex flex-wrap" id="save">
                        <span
                          id="save"
                          onClick={() => {
                            if (!enablePassword) {
                              if (
                                formik.values.password === "" ||
                                formik.values.password === undefined
                              )
                                setErrorPassword(true);
                              if (
                                (formik.values.currentPassword === "" ||
                                  formik.values.currentPassword ===
                                    undefined) &&
                                !isNew
                              )
                                seterrorCurrentPassword(true);
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
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 border bg-white rounded-lg Overflow-info">
              <div className="flex-auto lg:px-10 py-10">
                <div className="flex flex-wrap">
                  <div className="w-full">
                    <div className="flex">
                      <div className="w-full lg:w-2/12">
                        <h6 className="text-green-mbk text-sm mt-3 mb-6 font-bold uppercase px-4">
                          Login Information
                        </h6>
                      </div>
                      <div className="w-full lg:w-8/12 px-4 mb-4 text-right">
                        <button
                          className={
                            "bg-green-mbk text-white active:bg-green-mbk font-bold uppercase text-sm px-2 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150" +
                            (isNew || !enablePassword ? " hidden" : "")
                          }
                          type="button"
                          onClick={() => {
                            setenablePassword(false);
                          }}
                        >
                          เปลี่ยนแปลงรหัสผ่าน
                        </button>
                        <button
                          className={
                            "bg-rose-mbk text-white active:bg-rose-mbk font-bold uppercase text-sm px-2 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150" +
                            (isNew || enablePassword ? " hidden" : "")
                          }
                          type="button"
                          onClick={() => {
                            setenablePassword(true);
                            seterrorCurrentPassword(false);
                            setErrorPassword(false);
                            setConfirmPassword(false);
                            setErrorPassword1(false);
                            setErrorPassword2(false);
                            setErrorPassword3(false);
                            setErrorPassword4(false);
                            setErrorPassword5(false);
                            setWeakPassword(false);
                            setPoorPassword(false);
                            setStrongPassword(false);
                            formik.values.currentPassword = "";
                            formik.values.confirmPassword = "";
                            formik.values.password = "";
                          }}
                        >
                          ยกเลิกเปลี่ยนแปลงรหัสผ่าน
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="w-full lg:w-2/12 px-4 margin-auto-t-b ">
                    <div className="relative w-full">
                      <label
                        className="text-blueGray-600 text-sm font-bold"
                        htmlFor="grid-password"
                      >
                        Username
                      </label>
                      <span className="text-sm ml-2 text-red-500">*</span>
                    </div>
                  </div>
                  <div className="w-full lg:w-8/12 px-4 margin-auto-t-b">
                    <div className="relative w-full">
                      <input
                        type="text"
                        className="border-0 px-2 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        id="userName"
                        name="userName"
                        maxLength={50}
                        onChange={(e) => {
                          if (e.target.value.split(" ").length > 1) {
                            setIsUserSpace(true);
                          } else {
                            setIsUserSpace(false);
                          }
                          formik.handleChange(e);
                          setIsModified(true);
                        }}
                        onBlur={formik.handleBlur}
                        value={formik.values.userName}
                        autoComplete="off"
                        disabled={isNew ? false : true}
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-2/12 px-4 mb-4 ">
                    <div className="relative w-full"></div>
                  </div>
                  <div className="w-full lg:w-8/12 px-4 margin-auto-t-b">
                    <div className="relative w-full mb-2">
                      {formik.touched.userName && formik.errors.userName ? (
                        <div className="text-sm py-2 px-2 text-red-500">
                          {formik.errors.userName}
                        </div>
                      ) : null}
                      {isUserSpace ? (
                        <div className="text-sm py-2 px-2 text-red-500">
                          Username จะต้องไม่มีค่าว่าง
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div
                    className={
                      "w-full lg:w-2/12 px-4 margin-auto-t-b " +
                      (isNew ? " hidden" : " ")
                    }
                  >
                    <div className="relative w-full ">
                      <label
                        className="text-blueGray-600 text-sm font-bold"
                        htmlFor="grid-password"
                      >
                        Current Password
                      </label>
                      <span className="text-sm ml-2 text-red-500">*</span>
                    </div>
                  </div>
                  <div
                    className={
                      "w-full lg:w-8/12 px-4 margin-auto-t-b " +
                      (isNew ? " hidden" : " ")
                    }
                  >
                    <div className="relative w-full">
                      <span
                        onClick={toggleCurrentPassword}
                        className="z-3 h-full leading-snug font-normal text-blueGray-600 absolute right-2  bg-transparent text-sm py-2"
                      >
                        <i
                          className={
                            currentpasswordShown
                              ? "fas fa-eye-slash"
                              : "fas fa-eye"
                          }
                        ></i>
                      </span>
                      <input
                        type={currentpasswordShown ? "text" : "password"}
                        className="border-0 px-2 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        id="currentPassword"
                        name="currentPassword"
                        maxLength={50}
                        onChange={(e) => {
                          formik.handleChange(e);
                          setIsModified(true);

                          if (e.target.value.length <= 0)
                            seterrorCurrentPassword(true);
                          else seterrorCurrentPassword(false);
                        }}
                        onBlur={formik.handleBlur}
                        value={formik.values.currentPassword}
                        autoComplete="password"
                        disabled={enablePassword}
                      />
                    </div>
                  </div>
                  <div
                    className={
                      "w-full lg:w-2/12 px-4 mb-4" + (isNew ? " hidden" : " ")
                    }
                  >
                    <div className="relative w-full"></div>
                  </div>
                  <div
                    className={
                      "w-full lg:w-8/12 px-4 margin-auto-t-b" +
                      (isNew ? " hidden" : " ")
                    }
                  >
                    <div className="relative w-full mb-2">
                      {errorCurrentPassword ? (
                        <div className="text-sm py-2 px-2 text-red-500">
                          * กรุณาทำการกรอก Current Password
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="w-full lg:w-2/12 px-4 margin-auto-t-b">
                    <div className="relative w-full">
                      <label
                        className="text-blueGray-600 text-sm font-bold"
                        htmlFor="grid-password"
                      >
                        Password
                      </label>
                      <span className="text-sm ml-2 text-red-500">*</span>
                      <div
                        className={
                          strongPassword || weakPassword || poorPassword
                            ? " "
                            : " hidden "
                        }
                      >
                        &nbsp;
                      </div>
                    </div>
                  </div>
                  <div className="w-full lg:w-8/12 px-4 margin-auto-t-b">
                    <div className="relative w-full">
                      <span
                        onClick={togglePassword}
                        className="z-3 h-full leading-snug font-normal text-blueGray-600 absolute right-2  bg-transparent text-sm py-2"
                      >
                        <i
                          className={
                            passwordShown ? "fas fa-eye-slash" : "fas fa-eye"
                          }
                        ></i>
                      </span>
                      <input
                        type={passwordShown ? "text" : "password"}
                        className="border-0 px-2 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        id="password"
                        name="password"
                        maxLength={50}
                        onChange={(e) => {
                          setIsModified(true);
                          const poorPassword = poorRegExp.test(e.target.value);
                          const weakPassword = weakRegExp.test(e.target.value);
                          const strongPassword = strongRegExp.test(
                            e.target.value
                          );
                          const whitespace = whitespaceRegExp.test(
                            e.target.value
                          );

                          setPoorPassword(
                            poorRegExp.test(e.target.value) ||
                              weakRegExp.test(e.target.value)
                          );
                          setWeakPassword(
                            weakRegExp.test(e.target.value) &&
                              poorRegExp.test(e.target.value)
                          );
                          setStrongPassword(strongRegExp.test(e.target.value));

                          setErrorPassword1(!poorPassword);
                          setErrorPassword2(!weakPassword);
                          setErrorPassword3(!strongPassword);
                          setErrorPassword4(
                            e.target.value.length < 8 ? true : false
                          );
                          setErrorPassword5(whitespace);
                          if (e.target.value !== valueConfirm) {
                            setConfirmPassword(true);
                          } else if (
                            e.target.value === "" &&
                            valueConfirm === ""
                          ) {
                            setConfirmPassword(null);
                          } else if (e.target.value === valueConfirm)
                            setConfirmPassword(false);
                          formik.handleChange(e);

                          if (e.target.value.length <= 0)
                            setErrorPassword(true);
                          else setErrorPassword(false);
                        }}
                        // onBlur={() => { if(formik.values.password.length <= 0) setErrorPassword(true); else  setErrorPassword(false);  }}\
                        value={formik.values.password}
                        autoComplete="password"
                        disabled={enablePassword}
                      />
                      <ul
                        className={
                          "flex flex-wrap mt-2 " +
                          (strongPassword || weakPassword || poorPassword
                            ? " "
                            : " hidden ")
                        }
                      >
                        <li
                          className={
                            " w-full lg:w-4/12 " +
                            (poorPassword ? " " : " hidden") +
                            (strongPassword && weakPassword && poorPassword
                              ? " bg-green-500"
                              : weakPassword && poorPassword
                              ? " bg-yellow-500"
                              : " bg-red-500")
                          }
                          style={{
                            height: "0.5rem",
                            borderTopLeftRadius: "0.25rem",
                            borderBottomLeftRadius: "0.25rem",
                          }}
                        >
                          &nbsp;
                        </li>
                        <li
                          className={
                            " w-full lg:w-4/12 " +
                            (weakPassword && poorPassword ? " " : " hidden ") +
                            (strongPassword && weakPassword && poorPassword
                              ? " bg-green-500"
                              : weakPassword && poorPassword
                              ? " bg-yellow-500"
                              : " bg-red-500")
                          }
                          style={{ height: "0.5rem" }}
                        >
                          &nbsp;
                        </li>
                        <li
                          className={
                            " w-full lg:w-4/12" +
                            (strongPassword && weakPassword && poorPassword
                              ? " "
                              : " hidden ") +
                            (strongPassword && weakPassword && poorPassword
                              ? " bg-green-500"
                              : weakPassword && poorPassword
                              ? " bg-yellow-500"
                              : " bg-red-500")
                          }
                          style={{
                            height: "0.5rem",
                            borderTopRightRadius: "0.25rem",
                            borderBottomRightRadius: "0.25rem",
                          }}
                        >
                          &nbsp;
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="w-full lg:w-2/12 px-4 mb-4 ">
                    <div className="relative w-full"></div>
                  </div>
                  <div className="w-full lg:w-8/12 px-4 margin-auto-t-b">
                    <div className="relative w-full mb-1">
                      {errorPassword ? (
                        <div className="text-sm py-2 px-2 text-red-500">
                          * Password ไม่สามารถเป็นค่าว่างได้
                        </div>
                      ) : null}
                    </div>
                    <div className="relative w-full mb-1">
                      {errorPassword1 ? (
                        <div className="text-sm py-2 px-2 text-red-500">
                          {"* ตัวอักษร (a-z, A-Z)"}
                        </div>
                      ) : null}
                    </div>
                    <div className="relative w-full mb-1">
                      {errorPassword2 ? (
                        <div className="text-sm py-2 px-2 text-red-500">
                          {"* ตัวเลข (0-9)"}
                        </div>
                      ) : null}
                    </div>
                    <div className="relative w-full mb-1">
                      {errorPassword3 ? (
                        <div className="text-sm py-2 px-2 text-red-500">
                          {"* เครื่องหมายหรืออักขระพิเศษ  (#?!@$%^&*-)"}
                        </div>
                      ) : null}
                    </div>
                    <div className="relative w-full mb-1">
                      {errorPassword4 ? (
                        <div className="text-sm py-2 px-2 text-red-500">
                          {"* รหัสผ่านต้องไม่น้อยกว่า 8 ตัวอักษร"}
                        </div>
                      ) : null}
                    </div>
                    <div className="relative w-full mb-1">
                      {errorPassword5 ? (
                        <div className="text-sm py-2 px-2 text-red-500">
                          {"* รหัสผ่านต้องไม่มีค่าว่าง"}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className={"w-full lg:w-2/12 px-4 margin-auto-t-b"}>
                    <div className="relative w-full">
                      <label
                        className="text-blueGray-600 text-sm font-bold"
                        htmlFor="grid-password"
                      >
                        Confirm Password
                      </label>
                      <span className="text-sm ml-2 text-red-500">*</span>
                    </div>
                  </div>
                  <div className={"w-full lg:w-8/12 px-4 margin-auto-t-b"}>
                    <div className="relative w-full">
                      <span
                        onClick={toggleConfirmPassword}
                        className="z-3 h-full leading-snug font-normal text-blueGray-600 absolute right-2  bg-transparent text-sm py-2"
                      >
                        <i
                          className={
                            confirmpasswordShown
                              ? "fas fa-eye-slash"
                              : "fas fa-eye"
                          }
                        ></i>
                      </span>
                      <input
                        type={confirmpasswordShown ? "text" : "password"}
                        className="border-0 px-2 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        id="confirmPassword"
                        name="confirmPassword"
                        onBlur={formik.handleBlur}
                        autoComplete="confirmPassword"
                        maxLength={50}
                        onChange={(e) => {
                          formik.handleChange(e);
                          setIsModified(true);
                          validateConfirm(e.target.value);
                          setValueConfirm(e.target.value);
                        }}
                        value={formik.values.confirmPassword}
                        disabled={enablePassword}
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-2/12 px-4 mb-4 ">
                    <div className="relative w-full"></div>
                  </div>
                  <div className="w-full lg:w-8/12 px-4 margin-auto-t-b">
                    <div className="relative w-full mb-2">
                      {confirmPassword ? (
                        <div className="text-sm py-2 px-2 text-red-500">
                          * Password ไม่ตรงกัน
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="w-full">
                    <h6 className="text-green-mbk text-sm mt-3 mb-6 font-bold uppercase px-4">
                      User Information
                    </h6>
                  </div>
                  <div className="w-full lg:w-2/12 px-4 margin-auto-t-b">
                    <div className="relative w-full">
                      <label
                        className="text-blueGray-600 text-sm font-bold"
                        htmlFor="grid-password"
                      >
                        User Role
                      </label>
                      <span className="text-sm ml-2 text-red-500">*</span>
                    </div>
                  </div>
                  <div className="w-full lg:w-8/12 px-4 margin-auto-t-b">
                    <div className="relative w-full">
                      {/* <Select
                        id="role"
                        name="role"
                        onChange={(value) => {
                          formik.setFieldValue("role", value.value);
                          setIsModified(true);
                        }}
                        className="border-0 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        options={options}
                        value={ValidateService.defaultValue(
                          options,
                          formik.values.role
                        )}
                        styles={useStyle}
                      /> */}
                      <SelectUC
                        isDisabled={
                          formik.values.userName === "admin" ? true : false
                        }
                        name="role"
                        onChange={(value) => {
                          formik.setFieldValue("role", value.value);
                          setIsModified(true);
                        }}
                        options={options}
                        value={ValidateService.defaultValue(
                          options,
                          formik.values.role
                        )}
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-2/12 px-4 mb-4 ">
                    <div className="relative w-full"></div>
                  </div>
                  <div className="w-full lg:w-8/12 px-4 margin-auto-t-b">
                    <div className="relative w-full mb-2"></div>
                  </div>
                  <div className="w-full lg:w-2/12 px-4 margin-auto-t-b">
                    <div className="relative w-full ">
                      <label
                        className="text-blueGray-600 text-sm font-bold mb-2"
                        htmlFor="grid-password"
                      >
                        ชื่อ
                      </label>
                      <span className="text-sm ml-2 text-red-500">*</span>
                    </div>
                  </div>
                  <div className="w-full lg:w-8/12 px-4 margin-auto-t-b">
                    <div className="relative w-full ">
                      <input
                        type="text"
                        className="border-0 px-2 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        id="firstName"
                        name="firstName"
                        maxLength={100}
                        onChange={(e) => {
                          formik.handleChange(e);
                          setIsModified(true);
                        }}
                        onBlur={formik.handleBlur}
                        value={formik.values.firstName}
                        autoComplete="firstName"
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-2/12 px-4 mb-4 ">
                    <div className="relative w-full"></div>
                  </div>
                  <div className="w-full lg:w-8/12 px-4 margin-auto-t-b">
                    <div className="relative w-full mb-2">
                      {formik.touched.firstName && formik.errors.firstName ? (
                        <div className="text-sm py-2 px-2 text-red-500">
                          {formik.errors.firstName}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="w-full lg:w-2/12 px-4 margin-auto-t-b">
                    <div className="relative w-full">
                      <label
                        className="uppercase text-blueGray-600 text-sm font-bold mb-2"
                        htmlFor="grid-password"
                      >
                        นามสกุล
                      </label>
                      <span className="text-sm ml-2 text-red-500">*</span>
                    </div>
                  </div>
                  <div className="w-full lg:w-8/12 px-4 margin-auto-t-b">
                    <div className="relative w-full">
                      <input
                        type="text"
                        className="border-0 px-2 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        id="lastName"
                        name="lastName"
                        maxLength={100}
                        onChange={(e) => {
                          formik.handleChange(e);
                          setIsModified(true);
                        }}
                        onBlur={formik.handleBlur}
                        value={formik.values.lastName}
                        autoComplete="lastName"
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-2/12 px-4 mb-4 ">
                    <div className="relative w-full"></div>
                  </div>
                  <div className="w-full lg:w-8/12 px-4 margin-auto-t-b">
                    <div className="relative w-full mb-2">
                      {formik.touched.lastName && formik.errors.lastName ? (
                        <div className="text-sm py-2 px-2 text-red-500">
                          {formik.errors.lastName}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="w-full lg:w-2/12 px-4 margin-auto-t-b">
                    <div className="relative w-full">
                      <label
                        className="text-blueGray-600 text-sm font-bold"
                        htmlFor="grid-password"
                      >
                        Email
                      </label>
                      <span className="text-sm ml-2 text-red-500">*</span>
                    </div>
                  </div>
                  <div className="w-full lg:w-8/12 px-4 margin-auto-t-b">
                    <div className="relative w-full">
                      <input
                        type="email"
                        className="border-0 px-2 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        id="email"
                        name="email"
                        maxLength={100}
                        onChange={(e) => {
                          formik.handleChange(e);
                          setIsModified(true);
                        }}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                        autoComplete="emailaddress"
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-2/12 px-4 mb-4 ">
                    <div className="relative w-full"></div>
                  </div>
                  <div className="w-full lg:w-8/12 px-4 margin-auto-t-b">
                    <div className="relative w-full mb-2">
                      {formik.touched.email && formik.errors.email ? (
                        <div className="text-sm py-2 px-2 text-red-500">
                          {formik.errors.email}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  {/* <div className="w-full lg:w-2/12 px-4 mb-2">
                    <div className="relative w-full">
                      <label
                        className="text-blueGray-600 text-sm font-bold"
                        htmlFor="grid-password"
                      >
                        เลขบัตรประชาชน
                      </label>
                      <span className="text-sm ml-2 text-red-500">*</span>
                    </div>
                  </div>
                  <div className="w-full lg:w-8/12 px-4 mb-4">
                    <div className="relative w-full">
                      <input
                        type="text"
                        className="border-0 px-2 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        id="identityCard"
                        name="identityCard"
                        maxLength={17}
                        onChange={(event) => {
                          onHandleIdentityCardChange(event);
                        }}
                        onBlur={formik.handleBlur}
                        value={formik.values.identityCard}
                        autoComplete="new-password"
                      />
                    </div>
                  </div> */}
                  <div className="w-full lg:w-2/12 px-4 margin-auto-t-b">
                    <div className="relative w-full">
                      <label
                        className="text-blueGray-600 text-sm font-bold"
                        htmlFor="grid-password"
                      >
                        รหัสพนักงาน
                      </label>
                      <span className="text-sm ml-2 text-red-500">*</span>
                    </div>
                  </div>
                  <div className="w-full lg:w-8/12 px-4 margin-auto-t-b">
                    <div className="relative w-full">
                      <input
                        type="text"
                        className="border-0 px-2 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        id="empCode"
                        name="empCode"
                        maxLength={100}
                        onChange={(e) => {
                          formik.handleChange(e);
                          setIsModified(true);
                        }}
                        onBlur={formik.handleBlur}
                        value={formik.values.empCode}
                        autoComplete="new-password"
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-2/12 px-4 mb-4 ">
                    <div className="relative w-full"></div>
                  </div>
                  <div className="w-full lg:w-8/12 px-4 margin-auto-t-b">
                    <div className="relative w-full mb-2">
                      {formik.touched.empCode && formik.errors.empCode ? (
                        <div className="text-sm py-2 px-2 text-red-500">
                          {formik.errors.empCode}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="w-full lg:w-2/12 px-4 margin-auto-t-b">
                    <div className="relative w-full">
                      <label
                        className="text-blueGray-600 text-sm font-bold"
                        htmlFor="grid-password"
                      >
                        ตำแหน่ง
                      </label>
                      <span className="text-sm ml-2 text-red-500">*</span>
                    </div>
                  </div>
                  <div className="w-full lg:w-8/12 px-4 margin-auto-t-b">
                    <div className="relative w-full">
                      <input
                        type="text"
                        className="border-0 px-2 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        id="position"
                        name="position"
                        maxLength={100}
                        onChange={(e) => {
                          formik.handleChange(e);
                          setIsModified(true);
                        }}
                        onBlur={formik.handleBlur}
                        value={formik.values.position}
                        autoComplete="new-password"
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-2/12 px-4 mb-4 ">
                    <div className="relative w-full"></div>
                  </div>
                  <div className="w-full lg:w-8/12 px-4 margin-auto-t-b">
                    <div className="relative w-full mb-2">
                      {formik.touched.position && formik.errors.position ? (
                        <div className="text-sm py-2 px-2 text-red-500">
                          {formik.errors.position}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
                {/*  <hr className="mt-10 mb-10 mx-auto w-10/12 border-b-1 border-blueGray-300" /> */}

                {/* <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase px-4">
                  Login Information
                </h6> */}
              </div>
            </div>
          </div>
        </form>
      </div>
      <ConfirmEdit
        showModal={modalIsOpenEdit}
        message={"ผู้ดูแลระบบ"}
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
