import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import OtpInput from "react-otp-input";
import axios from "services/axios";
import { senderOTP, senderValidate } from "services/axios";
import * as Address from "@services/GetAddress.js";
import * as Session from "@services/Session.service";
import { Radio } from "antd";
import DatePicker from "react-mobile-datepicker";
import moment from "moment";
import { useToasts } from "react-toast-notifications";
import { path } from "@services/liff.services";
import {
  InputUC,
  SelectUC,
  validationSchema,
  DatePickerContainer,
  monthMap,
  RadioUC,
} from "./profile";
import Spinner from "components/Loadings/spinner/Spinner";
import { styleSelectLine } from "assets/styles/theme/ReactSelect";
import ValidateService from "services/validateValue";
import { styleSelect } from "assets/styles/theme/ReactSelect.js";
import Select from "react-select";
import {
  optionsDay30,
  optionsDay31,
  optionsDayFab,
  optionsDayFab29,
  optionsMonth,
  isLeapYear,
} from "services/selectDate";

const Register = () => {
  //ref element
  const inputFirstNameRef = React.useRef();
  const inputLastNameRef = React.useRef();
  const inputEmailRef = React.useRef();
  const inputPhoneRef = React.useRef();

  let history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToasts();
  const [dataProvice, setDataProvice] = useState([]);
  const [dataDistrict, setDataDistrict] = useState([]);
  const [dataSubDistrict, setSubDistrict] = useState([]);
  const [dataOTP, setdataOTP] = useState({});
  const [optionYears, setOptionYears] = useState([]);
  const [OptionDay, setOptionDay] = useState([]);
  const [sameEmail, setSameEmail] = useState(false);
  const [samePhone, setSamePhone] = useState(false);
  const [page, setpage] = useState("register");
  const [enableButton, setEnableButton] = useState(true);
  const [scroll, setScroll] = useState("");
  const useStyle = styleSelect();

  const optionsYear = [];

  const optionsCustomer = [
    { label: "เคย", value: "1" },
    { label: "ไม่เคย", value: "2" },
  ];

  const address = async () => {
    const province = await Address.getProvince();
    const district = await Address.getAddress("district", "1");
    const subDistrict = await Address.getAddress("subDistrict", "1001");
    setDataProvice(province);
    setDataDistrict(district);
    setSubDistrict(subDistrict);
  };

  const [Data, setData] = useState({
    id: "",
    memberCard: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    birthDate: moment(new Date()).toDate(),
    registerDate: moment(new Date()).toDate(),
    address: "",
    subDistrict: "100101",
    district: "1001",
    province: "1",
    country: "",
    postcode: "10200",
    isDeleted: false,
    sex: "1",
    isMemberType: "1",
    memberType: "1",
    memberPoint: 0,
    day: "01",
    month: "01",
    year: new Date().getFullYear() - 13,
    memberPointExpire: moment(new Date()).toDate(),
    uid: Session.getLiff().uid,
    consentDate: new Date(),
    isPolicy1: false,
    isPolicy2: false,
    isCustomer: "1",
    eating: "",
  });

  const [policy, setpolicy] = useState({
    policy1: false,
    policy2: false,
    policy3: false,
  });
  const [otp, setotp] = useState({
    isotp: true,
    PhoneNumber: Session.getphon(),
    generateOTP: null,
    generateref: null,
    otp: null,
  });
  const policyAllow = () => {
    // if (policy.policy1 && policy.policy2) {
    setpage("otp");
    generate();
    // DoSave();
    // }
  };
  const policyclose = () => {
    setpage("register");
  };

  const [dataOtp, setdataOtp] = useState({
    isotp: true,
    PhoneNumber: Session.getphon(),
    generateOTP: null,
    generateref: null,
    otp: null,
    incorrect: false,
    confirmotp: false,
  });

  const generate = () => {
    // let PhoneNumber = Data.PhoneNumber.replaceAll("-", "");
    // let PhoneNumber = Session.getphon().replaceAll("-", "");
    // if (PhoneNumber.length == 10) {
    const digits = "0123456789";
    const refdigits =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let otp = "";
    let ref = "";
    for (let i = 0; i < 6; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }
    for (let i = 0; i < 6; i++) {
      ref += refdigits[Math.floor(Math.random() * 62)];
    }
    setotp((prevState) => ({
      ...prevState,
      ["isotp"]: true,
      ["generateOTP"]: otp,
      ["generateref"]: ref,
    }));
    SenderOTP(Data.phone.replaceAll("-", ""));
    // }
  };
  const onOTPChange = (e) => {
    setotp((prevState) => ({
      ...prevState,
      ["otp"]: e,
    }));
  };
  const confirmotp = async () => {
    if (!dataOTP.confirmotp) {
      let data = await senderValidate(
        dataOTP.result.token,
        otp.otp,
        dataOTP.result.ref_code,
        (e) => {
          if (e.code === "000") {
            if (e.result.status) {
              setdataOtp((prevState) => ({
                ...prevState,
                ["confirmotp"]: true,
              }));
              DoSave();
            } else {
              setotp((prevState) => ({
                ...prevState,
                ["incorrect"]: true,
              }));
            }
          } else {
            setotp((prevState) => ({
              ...prevState,
              ["incorrect"]: true,
            }));
          }
        }
      );
    } else {
      DoSave();
    }
  };
  const SenderOTP = async (phone) => {
    let data = await senderOTP(phone, otp.generateOTP, otp.generateref, (e) => {
      setdataOTP(e);
      setdataOtp((prevState) => ({
        ...prevState,
        ["confirmotp"]: false,
      }));
    });
  };

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    let _errors = errors;
    _errors[name] = false;
    setErrors(_errors);
  };

  const handleChangeRadio = (e) => {
    const { value } = e.target;
    setData((prevState) => ({
      ...prevState,
      ["isCustomer"]: value,
    }));
  };
  const policyChange = (e) => {
    const { name } = e.target;
    if (name === "isPolicy1") Data.isPolicy1 = e.target.checked;
    else Data.isPolicy2 = e.target.checked;
    setpolicy((prevState) => ({
      ...prevState,
      [name]: !policy[name],
    }));
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

  const setScrollToEnd = (element) => {
    if (element !== null) {
      if (element.currentTarget.scrollTop > 3000) {
        setEnableButton(false);
      }
    }
  };

  useEffect(() => {
    address();
    SenderOTP();
    setOptionYear();
    selectOptionDay();
    //confirmotp();
  }, []);

  const validation = async () => {
    var date = Data.year + Data.month + Data.day;
    Data.birthDate = new moment(date).toDate();
    const isFormValid = await validationSchema.isValid(Data, {
      abortEarly: false,
    });
    if (isFormValid) {
      setSameEmail(false);
      setSamePhone(false);
      const response = await axios.post(`/members/checkDuplicate`, {
        email: Data.email,
        phone: Data.phone,
      });
      if (response.data.isEmail) {
        setSameEmail(true);
        inputEmailRef.current.focus();
        setSamePhone(true);
        const field = document.querySelector("input[name=email]");
        field.focus();
      } else if (response.data.isPhone) {
        setSamePhone(true);
        const field = document.querySelector("input[name=phone]");
        field.focus();
      } else {
        setpage("privacypolicy");
        // setScrollToEnd();
      }
      // if (response.data.tbMember) {
      //   saetSmeEmail(true);
      // } else {
      //   setSameEmail(false);
      //   setpage("privacypolicy");
      //   setScrollToEnd();
      // }
    } else {
      validationSchema
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

          if (Object.keys(errors).length > 0) {
            const field = document.querySelector(
              "input[name=" + Object.keys(errors)[0] + "]"
            );
            field.focus();
          }
          setErrors(errors);
        });
    }
  };
  const DoSave = () => {
    setIsLoading(true);
    let _Data = Data;
    _Data.uid = Session.getLiff().uid;
    axios
      .post("members", _Data)
      .then((res) => {
        let msg = { msg: "", appearance: "warning" };

        res.data.status
          ? (msg = { msg: "บันทึกข้อมูลสำเร็จ", appearance: "success" })
          : res.data.isPhone === false
            ? (msg.msg =
              "บันทึกข้อมูลไม่สำเร็จ เนื่องจากเบอร์โทรศัพท์เคยมีการลงทะเบียนไว้เรียบร้อยแล้ว")
            : res.data.isEmail === false
              ? (msg.msg =
                "บันทึกข้อมูลไม่สำเร็จ Email ซ้ำกับระบบที่เคยลงทะเบียนไว้เรียบร้อยแล้ว")
              : res.data.isMemberCard === false
                ? (msg.msg =
                  "บันทึกข้อมูลไม่สำเร็จ รหัส Member Card ซ้ำกับระบบที่เคยลงทะเบียนไว้เรียบร้อยแล้ว")
                : (msg.msg = "บันทึกข้อมูลไม่สำเร็จ");

        // addToast(msg.msg, { appearance: msg.appearance, autoDismiss: true });
        if (res.data.status) {
          window.location.reload();
        }
      })
      .catch((e) => {
        // addToast(e.message, { appearance: "warning", autoDismiss: true });
      })
      .finally((e) => {
        setIsLoading(false);
      });
  };
  return (
    <>
      {isLoading ? <Spinner customText={"Loading"} /> : null}
      {page === "register" ? (
        <div className="bg-green-mbk" style={{ height: "calc(100vh - 100px)" }}>
          <div
            style={{
              width: "90%",
              padding: "10px",
              margin: "auto",
            }}
          >
            <div
              className="fullheight line-scroll"
              style={{
                width: "100%",
                backgroundColor: "#FFF",
                height: "calc(100vh - 150px)",
                minHeight: "450px",
                borderRadius: "10px",
                padding: "20px",
                // overflowY: "scroll",
              }}
            >
              <div className="flex text-green-mbk font-bold text-lg mb-4">
                {"สมัครสมาชิก"}
              </div>
              <InputUC
                name="firstName"
                lbl="ชื่อ"
                length={100}
                type="text"
                onChange={handleChange}
                value={Data.firstName}
                error={errors.firstName}
                valid={true}
                refs={inputFirstNameRef}
              />
              <InputUC
                name="lastName"
                lbl="นามสกุล"
                length={100}
                type="text"
                onChange={handleChange}
                value={Data.lastName}
                error={errors.lastName}
                valid={true}
                refs={inputLastNameRef}
              />
              <InputUC
                name="phone"
                lbl="เบอร์โทร"
                type="tel"
                id=""
                length={10}
                onChange={handleChange}
                value={Data.phone}
                error={errors.phone}
                valid={true}
                refs={inputPhoneRef}
              />
              {samePhone ? (
                <div
                  className="text-sm py-2 px-2 text-red-500"
                  style={{ marginTop: "-1rem" }}
                >
                  * เบอร์โทรศัพท์เคยมีการลงทะเบียนไว้แล้ว
                  กรุณาทำการเปลี่ยนเบอร์โทรศัพท์ใหม่
                </div>
              ) : null}
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
              {/* วันเกิด */}
              <div className="">
                <div className="flex text-green-mbk font-bold text-sm ">
                  {"วันเกิด"}
                  <span className="ml-1" style={{ color: "red" }}>
                    {" *"}
                  </span>
                </div>
                <div className="w-full flex ">
                  <div className="mt-2 mb-2">
                    <Select
                      name="day"
                      className=" text-gray-mbk text-center datePicker dataDate"
                      isSearchable={false}
                      components={{
                        DropdownIndicator: () => null,
                        IndicatorSeparator: () => null,
                      }}
                      // className="text-gray-mbk mt-1 text-sm w-full border-none text-center"
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
                      className="text-gray-mbk text-center datePicker "
                      isSearchable={false}
                      name="month"
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
                  <div className="mt-2 mb-2">
                    <Select
                      className="text-gray-mbk text-center datePicker dataYear"
                      isSearchable={false}
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
                {/* <DatePickerContainer>
                  <DatePicker
                    isOpen={true}
                    isPopup={true}
                    showHeader={false}
                    min={new Date(1970, 0, 1)}
                    max={
                      new Date(
                        new Date().setFullYear(new Date().getFullYear() - 13)
                      )
                    }
                    value={Data.birthDate}
                    dateConfig={{
                      year: {
                        format: "YYYY",
                        caption: "Year",
                        step: 1,
                      },
                      month: {
                        format: (value) => monthMap[value.getMonth() + 1],
                        caption: "Mon",
                        step: 1,
                      },
                      date: {
                        format: "D",
                        caption: "Day",
                        step: 1,
                      },
                    }}
                    onChange={(e) => {
                      var date = new Date(e);
                      setData((prevState) => ({
                        ...prevState,
                        ["birthDate"]: date,
                      }));
                    }}
                  />
                </DatePickerContainer> */}
              </div>

              <InputUC
                name="email"
                lbl="อีเมล"
                type="text"
                onChange={handleChange}
                value={Data.email}
                error={errors.email}
                valid={true}
                refs={inputEmailRef}
              />
              {sameEmail ? (
                <div
                  className="text-sm py-2 px-2 text-red-500"
                  style={{ marginTop: "-1rem" }}
                >
                  * อีเมลเคยมีการลงทะเบียนไว้แล้ว กรุณาทำการเปลี่ยนอีเมลใหม่
                </div>
              ) : null}
              <div className="mb-5" style={{ display: "none" }}>
                <Radio.Group
                  options={[
                    { label: "ค้าปลีก/Retail", value: "1" },
                    { label: "ค้าส่ง/Wholesale", value: "2" },
                  ]}
                  onChange={(e) => {
                    setData((prevState) => ({
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
                valid={true}
                type="text"
                onChange={handleChange}
                value={Data.address}
                error={errors.address}
              />
              <SelectUC
                name="province"
                lbl="จังหวัด"
                onChange={async (e) => {
                  const district = await Address.getAddress(
                    "district",
                    e.value
                  );
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

                  setData((prevState) => ({
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
                lbl="อำเภอ"
                onChange={async (e) => {
                  // handleChange({ target: { name: "district", value: e.value } });
                  const subDistrict = await Address.getAddress(
                    "subDistrict",
                    e.value
                  );
                  const postcode = await Address.getAddress(
                    "postcode",
                    subDistrict[0].value
                  );
                  setSubDistrict(subDistrict);
                  setData((prevState) => ({
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
                lbl="ตำบล"
                onChange={async (e) => {
                  const postcode = await Address.getAddress(
                    "postcode",
                    e.value
                  );
                  setData((prevState) => ({
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
              <RadioUC
                name="isCustomer"
                lbl="เคยเป็นลูกค้าหรือทานข้าวมาบุญครองหรือไม่ ?"
                valid={true}
                onChange={handleChangeRadio}
                options={optionsCustomer}
                Active={Data.isCustomer}
              />
              <div className="mt-4"></div>
              <InputUC
                name="eating"
                lbl="ปัจจุบันทานข้าวแบรนด์"
                type="text"
                valid={true}
                onChange={handleChange}
                value={Data.eating}
                error={errors.eating}
              />

              {/* <InputUC
                name="eating"
                lbl="ปัจจุบันทานข้าวแบรด์"
                type="description"
                onChange={handleChange}
                value={Data.eating}
              /> */}

              <div className="relative  px-4  flex-grow flex-1 flex mt-5">
                <button
                  className=" w-6\/12 bg-green-mbk text-white font-bold uppercase px-3 py-2 text-sm rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  style={{ width: "50%" }}
                // onClick={windowclose}
                >
                  {"ยกเลิก"}
                </button>
                <button
                  className=" w-6\/12 bg-gold-mbk text-white font-bold uppercase px-3 py-2 text-sm rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  style={{ width: "50%" }}
                  onClick={validation}
                >
                  {"ลงทะเบียน"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {page === "privacypolicy" ? (
        <div
          className="bg-green-mbk"
          style={{ height: "100%", overflowY: "auto" }}
        >
          <div
            style={{
              width: "90%",
              backgroundColor: "#FFF",
              height: "calc(100vh - 380px)",
              padding: "20px",
              margin: "auto",
              borderRadius: "10px",
              marginBottom: "1rem",
            }}
            onScroll={setScrollToEnd}
            className="heightPolicy text-xs line-scroll"
          >
            <div className="text-center mt-2 mb-1">
              <span className="text-green-mbk font-bold text-sm">
                ข้อกำหนดและเงื่อนไข
              </span>
            </div>
            <strong>
              <span data-contrast="none" className="text-sm">
                ข้อกำหนดและเงื่อนไข : สำหรับสมาชิกข้าวมาบุญครอง
              </span>
            </strong>
            <span data-ccp-props='{"134233118":true,"201341983":0,"335559739":160,"335559740":240}'>
              &nbsp;
            </span>

            <p></p>
            <span data-contrast="none text-xs">
              &nbsp; &nbsp; &nbsp; &nbsp;
              &nbsp;ข้าพเจ้ามีความประสงค์จะขอรับหมายเลขสมาชิกและเป็นสมาชิก
              โดยรับทราบ ตกลง และยอมรับข้อกำหนดและเงื่อนไข ดังต่อไปนี้
            </span>
            <span data-ccp-props='{"134233118":true,"201341983":0,"335559739":160,"335559740":240}'>
              &nbsp;
            </span>
            <p></p>
            <ol>
              <li
                data-leveltext="%1."
                data-font="AngsanaUPC,Times New Roman"
                data-listid="1"
                data-list-defn-props='{"335552541":0,"335559684":-1,"335559685":720,"335559991":360,"469769242":[65533,0],"469777803":"left","469777804":"%1.","469777815":"hybridMultilevel"}'
                aria-setsize="-1"
                data-aria-posinset="1"
                data-aria-level="1"
              >
                <span data-contrast="none">
                  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;1. ข้าพเจ้าตกลงให้ บริษัท พี
                  อาร์ จี คอร์ปอเรชั่น จำกัด (มหาชน) (เรียกว่า &ldquo;
                </span>
                <strong>
                  <span data-contrast="none">บริษัท</span>
                </strong>
                <span data-contrast="none">&rdquo;) </span>
                <span data-contrast="none">
                  ดำเนินการให้บริการแพลตฟอร์มและรับสมัครให้ข้าพเจ้าเป็นสมาชิกจนกว่าบริษัทยกเลิกการเป็นสมาชิกของข้าพเจ้าเนื่องจากข้าพเจ้าไม่มีการสะสม
                  แลก หรือโอนคะแนนภายในระยะเวลา{" "}
                </span>
                <span data-contrast="none">1 (</span>
                <span data-contrast="none">
                  หนึ่ง) ปีติดต่อกันและไม่มีคะแนนสะสมคงเหลือ
                </span>
                <span data-ccp-props='{"134233118":true,"201341983":0,"335559739":160,"335559740":240}'>
                  &nbsp;
                </span>
              </li>
            </ol>
            <ol>
              <li
                data-leveltext="%1."
                data-font="AngsanaUPC,Times New Roman"
                data-listid="1"
                data-list-defn-props='{"335552541":0,"335559684":-1,"335559685":720,"335559991":360,"469769242":[65533,0],"469777803":"left","469777804":"%1.","469777815":"hybridMultilevel"}'
                aria-setsize="-1"
                data-aria-posinset="2"
                data-aria-level="1"
              >
                <span data-contrast="none">
                  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;2.
                  ข้าพเจ้ารับทราบว่าการเก็บรวบรวม ใช้ เปิดเผย
                  หรือโอนข้อมูลส่วนบุคคลของข้าพเจ้าไปต่างประเทศจะเป็นไปตามนโยบายความเป็นส่วนตัว
                </span>
                <span data-ccp-props='{"134233118":true,"201341983":0,"335559739":160,"335559740":240}'>
                  &nbsp;
                </span>
              </li>
            </ol>
            <ol>
              <li
                data-leveltext="%1."
                data-font="AngsanaUPC,Times New Roman"
                data-listid="1"
                data-list-defn-props='{"335552541":0,"335559684":-1,"335559685":720,"335559991":360,"469769242":[65533,0],"469777803":"left","469777804":"%1.","469777815":"hybridMultilevel"}'
                aria-setsize="-1"
                data-aria-posinset="3"
                data-aria-level="1"
              >
                <span data-contrast="auto">
                  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;3. ข้าพเจ้ารับทราบว่า
                  คะแนนจากการเป็นสมาชิกแต่ละคะแนนมีอายุตามที่บริษัทกำหนดไว้ในเงื่อนไขของแต่ละโปรโมชั่น
                  (
                </span>
                <span data-contrast="auto">1 (</span>
                <span data-contrast="auto">หนึ่ง) เดือน/ </span>
                <span data-contrast="auto">3 (</span>
                <span data-contrast="auto">สาม) เดือน/ </span>
                <span data-contrast="auto">6 (</span>
                <span data-contrast="auto">หก) เดือน/ หรือ </span>
                <span data-contrast="auto">1 (</span>
                <span data-contrast="auto">
                  หนึ่ง) ปี) นับจากวันที่ซื้อสินค้าหรือบริการ
                </span>
                <span data-ccp-props='{"134233118":true,"201341983":0,"335559739":160,"335559740":240}'>
                  &nbsp;
                </span>
              </li>
            </ol>
            <ol>
              <li
                data-leveltext="%1."
                data-font="AngsanaUPC,Times New Roman"
                data-listid="1"
                data-list-defn-props='{"335552541":0,"335559684":-1,"335559685":720,"335559991":360,"469769242":[65533,0],"469777803":"left","469777804":"%1.","469777815":"hybridMultilevel"}'
                aria-setsize="-1"
                data-aria-posinset="4"
                data-aria-level="1"
              >
                <span data-contrast="none">
                  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;4.
                  ในกรณีที่มีข้อโต้แย้งเกี่ยวกับคะแนนจากการเป็นสมาชิก
                  ข้าพเจ้าตกลงและยอมรับให้บริษัทมีอำนาจในการตรวจสอบและระงับข้อโต้แย้ง
                  โดยการตัดสินของบริษัทถือเป็นที่สุด
                </span>
                <span data-ccp-props='{"134233118":true,"201341983":0,"335559739":160,"335559740":240}'>
                  &nbsp;
                </span>
              </li>
            </ol>
            <ol>
              <li
                data-leveltext="%1."
                data-font="AngsanaUPC,Times New Roman"
                data-listid="1"
                data-list-defn-props='{"335552541":0,"335559684":-1,"335559685":720,"335559991":360,"469769242":[65533,0],"469777803":"left","469777804":"%1.","469777815":"hybridMultilevel"}'
                aria-setsize="-1"
                data-aria-posinset="5"
                data-aria-level="1"
              >
                <span data-contrast="none">
                  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;5.
                  ข้าพเจ้ายอมรับว่าสิทธิประโยชน์ที่ทางบริษัทเสนอให้แก่สมาชิกแต่ละรายอาจแตกต่างกัน
                  ขึ้นอยู่กับประวัติการซื้อสินค้าของสมาชิกแต่ละราย
                  รายการโปรโมชั่นสินค้าแต่ละประเภท
                  และ/หรือนโยบายทางการตลาดของบริษัท
                </span>
                <span data-ccp-props='{"134233118":true,"201341983":0,"335559739":160,"335559740":240}'>
                  &nbsp;
                </span>
              </li>
            </ol>
            <ol>
              <li
                data-leveltext="%1."
                data-font="AngsanaUPC,Times New Roman"
                data-listid="1"
                data-list-defn-props='{"335552541":0,"335559684":-1,"335559685":720,"335559991":360,"469769242":[65533,0],"469777803":"left","469777804":"%1.","469777815":"hybridMultilevel"}'
                aria-setsize="-1"
                data-aria-posinset="6"
                data-aria-level="1"
              >
                <span data-contrast="none">
                  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;6. ข้าพเจ้าตกลงและยอมรับว่า
                  หากข้าพเจ้าคืนสินค้าที่ซื้อจากร้านค้าที่ร่วมโครงการกับบริษัทแล้ว
                  ข้าพเจ้าต้องคืนคะแนนสะสมที่ได้รับและรวมทั้งของรางวัลที่แลกรับจากคะแนนสะสมไปแล้ว
                  หรือคืนเป็นเงินสดตามมูลค่าของของรางวัล
                </span>
                <span data-ccp-props='{"134233118":true,"201341983":0,"335559739":160,"335559740":240}'>
                  &nbsp;
                </span>
              </li>
            </ol>
            <ol>
              <li
                data-leveltext="%1."
                data-font="AngsanaUPC,Times New Roman"
                data-listid="1"
                data-list-defn-props='{"335552541":0,"335559684":-1,"335559685":720,"335559991":360,"469769242":[65533,0],"469777803":"left","469777804":"%1.","469777815":"hybridMultilevel"}'
                aria-setsize="-1"
                data-aria-posinset="7"
                data-aria-level="1"
              >
                <span data-contrast="none">
                  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;7.
                  ข้าพเจ้าตกลงและยอมรับว่าบริษัทมีสิทธิ์ปฏิเสธการให้บริการแพลตฟอร์มและการสมัครนี้
                  หรือสามารถยกเลิกการเป็นสมาชิกได้โดยไม่จำเป็นต้องระบุสาเหตุการปฏิเสธ/ยกเลิกดังกล่าว
                </span>
                <span data-ccp-props='{"134233118":true,"201341983":0,"335559739":160,"335559740":240}'>
                  &nbsp;
                </span>
              </li>
            </ol>
            <ol>
              <li
                data-leveltext="%1."
                data-font="AngsanaUPC,Times New Roman"
                data-listid="1"
                data-list-defn-props='{"335552541":0,"335559684":-1,"335559685":720,"335559991":360,"469769242":[65533,0],"469777803":"left","469777804":"%1.","469777815":"hybridMultilevel"}'
                aria-setsize="-1"
                data-aria-posinset="8"
                data-aria-level="1"
              >
                <span data-contrast="none">
                  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;8.
                  ข้าพเจ้ายอมรับและผูกพันตามข้อกำหนดและเงื่อนไขของการเป็นสมาชิกที่บริษัทกำหนดไว้ขณะลงทะเบียนใช้บริการแพลตฟอร์มและรวมทั้งการเปลี่ยนแปลงแก้ไขที่อาจมีขึ้นในภายหน้า
                  โดยบริษัทมิต้องแจ้งให้ทราบล่วงหน้า
                </span>
                <span data-ccp-props='{"134233118":true,"201341983":0,"335559739":160,"335559740":240}'>
                  &nbsp;
                </span>
              </li>
            </ol>
            <ol>
              <li
                data-leveltext="%1."
                data-font="AngsanaUPC,Times New Roman"
                data-listid="1"
                data-list-defn-props='{"335552541":0,"335559684":-1,"335559685":720,"335559991":360,"469769242":[65533,0],"469777803":"left","469777804":"%1.","469777815":"hybridMultilevel"}'
                aria-setsize="-1"
                data-aria-posinset="9"
                data-aria-level="1"
              >
                <span data-contrast="none">
                  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;9.
                  ข้าพเจ้าตกลงและยอมรับว่าบริษัทมีสิทธิ์เด็ดขาดฝ่ายเดียวในการเปลี่ยนแปลงเงื่อนไขการเป็นสมาชิก/ของกำนัลที่จัดให้แลกและสิทธิพิเศษต่าง
                  ๆ โดยมิต้องแจ้งให้ทราบล่วงหน้า
                </span>
                <span data-ccp-props='{"134233118":true,"201341983":0,"335559739":160,"335559740":240}'>
                  &nbsp;
                </span>
              </li>
            </ol>
            <ol>
              <li
                data-leveltext="%1."
                data-font="AngsanaUPC,Times New Roman"
                data-listid="1"
                data-list-defn-props='{"335552541":0,"335559684":-1,"335559685":720,"335559991":360,"469769242":[65533,0],"469777803":"left","469777804":"%1.","469777815":"hybridMultilevel"}'
                aria-setsize="-1"
                data-aria-posinset="10"
                data-aria-level="1"
              >
                <span data-contrast="none">
                  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;10.
                  กรณีที่มีปัญหาขัดแย้งจากการเป็นสมาชิก
                  คำชี้ขาดของบริษัทถือเป็นที่สิ้นสุด
                </span>
                <span data-ccp-props='{"134233118":true,"201341983":0,"335559739":160,"335559740":240}'>
                  &nbsp;
                </span>
              </li>
            </ol>
            <ol>
              <li
                data-leveltext="%1."
                data-font="AngsanaUPC,Times New Roman"
                data-listid="1"
                data-list-defn-props='{"335552541":0,"335559684":-1,"335559685":720,"335559991":360,"469769242":[65533,0],"469777803":"left","469777804":"%1.","469777815":"hybridMultilevel"}'
                aria-setsize="-1"
                data-aria-posinset="11"
                data-aria-level="1"
              >
                <span data-contrast="none">
                  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;11. บริษัทฯ
                  ขอสงวนสิทธิ์ในการยกเลิกการเป็นสมาชิก
                  หรือเปลี่ยนแปลงเงื่อนไขสิทธิประโยชน์โดยไม่ต้องแจ้งให้ทราบล่วงหน้า
                </span>
                <span data-ccp-props='{"134233118":true,"201341983":0,"335559739":160,"335559740":240}'>
                  &nbsp;
                </span>
              </li>
            </ol>
            <ol>
              <li
                data-leveltext="%1."
                data-font="AngsanaUPC,Times New Roman"
                data-listid="1"
                data-list-defn-props='{"335552541":0,"335559684":-1,"335559685":720,"335559991":360,"469769242":[65533,0],"469777803":"left","469777804":"%1.","469777815":"hybridMultilevel"}'
                aria-setsize="-1"
                data-aria-posinset="12"
                data-aria-level="1"
              >
                <span data-contrast="none">
                  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;12.
                  หากคุณไม่ประสงค์ที่จะรับการติดต่อสื่อสารทางการตลาดจากบริษัท
                  และ/หรือ บริษัทในกลุ่มอ็มบีเค และ/หรือ บริษัทในเครือ และ/หรือ
                  บริษัทที่เป็นพันธมิตรทางการค้ากับบริษัท โปรดติดต่อบริษัทมาที่{" "}
                </span>
                <span data-contrast="none">MKTONLINE@PRG.CO.TH </span>
                <span data-contrast="none">
                  หรือฝ่ายบริการลูกค้าที่หมายเลข{" "}
                </span>
                <span data-contrast="none">1285 </span>
                <span data-contrast="none">ได้ทุกวัน </span>
                <span data-contrast="none">24 </span>
                <span data-contrast="none">ชั่วโมง</span>
                <span data-ccp-props='{"134233118":true,"201341983":0,"335559739":160,"335559740":240}'>
                  &nbsp;
                </span>
              </li>
            </ol>
            <p>
              <strong>
                <span data-contrast="none" className="text-sm">
                  ข้อกำหนดและเงื่อนไขการใช้แพลตฟอร์ม
                </span>
              </strong>
              <span data-ccp-props='{"201341983":0,"335559739":160,"335559740":259}'>
                &nbsp;
              </span>
            </p>
            <p>
              <span data-contrast="none">
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;บริษัท พี อาร์ จี คอร์ปอเรชั่น
                จำกัด (มหาชน){" "}
              </span>
              <span data-contrast="none">(&ldquo;</span>
              <strong>
                <span data-contrast="none">บริษัท</span>
              </strong>
              <span data-contrast="none">&rdquo;) </span>
              <span data-contrast="none">ได้จัดทำ </span>
              <span data-contrast="none">Application</span>
              <span data-contrast="none"> บน </span>
              <span data-contrast="none">LINE Official Account </span>
              <span data-contrast="none">
                เพื่อใช้เป็นช่องทางในการติดต่อและสื่อสาร
                รวมถึงให้บริการแก่ผู้ใช้บริการที่เป็นสมาชิกของ ข้าวมาบุญครอง
                (&ldquo;สมาชิก&rdquo;) เช่น การสมัครเป็นสมาชิก
                ตรวจสอบคะแนนคงเหลือและคะแนนที่จะหมดอายุ
                ปรับเปลี่ยนข้อมูลส่วนตัวของสมาชิก
                ตรวจสอบแคมเปญส่งเสริมการขายของบริษัท และ/หรือพันธมิตรทางธุรกิจ
                แลกคะแนนสะสมตามรายการที่บริษัทกำหนด
                และโอนคะแนนสะสมระหว่างสมาชิกและ/หรือพันธมิตรทางธุรกิจ
                รวมถึงวัตถุประสงค์อื่น ๆ ตามที่บริษัทจะกำหนดขึ้นในภายหลัง
              </span>
              <span data-ccp-props='{"134233118":true,"201341983":0,"335559731":720,"335559739":160,"335559740":240}'>
                &nbsp;
              </span>
            </p>
            <p>
              <span data-contrast="none">
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;ผู้ใช้งานแพลตฟอร์ม (&ldquo;
              </span>
              <strong>
                <span data-contrast="none">ผู้ใช้งาน</span>
              </strong>
              <span data-contrast="none">&rdquo;)</span>
              <span data-contrast="none">
                ได้อ่าน
                และยอมรับว่าผู้ใช้งานจะต้องผูกพันตามข้อกำหนดและเงื่อนไขที่กำหนดไว้ในแพลตฟอร์มนี้
                โดยผู้ใช้งานจะต้องศึกษาข้อกำหนดและเงื่อนไขด้านล่างนี้อย่างละเอียดและรอบคอบก่อนที่จะกระทำธุรกรรมหรือกิจกรรมใด
                ๆ บนแพลตฟอร์มนี้ หากท่านทำธุรกรรมหรือกิจกรรมใด ๆ บนแพลตฟอร์ม
                ให้ถือว่าท่านได้ยอมรับและตกลงที่จะปฏิบัติตามข้อกำหนดและเงื่อนไขฉบับนี้แล้ว
                และหากท่านไม่ต้องการที่จะผูกพันภายใต้เงื่อนไขนี้
                กรุณาหยุดทำธุรกรรมใด ๆ บนแพลตฟอร์มนี้  ทั้งนี้
                บริษัทมีสิทธิที่จะแก้ไข เปลี่ยนแปลง
                หรือยกเลิกข้อกำหนดและเงื่อนไขนี้ และ/หรือข้อตกลงอื่น ๆ
                ในแพลตฟอร์มนี้ โดยไม่ต้องแจ้งให้สมาชิกและผู้ใช้งานทราบล่วงหน้า
              </span>
              <span data-ccp-props='{"134233118":true,"201341983":0,"335559731":720,"335559739":160,"335559740":240}'>
                &nbsp;
              </span>
            </p>
            <p>
              <strong>
                <span data-contrast="none">1.    </span>
              </strong>
              <strong>
                <span data-contrast="none">
                  ขอบเขตการใช้งานแพลตฟอร์ม และข้อกำหนดทั่วไป
                </span>
              </strong>
              <span data-ccp-props='{"134233118":true,"201341983":0,"335559739":160,"335559740":240}'>
                &nbsp;
              </span>
            </p>
            <p>
              <span data-contrast="none">
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;1.1{" "}
              </span>
              <span data-contrast="none">
                บริษัทขอสงวนสิทธิไว้สำหรับสมาชิกที่ลงทะเบียนเป็นสมาชิกบนแพลตฟอร์มเพื่อตรวจสอบคะแนนคงเหลือและคะแนนที่จะหมดอายุ
                ปรับเปลี่ยนข้อมูลส่วนตัวของสมาชิก
                ตรวจสอบแคมเปญส่งเสริมการขายของบริษัท และ/หรือพันธมิตรทางธุรกิจ
                แลกคะแนนสะสมตามรายการที่บริษัทกำหนด
                และโอนคะแนนสะสมระหว่างสมาชิกอื่นและ/หรือพันธมิตรทางธุรกิจ
                รวมถึงวัตถุประสงค์อื่น ๆ ตามที่บริษัทอาจกำหนดขึ้นในภายหลัง
              </span>
              <span data-contrast="none"> </span>
              <span data-ccp-props='{"134233118":true,"201341983":0,"335559731":720,"335559739":160,"335559740":240}'>
                &nbsp;
              </span>
            </p>
            <p>
              <span data-contrast="none">
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;1.2
              </span>
              <span data-contrast="none">
                ผู้ใช้งานรับรองว่าบรรดาข้อมูลที่ได้ให้ไว้แก่บริษัทในแพลตฟอร์มเป็นข้อมูลของผู้ใช้งานที่ถูกต้องครบถ้วน
                โดยเฉพาะอย่างยิ่งรับรองว่าเบอร์โทรศัพท์มือถือ
                หรืออีเมลส่วนตัวยังใช้งานได้อยู่ในขณะที่ให้ข้อมูลดังกล่าว
              </span>
              <span data-ccp-props='{"134233118":true,"201341983":0,"335559731":720,"335559739":160,"335559740":240}'>
                &nbsp;
              </span>
            </p>
            <p>
              <span data-contrast="none">
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;1.3
              </span>
              <span data-contrast="none">
                ผู้ใช้งานตกลงและรับทราบว่า
                บริษัทไม่ได้ให้ความรับรองถึงความถูกต้องสมบูรณ์ของเนื้อหาที่ปรากฏอยู่บนแพลตฟอร์ม
                และไม่รับรองว่าแพลตฟอร์ม ปราศจากไวรัส หรือสิ่งอื่น ๆ
                ที่อาจจะกระทบต่ออุปกรณ์เคลื่อนที่ของท่าน
              </span>
              <span data-ccp-props='{"134233118":true,"201341983":0,"335559731":720,"335559739":160,"335559740":240}'>
                &nbsp;
              </span>
            </p>
            <p>
              <span data-contrast="none">
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;1.4
              </span>
              <span data-contrast="none">
                ก่อนจะทำรายการใด ๆ ผ่านแพลตฟอร์ม
                ผู้ใช้งานจะต้องตรวจสอบชื่อและนามสกุล หมายเลขสมาชิกและคะแนนสะสม
                ซึ่งจะปรากฏบนแพลตฟอร์ม
                แอปพลิเคชั่นและอีเมลที่ส่งถึงท่านตามอีเมลแอดเดรสหรือข้อมูลส่วนบุคคลอื่นๆที่ใช้ในการการติดต่อที่ท่านได้ระบุไว้
                หลังจากที่มีการทำธุรกรรมใดๆ ผ่านทางแพลตฟอร์มทุกครั้ง
              </span>
              <span data-ccp-props='{"134233118":true,"201341983":0,"335559731":720,"335559739":160,"335559740":240}'>
                &nbsp;
              </span>
            </p>
            <p>
              <span data-contrast="none">
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;1.5
              </span>
              <span data-contrast="none">
                ผู้ใช้งานจะตรวจสอบเงื่อนไขเกี่ยวกับสิทธิประโยชน์
              </span>
              <span data-contrast="none"> </span>
              <span data-contrast="none">
                อัตราการแลกคะแนน รวมถึงการเข้าร่วมกิจกรรมต่าง ๆ
                ที่ปรากฏอยู่บนแพลตฟอร์มก่อนการรับสิทธิประโยชน์
                และการเข้าร่วมกิจกรรมต่าง ๆ ผ่านแพลตฟอร์ม
              </span>
              <span data-ccp-props='{"134233118":true,"201341983":0,"335559731":720,"335559739":160,"335559740":240}'>
                &nbsp;
              </span>
            </p>
            <p>
              <span data-contrast="none">
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;1.6
              </span>
              <span data-contrast="none">
                การใช้งานแพลตฟอร์มในแต่ละครั้ง
                ถือว่าผู้ใช้งานได้รับทราบถึงข้อตกลงและเงื่อนไขนี้
                รวมถึงข้อตกลงและเงื่อนไขทีมีการเปลี่ยนแปลงแก้ไขและได้ใช้บังคับในเวลาดังกล่าวโดยครบถ้วนสมบูรณ์แล้ว
                โดยตกลงปฏิบัติตามข้อตกลงและเงื่อนไขดังกล่าวทุกประการ
              </span>
              <span data-ccp-props='{"134233118":true,"201341983":0,"335559731":720,"335559739":160,"335559740":240}'>
                &nbsp;
              </span>
            </p>
            <p>
              <span data-contrast="none">
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;1.7 &nbsp;{" "}
              </span>
              <span data-contrast="none">
                ในแพลตฟอร์มจะมีโฆษณา ไฮเปอร์ลิงก์ หรือดีพลิงก์
                ไปยังเว็บไซต์หรือแอพพลิเคชั่นของบุคคลที่สาม
                รวมถึงแต่ไม่จำกัดเพียงลิงก์ไปยังแพลตฟอร์ม เวปไซต์
                หรือแอพพลิเคชั่นของบริษัทในกลุ่มเซ็นทรัล บริษัทในเครือ
                บริษัทที่เกี่ยวข้อง บริษัทที่เป็นพันธมิตรทางการค้ากับบริษัท
                และ/หรือบริษัทอื่นใดที่อยู่ภายใต้เงื่อนไขการใช้ข้อมูล
                ซึ่งแพลตฟอร์ม เวปไซต์
                หรือแอพพลิเคชั่นของบุคคลที่สามเหล่านั้นไม่ถือเป็นส่วนหนึ่งของแพลตฟอร์มของบริษัท
                และไม่อยู่ภายใต้การควบคุมหรือความรับผิดชอบของบริษัท
                เมื่อผู้ใช้งานทำการลิงก์ไปยังแพลตฟอร์ม เวปไซต์
                หรือแอพพลิเคชั่นดังกล่าว
                เมื่อผู้ใช้งานจะออกจากแพลตฟอร์มของบริษัทและดำเนินการต่อไปภายใต้ความเสี่ยงของผู้ใช้งานเองทั้งหมด
                บริษัทไม่รับประกันถึงความถูกต้องแม่นยำและความน่าเชื่อถือของข้อมูลที่ระบุไว้บนเว็บไซต์ของบุคคลที่สาม
                และบริษัทขอปฏิเสธความรับผิดชอบทั้งหมดต่อการสูญเสียหรือเสียหายที่ผู้ใช้งานได้รับจากการอ้างอิงข้อความที่อยู่หรือไม่มีอยู่บนแพลตฟอร์ม
                เวปไซต์ หรือแอพพลิเคชั่นของบุคคลที่สาม
                การแสดงโฆษณาไม่ถือเป็นการแสดงการรับรองหรือแนะนำจากบริษัท
              </span>
              <span data-ccp-props='{"134233118":true,"201341983":0,"335559731":720,"335559739":160,"335559740":240}'>
                &nbsp;
              </span>
            </p>
            <p>
              <span data-contrast="none">
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;1.8
              </span>
              <span data-contrast="none">
                ในกรณีที่มีเหตุอันสมควร บริษัทอาจระงับหรือยกเลิกการให้บริการ
                รวมถึงเปลี่ยนแปลงรายการส่งเสริมการขายผ่านแพลตฟอร์มได้โดยไม่ต้องประกาศ
                หรือแจ้งให้ทราบล่วงหน้า
              </span>
              <span data-ccp-props='{"134233118":true,"201341983":0,"335559731":720,"335559739":160,"335559740":240}'>
                &nbsp;
              </span>
            </p>
            <p>
              <span data-contrast="none">
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;1.9
              </span>
              <span data-contrast="none">
                คะแนนสะสมที่ปรากฏเมื่อมีการตรวจสอบคะแนน
                จะเป็นคะแนนสะสมของการซื้อครั้งล่าสุดของวันนี้
                ยกเว้นในกรณีถ้ามีการจับจ่ายและการได้รับคะแนนจากการซื้อของวันนี้ที่ได้รับจากบริษัท
                และ/หรือพันธมิตรทางธุรกิจที่ทำการส่งคะแนนมาให้บริษัทในภายหลัง
                คะแนนจะถูกนำไปคำนวณและแสดงในวันถัดไป หรือตามเงื่อนไขของบริษัท
                และ/หรือพันธมิตรทางธุรกิจที่กำหนดไว้
              </span>
              <span data-ccp-props='{"134233118":true,"201341983":0,"335559731":720,"335559739":160,"335559740":240}'>
                &nbsp;
              </span>
            </p>
            <p>
              <span data-contrast="none">
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;1.10
              </span>
              <span data-contrast="none">
                คะแนนสะสมที่แลกผ่านทางแพลตฟอร์ม
                จะถูกนำไปประมวลผลและหักออกจากคะแนนที่คงเหลืออยู่ทันที
              </span>
              <span data-ccp-props='{"134233118":true,"201341983":0,"335559731":720,"335559739":160,"335559740":240}'>
                &nbsp;
              </span>
            </p>
            <p>
              <span data-contrast="none">
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;1.11
              </span>
              <span data-contrast="none">
                ในการแลกคะแนนบนแพลตฟอร์ม
                ผู้ใช้งานจะไม่ได้รับอีเมลสรุปการแลกคะแนน
                แต่สามารถตรวจสอบประวัติการแลกคะแนนได้ที่เมนู "ประวัติการใช้งาน"
              </span>
              <span data-ccp-props='{"134233118":true,"201341983":0,"335559731":720,"335559739":160,"335559740":240}'>
                &nbsp;
              </span>
            </p>
            <p>
              <span data-contrast="none">
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;1.12
              </span>
              <span data-contrast="none">
                เมื่อผู้ใช้งานทำการยืนยันการแลกคะแนนหรือโอนคะแนนบนแพลตฟอร์มเรียบร้อยแล้ว
                จะไม่สามารถขอคืนคะแนนได้
              </span>
              <span data-ccp-props='{"134233118":true,"201341983":0,"335559731":720,"335559739":160,"335559740":240}'>
                &nbsp;
              </span>
            </p>
            <p>
              <span data-contrast="none">
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;1.13  {" "}
              </span>
              <span data-contrast="none">
                กรณีที่มีข้อโต้แย้งเกี่ยวกับคะแนน
              </span>{" "}
              <span data-contrast="none">ข้าวมาบุญครอง</span>{" "}
              <span data-contrast="none">
                ข้าพเจ้าตกลงและยอมรับให้บริษัทมีอำนาจในการตรวจสอบและปรับคะแนนย้อนหลังไม่เกิน{" "}
              </span>
              <span data-contrast="none">6 </span>
              <span data-contrast="none">
                เดือน และการตัดสินของบริษัทถือเป็นที่สิ้นสุด
              </span>
              <span data-ccp-props='{"134233118":true,"201341983":0,"335559731":720,"335559739":160,"335559740":240}'>
                &nbsp;
              </span>
            </p>
            <p>
              <span data-contrast="none">
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;1.14   {" "}
              </span>
              <span data-contrast="none">
                คะแนนสะสมที่แลกหรือโอน จะถูกหักจากคะแนนที่ใกล้หมดอายุที่สุดก่อน
                (มาก่อน ไปก่อน)
              </span>
              <span data-ccp-props='{"134233118":true,"201341983":0,"335559731":720,"335559739":160,"335559740":240}'>
                &nbsp;
              </span>
            </p>
            <p>
              <span data-contrast="none">
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;1.15
              </span>
              <span data-contrast="none">คะแนนสะสมจะมีอายุ </span>
              <span data-contrast="none">1 (</span>
              <span data-contrast="none">
                หนึ่ง) ปี นับจากปีที่มีการซื้อสินค้า
                โดยบริษัทจะคำนวณคะแนนสะสมในวันสุดท้ายของทุกปีปฏิทินรวจสอบชื่อและนามสกุล
                หมายเลขสมาชิกและคะแนนสะสม
                ซึ่งจะปรากฏบนแพลตฟอร์มทุกครั้งก่อนจะทำการแลกคะแนนบนแพลตฟอร์ม
              </span>
              <span data-ccp-props='{"134233118":true,"201341983":0,"335559731":720,"335559739":160,"335559740":240}'>
                &nbsp;
              </span>
            </p>
            <p>
              <span data-contrast="none">
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;1.16   {" "}
              </span>
              <span data-contrast="none">
                บริษัทฯ ไม่สนับสนุนการซื้อ-ขายคะแนนทุกรูปแบบ
                ผู้ที่ร่วมกระทำการซื้อ-ขายคะแนน อาจมีความผิด และทาง บริษัทฯ
              </span>{" "}
              <span data-contrast="none">
                ไม่มีส่วนรับผิดชอบใดๆ กับการกระทำดังกล่าว
              </span>
              <span data-contrast="none"> </span>
              <span data-ccp-props='{"134233118":true,"201341983":0,"335559731":720,"335559739":160,"335559740":240}'>
                &nbsp;
              </span>
            </p>
            <ol start="2">
              <li>
                <strong> </strong>
                <strong>
                  <span data-contrast="none">การสมัครเป็นสมาชิก</span>
                </strong>
              </li>
            </ol>
            <p>
              <span data-contrast="none">
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;2.1
              </span>
              <span data-contrast="none">
                ผู้ขอใช้บริการสามารถสมัครสมาชิกได้โดยจะต้องทำการให้รายละเอียดข้อมูลตามที่บริษัทกำหนด
                รวมทั้งได้รับอนุมัติจากบริษัทให้เป็นสมาชิก
                โดยผู้ใช้บริการต้องผูกพันและปฏิบัติตามข้อกำหนดและเงื่อนไขการเป็นสมาชิกเดอะวัน
              </span>
              <span data-ccp-props='{"134233118":true,"201341983":0,"335559731":720,"335559739":160,"335559740":240}'>
                &nbsp;
              </span>
            </p>
            <p>
              <span data-contrast="none">
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;2.2
              </span>
              <span data-contrast="none">
                ผู้สมัครตกลงและยอมรับตามข้อกำหนดและเงื่อนไขต่าง ๆ
                ของการเป็นสมาชิกที่ใช้บังคับ ณ
                ขณะลงทะเบียนใช้บริการแพลตฟอร์มในทุกช่องทางและให้รวมถึงข้อกำหนดและเงื่อนไขที่จะเปลี่ยนแปลงหรือแก้ไขในภายหน้า
              </span>
              <span data-ccp-props='{"134233118":true,"201341983":0,"335559731":720,"335559739":160,"335559740":240}'>
                &nbsp;
              </span>
            </p>
            <p>
              <span data-contrast="none">
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;2.3
              </span>
              <span data-contrast="none">
                ผู้สมัครรับรองว่าบรรดาข้อมูลที่ได้ให้ไว้แก่บริษัทในการลงทะเบียนเป็นสมาชิกถูกต้องครบถ้วน
                โดยเฉพาะอย่างยิ่งรับรองว่าเบอร์โทรศัพท์มือถือ หรือ
                อีเมลส่วนตัวยังใช้งานอยู่ในขณะที่ได้ให้ข้อมูลดังกล่าว
              </span>
              <span data-ccp-props='{"134233118":true,"201341983":0,"335559731":720,"335559739":160,"335559740":240}'>
                &nbsp;
              </span>
            </p>
            <p>
              <span data-contrast="none">
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;2.4  {" "}
              </span>
              <span data-contrast="none">
                ผู้สมัครเป็นสมาชิกต้องไม่เป็นผู้เยาว์และมีอายุตั้งแต่{" "}
              </span>
              <span data-contrast="none">10 </span>
              <span data-contrast="none">ปีบริบูรณ์ขึ้นไป</span>
              <span data-contrast="none">  </span>
              <span data-contrast="none">ไม่เป็นคนไร้ความสามารถ</span>
              <span data-contrast="none">  </span>
              <span data-contrast="none">
                รวมทั้งไม่เป็นคนเสมือนไร้ความสามารถ
              </span>
              <span data-contrast="none"> </span>
              <span data-ccp-props='{"134233118":true,"201341983":0,"335559731":720,"335559739":160,"335559740":240}'>
                &nbsp;
              </span>
            </p>
            <p>
              <span data-contrast="none">
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;2.5{" "}
              </span>
              <span data-contrast="none">
                บริษัทขอสงวนสิทธิในการยกเลิกการเป็นสมาชิก
                หรือเปลี่ยนแปลงเงื่อนไขสิทธิประโยชน์โดยไม่ต้องแจ้งให้ทราบล่วงหน้า
              </span>
              <span data-ccp-props='{"134233118":true,"201341983":0,"335559731":720,"335559739":160,"335559740":240}'>
                &nbsp;
              </span>
            </p>
            <p>
              <strong>
                <span data-contrast="none">3. </span>
              </strong>
              <strong>
                <span data-contrast="none">
                  การลงทะเบียนเพื่อเข้าใช้งานแพลตฟอร์ม
                </span>
              </strong>
              <span data-ccp-props='{"134233118":true,"201341983":0,"335559739":160,"335559740":240}'>
                &nbsp;
              </span>
            </p>
            <p>
              <span data-contrast="none">
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;3.1
              </span>
              <span data-contrast="none">
                ผู้ขอใช้บริการสามารถลงทะเบียนเข้าใช้งานแพลตฟอร์มได้โดยจะต้องทำการให้รายละเอียดข้อมูลตามที่บริษัทกำหนด
                รวมทั้งได้รับอนุมัติจากบริษัทให้เป็นสมาชิก
                โดยผู้ใช้บริการต้องผูกพันและปฏิบัติตามข้อกำหนดและเงื่อนไขในการใช้บริการ
              </span>{" "}
              <span data-contrast="none">
                อนึ่ง ผู้ขอใช้บริการต้องทำการตั้งรหัสผ่านสมาชิก
                โดยขั้นตอนการยืนยันโดยรหัสลับ (
              </span>
              <span data-contrast="none">OTP) </span>
              <span data-contrast="none">
                ที่ทางบริษัทจัดส่งให้ภายในระยะเวลาที่กำหนด ทั้งนี้
                สมาชิกจะต้องรักษารหัสผ่านไว้เป็นความลับและไม่เปิดเผยหรือกระทำการใด
                ๆ ที่อาจทำให้ผู้อื่นทราบรหัสผ่าน
              </span>
              <span data-ccp-props='{"134233118":true,"201341983":0,"335559731":720,"335559739":160,"335559740":240}'>
                &nbsp;
              </span>
            </p>
            <p>
              <span data-contrast="none">
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;3.2
              </span>
              <span data-contrast="none">
                สมาชิกรับรองว่าบรรดาข้อมูลที่ได้ให้ไว้แก่บริษัทในการลงทะเบียนเข้าใช้แพลตฟอร์มนี้ถูกต้องครบถ้วน
                โดยเฉพาะอย่างยิ่งรับรองว่าเบอร์โทรศัพท์มือถือหรืออีเมลส่วนตัวยังใช้งานอยู่ในขณะที่ได้ให้ข้อมูลดังกล่าว
              </span>
              <span data-ccp-props='{"134233118":true,"201341983":0,"335559731":720,"335559739":160,"335559740":240}'>
                &nbsp;
              </span>
            </p>
            <ol start="4">
              <li>
                <strong> </strong>
                <strong>
                  <span data-contrast="none" className="text-sm">
                    การปรับเปลี่ยนข้อมูลส่วนตัวของสมาชิก
                  </span>
                </strong>
              </li>
            </ol>
            <p>
              <span data-contrast="none">
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;4.1  {" "}
              </span>
              <span data-contrast="none">
                สมาชิกสามารถทำการปรับเปลี่ยนผ่านทางแพลตฟอร์ม
              </span>{" "}
              &nbsp;
              <br />
              <br />
              <span data-contrast="none">
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;4.2  {" "}
              </span>
              <span data-contrast="none">
                สมาชิกรับรองว่า หากมีการเปลี่ยนแปลงข้อมูลส่วนตัวของสมาชิก
                สมาชิกจะปรับปรุงข้อมูลส่วนตัวของสมาชิกให้ทันสมัยอยู่ตลอดเวลา
              </span>
              <span data-ccp-props='{"134233118":true,"201341983":0,"335559685":720,"335559739":160,"335559740":240}'>
                &nbsp;
              </span>
            </p>
          </div>
          <div style={{ width: "90%", margin: "auto" }}>
            <div className="mt-2">
              <label className="inline-flex items-center cursor-pointer">
                <span
                  className="text-xs font-normal text-white"
                  style={{
                    whiteSpace: "pre-wrap",
                    textIndent: "32px",
                    lineHeight: "1.2",
                  }}
                >
                  ข้าพเจ้ายินยอมให้ บริษัท ข้าวมาบุญครอง จำกัด ("บริษัทฯ")
                  รวมถึงบริษัทในกลุ่มเอ็มบีเคและพันธมิตรทางธุรกิจประมวลผลข้อมูลส่วนบุคคลของข้าพเจ้า
                </span>
              </label>
            </div>
            <div className="mt-2">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  id="isPolicy1"
                  type="checkbox"
                  name="isPolicy1"
                  className="form-checkbox text-xs border-2 rounded text-gold-mbk ml-1 w-5 h-5 ease-linear transition-all duration-150"
                  onChange={policyChange}
                  checked={Data.isPolicy1}
                  style={{ alignSelf: "stretch" }}
                />
                <span
                  className="ml-2 text-xs font-normal text-white"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {
                    "เพื่อติดต่อสื่อสาร ให้ข้อมูลข่าวสารสิทธิประโยชน์ รายการส่งเสริมการขาย การโฆษณาและกิจกรรมทางการตลาด"
                  }
                </span>
              </label>
            </div>
            <div className="mt-2">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  id="isPolicy2"
                  type="checkbox"
                  name="isPolicy2"
                  className="form-checkbox text-xs border-2 rounded text-gold-mbk ml-1 w-5 h-5 ease-linear transition-all duration-150"
                  onChange={policyChange}
                  checked={Data.isPolicy2}
                  style={{ alignSelf: "stretch" }}
                />
                <span
                  className="ml-2 text-xs font-normal text-white"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {
                    "เพื่อวิเคราะห์ความชอบและความสนใจจากประวัติการใช้บริการผ่านช่องทางต่างๆ"
                  }
                  {/* <span style={{ fontSize: "0.745rem" }}>
                    {"\nTo receive special promotion and update news."}{" "}
                  </span> */}
                </span>
              </label>
            </div>
            <div className="mt-2">
              <label className="inline-flex items-center cursor-pointer">
                <span
                  className="text-xs font-normal text-white"
                  style={{
                    whiteSpace: "pre-wrap",
                    textIndent: "32px",
                    lineHeight: "1.2",
                  }}
                >
                  ทั้งนี้ความหมายของคำว่า บริษัทในกลุ่มเอ็มบีเค
                  และพันธมิตรทางธุรกิจข้อมูลส่วนบุคคล การประมวลผล
                  มาตรการรักษาความปลอดภัยของข้อมูลส่วนบุคคล ระยะเวลาการเก็บ
                  การถอนความยินยอม สิทธิของเจ้าของข้อมูลส่วนบุคคล ฯลฯ
                  มีรายละเอียดตาม{" "}
                  <a
                    href="https://www.prg.co.th/th/privacy_policy"
                    style={{
                      // textDecorationLine: "underline",
                      // textDecorationColor: '#d0b027',
                      // textDecorationThickness: "2px",
                      lineHeight: "1.2",
                    }}
                    className="underline text-xs text-gold-mbk"
                    target="_blank"
                  >
                    นโยบายคุ้มครองข้อมูลส่วนบุคคล (Privacy Policy)
                  </a>
                  <br />
                  ของบริษัทฯ
                </span>
              </label>
            </div>
            <div className="relative  px-4  flex-grow flex-1 flex mt-2">
              <button
                className=" w-6\/12 bg-white text-gray-700 font-bold uppercase px-3 py-2 text-sm rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                style={{ width: "50%" }}
                onClick={policyclose}
              >
                {"ยกเลิก"}
              </button>
              <button
                className={
                  "disabledInput w-6/12 bg-gold-mbk text-white font-bold uppercase px-3 py-2 text-sm rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                }
                type="button"
                disabled={enableButton}
                style={{ width: "50%" }}
                onClick={policyAllow}
              >
                {"อนุญาต"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {page === "otp" ? (
        <div
          className=" noselect bg-green-mbk"
          style={{ height: "calc(100vh - 100px)" }}
        >
          <div
            style={{
              width: "90%",
              padding: "10px",
              margin: "auto",
            }}
          >
            <div
              style={{
                width: "100%",
                backgroundColor: "#FFF",
                height: "calc(100vh - 470px)",
                minHeight: "330px",
                borderRadius: "10px",
                marginTop: "10vh",
                padding: "20px",
                paddingTop: "45px",
              }}
            >
              <div className="flex text-gray-mbk text-2xs font-bold justify-center">
                {"รหัส OTP จะถูกส่งเป็น SMS ไปที่"}
              </div>
              <div className="flex text-gray-mbk text-2xs font-bold justify-center">
                {"หมายเลข  " + Data.phone}
              </div>
              {/* + "(" + otp.generateOTP + ")" */}
              <div className="flex text-gray-mbk text-2xs font-bold justify-center">
                {"Referance No. " + otp.generateref}
              </div>
              <div className="flex text-green-mbk text-xxs font-bold justify-center mt-5">
                {"กรุณากรองรหัส OTP"}
              </div>
              <div className="mt-10">
                <OtpInput
                  className={"OtpInput unsetInputMark"}
                  value={otp.otp}
                  onChange={onOTPChange}
                  inputStyle={{}}
                  numInputs={6}
                  separator={<span></span>}
                  isInputNum={true}
                />
              </div>

              <div
                className="text-center py-2 text-red-500"
                style={{ display: otp.incorrect ? "" : "none" }}
              >
                รหัส OTP ไม่ถูกต้อง
              </div>
              <div className="flex justify-center mt-10">
                <button
                  className=" w-6\/12 bg-gold-mbk text-white font-bold uppercase px-3 py-2 text-sm rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  style={{ width: "50%" }}
                  onClick={confirmotp}
                >
                  {"ยืนยัน"}
                </button>
              </div>
              <div
                className="flex text-gray-mbk text-xxs font-bold justify-center mt-2"
                onClick={generate}
              >
                {"ขอรหัส OTP ใหม่"}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Register;
