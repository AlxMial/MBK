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
  const listCampaignType = [
    { value: "1", type: "Code", status: "แลกคะแนน"},
    { value: "2", type: "E-Commerce", status: "รับคะแนน" },
    { value: "3", type: "Register", status: "รับคะแนน" },
  ];
  const redemptionType = [
    { value: "1", label: "Standard" },
    { value: "2", label: "Game" },
  ];
  const rewardType = [
    { value: "1", label: "E-Coupon" },
    { value: "2", label: "สินค้า" },
  ];
  const formSerch =  useFormik({
    initialValues:  { 
      inputSerch: "",    
      startDate: null,
      endDate: null, 
    }
  });
  const InputSearch = () => {   
      const inputSerch = formSerch.values.inputSerch;
      let startDate = formSerch.values.startDate !== null ? convertToDate(formSerch.values.startDate): null;         
      let endDate = formSerch.values.endDate !== null ? convertToDate(formSerch.values.endDate): null;   
    if (inputSerch === "" && startDate === null && endDate === null) {
       setListCampaign(listSearch.sort((a, b) =>  new Date(b.startDate) - new Date(a.startDate)));
    } else {
     
       setListCampaign(
        listSearch.filter(
        (x) => {
          const _startDate = x.startDate !== "" ? convertToDate(x.startDate) : null;
          const _endDate = x.endDate !== "" ? convertToDate(x.endDate) : null;
          let isDate = false;
            if(x.startDate !== '' && x.endDate !== '') {             
              isDate = true;
            }            
            if((inputSerch !== "" ? 
            (Search(x.redemptionName, inputSerch) ||
            Search(x.redemptionTypeStr, inputSerch) ||
            Search(x.points, inputSerch) ||
            Search(x.rewardTypeStr, inputSerch) ||
            Search(x.rewardTota, inputSerch) ||
            Search(x.exchangedTotal, inputSerch) ||
            Search(x.toTal, inputSerch)) : true) &&
            SearchByDate(_startDate, _endDate)) {
                return true;
            }
            return false;
          }            
        ).sort((a, b) =>  new Date(b.startDate) - new Date(a.startDate))
     );
      setPageNumber(0);
      setForcePage(0);
    }
  };
  const Search = (val, inputSerch) =>  {
    let status = false;
    if(val !== '' && val !== null && val !== undefined) {
      status =  val.toString().toLowerCase().includes(inputSerch);
    }
    return status;
  }
  const SearchByDate = (dataST_Date, dataED_Date) =>  {
    let isSearch = false;
    let st_Date = formSerch.values.startDate !== null ? convertToDate(formSerch.values.startDate): null;         
    let ed_Date = formSerch.values.endDate !== null ? convertToDate(formSerch.values.endDate): null;   
    if(((st_Date !== null && ed_Date !== null) && 
        ((st_Date <= dataST_Date  && st_Date <= dataED_Date && ed_Date >= dataST_Date && ed_Date >= dataED_Date) || 
         (st_Date <= dataST_Date  && ed_Date >= dataST_Date && !(st_Date <= dataED_Date  && ed_Date >= dataED_Date)) ||
         (!(st_Date <= dataST_Date  && ed_Date >= dataST_Date) && st_Date <= dataED_Date  && ed_Date >= dataED_Date))) 
         
         
         || ((st_Date !== null && ed_Date === null) && (st_Date <= dataST_Date || st_Date <= dataED_Date))
         || ((st_Date === null && ed_Date !== null) && (ed_Date >= dataST_Date || ed_Date >= dataED_Date))
         || (st_Date === null && ed_Date === null)) {
          isSearch = true;
    }
    return isSearch;
  }
  const convertToDate = (e) => {    
   const date = new Date(e);
         date.setHours(0,0,0,0);
   return date;
  };

  const setDataSearch = (e, type) => {    
    const s_Date = formSerch.values.startDate;
    const e_Date = formSerch.values.endDate;
    if (type === "s_input") {
      formSerch.values.inputSerch = e.toLowerCase();
      InputSearch();      
    } else if(type === "s_stdate") {  
      formSerch.setFieldValue("startDate", e);
      if(e > e_Date && e_Date !== null) {
        formSerch.setFieldValue("startDate", e_Date);
      }
    } else if(type === "s_eddate") {  
      formSerch.setFieldValue("endDate", e);
      if(e < s_Date && s_Date !== null) {
        formSerch.setFieldValue("endDate", s_Date);
      }  
    } 
  };

 
  const pageCount = Math.ceil(listCampaign.length / usersPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
    setForcePage(selected);
  };

  const Excel = async (sheetname) => {
    setIsLoading(true);
    const TitleColumns = [
      "แคมเปญ",
      "คะแนน",
      "วันที่เริ่มต้น",
      "วันที่สิ้นสุด",
      "วันที่หมดอายุ",
      "ประเภทแคมเปญ",
      "ประเภทรางวัล",
      "จำนวนรางวัล",
      "แลกแล้ว",
      "คงเหลือ"
    ];
    const columns = [
      "redemptionName",
      "points",
      "startDate",
      "endDate",
      "expiredDate",
      "redemptionTypeStr",
      "rewardTypeStr",
      "rewardTotal",
      "exchangedTotal",
      "toTal",
    ];
    let count = 0;
    listCampaign.forEach(el => { 
        count++; 
        el.listNo = count;
    });
    exportExcel(
        listCampaign,
      "รายงานข้อมูลแคมเปญรางวัล",
      TitleColumns,
      columns,
      "รายงานข้อมูลแคมเปญรางวัล"
    );
    setIsLoading(false);
  };

  useEffect(() => {
    axios.get("report/ShowCampaignReward").then((response) => {
      if (response.data.error) {
      } else {
        if (response.data !== null) {
          response.data.forEach(e => {
            e.redemptionTypeStr = redemptionType.find(el => el.value === e.redemptionType).label; 
            e.rewardTypeStr = ((e.rewardType !== '' &&  e.rewardType !== undefined) ? rewardType.find(el => el.value === e.rewardType).label : "");             
          });

          setListCampaign(response.data.sort((a, b) =>  new Date(b.startDate) - new Date(a.startDate)));
          setListSerch(response.data.sort((a, b) =>  new Date(b.startDate) - new Date(a.startDate)));
        }
      }
    });
   
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
        <span className="text-base margin-auto font-bold">รายงานข้อมูลแคมเปญรางวัล</span>
      </div>
      <div className="w-full px-4">
         <div className="flex flex-warp py-2 mt-6 ">
            <span className="text-lg  text-green-mbk margin-auto font-bold">
            รายงานข้อมูลแคมเปญรางวัล
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
                <ConfigProvider >
                    <DatePicker
                    inputReadOnly={true}
                    format={"DD/MM/yyyy"}
                    placeholder="เลือกวันที่"
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
                      ? moment(new Date(formSerch.values.startDate),"DD/MM/YYYY") : ""
                    }
                    onChange={(e) => {
                      setDataSearch(e, "s_stdate");
                    }}
                    />
                </ConfigProvider> 
                </div>
            </div>
            <div
                className={
                "w-full mb-4" +
                (width < 764 ? " block" : " hidden")
                }
            ></div>
            <div className="lg\:w-auto  margin-auto-t-b ">
                <label
                className="text-blueGray-600 text-sm font-bold "
                htmlFor="grid-password"
                >ถึง</label>                
            </div>

            <div className="w-full lg:w-3/12 px-4 margin-auto-t-b">
                <ConfigProvider >
                <DatePicker
                    inputReadOnly={true}
                    format={"DD/MM/yyyy"}
                    placeholder="เลือกวันที่"
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
                      ? moment(new Date(formSerch.values.endDate),"DD/MM/YYYY") : ""
                    }
                    onChange={(e) => {
                      setDataSearch(e, "s_eddate");                         
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
                      <span className="text-white text-sm px-2">
                        ค้นหา
                      </span>
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
              >  
              </div>             
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
                    วันที่หมดอายุ
                  </th>

                  <th
                    className={
                      "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-center bg-blueGray-50 text-blueGray-500 "
                    }
                  >
                    ประเภทแคมเปญ
                  </th>
                  <th
                    className={
                      "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-center bg-blueGray-50 text-blueGray-500 "
                    }
                  >
                    ประเภทรางวัล
                  </th>                 
                  <th
                    className={
                      "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-center bg-blueGray-50 text-blueGray-500 "
                    }
                  >
                    จำนวนรางวัล
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
                </tr>
              </thead>
              <tbody>
                {listCampaign
                  .slice(pagesVisited, pagesVisited + usersPerPage)
                  .map(function (value, key) {
                    value.listNo = pagesVisited + key + 1;
                    return (
                      <tr key={key}>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 p-3 text-sm whitespace-nowrap text-center">
                          <span className="px-4 margin-a">
                            {value.listNo}
                          </span>
                        </td>
                        <td                         
                          className=" focus-within:border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-left cursor-pointer"
                        >
                          <span
                            title={value.redemptionName}
                            className="text-gray-mbk  hover:text-gray-mbk "
                          >
                            {value.redemptionName}
                          </span>
                          <span className="details">more info here</span>
                        </td>
                        <td                         
                          className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center cursor-pointer"
                        >
                          <span className="text-gray-mbk  hover:text-gray-mbk ">
                          { value.points}
                          </span>
                        </td>
                        <td                         
                          className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center cursor-pointer"
                        >
                          <span className="text-gray-mbk  hover:text-gray-mbk ">
                          { moment(value.startDate).format("DD/MM/YYYY")}
                          </span>
                        </td>
                        <td                          
                          className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center cursor-pointer"
                        >
                          <span className="text-gray-mbk  hover:text-gray-mbk ">
                          { moment(value.endDate).format("DD/MM/YYYY")}
                          </span>
                        </td>
                        <td                         
                          className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center cursor-pointer"
                        >
                          <span className="text-gray-mbk  hover:text-gray-mbk ">
                          { value.expiredDate !== "" ?  moment(value.expiredDate).format("DD/MM/YYYY") : ""}
                          </span>
                        </td>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center ">
                          <span className="text-gray-mbk  hover:text-gray-mbk ">
                            {value.redemptionTypeStr}
                          </span>
                        </td>                       
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center">
                          <span className="text-gray-mbk  hover:text-gray-mbk ">
                            {value.rewardTypeStr}
                          </span>
                        </td>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center">
                          <span className="text-gray-mbk  hover:text-gray-mbk ">
                            {value.rewardTotal}
                          </span>
                        </td>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center">
                          <span className="text-gray-mbk  hover:text-gray-mbk ">
                            {value.exchangedTotal}
                          </span>
                        </td>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center ">
                          {value.toTal}
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
                {pagesVisited + 10 > listCampaign.length
                  ? listCampaign.length
                  : pagesVisited + 10}{" "}
                {"/"}
                {listCampaign.length} รายการ
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
