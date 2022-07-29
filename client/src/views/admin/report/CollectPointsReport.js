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
  const pageCount = Math.ceil(listPoint.length / usersPerPage) || 1;

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
                _startDate == null && _endDate == null
                  ? true
                  : (startDate != null &&
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

              return (
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
                    parseInt(x.campaignType) === 1
                      ? "กรอก Code จากสินค้า"
                      : parseInt(x.campaignType) === 2
                      ? "ซื้อสินค้าออนไลน์"
                      : parseInt(x.campaignType) === 3
                      ? "สมัครสมาชิก"
                      : parseInt(x.campaignType) === 4
                      ? "แลกคูปอง"
                      : parseInt(x.campaignType) === 5
                      ? "แลกของสมนาคุณ"
                      : "เล่นเกมส์",
                    inputSerch
                  ) ||
                  Search(
                    "123".includes(x.campaignType) ? "รับคะแนน" : "แลกคะแนน",
                    inputSerch
                  ))
              );
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

  const changePage = ({ selected }) => {
    setPageNumber(selected);
    setForcePage(selected);
  };

  const Excel = async (sheetname) => {
    setIsLoading(true);

    const TitleColumns = [
      "ลำดับ",
      "รหัสสมาชิก",
      "ชื่อลูกค้า",
      "นามสกุล",
      "เบอร์โทรศัพท์",
      "แคมเปญ",
      "ประเภท",
      "คะแนน",
      "สถานะ",
      "วันที่ได้รับคะแนน",
      "วันที่เริ่มต้น",
      "วันที่สิ้นสุด",
      "Code",
    ];

    const columns = [
      "listno",
      "memberCard",
      "firstName",
      "lastName",
      "phone",
      "campaignType",
      "rewardType",
      "point",
      "status",
      "redeem",
      "start",
      "end",
      "code",
    ];

    // let count = 0;
    let _listPoint = [];

    listPoint.map((e, i) => {
      _listPoint.push({
        listno: i + 1,
        CampaignName: e.CampaignName,
        start:
          e.startDate == null ? "-" : moment(e.startDate).format("DD/MM/YYYY"),
        end: e.endDate == null ? "-" : moment(e.endDate).format("DD/MM/YYYY"),
        campaignType:
          parseInt(e.campaignType) === 1
            ? "กรอก Code จากสินค้า"
            : parseInt(e.campaignType) === 2
            ? "ซื้อสินค้าออนไลน์"
            : parseInt(e.campaignType) === 3
            ? "สมัครสมาชิก"
            : parseInt(e.campaignType) === 4
            ? "แลกคูปอง"
            : parseInt(e.campaignType) === 5
            ? "แลกของสมนาคุณ"
            : "เล่นเกม",
        firstName: e.firstName,
        lastName: e.lastName,
        phone: e.phone,
        code: e.code == null ? "-" : e.code,
        point: e.points,
        status: "123".includes(e.campaignType) ? "รับคะแนน" : "แลกคะแนน",
        redeem:
          e.redeemDate == null
            ? "-"
            : moment(e.redeemDate).format("DD/MM/YYYY"),
        memberCard: e.memberCard,
        rewardType: e.rewardType == null ? "-" : e.rewardType,
      });
      return e;
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
          console.log(_points);
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

  const dataTable = {
    head: [
      { name: "ลำดับที่", css: "text-center" },
      { name: "แคมเปญ", css: "text-left" },
      { name: "วันที่เริ่มต้น", css: "text-center" },
      { name: "วันที่สิ้นสุด", css: "text-center" },
      { name: "ประเภท", css: "text-left" },
      { name: "ชื่อลูกค้า", css: "text-left" },
      { name: "เบอร์โทรศัพท์", css: "text-left" },
      { name: "Code", css: "text-center" },
      { name: "คะแนน", css: "text-center" },
      { name: "สถานะ", css: "text-center" },
      { name: "วันที่แลก", css: "text-center" },
    ],
    DT: [
      { name: "listNo", css: "text-center" },
      { name: "CampaignName", css: "text-left" },
      { name: "startDate", css: "text-center" },
      { name: "endDate", css: "text-center" },
      { name: "campaignType", css: "text-left" },
      { name: "fullName", css: "text-left" },
      { name: "phone", css: "text-left" },
      { name: "code", css: "text-center" },
      { name: "points", css: "text-right" },
      { name: "status", css: "text-center" },
      { name: "redeemDate", css: "text-center" },
    ],
    dataDT: (e, value) => {
      return e.name.toLowerCase().includes("date")
        ? value[e.name] == null
          ? "-"
          : moment(value[e.name]).format("DD/MM/YYYY")
        : e.name === "fullName"
        ? value.firstName + " " + value.lastName
        : e.name === "campaignType"
        ? parseInt(value.campaignType) === 1
          ? "กรอก Code จากสินค้า"
          : parseInt(value.campaignType) === 2
          ? "ซื้อสินค้าออนไลน์"
          : parseInt(value.campaignType) === 3
          ? "สมัครสมาชิก"
          : parseInt(value.campaignType) === 4
          ? "แลกคูปอง"
          : parseInt(value.campaignType) === 5
          ? "แลกของสมนาคุณ"
          : "เล่นเกม"
        : e.name === "points"
        ? value.points == null
          ? "-"
          : ("123".includes(value.campaignType) ? "+" : "-") + value.points
        : e.name === "status"
        ? "123".includes(value.campaignType)
          ? "รับคะแนน"
          : "แลกคะแนน"
        : value[e.name] == null
        ? "-"
        : value[e.name];
    },
  };

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
                  {[...dataTable.head].map((e, i) => {
                    return (
                      <th
                        key={i}
                        className={
                          e.css +
                          " px-6 w-5 align-middle border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold  bg-blueGray-50 text-blueGray-500 "
                        }
                      >
                        {e.name}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {listPoint
                  .slice(pagesVisited, pagesVisited + usersPerPage)
                  .map(function (value, key) {
                    value.listNo = pagesVisited + key + 1;
                    return (
                      <tr key={key}>
                        {[...dataTable.DT].map((e, i) => {
                          return (
                            <td
                              key={i}
                              className={
                                e.css +
                                " border-t-0 px-2 align-middle border-b border-l-0 border-r-0 p-3 text-sm whitespace-nowrap "
                              }
                            >
                              <span
                                className="px-4 margin-a"
                                title={dataTable.dataDT(e, value)}
                              >
                                {dataTable.dataDT(e, value)}
                              </span>
                            </td>
                          );
                        })}
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
