import React, { useState, useEffect } from "react";
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
import { path } from "../../layouts/Liff";
import {
  InputUC,
  SelectUC,
  validationSchema,
  DatePickerContainer,
  monthMap,
} from "./profile";
import Spinner from "components/Loadings/spinner/Spinner";
const Register = () => {
  let history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToasts();
  const [dataProvice, setDataProvice] = useState([]);
  const [dataDistrict, setDataDistrict] = useState([]);
  const [dataSubDistrict, setSubDistrict] = useState([]);
  const [dataOTP, setdataOTP] = useState({});
  const [page, setpage] = useState("register");

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
    memberPointExpire: moment(new Date()).toDate(),
    uid: Session.getLiff().uid,
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
    if (policy.policy1 && policy.policy2 && policy.policy3) {
      setpage("otp");
      generate();
    }
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
    let data = await senderValidate(
      dataOTP.result.token,
      otp.otp,
      dataOTP.result.ref_code,
      (e) => {
        // console.log(e)
        if (e.code === "000") {
          DoSave();
        } else {
          setotp((prevState) => ({
            ...prevState,
            ["incorrect"]: true,
          }));
        }
      }
    );
    // if (otp.otp == otp.generateOTP) {
    //   // history.push(path.register);
    //   DoSave();
    //   // history.push(path.member);
    // } else {
    //   setotp((prevState) => ({
    //     ...prevState,
    //     ["incorrect"]: true,
    //   }));
    // }
  };
  const SenderOTP = async (phone) => {
    // console.log("senderOTP : " + phone);
    // axios.
    let data = await senderOTP(phone, otp.generateOTP, otp.generateref, (e) => {
      setdataOTP(e);
      // console.log("dataOTP : ");
      // console.log(dataOTP);
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
  const policyChange = (e) => {
    const { name } = e.target;
    setpolicy((prevState) => ({
      ...prevState,
      [name]: !policy[name],
    }));
  };
  useEffect(() => {
    address();
    SenderOTP();
    // confirmotp();
  }, []);

  const validation = async () => {
    const isFormValid = await validationSchema.isValid(Data, {
      abortEarly: false,
    });
    if (isFormValid) {
      setpage("privacypolicy");
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
          console.log(errors);
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

        addToast(msg.msg, { appearance: msg.appearance, autoDismiss: true });
        if (res.data.status) {
          Session.setcheckRegister({ isRegister: true });
          history.push(path.member);
        }
      })
      .catch((e) => {
        addToast(e.message, { appearance: "warning", autoDismiss: true });
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
              className="fullheight"
              style={{
                width: "100%",
                backgroundColor: "#FFF",
                height: "calc(100vh - 200px)",
                minHeight: "450px",
                borderRadius: "10px",
                padding: "20px",
                overflow: "scroll",
              }}
            >
              <div className="flex text-green-mbk font-bold text-lg mb-2">
                {"สมัครสมาชิก"}
              </div>
              <InputUC
                name="firstName"
                lbl="ชื่อ"
                length={255}
                type="text"
                onChange={handleChange}
                value={Data.firstName}
                error={errors.firstName}
                valid={true}
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
              />
              <InputUC
                name="phone"
                lbl="เบอร์โทร"
                type="tel"
                onChange={handleChange}
                value={Data.phone}
                error={errors.phone}
                valid={true}
              />
              <SelectUC
                name="sex"
                lbl="เพศ"
                onChange={(e) => {
                  handleChange({ target: { name: "sex", value: e.value } });
                }}
                value={Data.sex}
                options={[
                  { value: "1", label: "ชาย" },
                  { value: "2", label: "หณิง" },
                ]}
                error={errors.sex}
              />
              {/* วันเกิด */}

              <div className="mb-5">
                <div className="flex text-green-mbk font-bold text-sm ">
                  {"วันเกิด"}
                </div>
                <DatePickerContainer>
                  <DatePicker
                    isOpen={true}
                    isPopup={false}
                    showHeader={false}
                    // showCaption={true}
                    min={new Date(1970, 0, 1)}
                    max={new Date()}
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
                      // date.setDate(date.getDate() - 1);
                      setData((prevState) => ({
                        ...prevState,
                        ["birthDate"]: date,
                      }));
                    }}
                  />
                </DatePickerContainer>
              </div>

              <InputUC
                name="email"
                lbl="อีเมล"
                type="text"
                onChange={handleChange}
                value={Data.email}
                error={errors.email}
                valid={true}
              />
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
                onChange={handleChange}
                value={Data.postcode}
                error={errors.postcode}
              />

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
        <div className="bg-green-mbk" style={{ height: "calc(100vh - 100px)" }}>
          <div
            style={{
              width: "90%",
              backgroundColor: "#FFF",
              height: "45vh",
              padding: "10px",
              margin: "auto",
              borderRadius: "10px",
            }}
          >
            gg
          </div>
          <div style={{ width: "90%", margin: "auto" }}>
            <div className="mt-5">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  id="remember"
                  type="checkbox"
                  name="policy1"
                  className="form-checkbox border-2 rounded text-gold-mbk ml-1 w-5 h-5 ease-linear transition-all duration-150"
                  onChange={policyChange}
                  checked={Data.policy1}
                />
                <span
                  className="ml-2 text-sm font-normal text-white"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {
                    "ข้าพเจ้าได้อ่านและยอมรับ ข้อกำหนดและเงื่อนไข\nI have read and agree with the Terms and Conditions"
                  }
                </span>
              </label>
            </div>
            <div className="mt-5">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  id="remember"
                  type="checkbox"
                  name="policy2"
                  className="form-checkbox border-2 rounded text-gold-mbk ml-1 w-5 h-5 ease-linear transition-all duration-150"
                  onChange={policyChange}
                  checked={Data.policy2}
                />
                <span
                  className="ml-2 text-sm font-normal text-white"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {
                    " ข้าพเจ้าได้อ่านและยอมรับ นโยบายความเป็นส่วนตัว\nI have read and agree with the Privacy Policy."
                  }
                </span>
              </label>
            </div>
            <div className="mt-5">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  id="remember"
                  type="checkbox"
                  name="policy3"
                  className="form-checkbox border-2 rounded text-gold-mbk ml-1 w-5 h-5 ease-linear transition-all duration-150"
                  onChange={policyChange}
                  checked={Data.policy3}
                />
                <span
                  className="ml-2 text-sm font-normal text-white"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {
                    "เพื่อรับข่าวสารล่าสุด และข้อมูลโปรโมชั่นต่าง ๆ \nTo receive special promotion and update news. "
                  }
                </span>
              </label>
            </div>
          </div>

          <div className="relative  px-4  flex-grow flex-1 flex mt-5">
            <button
              className=" w-6\/12 bg-green-mbk text-white font-bold uppercase px-3 py-2 text-sm rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="button"
              style={{ width: "50%" }}
              onClick={policyclose}
            >
              {"ยกเลิก"}
            </button>
            <button
              className=" w-6\/12 bg-gold-mbk text-white font-bold uppercase px-3 py-2 text-sm rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="button"
              style={{ width: "50%" }}
              onClick={policyAllow}
            >
              {"อนุญาต"}
            </button>
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
                height: "40vh",
                minHeight: "330px",
                borderRadius: "10px",
                marginTop: "10vh",
                padding: "20px",
              }}
            >
              <div className="flex text-gray-mbk text-2xs font-bold justify-center">
                {"รหัส OTP จะถูกส่งเป็น SMS ไปที่"}
              </div>
              <div className="flex text-gray-mbk text-2xs font-bold justify-center">
                {"หมายเลข  " + Data.phone + "(" + otp.generateOTP + ")"}
              </div>
              <div className="flex text-gray-mbk text-2xs font-bold justify-center">
                {"Referance No. " + otp.generateref}
              </div>
              <div className="flex text-green-mbk text-xxs font-bold justify-center mt-5">
                {"กรุณากรองรหัส OTP"}
              </div>
              <div className="mt-10">
                <OtpInput
                  className={"OtpInput"}
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
