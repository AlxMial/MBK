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
import {
  customEcomStyles,
  customStylesMobile,
} from "assets/styles/theme/ReactModal";
/* Service */
import useWindowDimensions from "services/useWindowDimensions";
import ValidateService from "services/validateValue";

export default function PointEcommerce() {
  /* Set useState */
  const [Active, setActive] = useState("1");
  const [sale, setIsSale] = useState("1");
  const [score, setScore] = useState(0);
  const { height, width } = useWindowDimensions();
  const [listEcommerce, setListEcommerce] = useState([]);
  const [listSearch, setListSerch] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [isNew, setIsNew] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);
  const usersPerPage = 10;
  const pagesVisited = pageNumber * usersPerPage;
  const useStyle = customEcomStyles();
  const useStyleMobile = customStylesMobile();
  const pageCount = Math.ceil(listEcommerce.length / usersPerPage);
  const [langSymbo, setlangSymbo] = useState("");
  const { addToast } = useToasts();
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  /* Method Condition */
  const options = [
    { label: "Active", value: "1" },
    { label: "Inactive", value: "2" },
  ];

  const optionsSale = [
    { label: "ยอดซื้อ", value: "1" },
    { label: "สินค้าจากคลัง", value: "2" },
  ];

  function openModal(id) {
    if (id) {
      setIsNew(false);
    } else {
      // formik.resetForm();
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

  const InputSearch = (e) => {
    if (e === "") {
      setListEcommerce(listSearch);
    } else {
      setListEcommerce(
        listEcommerce.filter(
          (x) =>
            x.firstName.includes(e) ||
            x.lastName.includes(e) ||
            x.email.includes(e) ||
            x.phone.includes(e)
        )
      );
    }
  };

  /*พิมพ์เบอร์โทรศัพท์*/
  const onHandleScore = (e) => {
    if (
      ValidateService.onHandleNumberChange(e.target.value) !== "" ||
      e.target.value === ""
    ) {
      setScore(e.target.value);
      formik.values.score = e.target.value;
    }
  };

  /* formik */
  const formik = useFormik({
    initialValues: {
      id: "",
      pointEcommerceName: "",
      pointEcommercePrice: "",
      productId: "",
      pointEcommerceQuantity: "",
      pointEcommerceCode: "",
      startDate: new Date(),
      endDate: new Date(),
      isActive: false,
      isSale: false,
      isDeleted: false,
    },
    validationSchema: Yup.object({
      pointEcommerceName: Yup.string().required(
        Storage.GetLanguage() === "th"
          ? "* กรุณากรอก ชื่อแคมเปญ"
          : "* Please enter your Member Card"
      ),
      pointEcommerceCode: Yup.string().required(
        Storage.GetLanguage() === "th"
          ? "* กรุณากรอก รหัสแคมเปญ"
          : "* Please enter your First Name"
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
        axios.post("pointEcommerce", values).then((res) => {
          if (res.data.status) {
            formik.values.id = res.data.tbPointEcommerce.id;
            fetchData();
            addToast(
              Storage.GetLanguage() === "th"
                ? "บันทึกข้อมูลสำเร็จ"
                : "Save data successfully",
              { appearance: "success", autoDismiss: true }
            );
          } else {
            if (res.data.ispointEcommerceName) {
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
        axios.put("pointEcommerce", values).then((res) => {
          if (res.data.status) {
            formik.values.id = res.data.tbPointEcommerce.id;
            fetchData();
            addToast(
              Storage.GetLanguage() === "th"
                ? "บันทึกข้อมูลสำเร็จ"
                : "Save data successfully",
              { appearance: "success", autoDismiss: true }
            );
          } else {
            if (res.data.ispointEcommerceName) {
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
    axios.get("pointEcommerce").then((response) => {
      if (response.data.error) {
      } else {
        setListSerch(response.data.tbPointEcommerce);
      }
    });
  };

  useEffect(() => {
    /* Default Value for Testing */
  }, []);

  return (
    <>
      <div className="w-full">
        <div
          className={
            " py-4 relative flex flex-col min-w-0 break-words w-full mb-6 border rounded bg-white"
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
                  className="bg-lemon-mbk text-blueGray-600 active:bg-lemon-mbk font-bold  text-xs px-2 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none  ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => {
                    openModal();
                  }}
                >
                  <span className="text-sm px-2">เพิ่มคะแนน</span>
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
                                    <label>เพิ่มเงื่อนไขคะแนนสะสม</label>
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-wrap px-24">
                                <div
                                  className={
                                    "w-full lg:w-1/12 margin-auto-t-b" +
                                    (width < 1024 ? " px-4" : " ")
                                  }
                                >
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
                                    className="border-0 px-2 text-left py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded w-full  text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                                    id="pointEcommerceName"
                                    name="pointEcommerceName"
                                    maxLength={100}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.pointEcommerceName}
                                    autoComplete="pointEcommerceName"
                                  />
                                  {formik.touched.pointEcommerceName &&
                                  formik.errors.pointEcommerceName ? (
                                    <div className="text-sm pt-2 px-2 text-red-500">
                                      {formik.errors.pointEcommerceName}
                                    </div>
                                  ) : null}
                                </div>
                                <div
                                  className={
                                    "w-full lg:w-1/12 px-4 mb-2 mt-4" +
                                    (width < 1024 ? " hidden" : " block")
                                  }
                                >
                                  <label
                                    className="text-blueGray-600 text-sm font-bold mb-2"
                                    htmlFor="grid-password"
                                  ></label>
                                </div>
                                <div className={"w-full lg:w-11/12 px-4 mt-2 "}>
                                  <Radio.Group
                                    options={optionsSale}
                                    onChange={(e) => {
                                      setIsSale(e.target.value);
                                      formik.setFieldValue(
                                        "isSale",
                                        e.target.value
                                      );
                                    }}
                                    value={sale}
                                  />
                                </div>
                                <div
                                  className={
                                    "w-full lg:w-1/12 margin-auto-t-b" +
                                    (width < 1024 ? " px-4" : " ")
                                  }
                                >
                                  <label
                                    className="text-blueGray-600 text-sm font-bold "
                                    htmlFor="grid-password"
                                  ></label>
                                </div>
                                <div className="w-full lg:w-11/12 px-4 margin-auto-t-b">
                                  <input
                                    type="text"
                                    className="border-0 px-2 text-left py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded w-11/12 text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                                    id="pointEcommerceSymbol"
                                    name="pointEcommerceSymbol"
                                    maxLength={100}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.pointEcommerceSymbol}
                                    autoComplete="pointEcommerceSymbol"
                                  />
                                  <span
                                    className="text-blueGray-600 text-sm font-bold pl-4 "
                                    htmlFor="grid-password"
                                  >
                                    บาท
                                  </span>
                                </div>
                                <div className={"w-full mb-4"}></div>
                                <div
                                  className={
                                    "w-full lg:w-1/12 margin-auto-t-b" +
                                    (width < 1024 ? " px-4" : " ")
                                  }
                                >
                                  <label
                                    className="text-blueGray-600 text-sm font-bold "
                                    htmlFor="grid-password"
                                  ></label>
                                </div>
                                <div className="w-full lg:w-11/12 px-4 margin-auto-t-b">
                                  <input
                                    type="text"
                                    className="border-0 px-2 text-right py-1 placeholder-blueGray-300 text-blueGray-600 bg-white rounded w-6-7/12 text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                                    id="pointEcommerceLengthSymbol"
                                    name="pointEcommerceLengthSymbol"
                                    maxLength={100}
                                    onChange={(event) => {
                                      setlangSymbo(
                                        ValidateService.onHandleScore(event)
                                      );
                                      formik.values.pointEcommerceLengthSymbol =
                                        ValidateService.onHandleScore(event);
                                    }}
                                    onBlur={formik.handleBlur}
                                    autoComplete="pointEcommerceLengthSymbol"
                                    value={formik.values.pointEcommerceLengthSymbol}
                                  />
                                  <span
                                    className="text-blueGray-600 text-sm font-bold px-4 "
                                    htmlFor="grid-password"
                                  >
                                    จำนวน
                                  </span>
                                  <div
                                    className={
                                      "w-full mb-4" +
                                      (width < 1024 ? " block" : " hidden")
                                    }
                                  ></div>
                                  <input
                                    type="text"
                                    className="border-0 px-2 text-right py-1 placeholder-blueGray-300 text-blueGray-600 bg-white rounded w-3-3/12 text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                                    id="pointEcommerceLengthSymbol"
                                    name="pointEcommerceLengthSymbol"
                                    maxLength={100}
                                    onChange={(event) => {
                                      setlangSymbo(
                                        ValidateService.onHandleScore(event)
                                      );
                                      formik.values.pointEcommerceLengthSymbol =
                                        ValidateService.onHandleScore(event);
                                    }}
                                    onBlur={formik.handleBlur}
                                    autoComplete="pointEcommerceLengthSymbol"
                                    value={formik.values.pointEcommerceLengthSymbol}
                                  />
                                  <span
                                    className="text-blueGray-600 text-sm font-bold pl-4 "
                                    htmlFor="grid-password"
                                  >
                                    ชิ้น
                                  </span>
                                </div>
                                <div className={"w-full mb-4"}></div>
                                <div
                                  className={
                                    "w-full lg:w-1/12 margin-auto-t-b" +
                                    (width < 1024 ? " px-4" : " ")
                                  }
                                >
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
                                    id="pointEcommerceQuantityCode"
                                    name="pointEcommerceQuantityCode"
                                    maxLength={100}
                                    onChange={(event) => {
                                      setlangSymbo(
                                        ValidateService.onHandleScore(event)
                                      );
                                      formik.values.pointEcommerceQuantityCode =
                                        ValidateService.onHandleScore(event);
                                    }}
                                    onBlur={formik.handleBlur}
                                    autoComplete="pointEcommerceQuantityCode"
                                    value={formik.values.pointEcommerceQuantityCode}
                                  />
                                  {formik.touched.pointEcommerceQuantityCode &&
                                  formik.errors.pointEcommerceQuantityCode ? (
                                    <div className="text-sm py-2 px-2 text-red-500">
                                      {formik.errors.pointEcommerceQuantityCode}
                                    </div>
                                  ) : null}
                                </div>
                                <div className="w-full mb-4"></div>
                                <div
                                  className={
                                    "w-full lg:w-1/12 margin-auto-t-b" +
                                    (width < 1024 ? " px-4" : " ")
                                  }
                                >
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
                                          paddingTop: "0.5rem",
                                          paddingBottom: "0.5rem",
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
                                <div
                                  className={
                                    "w-full lg:w-1/12 margin-auto-t-b  px-4"
                                  }
                                >
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
                                        paddingTop: "0.5rem",
                                        paddingBottom: "0.5rem",
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
                                <div className="w-full lg:w-1/12 px-4 mb-2">
                                  <label
                                    className="text-blueGray-600 text-sm font-bold mb-2"
                                    htmlFor="grid-password"
                                  ></label>
                                </div>
                                <div className={"w-full lg:w-11/12 px-4 mt-2"}>
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
                      "px-6 align-middle border w-5 border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-center bg-blueGray-50 text-blueGray-500 "
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
                    การสะสมแต้ม
                  </th>
                  <th
                    className={
                      "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-center bg-blueGray-50 text-blueGray-500 "
                    }
                  >
                    จำนวนคะแนน (Point)
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
                    วันที่สมัคร
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
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody>
                {listEcommerce
                  .slice(pagesVisited, pagesVisited + usersPerPage)
                  .map(function (value, key) {
                    return (
                      <tr key={key}>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 p-3 text-sm whitespace-nowrap text-center">
                          <span className="px-4 margin-a">{key + 1}</span>
                        </td>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center cursor-pointer"></td>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center cursor-pointer"></td>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center cursor-pointer"></td>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center cursor-pointer"></td>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center "></td>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center "></td>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center">
                          0
                        </td>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center"></td>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center"></td>
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
