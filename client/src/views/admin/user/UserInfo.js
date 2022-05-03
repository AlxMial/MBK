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
import * as Storage from "../../../services/Storage.service";
import styleSelect from "assets/styles/theme/ReactSelect.js";

export default function UserInfo() {
  /* Option Select */
  const options = [
    { value: "1", label: "ผู้ดูแลระบบ" },
    { value: "2", label: "บัญชี" },
    { value: "3", label: "การตลาด" },
  ];

  /* Service Function */
  const { height, width } = useWindowDimensions();
  let { id } = useParams();

  /* RegEx formatter */
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const EmailRegExp = /^[A-Za-z0-9_.@]+$/;

  /* Set useState */
  const [inputIdentityCard, setinputIdentityCard] = useState();
  const [confirmPassword, setConfirmPassword] = useState(false);
  const [valueConfirm, setValueConfirm] = useState("");
  const [enableControl, setIsEnableControl] = useState(true);
  const [isNew, setIsNew] = useState(false);
  const useStyle = styleSelect();
  let history = useHistory();
  const { addToast } = useToasts();

  /* Method Condition */

  /*ตรวจสอบข้อมูล รหัสผ่านตรงกัน*/
  const validateConfirm = (e) => {
    if (e !== formik.values.password) setConfirmPassword(true);
    else setConfirmPassword(false);
  };

  const OnBack = () => {
    history.push("/admin/users");
  };

  const onHandleIdentityCardChange = (e) => {
    var identity = ValidateService.onHandleIdentityCard(e.target.value);
    setinputIdentityCard(identity);
    formik.values.identityCard = identity;
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
    },
    validationSchema: Yup.object({
      userName: Yup.string().required(
        Storage.GetLanguage() === "th"
          ? "* กรุณากรอก รหัสบัญชีผู้ใช้"
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
            ? "* รูปแบบอีเมลไม่ถูกต้อง"
            : "Invalid email format"
        )
        .required(
          Storage.GetLanguage() === "th"
            ? "* กรุณากรอก อีเมล"
            : "* Please enter your email"
        ),
      password: Yup.string().required(
        Storage.GetLanguage() === "th"
          ? "* กรุณากรอก รหัสผ่าน"
          : "* Please enter your password"
      ),
    }),
    onSubmit: (values) => {
      if (isNew) {
        formik.values.role =
          formik.values.role === "" ? "1" : formik.values.role;
        axios.post("users", values).then((res) => {
          if (res.data.status) {
            setIsNew(false);
            formik.values.id = res.data.tbUser.id;
            history.push(`/admin/usersinfo/${res.data.tbUser.id}`);
            addToast(
              Storage.GetLanguage() === "th"
                ? "บันทึกข้อมูลสำเร็จ"
                : "Save data successfully",
              { appearance: "success", autoDismiss: true }
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
      } else {
        formik.values.role =
          formik.values.role === "" ? "1" : formik.values.role;
        axios.put("users", values).then((res) => {
          if (res.data.status) {
            addToast(
              Storage.GetLanguage() === "th"
                ? "บันทึกข้อมูลสำเร็จ"
                : "Save data successfully",
              { appearance: "success", autoDismiss: true }
            );
          } else
            addToast(
              Storage.GetLanguage() === "th"
                ? res.data.message
                : res.data.message,
              { appearance: "warning", autoDismiss: true }
            );
        });
      }
    },
  });

  async function fetchData() {
    let response = await axios.get(`/users/byId/${id}`);
    let user = await response.data.tbUser;
    if (user !== null) {
      for (var columns in response.data.tbUser) {
        formik.setFieldValue(columns, response.data.tbUser[columns], false);
      }
      setIsNew(false);
      setValueConfirm(response.data.tbUser.password);
    } else {
      setIsNew(true);
    }
  }

  useEffect(() => {
    /* Default Value for Testing */
    // formik.values.firstName = "ชาคริต";
    // formik.values.lastName = "กันพรมกาศ";
    // formik.values.identityCard = "1-5099-00956-04-8";
    // formik.values.email = "weatherzilla@gmail.com";
    // formik.values.userName = "weatherblocker";
    // formik.values.password = "123456";
    // setValueConfirm("123456");
    fetchData();
  }, []);

  return (
    <>
      <div className="flex flex-warp">
        <span className="text-base font-bold margin-auto-t-b">
          <i className="fas fa-user-circle"></i>&nbsp;
        </span>
        <span className="text-base margin-auto font-bold">ข้อมูลผู้ใช้</span>
      </div>
      <div className="w-full">
        <form onSubmit={formik.handleSubmit}>
          <div className="w-full">
            <div className="flex justify-between py-2 mt-4">
              <span className="text-lg  text-green-mbk margin-auto font-bold">
                จัดการข้อมูลผู้ใช้
              </span>
              {/* <div
              className={
                "margin-auto-t-b" + (width < 1024 ? " hidden" : " block")
              }
            > */}

              {/* </div> */}
              {/* <div
              className={
                "margin-auto-t-b" + (width < 1024 ? " block" : " hidden")
              }
            >
              <button
                id="dropdownDefault"
                data-dropdown-toggle="dropdownmenu"
                className="flex items-center py-4 px-2 w-full text-base font-normal bg-transparent outline-none button-focus"
                type="button"
              >
                <i className="fas fa-bars"></i>
              </button>
              <div
                id="dropdownmenu"
                className="hidden z-10 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 buttonInfo"
              >
                <ul
                  className="py-1 text-sm text-gray-700 dark:text-gray-200"
                  aria-labelledby="dropdownDefault"
                >
                  <li>
                    <div className="flex flex-wrap">
                      <span className="block py-2 pl-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white font-bold text-sm w-2/12 text-center">
                        <i className="fas fa-save"></i>
                      </span>
                      <span className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white font-bold text-sm w-8/12">
                        บันทึก
                      </span>
                    </div>
                  </li>
                  <li>
                    <div className="flex flex-wrap">
                      <span className="block py-2 pl-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white font-bold text-sm w-2/12 text-center">
                        <i className="fas fa-arrow-left"></i>
                      </span>
                      <span className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white font-bold text-sm w-8/12">
                        ย้อนกลับ
                      </span>
                    </div>
                  </li>
                  <li>
                    <div className="flex flex-wrap">
                      <span className="block py-2 pl-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white font-bold text-sm w-2/12 text-center">
                        <i className="fas fa-edit"></i>
                      </span>
                      <span className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white font-bold text-sm w-8/12">
                        แก้ไข
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
            </div> */}
            </div>
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 border bg-white rounded-lg">
              {/* <div className="rounded-t bg-white mb-0 px-2 py-4">
                <div className="flex justify-between">
                  <div className="margin-auto-t-b">
                    <h6 className="text-blueGray-700 text-lg font-bold ">
                      จัดการข้อมูลผู้ใช้
                    </h6>
                  </div>
           
                  <div
                    className={
                      "margin-auto-t-b" + (width < 1024 ? " hidden" : " block")
                    }
                  >
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
                      type="submit"
                    >
                      บันทึกข้อมูล
                    </button>
                  </div>
                  <div
                    className={
                      "margin-auto-t-b" + (width < 1024 ? " block" : " hidden")
                    }
                  >

                    <button
                      id="dropdownDefault"
                      data-dropdown-toggle="dropdown"
                      className="flex items-center py-4 px-2 w-full text-base font-normal bg-transparent outline-none button-focus"
                      type="button"
                    >
                      <i className="fas fa-bars"></i>
                    </button>
                    <div
                      id="dropdown"
                      className="hidden z-10 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 buttonInfo"
                    >
                      <ul
                        className="py-1 text-sm text-gray-700 dark:text-gray-200"
                        aria-labelledby="dropdownDefault"
                      >
                        <li>
                          <div className="flex flex-wrap">
                            <span className="block py-2 pl-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white font-bold text-sm w-2/12 text-center">
                              <i className="fas fa-save"></i>
                            </span>
                            <span className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white font-bold text-sm w-8/12">
                              บันทึก
                            </span>
                          </div>
                        </li>
                        <li>
                          <div className="flex flex-wrap">
                            <span className="block py-2 pl-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white font-bold text-sm w-2/12 text-center">
                              <i className="fas fa-arrow-left"></i>
                            </span>
                            <span className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white font-bold text-sm w-8/12">
                              ย้อนกลับ
                            </span>
                          </div>
                        </li>
                        <li>
                          <div className="flex flex-wrap">
                            <span className="block py-2 pl-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white font-bold text-sm w-2/12 text-center">
                              <i className="fas fa-edit"></i>
                            </span>
                            <span className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white font-bold text-sm w-8/12">
                              แก้ไข
                            </span>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div> */}
              <div className="flex-auto lg:px-10 py-10">
                {/* <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase px-4">
                  User Information
                </h6> */}
                <div className="flex flex-wrap">
                  <div className="w-full lg:w-2/12 px-4 mb-2">
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
                  <div className="w-full lg:w-8/12 px-4 mb-4">
                    <div className="relative w-full">
                      <input
                        type="text"
                        className="border-0 px-2 py-1 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        id="userName"
                        name="userName"
                        maxLength={100}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.userName}
                        autoComplete="userName"
                      />
                      {formik.touched.userName && formik.errors.userName ? (
                        <div className="text-sm py-2 px-2 text-red-500">
                          {formik.errors.userName}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="w-full lg:w-2/12 px-4 mb-2">
                    <div className="relative w-full">
                      <label
                        className="text-blueGray-600 text-sm font-bold"
                        htmlFor="grid-password"
                      >
                        Password
                      </label>
                      <span className="text-sm ml-2 text-red-500">*</span>
                    </div>
                  </div>
                  <div className="w-full lg:w-8/12 px-4 mb-4">
                    <div className="relative w-full">
                      <input
                        type="password"
                        className="border-0 px-2 py-1 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        id="password"
                        name="password"
                        maxLength={100}
                        onChange={(e) => {
                          if (e.target.value !== valueConfirm) {
                            setConfirmPassword(e.target.value);
                          } else if (
                            e.target.value === "" &&
                            valueConfirm === ""
                          ) {
                            setConfirmPassword(null);
                          }
                          formik.handleChange(e);
                        }}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                        autoComplete="password"
                      />
                      {formik.touched.password && formik.errors.password ? (
                        <div className="text-sm py-2 px-2 text-red-500">
                          {formik.errors.password}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="w-full lg:w-2/12 px-4 mb-2">
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
                  <div className="w-full lg:w-8/12 px-4 mb-4">
                    <div className="relative w-full">
                      <input
                        type="password"
                        className="border-0 px-2 py-1 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        id="confirmPassword"
                        name="confirmPassword"
                        onBlur={formik.handleBlur}
                        autoComplete="confirmPassword"
                        maxLength={100}
                        onChange={(e) => {
                          validateConfirm(e.target.value);
                          setValueConfirm(e.target.value);
                        }}
                        value={valueConfirm}
                      />
                      {confirmPassword ? (
                        <div className="text-sm py-2 px-2 text-red-500">
                          * รหัสผ่านไม่ตรงกัน
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="w-full lg:w-2/12 px-4 mb-2">
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
                  <div className="w-full lg:w-8/12 px-4 mb-4">
                    <div className="relative w-full">
                      <Select
                        id="role"
                        name="role"
                        onChange={(value) => {
                          formik.setFieldValue("role", value.value);
                        }}
                        className="border-0 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        options={options}
                        value={ValidateService.defaultValue(
                          options,
                          formik.values.role
                        )}
                        styles={useStyle}
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-2/12 px-4 mb-2">
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
                  <div className="w-full lg:w-8/12 px-4 mb-4">
                    <div className="relative w-full ">
                      <input
                        type="text"
                        className="border-0 px-2 py-1 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        id="firstName"
                        name="firstName"
                        maxLength={100}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.firstName}
                        autoComplete="firstName"
                      />
                      {formik.touched.firstName && formik.errors.firstName ? (
                        <div className="text-sm py-2 px-2 text-red-500">
                          {formik.errors.firstName}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="w-full lg:w-2/12 px-4 mb-2">
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
                  <div className="w-full lg:w-8/12 px-4 mb-4">
                    <div className="relative w-full">
                      <input
                        type="text"
                        className="border-0 px-2 py-1 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        id="lastName"
                        name="lastName"
                        maxLength={100}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.lastName}
                        autoComplete="lastName"
                      />
                      {formik.touched.lastName && formik.errors.lastName ? (
                        <div className="text-sm py-2 px-2 text-red-500">
                          {formik.errors.lastName}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="w-full lg:w-2/12 px-4 mb-2">
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
                  <div className="w-full lg:w-8/12 px-4 mb-4">
                    <div className="relative w-full">
                      <input
                        type="email"
                        className="border-0 px-2 py-1 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        id="email"
                        name="email"
                        maxLength={100}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                        autoComplete="emailaddress"
                      />
                      {formik.touched.email && formik.errors.email ? (
                        <div className="text-sm py-2 px-2 text-red-500">
                          {formik.errors.email}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="w-full lg:w-2/12 px-4 mb-2">
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
                        className="border-0 px-2 py-1 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
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
                  </div>
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
                        type="submit"
                      >
                        บันทึกข้อมูล
                      </button>
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
    </>
  );
}
