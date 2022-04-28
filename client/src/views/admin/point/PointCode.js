import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "services/axios";
import { useToasts } from "react-toast-notifications";
import "antd/dist/antd.css";
import ReactPaginate from "react-paginate";
import moment from "moment";
import { Radio, DatePicker, Space, ConfigProvider } from "antd";
import locale from "antd/lib/locale/th_TH";
import Modal from "react-modal";
import {
  customStyles,
  customStylesMobile,
} from "assets/styles/theme/ReactModal";
/* Service */
import useWindowDimensions from "services/useWindowDimensions";
import ValidateService from "services/validateValue";
import * as Storage from "../../../services/Storage.service";
import ConfirmDialog from "components/ConfirmDialog/ConfirmDialog";
Modal.setAppElement("#root");

export default function PointCode() {
  /* Set useState */
  const [Active, setActive] = useState("1");
  const [score, setScore] = useState(0);
  const [isNew, setIsNew] = useState(0);
  const { height, width } = useWindowDimensions();
  const [listPointCode, setListPointCode] = useState([]);
  const [langSymbo, setlangSymbo] = useState("");
  const [listSearch, setListSerch] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const usersPerPage = 10;
  const pagesVisited = pageNumber * usersPerPage;
  const [modalIsOpen, setIsOpen] = useState(false);
  const pageCount = Math.ceil(listPointCode.length / usersPerPage);
  const [modalIsOpenSubject, setIsOpenSubject] = useState(false);
  const useStyle = customStyles();
  const useStyleMobile = customStylesMobile();
  const { addToast } = useToasts();

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  function openModal(id) {
    if (id) {
      fetchDataById(id);
      setIsNew(false);
    } else {
      formik.resetForm();
      setIsNew(true);
    }
    setIsOpen(true);
  }

  function afterOpenModal(type) {
    // references are now sync'd and can be accessed.
  }

  function closeModal() {
    setIsOpen(false);
  }

  /* Modal */
  function openModalSubject() {
    setIsOpenSubject(true);
  }

  function closeModalSubject() {
    setIsOpenSubject(false);
  }

  /* Method Condition */
  const options = [
    { label: "Active", value: "1" },
    { label: "Inactive", value: "2" },
  ];

  const InputSearch = (e) => {
    if (e === "") {
      setListPointCode(listSearch);
    } else {
      setListPointCode(
        listPointCode.filter(
          (x) =>
            x.firstName.includes(e) ||
            x.lastName.includes(e) ||
            x.email.includes(e) ||
            x.phone.includes(e)
        )
      );
    }
  };

  /* formik */
  const formik = useFormik({
    initialValues: {
      id: "",
      pointCodeName: "",
      pointCodeSymbol: "",
      pointCodeLengthSymbol: "",
      pointCodePoint: "",
      pointCodeQuantityCode: "",
      startDate: new Date(),
      endDate: new Date(),
      isActive: false,
      isDeleted: false,
    },
    validationSchema: Yup.object({
      pointCodeName: Yup.string().required(
        Storage.GetLanguage() === "th"
          ? "* กรุณากรอก ชื่อแคมเปญ"
          : "* Please enter your Member Card"
      ),
      pointCodeSymbol: Yup.string().required(
        Storage.GetLanguage() === "th"
          ? "* กรุณากรอก รหัสแคมเปญ"
          : "* Please enter your First Name"
      ),
      pointCodeLengthSymbol: Yup.string().required(
        Storage.GetLanguage() === "th"
          ? "* กรุณากรอก จำนวนตัวอักษร"
          : "* Please enter your Last Name"
      ),
      pointCodePoint: Yup.string().required(
        Storage.GetLanguage() === "th"
          ? "* กรุณากรอก วันที่สมัคร"
          : "* Please enter your Register Date"
      ),
      pointCodeQuantityCode: Yup.string().required(
        Storage.GetLanguage() === "th"
          ? "* กรุณากรอก วันที่สมัคร"
          : "* Please enter your Register Date"
      ),
      startDate: Yup.string().required(
        Storage.GetLanguage() === "th"
          ? "* กรุณากรอก วันที่สมัคร"
          : "* Please enter your Register Date"
      ),
      endDate: Yup.string().required(
        Storage.GetLanguage() === "th"
          ? "* กรุณากรอก วันที่สมัคร"
          : "* Please enter your Register Date"
      ),
    }),
    onSubmit: (values) => {
      if (isNew) {
        axios.post("pointCode", values).then((res) => {
          if (res.data.status) {
            formik.values.id = res.data.tbPointCodeHD.id;
            fetchData();
            addToast(
              Storage.GetLanguage() === "th"
                ? "บันทึกข้อมูลสำเร็จ"
                : "Save data successfully",
              { appearance: "success", autoDismiss: true }
            );
          } else {
            if (res.data.isPointCodeName) {
              addToast(
                "บันทึกข้อมูลไม่สำเร็จ เนื่องจากชื่อแคมเปญเคยมีการลงทะเบียนไว้เรียบร้อยแล้ว",
                {
                  appearance: "warning",
                  autoDismiss: true,
                }
              );
            }
          }
        });
      } else {
        console.log(values)
        axios.put("pointCode", values).then((res) => {
          console.log(res)
          if (res.data.status) {
            formik.values.id = res.data.tbPointCodeHD.id;
            fetchData();
            addToast(
              Storage.GetLanguage() === "th"
                ? "บันทึกข้อมูลสำเร็จ"
                : "Save data successfully",
              { appearance: "success", autoDismiss: true }
            );
          } else {
            if (res.data.isPointCodeName) {
              addToast(
                "บันทึกข้อมูลไม่สำเร็จ เนื่องจากชื่อแคมเปญเคยมีการลงทะเบียนไว้เรียบร้อยแล้ว",
                {
                  appearance: "warning",
                  autoDismiss: true,
                }
              );
            }
          }
        });
      }
    },
  });

  const fetchData = async () => {
    axios.get("pointCode").then((response) => {
      if (response.data.error) {
      } else {
        setListPointCode(response.data.tbPointCodeHD);
        setListSerch(response.data.tbPointCodeHD);
      }
    });
  };

  const fetchDataById = async (id) => {
    let response = await axios.get(`/pointCode/byId/${id}`);
    let pointCode = await response.data.tbPointCodeHD;
    if (pointCode !== null) {
      for (var columns in response.data.tbPointCodeHD) {
        if (columns === "isActive") {
          console.log(response.data.tbPointCodeHD[columns].toString());
          setActive(response.data.tbPointCodeHD[columns].toString());
        }
        formik.setFieldValue(
          columns,
          response.data.tbPointCodeHD[columns],
          false
        );
      }
    }
  };

  const deleteUser = (e) => {
    axios.delete(`/pointCode/${e}`).then(() => {
      setListPointCode(
        listPointCode.filter((val) => {
          return val.id !== e;
        })
      );
      closeModalSubject();
    });
  };

  const DefaultValue = () => {
    formik.setFieldValue("isActive", Active);
    formik.setFieldValue("pointCodeName", "MBK-0001");
    formik.setFieldValue("pointCodeSymbol", "MBK");
    formik.setFieldValue("pointCodeQuantityCode", 1000);
    formik.setFieldValue("pointCodeLengthSymbol", 16);
    formik.setFieldValue("pointCodePoint", 10);
    formik.values.startDate =
      formik.values.startDate === ""
        ? new moment(new Date()).toDate()
        : formik.values.startDate;
    formik.values.endDate =
      formik.values.endDate === ""
        ? new moment(new Date()).toDate()
        : formik.values.endDate;
  };

  useEffect(() => {
    /* Default Value for Testing */

    //DefaultValue();
    fetchData();
  }, []);

  return (
    <>
      <div className="w-full">
        <div
          className={
            "relative flex flex-col min-w-0 break-words w-full mb-6 border rounded bg-white  px-4 py-4"
          }
        >
          <div className="rounded-t mb-0 px-4 py-3 border-0">
            <div className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap ">
              <div className="lg:w-6/12">
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
              <div className="lg:w-6/12 text-right">
                <button
                  className="bg-lemon-mbk text-blueGray-600  mr-2 active:bg-lemon-mbk font-bold  text-xs px-2 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none  ease-linear transition-all duration-150"
                  type="button"
                >
                  <span className="= text-sm px-2">Import</span>
                </button>
                <button
                  className="bg-lemon-mbk text-blueGray-600 active:bg-lemon-mbk font-bold  text-xs px-2 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none  ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => {
                    openModal();
                  }}
                >
                  <span className=" text-sm px-2">เพิ่มแคมเปญ</span>
                </button>
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
                            <form onSubmit={formik.handleSubmit}>
                              <div className="relative w-full mb-3">
                                <div className=" align-middle  mb-3">
                                  <div className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-base text-green-mbk font-bold whitespace-nowrap p-4">
                                    <label>เพิ่มแคมเปญ</label>
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-wrap px-24">
                                <div className="w-full lg:w-1/12 px-4  margin-auto-t-b">
                                  <label
                                    className="text-blueGray-600 text-sm font-bold "
                                    htmlFor="grid-password"
                                  >
                                    ชื่อแคมเปญ
                                  </label>
                                  <span className="text-sm ml-2 text-red-500">
                                    *
                                  </span>
                                </div>
                                <div className="w-full lg:w-11/12 px-4 margin-auto-t-b">
                                  <input
                                    type="text"
                                    className="border-0 px-2 text-left py-1 placeholder-blueGray-300 text-blueGray-600 bg-white rounded w-full text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                                    id="pointCodeName"
                                    name="pointCodeName"
                                    maxLength={100}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.pointCodeName}
                                    autoComplete="pointCodeName"
                                  />
                                  {formik.touched.pointCodeName &&
                                  formik.errors.pointCodeName ? (
                                    <div className="text-sm py-2 px-2 text-red-500">
                                      {formik.errors.pointCodeName}
                                    </div>
                                  ) : null}
                                </div>
                                <div className="w-full mb-4"></div>
                                <div className="w-full lg:w-1/12 px-4  margin-auto-t-b">
                                  <label
                                    className="text-blueGray-600 text-sm font-bold "
                                    htmlFor="grid-password"
                                  >
                                    รหัสแคมเปญ
                                  </label>
                                  <span className="text-sm ml-2 text-red-500">
                                    *
                                  </span>
                                </div>
                                <div className="w-full lg:w-5/12 px-4 margin-auto-t-b">
                                  <input
                                    type="text"
                                    className="border-0 px-2 text-right py-1 placeholder-blueGray-300 text-blueGray-600 bg-white rounded w-full text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                                    id="pointCodeSymbol"
                                    name="pointCodeSymbol"
                                    maxLength={100}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.pointCodeSymbol}
                                    autoComplete="pointCodeSymbol"
                                  />
                                  {formik.touched.pointCodeSymbol &&
                                  formik.errors.pointCodeSymbol ? (
                                    <div className="text-sm py-2 px-2 text-red-500">
                                      {formik.errors.pointCodeSymbol}
                                    </div>
                                  ) : null}
                                </div>
                                <div
                                  className={
                                    "w-full mb-4" +
                                    (width < 1024 ? " block" : " hidden")
                                  }
                                ></div>
                                <div className="w-full lg:w-1/12 px-4  margin-auto-t-b">
                                  <label
                                    className="text-blueGray-600 text-sm font-bold "
                                    htmlFor="grid-password"
                                  >
                                    จำนวนตัวอักษร
                                  </label>
                                  <span className="text-sm ml-2 text-red-500">
                                    *
                                  </span>
                                </div>
                                <div className="w-full lg:w-5/12 px-4 margin-auto-t-b">
                                  <input
                                    type="text"
                                    className="border-0 px-2 text-right py-1 placeholder-blueGray-300 text-blueGray-600 bg-white rounded w-full text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                                    id="pointCodeLengthSymbol"
                                    name="pointCodeLengthSymbol"
                                    maxLength={100}
                                    onChange={(event) => {
                                      setlangSymbo(
                                        ValidateService.onHandleScore(event)
                                      );
                                      formik.values.pointCodeLengthSymbol =
                                        ValidateService.onHandleScore(event);
                                    }}
                                    onBlur={formik.handleBlur}
                                    autoComplete="pointCodeLengthSymbol"
                                    value={formik.values.pointCodeLengthSymbol}
                                  />
                                  {formik.touched.pointCodeLengthSymbol &&
                                  formik.errors.pointCodeLengthSymbol ? (
                                    <div className="text-sm py-2 px-2 text-red-500">
                                      {formik.errors.pointCodeLengthSymbol}
                                    </div>
                                  ) : null}
                                </div>
                                <div className={"w-full mb-4"}></div>
                                <div className="w-full lg:w-1/12 px-4  margin-auto-t-b">
                                  <label
                                    className="text-blueGray-600 text-sm font-bold "
                                    htmlFor="grid-password"
                                  >
                                    จำนวนคะแนน
                                  </label>
                                  <span className="text-sm ml-2 text-red-500">
                                    *
                                  </span>
                                </div>
                                <div className="w-full lg:w-5/12 px-4 margin-auto-t-b">
                                  <input
                                    type="text"
                                    className="border-0 px-2 text-right py-1 placeholder-blueGray-300 text-blueGray-600 bg-white rounded w-full text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                                    id="pointCodePoint"
                                    name="pointCodePoint"
                                    maxLength={100}
                                    onChange={(event) => {
                                      setlangSymbo(
                                        ValidateService.onHandleScore(event)
                                      );
                                      formik.values.pointCodePoint =
                                        ValidateService.onHandleScore(event);
                                    }}
                                    onBlur={formik.handleBlur}
                                    autoComplete="pointCodePoint"
                                    value={formik.values.pointCodePoint}
                                  />
                                  {formik.touched.pointCodePoint &&
                                  formik.errors.pointCodePoint ? (
                                    <div className="text-sm py-2 px-2 text-red-500">
                                      {formik.errors.pointCodePoint}
                                    </div>
                                  ) : null}
                                </div>
                                <div className={"w-full mb-4"}></div>
                                <div className="w-full lg:w-1/12 px-4  margin-auto-t-b">
                                  <label
                                    className="text-blueGray-600 text-sm font-bold "
                                    htmlFor="grid-password"
                                  >
                                    จำนวน Code
                                  </label>
                                  <span className="text-sm ml-2 text-red-500">
                                    *
                                  </span>
                                </div>
                                <div className="w-full lg:w-5/12 px-4 margin-auto-t-b">
                                  <input
                                    type="text"
                                    className="border-0 px-2 text-right py-1 placeholder-blueGray-300 text-blueGray-600 bg-white rounded w-full text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                                    id="pointCodeQuantityCode"
                                    name="pointCodeQuantityCode"
                                    maxLength={100}
                                    onChange={(event) => {
                                      setlangSymbo(
                                        ValidateService.onHandleScore(event)
                                      );
                                      formik.values.pointCodeQuantityCode =
                                        ValidateService.onHandleScore(event);
                                    }}
                                    onBlur={formik.handleBlur}
                                    autoComplete="pointCodeQuantityCode"
                                    value={formik.values.pointCodeQuantityCode}
                                  />
                                  {formik.touched.pointCodeQuantityCode &&
                                  formik.errors.pointCodeQuantityCode ? (
                                    <div className="text-sm py-2 px-2 text-red-500">
                                      {formik.errors.pointCodeQuantityCode}
                                    </div>
                                  ) : null}
                                </div>
                                <div className="w-full mb-4"></div>
                                <div className="w-full lg:w-1/12 px-4  margin-auto-t-b">
                                  <label
                                    className="text-blueGray-600 text-sm font-bold "
                                    htmlFor="grid-password"
                                  >
                                    วันที่เริ่มต้น
                                  </label>
                                  <span className="text-sm ml-2 text-red-500">
                                    *
                                  </span>
                                </div>
                                <div className="w-full lg:w-5/12 px-4 margin-auto-t-b">
                                  <div className="relative">
                                    <ConfigProvider locale={locale}>
                                      <DatePicker
                                        format={"DD/MM/yyyy"}
                                        placeholder="เลือกวันที่"
                                        showToday={false}
                                        defaultValue={moment(
                                          new Date(),
                                          "DD/MM/YYYY"
                                        )}
                                        style={{
                                          height: "100%",
                                          width: "100%",
                                          borderRadius: "0.25rem",
                                          cursor: "pointer",
                                          margin: "0px",
                                          paddingTop: "0.25rem",
                                          paddingBottom: "0.25rem",
                                          paddingLeft: "0.5rem",
                                          paddingRight: "0.5rem",
                                        }}
                                        onChange={(e) => {
                                          if (e === null) {
                                            formik.setFieldValue(
                                              "startDate",
                                              new Date(),
                                              false
                                            );
                                          } else {
                                            formik.setFieldValue(
                                              "startDate",
                                              moment(e).toDate(),
                                              false
                                            );
                                          }
                                        }}
                                        value={moment(
                                          new Date(formik.values.startDate),
                                          "DD/MM/YYYY"
                                        )}
                                      />
                                    </ConfigProvider>
                                    {formik.touched.startDate &&
                                    formik.errors.startDate ? (
                                      <div className="text-sm py-2 px-2 text-red-500">
                                        {formik.errors.startDate}
                                      </div>
                                    ) : null}
                                  </div>
                                </div>
                                <div
                                  className={
                                    "w-full mb-4" +
                                    (width < 1024 ? " block" : " hidden")
                                  }
                                ></div>
                                <div className="w-full lg:w-1/12 px-4  margin-auto-t-b">
                                  <label
                                    className="text-blueGray-600 text-sm font-bold "
                                    htmlFor="grid-password"
                                  >
                                    วันที่สิ้นสุด
                                  </label>
                                  <span className="text-sm ml-2 text-red-500">
                                    *
                                  </span>
                                </div>

                                <div className="w-full lg:w-5/12 px-4 margin-auto-t-b">
                                  <ConfigProvider locale={locale}>
                                    <DatePicker
                                      format={"DD/MM/yyyy"}
                                      placeholder="เลือกวันที่"
                                      showToday={false}
                                      defaultValue={moment(
                                        new Date(),
                                        "DD/MM/YYYY"
                                      )}
                                      style={{
                                        height: "100%",
                                        width: "100%",
                                        borderRadius: "0.25rem",
                                        cursor: "pointer",
                                        margin: "0px",
                                        paddingTop: "0.25rem",
                                        paddingBottom: "0.25rem",
                                        paddingLeft: "0.5rem",
                                        paddingRight: "0.5rem",
                                      }}
                                      onChange={(e) => {
                                        if (e === null) {
                                          formik.setFieldValue(
                                            "endDate",
                                            new Date(),
                                            false
                                          );
                                        } else {
                                          formik.setFieldValue(
                                            "endDate",
                                            moment(e).toDate(),
                                            false
                                          );
                                        }
                                      }}
                                      value={moment(
                                        new Date(formik.values.endDate),
                                        "DD/MM/YYYY"
                                      )}
                                    />
                                  </ConfigProvider>
                                  {formik.touched.endDate &&
                                  formik.errors.endDate ? (
                                    <div className="text-sm py-2 px-2 text-red-500">
                                      {formik.errors.endDate}
                                    </div>
                                  ) : null}
                                </div>
                                <div className="w-full lg:w-1/12 px-4 mb-2 mt-4">
                                  <label
                                    className="text-blueGray-600 text-sm font-bold mb-2"
                                    htmlFor="grid-password"
                                  ></label>
                                </div>
                                <div
                                  className={
                                    "w-full lg:w-11/12 px-4 " +
                                    (width < 1024 ? " " : "  mb-4 mt-4")
                                  }
                                >
                                  <Radio.Group
                                    options={options}
                                    onChange={(e) => {
                                      setActive(e.target.value);
                                      formik.setFieldValue(
                                        "isActive",
                                        e.target.value
                                      );
                                    }}
                                    value={Active}
                                  />
                                </div>
                              </div>
                              <div className="relative w-full mb-3">
                                <div className=" flex justify-between align-middle ">
                                  <div></div>
                                  <div className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4">
                                    <button
                                      className="bg-rose-mbk text-white active:bg-rose-mbk font-bold uppercase text-sm px-2 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                                      type="button"
                                      onClick={() => {
                                        closeModal();
                                      }}
                                    >
                                      ย้อนกลับ
                                    </button>
                                    <button
                                      className={
                                        "bg-gold-mbk text-white active:bg-gold-mbk font-bold uppercase text-sm px-2 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                                      }
                                      type="submit"
                                    >
                                      บันทึกข้อมูล
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>
                      </>
                    </div>
                  </div>
                </Modal>
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
                      "px-6 align-middle border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-center bg-blueGray-50 text-blueGray-500 "
                    }
                  >
                    ลำดับที่
                  </th>
                  <th
                    className={
                      "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-center bg-blueGray-50 text-blueGray-500 "
                    }
                  >
                    ชื่อแคมเปญ
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
                    สถานะ
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
                    จำนวนการใช้
                  </th>
                  <th
                    className={
                      "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-center bg-blueGray-50 text-blueGray-500 "
                    }
                  >
                    Export
                  </th>
                  <th
                    className={
                      "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-center bg-blueGray-50 text-blueGray-500 "
                    }
                  >
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody>
                {listPointCode
                  .slice(pagesVisited, pagesVisited + usersPerPage)
                  .map(function (value, key) {
                    return (
                      <tr key={key}>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 p-3 text-sm whitespace-nowrap text-center">
                          <span className="px-4 margin-a">{key + 1}</span>
                        </td>
                        <td
                          onClick={() => {
                            openModal(value.id);
                          }}
                          className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center cursor-pointer"
                        >
                          <span className="text-gray-mbk  hover:text-gray-mbk ">
                            {value.pointCodeName}
                          </span>
                        </td>
                        <td
                          onClick={() => {
                            openModal(value.id);
                          }}
                          className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center cursor-pointer"
                        >
                          <span className="text-gray-mbk  hover:text-gray-mbk ">
                            {value.pointCodeSymbol}
                          </span>
                        </td>
                        <td
                          onClick={() => {
                            openModal(value.id);
                          }}
                          className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center cursor-pointer"
                        >
                          <span className="text-gray-mbk  hover:text-gray-mbk ">
                            {value.pointCodePoint}
                          </span>
                        </td>
                        <td
                          onClick={() => {
                            openModal(value.id);
                          }}
                          className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center cursor-pointer"
                        >
                          <span className="text-gray-mbk  hover:text-gray-mbk ">
                            {moment(value.startDate).format("DD/MM/YYYY")}
                          </span>
                        </td>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center ">
                          <span className="text-gray-mbk  hover:text-gray-mbk ">
                            {moment(value.endDate).format("DD/MM/YYYY")}
                          </span>
                        </td>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center ">
                          {value.isActive ? "Active" : "Inactive"}
                        </td>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center">
                          <span className="text-gray-mbk  hover:text-gray-mbk ">
                            {value.pointCodeQuantityCode}
                          </span>
                        </td>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center">
                          <span className="text-gray-mbk  hover:text-gray-mbk ">
                            0
                          </span>
                        </td>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center">
                          <span className="text-gray-mbk  hover:text-gray-mbk ">
                            {value.pointCodeLengthSymbol}
                          </span>
                        </td>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center">
                          <i
                            className="fas fa-trash text-red-500 cursor-pointer"
                            onClick={() => {
                              openModalSubject();
                            }}
                          ></i>
                          <ConfirmDialog
                            showModal={modalIsOpenSubject}
                            message={
                              Storage.GetLanguage() === "th"
                                ? "จัดการข้อมูลผู้ใช้"
                                : "Users Management"
                            }
                            hideModal={() => {
                              closeModalSubject();
                            }}
                            confirmModal={() => {
                              deleteUser(value.id);
                            }}
                          />
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
          <div className="py-4">
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
    </>
  );
}
