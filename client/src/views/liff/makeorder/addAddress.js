import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Spinner from "components/Loadings/spinner/Spinner";
import { useToasts } from "react-toast-notifications";
import { Radio } from "antd";
import * as Address from "@services/GetAddress.js";
import { path, addMemberAddress } from "@services/liff.services";
import * as Session from "@services/Session.service";
import {
  InputUC,
  SelectUC,
  validationSchema,
  validateShopAddress,
} from "../profile";
import {
  optionsDay30,
  optionsDay31,
  optionsDayFab,
  optionsDayFab29,
  optionsMonth,
  isLeapYear,
} from "services/selectDate";
import Select from "react-select";
import ValidateService from "services/validateValue";
import { styleSelect } from "assets/styles/theme/ReactSelect.js";
import { useDispatch } from "react-redux";
import { backPage } from "redux/actions/common";

const AddAddress = () => {
  const dispatch = useDispatch();
  const useStyle = styleSelect();
  const [isLoading, setIsLoading] = useState(false);
  let history = useHistory();
  const optionsYear = [];

  const { addToast } = useToasts();
  const [dataProvice, setDataProvice] = useState([]);
  const [dataDistrict, setDataDistrict] = useState([]);
  const [dataSubDistrict, setSubDistrict] = useState([]);
  const [optionYears, setOptionYears] = useState([]);
  const [OptionDay, setOptionDay] = useState([]);
  const address = async () => {
    const province = await Address.getProvince();
    const district = await Address.getAddress("district", "1");
    const subDistrict = await Address.getAddress("subDistrict", "1001");
    setDataProvice(province);
    setDataDistrict(district);
    setSubDistrict(subDistrict);
  };
  const [Data, settbMember] = useState({
    id: "",
    memberCard: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    birthDate: null,
    registerDate: null,
    address: "",
    subDistrict: "100101",
    district: "1001",
    province: "1",
    country: "",
    postcode: "10200",
    isDeleted: false,
    sex: "",
    isMemberType: "",
    memberType: "",
    memberPoint: 0,
    memberPointExpire: null,
    day: "",
    month: "",
    year: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    settbMember((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    let _errors = errors;
    _errors[name] = false;
    setErrors(_errors);
  };

  const setOptionYear = () => {
    for (
      var i = new Date().getFullYear() - 13;
      i > new Date().getFullYear() - 13 - 60;
      i--
    ) {
      optionsYear.push({ value: i, label: i });
    }
    setOptionYears(optionsYear);
  };

  const selectOptionDay = (month, year) => {
    if (isLeapYear(year) && month === "02") {
      setOptionDay(optionsDayFab29);
    } else if (month === "02") setOptionDay(optionsDayFab);
    else if (
      month === "04" ||
      month === "06" ||
      month === "09" ||
      month === "11"
    )
      setOptionDay(optionsDay30);
    else setOptionDay(optionsDay31);
  };

  const validation = async () => {
    const isFormValid = await validateShopAddress.isValid(Data, {
      abortEarly: false,
    });
    if (isFormValid) {
      DoSave();
      // console.log("DoSave")
    } else {
      validateShopAddress
        .validate(Data, {
          abortEarly: false,
        })
        .catch((err) => {
          const errors = err.inner.reduce((acc, error) => {
            return {
              ...acc,
              [error.path]: true,
            };
          }, {});
          setErrors(errors);
        });
    }
  };
  const DoSave = () => {
    setIsLoading(true);
    let _Data = Data;
    _Data.uid = Session.getLiff().uid;
    addMemberAddress(
      _Data,
      (res) => {
        let msg = { msg: "", appearance: "warning" };
        res.data.status
          ? (msg = { msg: "บันทึกข้อมูลสำเร็จ", appearance: "success" })
          : !res.data.isPhone === false
            ? (msg.msg =
              "บันทึกข้อมูลไม่สำเร็จ เนื่องจากเบอร์โทรศัพท์เคยมีการลงทะเบียนไว้เรียบร้อยแล้ว")
            : !res.data.isMemberCard === false
              ? (msg.msg =
                "บันทึกข้อมูลไม่สำเร็จ รหัส Member Card ซ้ำกับระบบที่เคยลงทะเบียนไว้เรียบร้อยแล้ว")
              : (msg.msg = "บันทึกข้อมูลไม่สำเร็จ");

        // addToast(msg.msg, { appearance: msg.appearance, autoDismiss: true });
        history.goBack();
      },
      (e) => {
        addToast(e.message, { appearance: "warning", autoDismiss: true });
      },
      () => {
        setIsLoading(false);
      }
    );
  };
  useEffect(() => {
    dispatch(backPage(true));
    address();
    setOptionYear();
    selectOptionDay();
  }, []);
  return (
    <>
      {isLoading ? <Spinner customText={"Loading"} /> : null}
      <div className="bg-green-mbk">
        <div
          style={{ height: "40px" }}
          className=" noselect text-lg text-white font-bold text-center "
        >
          {"เพิ่มที่อยู่"}
        </div>
      </div>
      <div className="bg-green-mbk" style={{ height: "calc(100vh - 90px)" }}>
        <div
          style={{
            width: "90%",
            padding: "10px",
            margin: "auto",
          }}
        >
          <div
            className="line-scroll"
            style={{
              width: "100%",
              backgroundColor: "#FFF",
              height: "calc(100vh - 200px)",
              minHeight: "450px",
              borderRadius: "10px",
              padding: "20px",
              // overflow: "scroll",
            }}
          >
            {/* <div className="flex text-green-mbk font-bold text-lg mb-4">
                            {"ข้อมูลสมาชิก"}
                        </div> */}
            <InputUC
              name="firstName"
              lbl="ชื่อ"
              length={255}
              type="text"
              onChange={handleChange}
              value={Data.firstName}
              error={errors.firstName}
              valid={true}
            // disabled={true}
            />
            <InputUC
              name="lastName"
              lbl="นามสกุล"
              length={255}
              type="text"
              onChange={handleChange}
              value={Data.lastName}
              error={errors.lastName}
              valid={true}
            // disabled={true}
            />
            <InputUC
              name="phone"
              lbl="เบอร์โทร"
              type="tel"
              onChange={handleChange}
              value={Data.phone}
              error={errors.phone}
              valid={true}
            // disabled={true}
            />
            {false && (
              <SelectUC
                name="sex"
                lbl="เพศ"
                valid={true}
                onChange={(e) => {
                  handleChange({ target: { name: "sex", value: e.value } });
                }}
                value={Data.sex}
                options={[
                  { value: "1", label: "ชาย" },
                  { value: "2", label: "หญิง" },
                  { value: "3", label: "ไม่ระบุ" },
                ]}
                error={errors.sex}
              />
            )}
            {/* วันเกิด */}

            {false && (
              <div
                className="mb-5 DatePicker-disabled"
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                <div className="flex text-green-mbk font-bold text-sm ">
                  {"วันเกิด"}
                  <span className="ml-1" style={{ color: "red" }}>
                    {" *"}
                  </span>
                </div>
                <div className="w-full flex ">
                  <div className="mt-2 mb-2 w-full">
                    <Select
                      name="day"
                      className=" text-gray-mbk text-center datePicker"
                      isSearchable={false}
                      isDisabled={true}
                      components={{
                        DropdownIndicator: () => null,
                        IndicatorSeparator: () => null,
                      }}
                      value={ValidateService.defaultValue(OptionDay, Data.day)}
                      options={OptionDay}
                      onChange={(e) => {
                        handleChange({
                          target: { name: "day", value: e.value },
                        });
                      }}
                      styles={useStyle}
                    />
                  </div>
                  <div className="ml-2">&nbsp;</div>
                  <div className="mt-2 mb-2 w-full">
                    <Select
                      className="text-gray-mbk text-center datePicker dateRemove"
                      isSearchable={false}
                      name="month"
                      isDisabled={true}
                      components={{
                        DropdownIndicator: () => null,
                        IndicatorSeparator: () => null,
                      }}
                      onChange={(e) => {
                        selectOptionDay(e.value, Data.year);
                        handleChange({
                          target: { name: "month", value: e.value },
                        });
                      }}
                      value={ValidateService.defaultValue(
                        optionsMonth,
                        Data.month
                      )}
                      options={optionsMonth}
                      styles={useStyle}
                    />
                  </div>
                  <div className="mr-2">&nbsp;</div>
                  <div className="mt-2 mb-2 w-full">
                    <Select
                      className="text-gray-mbk text-center datePicker"
                      isSearchable={false}
                      isDisabled={true}
                      components={{
                        DropdownIndicator: () => null,
                        IndicatorSeparator: () => null,
                      }}
                      name="year"
                      onChange={(e) => {
                        selectOptionDay(Data.month, e.value);
                        handleChange({
                          target: { name: "year", value: e.value },
                        });
                      }}
                      value={ValidateService.defaultValue(
                        optionYears,
                        Data.year
                      )}
                      options={optionYears}
                      styles={useStyle}
                    />
                  </div>
                </div>
              </div>
            )}

            {false && (
              <InputUC
                name="email"
                lbl="อีเมล"
                type="text"
                onChange={handleChange}
                value={Data.email}
                error={errors.email}
                valid={true}
              // disabled={true}
              />
            )}
            <div className="mb-5" style={{ display: "none" }}>
              <Radio.Group
                options={[
                  { label: "ค้าปลีก/Retail", value: "1" },
                  { label: "ค้าส่ง/Wholesale", value: "2" },
                ]}
                onChange={(e) => {
                  settbMember((prevState) => ({
                    ...prevState,
                    ["isMemberType"]: e.target.value,
                  }));
                }}
                value={Data.isMemberType}
              />
            </div>

            <InputUC
              name="address"
              lbl="ที่อยู่"
              type="text"
              valid={true}
              onChange={handleChange}
              value={Data.address}
              error={errors.address}
            />
            <SelectUC
              name="province"
              lbl="จังหวัด"
              onChange={async (e) => {
                const district = await Address.getAddress("district", e.value);
                const subDistrict = await Address.getAddress(
                  "subDistrict",
                  district[0].value
                );
                const postcode = await Address.getAddress(
                  "postcode",
                  subDistrict[0].value
                );
                setDataDistrict(district);
                setSubDistrict(subDistrict);
                settbMember((prevState) => ({
                  ...prevState,
                  ["province"]: e.value,
                  ["district"]: district[0].value,
                  ["subDistrict"]: subDistrict[0].value,
                  ["postcode"]: postcode,
                }));
              }}
              value={Data.province}
              options={dataProvice}
              error={errors.province}
            />
            <SelectUC
              name="district"
              lbl={"อำเภอ"}
              onChange={async (e) => {
                const subDistrict = await Address.getAddress(
                  "subDistrict",
                  e.value
                );

                const postcode = await Address.getAddress(
                  "postcode",
                  subDistrict[0].value
                );
                setSubDistrict(subDistrict);
                settbMember((prevState) => ({
                  ...prevState,
                  ["district"]: e.value,
                  ["subDistrict"]: subDistrict[0].value,
                  ["postcode"]: postcode,
                }));
              }}
              value={Data.district}
              options={dataDistrict}
              error={errors.district}
            />
            <SelectUC
              name="subDistrict"
              lbl={"ตำบล"}
              onChange={async (e) => {
                const postcode = await Address.getAddress("postcode", e.value);
                settbMember((prevState) => ({
                  ...prevState,
                  ["subDistrict"]: e.value,
                  ["postcode"]: postcode,
                }));
              }}
              value={Data.subDistrict}
              options={dataSubDistrict}
              error={errors.subDistrict}
            />
            <InputUC
              name="postcode"
              lbl="รหัสไปรษณีย์"
              type="tel"
              valid={true}
              onChange={handleChange}
              value={Data.postcode}
              error={errors.postcode}
            />
            <div className="relative  px-4  flex-grow flex-1 flex mt-5">
              <button
                className=" w-6\/12 bg-green-mbk text-white font-bold uppercase px-3 py-2 text-sm rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                style={{ width: "50%" }}
                onClick={() => {
                  history.goBack();
                }}
              >
                {"ยกเลิก"}
              </button>
              <button
                className=" w-6\/12 bg-gold-mbk text-white font-bold uppercase px-3 py-2 text-sm rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                style={{ width: "50%" }}
                onClick={validation}
              >
                {"บันทึก"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddAddress;
