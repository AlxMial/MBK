import React, { useState } from "react";
import Select from "react-select";
import InputMask from "react-input-mask";
import { useHistory } from "react-router-dom";
import { path } from "../../layouts/Liff";
// components

const GetReward = () => {
  const history = useHistory();
  const [rewardCode, setrewardCode] = useState([
    { code: "" },
    { code: "" },
    { code: "" },
    { code: "" },
  ]);
  const [confirmsucceed, setconfirmsucceed] = useState(false);
  const confirmreward = () => {
    /// check api
    setconfirmsucceed(true);
  };
  return (
    <>
      <div className="bg-green-mbk" style={{ height: "calc(100vh - 100px)" }}>
        <div
          style={{
            width: "90%",
            padding: "10px",
            margin: "auto",
          }}
        >
          {!confirmsucceed ? (
            <>
              {/* กรอก code  */}
              <div className="text-lg text-white font-bold text-center ">
                {"กรองโค้ดเพื่อสะสมคะแนน"}
              </div>
              <div
                style={{
                  width: "100%",
                  backgroundColor: "#FFF",
                  height: "calc(100vh - 300px)",
                  borderRadius: "10px",
                  marginTop: "2vh",
                  padding: "20px",
                }}
              >
                <div>
                  <label
                    className="block text-blueGray-600 text-sm font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    ร้านค้า
                  </label>
                </div>
                <div>
                  <Select
                    className="select-line border-0  py-1  text-gray-mbk bg-white text-base  focus:outline-none w-full ease-linear transition-all duration-150"
                    style={{ borderBottom: "1px solid #d6d6d6" }}
                    id={"store"}
                    name={"store"}
                    placeholder={"store"}
                    // onChange={onChange}
                    // value={options.filter((e) => e.value === value)}
                    // options={options}
                  />
                </div>
                <div
                  className="line-scroll"
                  style={{ overflow: "scroll", height: "calc(100% - 120px)" }}
                >
                  {[...rewardCode].map((e, i) => {
                    return (
                      <>
                        <div className="flex mt-5">
                          <div
                            className="bg-green-mbk relative circle"
                            style={{
                              width: "40px",
                              height: "40px",
                              lineHeight: "40px",
                            }}
                          >
                            <spen
                              className="text-white font-bold text-xs"
                              style={{ padding: "10px" }}
                            >
                              {i + 1}
                            </spen>
                          </div>
                          <div className="px-5">
                            <InputMask
                              className={
                                "border-0 px-2 py-1 placeholder-blueGray-300 text-gray-mbk bg-white  text-base  focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                              }
                              style={{ borderBottom: "1px solid #d6d6d6" }}
                              value={e.code}
                              name={"code-" + (i + 1)}
                              type={"text"}
                              //   onChange={onChange}
                              placeholder={"XXXX-XXXX-XXXX-XXXX"}
                              mask={"9999-9999-9999-9999"}
                              maskChar=" "
                            />
                          </div>
                        </div>
                      </>
                    );
                  })}
                </div>

                <div className="relative  px-4  flex-grow flex-1 flex mt-5">
                  <button
                    className=" w-6\/12 bg-green-mbk text-white font-bold uppercase px-3 py-2 text-sm rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    style={{ width: "50%" }}
                    onClick={() => {
                      history.push(path.member);
                    }}
                  >
                    {"Cancel"}
                  </button>
                  <button
                    className=" w-6\/12 bg-gold-mbk text-white font-bold uppercase px-3 py-2 text-sm rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    style={{ width: "50%" }}
                    onClick={confirmreward}
                  >
                    {"OK"}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="text-lg text-white font-bold text-center ">
                {"icon"}
              </div>
              <div className="text-lg text-white font-bold text-center ">
                {"โค้ด"}
              </div>
              <div className="text-lg text-white font-bold text-center ">
                {"XXXX-XXXX-XXXX-XXXX"}
              </div>
              <div className="text-lg text-white font-bold text-center ">
                {"สถานะ : รอยืนยัน"}
              </div>
              <div
                className="text-lg text-white font-bold text-center "
                onClick={() => {
                  history.push(path.member);
                }}
              >
                {"กลับหน้าหลัก"}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
export default GetReward;
