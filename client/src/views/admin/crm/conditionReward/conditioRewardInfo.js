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
import { DatePicker, Space, ConfigProvider } from "antd";
import * as Address from "../../../../services/GetAddress.js";
import useMenu from "services/useMenu";
import { GetPermissionByUserName } from "services/Permission";
import ConfirmEdit from "components/ConfirmDialog/ConfirmEdit";

export default function ConditioRewardInfo() {
  /* Option Select */
  const options = [
    { value: "1", label: "ผู้ดูแลระบบ" },
    { value: "2", label: "บัญชี" },
    { value: "3", label: "การตลาด" },
  ];
  const useStyle = styleSelect();
  /* Service Function */
  const { height, width } = useWindowDimensions();
  const { menu } = useMenu();
  let { id } = useParams();
  const [isModefied, setIsModified] = useState(false);

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
    initialValues: {},
    validationSchema: Yup.object({}),
    onSubmit: (values) => {},
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

  const fetchPermission = async () => {
    const role = await GetPermissionByUserName();
    setTypePermission(role);
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
          <i className="fas fa-gift"></i>&nbsp;&nbsp;
        </span>
        <span className="text-base margin-auto font-bold">
          เงื่อนไขแลกของรางวัล
        </span>
      </div>
      <div className="w-full">
        <form onSubmit={formik.handleSubmit}>
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
    </>
  );
}
