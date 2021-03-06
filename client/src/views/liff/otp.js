import React, { useState, useEffect } from "react";
import OtpInput from "react-otp-input";
import { useHistory } from "react-router-dom";
import InputMask from "react-input-mask";
import { path } from "@services/liff.services";
import * as Session from "@services/Session.service";
// components

const Otp = () => {
  let history = useHistory();
  const [Data, setData] = useState({
    isotp: true,
    PhoneNumber: Session.getphon(),
    generateOTP: null,
    generateref: null,
    otp: null,
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const generate = () => {
    let PhoneNumber = Data.PhoneNumber.replaceAll("-", "");
    // let PhoneNumber = Session.getphon().replaceAll("-", "");
    if (PhoneNumber.length == 10) {
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
      setData((prevState) => ({
        ...prevState,
        ["isotp"]: true,
        ["generateOTP"]: otp,
        ["generateref"]: ref,
      }));
      senderOTP(PhoneNumber);
    }
  };

  const senderOTP = (PhoneNumber) => {
    console.log("senderOTP : " + PhoneNumber);
  };
  const onOTPChange = (e) => {
    setData((prevState) => ({
      ...prevState,
      ["otp"]: e,
    }));
  };
  const confirmotp = () => {
    if (Data.otp == Data.generateOTP) {
      // history.push(path.register);
      history.push(path.member);
    } else {
    }
  };

  useEffect(() => {
    generate();
  }, []);
  return (
    <>
      <div className="bg-green-mbk" style={{ height: "calc(100vh - 90px)" }}>
        <div
          style={{
            width: "90%",
            padding: "10px",
            margin: "auto",
          }}
        >
          {!Data.isotp ? (
            // ????????????????????????
            <div
              style={{
                width: "100%",
                backgroundColor: "#FFF",
                height: "25vh",
                minHeight: "200px",
                borderRadius: "10px",
                marginTop: "10vh",
                padding: "20px",
              }}
            >
              <div className="flex text-blueGray-600 text-base  justify-center">
                {"?????????????????????????????????????????????"}
              </div>
              <div className="mt-5">
                <InputMask
                  className={
                    "border-0 px-2 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-base text-center shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  }
                  value={Data.PhoneNumber}
                  name="PhoneNumber"
                  type="tel"
                  onChange={handleChange}
                  placeholder="0X-XXXX-XXXX"
                  mask={"099-999-9999"}
                  maskChar=" "
                />
              </div>
              <div className="justify-center flex mt-5">
                <button
                  className=" bg-gold-mbk text-white font-bold uppercase px-3 py-2 text-sm rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  style={{ width: "50%" }}
                  onClick={generate}
                >
                  {"??????????????????"}
                </button>
              </div>
            </div>
          ) : (
            // confirm otp
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
                {"???????????? OTP ???????????????????????????????????? SMS ???????????????"}
              </div>
              <div className="flex text-gray-mbk text-2xs font-bold justify-center">
                {"?????????????????????  " + Data.PhoneNumber + "(" + Data.generateOTP + ")"}
              </div>
              <div className="flex text-gray-mbk text-2xs font-bold justify-center">
                {"Referance No. " + Data.generateref}
              </div>
              <div className="flex text-green-mbk text-xxs font-bold justify-center mt-5">
                {"??????????????????????????????????????? OTP"}
              </div>
              <div className="mt-10 unsetInputMark">
                <OtpInput
                  className={"OtpInput"}
                  value={Data.otp}
                  onChange={onOTPChange}
                  inputStyle={{}}
                  numInputs={6}
                  separator={<span></span>}
                  isInputNum={true}
                />
              </div>
              <div className="flex justify-center mt-10">
                <button
                  className=" w-6\/12 bg-gold-mbk text-white font-bold uppercase px-3 py-2 text-sm rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  style={{ width: "50%" }}
                  onClick={confirmotp}
                >
                  {"??????????????????"}
                </button>
              </div>
              <div
                className="flex text-gray-mbk text-xxs font-bold justify-center mt-2"
                onClick={generate}
              >
                {"?????????????????? OTP ????????????"}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Otp;
