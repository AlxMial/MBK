import React, { useEffect, useState } from "react";
import axios from "services/axios";
import ReactPaginate from "react-paginate";
import { exportExcel } from "services/exportExcel";
import { Radio, DatePicker, ConfigProvider } from "antd";
import { useFormik } from "formik";
import ValidateService from "services/validateValue";
import moment from "moment";
import Spinner from "components/Loadings/spinner/Spinner";
import useWindowDimensions from "services/useWindowDimensions";
import SelectUC from "components/SelectUC";
import Modal from "react-modal";
import { useToasts } from "react-toast-notifications";
import {
  customStyles,
  customStylesMobile,
} from "assets/styles/theme/ReactModal";

Modal.setAppElement("#root");
export default function PointHistoryReport() {
  const { addToast } = useToasts();
  const [listSearch, setListSerch] = useState([]);
  const [listPointCode, setListPointCode] = useState([]);
  const [listMemberPoint, setListMemberPoint] = useState([]);
  const [listPointCodeHD, setListPointCodeHD] = useState([]);
  const [listPointCodeDt, setListPointCodeDt] = useState([]);
  const [pointHDId, setPointHDId] = useState(0);
  const { height, width } = useWindowDimensions();
  const [pageNumber, setPageNumber] = useState(0);
  const [forcePage, setForcePage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPoint, setIsLoadingPoint] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const usersPerPage = 10;
  const pagesVisited = pageNumber * usersPerPage;
  const useStyleMobile = customStylesMobile();
  const useStyle = customStyles();
  const optionsSearch = [
    { value: "1", label: "ค้นหา" },
    { value: "2", label: "ค้นหาจาก Code" },
  ];
  const listPointType = [
    { value: true, color: "green", status: "แลกไปแล้ว" },
    { value: false, color: "red", status: "ยังไม่ถูกแลก" },
  ];
  const dataPopUp = useFormik({
    initialValues: {
      code: "",
      pointCodeName: "",
      startDate: "",
      endDate: "",
      memberName: "",
      phone: "",
      point: 11,
      isUse: "1",
      exchangedate: "",
      status: "",
      pointType: "",
    },
  });
  /* Modal */
  /* Form insert value */
  const formSerch = useFormik({
    initialValues: {
      inputSerch: "",
      serchType: "1",
      startDate: null,
      endDate: null,
    },
  });
  const InputSearch = () => {
    const inputSerch = formSerch.values.inputSerch;
    const serchType = formSerch.values.serchType;
    let startDate =
      formSerch.values.startDate !== null
        ? convertToDate(formSerch.values.startDate)
        : null;
    let endDate =
      formSerch.values.endDate !== null
        ? convertToDate(formSerch.values.endDate)
        : null;
    if (inputSerch === "" && startDate === null && endDate === null) {
      setListPointCode(listSearch);
    } else {
      if (serchType === "1") {
        setListPointCode(
          listSearch
            .filter((x) => {
              const _startDate = convertToDate(x.startDate);
              const _endDate = convertToDate(x.endDate);
              if (
                (inputSerch !== ""
                  ? Search(x.pointCodeName, inputSerch) ||
                    Search(x.pointCodeSymbol, inputSerch) ||
                    Search(x.pointCodePoint, inputSerch) ||
                    Search(x.pointCodeQuantityCode, inputSerch) ||
                    Search(x.status, inputSerch) ||
                    Search(x.useCount, inputSerch) ||
                    Search(x.remain, inputSerch)
                  : true) &&
                SearchByDate(_startDate, _endDate)
              ) {
                return true;
              }
              return false;
            })
            .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
        );
      }
      setPageNumber(0);
      setForcePage(0);
    }
  };

  const Search = (val, inputSerch) => {
    let status = false;
    if (val !== "" && val !== null && val !== undefined) {
      status = val.toString().toLowerCase().includes(inputSerch);
    }
    return status;
  };

  const SearchByDate = (dataST_Date, dataED_Date) => {
    let isSearch = false;
    let st_Date =
      formSerch.values.startDate !== null
        ? convertToDate(formSerch.values.startDate)
        : null;
    let ed_Date =
      formSerch.values.endDate !== null
        ? convertToDate(formSerch.values.endDate)
        : null;
    if (
      (st_Date !== null &&
        ed_Date !== null &&
        ((st_Date <= dataST_Date &&
          st_Date <= dataED_Date &&
          ed_Date >= dataST_Date &&
          ed_Date >= dataED_Date) ||
          (st_Date <= dataST_Date &&
            ed_Date >= dataST_Date &&
            !(st_Date <= dataED_Date && ed_Date >= dataED_Date)) ||
          (!(st_Date <= dataST_Date && ed_Date >= dataST_Date) &&
            st_Date <= dataED_Date &&
            ed_Date >= dataED_Date))) ||
      (st_Date !== null &&
        ed_Date === null &&
        (st_Date <= dataST_Date || st_Date <= dataED_Date)) ||
      (st_Date === null &&
        ed_Date !== null &&
        (ed_Date >= dataST_Date || ed_Date >= dataED_Date)) ||
      (st_Date === null && ed_Date === null)
    ) {
      isSearch = true;
    }
    return isSearch;
  };

  const convertToDate = (e) => {
    const date = new Date(e);
    date.setHours(0, 0, 0, 0);
    return date;
  };

  const setDataSearch = (e, type) => {
    const s_Date = formSerch.values.startDate;
    const e_Date = formSerch.values.endDate;
    if (type === "s_input") {
      formSerch.values.inputSerch = e.target.value.toLowerCase();
      InputSearch();
    } else if (type === "s_type") {
      formSerch.values.serchType = e;
    } else if (type === "s_stdate") {
      formSerch.setFieldValue("startDate", e);
      if (e > e_Date && e_Date !== null) {
        formSerch.setFieldValue("startDate", e_Date);
      }
    } else if (type === "s_eddate") {
      formSerch.setFieldValue("endDate", e);
      if (e < s_Date && s_Date !== null) {
        formSerch.setFieldValue("endDate", s_Date);
      }
    } else if (type === "btn") {
      if (formSerch.values.serchType === "2") {
        if (formSerch.values.inputSerch !== "") {
          getDataPoint_ByCode();
        } else {
          addToast("กรุณากรอก Code ที่ต้องค้นหา", {
            appearance: "warning",
            autoDismiss: true,
          });
        }
      } else {
        InputSearch();
      }
    }
    // } else if(type === "b_input") {
    //   if(formSerch.values.serchType === '2') {
    //     getDataPoint_ByCode();
    //   }
  };

  async function openModal(id) {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  function afterOpenModal(type) {
    // references are now sync'd and can be accessed.
  }
  const pageCount = Math.ceil(listPointCode.length / usersPerPage)||1;

  const changePage = ({ selected }) => {
    setPageNumber(selected);
    setForcePage(selected);
  };

  const Excel = async (sheetname) => {
    setIsLoading(true);
    const TitleColumns = [
      "แคมเปญ",
      "รหัสแคมเปญ",
      "จำนวนตัวอักษร",
      "คะแนน",
      "วันที่เริ่มต้น",
      "วันที่สิ้นสุด",
      "จำนวน Code",
      "แลกแล้ว",
      "คงเหลือ",
      "สถานะ",
    ];
    const columns = [
      "pointCodeName",
      "pointCodeSymbol",
      "pointCodeLengthSymbol",
      "pointCodePoint",
      "startDate",
      "endDate",
      "codeCount",
      "useCount",
      "remain",
      "status",
    ];
    let count = 0;
    listPointCode.forEach((el) => {
      count++;
      el.listNo = count;
    });
    exportExcel(
      listPointCode,
      "รายงานแสดงข้อมูลแคมเปญของ Code คะแนนทั้งหมด",
      TitleColumns,
      columns,
      "รายงานแสดงข้อมูลแคมเปญของ Code คะแนนทั้งหมด"
    );
    setIsLoading(false);
  };

  const ExportFile = async (id, name) => {
    setIsLoading(true);
    await axios.get(`report/exportExcel/${id}`).then((response) => {
      console.log(response)
      const TitleColumns = [
        "รหัส Coupon",
        "สถานะใช้งาน",
        "สถานะหมดอายุ",
        "ชื่อผู้ที่แลก",
        "วันที่แลก",
        "ร้านค้า",
        "สาขา",
      ];
      const columns = [
        "code",
        "isUse",
        "isExpire",
        "memberName",
        "dateUseCode",
        "pointStoreName",
        "pointBranchName",
      ];
      if (!response.data.error) {
        exportExcel(response.data, name, TitleColumns, columns, "Coupon");
      }
      setIsLoading(false);
    });
  };

  const fetchPermission = async () => {
    await axios.get("report/ShowPointsHistory").then((response) => {
      // dispatch(fetchSuccess());

      const dateNow = new Date();
      dateNow.setHours(0, 0, 0, 0);
      if (response.data.error) {
      } else {
        for (var i = 0; i < response.data.tbPointCodeHD.length; i++) {
          const startDate = new Date(
            response.data.tbPointCodeHD[i]["startDate"]
          );
          startDate.setHours(0, 0, 0, 0);
          const endDate = new Date(response.data.tbPointCodeHD[i]["endDate"]);
          endDate.setHours(0, 0, 0, 0);
          let status = "";
          const codeCount = response.data.tbPointCodeHD[i]["codeCount"];
          const useCount = response.data.tbPointCodeHD[i]["useCount"];
          if (
            !(
              (startDate <= dateNow && dateNow <= endDate) ||
              (startDate > dateNow && endDate > dateNow)
            )
          ) {
            status = "หมดอายุ";
          } else if (response.data.tbPointCodeHD[i].isActive === "1") {
            status = "เปิดการใช้งาน";
          } else {
            status = "ปิดการใช้งาน";
          }
          response.data.tbPointCodeHD[i]["status"] = status;
          response.data.tbPointCodeHD[i]["remain"] = codeCount - useCount;
        }
        setListSerch(
          response.data.tbPointCodeHD.sort(
            (a, b) => new Date(b.startDate) - new Date(a.startDate)
          )
        );
        setListPointCode(
          response.data.tbPointCodeHD.sort(
            (a, b) => new Date(b.startDate) - new Date(a.startDate)
          )
        );
      }
    });
  };
  // ค้นหาจาก code HD
  const getDataPoint_ByCode = async () => {
    const code = formSerch.values.inputSerch.trim().toUpperCase();
    const c_length = code.length;
    await axios.get(`report/GetPoint`).then((response) => {
      if (response.data.tbPointCodeHD.length > 0) {
        const listtbPointCodeHD = response.data.tbPointCodeHD.filter((e) => {
          const pointCodeSymbol =
            e.pointCodeSymbol !== null ? e.pointCodeSymbol.toUpperCase() : "";
          const p_length = pointCodeSymbol.length;
          if (p_length > c_length) {
            if (
              pointCodeSymbol.includes(code) &&
              e.pointCodeSymbol !== null &&
              e.pointCodeSymbol !== ""
            ) {
              return true;
            }
            return false;
          } else {
            if (
              code.includes(pointCodeSymbol) &&
              e.pointCodeSymbol !== null &&
              e.pointCodeSymbol !== ""
            ) {
              return true;
            }
            return false;
          }
        });
        if (listtbPointCodeHD.length === 1) {
          if (!isLoadingPoint) {
            getDataPointDT(listtbPointCodeHD[0].id);
          }
        } else {
          addToast(
            "ไม่พบ Code: " + formSerch.values.inputSerch.toLocaleUpperCase(),
            {
              appearance: "warning",
              autoDismiss: true,
            }
          );
        }
      }
    });
  };
  // ค้นหา pointDT จาก id ของ hd
  const getDataPointDT = async (id) => {
    if (id !== pointHDId) {
      setIsLoading(true);
      setIsLoadingPoint(true);
      await axios.get(`report/GetPointDT/${id}`).then((response) => {
        const length = response.data.length;
        if (length !== undefined && length > 0) {
          const listPointCodes = response.data[0].tbPointCodeDT;
          const listMemberPoint = response.data[0].tbMemberPoint;

          if (listPointCodes !== undefined && listPointCodes.length > 0) {
            setListPointCodeHD(response.data);
            setListPointCodeDt(listPointCodes);
            setListMemberPoint(listMemberPoint);
            setDataDialog(response.data, listPointCodes, listMemberPoint);
          } else {
            addToast(
              "ไม่พบ Code: " + formSerch.values.inputSerch.toLocaleUpperCase(),
              {
                appearance: "warning",
                autoDismiss: true,
              }
            );
          }
        }
        setPointHDId(id);
        setIsLoadingPoint(false);
        setIsLoading(false);
      });
    } else {
      setDataDialog();
    }
  };

  const setDataDialog = async (datahd = [], datadt = [], dataMember = []) => {
    const list_pointHD = datahd.length > 0 ? datahd : listPointCodeHD;
    const list_pointDT = datadt.length > 0 ? datadt : listPointCodeDt;
    const list_Memberpoint =
      dataMember.length > 0 ? dataMember : listMemberPoint;
    const code = formSerch.values.inputSerch.trim().toUpperCase();
    const listtbPointCodeDT = list_pointDT.filter((e) => e.code === code || e.code === code.replace('-','') );
    const listMemberpoint = list_Memberpoint.find((e) => e.code === code  || e.code === code.replace('-',''));
    if (listtbPointCodeDT.length === 1) {
      dataPopUp.values.code = listtbPointCodeDT[0].code;
      dataPopUp.values.pointCodeName = list_pointHD[0].pointCodeName;
      dataPopUp.values.startDate = list_pointHD[0].startDate;
      dataPopUp.values.endDate = list_pointHD[0].endDate;
      dataPopUp.values.memberName =
        listMemberpoint !== undefined
          ? listMemberpoint.tbMember.firstName +
            " " +
            listMemberpoint.tbMember.lastName
          : "";
      dataPopUp.values.phone =
        listMemberpoint !== undefined ? listMemberpoint.tbMember.phone : "";
      dataPopUp.values.point = list_pointHD[0].pointCodePoint;
      dataPopUp.values.isUse = listtbPointCodeDT[0].isUse;
      dataPopUp.values.exchangedate =
        listMemberpoint !== undefined ? listMemberpoint.redeemDate : "";
      dataPopUp.values.status = listPointType.find(
        (e) => e.value === listtbPointCodeDT[0].isUse
      ).status;
      dataPopUp.values.pointType = listtbPointCodeDT[0].pointType;
      openModal();
    } else {
      addToast("ไม่พบ Code: " + formSerch.values.inputSerch, {
        appearance: "warning",
        autoDismiss: true,
      });
    }
  };

  useEffect(() => {
    fetchPermission();
  }, []);

  return (
    <>
      {isLoading ? (
        <>
          {" "}
          <Spinner customText={"Loading"} />
        </>
      ) : (
        <></>
      )}
      <div className="flex flex-warp">
        <span className="text-sm margin-auto-t-b font-bold ">
          <i className="fas fa-cog"></i>&nbsp;&nbsp;
        </span>
        <span className="text-base margin-auto-t-b font-bold">
          รายงาน&nbsp;&nbsp;/&nbsp;&nbsp;
        </span>
        <span className="text-base margin-auto font-bold">
          รายงานแสดงข้อมูลแคมเปญของ Code คะแนนทั้งหมด
        </span>
      </div>
      <div className="w-full px-4">
        <div className="flex flex-warp py-2 mt-6 ">
          <span className="text-lg  text-green-mbk margin-auto font-bold">
            รายงานแสดงข้อมูลแคมเปญของ Code คะแนนทั้งหมด
          </span>
        </div>
        <div
          className={
            "py-4 relative flex flex-col min-w-0 break-words w-full mb-6 border rounded-b bg-white Overflow-list "
          }
        >
          <div className="rounded-t mb-0 px-4 py-3 border-0">
            <div className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap ">
              <div className="lg:w-5/12 px-2  mt-0">
                <span className="z-3 h-full leading-snug font-normal text-center text-blueGray-300 absolute bg-transparent rounded text-base items-center justify-center pl-3 py-2">
                  <i className="fas fa-search"></i>
                </span>
                <input
                  type="text"
                  placeholder="Search here..."
                  className="border-0 pl-12 w-63 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded-xl text-sm shadow outline-none focus:outline-none focus:ring"
                  onChange={(e) => {
                    setDataSearch(e, "s_input");
                  }}
                  // onBlur={(e) => {
                  //   setDataSearch(e,"b_input");
                  // }}
                />
              </div>
              <div className="w-full lg:w-4/12 px-4  margin-auto-t-b">
                <div className="relative w-full">
                  <SelectUC
                    name="SearchType"
                    options={optionsSearch}
                    onChange={async (value) => {
                      setDataSearch(value.value, "s_type");
                      formSerch.setFieldValue("serchType", value.value);
                    }}
                    value={ValidateService.defaultValue(
                      optionsSearch,
                      formSerch.values.serchType
                    )}
                  />
                </div>
              </div>
              <div className="lg:w-1/12 px-2 margin-auto-t-b ">
                <label
                  className="text-blueGray-600 text-sm font-bold "
                  htmlFor="grid-password"
                >
                  วันที่เริ่มต้น
                </label>
              </div>
              <div className="w-full lg:w-3/12 px-4 margin-auto-t-b">
                <div className="relative">
                  <ConfigProvider>
                    <DatePicker
                      inputReadOnly={true}
                      format={"DD/MM/yyyy"}
                      placeholder="เลือกวันที่"
                      showToday={false}
                      style={{
                        height: "100%",
                        width: "100%",
                        borderRadius: "0.25rem",
                        cursor: "pointer",
                        margin: "0px",
                        paddingTop: "0.5rem",
                        paddingBottom: "0.5rem",
                        paddingLeft: "0.5rem",
                        paddingRight: "0.5rem",
                      }}
                      value={
                        formSerch.values.startDate !== null
                          ? moment(
                              new Date(formSerch.values.startDate),
                              "DD/MM/YYYY"
                            )
                          : ""
                      }
                      onChange={(e) => {
                        setDataSearch(e, "s_stdate");
                      }}
                    />
                  </ConfigProvider>
                </div>
              </div>
              <div
                className={"w-full mb-4" + (width < 764 ? " block" : " hidden")}
              ></div>
              <div className="lg\:w-auto  margin-auto-t-b ">
                <label
                  className="text-blueGray-600 text-sm font-bold "
                  htmlFor="grid-password"
                >
                  ถึง
                </label>
              </div>

              <div className="w-full lg:w-3/12 px-4 margin-auto-t-b">
                <ConfigProvider>
                  <DatePicker
                    inputReadOnly={true}
                    format={"DD/MM/yyyy"}
                    placeholder="เลือกวันที่"
                    showToday={false}
                    style={{
                      height: "100%",
                      width: "100%",
                      borderRadius: "0.25rem",
                      cursor: "pointer",
                      margin: "0px",
                      paddingTop: "0.5rem",
                      paddingBottom: "0.5rem",
                      paddingLeft: "0.5rem",
                      paddingRight: "0.5rem",
                    }}
                    value={
                      formSerch.values.endDate !== null
                        ? moment(
                            new Date(formSerch.values.endDate),
                            "DD/MM/YYYY"
                          )
                        : ""
                    }
                    onChange={(e) => {
                      setDataSearch(e, "s_eddate");
                    }}
                    disabledDate={(current) => {
                      if (formSerch.values.startDate != null) {
                        let day = formSerch.values.startDate;
                        return (
                          current &&
                          current <
                            moment(new Date(day)).add(-1, "days").endOf("day")
                        );
                      }
                    }}
                  />
                </ConfigProvider>
              </div>
              <div className="lg\:w-auto text-right">
                <button
                  className="bg-gold-mbk text-black active:bg-gold-mbk font-bold  text-xs px-2 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none  ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => {
                    setDataSearch("", "btn");
                  }}
                >
                  <span className="text-white text-sm px-2">ค้นหา</span>
                </button>
              </div>
              <div className="lg:w-1/12">
                <div className="flex p-2 float-right">
                  <img
                    src={require("assets/img/mbk/excel.png").default}
                    alt="..."
                    onClick={() => Excel()}
                    className="imgExcel margin-auto-t-b cursor-pointer "
                  ></img>
                </div>
              </div>
              <div
                className={
                  "lg:w-6/12 text-right" + (width < 764 ? " block" : " hidden")
                }
              ></div>
            </div>
          </div>
          <Modal
            isOpen={modalIsOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={width <= 1180 ? useStyleMobile : useStyle}
            contentLabel="Example Modal"
            shouldCloseOnOverlayClick={false}
          >
            <div className="flex flex-wrap">
              <div className="w-full ">
                <>
                  <div className={"flex-auto "}>
                    <div className="w-full mt-2">
                      <div className=" flex justify-between align-middle ">
                        <div className=" align-middle  mb-3">
                          <div className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-base text-green-mbk font-bold whitespace-nowrap p-4">
                            <label>ค้นหา Code คะแนน</label>
                          </div>
                        </div>

                        <div className="  text-right align-middle  mb-3">
                          <div className=" border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm text-red-500 font-bold whitespace-nowrap p-4">
                            <label
                              className="cursor-pointer"
                              onClick={() => {
                                closeModal();
                              }}
                            >
                              X
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap px-24 p-4">
                        <div className="w-full lg:w-2/12 px-4 margin-auto-t-b">
                          <label
                            className="text-blueGray-600 text-sm font-bold "
                            htmlFor="grid-password"
                          >
                            Code
                          </label>
                        </div>
                        <div className="w-full lg:w-auto px-4 margin-auto-t-b">
                          <label
                            className="text-blueGray-600 text-sm font-bold "
                            htmlFor="grid-password"
                          >
                            :
                          </label>
                        </div>
                        <div className="w-full lg:w-4/12 px-4 margin-auto-t-b">
                          <label
                            className="text-blueGray-600 text-sm font-bold "
                            htmlFor="grid-password"
                          >
                            {dataPopUp.values.code}
                          </label>
                        </div>
                      </div>

                      <div className="flex flex-wrap px-24 p-4">
                        <div className="w-full lg:w-2/12 px-4 margin-auto-t-b">
                          <label
                            className="text-blueGray-600 text-sm font-bold "
                            htmlFor="grid-password"
                          >
                            สถานะ
                          </label>
                        </div>
                        <div className="w-full lg:w-auto px-4 margin-auto-t-b">
                          <label
                            className="text-blueGray-600 text-sm font-bold "
                            htmlFor="grid-password"
                          >
                            :
                          </label>
                        </div>
                        <div className="w-full lg:w-4/12 px-4 margin-auto-t-b ">
                          <label
                            className={
                              dataPopUp.values.isUse === true
                                ? "text-green-mbk text-sm font-bold"
                                : "text-red-500 text-sm font-bold"
                            }
                            htmlFor="grid-password"
                          >
                            {dataPopUp.values.status}
                            <i
                              className={
                                dataPopUp.values.isUse === true
                                  ? "fas fa-check-circle px-1"
                                  : "fas fa-hourglass-start px-1"
                              }
                            ></i>
                          </label>
                        </div>
                      </div>

                      <div className="flex flex-wrap px-24 p-4">
                        <div className="w-full lg:w-2/12 px-4 margin-auto-t-b">
                          <label
                            className="text-blueGray-600 text-sm font-bold "
                            htmlFor="grid-password"
                          >
                            แคมเปญ
                          </label>
                        </div>
                        <div className="w-full lg:w-auto px-4 margin-auto-t-b">
                          <label
                            className="text-blueGray-600 text-sm font-bold "
                            htmlFor="grid-password"
                          >
                            :
                          </label>
                        </div>
                        <div className="w-full lg:w-8/12 px-4 margin-auto-t-b">
                          <label
                            className="text-blueGray-600 text-sm font-bold "
                            htmlFor="grid-password"
                          >
                            {dataPopUp.values.pointCodeName}
                          </label>
                        </div>
                      </div>

                      <div className="flex flex-wrap px-24 p-4">
                        <div className="w-full lg:w-2/12 px-4 margin-auto-t-b">
                          <label
                            className="text-blueGray-600 text-sm font-bold "
                            htmlFor="grid-password"
                          >
                            วันที่เริ่มต้น
                          </label>
                        </div>
                        <div className="w-full lg:w-auto px-4 margin-auto-t-b">
                          <label
                            className="text-blueGray-600 text-sm font-bold "
                            htmlFor="grid-password"
                          >
                            :
                          </label>
                        </div>
                        <div className="w-full lg:w-4/12 px-4 margin-auto-t-b">
                          <label
                            className="text-blueGray-600 text-sm font-bold "
                            htmlFor="grid-password"
                          >
                            {moment(dataPopUp.values.startDate).format(
                              "DD/MM/YYYY"
                            )}
                          </label>
                        </div>
                      </div>

                      <div className="flex flex-wrap px-24 p-4">
                        <div className="w-full lg:w-2/12 px-4 margin-auto-t-b">
                          <label
                            className="text-blueGray-600 text-sm font-bold "
                            htmlFor="grid-password"
                          >
                            วันที่สิ้นสุด
                          </label>
                        </div>
                        <div className="w-full lg:w-auto px-4 margin-auto-t-b">
                          <label
                            className="text-blueGray-600 text-sm font-bold "
                            htmlFor="grid-password"
                          >
                            :
                          </label>
                        </div>
                        <div className="w-full lg:w-4/12 px-4 margin-auto-t-b">
                          <label
                            className="text-blueGray-600 text-sm font-bold "
                            htmlFor="grid-password"
                          >
                            {moment(dataPopUp.values.endDate).format(
                              "DD/MM/YYYY"
                            )}
                          </label>
                        </div>
                      </div>

                      <div className="flex flex-wrap px-24 p-4">
                        <div className="w-full lg:w-2/12 px-4 margin-auto-t-b">
                          <label
                            className="text-blueGray-600 text-sm font-bold "
                            htmlFor="grid-password"
                          >
                            ชื่อลูกค้า
                          </label>
                        </div>
                        <div className="w-full lg:w-auto px-4 margin-auto-t-b">
                          <label
                            className="text-blueGray-600 text-sm font-bold "
                            htmlFor="grid-password"
                          >
                            :
                          </label>
                        </div>
                        <div className="w-full lg:w-8/12 px-4 margin-auto-t-b">
                          <label
                            className="text-blueGray-600 text-sm font-bold "
                            htmlFor="grid-password"
                          >
                            {dataPopUp.values.memberName}
                          </label>
                        </div>
                      </div>

                      <div className="flex flex-wrap px-24 p-4">
                        <div className="w-full lg:w-2/12 px-4 margin-auto-t-b">
                          <label
                            className="text-blueGray-600 text-sm font-bold "
                            htmlFor="grid-password"
                          >
                            เบอร์โทรศัพท์
                          </label>
                        </div>
                        <div className="w-full lg:w-auto px-4 margin-auto-t-b">
                          <label
                            className="text-blueGray-600 text-sm font-bold "
                            htmlFor="grid-password"
                          >
                            :
                          </label>
                        </div>
                        <div className="w-full lg:w-4/12 px-4 margin-auto-t-b">
                          <label
                            className="text-blueGray-600 text-sm font-bold "
                            htmlFor="grid-password"
                          >
                            {dataPopUp.values.phone}
                          </label>
                        </div>
                      </div>

                      <div className="flex flex-wrap px-24 p-4">
                        <div className="w-full lg:w-2/12 px-4 margin-auto-t-b">
                          <label
                            className="text-blueGray-600 text-sm font-bold "
                            htmlFor="grid-password"
                          >
                            คะเเนน
                          </label>
                        </div>
                        <div className="w-full lg:w-auto px-4 margin-auto-t-b">
                          <label
                            className="text-blueGray-600 text-sm font-bold "
                            htmlFor="grid-password"
                          >
                            :
                          </label>
                        </div>
                        <div className="w-full lg:w-4/12 px-4 margin-auto-t-b">
                          <label
                            className="text-blueGray-600 text-sm font-bold "
                            htmlFor="grid-password"
                          >
                            {dataPopUp.values.point} คะเเนน
                          </label>
                        </div>
                      </div>

                      <div className="flex flex-wrap px-24 p-4">
                        <div className="w-full lg:w-2/12 px-4 margin-auto-t-b">
                          <label
                            className="text-blueGray-600 text-sm font-bold "
                            htmlFor="grid-password"
                          >
                            วันที่แลก
                          </label>
                        </div>
                        <div className="w-full lg:w-auto px-4 margin-auto-t-b">
                          <label
                            className="text-blueGray-600 text-sm font-bold "
                            htmlFor="grid-password"
                          >
                            :
                          </label>
                        </div>
                        <div className="w-full lg:w-4/12 px-4 margin-auto-t-b">
                          <label
                            className="text-blueGray-600 text-sm font-bold "
                            htmlFor="grid-password"
                          >
                            {dataPopUp.values.exchangedate !== null &&
                            dataPopUp.values.exchangedate !== ""
                              ? moment(dataPopUp.values.exchangedate).format(
                                  "DD/MM/YYYY"
                                )
                              : ""}
                          </label>
                        </div>
                      </div>
                      <div className="pb-16"></div>
                    </div>
                  </div>
                </>
              </div>
            </div>
          </Modal>
          <div className="block w-full overflow-x-auto  px-4 py-2">
            {/* Projects table */}
            <table className="items-center w-full border table-fill ">
              <thead>
                <tr>
                  <th
                    className={
                      "px-6 w-5 align-middle border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-center bg-blueGray-50 text-blueGray-500 "
                    }
                  >
                    ลำดับที่
                  </th>
                  <th
                    className={
                      "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 "
                    }
                  >
                    แคมเปญ
                  </th>
                  <th
                    className={
                      "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-center bg-blueGray-50 text-blueGray-500 "
                    }
                  >
                    รหัสแคมเปญ
                  </th>
                  <th
                    className={
                      "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-center bg-blueGray-50 text-blueGray-500 "
                    }
                  >
                    จำนวนตัวอักษร
                  </th>
                  <th
                    className={
                      "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-center bg-blueGray-50 text-blueGray-500 "
                    }
                  >
                    คะแนน
                  </th>

                  <th
                    className={
                      "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-center bg-blueGray-50 text-blueGray-500 "
                    }
                  >
                    วันที่เริ่มต้น
                  </th>
                  <th
                    className={
                      "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-center bg-blueGray-50 text-blueGray-500 "
                    }
                  >
                    วันที่สิ้นสุด
                  </th>
                  <th
                    className={
                      "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-center bg-blueGray-50 text-blueGray-500 "
                    }
                  >
                    จำนวน Code
                  </th>
                  <th
                    className={
                      "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-center bg-blueGray-50 text-blueGray-500 "
                    }
                  >
                    แลกแล้ว
                  </th>
                  <th
                    className={
                      "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-center bg-blueGray-50 text-blueGray-500 "
                    }
                  >
                    คงเหลือ
                  </th>
                  <th
                    className={
                      "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-center bg-blueGray-50 text-blueGray-500 "
                    }
                  >
                    สถานะ
                  </th>
                  <th
                    className={
                      "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-center bg-blueGray-50 text-blueGray-500 "
                    }
                  >
                    Export
                  </th>
                </tr>
              </thead>
              <tbody>
                {listPointCode
                  .slice(pagesVisited, pagesVisited + usersPerPage)
                  .map(function (value, key) {
                    value.listNo = pagesVisited + key + 1;
                    return (
                      <tr key={key}>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 p-3 text-sm whitespace-nowrap text-center">
                          <span className="px-4 margin-a">{value.listNo}</span>
                        </td>
                        <td className=" focus-within:border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-left">
                          <span
                            title={value.pointCodeName}
                            className="text-gray-mbk  hover:text-gray-mbk "
                          >
                            {value.pointCodeName}
                          </span>
                          <span className="details">more info here</span>
                        </td>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center ">
                          <span className="text-gray-mbk  hover:text-gray-mbk ">
                            {value.pointCodeSymbol}
                          </span>
                        </td>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center ">
                          <span className="text-gray-mbk  hover:text-gray-mbk ">
                            {value.pointCodeLengthSymbol}
                          </span>
                        </td>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center ">
                          <span className="text-gray-mbk  hover:text-gray-mbk ">
                            {value.pointCodePoint}
                          </span>
                        </td>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center ">
                          <span className="text-gray-mbk  hover:text-gray-mbk ">
                            {moment(value.startDate).format("DD/MM/YYYY")}
                          </span>
                        </td>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center ">
                          <span className="text-gray-mbk  hover:text-gray-mbk ">
                            {moment(value.endDate).format("DD/MM/YYYY")}
                          </span>
                        </td>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center">
                          <span className="text-gray-mbk  hover:text-gray-mbk ">
                            {value.codeCount}
                          </span>
                        </td>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center">
                          <span className="text-gray-mbk  hover:text-gray-mbk ">
                            {value.useCount}
                          </span>
                        </td>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center">
                          <span className="text-gray-mbk  hover:text-gray-mbk ">
                            {value.remain}
                          </span>
                        </td>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center ">
                          {
                            //value.isActive === "2" ? "ปิดการใช้งาน" : "เปิดใช้งาน"
                            value.status
                          }
                        </td>
                        <td
                          onClick={() => {
                            ExportFile(value.id, value.pointCodeName);
                          }}
                          className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center"
                        >
                          <i className="fas fa-download  "></i>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
          <div className="px-4">
            <div className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap ">
              <div
                className="lg:w-6/12 font-bold"
                style={{ alignSelf: "stretch" }}
              >
                {pagesVisited + 10 > listPointCode.length
                  ? listPointCode.length
                  : pagesVisited + 10}{" "}
                {"/"}
                {listPointCode.length} รายการ
              </div>
              <div className="lg:w-6/12">
                <ReactPaginate
                  previousLabel={" < "}
                  nextLabel={" > "}
                  pageCount={pageCount}
                  onPageChange={changePage}
                  containerClassName={"paginationBttns"}
                  previousLinkClassName={"previousBttn"}
                  nextLinkClassName={"nextBttn"}
                  disabledClassName={"paginationDisabled"}
                  activeClassName={"paginationActive"}
                  forcePage={forcePage}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
