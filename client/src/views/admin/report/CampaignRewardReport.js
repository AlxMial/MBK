import React, { useEffect, useState } from "react";
import axios from "services/axios";
import ReactPaginate from "react-paginate";
import { exportExcel } from "services/exportExcel";
import { DatePicker, ConfigProvider } from "antd";
import { useFormik } from "formik";
import moment from "moment";
import Spinner from "components/Loadings/spinner/Spinner";
import useWindowDimensions from "services/useWindowDimensions";

export default function CampaignRewardReport() {
  const [listSearch, setListSerch] = useState([]);
  const [listCampaign, setListCampaign] = useState([]);
  const { width } = useWindowDimensions();
  const [forcePage, setForcePage] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const usersPerPage = 10;
  const pagesVisited = pageNumber * usersPerPage;
  const pageCount = Math.ceil(listCampaign.length / usersPerPage) || 1;
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
      setListCampaign(
        listSearch.sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
      );
    } else {
      setListCampaign(
        listSearch
          .filter((x) => {
            const _startDate =
              x.startDate !== "" ? convertToDate(x.startDate) : null;
            const _endDate = x.endDate !== "" ? convertToDate(x.endDate) : null;
            // let isDate = false;
            // if (x.startDate !== "" && x.endDate !== "") {
            //   isDate = true;
            // }
            if (
              (inputSerch !== ""
                ? Search(x.CampaignName, inputSerch) ||
                  Search(x.redemptionType, inputSerch) ||
                  Search(x.points, inputSerch) ||
                  Search(x.rewardType, inputSerch) ||
                  Search(
                    x.startDate == null
                      ? ""
                      : moment(x.startDate).format("DD/MM/YYYY"),
                    inputSerch
                  ) ||
                  Search(
                    x.endDate == null
                      ? ""
                      : moment(x.endDate).format("DD/MM/YYYY"),
                    inputSerch
                  ) ||
                  Search(
                    x.expireDate == null
                      ? ""
                      : moment(x.expireDate).format("DD/MM/YYYY"),
                    inputSerch
                  ) ||
                  Search(x.count, inputSerch) ||
                  Search(x.use, inputSerch) ||
                  Search(x.count - x.use, inputSerch)
                : true) &&
              SearchByDate(_startDate, _endDate)
            ) {
              return true;
            }
            return false;
          })
          .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
      );
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
      "????????????????????????",
      "??????????????????",
      "???????????????",
      "??????????????????????????????????????????",
      "???????????????????????????????????????",
      "???????????????????????????????????????",
      "????????????????????????????????????",
      "????????????????????????????????????",
      "?????????????????????????????????",
      "?????????????????????",
      "?????????????????????",
    ];
    const columns = [
      "listNo",
      "CampaignName",
      "points",
      "start",
      "end",
      "expired",
      "redemptionType",
      "rewardType",
      "count",
      "use",
      "toTal",
    ];
    let _listCampaign = [];
    listCampaign.map((e, i) => {
      _listCampaign.push({
        listNo: i + 1,
        CampaignName: e.CampaignName,
        points: e.points,
        start:
          e.startDate == null ? "-" : moment(e.startDate).format("DD/MM/YYYY"),
        end: e.endDate == null ? "-" : moment(e.endDate).format("DD/MM/YYYY"),
        expired:
          e.expireDate == null
            ? "-"
            : moment(e.expireDate).format("DD/MM/YYYY"),
        redemptionType: e.redemptionType,
        rewardType: e.rewardType,
        count: e.count == null ? "-" : e.count,
        use: e.use == null ? "-" : e.use,
        toTal: e.count == null ? "-" : e.count - e.use,
      });
      return e;
    });
    exportExcel(
      _listCampaign,
      "????????????????????????????????????????????????????????????????????????",
      TitleColumns,
      columns,
      "????????????????????????????????????????????????????????????????????????"
    );
    setIsLoading(false);
  };

  useEffect(() => {
    axios.get("report/ShowCampaignReward").then((response) => {
      if (response.data.error) {
      } else {
        if (response.data.status) {
          let data = response.data.points;

          setListCampaign(data);
          setListSerch(data);
        }
      }
    });
  }, []);

  const dataTable = {
    head: [
      { name: "????????????????????????", css: "text-center" },
      { name: "??????????????????", css: "text-left" },
      { name: "???????????????", css: "text-center" },
      { name: "??????????????????????????????????????????", css: "text-center" },
      { name: "???????????????????????????????????????", css: "text-center" },
      { name: "???????????????????????????????????????", css: "text-center" },
      { name: "????????????????????????????????????", css: "text-center" },
      { name: "????????????????????????????????????", css: "text-center" },
      { name: "?????????????????????????????????", css: "text-right" },
      { name: "?????????????????????", css: "text-right" },
      { name: "?????????????????????", css: "text-right" },
    ],
    DT: [
      { name: "listNo", css: "text-center" },
      { name: "CampaignName", css: "text-left" },
      { name: "points", css: "text-center" },
      { name: "startDate", css: "text-center" },
      { name: "endDate", css: "text-center" },
      { name: "expireDate", css: "text-center" },
      { name: "redemptionType", css: "text-center" },
      { name: "rewardType", css: "text-center" },
      { name: "count", css: "text-right" },
      { name: "use", css: "text-right" },
      { name: "total", css: "text-right" },
    ],
    dataDT: (e, value) => {
      return e.name.toLowerCase().includes("date")
        ?  value[e.name] == null
          ? "-"
          : moment(value[e.name]).format("DD/MM/YYYY")
        : e.name === "remain"
        ? value.count - value.use
        : value[e.name] === "total" ?   value[e.name] = e.count - e.use  : value[e.name] == null
        ? "-"
        : (e.name === "count" && value.count == 0) ? value[e.name] = '????????????????????????' : 
        (e.name === "use" && value.count == '????????????????????????') ? value[e.name] = '????????????????????????' : 
        (e.name === "total" && value.count == '????????????????????????') ? value[e.name] = '????????????????????????' : value[e.name];
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
          ??????????????????&nbsp;&nbsp;/&nbsp;&nbsp;
        </span>
        <span className="text-base margin-auto font-bold">
          ????????????????????????????????????????????????????????????????????????
        </span>
      </div>
      <div className="w-full px-4">
        <div className="flex flex-warp py-2 mt-6 ">
          <span className="text-lg  text-green-mbk margin-auto font-bold">
            ????????????????????????????????????????????????????????????????????????
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
                  ??????????????????????????????????????????
                </label>
              </div>
              <div className="w-full lg:w-3/12 px-4 margin-auto-t-b">
                <div className="relative">
                  <ConfigProvider>
                    <DatePicker
                      inputReadOnly={true}
                      format={"DD/MM/yyyy"}
                      placeholder="?????????????????????????????????"
                      showToday={false}
                      //defaultValue={startDateCode}
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
                  ?????????
                </label>
              </div>

              <div className="w-full lg:w-3/12 px-4 margin-auto-t-b">
                <ConfigProvider>
                  <DatePicker
                    inputReadOnly={true}
                    format={"DD/MM/yyyy"}
                    placeholder="?????????????????????????????????"
                    showToday={false}
                    //defaultValue={endDateCode}
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
                  <span className="text-white text-sm px-2">???????????????</span>
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
                {listCampaign
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
                {pagesVisited + 10 > listCampaign.length
                  ? listCampaign.length
                  : pagesVisited + 10}{" "}
                {"/"}
                {listCampaign.length} ??????????????????
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
