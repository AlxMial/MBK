import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "services/axios";
import InputMask from "react-input-mask";
import { useHistory } from "react-router-dom";
import { getMember, listPointStore } from "@services/liff.services";
import { IsNullOrEmpty } from "@services/default.service";
import Spinner from "components/Loadings/spinner/Spinner";
import { useToasts } from "react-toast-notifications";
import { styleSelectLine } from "assets/styles/theme/ReactSelect";
import { useDispatch } from "react-redux";
import { backPage } from "redux/actions/common";
import Error from "./error";
import AlertModel from "components/ConfirmDialog/alertModel";
// components

const GetReward = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { addToast } = useToasts();
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rewardCode, setrewardCode] = useState([
    { index: 0, code: "", state: null },
    { index: 1, code: "", state: null },
    { index: 2, code: "", state: null },
    { index: 3, code: "", state: null },
    { index: 4, code: "", state: null },
  ]);
  const [tbMember, settbMember] = useState({});
  const [valueStore, setvalueStore] = useState(null);
  const [valueBranch, setvalueBranch] = useState(null);
  const [isbranch, setisbranch] = useState(false);
  const [deploy, setdeploy] = useState("");

  const [optionsStore, setoptionsStore] = useState([]);
  const [optionsbranch, setoptionsbranch] = useState([]);

  const [succeedData, setsucceedData] = useState([]);

  const [confirmsucceed, setconfirmsucceed] = useState(false);
  const useStyle = styleSelectLine();
  const [modeldata, setmodeldata] = useState({
    open: false,
    title: "",
    msg: "",
  }); // error ต่าง
  const [isError, setisError] = useState(false);
  const setDataError = () => {
    setisError(true);
    setmodeldata({
      open: true,
      title: "เกิดข้อผิดพลาด",
      msg: "กรุณาลองใหม่อีกครั้ง",
      actionCallback: getpointStore,
    });
  };

  const checkIfDuplicateExists = (arr) => {
    return new Set(arr).size !== arr.length;
  };

  const confirmreward = () => {
    /// check api
    let code = [];
    rewardCode.map((e, i) => {
      if (!IsNullOrEmpty(e.code) && (e.state !== true || (e.state && e.isDuplicate))) {
        code.push(e.code.replaceAll(" ", ""));
      }
    });
    // console.log(rewardCode)
    // console.log('confirm = ',code.length);
    if (code.length > 0) {
      setIsLoading(true);
      axios
        .post("/redeem", {
          memberId: tbMember.id,
          redeemCode: code,
          storeId: valueStore,
          branchId: valueBranch,
        })
        .then(async (res) => {
          if (res.status) {
            if (res.data.status) {
              let _rewardCode = rewardCode;
              let data = res.data.data;

              data.map((e, i) => {
                _rewardCode.map((ee, i) => {
                  if (e.coupon === ee.code.toLowerCase()) {
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
              setdeploy("reward");
              let alreadySeen = [];
              var index = 0;
              _rewardCode.forEach(function (str) {
                if (!IsNullOrEmpty(str.code)) {
                  const value = alreadySeen.filter((e) => {
                    return e == str.code;
                  });
                  alreadySeen.push(str.code);
                  if (value.length > 0) {
                    _rewardCode[index]["isDuplicate"] = true;
                  } else {
                    _rewardCode[index]["isDuplicate"] = false;
                  }
                } else {
                  _rewardCode[index]["isDuplicate"] = false;
                }
                index++;
              });
              setrewardCode(_rewardCode);
              setsucceedData(res.data.data);
              let succeed = true;
              await _rewardCode.map((e, i) => {
                if (!IsNullOrEmpty(e.code)) {
                  if (e.state == false) {
                    succeed = false;
                  }
                }
              });
              await _rewardCode.map((e, i) => {
                if (!IsNullOrEmpty(e.code)) {
                  if (e.isDuplicate === true) {
                    succeed = false;
                  }
                }
              });
              if (succeed) {
                setconfirmsucceed(true);
              }
            } else {
              setDataError();
            }
          } else {
            setDataError();
          }
        })
        .catch((error) => {
          setDataError();
        })
        .finally((e) => {
          setIsLoading(false);
        });
    } else {
      const _success = rewardCode.find(e => e.code !== '' && e.state && !e.isDuplicate);
      // console.log('_chk', _chk);
      if (!_success) {
        setIsOpenAlert(true);
      }
    }
  };
  const getMembers = async () => {
    getMember(
      (res) => {
        if (res.data.code === 200) {
          settbMember(res.data.tbMember);
        }
      },
      () => { },
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
          if (res.data.status) {
            let list = res.data.list;
            setoptionsStore(list);
            if (!IsNullOrEmpty(list)) {
              setvalueStore(list[0].value);
              console.log(list[0].value);
              if (list[0].DT.length > 0) {
                setoptionsbranch(list[0].DT);
                setvalueBranch(list[0].DT[0].value);
                setisbranch(true);
              }
            }
          } else {
            setDataError();
          }
        } else {
          setDataError();
        }
      },
      (e) => {
        setDataError();
      },
      () => {
        setIsLoading(false);
      }
    );
  };
  useEffect(() => {
    dispatch(backPage(true));
    getMembers();
    getpointStore();
  }, []);
  return (
    <>
      {isOpenAlert && (
        <AlertModel
          className={" liff-Dialog "}
          showModal={isOpenAlert}
          message={"กรุณากรอกโค้ด"}
          confirmModal={async () => {
            setIsOpenAlert(false);
          }}
        />
      )}
      <Error data={modeldata} setmodeldata={setmodeldata} />
      {isLoading ? <Spinner customText={"Loading"} /> : null}
      <div className="bg-green-mbk " style={{ height: "calc(100vh - 90px)" }}>
        <div
          style={{
            width: "90%",
            padding: "0px 10px 10px 10px",
            margin: "auto",
            height: "100%",
          }}
        >
          {!confirmsucceed ? (
            <>
              {/* กรอก code  */}
              <div className="noselect text-lg text-white font-bold text-center ">
                {"กรอกโค้ดเพื่อสะสมคะแนน"}
              </div>
              <div
                className="overflow-y-auto liff-minHeight"
                style={{
                  width: "100%",
                  backgroundColor: "#FFF",
                  //height: "calc(100vh - 270px)",
                  // height:"450px",
                  // minHeight:"450px",
                  // maxHeight: "100%",
                  borderRadius: "10px",
                  marginTop: "2vh",
                  padding: "20px",
                }}
              >
                <div className=" liff-Reward-height">
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
                      <div className="mb-4"></div>
                    </>
                  ) : null}
                  <div
                    className=""
                    style={{
                      // overflow: "scroll",
                      // minHeight:'500px',
                      height:
                        "calc(100% - " + (!isbranch ? "200px" : "270px") + ")",
                      marginTop: "0.5rem",
                    }}
                  >
                    {[...rewardCode].map((e, i) => {
                      // console.log(e);
                      let _succeedData = succeedData.find(
                        (item) =>
                          item.coupon.toLowerCase() === e.code.toLowerCase()
                      );
                      let msg = {
                        msg: "",
                        icon: "fas fa-times-circle text-red-500",
                      };
                      if (e.isDuplicate === true) {
                        msg = {
                          msg: "กรอกรหัสซ้ำ",
                          icon: "fas fa-times-circle text-red-500",
                        };
                      } else if (e.state === true) {
                        msg = {
                          msg: "กรอก Code สำเร็จ",
                          icon: "fas fa-check-circle text-green-mbk",
                        };
                      } else {
                        if (!IsNullOrEmpty(_succeedData)) {
                          _succeedData.isInvalid
                            ? (msg.msg = "ไม่ถูกต้อง")
                            : _succeedData.isExpire
                              ? (msg.msg = "หมดอายุแล้ว")
                              : _succeedData.isUse
                                ? (msg.msg = "ถูกใช้แล้ว")
                                : (msg = {
                                  msg: "สะสมคะแนนสำเร็จ",
                                  icon: "fas fa-check-circle text-green-mbk",
                                });
                        }
                      }
                      return (
                        <div className="flex mt-2" key={i}>
                          {/* <div
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
                        </div> */}
                          <div className="noselect  w-full margin-auto-t-b">
                            <InputMask
                              className={
                                (e.state === true && !e.isDuplicate
                                  ? " pointer-events-none "
                                  : "") +
                                " line-input border-0 px-2 py-2 placeholder-blueGray-300 text-gray-mbk bg-white  text-sm  w-full "
                              }
                              maxLength={22}
                              value={e.code}
                              name={"code-" + (i + 1)}
                              type={"text"}
                              onChange={(e) => {
                                // console.log(e.target.value)
                                let item = rewardCode.map((item) => {
                                  if (item.index == i) {
                                    return { ...item, code: e.target.value };
                                  }
                                  return item;
                                });
                                setrewardCode(item);
                                // setrewardCode((s) => {
                                //   const newArr = s.slice();
                                //   newArr[i].code = e.target.value;
                                //   return newArr;
                                // });
                              }}
                              placeholder={"รหัสที่ " + (i + 1)}
                              // mask={"***-****************"}
                              maskChar=" "
                              disabled={e.state && !e.isDuplicate ? true : false}
                              readOnly={e.state && !e.isDuplicate ? true : false}
                            />

                            {!IsNullOrEmpty(_succeedData) || e.state ? (
                              <div className="text-xs pt-2 px-2 Noto Sans">
                                <i className={msg.icon}></i>
                                <span
                                  className={
                                    "font-bold " +
                                    (msg.msg === "กรอก Code สำเร็จ"
                                      ? " text-green-mbk"
                                      : " text-red-500")
                                  }
                                >
                                  {" "}
                                  {msg.msg}
                                </span>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                    <div className="noselect relative  px-4  flex-grow flex-1 mt-4">
                      <div
                        className={rewardCode.length === 10 ? " hidden" : " "}
                        style={{
                          width: "40px",
                          height: "40px",
                          lineHeight: "40px",
                          margin: "auto",
                          fontSize: "2rem",
                          textAlign: "center",
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
                      <div className="relative  px-4  flex-grow flex-1 flex mt-4 mb-4">
                        <button
                          className=" w-6\/12 text-gray-mbk  font-bold uppercase px-3 py-2 text-sm rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                          type="button"
                          style={{ width: "50%" }}
                          onClick={() => {
                            // history.push(path.member);
                            history.goBack();
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
                </div>
              </div>
            </>
          ) : (
            <>
              {/* <div className="noselect text-lg text-white font-bold text-center ">
                <i
                  className="fas fa-check-circle"
                  style={{ fontSize: "3rem" }}
                ></i>
              </div>

              <div className="noselect text-lg text-white font-bold text-center mt-2">
                {"สะสมคะแนนสำเร็จ"}
              </div> */}
              <div className="w-full relative h-full">
                <div className="success-reward absolute w-full"
                  style={{
                    transform: "translate(50%,-50%)",
                    right: '50%',
                    top: 'calc(50% - 50px)'
                  }}>
                  <div className="w-full flex mb-2" style={{ justifyContent: "center" }}>
                    <i className="fas fa-check-circle text-white" style={{ fontSize: "50px" }}></i>
                  </div>
                  <div className="w-full flex text-xl font-bold text-white mt-4" style={{ justifyContent: "center" }}>
                    สะสมคะแนนสำเร็จ
                  </div>
                </div>
              </div>
              <div
                className="noselect text-lg text-white font-bold text-center "
                style={{
                  position: "absolute",
                  bottom: "50px",
                }}
                onClick={() => {
                  history.goBack();
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
