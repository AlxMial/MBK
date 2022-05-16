import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "services/axios";
import InputMask from "react-input-mask";
import { useHistory } from "react-router-dom";
import {
  path,
  checkRegister as apiCheckRegister,
  listPointStore,
} from "@services/liff.services";
import { IsNullOrEmpty } from "@services/default.service";
import Spinner from "components/Loadings/spinner/Spinner";
import { useToasts } from "react-toast-notifications";
import { styleSelectLine } from "assets/styles/theme/ReactSelect";
// components

const GetReward = () => {
  const history = useHistory();
  const { addToast } = useToasts();
  const [isLoading, setIsLoading] = useState(false);
  const [rewardCode, setrewardCode] = useState([
    { index: 0, code: "", state: null },
    { index: 1, code: "", state: null },
    { index: 2, code: "", state: null },
  ]);
  const [tbMember, settbMember] = useState({});
  const [valueStore, setvalueStore] = useState(null);
  const [valueBranch, setvalueBranch] = useState(null);
  const [isbranch, setisbranch] = useState(false);

  const [optionsStore, setoptionsStore] = useState([]);
  const [optionsbranch, setoptionsbranch] = useState([]);

  const [succeedData, setsucceedData] = useState([]);

  const [confirmsucceed, setconfirmsucceed] = useState(false);
  const useStyle = styleSelectLine();
  const confirmreward = () => {
    /// check api
    let code = [];
    rewardCode.map((e, i) => {
      if (!IsNullOrEmpty(e.code) && e.state !== true) {
        code.push(e.code.replaceAll(" ", ""));
      }
    });
    if (code.length > 0) {
      setIsLoading(true);
      axios
        .post("/redeem", {
          memberId: tbMember.id,
          redeemCode: code,
          storeId: valueStore,
          branchId: valueBranch,
        })
        .then((res) => {
          let _rewardCode = rewardCode;
          let data = res.data.data;
          data.map((e, i) => {
            _rewardCode.map((ee, i) => {
              if (e.coupon === ee.code.toUpperCase()) {
                e.isInvalid
                  ? (ee.state = false)
                  : e.isExpire
                  ? (ee.state = false)
                  : e.isUse
                  ? (ee.state = false)
                  : (ee.state = true);
              }
            });
          });
          setrewardCode(_rewardCode);
          setsucceedData(res.data.data);
          let succeed = true;
          _rewardCode.map((e, i) => {
            if (!IsNullOrEmpty(e.code)) {
              if (e.state == false) {
                succeed = false;
              }
            }
          });
          if (succeed) {
            setconfirmsucceed(true);
          }
        })
        .catch((error) => {
          addToast(error.message, { appearance: "warning", autoDismiss: true });
        })
        .finally((e) => {
          setIsLoading(false);
        });
    }
  };
  const getMembers = async () => {
    apiCheckRegister(
      (res) => {
        if (res.data.code === 200) {
          settbMember(res.data.tbMember);
        }
      },
      () => {},
      () => {
        setIsLoading(false);
      }
    );
  };

  const getpointStore = async () => {
    setIsLoading(true);
    listPointStore(
      (res) => {
        if (res.status) {
          let list = res.data.list;
          setoptionsStore(list);
          if (!IsNullOrEmpty(list)) {
            setvalueStore(list[0].value);
            if (list[0].DT.length > 0) {
              setoptionsbranch(list[0].DT);
              setvalueBranch(list[0].DT[0].value);
              setisbranch(true);
            }
          }
        } else {
        }
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
    getMembers();
    getpointStore();
  }, []);
  return (
    <>
      {isLoading ? <Spinner customText={"Loading"} /> : null}
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
              <div className="noselect text-lg text-white font-bold text-center ">
                {"กรองโค้ดเพื่อสะสมคะแนน"}
              </div>
              <div
                style={{
                  width: "100%",
                  backgroundColor: "#FFF",
                  height: "calc(100vh - 270px)",
                  borderRadius: "10px",
                  marginTop: "2vh",
                  padding: "20px",
                }}
              >
                <div>
                  <label className="noselect block text-blueGray-600 text-sm font-bold mb-2 mt-2">
                    ร้านค้า
                  </label>
                </div>
                <div>
                  <Select
                    className="text-gray-mbk text-sm w-full border-none"
                    isSearchable={false}
                    id={"store"}
                    name={"store"}
                    placeholder={"store"}
                    onChange={async (e) => {
                      setvalueStore(e.value);
                      const Store = optionsStore.find(
                        (ev) => ev.value == e.value
                      );
                      setoptionsbranch(Store.DT);
                      if (Store.DT.length > 0) {
                        setvalueBranch(Store.DT[0].value);
                        setisbranch(true);
                      } else {
                        setisbranch(false);
                      }
                    }}
                    value={optionsStore.filter((e) => e.value === valueStore)}
                    options={optionsStore}
                    styles={useStyle}
                  />
                </div>

                {isbranch ? (
                  <>
                    <div>
                      <label className="noselect block text-blueGray-600 text-sm font-bold mb-2 mt-2">
                        {"สาขา"}
                      </label>
                    </div>
                    <div>
                      <Select
                        className="text-gray-mbk text-sm w-full border-none"
                        isSearchable={false}
                        id={"branch"}
                        name={"branch"}
                        placeholder={"branch"}
                        onChange={async (e) => {
                          setvalueBranch(e.value);
                        }}
                        value={optionsbranch.filter(
                          (e) => e.value === valueBranch
                        )}
                        options={optionsbranch}
                        styles={useStyle}
                      />
                    </div>
                  </>
                ) : null}

                <div
                  className="overflow-y-auto"
                  style={{
                    // overflow: "scroll",
                    height: "calc(100% - " + (!isbranch ? "200px" : "270px") + ")",
                    marginTop: "0.5rem",
                  }}
                >
                  {[...rewardCode].map((e, i) => {
                    let _succeedData = succeedData.find(
                      (item) =>
                        item.coupon == e.code.replaceAll(" ", "").toUpperCase()
                    );
                    let msg = {
                      msg: "",
                      icon: "fas fa-times-circle text-red-500",
                    };
                    if (e.state === true) {
                      msg = {
                        msg: "กรอก Code สำเร็จ",
                        icon: "fas fa-check-circle text-green-mbk",
                      };
                    } else {
                      if (!IsNullOrEmpty(_succeedData)) {
                        _succeedData.isInvalid
                          ? (msg.msg = "Code ไม่ถูกต้อง")
                          : _succeedData.isExpire
                          ? (msg.msg = "Code หมดอายุแล้ว")
                          : _succeedData.isUse
                          ? (msg.msg = "Code ถูกใช้แล้ว")
                          : (msg = {
                              msg: "สะสมคะแนนสำเร็จ",
                              icon: "fas fa-check-circle text-green-mbk",
                            });
                      }
                    }
                    return (
                      <div className="flex mt-4 mb-4  " key={i}>
                        <div
                          className="noselect bg-green-mbk relative circle margin-auto-t-b"
                          style={{
                            width: "35px",
                            height: "30px",
                            lineHeight: "29px",
                          }}
                        >
                          <span
                            className="text-white font-bold text-xs"
                            style={{ padding: "10px" }}
                          >
                            {i + 1}
                          </span>
                        </div>
                        <div className="noselect pl-2 w-full margin-auto-t-b">
                          <InputMask
                            className={
                              (e.state === true
                                ? " pointer-events-none "
                                : "") +
                              " line-input border-0 px-2 py-2 placeholder-blueGray-300 text-gray-mbk bg-white  text-sm  focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            }
                            maxLength={22}
                            value={e.code}
                            name={"code-" + (i + 1)}
                            type={"text"}
                            onChange={(e) => {
                              let item = rewardCode.map((item) => {
                                if (item.index == i) {
                                  return { ...item, code: e.target.value };
                                }
                                return item;
                              });

                              setrewardCode(item);
                            }}
                            placeholder={"XXX-XXXXXXXXXXXXXXXX"}
                            // mask={"***-****************"}
                            maskChar=" "
                            disabled={e.state ? true : false}
                            readOnly={e.state ? true : false}
                          />

                          {!IsNullOrEmpty(_succeedData) || e.state ? (
                            <div className="absolute text-xs ">
                              <i class={msg.icon}>{msg.msg}</i>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="noselect relative  px-4  flex-grow flex-1 mt-5">
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      lineHeight: "40px",
                      margin: "auto",
                      fontSize: "2.5rem",
                    }}
                    onClick={() => {
                      if (rewardCode.length <= 9) {
                        setrewardCode((oldArray) => [
                          ...oldArray,
                          { index: oldArray.length, code: "", state: null },
                        ]);
                      }
                    }}
                  >
                    <i className="fas fa-plus-circle text-green-mbk"></i>
                  </div>
                  <div className="relative  px-4  flex-grow flex-1 flex mt-5">
                    <button
                      className=" w-6\/12 text-gray-mbk  font-bold uppercase px-3 py-2 text-sm rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      style={{ width: "50%" }}
                      onClick={() => {
                        history.push(path.member);
                      }}
                    >
                      {"ยกเลิก"}
                    </button>
                    <button
                      className=" w-6\/12 bg-gold-mbk text-white font-bold uppercase px-3 py-2 text-sm rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      style={{ width: "50%" }}
                      onClick={confirmreward}
                    >
                      {"ตกลง"}
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="noselect text-lg text-white font-bold text-center ">
                <i class="fas fa-check-circle" style={{ fontSize: "3rem" }}></i>
              </div>

              <div className="noselect text-lg text-white font-bold text-center mt-2">
                {"สะสมคะแนนสำเร็จ"}
              </div>
              <div
                className="noselect text-lg text-white font-bold text-center "
                style={{
                  position: "absolute",
                  bottom: "50px",
                }}
                onClick={() => {
                  history.push(path.member);
                }}
              >
                <div
                  style={{
                    width: "150px",
                    border: "2px solid #FFF",
                    borderRadius: "20px",
                    padding: "10px 10px",
                    position: "relative",
                    left: "60%",
                  }}
                >
                  {"กลับหน้าหลัก"}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
export default GetReward;
