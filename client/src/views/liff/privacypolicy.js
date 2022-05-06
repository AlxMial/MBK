import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { path } from "../../layouts/Liff";
// components
const Privacypolicy = () => {
  let history = useHistory();
  const [Data, setData] = useState({
    policy1: false,
    policy2: false,
    policy3: false,
  });
  const handleChange = (e) => {
    const { name } = e.target;
    let value = !Data[name];
    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const windowclose = () => {
    console.log("window close");
  };
  const allow = () => {
    ///
    console.log(Data);
    history.push(path.otp);
  };
  return (
    <>
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
            <label
              className="inline-flex items-center cursor-pointer"
              //   onClick={handleChange}
            >
              <input
                id="remember"
                type="checkbox"
                name="policy1"
                className="form-checkbox border-2 rounded text-gold-mbk ml-1 w-5 h-5 ease-linear transition-all duration-150"
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
            onClick={windowclose}
          >
            {"Cancel"}
          </button>
          <button
            className=" w-6\/12 bg-gold-mbk text-white font-bold uppercase px-3 py-2 text-sm rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
            style={{ width: "50%" }}
            onClick={allow}
          >
            {"Allow"}
          </button>
        </div>
      </div>
    </>
  );
};

export default Privacypolicy;