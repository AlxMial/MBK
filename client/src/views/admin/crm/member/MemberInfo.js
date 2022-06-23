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
import { DatePicker, ConfigProvider } from "antd";
import * as Address from "../../../../services/GetAddress.js";
import useMenu from "services/useMenu";
import { GetPermissionByUserName } from "services/Permission";
import ConfirmEdit from "components/ConfirmDialog/ConfirmEdit";
import SelectUC from "components/SelectUC";
import DatePickerUC from "components/DatePickerUC";
import MemberHistory from "./memberHistory";

export default function MemberInfo() {
  const useStyle = styleSelect();
  /* Service Function */
  const { height, width } = useWindowDimensions();
  const { menu } = useMenu();
  let { id } = useParams();
  const [isModefied, setIsModified] = useState(false);

  /* Option Select */
  const optionsSex = [
    { value: "1", label: "ชาย" },
    { value: "2", label: "หญิง" },
  ];
  /* RegEx formatter */
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const EmailRegExp = /^[A-Za-z0-9_.@]+$/;

  /* Set useState */
  const [enableControl, setIsEnableControl] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState(0);
  const [number, setNumber] = useState(0);
  const [isNew, setIsNew] = useState(false);
  const [dataProvice, setDataProvice] = useState([]);
  const [dataDistrict, setDataDistrict] = useState([]);
  const [dataSubDistrict, setSubDistrict] = useState([]);
  const [dataProviceEng, setDataProviceEng] = useState([]);
  const [dataDistrictEng, setDataDistrictEng] = useState([]);
  const [dataSubDistrictEng, setSubDistrictEng] = useState([]);
  const [typePermission, setTypePermission] = useState("");
  const [modalIsOpenEdit, setIsOpenEdit] = useState(false);
  const [errorBirthDate, setErrorBirthDate] = useState(false);
  const [errorRegisterDate, setErrorRegisterDate] = useState(false);
  const [isClick, setIsClick] = useState(false);
  const [isClickRegister, setIsClickRegister] = useState(false);
  const [open, setOpen] = useState(false);

  let history = useHistory();
  const { addToast } = useToasts();
  /* Method Condition */
  const OnBack = () => {
    if (isModefied) {
      openModalSubject();
    } else {
      history.push("/admin/members");
    }
  };

  const OpenModal = () => {
    setOpen(true);
  };

  const handleSubmitModal = () => {
    setOpen(false);
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
    else {
      if (!isModefied) {
        history.push("/admin/members");
      }
    }
    //   history.push("/admin/members");
    // setIsModified(false);
    // history.push("/admin/members");
  };

  const onReturn = () => {
    setIsModified(false);
    history.push("/admin/members");
  };

  /*พิมพ์เบอร์โทรศัพท์*/
  const onHandleTelephoneChange = (e) => {
    if (
      ValidateService.onHandleNumberChange(e.target.value) !== "" ||
      e.target.value === ""
    ) {
      setPhoneNumber(e.target.value);
      return e;
    }
  };

  /* Form insert value */
  const formik = useFormik({
    initialValues: {
      id: "",
      memberCard: "",
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      birthDate: "",
      registerDate: "",
      address: "",
      subDistrict: "",
      district: "",
      province: "",
      country: "",
      postcode: "",
      isDeleted: false,
      uid: "",
      sex: "1",
      isMemberType: "1",
      memberPoint: 0,
      memberPointExpire: new Date(),
      memberType: "1",
      addBy: "",
      updateBy: "",
    },
    validationSchema: Yup.object({
      memberCard: Yup.string().required(
        Storage.GetLanguage() === "th"
          ? "* กรุณากรอก รหัสสมาชิก"
          : "* Please enter your รหัสสมาชิก"
      ),
      firstName: Yup.string().required(
        Storage.GetLanguage() === "th"
          ? "* กรุณากรอก ชื่อ"
          : "* Please enter your First Name"
      ),
      lastName: Yup.string().required(
        Storage.GetLanguage() === "th"
          ? "* กรุณากรอก นามสกุล"
          : "* Please enter your Last Name"
      ),
      phone: Yup.string().required(
        Storage.GetLanguage() === "th"
          ? "* กรุณากรอก เบอร์โทรศัพท์"
          : "* Please enter your Phone Number"
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
            ? "* กรุณากรอก Email"
            : "* Please enter your Email"
        ),
      // registerDate: Yup.string().required(
      //   Storage.GetLanguage() === "th"
      //     ? "* กรุณากรอก วันที่สมัคร"
      //     : "* Please enter your Register Date"
      // ),
    }),
    onSubmit: (values) => {
      if (
        new Date(formik.values.birthDate) > new Date(formik.values.registerDate)
      )
        formik.values.birthDate = formik.values.registerDate;

      if (!errorRegisterDate && !errorBirthDate) {
        if (isNew) {
          formik.values.addBy = sessionStorage.getItem("user");
          axios.post("members", values).then((res) => {
            if (res.data.status) {
              setIsNew(false);
              formik.values.id = res.data.tbMember.id;
              setIsModified(false);
              if (!modalIsOpenEdit)
                history.push(`/admin/membersinfo/${res.data.tbMember.id}`);
              else history.push("/admin/members");
              addToast(
                Storage.GetLanguage() === "th"
                  ? "บันทึกข้อมูลสำเร็จ"
                  : "Save data successfully",
                { appearance: "success", autoDismiss: true }
              );
            } else {
              setIsOpenEdit(false);
              if (res.data.isPhone) {
                addToast(
                  "บันทึกข้อมูลไม่สำเร็จ เนื่องจากเบอร์โทรศัพท์เคยมีการลงทะเบียนไว้เรียบร้อยแล้ว",
                  {
                    appearance: "warning",
                    autoDismiss: true,
                  }
                );
              } else if (res.data.isEmail) {
                addToast(
                  "บันทึกข้อมูลไม่สำเร็จ Email ซ้ำกับระบบที่เคยลงทะเบียนไว้เรียบร้อยแล้ว",
                  {
                    appearance: "warning",
                    autoDismiss: true,
                  }
                );
              } else if (res.data.isMemberCard) {
                addToast(
                  "บันทึกข้อมูลไม่สำเร็จ รหัสสมาชิกซ้ำกับระบบที่เคยลงทะเบียนไว้เรียบร้อยแล้ว",
                  {
                    appearance: "warning",
                    autoDismiss: true,
                  }
                );
              }
            }
          });
        } else {
          formik.values.updateBy = sessionStorage.getItem("user");
          axios.put("members", values).then((res) => {
            if (res.data.status) {
              setIsModified(false);
              setIsOpenEdit(false);
              if (modalIsOpenEdit) history.push("/admin/members");
              addToast(
                Storage.GetLanguage() === "th"
                  ? "บันทึกข้อมูลสำเร็จ"
                  : "Save data successfully",
                { appearance: "success", autoDismiss: true }
              );
            } else {
              setIsOpenEdit(false);
              if (res.data.isPhone) {
                addToast(
                  "บันทึกข้อมูลไม่สำเร็จ เนื่องจากเบอร์โทรศัพท์เคยมีการลงทะเบียนไว้เรียบร้อยแล้ว",
                  {
                    appearance: "warning",
                    autoDismiss: true,
                  }
                );
              } else if (res.data.isEmail) {
                addToast(
                  "บันทึกข้อมูลไม่สำเร็จ Email ซ้ำกับระบบที่เคยลงทะเบียนไว้เรียบร้อยแล้ว",
                  {
                    appearance: "warning",
                    autoDismiss: true,
                  }
                );
              } else if (res.data.isMemberCard) {
                addToast(
                  "บันทึกข้อมูลไม่สำเร็จ รหัสสมาชิกซ้ำกับระบบที่เคยลงทะเบียนไว้เรียบร้อยแล้ว",
                  {
                    appearance: "warning",
                    autoDismiss: true,
                  }
                );
              }
            }
          });
        }
      }
    },
  });

  async function fetchData() {
    // const role = await GetPermissionByUserName();
    let response = {};
    // if (role.data.data.filter((e) => e.id === 10).length > 0)
    //   response = await axios.get(`/members/Show/byId/${id}`);
    // else
    response = await axios.get(`/members/byId/${id}`);

    let member = await response.data.tbMember;
    if (member !== null) {
      var provinceId = response.data.tbMember["province"];
      var districtId = response.data.tbMember["district"];
      var subDistrictId = response.data.tbMember["subDistrict"];
      for (var columns in response.data.tbMember) {
        if (columns === "subDistrict") {
          const subDistrict = await Address.getAddress(
            "subDistrict",
            districtId
          );
          setSubDistrict(subDistrict);
          formik.setFieldValue(
            "subDistrict",
            subDistrict.filter((e) => e.value === subDistrictId)[0].value
          );
        } else if (columns === "district") {
          const district = await Address.getAddress("district", provinceId);
          setDataDistrict(district);
          formik.setFieldValue(
            "district",
            district.filter((e) => e.value === districtId)[0].value
          );
        } else
          formik.setFieldValue(columns, response.data.tbMember[columns], false);
      }
      setIsNew(false);
    } else {
      setIsNew(true);
    }
  }

  const fetchPermission = async () => {
    const role = await GetPermissionByUserName();
    if (role.data.data.filter((e) => e.id === 1).length > 0) {
      setTypePermission("3");
    } else if (role.data.data.filter((e) => e.id === 10).length > 0) {
      setTypePermission("1");
    } else {
      setTypePermission("2");
    }
  };

  const defaultValue = () => {
    formik.values.memberCard = "MEM00001";
    formik.values.firstName = "ชาคริต";
    formik.values.lastName = "กันพรมกาศ";
    formik.values.email = "weatherzilla@gmail.com";
    formik.values.phone = "0804988589";
    formik.values.address =
      "บริษัทอันดีไฟนด์ จำกัด สำนักงานใหญ 333/64 หมู่ 6 ตำบล หนองจ๊อม อำเภอ สันทราย จังหวัด เชียงใหม่ 50210";
    formik.values.province =
      formik.values.province === "" ? "1" : formik.values.province;
    formik.values.district =
      formik.values.district === "" ? "1001" : formik.values.district;
    formik.values.subDistrict =
      formik.values.subDistrict === "" ? "100101" : formik.values.subDistrict;
  };

  const fatchAddress = async () => {
    const province = await Address.getProvince();
    const district = await Address.getAddress("district", "1");
    const subDistrict = await Address.getAddress("subDistrict", "1001");
    const postcode = await Address.getAddress("postcode", subDistrict[0].value);
    setDataProvice(province);
    setDataDistrict(district);
    setSubDistrict(subDistrict);
    formik.setFieldValue("province", "1");
    formik.setFieldValue("district", "1001");
    formik.setFieldValue("subDistrict", "100101");
    formik.setFieldValue("postcode", postcode);
  };

  useEffect(() => {
    /* Default Value for Testing */
    formik.values.birthDate =
      formik.values.birthDate === ""
        ? new moment(new Date()).toDate()
        : formik.values.birthDate;
    formik.values.registerDate =
      formik.values.registerDate === ""
        ? new moment(new Date()).toDate()
        : formik.values.registerDate;

    fatchAddress();
    fetchPermission();
    // defaultValue();
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
          <i className="fas fa-users-cog"></i>&nbsp;&nbsp;
        </span>
        <span className="text-base margin-auto font-bold">จัดการสมาชิก</span>
      </div>
      <div className="w-full">
        <form onSubmit={formik.handleSubmit}>
          <div className="w-full">
            <div className="flex justify-between py-2 mt-4">
              <span className="text-lg  text-green-mbk margin-auto font-bold">
                {typePermission === "1"
                  ? "เพิ่ม / แก้ไข ข้อมูลสมาชิก"
                  : "ข้อมูลสมาชิก"}
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
                        " bg-gold-mbk text-white active:bg-gold-mbk font-bold uppercase text-sm px-2 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150 " +
                        (typePermission === "1" ? " " : " hidden")
                      }
                      type="submit"
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
                  // data-dropdown-toggle="dropdownmenu"
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
                  {/* <div className="w-full lg:w-2/12 px-4 margin-auto-t-b"></div>
                  <div className="w-full lg:w-8/12 px-4 mb-2 text-right">
                    <div className="flex flex-wrap w-full justify-content-right">
                      <img
                        src={require("assets/img/mbk/giftReward.png").default}
                        alt="..."
                      ></img>
                      <span className="text-green-mbk text-lg font-bold cursor-pointer margin-auto-t-b" onClick={() => OpenModal()}>
                        &nbsp;{formik.values.memberPoint}&nbsp;คะแนน
                      </span>
                    </div>
                  </div> */}
                  <div className="w-full lg:w-2/12 px-4 margin-auto-t-b">
                    <div className="relative w-full margin-a">
                      <label
                        className=" text-blueGray-600 text-sm font-bold "
                        htmlFor="grid-password"
                      >
                        รหัสสมาชิก
                      </label>
                      <span className="text-sm ml-2 text-red-500">*</span>
                    </div>
                  </div>
                  <div className="w-full lg:w-8/12 px-4 margin-auto-t-b">
                    <div className="relative w-full">
                      <input
                        type="text"
                        className="border-0 px-2 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        id="memberCard"
                        name="memberCard"
                        maxLength={100}
                        onChange={(e) => {
                          formik.handleChange(e);
                          setIsModified(true);
                        }}
                        onBlur={formik.handleBlur}
                        value={formik.values.memberCard}
                        autoComplete="memberCard"
                        disabled={true}
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-2/12 px-4 mb-4 ">
                    <div className="relative w-full"></div>
                  </div>
                  <div className="w-full lg:w-8/12 px-4 margin-auto-t-b">
                    <div className="relative w-full mb-2">
                      {formik.touched.memberCard && formik.errors.memberCard ? (
                        <div className="text-sm py-2 px-2 text-red-500">
                          {formik.errors.memberCard}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="w-full lg:w-2/12 px-4  margin-auto-t-b">
                    <div className="relative w-full">
                      <label
                        className=" text-blueGray-600 text-sm font-bold"
                        htmlFor="grid-password"
                      >
                        ชื่อ
                      </label>
                      <span className="text-sm ml-2 text-red-500">*</span>
                    </div>
                  </div>
                  <div className="w-full lg:w-8/12 px-4 margin-auto-t-b">
                    <div className="relative w-full">
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
                        disabled={typePermission === "1" ? false : true}
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
                  <div className="w-full lg:w-2/12 px-4  margin-auto-t-b">
                    <div className="relative w-full">
                      <label
                        className=" text-blueGray-600 text-sm font-bold"
                        htmlFor="grid-password"
                      >
                        นามสกุล
                      </label>
                      <span className="text-sm ml-2 text-red-500">*</span>
                    </div>
                  </div>
                  <div className="w-full lg:w-8/12 px-4  margin-auto-t-b">
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
                        disabled={typePermission === "1" ? false : true}
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
                  <div className="w-full lg:w-2/12 px-4  margin-auto-t-b">
                    <div className="relative w-full">
                      <label
                        className=" text-blueGray-600 text-sm font-bold"
                        htmlFor="grid-password"
                      >
                        เพศ
                      </label>
                      <span className="text-sm ml-2 text-red-500">*</span>
                    </div>
                  </div>
                  <div className="w-full lg:w-8/12 px-4  margin-auto-t-b">
                    <div className="relative w-full">
                      <SelectUC
                        name="sex"
                        isDisabled={typePermission === "1" ? false : true}
                        options={optionsSex}
                        onChange={async (value) => {
                          setIsModified(true);
                          formik.setFieldValue("sex", value.value);
                        }}
                        value={ValidateService.defaultValue(
                          optionsSex,
                          formik.values.sex
                        )}
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
                    <div className="relative w-full ">
                      <label
                        className=" text-blueGray-600 text-sm font-bold "
                        htmlFor="grid-password"
                      >
                        เบอร์โทร
                      </label>
                      <span className="text-sm ml-2 text-red-500">*</span>
                    </div>
                  </div>
                  <div className="w-full lg:w-8/12 px-4 margin-auto-t-b">
                    <div className="relative w-full ">
                      <input
                        type="text"
                        className="border-0 px-2 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        id="phone"
                        name="phone"
                        maxLength={10}
                        onChange={(event) => {
                          const value = onHandleTelephoneChange(event);
                          // console.log(value)
                          if (value !== undefined) formik.handleChange(value);

                          setIsModified(true);
                        }}
                        // onBlur={formik.handleBlur}
                        value={formik.values.phone}
                        autoComplete="phoneaddress"
                        disabled={typePermission === "1" ? false : true}
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-2/12 px-4 mb-4 ">
                    <div className="relative w-full"></div>
                  </div>
                  <div className="w-full lg:w-8/12 px-4 margin-auto-t-b">
                    <div className="relative w-full mb-2">
                      {formik.touched.phone && formik.errors.phone ? (
                        <div className="text-sm py-2 px-2 text-red-500">
                          {formik.errors.phone}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="w-full lg:w-2/12 px-4 margin-auto-t-b">
                    <div className="relative w-full ">
                      <label
                        className=" text-blueGray-600 text-sm font-bold"
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
                        disabled={typePermission === "1" ? false : true}
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
                  <div className="w-full lg:w-2/12 px-4 margin-auto-t-b">
                    <div className="relative w-full">
                      <label
                        className=" text-blueGray-600 text-sm font-bold mb-2"
                        htmlFor="grid-password"
                      >
                        วันเกิด
                      </label>
                      <span className="text-sm ml-2 text-red-500">*</span>
                    </div>
                  </div>
                  <div className="w-full lg:w-8/12 px-4 margin-auto-t-b">
                    <div className="relative w-full">
                      <DatePickerUC
                        disabled={typePermission === "1" ? false : true}
                        onClick={(e) => {
                          if (typePermission === "1") setIsClick(true);
                        }}
                        onBlur={(e) => {
                          setIsClick(false);
                        }}
                        onChange={(e) => {
                          setIsClick(false);
                          setIsModified(true);
                          if (e === null) {
                            setErrorBirthDate(true);
                            formik.setFieldValue(
                              "birthDate",
                              new Date(),
                              false
                            );
                          } else {
                            setErrorBirthDate(false);
                            formik.setFieldValue(
                              "birthDate",
                              moment(e).toDate(),
                              false
                            );
                          }
                        }}
                        value={
                          !isClick
                            ? moment(
                                new Date(formik.values.birthDate),
                                "DD/MM/YYYY"
                              )
                            : null
                        }
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-2/12 px-4 mb-4 ">
                    <div className="relative w-full"></div>
                  </div>
                  <div className="w-full lg:w-8/12 px-4 margin-auto-t-b">
                    <div className="relative w-full mb-2">
                      {errorBirthDate ? (
                        <div className="text-sm py-2 px-2 text-red-500">
                          * กรุณากรอกวันเกิด
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
                        วันที่สมัคร
                      </label>
                      <span className="text-sm ml-2 text-red-500">*</span>
                    </div>
                  </div>
                  <div className="w-full lg:w-8/12 px-4 margin-auto-t-b">
                    <div className="relative w-full">
                      <DatePickerUC
                        disabled={typePermission === "1" ? false : true}
                        onBlur={(e) => {
                          setIsClickRegister(false);
                        }}
                        onClick={(e) => {
                          if (typePermission === "1") setIsClickRegister(true);
                        }}
                        value={
                          !isClickRegister
                            ? moment(
                                new Date(formik.values.registerDate),
                                "DD/MM/YYYY"
                              )
                            : null
                        }
                        onChange={(e) => {
                          setIsClickRegister(false);
                          setIsModified(true);
                          if (e === null) {
                            setErrorRegisterDate(true);
                            formik.setFieldValue(
                              "registerDate",
                              new Date(),
                              false
                            );
                          } else {
                            setErrorRegisterDate(false);
                            formik.setFieldValue(
                              "registerDate",
                              moment(e).toDate(),
                              false
                            );
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-2/12 px-4 mb-4 ">
                    <div className="relative w-full"></div>
                  </div>
                  <div className="w-full lg:w-8/12 px-4 margin-auto-t-b">
                    <div className="relative w-full mb-2">
                      {errorRegisterDate ? (
                        <div className="text-sm py-2 px-2 text-red-500">
                          * กรุณากรอกวันที่สมัคร
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
                        ที่อยู่
                      </label>
                    </div>
                  </div>
                  <div className="w-full lg:w-8/12 px-4 margin-auto-t-b">
                    <div className="relative w-full">
                      <textarea
                        type="text"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        rows="5"
                        id="address"
                        name="address"
                        onChange={(e) => {
                          formik.handleChange(e);
                          setIsModified(true);
                        }}
                        onBlur={formik.handleBlur}
                        value={formik.values.address}
                        autoComplete="new-password"
                        disabled={typePermission === "1" ? false : true}
                      ></textarea>
                    </div>
                  </div>
                  <div className="w-full lg:w-2/12 px-4 mb-4 ">
                    <div className="relative w-full"></div>
                  </div>
                  <div className="w-full lg:w-8/12 px-4 margin-auto-t-b">
                    <div className="relative w-full mb-2"></div>
                  </div>
                  <div className="w-full lg:w-2/12 px-4 margin-auto-t-b">
                    <div className="relative w-full">
                      <label
                        className="text-blueGray-600 text-sm font-bold"
                        htmlFor="grid-password"
                      >
                        จังหวัด
                      </label>
                    </div>
                  </div>
                  <div className="w-full lg:w-8/12 px-4 margin-auto-t-b">
                    <div className="relative w-full">
                      <SelectUC
                        name="province"
                        isDisabled={typePermission === "1" ? false : true}
                        onChange={async (value) => {
                          setIsModified(true);
                          formik.setFieldValue("province", value.value);
                          const district = await Address.getAddress(
                            "district",
                            value.value
                          );
                          setDataDistrict(district);
                          formik.setFieldValue("district", district[0].value);
                          const subDistrict = await Address.getAddress(
                            "subDistrict",
                            district[0].value
                          );
                          setSubDistrict(subDistrict);
                          formik.setFieldValue(
                            "subDistrict",
                            subDistrict[0].value
                          );
                          const postcode = await Address.getAddress(
                            "postcode",
                            subDistrict[0].value
                          );
                          formik.setFieldValue("postcode", postcode);
                        }}
                        options={dataProvice}
                        value={ValidateService.defaultValue(
                          dataProvice,
                          formik.values.province
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
                    <div className="relative w-full">
                      <label
                        className="text-blueGray-600 text-sm font-bold"
                        htmlFor="grid-password"
                      >
                        อำเภอ
                      </label>
                    </div>
                  </div>
                  <div className="w-full lg:w-8/12 px-4 margin-auto-t-b">
                    <div className="relative w-full">
                      <SelectUC
                        name="district"
                        isDisabled={typePermission === "1" ? false : true}
                        onChange={async (value) => {
                          setIsModified(true);
                          formik.setFieldValue("district", value.value);
                          const subDistrict = await Address.getAddress(
                            "subDistrict",
                            value.value
                          );
                          setSubDistrict(subDistrict);
                          formik.setFieldValue(
                            "subDistrict",
                            subDistrict[0].value
                          );
                          const postcode = await Address.getAddress(
                            "postcode",
                            subDistrict[0].value
                          );
                          formik.setFieldValue("postcode", postcode);
                        }}
                        options={dataDistrict}
                        value={ValidateService.defaultValue(
                          dataDistrict,
                          formik.values.district
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
                    <div className="relative w-full">
                      <label
                        className="text-blueGray-600 text-sm font-bold"
                        htmlFor="grid-password"
                      >
                        ตำบล
                      </label>
                    </div>
                  </div>
                  <div className="w-full lg:w-8/12 px-4 margin-auto-t-b">
                    <div className="relative w-full">
                      <SelectUC
                        name="role"
                        isDisabled={typePermission === "1" ? false : true}
                        onChange={async (value) => {
                          setIsModified(true);
                          formik.setFieldValue("subDistrict", value.value);
                          const postcode = await Address.getAddress(
                            "postcode",
                            value.value
                          );
                          formik.setFieldValue("postcode", postcode);
                        }}
                        options={
                          Storage.GetLanguage() === "th"
                            ? dataSubDistrict
                            : dataSubDistrict
                        }
                        value={ValidateService.defaultValue(
                          dataSubDistrict,
                          formik.values.subDistrict
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
                    <div className="relative w-full">
                      <label
                        className="text-blueGray-600 text-sm font-bold"
                        htmlFor="grid-password"
                      >
                        รหัสไปรษณีย์
                      </label>
                    </div>
                  </div>
                  <div className="w-full lg:w-8/12 px-4 margin-auto-t-b">
                    <div className="relative w-full">
                      <input
                        type="text"
                        disabled={typePermission === "1" ? false : true}
                        className="border-0 px-2 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        id="postcode"
                        name="postcode"
                        maxLength={5}
                        onChange={(e) => {
                          // const value = e.target.value.replace(/\D/g, "");
                          const value = onHandleTelephoneChange(e);
                          if (value !== undefined) formik.handleChange(e);
                          setIsModified(true);
                        }}
                        onBlur={formik.handleBlur}
                        value={formik.values.postcode}
                        autoComplete="postcode"
                      />
                    </div>
                  </div>
                  {/* <div className="w-full px-4">
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
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      <ConfirmEdit
        showModal={modalIsOpenEdit}
        message={"สมาชิก"}
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
      {open && (
        <MemberHistory
          open={open}
          handleSubmitModal={handleSubmitModal}
          memberId={id}
          handleModal={() => setOpen(false)}
        />
      )}
    </>
  );
}
