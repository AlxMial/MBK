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
} from "./profile";
import Spinner from "components/Loadings/spinner/Spinner";
import { styleSelectLine } from "assets/styles/theme/ReactSelect";

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
    if (policy.policy1 && policy.policy2) {
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
          Session.setcheckRegister({ isRegister: true });
          history.push(path.member);
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
                length={10}
                onChange={handleChange}
                value={Data.phone}
                error={errors.phone}
                valid={true}
                refs={inputPhoneRef}
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
                  { value: "2", label: "หญิง" },
                ]}
                error={errors.sex}
              />
              {/* วันเกิด */}
              <div className="">
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
                    max={new Date(new Date().setFullYear(new Date().getFullYear() - 13))}
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
                refs={inputEmailRef}
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
              padding: "20px",
              margin: "auto",
              borderRadius: "10px",
              overflowY: "auto",
            }}
          >
            <div className="text-center mt-2">
              <span className="text-green-mbk font-bold text-base">
                เงื่อนไขการใช้งาน
              </span>
            </div>
            <br />
            1. ผู้ใช้งานต้องยอมรับข้อตกลงและเงื่อนไขของ Mahboonkrongrice
            ก่อนเข้าเป็นสมาชิกในการใช้งาน
            โดยสมาชิกไม่สามารถยกเลิกการยอมรับดังกล่าวได้
            ทั้งนี้การใช้งานโปรแกรมนี้
            จะต้องยอมรับข้อตกลงการใช้งานที่เกี่ยวเนื่องกับ Mahboonkrongrice
            วิธีการซื้อสินค้า วิธีการสะสมคะแนน และรับสิทธิพิเศษต่างๆ
            หากข้อตกลงนี้มีเนื้อหาที่ขัดกับข้อตกลงการใช้งานให้ถือบังคับใช้ตามที่ข้อตกลงการใช้งานแอปพลิเคชั่น
            Line @mahboonkrongrice เป็นหลัก
            <br />
            <br />
            2.
            กรณีที่ผู้ใช้งานยังไม่บรรลุนิติภาวะต้องได้รับความยินยอมจากผู้แทนโดยชอบธรรม
            (รวมถึงการยอมรับข้อตกลงนี้) ก่อนใช้งาน
            <br />
            <br />
            3.
            สำหรับสมาชิกที่ยังไม่บรรลุนิติภาวะในขณะที่ยอมรับข้อตกลงนี้และใช้งานโปรแกรมนี้หลังจากบรรลุนิติภาวะแล้ว
            จะถือว่าสมาชิกดังกล่าวยอมรับการกระทำทุกอย่างที่ผ่านมาเกี่ยวกับโปรแกรมนี้
            <br />
            <br />
            4. ข้อตกลงและเงื่อนไขดังกล่าวอาจมีการเปลี่ยนแปลงตามที่บริษัทฯ
            พิจารณาและเห็นสมควร โดยไม่ต้องแจ้งก่อนล่วงหน้า
            <br />
            <br />
            5. หากบริษัทฯ มีการเปลี่ยนแปลงข้อตกลงนี้ จะแสดงบนเว็บไซต์ของบริษัท
            และให้การเปลี่ยนแปลงข้อตกลงนี้มีผลบังคับใช้ทันทีที่แสดงข้อมูลดังกล่าว
            <br />
            6. หากสมาชิกไม่ยอมรับการเปลี่ยนแปลงตามข้อตกลงนี้
            โปรดหยุดการใช้งานโปรแกรมนี้ทันที
            ซึ่งกรณีดังกล่าวอาจทำให้คะแนนที่สะสมเป็นโมฆะ โดยบริษัทฯ
            มิจำเป็นต้องรับผิดชอบใด ๆ ต่อความเสียหายอันอาจเกิดต่อสมาชิก
            <br />
            <br />
            7. ผู้ที่สามารถสมัครเป็นสมาชิกโปรแกรมนี้ ต้องมีอายุตั้งแต่ 13
            ปีบริบูรณ์ขึ้นไปและพำนักอยู่ในประเทศไทยเท่านั้น
            <br />
            <br />
            8. ผู้ที่มีความประสงค์จะเป็นสมาชิก
            ต้องสมัครสมาชิกโดยลงทะเบียนข้อมูลสมาชิกและรหัสผ่านตามที่บริษัทฯ
            กำหนดในการใช้งานโปรแกรมนี้
            <br />
            <br />
            9. สมาชิกสามารถสร้างบัญชีได้ท่านละ 1 บัญชีเท่านั้น
            ผู้ที่เป็นสมาชิกอยู่แล้วไม่สามารถสมัครสมาชิกเพิ่มได้
            <br />
            <br />
            10. บริษัทฯ
            จะมอบบริการเกี่ยวกับโปรแกรมนี้ให้ตามข้อมูลที่สมาชิกให้ไว้เท่านั้น
            กรณีเกิดความเสียหาย เช่น ของรางวัลส่งไปไม่ถึงสมาชิก ฯลฯ
            เนื่องจากการปลอมแปลงข้อมูลสมาชิก กรอกข้อมูลผิดหรือไม่ครบถ้วน บริษัทฯ
            ไม่จำเป็นต้องรับผิดชอบต่อความเสียหายดังกล่าว
            <br />
            <br />
            11. สมาชิกต้องรักษารหัสผ่านที่ลงทะเบียนไว้เป็นอย่างดี
            และไม่ให้บุคคลอื่นใดนำไปใช้ บริษัทฯ
            จะถือว่าทุกการกระทำที่ดำเนินไปโดยใช้รหัสผ่านที่ลงทะเบียนไว้เป็นการกระทำของสมาชิกเจ้าของรหัสผ่านดังกล่าวทั้งหมด
            หากสมาชิกไม่สามารถเข้าใช้งานได้เนื่องจากลืมรหัสผ่านที่ลงทะเบียนไว้
            บริษัทฯ ไม่ต้องรับผิดชอบใด ๆ
            ต่อความเสียหายที่เกิดขึ้นกับสมาชิกจากการกระทำดังกล่าว
            <br />
            <br />
            12. สมาชิกไม่สามารถยกเลิกการเป็นสมาชิกได้
            <br />
            <br />
            13.
            สมาชิกสามารถใช้โปรแกรมนี้เพื่อวัตถุประสงค์ในการใช้งานส่วนบุคคลเท่านั้น
            <br />
            <br />
            14. ในการใช้งานโปรแกรมนี้
            สมาชิกต้องจัดเตรียมอุปกรณ์เทคโนโลยีสารสนเทศ ซอฟต์แวร์
            เครือข่ายอินเทอร์เน็ต
            และสภาพแวดล้อมการใช้งานอินเทอร์เน็ตอื่นที่จำเป็นด้วยความรับผิดชอบของตนเองและด้วยค่าใช้จ่ายด้วยตนเอง
            <br />
            <br />
            15. บริษัทฯ สามารถเปลี่ยนแปลง เพิ่มเติม หรือลบ
            เนื้อหาของโปรแกรมนี้ทั้งหมดหรือบางส่วนได้
            โดยไม่จำเป็นต้องแจ้งให้สมาชิกทราบล่วงหน้า และบริษัทฯ
            ไม่ต้องรับผิดชอบต่อความเสียหายที่อาจเกิดต่อสมาชิกจากการกระทำดังกล่าว
            <br />
            <br />
            <div className="text-center">
              <span className="text-green-mbk font-bold text-base">
                นโยบายรักษาความปลอดภัยส่วนบุคคลของ Mahboonkrongrice
                มีการกำหนดนโยบายการป้องกันข้อมูลส่วนบุคคล (Personal/Privacy Data
                Protection Policy){" "}
              </span>
            </div>
            <br />
            โดยนโยบายจะอธิบายถึงการใช้และการรักษาข้อมูลส่วนบุคคล
            โดยเฉพาะข้อมูลของผู้ใช้บริการ เอกสารฉบับนี้จะแจ้งข้อมูลสำคัญ ได้แก่
            :
            <br />
            <br />
            • ขอบเขตของข้อมูลส่วนบุคคล
            <br />
            • ข้อมูลส่วนบุคคลที่ Mahboonkrongrice เก็บรวบรวม
            <br />
            • แหล่งที่มาของข้อมูลที่ Mahboonkrongrice เก็บรวบรวม
            <br />
            • Mahboonkrongrice ใช้ข้อมูลของท่านเพื่อวัตถุประสงค์ใด
            <br />
            • การประมวลข้อมูลส่วนบุคคล
            <br />
            • Mahboonkrongrice เก็บรักษาและระยะเวลาในการเก็บรักษาข้อมูลส่วนบุคคล
            <br />
            • การใช้ข้อมูลส่วนบุคคลเพื่อการตลาด
            <br />
            • สิทธิของเจ้าของข้อมูล
            <br />
            <br />
            <div className="text-center">
              <span className="text-green-mbk font-bold text-base">
                ขอบเขตของข้อมูลส่วนบุคคล
              </span>
            </div>
            <br />
            • “ข้อมูลส่วนบุคคล” หรือ Personal Data หมายถึง ข้อมูลใดๆ
            ที่ระบุไปถึง “เจ้าของข้อมูล” (Data Subject)
            ได้ไม่ว่าทางตรงหรือทางอ้อม โดยไม่รวมถึงข้อมูลของผู้ที่ถึงแก่กรรม
            <br />
            <br />
            • “เจ้าของข้อมูล” หรือ Data Subject หมายถึง
            บุคคลที่ข้อมูลส่วนบุคคลนั้นระบุไปถึง
            <br />
            <br />
            • “บุคคล” (Natural Person) หมายถึง บุคคลที่มีชีวิตอยู่ ไม่รวมถึง
            “นิติบุคคล” (Juridical Person) ที่จัดตั้งขึ้นตามกฎหมาย เช่น บริษัท,
            สมาคม, มูลนิธิ, หรือ องค์กรอื่นใด
            <br />
            <br />
            • ไม่รวมถึงกรณีที่ผู้สร้างหรือเก็บรวบรวมข้อมูลนั้น
            (ไม่ใช่บุคคลที่เป็นเจ้าของข้อมูล)
            <br />
            <br />
            <div className="text-center">
              <span className="text-green-mbk font-bold text-base">
                ข้อมูลส่วนบุคคลที่ Mahboonkrongrice เก็บรวบรวม ประกอบด้วย
              </span>
            </div>
            <br />
            • ชื่อ-นามสกุล
            <br />
            • วันเกิด
            <br />
            • เบอร์โทรศัพท์
            <br />
            • เพศ
            <br />
            • วันเกิด
            <br />
            • อายุ
            <br />
            • อีเมลล์
            <br />
            • ที่อยู่
            <br />
            • รูปถ่าย
            <br />
            <br />
            <div
              style={{
                textIndent: "50px",
                textAlign: "justify",
                textJustify: "inter-word",
              }}
            >
              <span>
                เมื่อท่านได้ตกลงยินยอมให้บริษัทเก็บรวบรวม ใช้
                หรือเปิดเผยข้อมูลส่วนบุคคลของข้าพเจ้าตามวัตถุประสงค์ข้างต้นแล้ว
                โปรดแจ้งข้อมูลส่วนบุคคลข้างต้นต่อบริษัทต่อไป โดย
                Mahboonkrongrice จะจัดเก็บข้อมูลส่วนบุคคลเฉพาะที่จำเป็นเท่านั้น
                เพื่อให้ Mahboonkrongrice สามารถติดต่อและให้บริการท่านได้
              </span>
            </div>
            <br />
            <div className="text-center mt-2">
              <span className="text-green-mbk font-bold text-base">
                แหล่งที่มาของข้อมูล ที่ Mahboonkrongrice เก็บรวบรวม
              </span>
            </div>
            <br />
            Mahboonkrongrice ได้รับข้อมูลส่วนบุคคลจากท่านโดยตรง โดย
            Mahboonkrongrice จะเก็บรวบรวมข้อมูลส่วนบุคคลของท่านจาก
            ขั้นตอนการให้บริการดังนี้
            <br />
            <br />
            • ขั้นตอนการสมัครใช้บริการหรือการลงทะเบียนกับ Mahboonkrongrice
            หรือขั้นตอนการขอยื่นคำร้องใช้สิทธิต่างๆ กับ Mahboonkrongrice
            <br />
            <br />
            • ขั้นตอนการสั่งซื้อสินค้าและบริการจาก Mahboonkrongrice
            <br />
            <br />
            <div className="text-center mt-2">
              <span className="text-green-mbk font-bold text-base">
                Mahboonkrongrice ใช้ข้อมูลของท่านเพื่อวัตถุประสงค์ใด
                Mahboonkrongrice เก็บรวบรวมข้อมูลส่วนบุคคลของท่าน
                โดยมีวัตถุประสงค์ ดังนี้
              </span>
            </div>
            <br />
            • เพื่อประโยชน์ในการยืนยันหรือระบุตัวตนของท่านในการติดต่อบริษัท
            หรือการเข้าร่วมกิจกรรมต่าง ๆ ของบริษัท
            <br />
            <br />
            • สามารถติดต่อสื่อสารกับท่าน ที่เกี่ยวข้องกับบริการ การดูแลลูกค้า
            การควบคุมคุณภาพในการให้บริการ
            <br />
            <br />
            • สามารถให้บริการตามคำสั่งซื้อของท่าน
            และสามารถบริหารจัดการการสมัครใช้บริการ การลงทะเบียนกับ
            Mahboonkrongrice ของท่าน
            <br />
            <br />
            • สามารถบริหารและจัดการ การให้บริการกับท่าน
            <br />
            <br />
            • สามารถส่งอีเมล์ หรือ ส่งข้อความ (Notification) หรือ ข่าวสาร
            ให้ผู้ใช้บริการ เพื่อให้ทราบถึงการให้บริการที่ผู้ใช้บริการอาจสนใจ
            <br />
            <br />
            • การวิจัยและการพัฒนา และการปรับปรุงประสบการณ์ของผู้ใช้
            <br />
            <br />
            <div className="text-center mt-2">
              <span className="text-green-mbk font-bold text-base">
                การประมวลข้อมูลส่วนบุคคล
              </span>
            </div>
            <br />
            เมื่อได้รับข้อมูลส่วนบุคคลของท่านแล้ว Mahboonkrongrice
            จะดำเนินการกับข้อมูลส่วนบุคคลของท่าน ดังนี้เก็บรวบรวม โดย
            Mahboonkrongrice มีการเก็บข้อมูลไว้บนแพลตฟอร์มคลาวด์ Amazon Web
            Services (AWS) ซึ่งเป็นระบบที่ได้มาตรฐาน มีความมั่นคงปลอดภัยสูง
            เป็นที่ยอมรับโดยทั่วไป
            <br />
            <br />
            การใช้ข้อมูล Mahboonkrongrice
            มีวัตถุประสงค์ในการใช้ข้อมูลของท่านเพื่อติดต่อสื่อสาร,
            เพื่อการบริการ และการพัฒนาคุณภาพในการให้บริการกับท่าน
            <br />
            <br />
            การเก็บรักษาและระยะเวลาในการเก็บรักษาข้อมูลส่วนบุคคล
            <br />
            <br />
            ระยะเวลาในการเก็บรักษาข้อมูล - Mahboonkrongrice
            จะจัดเก็บข้อมูลส่วนบุคคลของท่านจนกว่าท่านจะเลิกใช้งานระบบ (Inactive
            User) ตามระยะเวลาของกฎหมายที่เกี่ยวข้องได้กำหนดไว้
            โดยเมื่อท่านเลิกใช้งานระบบแล้ว Mahboonkrongrice
            จะเปลี่ยนข้อมูลของท่าน ซึ่งทำให้ไม่สามารถระบุตัวตนของท่านได้
            <br />
            <br />
            การใช้ข้อมูลส่วนบุคคลเพื่อการตลาด
            <br />
            <br />
            ในระหว่างการให้บริการ Mahboonkrongrice
            จะส่งข้อมูลผลิตภัณฑ์และบริการที่คาดว่าท่านน่าจะสนใจไปให้
            โดยหากท่านยอมรับข้อมูลการเสนอผลิตภัณฑ์และบริการแล้ว
            ท่านมีสิทธิที่จะยกเลิกได้ทุกเวลา
            ท่านมีสิทธิ์ที่จะยกเลิกการเสนอข้อมูลผลิตภัณฑ์และบริการ
            หรือการให้ข้อมูลของท่านกับสมาชิกอื่น ๆ ในเครือบริษัท
            Mahboonkrongrice ได้ตลอดเวลา โดยหากท่านยกเลิกดังกล่าว
            Mahboonkrongrice จะไม่สามารถให้บริการกับท่านได้ต่อไป
            <br />
            <br />
            <div className="text-center mt-2">
              <span className="text-green-mbk font-bold text-base">
                สิทธิของเจ้าของข้อมูล
              </span>
            </div>
            <br />
            Mahboonkrongrice ต้องการให้ท่านรับทราบเรื่องสิทธิในการคุ้มครองข้อมูล
            ซึ่งผู้ใช้งานทุกคนจะมีสิทธิดังต่อไปนี้:
            <br />
            <br />
            • สิทธิในการเพิกถอนความยินยอม (Right to Withdraw Consent)
            –ท่านมีสิทธิในการเพิกถอนความยินยอมในการประมวลผล
            รวมถึงเพิกถอนการจัดเก็บข้อมูลส่วนบุคคล ที่ท่านได้ให้ความยินยอมกับ
            Mahboonkrongrice ได้ตลอดระยะเวลาที่ ข้อมูลส่วนบุคคลของท่านอยู่กับ
            Mahboonkrongrice
            <br />
            <br />
            • สิทธิในการเข้าถึงข้อมูล (Right to Access) –
            ท่านมีสิทธิที่จะเข้าถึงข้อมูลส่วนบุคคลของท่านโดยการขอให้
            Mahboonkrongrice จัดทำสำเนาข้อมูลส่วนบุคคลของท่านให้ท่าน รวมถึงขอให้
            Mahboonkrongrice เปิดเผยการได้มาซึ่งข้อมูลของท่าน
            ซึ่งท่านไม่ได้ให้ความยินยอมต่อ Mahboonkrongrice
            <br />
            <br />
            • สิทธิในการแก้ไขข้อมูล (Right to Rectification) –
            ท่านมีสิทธิที่จะขอให้ Mahboonkrongrice
            แก้ไขข้อมูลที่ไม่ถูกต้องหรือไม่สมบูรณ์ได้
            <br />
            <br />
            • สิทธิในการลบข้อมูล (Right to Erasure) – ท่านมีสิทธิที่จะขอให้
            Mahboonkrongrice ลบข้อมูลส่วนตัวของท่าน
            หรือทำให้เป็นข้อมูลที่ไม่สามารถระบุตัวตนของท่านได้
            ซึ่งการลบข้อมูลบางครั้งอาจทำให้ Mahboonkrongrice
            จะไม่สามารถให้บริการกับท่านได้ต่อไป
            <br />
            <br />
            • สิทธิในการระงับการใช้ข้อมูลส่วนบุคคล (Right to Restriction of
            Processing): ท่านมีสิทธิในการระงับการใช้ข้อมูลส่วนบุคคลของท่าน
            ในกรณีดังต่อไปนี้
            <br />
            <br />
            -เมื่อผู้ควบคุมข้อมูลส่วนบุคคลอยู่ในระหว่างการตรวจสอบตามที่เจ้าของข้อมูลส่วนบุคคลร้องขอ
            <br />
            <br />
            -เมื่อเป็นข้อมูลส่วนบุคคลที่ต้องลบหรือทำลาย
            แต่เจ้าของข้อมูลส่วนบุคคลขอให้ระงับการใช้แทน
            <br />
            <br />
            -เมื่อข้อมูลส่วนบุคคลหมดความจำเป็นในการเก็บรักษาไว้ตามวัตถุประสงค์ในการเก็บรวบรวมข้อมูลส่วนบุคคล
            แต่เจ้าของข้อมูลส่วนบุคคลมีความจำเป็นต้องขอให้เก็บรักษาไว้เพื่อใช้ในการก่อตั้งสิทธิเรียกร้องตามกฎหมาย
            <br />
            <br />
            -เมื่อผู้ควบคุมข้อมูลส่วนบุคคลอยู่ในระหว่างการพิสูจน์ หรือตรวจสอบ
            เพื่อปฏิเสธการคัดค้านของเจ้าของข้อมูลส่วนบุคคล
            <br />
            <br />
            • สิทธิในการให้โอนย้ายข้อมูลส่วนบุคคล (Right to Data Portability):
            ท่านมีสิทธิในการโอนย้ายข้อมูลส่วนบุคคลของท่านที่ท่านให้ไว้กับ
            Mahboonkrongrice ไปยังผู้ควบคุมข้อมูลรายอื่น หรือตัวท่านเอง
            <br />
            <br />
            • สิทธิในการคัดค้านการประมวลผลข้อมูลส่วนบุคคล (Right to Object):
            ท่านมีสิทธิในการคัดค้านการ ประมวลผลข้อมูลส่วนบุคคลของท่าน
            โดยหากท่านยกเลิกดังกล่าว ในกรณี ดังต่อไปนี้
            <br />
            <br />
            -กรณีที่เป็นข้อมูลส่วนบุคคลที่เก็บรวบรวมได้โดยได้รับยกเว้นไม่ต้องขอความยินยอม
            <br />
            <br />
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
                  style={{ alignSelf: "stretch" }}
                />
                <span
                  className="ml-2 text-sm font-normal text-white"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {"ข้าพเจ้าได้อ่านและยอมรับ ข้อกำหนดและเงื่อนไข"}
                  <span style={{ fontSize: "0.745rem" }}>
                    {"\nI have read and agree with the Terms and Conditions"}{" "}
                  </span>
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
                  style={{ alignSelf: "stretch" }}
                />
                <span
                  className="ml-2 text-sm font-normal text-white"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {"ข้าพเจ้าได้อ่านและยอมรับ นโยบายความเป็นส่วนตัว"}
                  <span style={{ fontSize: "0.745rem" }}>
                    {"\nI have read and agree with the Privacy Policy."}{" "}
                  </span>
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
                  style={{ alignSelf: "stretch" }}
                />
                <span
                  className="ml-2 text-sm font-normal text-white"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {"เพื่อรับข่าวสารล่าสุด และข้อมูลโปรโมชั่นต่าง ๆ"}
                  <span style={{ fontSize: "0.745rem" }}>
                    {"\nTo receive special promotion and update news."}{" "}
                  </span>
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
              className=" disableInput w-6\/12 bg-gold-mbk text-white font-bold uppercase px-3 py-2 text-sm rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="button"
              disabled={(policy.policy1 && policy.policy2) ? false : true}
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
                {"หมายเลข  " + Data.phone } 
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
