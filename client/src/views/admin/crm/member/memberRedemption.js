import React, { useEffect, useState, useRef } from "react";
import axios from "services/axios";
import "antd/dist/antd.css";
import ReactPaginate from "react-paginate";
import moment from "moment";
import "antd/dist/antd.css";
/* Service */
import Spinner from "components/Loadings/spinner/Spinner";

export default function MemberRedemption({
  memberId,
  textSearch,
  settextSearch,
}) {
  /* Set useState */
  const [listStore, setlistStore] = useState([]);
  const [listSearch, setListSerch] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const usersPerPage = 10;
  const pagesVisited = pageNumber * usersPerPage;
  const pageCount = Math.ceil(listStore.length / usersPerPage);
  const elementText = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setisLoadingData] = useState(false);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const InputSearch = (e) => {
    e = e.toLowerCase();
    if (e === "") {
      setlistStore(listSearch);
      settextSearch("");
    } else {
      settextSearch(e);
      setlistStore(
        listSearch.filter((x) => {
          if (
            x.CampaignName.toLowerCase().includes(e) ||
            (x.campaignType == "4"
              ? "แลกคูปอง"
              : x.campaignType == "5"
              ? "แลกของสมนาคุณ"
              : "เล่นเกมส์"
            )
              .toLowerCase()
              .includes(e) ||
            x.points.toString().includes(e) ||
            (e.expiredDate == null
              ? ""
              : moment(e.expiredDate).locale("th").format("DD/MM/YYYY")
            ).includes(e) ||
            (e.redeemDate == null
              ? ""
              : moment(e.redeemDate).locale("th").format("DD/MM/YYYY")
            ).includes(e) ||
            (e.code == null ? "" : e.code).toLowerCase().includes(e)
          ) {
            return x;
          }
        })
      );
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    axios
      .get(`members/getMemberpointsByMemberID/redemptionPoints/${memberId}`)
      .then((response) => {
        if (response.data.error) {
        } else {
          setlistStore(response.data.Campaign);
          setListSerch(response.data.Campaign);
        }
      })
      .finally(() => {
        setIsLoading(false);
        setisLoadingData(true);
      });
  };

  useEffect(() => {
    /* Default Value for Testing */
    fetchData();
  }, []);

  return (
    <>
      {isLoading ? <Spinner customText={"Loading"} /> : null}
      <div className="w-full">
        <div
          className={
            " py-4 relative flex flex-col min-w-0 break-words w-full mb-6 border rounded-b bg-white Overflow-list"
          }
        >
          <div className="rounded-t mb-0 px-4 py-3 border-0">
            <div className="w-full mx-autp items-center flex md:flex-nowrap flex-wrap ">
              <div className="w-full">
                <span className="z-3 h-full leading-snug font-normal text-center text-blueGray-300 absolute bg-transparent rounded text-base items-center justify-center pl-3 py-2">
                  <i className="fas fa-search"></i>
                </span>
                <input
                  type="text"
                  placeholder="Search here..."
                  className="border-0 pl-12 w-64 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded-xl text-sm shadow outline-none focus:outline-none focus:ring"
                  onChange={(e) => {
                    InputSearch(e.target.value);
                  }}
                  ref={elementText}
                />
              </div>
            </div>
          </div>
          <div className="block w-full overflow-x-auto  px-4 py-2">
            {/* Projects table */}
            <table className="items-center w-full border ">
              <thead>
                <tr>
                  <th
                    className={
                      "px-6 align-middle border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-center bg-blueGray-50 text-blueGray-500 w-8"
                    }
                  >
                    ลำดับที่
                  </th>
                  <th
                    className={
                      "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 "
                    }
                  >
                    ประเภทแคมเปญ
                  </th>
                  <th
                    className={
                      "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 "
                    }
                  >
                    ประเภทรางวัล
                  </th>
                  <th
                    className={
                      "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 "
                    }
                  >
                    Code
                  </th>
                  <th
                    className={
                      "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 "
                    }
                  >
                    คะแนน
                  </th>
                  <th
                    className={
                      "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 "
                    }
                  >
                    วันที่แลก
                  </th>
                </tr>
              </thead>
              <tbody>
                {listStore.length > 0 ? (
                  listStore
                    .slice(pagesVisited, pagesVisited + usersPerPage)
                    .map(function (value, key) {
                      return (
                        <tr key={key}>
                          <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 p-3 text-sm whitespace-nowrap text-center w-8">
                            <span className="px-4 margin-a">
                              {pagesVisited + key + 1}
                            </span>
                          </td>
                          <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-left cursor-pointer">
                            {value.CampaignName}
                          </td>
                          <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-left cursor-pointer">
                            {value.campaignType == "4"
                              ? "แลกคูปอง"
                              : value.campaignType == "5"
                              ? "แลกของสมนาคุณ"
                              : "เล่นเกมส์"}
                          </td>
                          <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-left cursor-pointer">
                            {value.code}
                          </td>
                          <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-left cursor-pointer">
                            {value.points}
                          </td>
                          <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-left cursor-pointer">
                            {moment(value.redeemDate).format("DD/MM/YYYY")}
                          </td>
                        </tr>
                      );
                    })
                ) : (
                  <tr>
                    {isLoadingData ? (
                      listSearch.length > 0 ? (
                        <td
                          colSpan="7"
                          className="text-center"
                          style={{ height: "100px" }}
                        >
                          {'ไม่มีข้อมูล "' +
                            elementText.current.value +
                            '" ในระบบ'}
                        </td>
                      ) : (
                        <td
                          colSpan="7"
                          className="text-center"
                          style={{ height: "100px" }}
                        >
                          ไม่มีข้อมูลในระบบ
                        </td>
                      )
                    ) : (
                      <td
                        colSpan="7"
                        className="text-center"
                        style={{ height: "100px" }}
                      >
                        ...Loading
                      </td>
                    )}
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-4">
            <div className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap ">
              <div
                className="lg:w-6/12 font-bold"
                style={{ alignSelf: "stretch" }}
              >
                {pagesVisited + 10 > listStore.length
                  ? listStore.length
                  : pagesVisited + 10}{" "}
                {"/"}
                {listStore.length} รายการ
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
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
