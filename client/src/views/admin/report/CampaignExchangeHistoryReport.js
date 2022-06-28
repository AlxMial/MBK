import React, { useEffect, useState } from "react";
import axios from "services/axios";
import ReactPaginate from "react-paginate";
import { exportExcel } from "services/exportExcel";
import { DatePicker, ConfigProvider } from "antd";
import { useFormik } from "formik";
import moment from "moment";
import Spinner from "components/Loadings/spinner/Spinner";
import useWindowDimensions from "services/useWindowDimensions";
import ReactTooltip from 'react-tooltip';
import Select from "react-select";
import ValidateService from "services/validateValue";
import { styleSelect } from "assets/styles/theme/ReactSelect.js";

export default function CampaignExchangeHistoryReport() {
  const UseStyleSelect = styleSelect();
  const [listSearch, setListSerch] = useState([]);
//   const [listCampaign, setListCampaign] = useState([]);
  const [listCampaignExchange, setListCampaignExchange] = useState([]);    
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
  const dropdown = [
    { label: "ส่งแล้ว", value: "Done" },
    { label: "เตรียมส่ง", value: "Wait" },
    { label: "อยู่ระหว่างจัดส่ง", value: "InTransit" },
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
        setListCampaignExchange(listSearch);
    } else {     
        setListCampaignExchange(
        listSearch.filter(
        (x) => {
          const _startDate = x.startDate !== "" ? convertToDate(x.startDate) : null;
          const _endDate = x.endDate !== "" ? convertToDate(x.endDate) : null;
          let isDate = false;
            if(x.startDate !== '' && x.endDate !== '') {             
              isDate = true;
            }            
            if((inputSerch !== "" ? (x.pointCodeName.toLowerCase().includes(inputSerch) ||
            (x.memberName === null ? "" : x.memberName)
            .toLowerCase()
            .includes(inputSerch) ||
            x.point.toString().includes(inputSerch) ||
            (x.pointType === null ? "" : x.pointType)
            .toString()
            .includes(inputSerch) ||
            x.status.toLowerCase().toString().includes(inputSerch) ||
            (x.code === null ? "" : x.code)
            .toLowerCase()
            .includes(inputSerch)
           ) : true) &&

            ((startDate !== null && endDate !== null) ? (isDate ? ((startDate <= _startDate  && startDate <= _endDate &&
            endDate >= _startDate && endDate >= _endDate)) : false) : true)) {
                return true;
            }
            return false;
          }            
        )
     );
      setPageNumber(0);
      setForcePage(0);
    }
  };

  const convertToDate = (e) => {    
   const date = new Date(e);
         date.setHours(0,0,0,0);
   return date;
  };

  const setDataSearch = (e, type) => {    
    if (type === "s_input") {
      formSerch.values.inputSerch = e.toLowerCase();
      InputSearch();      
    } else if(type === "s_stdate") {    
      formSerch.values.startDate = e; 
    } else if(type === "s_eddate") {     
      formSerch.values.endDate = e;
    }   
  };

  const showTrackingNo = (e) => {  
    const index = e;
    setListCampaignExchange((s) => {
      const newArr = s.slice();
      newArr[index].isShowTKNo = true;

      return newArr;
    });
  };

  const editTrackingNo = (e, val) => {  
    const index = e;
    setListCampaignExchange((s) => {
      const newArr = s.slice();
      newArr[index].trackingNo = val.target.value;
      return newArr;
    });
  };

  const editdeliverStatus = (e, val) => {  
    const index = e;
    setListCampaignExchange((s) => {
      const newArr = s.slice();
      newArr[index].deliverStatus = val;
      return newArr;
    });
  };
  const saveTrackingNo = (e) => {  
    const index = e;
    setListCampaignExchange((s) => {
      const newArr = s.slice();
      newArr[index].isShowTKNo = false;
      return newArr;
    });
  };

 
  const pageCount = Math.ceil(listCampaignExchange.length / usersPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
    setForcePage(selected);
  };

  const Excel = async (sheetname) => {
    setIsLoading(true);
    const TitleColumns = [
      "ลำดับที่",
      "แคมเปญ",
      "วันที่เริ่มต้น",
      "วันที่สิ้นสุด",
      "ประเภท",
      "ชื่อลูกค้า",
      "เบอร์โทรศัพท์",
      "Code",
      "คะแนน",
      "สถานะ",
      "วันที่แลก"
    ];
    const columns = [
      "listNo",      
      "pointCodeName",
      "startDate",
      "endDate",
      "pointType",
      "memberName",
      "phone",
      "code",
      "point",
      "status",
      "exchangedate",
    ];
    let count = 0;
    listCampaignExchange.forEach(el => { 
        count++; 
        el.listNo = count;
    });
    exportExcel(
        listCampaignExchange,
      "รายงานประวัติการแลกของรางวัล",
      TitleColumns,
      columns,
      "รายงานประวัติการแลกของรางวัล"
    );
    setIsLoading(false);
  };

  

  useEffect(() => {
      axios.get("report/ShowCampaignExchange").then((response) => {
        if (response.data.length > 0) {
          response.data.forEach(e => {
            e.redemptionTypeStr = (e.redemptionType !== "" ? (redemptionType.find(el => el.value === e.redemptionType).label) : ""); 
            e.rewardTypeStr = ((e.rewardType !== '' &&  e.rewardType !== undefined) ? rewardType.find(el => el.value === e.rewardType).label : ""); 
          });
                  
          setListSerch(response.data);
          setListCampaignExchange(response.data);
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
        <span className="text-base margin-auto font-bold">รายงานประวัติการแลกของรางวัล</span>
      </div>
      <div className="w-full px-4">
         <div className="flex flex-warp py-2 mt-6 ">
            <span className="text-lg  text-green-mbk margin-auto font-bold">
            รายงานประวัติการแลกของรางวัล
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
                  <th
                    className={
                      "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-center bg-blueGray-50 text-blueGray-500 "
                    }
                  >
                    สถานะการส่ง
                  </th> 
                  <th
                    className={
                      "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-center bg-blueGray-50 text-blueGray-500 "
                    }
                  >
                    หมายเหตุเลขพัสดุ
                  </th>    
                  <th
                    className={
                      "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-center bg-blueGray-50 text-blueGray-500 "
                    }
                  >
                    ที่อยู่
                  </th>  
                  <th
                    className={
                      "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-center bg-blueGray-50 text-blueGray-500 "
                    }
                  >
                  </th>                        
                </tr>
              </thead>
              <tbody>
                {listCampaignExchange
                  .slice(pagesVisited, pagesVisited + usersPerPage)
                  .map(function (item, key) {
                    item.listNo = pagesVisited + key + 1;
                    return (
                      <tr key={key}>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 p-3 text-sm whitespace-nowrap text-center">
                          <span className="px-4 margin-a">
                            {item.listNo}
                          </span>
                        </td>
                        <td                         
                          className=" focus-within:border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-left cursor-pointer"
                        >
                          <span
                            title={item.redemptionName}
                            className="text-gray-mbk  hover:text-gray-mbk "
                          >
                            {item.redemptionName}
                          </span>
                          <span className="details">more info here</span>
                        </td>
                        <td                         
                          className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center cursor-pointer"
                        >
                          <span className="text-gray-mbk  hover:text-gray-mbk ">
                          { moment(item.startDate).format("DD/MM/YYYY")}
                          </span>
                        </td>
                        <td                         
                          className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center cursor-pointer"
                        >
                          <span className="text-gray-mbk  hover:text-gray-mbk ">
                          {moment(item.endDate).format("DD/MM/YYYY")}
                          </span>
                        </td>
                        <td                          
                          className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center cursor-pointer"
                        >
                          <span className="text-gray-mbk  hover:text-gray-mbk ">
                          {item.redemptionTypeStr}
                          </span>
                        </td>
                        <td                         
                          className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center cursor-pointer"
                        >
                          <span className="text-gray-mbk  hover:text-gray-mbk ">
                          {item.rewardTypeStr}
                          </span>
                        </td>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center ">
                          <span className="text-gray-mbk  hover:text-gray-mbk ">
                            {item.memberName}
                          </span>
                        </td>                       
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center">
                          <span className="text-gray-mbk  hover:text-gray-mbk ">
                            {item.phone}
                          </span>
                        </td>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center">
                          <span className="text-gray-mbk  hover:text-gray-mbk ">
                            {item.code}
                          </span>
                        </td>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center">
                          <span className="text-gray-mbk  hover:text-gray-mbk ">
                            {item.points}
                          </span>
                        </td>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center ">
                          {item.status}
                        </td>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center ">
                          {moment(item.redeemDate).format("DD/MM/YYYY")}
                        </td>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center ">
                           {/* {item.deliverStatus} */}
                           <div className="relative w-full mt-2 mb-2">
                            { item.isShowControl ?
                              <Select
                                id={key}
                                name="dropdown"
                                onChange={(e) => {
                                  editdeliverStatus(key, e.value);
                                }}                                
                                menuPortalTarget={document.body}
                                menuPosition="fixed"
                                className="border-0 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-32 ease-linear transition-all duration-150"
                                options={dropdown}
                                value={
                                  item.deliverStatus !== ""
                                    ? ValidateService.defaultValue(
                                        dropdown,
                                        item.deliverStatus
                                      )
                                    : ""
                                }
                                styles={UseStyleSelect}
                              /> : <div></div>
                            }
                            </div>
                        </td>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center ">
                        { (item.isShowControl) ?
                              item.isShowTKNo ?
                                <input
                                    type="text"
                                    className="border-0 px-2 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-32 ease-linear transition-all duration-150"
                                    id={key}
                                    name="lastName"
                                    maxLength={100}
                                    onBlur={() => {
                                      saveTrackingNo(key);
                                    }}
                                    onChange = {(e) => {
                                        editTrackingNo(key, e);
                                      }}
                                    value= {item.trackingNo}
                                    //autoComplete="lastName"
                                    // disabled={typePermission === "1" ? false : true}
                                  />
                                  :
                                  <div className="w-32 text-right" > {item.trackingNo} <i className="fa fa-pen mr-2" onClick={() => {showTrackingNo(key);}}></i></div>
                            :   <div></div>
                            }
                        </td>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0  border-r-0 text-sm whitespace-nowrap text-center ">
                          <i className="fa fa-home  mr-2 text-underline cursor-pointer" data-tip={item.address}> ดูที่อยู่</i>                          
                          <ReactTooltip globalEventOff="click" />
                        </td>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center ">
                          <i className="fa fa-clone mr-2 cursor-pointer" > คัดลอก </i>
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
                {pagesVisited + 10 > listCampaignExchange.length
                  ? listCampaignExchange.length
                  : pagesVisited + 10}{" "}
                {"/"}
                {listCampaignExchange.length} รายการ
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
