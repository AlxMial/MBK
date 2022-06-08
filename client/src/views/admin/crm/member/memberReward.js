import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "services/axios";
import { useToasts } from "react-toast-notifications";
import "antd/dist/antd.css";
import ReactPaginate from "react-paginate";
import moment from "moment";
import "antd/dist/antd.css";
import Modal from "react-modal";
import { Radio, DatePicker, Space, ConfigProvider } from "antd";
import locale from "antd/lib/locale/th_TH";
import * as Storage from "../../../../services/Storage.service";
import ConfirmDialog from "components/ConfirmDialog/ConfirmDialog";
import {
  customEcomStyles,
  customStylesMobile,
} from "assets/styles/theme/ReactModal";
/* Service */
import useWindowDimensions from "services/useWindowDimensions";
import ValidateService from "services/validateValue";

export default function MemberReward({ memberId }) {
  /* Set useState */
  const [Active, setActive] = useState("1");
  const [score, setScore] = useState(0);
  const { height, width } = useWindowDimensions();
  const [listReward, setlistReward] = useState([]);
  const [listSearch, setListSerch] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [isNew, setIsNew] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);
  const usersPerPage = 10;
  const pagesVisited = pageNumber * usersPerPage;
  const useStyle = customEcomStyles();
  const useStyleMobile = customStylesMobile();
  const pageCount = Math.ceil(listReward.length / usersPerPage);
  const [langSymbo, setlangSymbo] = useState("");
  const [deleteValue, setDeleteValue] = useState("");
  const [modalIsOpenSubject, setIsOpenSubject] = useState(false);
  const { addToast } = useToasts();
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const fetchData = async () => {
    axios.get(`memberPoint/reward/${memberId}`).then((response) => {
      if (response.data.error) {
      } else {
        setlistReward(response.data.tbReward);
        setListSerch(response.data.tbReward);
      }
    });
  };

  const InputSearch = (e) => {
    e = e.toLowerCase();
    if (e === "") {
      setlistReward(listSearch);
    } else {
      setlistReward(
        listSearch.filter((x) => x.pointStoreName.toLowerCase().includes(e))
      );
    }
  };

  useEffect(() => {
    /* Default Value for Testing */
    fetchData();
  }, []);

  return (
    <>
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
                    แคมเปญ
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
                    วันที่แลก
                  </th>
                  <th
                    className={
                      "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-center bg-blueGray-50 text-blueGray-500 "
                    }
                  >
                    วันที่หมดอายุ
                  </th>
                </tr>
              </thead>
              <tbody>
                {listReward
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
                          {(value.tbPointCodeHD !== null) ? value.tbPointCodeHD.pointCodeName : "ลงทะเบียน"}
                        </td>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center cursor-pointer">
                          {value.campaignType === "1" ? "Code" : "E-Commerce"}
                        </td>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center cursor-pointer">
                          {value.code}
                        </td>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center cursor-pointer">
                          {value.point}
                        </td>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center cursor-pointer">
                          {moment(value.redeemDate).format("DD/MM/YYYY")}
                        </td>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center cursor-pointer">
                          {moment(new Date(value.expireDate)-1).format("DD/MM/YYYY")}
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
                {pagesVisited + 10 > listReward.length
                  ? listReward.length
                  : pagesVisited + 10}{" "}
                {"/"}
                {listReward.length} รายการ
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
