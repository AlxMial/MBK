import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "services/axios";
import { useToasts } from "react-toast-notifications";
import "antd/dist/antd.css";
import ReactPaginate from "react-paginate";
import moment from "moment";
import "antd/dist/antd.css";
import Modal from "react-modal";
import { Radio, DatePicker, ConfigProvider } from "antd";
import locale from "antd/lib/locale/th_TH";
import * as Storage from "../../../../services/Storage.service";
import {
  customEcomStyles,
  customStylesMobile,
} from "assets/styles/theme/ReactModal";
/* Service */
import useWindowDimensions from "services/useWindowDimensions";
import ValidateService from "services/validateValue";
import { useDispatch } from "react-redux";
import { fetchLoading, fetchSuccess } from "redux/actions/common";
import Select from "react-select";
import { styleSelect } from "assets/styles/theme/ReactSelect.js";
import ConfirmDialog from "components/ConfirmDialog/ConfirmDialog";
import ConfirmEdit from "components/ConfirmDialog/ConfirmEdit";

export default function PointEcommerce() {
  /* Set useState */
  const [Active, setActive] = useState("1");
  const [sale, setIsSale] = useState("1");
  const { width } = useWindowDimensions();
  const [listEcommerce, setListEcommerce] = useState([]);
  const [listSearch, setListSerch] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [isNew, setIsNew] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);
  const [forcePage, setForcePage] = useState(0);
  const usersPerPage = 10;
  const pagesVisited = pageNumber * usersPerPage;
  const useStyle = customEcomStyles();
  const useStyleMobile = customStylesMobile();
  const pageCount = Math.ceil(listEcommerce.length / usersPerPage) || 1;
  const [errorStartDate, setErrorStartDate] = useState(false);
  const [errorEndDate, setErrorEndDate] = useState(false);
  const [errorDate, setErrorDate] = useState(false);
  const [langSymbo, setlangSymbo] = useState("");
  const [errorPoint, setErrorPoint] = useState(false);
  const [errorUnitProduct, setErrorUnitProduct] = useState(false);
  const [errorPrice, setErrorPrice] = useState(false);
  const [startDateCode, setStartDateCode] = useState("");
  const [endDateCode, setEndDateCode] = useState("");
  const [listProduct, setListProduct] = useState([]);
  const [isChange, setIsChange] = useState(false);
  const [delay, setDelay] = useState("");
  const { addToast } = useToasts();
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };
  const dispatch = useDispatch();
  const UseStyleSelect = styleSelect();
  const [modalIsOpenSubject, setIsOpenSubject] = useState(false);
  const [deleteValue, setDeleteValue] = useState("");
  const [modalIsOpenEdit, setIsOpenEdit] = useState(false);
  const [startDateValue, setStartDateValue] = useState("");
  /* Method Condition */
  const options = [
    { label: "เปิดการใช้งาน", value: true },
    { label: "ปิดการใช้งาน", value: false },
  ];

  const optionsSale = [
    { label: "ยอดซื้อ", value: "1" },
    { label: "สินค้าจากคลัง", value: "2" },
  ];

  const nonSelect = [];

  function openModal(value) {
    setErrorPoint(false);
    setErrorPrice(false);
    setErrorUnitProduct(false);
    setErrorEndDate(false);
    setErrorStartDate(false);
    if (value) {
      setIsNew(false);
      if (value) {
        formik.setFieldValue("id", value.id);
        formik.setFieldValue("campaignName", value.campaignName);
        formik.setFieldValue("type", value.type);
        if (value.type === "2") {
          formik.setFieldValue("productAmount", value.productAmount);
          formik.setFieldValue("stockId", value.stockId);
          formik.setFieldValue("purchaseAmount", "");
        } else {
          formik.setFieldValue("productAmount", "");
          formik.setFieldValue("stockId", "");
          formik.setFieldValue("purchaseAmount", value.purchaseAmount);
        }

        formik.setFieldValue("type", value.type);
        setStartDateCode(moment(new Date(value.startDate), "DD/MM/YYYY"));
        setEndDateCode(moment(new Date(value.endDate), "DD/MM/YYYY"));
        formik.setFieldValue("points", value.points);
        formik.setFieldValue("isActive", value.isActive);
      }
    } else {
      setStartDateCode(moment(new Date(), "DD/MM/YYYY"));
      const dt = new Date();
      dt.setDate(dt.getDate() + 1);
      setEndDateCode(moment(dt, "DD/MM/YYYY"));
      formik.values.points = 0;
      formik.values.productAmount = "";
      formik.values.purchaseAmount = 0;
      formik.setFieldValue("points", 0);
      formik.setFieldValue("productAmount", "");
      formik.setFieldValue("purchaseAmount", 0);
      formik.resetForm();
      setIsNew(true);
    }
    setIsOpen(true);
  }

  function afterOpenModal(type) {
    // references are now sync'd and can be accessed.
  }

  function closeModal() {
    if (isChange) {
      openModalEdit();
    } else {
      setIsOpen(false);
    }
  }

  /* Modal */
  function openModalSubject(id) {
    setDeleteValue(id);
    setIsOpenSubject(true);
  }

  function closeModalSubject() {
    setIsOpenSubject(false);
  }

  function openModalEdit() {
    setIsOpenEdit(true);
  }

  function closeModalEdit() {
    setIsOpenEdit(false);
  }

  const onEditValue = async () => {
    formik.handleSubmit();
    closeModalEdit();
    if (formik.errors.length == 0) {
      setIsOpen(false);
    }
  };

  const onReturn = () => {
    setIsChange(false);
    closeModalEdit();
    setIsOpen(false);
  };

  const deleteEcommerce = () => {
    // var filtered = listLogistic.filter( function(value, index, arr){
    //     if(value.id !== deleteValue)
    //     {
    //         return value;
    //     }
    // });
    // listLogistic = filtered;
    // setListLogistic(
    //     listLogistic.filter((val) => {
    //         return val.id !== deleteValue;
    //     })
    // );
    // closeModalSubject();
    axios.delete(`/pointEcommerce/${deleteValue}`).then(() => {
      setListEcommerce(
        listEcommerce.filter((val) => {
          return val.id !== deleteValue;
        })
      );
      closeModalSubject();
    });
  };

  const InputSearch = (e) => {
    e = e.toLowerCase();
    if (e === "") {
      setListEcommerce(listSearch);
    } else {
      setListEcommerce(
        listSearch.filter(
          (x) =>
            x.campaignName.toLowerCase().includes(e) ||
            setStatus(x).toString().toLowerCase().includes(e) ||
            setStateCollect(x).toString().toLowerCase().includes(e) ||
            x.points.toString().toLowerCase().includes(e) ||
            moment(x.startDate)
              .format("DD/MM/YYYY")
              .toString()
              .toLowerCase()
              .includes(e) ||
            moment(x.endDate)
              .format("DD/MM/YYYY")
              .toString()
              .toLowerCase()
              .includes(e)
        )
      );
    }
    setPageNumber(0);
    setForcePage(0);
  };

  /* formik */
  const formik = useFormik({
    initialValues: {
      id: "",
      campaignName: "",
      type: "1",
      purchaseAmount: "0",
      productAmount: "",
      points: "0",
      stockId: "",
      startDate: new Date(),
      endDate: new Date(),
      isActive: true,
      isDeleted: false,
    },
    validationSchema: Yup.object({
      campaignName: Yup.string().required(
        Storage.GetLanguage() === "th"
          ? "* กรุณากรอก ชื่อแคมเปญ"
          : "* Please enter your Member Card"
      ),
      points: Yup.string().required(
        Storage.GetLanguage() === "th"
          ? "* กรุณากรอก จำนวนคะแนน"
          : "* Please enter your point"
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
      dispatch(fetchLoading());
      var isError = false;

      if (values.stockId === "") values.stockId = null;

      if (values.type === "1") {
        if (values.purchaseAmount === "") isError = true;
        else if (parseInt(values.purchaseAmount) <= 0) isError = true;
        if (isError) setErrorPrice(true);
      } else {
        if (values.productAmount === "") isError = true;
        else if (parseInt(values.productAmount) <= 0) isError = true;
        if (isError) setErrorUnitProduct(true);
      }

      if (values.points === "" || parseInt(values.points) <= 0) {
        isError = true;
        setErrorPoint(true);
      } else {
        setErrorPoint(false);
      }

      if (!isError && !errorEndDate && !errorStartDate && !errorDate) {
        if (isNew) {
          axios.post("pointEcommerce", values).then((res) => {
            if (res.data.status) {
              formik.values.id = res.data.tbPointEcommerce.id;
              setIsChange(false);
              setDelay("set");
              setErrorPoint(false);
              setErrorPrice(false);
              setErrorUnitProduct(false);
              addToast(
                Storage.GetLanguage() === "th"
                  ? "บันทึกข้อมูลสำเร็จ"
                  : "Save data successfully",
                { appearance: "success", autoDismiss: true }
              );
              setIsOpen(false);
              fetchData();
            } else {
              if (res.data.isCampaignName) {
                addToast(
                  "บันทึกข้อมูลไม่สำเร็จ เนื่องจากชื่อแคมเปญ E-Commerce ซ้ำกับในระบบ",
                  {
                    appearance: "warning",
                    autoDismiss: true,
                  }
                );
              }
            }

            dispatch(fetchSuccess());
          });
        } else {
          axios.put("pointEcommerce", values).then((res) => {
            if (res.data.status) {
              // formik.values.id = res.data.tbPointEcommerce.id;
              fetchData();
              setErrorPoint(false);
              setErrorPrice(false);
              setIsChange(false);
              setErrorUnitProduct(false);
              addToast(
                Storage.GetLanguage() === "th"
                  ? "บันทึกข้อมูลสำเร็จ"
                  : "Save data successfully",
                { appearance: "success", autoDismiss: true }
              );
            } else {
              if (res.data.isCampaignName) {
                addToast(
                  "บันทึกข้อมูลไม่สำเร็จ เนื่องจากชื่อแคมเปญ E-Commerce ซ้ำกับในระบบ",
                  {
                    appearance: "warning",
                    autoDismiss: true,
                  }
                );
              }
            }
            dispatch(fetchSuccess());
          });
        }
      } else dispatch(fetchSuccess());
    },
  });

  const fetchData = async () => {
    axios.get("pointEcommerce").then((response) => {
      if (response.data.error) {
      } else {
        setListEcommerce(response.data.tbPointEcommerce);
        setListSerch(response.data.tbPointEcommerce);
      }
    });
  };

  const setStatus = (dateValue) => {
    if (
      new Date(new Date(dateValue.endDate).setUTCHours(0, 0, 0, 0)) <
      new Date(new Date().setUTCHours(0, 0, 0, 0))
    )
      return "Expire";
    else if (dateValue.isActive) return "Active";
    else return "Inactive";
  };

  const setStateCollect = (dataValue) => {
    if (dataValue.type === "2") {
      if (
        listProduct.filter(function (x) {
          return x.value === dataValue.stockId;
        }).length > 0
      ) {
        return (
          "สินค้า : " +
          listProduct.filter(function (x) {
            return x.value === dataValue.stockId;
          })[0].label
        );
      } else return "สินค้า";
    } else return "ยอดซื้อ : " + dataValue.purchaseAmount + " บาท";
  };

  const fetchProduct = async () => {
    dispatch(fetchLoading());
    await axios.get("stock").then((response) => {
      if (!response.data.error && response.data.tbStock) {
        let _stockData = response.data.tbStock;
        _stockData = _stockData.map((stock) => {
          return { value: stock.id, label: stock.productName };
        });

        setListProduct(_stockData);
      }
      dispatch(fetchSuccess());
    });
  };

  useEffect(() => {
    /* Default Value for Testing */
    fetchProduct();
    fetchData();
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
                  className="bg-lemon-mbk text-white active:bg-lemon-mbk font-bold  text-xs px-2 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none  ease-linear transition-all duration-150"
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
                              {/* <div className="relative w-full mb-3">
                                <div className=" align-middle  mb-3">
                                  <div className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-base text-green-mbk font-bold whitespace-nowrap p-4">
                                    <label>เพิ่มแคมเปญ E-Commerce</label>
                                  </div>
                                </div>
                              </div> */}

                              <div className=" flex justify-between align-middle ">
                                <div className=" align-middle  mb-3">
                                  <div className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-base text-green-mbk font-bold whitespace-nowrap p-4">
                                    <label>
                                      {formik.values.id !== ""
                                        ? "แก้ไข"
                                        : "เพิ่ม"}
                                      แคมเปญ E-Commerce
                                    </label>
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
                                  {formik.touched.campaignName &&
                                  formik.errors.campaignName ? (
                                    <div className="text-sm pt-2 px-2 text-red-500">
                                      &nbsp;
                                    </div>
                                  ) : null}
                                </div>
                                <div className="w-full lg:w-11/12 px-4 margin-auto-t-b">
                                  <input
                                    type="text"
                                    className="border-0 px-2 text-left py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded w-full  text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                                    id="campaignName"
                                    name="campaignName"
                                    maxLength={100}
                                    onChange={(e) => {
                                      formik.handleChange(e);
                                      setIsChange(true);
                                    }}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.campaignName}
                                    autoComplete="campaignName"
                                  />
                                  {formik.touched.campaignName &&
                                  formik.errors.campaignName ? (
                                    <div className="text-sm pt-2 px-2 text-red-500">
                                      {formik.errors.campaignName}
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
                                <div
                                  className={
                                    "w-full lg:w-11/12 px-4 mt-2 mb-2 "
                                  }
                                >
                                  <Radio.Group
                                    options={optionsSale}
                                    onChange={(e) => {
                                      setIsChange(true);
                                      setIsSale(e.target.value);
                                      if (e.target.value === "2") {
                                        formik.setFieldValue(
                                          "purchaseAmount",
                                          ""
                                        );
                                        if (listProduct.length > 0)
                                          formik.setFieldValue(
                                            "stockId",
                                            listProduct[0].value
                                          );
                                        formik.setFieldValue(
                                          "productAmount",
                                          "0"
                                        );
                                      } else {
                                        formik.setFieldValue(
                                          "purchaseAmount",
                                          "0"
                                        );
                                        formik.setFieldValue(
                                          "productAmount",
                                          ""
                                        );
                                      }
                                      formik.setFieldValue(
                                        "type",
                                        e.target.value
                                      );
                                    }}
                                    value={formik.values.type}
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
                                <div className="w-full lg:w-11/12 px-4 margin-auto-t-b flex">
                                  <input
                                    type="text"
                                    className="border-0 px-2 w-full text-right py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                                    id="purchaseAmount"
                                    name="purchaseAmount"
                                    // maxLength={5}
                                    // max={99999}
                                    disabled={
                                      formik.values.type === "2" ? true : false
                                    }
                                    onChange={(e) => {
                                      if (e.target.value > 99999.99) {
                                        formik.handleChange({
                                          target: {
                                            name: "purchaseAmount",
                                            value: 99999.99,
                                          },
                                        });
                                      } else {
                                        formik.handleChange({
                                          target: {
                                            name: "purchaseAmount",
                                            value:
                                              parseFloat(e.target.value) || 0,
                                          },
                                        });
                                      }
                                    }}
                                    onBlur={(e) => {
                                      if (e.target.value > 99999) {
                                        e.preventDefault();
                                      } else {
                                        formik.handleChange({
                                          target: {
                                            name: "purchaseAmount",
                                            value:
                                              parseFloat(
                                                e.target.value
                                              ).toFixed(2) || 0,
                                          },
                                        });
                                      }
                                    }}
                                    autoComplete="purchaseAmount"
                                    value={formik.values.purchaseAmount}
                                  />
                                  <span
                                    className="text-blueGray-600 text-sm font-bold pl-2 margin-auto "
                                    htmlFor="grid-password"
                                  >
                                    บาท
                                  </span>
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
                                  >
                                    {errorPrice ? (
                                      <div className="text-sm pt-2 px-2 text-red-500">
                                        &nbsp;
                                      </div>
                                    ) : null}
                                  </label>
                                </div>
                                <div className="w-full lg:w-11/12 px-4 margin-auto-t-b flex">
                                  {errorPrice ? (
                                    <div className="text-sm pt-2 px-2 text-red-500">
                                      * ยอดซื้อ ต้องมากกว่า 0
                                    </div>
                                  ) : null}
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
                                <div className="w-full lg:w-11/12 px-4 margin-auto-t-b flex">
                                  <Select
                                    name="stockId"
                                    onChange={(value) => {
                                      setIsChange(true);
                                      formik.setFieldValue(
                                        "stockId",
                                        value.value
                                      );
                                    }}
                                    menuPortalTarget={document.body}
                                    menuPosition="fixed"
                                    placeholder=""
                                    options={
                                      formik.values.type === "1"
                                        ? nonSelect
                                        : listProduct
                                    }
                                    value={
                                      formik.values.type === "1"
                                        ? null
                                        : ValidateService.defaultValue(
                                            listProduct,
                                            formik.values.stockId
                                          )
                                    }
                                    isDisabled={
                                      formik.values.type === "1" ? true : false
                                    }
                                    className={"w-full"}
                                    styles={UseStyleSelect}
                                  />
                                  <span
                                    className="text-blueGray-600 text-sm font-bold px-4 margin-auto "
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
                                    className="border-0 px-2 text-right py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded w-3-3/12 text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                                    id="productAmount"
                                    name="productAmount"
                                    maxLength={5}
                                    disabled={
                                      formik.values.type === "1" ? true : false
                                    }
                                    onChange={(event) => {
                                      setIsChange(true);
                                      setlangSymbo(
                                        ValidateService.onHandleNumberValue(
                                          event
                                        )
                                      );
                                      formik.values.productAmount =
                                        ValidateService.onHandleNumberValue(
                                          event
                                        );
                                    }}
                                    onBlur={formik.handleBlur}
                                    autoComplete="productAmount"
                                    value={formik.values.productAmount}
                                  />
                                  <span
                                    className="text-blueGray-600 text-sm font-bold pl-2 margin-auto "
                                    htmlFor="grid-password"
                                  >
                                    ชิ้น
                                  </span>
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
                                <div className="w-full lg:w-11/12 px-4 margin-auto-t-b flex">
                                  <span
                                    className="text-blueGray-600 text-sm font-bold px-4 margin-auto "
                                    style={{ width: "76%" }}
                                    htmlFor="grid-password"
                                  ></span>
                                  <span
                                    className="text-blueGray-600 text-sm  margin-auto "
                                    htmlFor="grid-password"
                                  >
                                    {errorUnitProduct ? (
                                      <div className="text-sm pt-2 px-2 text-red-500">
                                        * จำนวนชิ้นต้องมากกว่า 0
                                      </div>
                                    ) : null}
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
                                    จำนวนคะแนน
                                  </label>
                                  <span className="text-sm ml-2 text-red-500">
                                    *
                                  </span>
                                  {formik.touched.points &&
                                  formik.errors.points ? (
                                    <div className="text-sm py-2 px-2 text-red-500">
                                      &nbsp;
                                    </div>
                                  ) : null}
                                </div>
                                <div className="w-full lg:w-5/12 px-4 margin-auto-t-b">
                                  <input
                                    type="text"
                                    className="border-0 px-2 text-right py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded w-full text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                                    id="points"
                                    name="points"
                                    maxLength={5}
                                    onChange={(event) => {
                                      setIsChange(true);
                                      setlangSymbo(
                                        ValidateService.onHandleNumberValue(
                                          event
                                        )
                                      );
                                      formik.values.points =
                                        ValidateService.onHandleNumberValue(
                                          event
                                        );
                                    }}
                                    onBlur={formik.handleBlur}
                                    autoComplete="points"
                                    value={formik.values.points}
                                  />
                                  {formik.touched.points &&
                                  formik.errors.points ? (
                                    <div className="text-sm py-2 px-2 text-red-500">
                                      {formik.errors.points}
                                    </div>
                                  ) : null}
                                  {errorPoint ? (
                                    <div className="text-sm pt-2 px-2 text-red-500">
                                      * จำนวนคะแนนต้องมากกว่า 0
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
                                  {errorStartDate ||
                                  errorEndDate ||
                                  errorDate ? (
                                    <div className="text-sm py-2 px-2 text-red-500">
                                      &nbsp;
                                    </div>
                                  ) : null}
                                </div>
                                <div className="w-full lg:w-5/12 px-4 margin-auto-t-b">
                                  <div className="relative">
                                    <ConfigProvider locale={locale}>
                                      <DatePicker
                                        inputReadOnly={true}
                                        format={"DD/MM/yyyy"}
                                        placeholder="เลือกวันที่"
                                        showToday={false}
                                        defaultValue={startDateCode}
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
                                          setIsChange(true);
                                          if (e === null) {
                                            formik.setFieldValue(
                                              "startDate",
                                              new Date(),
                                              false
                                            );
                                            setStartDateCode(
                                              moment(new Date(), "DD/MM/YYYY")
                                            );
                                            setErrorStartDate(true);
                                          } else {
                                            if (
                                              ValidateService.withOutTime(e) >
                                              ValidateService.withOutTime(
                                                formik.values.endDate
                                              )
                                            )
                                              setErrorDate(true);
                                            else setErrorDate(false);
                                            setStartDateCode(
                                              moment(e).toDate()
                                            );
                                            setErrorStartDate(false);
                                            formik.setFieldValue(
                                              "startDate",
                                              moment(e).toDate(),
                                              false
                                            );
                                            if (formik.values.endDate != null) {
                                              let s = moment(e).toDate();
                                              if (
                                                moment(e).toDate() >=
                                                formik.values.endDate
                                              ) {
                                                setEndDateCode(
                                                  moment(e)
                                                    .add(1, "days")
                                                    .toDate()
                                                );
                                                formik.handleChange({
                                                  target: {
                                                    name: "endDate",
                                                    value: moment(e)
                                                      .add(1, "days")
                                                      .toDate(),
                                                  },
                                                });
                                              }
                                            }
                                          }
                                        }}
                                        // value={moment(
                                        //   new Date(
                                        //     formikImport.values.startDate
                                        //   ),
                                        //   "DD/MM/YYYY"
                                        // )}
                                      />
                                    </ConfigProvider>
                                    {errorStartDate || errorEndDate ? (
                                      <div className="text-sm py-2 px-2 text-red-500">
                                        {errorStartDate ? (
                                          "* วันที่เริ่มต้น ไม่เป็นค่าว่าง"
                                        ) : (
                                          <>&nbsp;</>
                                        )}
                                      </div>
                                    ) : null}
                                    {errorDate ? (
                                      <div className="text-sm py-2 px-2 text-red-500">
                                        <>&nbsp;</>
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
                                  {errorEndDate ||
                                  errorStartDate ||
                                  errorDate ? (
                                    <div className="text-sm py-2 px-2 text-red-500">
                                      &nbsp;
                                    </div>
                                  ) : null}
                                </div>

                                <div className="w-full lg:w-5/12 px-4 margin-auto-t-b">
                                  <ConfigProvider locale={locale}>
                                    <DatePicker
                                      inputReadOnly={true}
                                      format={"DD/MM/yyyy"}
                                      placeholder="เลือกวันที่"
                                      showToday={false}
                                      defaultValue={endDateCode}
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
                                        setIsChange(true);
                                        if (e === null) {
                                          setErrorEndDate(true);
                                          formik.setFieldValue(
                                            "endDate",
                                            new Date(),
                                            false
                                          );
                                        } else {
                                          if (
                                            ValidateService.withOutTime(e) <
                                            ValidateService.withOutTime(
                                              formik.values.startDate
                                            )
                                          )
                                            setErrorDate(true);
                                          else setErrorDate(false);
                                          setErrorEndDate(false);
                                          formik.setFieldValue(
                                            "endDate",
                                            moment(e).toDate(),
                                            false
                                          );
                                        }
                                      }}
                                      // disabledDate={(current) => {
                                      //   if (formik.values.startDate != null) {
                                      //     let day = formik.values.startDate
                                      //     console.log(day)
                                      //     return current && current <= moment(new Date(day)).endOf('day');
                                      //   }
                                      // }}
                                      disabledDate={(current) => {
                                        if (formik.values.startDate != null) {
                                          let day = startDateCode;
                                          return (
                                            current &&
                                            current <
                                              moment(new Date(day))
                                                .add(-1, "days")
                                                .endOf("day")
                                          );
                                        }
                                      }}
                                      // value={moment(
                                      //   new Date(formikImport.values.endDate),
                                      //   "DD/MM/YYYY"
                                      // )}
                                    />
                                  </ConfigProvider>

                                  {errorEndDate || errorStartDate ? (
                                    <div className="text-sm py-2 px-2 text-red-500">
                                      {errorEndDate ? (
                                        "* วันที่สิ้นสุด ไม่เป็นค่าว่าง"
                                      ) : (
                                        <>&nbsp;</>
                                      )}
                                    </div>
                                  ) : null}
                                  {errorDate ? (
                                    <div className="text-sm py-2 px-2 text-red-500">
                                      * วันที่เริ่มต้น ต้องน้อยกว่าวันที่สิ้นสุด
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
                                      setIsChange(true);
                                      setActive(e.target.value);
                                      formik.setFieldValue(
                                        "isActive",
                                        e.target.value
                                      );
                                    }}
                                    value={formik.values.isActive}
                                  />
                                </div>
                              </div>
                              <div className="relative w-full mb-3">
                                <div className=" flex justify-between align-middle ">
                                  <div></div>
                                  <div className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4">
                                    {/* <button
                                      className="bg-rose-mbk text-white active:bg-rose-mbk font-bold uppercase text-sm px-2 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                                      type="button"
                                      onClick={() => {
                                        closeModal();
                                      }}
                                    >
                                      ย้อนกลับ
                                    </button> */}
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
                      "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 "
                    }
                  >
                    ชื่อแคมเปญ
                  </th>
                  <th
                    className={
                      "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 "
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
                        <td
                          className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-left cursor-pointer"
                          onClick={() => openModal(value)}
                        >
                          {value.campaignName}
                        </td>
                        <td
                          className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-left cursor-pointer"
                          onClick={() => openModal(value)}
                        >
                          {setStateCollect(value)}
                        </td>
                        <td
                          className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center cursor-pointer"
                          onClick={() => openModal(value)}
                        >
                          {value.points}
                        </td>
                        <td
                          className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center cursor-pointer"
                          onClick={() => openModal(value)}
                        >
                          {moment(value.startDate).format("DD/MM/YYYY")}
                        </td>
                        <td
                          className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center "
                          onClick={() => openModal(value)}
                        >
                          {moment(value.endDate).format("DD/MM/YYYY")}
                        </td>
                        <td
                          className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center"
                          onClick={() => openModal(value)}
                        >
                          {setStatus(value)}
                        </td>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center">
                          <i
                            className={
                              "fas fa-trash cursor-pointer" + " text-red-500"
                            }
                            onClick={(e) => {
                              openModalSubject(value.id);
                            }}
                          ></i>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            <ConfirmDialog
              showModal={modalIsOpenSubject}
              message={"E-Commerce"}
              hideModal={() => {
                closeModalSubject();
              }}
              confirmModal={() => {
                deleteEcommerce();
              }}
            />
            <ConfirmEdit
              showModal={modalIsOpenEdit}
              message={"E-Commerce"}
              hideModal={() => {
                closeModalEdit();
              }}
              confirmModal={() => {
                onEditValue();
              }}
              returnModal={() => {
                onReturn();
              }}
            />
          </div>
          <div className="py-4 px-4">
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
    </>
  );
}
