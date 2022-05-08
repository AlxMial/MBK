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
import styleSelect from "assets/styles/theme/ReactSelect.js";
import * as Storage from "../../../services/Storage.service";
import "antd/dist/antd.css";
import moment from "moment";
import "moment/locale/th";
import locale from "antd/lib/locale/th_TH";
import { DatePicker, Space, ConfigProvider } from "antd";
import * as Address from "../../../services/GetAddress.js";

export default function MemberInfo() {
  /* Option Select */
  const options = [
    { value: "1", label: "ผู้ดูแลระบบ" },
    { value: "2", label: "บัญชี" },
    { value: "3", label: "การตลาด" },
  ];
  const useStyle = styleSelect();
  /* Service Function */
  const { height, width } = useWindowDimensions();
  let { id } = useParams();

  /* RegEx formatter */
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const EmailRegExp = /^[A-Za-z0-9_.@]+$/;

  /* Set useState */
  const [enableControl, setIsEnableControl] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState(0);
  const [isNew, setIsNew] = useState(false);
  const [dataProvice, setDataProvice] = useState([]);
  const [dataDistrict, setDataDistrict] = useState([]);
  const [dataSubDistrict, setSubDistrict] = useState([]);
  const [dataProviceEng, setDataProviceEng] = useState([]);
  const [dataDistrictEng, setDataDistrictEng] = useState([]);
  const [dataSubDistrictEng, setSubDistrictEng] = useState([]);
  let history = useHistory();
  const { addToast } = useToasts();
  /* Method Condition */
  const OnBack = () => {
    history.push("/admin/members");
  };
  /*พิมพ์เบอร์โทรศัพท์*/
  const onHandleTelephoneChange = (e) => {
    if (
      ValidateService.onHandleNumberChange(e.target.value) !== "" ||
      e.target.value === ""
    ) {
      setPhoneNumber(e.target.value);
      formik.values.phone = e.target.value;
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
    },
    validationSchema: Yup.object({
      memberCard: Yup.string().required(
        Storage.GetLanguage() === "th"
          ? "* กรุณากรอก รหัสสมาชิก"
          : "* Please enter your Member Card"
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
      phone: Yup.string()
        .matches(
          phoneRegExp,
          Storage.GetLanguage() === "th"
            ? "* รูปแบบเบอร์โทรศัพท์ ไม่ถูกต้อง"
            : "* The Phone Number format is invalid"
        )
        .required(
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
        ),
      registerDate: Yup.string().required(
        Storage.GetLanguage() === "th"
          ? "* กรุณากรอก วันที่สมัคร"
          : "* Please enter your Register Date"
      ),
    }),
    onSubmit: (values) => {
      if (isNew) {
        axios.post("members", values).then((res) => {
          if (res.data.status) {
            setIsNew(false);
            formik.values.id = res.data.tbMember.id;
            history.push(`/admin/membersinfo/${res.data.tbMember.id}`);
            addToast(
              Storage.GetLanguage() === "th"
                ? "บันทึกข้อมูลสำเร็จ"
                : "Save data successfully",
              { appearance: "success", autoDismiss: true }
            );
          } else {
            if (!res.data.isPhone) {
              addToast(
                "บันทึกข้อมูลไม่สำเร็จ เนื่องจากเบอร์โทรศัพท์เคยมีการลงทะเบียนไว้เรียบร้อยแล้ว",
                {
                  appearance: "warning",
                  autoDismiss: true,
                }
              );
            } else if (!res.data.isEmail) {
              addToast(
                "บันทึกข้อมูลไม่สำเร็จ Email ซ้ำกับระบบที่เคยลงทะเบียนไว้เรียบร้อยแล้ว",
                {
                  appearance: "warning",
                  autoDismiss: true,
                }
              );
            }
          }
        });
      } else {
        axios.put("members", values).then((res) => {
          if (res.data.status) {
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
      }
    },
  });

  async function fetchData() {
    let response = await axios.get(`/members/byId/${id}`);
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
    formik.values.birthDate =
      formik.values.birthDate === ""
        ? new moment(new Date()).toDate()
        : formik.values.birthDate;
    formik.values.registerDate =
      formik.values.registerDate === ""
        ? new moment(new Date()).toDate()
        : formik.values.registerDate;
  };

  const fatchAddress = async () => {
    const province = await Address.getProvince();
    const district = await Address.getAddress("district", "1");
    const subDistrict = await Address.getAddress("subDistrict", "1001");
    const postcode = await Address.getAddress("postcode", subDistrict[0].value);
    setDataProvice(province);
    setDataDistrict(district);
    setSubDistrict(subDistrict);
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
    // defaultValue();
    fetchData();
  }, []);

  return (
    <>
      <div className="flex flex-warp">
        <span className="text-sm font-bold margin-auto-t-b">
          <i className="fas fa-user-circle"></i>&nbsp;
        </span>
        <span className="text-base margin-auto font-bold">ข้อมูลสมาชิก</span>
      </div>
      <div className="w-full">
        <form onSubmit={formik.handleSubmit}>
          <div className="w-full">
            <div className="flex justify-between py-2 mt-4">
              <span className="text-lg  text-green-mbk margin-auto font-bold">
                จัดการสมาชิก
              </span>
            </div>
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 border bg-white rounded-lg">
              <div className="flex-auto lg:px-10 py-10">
                <div className="flex flex-wrap">
                  <div className="w-full lg:w-2/12 px-4 mb-2">
                    <div className="relative w-full margin-a">
                      <label
                        className=" text-blueGray-600 text-sm font-bold "
                        htmlFor="grid-password"
                      >
                        Member Card
                      </label>
                      <span className="text-sm ml-2 text-red-500">*</span>
                    </div>
                  </div>
                  <div className="w-full lg:w-8/12 px-4 mb-4">
                    <div className="relative w-full">
                      <input
                        type="text"
                        className="border-0 px-2 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        id="memberCard"
                        name="memberCard"
                        maxLength={100}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.memberCard}
                        autoComplete="memberCard"
                      />
                      {formik.touched.memberCard && formik.errors.memberCard ? (
                        <div className="text-sm py-2 px-2 text-red-500">
                          {formik.errors.memberCard}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="w-full lg:w-2/12 px-4  mb-2">
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
                  <div className="w-full lg:w-8/12 px-4  mb-4">
                    <div className="relative w-full">
                      <input
                        type="text"
                        className="border-0 px-2 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
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
                  <div className="w-full lg:w-2/12 px-4  mb-2">
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
                  <div className="w-full lg:w-8/12 px-4  mb-4">
                    <div className="relative w-full">
                      <input
                        type="text"
                        className="border-0 px-2 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
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
                  <div className="w-full lg:w-8/12 px-4 mb-4">
                    <div className="relative w-full ">
                      <input
                        type="text"
                        className="border-0 px-2 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        id="phone"
                        name="phone"
                        maxLength={100}
                        onChange={(event) => {
                          onHandleTelephoneChange(event);
                        }}
                        onBlur={formik.handleBlur}
                        value={formik.values.phone}
                        autoComplete="phoneaddress"
                      />
                      {formik.touched.phone && formik.errors.phone ? (
                        <div className="text-sm py-2 px-2 text-red-500">
                          {formik.errors.phone}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="w-full lg:w-2/12 px-4 mb-2">
                    <div className="relative w-full ">
                      <label
                        className=" text-blueGray-600 text-sm font-bold"
                        htmlFor="grid-password"
                      >
                        Email
                      </label>
                    </div>
                  </div>
                  <div className="w-full lg:w-8/12 px-4 mb-4">
                    <div className="relative w-full">
                      <input
                        type="email"
                        className="border-0 px-2 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
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
                        className=" text-blueGray-600 text-sm font-bold mb-2"
                        htmlFor="grid-password"
                      >
                        วันเกิด
                      </label>
                    </div>
                  </div>
                  <div className="w-full lg:w-8/12 px-4 mb-4">
                    <div className="relative w-full">
                      <div className="relative">
                        <ConfigProvider locale={locale}>
                          <DatePicker
                            format={"DD/MM/yyyy"}
                            placeholder="เลือกวันที่"
                            showToday={false}
                            defaultValue={moment(new Date(), "DD/MM/YYYY")}
                            style={{
                              height: "100%",
                              width: "100%",
                              borderRadius: "0.25rem",
                              cursor: "pointer",
                              margin: "0px",
                              paddingTop: "0.5rem",
                              paddingBottom: "0.5rem",
                              paddingLeft: "0.5rem",
                              paddingRight: "0.5rem",
                            }}
                            onChange={(e) => {
                              if (e === null) {
                                formik.setFieldValue(
                                  "birthDate",
                                  new Date(),
                                  false
                                );
                              } else {
                                formik.setFieldValue(
                                  "birthDate",
                                  moment(e).toDate(),
                                  false
                                );
                              }
                            }}
                            value={moment(
                              new Date(formik.values.birthDate),
                              "DD/MM/YYYY"
                            )}
                          />
                        </ConfigProvider>
                      </div>
                    </div>
                  </div>
                  <div className="w-full lg:w-2/12 px-4 mb-2">
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
                  <div className="w-full lg:w-8/12 px-4 mb-4">
                    <div className="relative w-full">
                      <div className="relative">
                        <ConfigProvider locale={locale}>
                          <DatePicker
                            format={"DD/MM/yyyy"}
                            placeholder="เลือกวันที่"
                            showToday={false}
                            defaultValue={moment(new Date(), "DD/MM/YYYY")}
                            style={{
                              height: "100%",
                              width: "100%",
                              borderRadius: "0.25rem",
                              cursor: "pointer",
                              margin: "0px",
                              paddingTop: "0.5rem",
                              paddingBottom: "0.5rem",
                              paddingLeft: "0.5rem",
                              paddingRight: "0.5rem",
                            }}
                            value={moment(
                              new Date(formik.values.registerDate),
                              "DD/MM/YYYY"
                            )}
                            onChange={(e) => {
                              if (e === null) {
                                formik.setFieldValue(
                                  "registerDate",
                                  new Date(),
                                  false
                                );
                              } else {
                                formik.setFieldValue(
                                  "registerDate",
                                  moment(e).toDate(),
                                  false
                                );
                              }
                            }}
                          />
                        </ConfigProvider>
                        {formik.touched.registerDate &&
                        formik.errors.registerDate ? (
                          <div className="text-sm py-2 px-2 text-red-500">
                            {formik.errors.registerDate}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="w-full lg:w-2/12 px-4 mb-2">
                    <div className="relative w-full">
                      <label
                        className="text-blueGray-600 text-sm font-bold"
                        htmlFor="grid-password"
                      >
                        ที่อยู่
                      </label>
                    </div>
                  </div>
                  <div className="w-full lg:w-8/12 px-4 mb-4">
                    <div className="relative w-full">
                      <textarea
                        type="text"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        rows="5"
                        id="address"
                        name="address"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.address}
                        autoComplete="new-password"
                      ></textarea>
                    </div>
                  </div>
                  <div className="w-full lg:w-2/12 px-4 mb-2">
                    <div className="relative w-full">
                      <label
                        className="text-blueGray-600 text-sm font-bold"
                        htmlFor="grid-password"
                      >
                        จังหวัด
                      </label>
                    </div>
                  </div>
                  <div className="w-full lg:w-8/12 px-4 mb-4">
                    <div className="relative w-full">
                      <Select
                        id="province"
                        name="province"
                        onChange={async (value) => {
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
                        className="border-0 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        options={dataProvice}
                        menuPlacement="top"
                        value={ValidateService.defaultValue(
                          dataProvice,
                          formik.values.province
                        )}
                        // value={defaultValue(options, formik.values.role)}
                        styles={useStyle}
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-2/12 px-4 mb-2">
                    <div className="relative w-full">
                      <label
                        className="text-blueGray-600 text-sm font-bold"
                        htmlFor="grid-password"
                      >
                        อำเภอ
                      </label>
                    </div>
                  </div>
                  <div className="w-full lg:w-8/12 px-4 mb-4">
                    <div className="relative w-full">
                      <Select
                        id="district"
                        name="district"
                        onChange={async (value) => {
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
                        className="border-0 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        options={dataDistrict}
                        menuPlacement="top"
                        value={ValidateService.defaultValue(
                          dataDistrict,
                          formik.values.district
                        )}
                        // value={defaultValue(options, formik.values.role)}
                        styles={useStyle}
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-2/12 px-4 mb-2">
                    <div className="relative w-full">
                      <label
                        className="text-blueGray-600 text-sm font-bold"
                        htmlFor="grid-password"
                      >
                        ตำบล
                      </label>
                    </div>
                  </div>
                  <div className="w-full lg:w-8/12 px-4 mb-4">
                    <div className="relative w-full">
                      <Select
                        id="role"
                        name="role"
                        onChange={async (value) => {
                          formik.setFieldValue("subDistrict", value.value);
                          const postcode = await Address.getAddress(
                            "postcode",
                            value.value
                          );
                          formik.setFieldValue("postcode", postcode);
                        }}
                        className="border-0 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        options={
                          Storage.GetLanguage() === "th"
                            ? dataSubDistrict
                            : dataSubDistrict
                        }
                        menuPlacement="top"
                        value={ValidateService.defaultValue(
                          dataSubDistrict,
                          formik.values.subDistrict
                        )}
                        styles={useStyle}
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-2/12 px-4 mb-2">
                    <div className="relative w-full">
                      <label
                        className="text-blueGray-600 text-sm font-bold"
                        htmlFor="grid-password"
                      >
                        รหัสไปรษณีย์
                      </label>
                    </div>
                  </div>
                  <div className="w-full lg:w-8/12 px-4 mb-4">
                    <div className="relative w-full">
                      <input
                        type="text"
                        className="border-0 px-2 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        id="postcode"
                        name="postcode"
                        maxLength={100}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.postcode}
                        autoComplete="postcode"
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
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
