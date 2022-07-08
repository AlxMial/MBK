import React, { useEffect, useState } from "react";
import axios from "services/axios";
import ReactPaginate from "react-paginate";
import { exportExcel } from "services/exportExcel";
import { DatePicker, ConfigProvider } from "antd";
import { useFormik } from "formik";
import moment from "moment";
import Spinner from "components/Loadings/spinner/Spinner";
import useWindowDimensions from "services/useWindowDimensions";

export default function CollectPointsReport() {
  const [listSearch, setListSerch] = useState([]);
  const [listPoint, setListPoint] = useState([]);
  const { width } = useWindowDimensions();
  const [forcePage, setForcePage] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const usersPerPage = 10;
  const pagesVisited = pageNumber * usersPerPage;

  const formSerch = useFormik({
    initialValues: {
      inputSerch: "",
      startDate: null,
      endDate: null,
    },
  });
  const InputSearch = () => {
    const inputSerch = formSerch.values.inputSerch;
    let startDate =
      formSerch.values.startDate !== null
        ? convertToDate(formSerch.values.startDate)
        : null;
    let endDate =
      formSerch.values.endDate !== null
        ? convertToDate(formSerch.values.endDate)
        : null;
    if (inputSerch === "" && startDate === null && endDate === null) {
      setListPoint(
        listSearch.sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
      );
    } else {
      if (inputSerch == null) {
        setListPoint(listSearch);
      } else {
        const _startDate =
          formSerch.values.startDate == null
            ? null
            : new Date(moment(formSerch.values.startDate).format("yyy-MM-DD"));
        const _endDate =
          formSerch.values.endDate == null
            ? null
            : new Date(moment(formSerch.values.endDate).format("yyy-MM-DD"));
        setListPoint(
          listSearch
            .filter((x) => {
              let startDate =
                x.startDate == null
                  ? null
                  : new Date(moment(new Date(x.startDate)).format("yyy-MM-DD"));
              let endDate =
                x.startDate == null
                  ? null
                  : new Date(moment(new Date(x.endDate)).format("yyy-MM-DD"));

              let isdate =
                (startDate != null &&
                  endDate == null &&
                  startDate < _startDate) ||
                (startDate != null &&
                  endDate != null &&
                  _endDate != null &&
                  _startDate != null &&
                  ((startDate >= _startDate && startDate <= _endDate) ||
                    (endDate >= _startDate && endDate < _endDate))) ||
                (startDate == null &&
                  endDate != null &&
                  endDate > _startDate) ||
                (_startDate != null &&
                  _endDate == null &&
                  _startDate >= startDate &&
                  _startDate <= endDate) ||
                (_startDate == null &&
                  _endDate != null &&
                  _endDate >= startDate &&
                  _endDate <= endDate);

              if (
                isdate &&
                (Search(x.CampaignName, inputSerch) ||
                  Search(x.code, inputSerch) ||
                  Search(x.firstName, inputSerch) ||
                  Search(x.lastName, inputSerch) ||
                  Search(x.phone, inputSerch) ||
                  Search(x.points, inputSerch) ||
                  Search(
                    x.endDate == null
                      ? ""
                      : moment(x.endDate).format("DD/MM/YYYY"),
                    inputSerch
                  ) ||
                  Search(
                    x.startDate == null
                      ? ""
                      : moment(x.startDate).format("DD/MM/YYYY"),
                    inputSerch
                  ) ||
                  Search(
                    x.redeemDate == null
                      ? ""
                      : moment(x.redeemDate).format("DD/MM/YYYY"),
                    inputSerch
                  ) ||
                  Search(
                    x.campaignType == "1"
                      ? "กรอก Code จากสินค้า"
                      : x.campaignType == "2"
                      ? "ซื้อสินค้าออนไลน์"
                      : x.campaignType == "3"
                      ? "สมัครสมาชิก"
                      : x.campaignType == "4"
                      ? "แลกคูปอง"
                      : x.campaignType == "5"
                      ? "แลกของสมนาคุณ"
                      : "เล่นเกมส์",
                    inputSerch
                  ) ||
                  Search(
                    "123".includes(x.campaignType) ? "รับคะแนน" : "แลกคะแนน",
                    inputSerch
                  ))
              ) {
                return x;
              }
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

  const convertToDate = (e) => {
    const date = new Date(e);
    date.setHours(0, 0, 0, 0);
    return date;
  };

  const setDataSearch = (e, type) => {
    const s_Date = formSerch.values.startDate;
    const e_Date = formSerch.values.endDate;
    if (type === "s_input") {
      formSerch.values.inputSerch = e.toLowerCase();
      InputSearch();
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
    }
  };

  const pageCount = Math.ceil(listPoint.length / usersPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
    setForcePage(selected);
  };

  const Excel = async (sheetname) => {
    setIsLoading(true);
    const TitleColumns = [
      "ลำดับ",
      "แคมเปญ",
      "วันที่เริ่มต้น",
      "วันที่สิ้นสุด",
      "ประเภท",
      "ชื่อลูกค้า",
      "เบอร์โทรศัพท์",
      "Code",
      "สถานะ",
      "วันที่แลก",
    ];
    const columns = [
      "listno",
      "CampaignName",
      "start",
      "end",
      "campaignType",
      "member",
      "phone",
      "code",
      "status",
      "redeem",
    ];
    let count = 0;
    let _listPoint = [];

    listPoint.map((e, i) => {
      _listPoint.push({
        listno: i + 1,
        CampaignName: e.CampaignName,
        start:
          e.startDate == null ? "-" : moment(e.startDate).format("DD/MM/YYYY"),
        end: e.endDate == null ? "-" : moment(e.endDate).format("DD/MM/YYYY"),
        campaignType:
          e.campaignType == "1"
            ? "กรอก Code จากสินค้า"
            : e.campaignType == "2"
            ? "ซื้อสินค้าออนไลน์"
            : e.campaignType == "3"
            ? "สมัครสมาชิก"
            : e.campaignType == "4"
            ? "แลกคูปอง"
            : e.campaignType == "5"
            ? "แลกของสมนาคุณ"
            : "เล่นเกมส์",
        member: e.firstName + " " + e.lastName,
        phone: e.phone,
        code: e.code,
        point: e.points,
        status: "123".includes(e.campaignType) ? "รับคะแนน" : "แลกคะแนน",
        redeem:
          e.redeemDate == null
            ? "-"
            : moment(e.redeemDate).format("DD/MM/YYYY"),
      });
    });
    exportExcel(
      _listPoint,
      "รายงานสะสมคะแนน",
      TitleColumns,
      columns,
      "รายงานสะสมคะแนน"
    );
    setIsLoading(false);
  };

  const fetchData = async () => {
    setIsLoading(true);
    await axios
      .get("report/ShowCollectPoints")
      .then((response) => {
        if (response.data.status) {
          let _points = response.data.points.sort(
            (a, b) => new Date(b.redeemDate) - new Date(a.redeemDate)
          );
          setListSerch(_points);
          setListPoint(_points);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {isLoading ? <Spinner customText={"Loading"} /> : null}
      <div className="flex flex-warp">
        <span className="text-sm margin-auto-t-b font-bold ">
          <i className="fas fa-cog"></i>&nbsp;&nbsp;
        </span>
        <span className="text-base margin-auto-t-b font-bold">
          รายงาน&nbsp;&nbsp;/&nbsp;&nbsp;
        </span>
        <span className="text-base margin-auto font-bold">รายงานสะสมคะแนน</span>
      </div>
      <div className="w-full px-4">
        <div className="flex flex-warp py-2 mt-6 ">
          <span className="text-lg  text-green-mbk margin-auto font-bold">
            รายงานสะสมคะแนน
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
                    setDataSearch(e.target.value, "s_input");
                  }}
                />
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
                          current <= moment(new Date(day)).endOf("day")
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
                    InputSearch();
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
                    ประเภท
                  </th>

                  <th
                    className={
                      "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-center bg-blueGray-50 text-blueGray-500 "
                    }
                  >
                    ชื่อลูกค้า
                  </th>
                  <th
                    className={
                      "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-center bg-blueGray-50 text-blueGray-500 "
                    }
                  >
                    เบอร์โทรศัพท์
                  </th>
                  <th
                    className={
                      "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-center bg-blueGray-50 text-blueGray-500 "
                    }
                  >
                    Code
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
                    สถานะ
                  </th>
                  <th
                    className={
                      "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-center bg-blueGray-50 text-blueGray-500 "
                    }
                  >
                    วันที่แลก
                  </th>
                </tr>
              </thead>
              <tbody>
                {listPoint
                  .slice(pagesVisited, pagesVisited + usersPerPage)
                  .map(function (value, key) {
                    value.listNo = pagesVisited + key + 1;
                    return (
                      <tr key={key}>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 p-3 text-sm whitespace-nowrap text-center">
                          <span className="px-4 margin-a">{value.listNo}</span>
                        </td>
                        <td className=" focus-within:border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-left cursor-pointer">
                          <span
                            title={value.CampaignName}
                            className="text-gray-mbk  hover:text-gray-mbk "
                          >
                            {value.CampaignName}
                          </span>
                          <span className="details">more info here</span>
                        </td>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center cursor-pointer">
                          <span className="text-gray-mbk  hover:text-gray-mbk ">
                            {value.startDate == null
                              ? "-"
                              : moment(value.startDate).format("DD/MM/YYYY")}
                          </span>
                        </td>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center cursor-pointer">
                          <span className="text-gray-mbk  hover:text-gray-mbk ">
                            {value.endDate == null
                              ? "-"
                              : moment(value.endDate).format("DD/MM/YYYY")}
                          </span>
                        </td>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center cursor-pointer">
                          <span className="text-gray-mbk  hover:text-gray-mbk ">
                            {value.campaignType == "1"
                              ? "กรอก Code จากสินค้า"
                              : value.campaignType == "2"
                              ? "ซื้อสินค้าออนไลน์"
                              : value.campaignType == "3"
                              ? "สมัครสมาชิก"
                              : value.campaignType == "4"
                              ? "แลกคูปอง"
                              : value.campaignType == "5"
                              ? "แลกของสมนาคุณ"
                              : "เล่นเกมส์"}
                          </span>
                        </td>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center cursor-pointer">
                          <span className="text-gray-mbk  hover:text-gray-mbk ">
                            {value.firstName + " " + value.lastName}
                          </span>
                        </td>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center ">
                          <span className="text-gray-mbk  hover:text-gray-mbk ">
                            {value.phone}
                          </span>
                        </td>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center">
                          <span className="text-gray-mbk  hover:text-gray-mbk ">
                            {value.code == null ? "-" : value.code}
                          </span>
                        </td>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-right">
                          <span className="text-gray-mbk  hover:text-gray-mbk ">
                            {value.points == null
                              ? "-"
                              : ("123".includes(value.campaignType)
                                  ? "+"
                                  : "-") + value.points}
                          </span>
                        </td>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center">
                          <span className="text-gray-mbk  hover:text-gray-mbk ">
                            {"123".includes(value.campaignType)
                              ? "รับคะแนน"
                              : "แลกคะแนน"}
                          </span>
                        </td>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center ">
                          {value.redeemDate == null
                            ? "-"
                            : moment(value.redeemDate).format("DD/MM/YYYY")}
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
                {pagesVisited + 10 > listPoint.length
                  ? listPoint.length
                  : pagesVisited + 10}{" "}
                {"/"}
                {listPoint.length} รายการ
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
