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
import InputUC from "components/InputUC";
import LabelUC from "components/LabelUC";
import SelectUC from "components/SelectUC";

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
    },
    validationSchema: Yup.object({
      redemptionName: Yup.string().required(
        Storage.GetLanguage() === "th"
          ? "* กรุณากรอก ชื่อเงื่อนไขการแลกรางวัล"
          : "* Please enter your Member Card"
      ),
    }),
    onSubmit: (values) => {},
  });

  async function fetchData() {}

  const fetchPermission = async () => {
    const role = await GetPermissionByUserName();
    setTypePermission(role);
  };

  const defaultValue = () => {};

  useEffect(() => {
    /* Default Value for Testing */
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
                  <div className="w-full lg:w-2/12 margin-auto-t-b">
                    <div className="relative w-full px-4">
                      <LabelUC
                        label="ชื่อเงื่อนไขการแลกรางวัล"
                        isRequired={true}
                      />
                    </div>
                    <div className="relative w-full px-4">
                      {formik.touched.redemptionName &&
                      formik.errors.redemptionName ? (
                        <div className="text-sm py-2 px-2 text-red-500">
                          &nbsp;
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="w-full lg:w-8/12 margin-auto-t-b">
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
                  <div className="w-full lg:w-2/12 margin-auto-t-b">
                    <div className="relative w-full px-4">
                      <LabelUC
                        label="ประเภทเงื่อนไขการแลกรางวัล"
                        isRequired={true}
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-8/12 margin-auto-t-b">
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
                  <div className="w-full lg:w-2/12 margin-auto-t-b">
                    <div className="relative w-full px-4">
                      <LabelUC label="ประเภทรางวัล" isRequired={true} />
                    </div>
                  </div>
                  <div className="w-full lg:w-8/12 margin-auto-t-b">
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
                  <div className="w-full lg:w-2/12 margin-auto-t-b">
                    <div className="relative w-full px-4">
                      <LabelUC label="จำนวนคะแนน" isRequired={true} />
                    </div>
                  </div>
                  <div className="w-full lg:w-8/12 margin-auto-t-b">
                    <div className="relative flex px-4">
                      <InputUC
                        name="points"
                        maxLength={100}
                        onBlur={formik.handleBlur}
                        value={formik.values.points}
                        onChange={(e) => {
                          formik.handleChange(e);
                        }}
                      />
                      <span className="ml-2 margin-auto-t-b font-bold">
                        คะแนน
                      </span>
                    </div>
                  </div>
                  <div className="w-full">&nbsp;</div>
                  <div className="w-full lg:w-1/12 px-4 margin-auto-t-b ">
                    <LabelUC label="วันที่เริ่มต้น" isRequired={true} />
                  </div>
                  <div className="w-full lg:w-5/12 px-4 margin-auto-t-b">
                    <div className="relative">
                      
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
