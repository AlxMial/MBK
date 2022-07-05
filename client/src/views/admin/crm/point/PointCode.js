import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "services/axios";
import axiosUpload from "services/axiosUpload";
import { useToasts } from "react-toast-notifications";
import "antd/dist/antd.css";
import ReactPaginate from "react-paginate";
import moment from "moment";
import { Radio, DatePicker, ConfigProvider } from "antd";
import locale from "antd/lib/locale/th_TH";
import Modal from "react-modal";
import Spinner from "components/Loadings/spinner/Spinner";
import {
  customStyles,
  customStylesMobile,
} from "assets/styles/theme/ReactModal";
/* Service */
import useWindowDimensions from "services/useWindowDimensions";
import ValidateService from "services/validateValue";
import * as Storage from "../../../../services/Storage.service";
import ConfirmDialog from "components/ConfirmDialog/ConfirmDialog";
import { styleSelect } from "assets/styles/theme/ReactSelect.js";
import useMenu from "services/useMenu";
import { exportExcel } from "services/exportExcel";
import { useDispatch } from "react-redux";
import { fetchLoading, fetchSuccess } from "redux/actions/common";
import ConfirmEdit from "components/ConfirmDialog/ConfirmEdit";

Modal.setAppElement("#root");

export default function PointCode() {
  /* Set useState */
  const dispatch = useDispatch();
  const [Active, setActive] = useState("1");
  const [Type, setType] = useState("1");
  const [isNew, setIsNew] = useState(0);
  const { height, width } = useWindowDimensions();
  const [listPointCode, setListPointCode] = useState([]);
  const [langSymbo, setlangSymbo] = useState("");
  const [listSearch, setListSerch] = useState([]);
  const [optionCampaign, setOptionCampaign] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [forcePage, setForcePage] = useState(0);
  const [file, setFile] = useState();
  const [fileName, setFileName] = useState();
  const [isError, setIsError] = useState(false);
  const [startDateCode, setStartDateCode] = useState("");
  const [endDateCode, setEndDateCode] = useState("");
  const [errorDate, setErrorDate] = useState(false);
  const usersPerPage = 10;
  const pagesVisited = pageNumber * usersPerPage;
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalIsOpenImport, setIsOpenImport] = useState(false);
  const pageCount = Math.ceil(listPointCode.length / usersPerPage);
  const [modalIsOpenSubject, setIsOpenSubject] = useState(false);
  const [deleteValue, setDeleteValue] = useState("");
  const [isEnable, setIsEnable] = useState(false);
  const useStyle = customStyles();
  const useStyleMobile = customStylesMobile();
  const useStyleSelect = styleSelect();
  const [isLoading, setIsLoading] = useState(false);
  const [enableCode, setEnableCode] = useState(false);

  const [errorPointCodeSymbol, setErrorPointCodeSymbol] = useState(false);
  const [errorPointCodeLengthSymbol, setErrorPointCodeLengthSymbol] =
    useState(false);
  const [errorPointCodeQuantityCode, setErrorPointCodeQuantityCode] =
    useState(false);

  const [errorStartDate, setErrorStartDate] = useState(false);
  const [errorEndDate, setErrorEndDate] = useState(false);
  const [errorStartDateImport, setErrorStartDateImport] = useState(false);
  const [errorEndDateImport, setErrorEndDateImport] = useState(false);
  const [errorImport, setErrorImport] = useState(false);
  const [modalIsOpenEdit, setIsOpenEdit] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const [errorPointQuantity, seterrorPointQuantity] = useState(false);
  const { menu } = useMenu();
  const [errorQuantityMoreOne, setErrorQuantityMoreOne] = useState(false);
  const { addToast } = useToasts();
  const [errorExcel, setErrorExcel] = useState(false);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
    setForcePage(selected);
  };

  async function openModal(id) {
    setIsEnable(false);
    setErrorPointCodeLengthSymbol(false);
    setErrorPointCodeQuantityCode(false);
    setErrorPointCodeSymbol(false);
    setErrorEndDate(false);
    setErrorStartDate(false);
    if (id) {
      await fetchDataById(id);
      setIsNew(false);
      setEnableCode(true);
    } else {
      setEnableCode(false);
      setActive("1");
      setType("1");
      setStartDateCode(moment(new Date(), "DD/MM/YYYY"));
      setEndDateCode(moment(new Date(), "DD/MM/YYYY"));
      formik.resetForm();
      //DefaultValue();
      setIsNew(true);
    }
    setIsOpen(true);
  }

  function afterOpenModal(type) {
    // references are now sync'd and can be accessed.
  }

  function closeModal() {
    if (isModified) {
      openModalEdit();
    } else {
      setIsOpen(false);
      setIsOpenImport(false);
    }
  }

  function openModalEdit() {
    setIsOpenEdit(true);
  }

  function closeModalEdit() {
    setIsOpenEdit(false);
  }

  const onEditValue = async () => {
    closeModalEdit();
    if (modalIsOpenImport) {
      formikImport.handleSubmit();
      const valueError = JSON.stringify(formikImport.errors);
      if (valueError.length <= 2 && !errorEndDateImport && !errorStartDateImport) {
        setIsOpenImport(false);
      }
    } else {
      onValidate();
      formik.handleSubmit();
      const valueError = JSON.stringify(formik.errors);
      if (
        valueError.length <= 2 &&
        !errorPointQuantity &&
        !errorQuantityMoreOne &&
        !errorPointCodeQuantityCode &&
        !errorPointCodeLengthSymbol &&
        !errorPointCodeSymbol &&
        !errorEndDate &&
        !errorStartDate
      ) {
        setIsOpen(false);
      }
    }
  };

  const onReturn = () => {
    setIsModified(false);
    closeModalEdit();
    if (modalIsOpenImport) setIsOpenImport(false);
    else setIsOpen(false);
  };

  function openModalImport() {
    setOptionCampaign([]);
    setErrorEndDateImport(false);
    setErrorDate(false);
    setErrorStartDateImport(false);
    setStartDateCode(moment(new Date(), "DD/MM/YYYY"));
    setEndDateCode(moment(new Date(), "DD/MM/YYYY"));
    formikImport.resetForm();
    fetchData();
    setIsError(false);
    setIsOpenImport(true);
  }

  function closeModalImport() {
    setIsOpenImport(false);
  }

  /* Modal */
  function openModalSubject(id) {
    setDeleteValue(id);
    setIsOpenSubject(true);
  }

  function closeModalSubject() {
    setIsOpenSubject(false);
  }

  /* Method Condition */
  const options = [
    { label: "เปิดการใช้งาน", value: "1" },
    { label: "ปิดการใช้งาน", value: "2" },
  ];

  /* Method Condition */
  const optionsImport = [
    { label: "Auto", value: "1" },
    { label: "Import", value: "2" },
  ];

  const InputSearch = (e) => {
    e = e.toLowerCase();
    if (e === "") {
      setListPointCode(listSearch);
    } else {
      setListPointCode(
        listSearch.filter(
          (x) =>
            x.pointCodeName.toLowerCase().includes(e) ||
            (x.pointCodeSymbol === null ? "" : x.pointCodeSymbol)
              .toLowerCase()
              .includes(e) ||
            x.pointCodePoint.toString().includes(e) ||
            (x.pointCodeQuantityCode === null ? "" : x.pointCodeQuantityCode)
              .toString()
              .includes(e) ||
            x.status.toLowerCase().toString().includes(e) ||
            x.useCount.toString().includes(e)
        )
      );
      setPageNumber(0);
      setForcePage(0);
    }
  };

  const onValidate = () => {
    setErrorPointCodeSymbol(false);
    setErrorPointCodeQuantityCode(false);
    setErrorPointCodeLengthSymbol(false);
    if (formik.values.pointCodeSymbol === "") {
      setErrorPointCodeSymbol(true);
    }
    if (formik.values.pointCodeQuantityCode === "") {
      setErrorPointCodeQuantityCode(true);
    }
    if (formik.values.pointCodeLengthSymbol === "") {
      setErrorPointCodeLengthSymbol(true);
    }
    if (
      formik.values.pointCodeLengthSymbol < 10 ||
      formik.values.pointCodeLengthSymbol > 16
    ) {
      setErrorPointCodeLengthSymbol(true);
    }
  };

  const selectFile = (e) => {
    if (
      e.target.files[0].type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      e.target.files[0].type === "application/vnd.ms-excel"
    ) {
      setErrorExcel(false);
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
      setErrorImport(false);
      formikImport.setFieldValue("fileName", e.target.files[0].name);
    } else {
      setErrorExcel(true);
    }
  };

  const ExportFile = async (id, name, point,startDate,endDate) => {
    setIsLoading(true);
    let coupon = await axios.get(`pointCode/exportExcel/${id}`);
    const TitleColumns = ["ชื่อแคมเปญ", "จำนวนคะแนน", "วันที่เริ่มต้น", "วันที่สิ้นสุด", "Code", "สถานะใช้งาน", "สถานะหมดอายุ"];
    const columns = ["name", "point", "startDate", "endDate", "code", "isUse", "isExpire"];
    exportExcel(coupon.data, name, TitleColumns, columns, "Coupon");
    setIsLoading(false);
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
      isActive: "1",
      isType: "1",
      isDeleted: false,
      addBy: "",
      updateBy: "",
    },
    validationSchema: Yup.object({
      pointCodeName: Yup.string().required(
        Storage.GetLanguage() === "th"
          ? "* กรุณากรอก ชื่อแคมเปญ"
          : "* Please enter your Member Card"
      ),
      // pointCodeSymbol: Yup.string().required(
      //   Storage.GetLanguage() === "th"
      //     ? "* กรุณากรอก รหัสแคมเปญ"
      //     : "* Please enter your First Name"
      // ),
      // pointCodeLengthSymbol: Yup.string().required(
      //   Storage.GetLanguage() === "th"
      //     ? "* กรุณากรอก จำนวนตัวอักษร"
      //     : "* Please enter your Last Name"
      // ),
      pointCodePoint: Yup.string().required(
        Storage.GetLanguage() === "th"
          ? "* กรุณากรอก คะแนน"
          : "* Please enter your Register Date"
      ),
      // pointCodeQuantityCode: Yup.string().required(
      //   Storage.GetLanguage() === "th"
      //     ? "* กรุณากรอก จำนวน Code"
      //     : "* Please enter your Register Date"
      // ),
      startDate: Yup.string().required(
        Storage.GetLanguage() === "th"
          ? "* กรุณากรอก วันที่เริ่มสมัคร"
          : "* Please enter your Register Date"
      ),
      endDate: Yup.string().required(
        Storage.GetLanguage() === "th"
          ? "* กรุณากรอก วันที่สิ้นสุดสมัคร"
          : "* Please enter your Register Date"
      ),
    }),
    onSubmit: (values) => {
      if (new Date(formik.values.startDate) > new Date(formik.values.endDate)) {
        setErrorDate(true);
      } else {
        setErrorDate(false);
        if (
          !errorPointQuantity &&
          !errorQuantityMoreOne &&
          !errorPointCodeQuantityCode &&
          !errorPointCodeLengthSymbol &&
          !errorEndDate &&
          !errorStartDate
        ) {
          setIsLoading(true);
          if (values.id) {
            formikImport.values.updateBy = sessionStorage.getItem("user");
            axios.put("pointCode", values).then((res) => {
              if (res.data.status) {
                setIsLoading(false);
                fetchData();
                setIsModified(false);
                addToast(
                  Storage.GetLanguage() === "th"
                    ? "บันทึกข้อมูลสำเร็จ"
                    : "Save data successfully",
                  { appearance: "success", autoDismiss: true }
                );
              } else {
                addToast("บันทึกข้อมูลไม่สำเร็จ", {
                  appearance: "warning",
                  autoDismiss: true,
                });
              }
            });
          } else {
            formikImport.values.addBy = sessionStorage.getItem("user");
            axios.post("pointCode", values).then(async (res) => {
              if (res.data.status) {
                values.tbPointCodeHDId = res.data.tbPointCodeHD.id;
                await axiosUpload
                  .post("api/excel/generateCode", values)
                  .then(async (resGenerate) => {
                    await axios.post("/uploadExcel").then((resUpload) => {
                      if (resUpload.data.error) {
                        axios
                          .delete(
                            `pointCode/delete/${res.data.tbPointCodeHD.id}`
                          )
                          .then(async (resDelete) => {
                            await axiosUpload
                              .delete(
                                `api/excel/delete/${res.data.tbPointCodeHD.id}`
                              )
                              .then(() => {});
                            fetchData();
                            setIsLoading(false);
                            addToast(
                              "บันทึกข้อมูลไม่สำเร็จ เนื่องจากการ Generate มีปัญหา",
                              {
                                appearance: "warning",
                                autoDismiss: true,
                              }
                            );
                          });
                      } else {
                        fetchData();
                        setIsOpen(false);
                        setIsLoading(false);
                        setIsModified(false);
                        addToast(
                          Storage.GetLanguage() === "th"
                            ? "บันทึกข้อมูลสำเร็จ"
                            : "Save data successfully",
                          { appearance: "success", autoDismiss: true }
                        );
                      }
                    });
                  });
              } else {
                if (res.data.isPointCodeName) {
                  addToast("ชื่อแคมเปญซ้ำกับในระบบ กรุณากรอกข้อมูลใหม่", {
                    appearance: "warning",
                    autoDismiss: true,
                  });
                } else if (res.data.isPointCodeSymbol) {
                  addToast("รหัสแคมเปญซ้ำกับในระบบ กรุณากรอกข้อมูลใหม่", {
                    appearance: "warning",
                    autoDismiss: true,
                  });
                }
                setIsLoading(false);
              }
            });
          }
        }
      }
    },
  });

  const formikImport = useFormik({
    initialValues: {
      id: "",
      pointCodeName: "",
      pointCodePoint: "",
      startDate: new Date(),
      endDate: new Date(),
      isActive: "1",
      isType: "2",
      isExpire: false,
      isDeleted: false,
      fileName: "",
      addBy: "",
      updateBy: "",
    },
    validationSchema: Yup.object({
      pointCodeName: Yup.string().required(
        Storage.GetLanguage() === "th"
          ? "* กรุณากรอก ชื่อแคมเปญ"
          : "* Please enter your Member Card"
      ),
      pointCodePoint: Yup.string().required(
        Storage.GetLanguage() === "th"
          ? "* กรุณากรอก คะแนน"
          : "* Please enter your Register Date"
      ),
      startDate: Yup.string().required(
        Storage.GetLanguage() === "th"
          ? "* กรุณากรอก วันที่เริ่มสมัคร"
          : "* Please enter your Register Date"
      ),
      endDate: Yup.string().required(
        Storage.GetLanguage() === "th"
          ? "* กรุณากรอก วันที่สิ้นสุดสมัคร"
          : "* Please enter your Register Date"
      ),
    }),
    onSubmit: async (values) => {
      if (
        new Date(formikImport.values.startDate) >
        new Date(formikImport.values.endDate)
      ) {
        setErrorDate(true);
      } else {
        if (!errorStartDateImport && !errorEndDateImport) {
          setErrorDate(false);
          setIsLoading(true);
          if (values.id) {
            formikImport.values.updateBy = sessionStorage.getItem("user");
            axios.put("pointCode", values).then((res) => {
              if (res.data.status) {
                setIsLoading(false);
                fetchData();
                setIsModified(false);
                addToast(
                  Storage.GetLanguage() === "th"
                    ? "บันทึกข้อมูลสำเร็จ"
                    : "Save data successfully",
                  { appearance: "success", autoDismiss: true }
                );
              } else {
                addToast("บันทึกข้อมูลไม่สำเร็จ", {
                  appearance: "warning",
                  autoDismiss: true,
                });
              }
            });
          } else {
            let formData = new FormData();
            formData.append("file", file);
            if (file) {
              setErrorImport(false);
              formikImport.values.addBy = sessionStorage.getItem("user");
              axios.post("pointCode", values).then(async (res) => {
                if (res.data.status) {
                  formData.append("tbPointCodeHDId", res.data.tbPointCodeHD.id);
                  await axiosUpload
                    .post("api/excel/upload", formData)
                    .then(async (resExcel) => {
                      await axios.post("/uploadExcel").then((resUpload) => {
                        if (resUpload.data.error) {
                          axios
                            .delete(
                              `pointCode/delete/${res.data.tbPointCodeHD.id}`
                            )
                            .then((resDelete) => {
                              fetchData();
                              addToast(
                                "บันทึกข้อมูลไม่สำเร็จ เนื่องจาก Code เคยมีการ Import เรียบร้อยแล้ว",
                                {
                                  appearance: "warning",
                                  autoDismiss: true,
                                }
                              );
                            });
                        } else {
                          closeModalImport();
                          fetchData();
                          setIsModified(false);
                          addToast(
                            Storage.GetLanguage() === "th"
                              ? "บันทึกข้อมูลสำเร็จ"
                              : "Save data successfully",
                            { appearance: "success", autoDismiss: true }
                          );
                        }
                      });
                    });
                } else {
                  if (res.data.isPointCodeName) {
                    addToast(
                      "บันทึกข้อมูลไม่สำเร็จ เนื่องจากชื่อแคมเปญเคยมีการลงทะเบียนไว้เรียบร้อยแล้ว",
                      {
                        appearance: "warning",
                        autoDismiss: true,
                      }
                    );
                  } else if (res.data.isPointCodeSymbol) {
                    addToast(
                      "บันทึกข้อมูลไม่สำเร็จ เนื่องจากรหัสแคมเปญซ้ำกับในระบบ",
                      {
                        appearance: "warning",
                        autoDismiss: true,
                      }
                    );
                  }
                }
                setIsLoading(false);
              });
            } else {
              setIsLoading(false);
              setErrorImport(true);
            }
          }
        }
      }
    },
  });

  const fetchData = async () => {
    // dispatch(fetchLoading());
    await axios.get("pointCode").then((response) => {
      // dispatch(fetchSuccess());
      if (response.data.error) {
      } else {
        // var JsonCampaign = [];
        // response.data.tbPointCodeHD.forEach((field) =>
        //   JsonCampaign.push({
        //     value: field.id.toString(),
        //     label: field.pointCodeName,
        //   })
        // );
        // if (JsonCampaign.length > 0)
        //   formikImport.setFieldValue("tbPointCodeHDId", JsonCampaign[0].value);
        // setOptionCamp(aign(JsonCampaign);

        for (var i = 0; i < response.data.tbPointCodeHD.length; i++) {
          response.data.tbPointCodeHD[i]["status"] =
            response.data.tbPointCodeHD[i].isActive === "2"
              ? "Inactive"
              : "Active";
        }

        setErrorPointCodeSymbol(false);
        setErrorPointCodeQuantityCode(false);
        setErrorPointCodeLengthSymbol(false);
        setErrorDate(false);
        setErrorStartDate(false);
        setErrorEndDate(false);
        setErrorQuantityMoreOne(false);
        seterrorPointQuantity(false);
        setListPointCode(response.data.tbPointCodeHD);
        setListSerch(response.data.tbPointCodeHD);
      }
    });
  };

  const fetchDataById = async (id) => {
    formik.resetForm();
    let response = await axios.get(`/pointCode/byId/${id}`);
    let pointCode = await response.data.tbPointCodeHD;
    if (pointCode !== null) {
      for (var columns in response.data.tbPointCodeHD) {
        if (columns === "isActive") {
          setActive(response.data.tbPointCodeHD[columns].toString());
        } else if (columns === "isType") {
          setType(response.data.tbPointCodeHD[columns].toString());
        } else if (columns === "startDate")
          setStartDateCode(
            moment(new Date(response.data.tbPointCodeHD[columns]), "DD/MM/YYYY")
          );
        else if (columns === "endDate")
          setEndDateCode(
            moment(new Date(response.data.tbPointCodeHD[columns]), "DD/MM/YYYY")
          );
        if (columns === "pointCodeSymbol") {
          if (response.data.tbPointCodeHD[columns] === null) setIsEnable(true);
        }

        if (columns === "pointCodeLengthSymbol") {
          formik.setFieldValue(
            columns,
            response.data.tbPointCodeHD["isType"] === "2"
              ? ""
              : response.data.tbPointCodeHD[columns],
            false
          );
        } else if (columns === "pointCodeQuantityCode") {
          formik.setFieldValue(
            columns,
            response.data.tbPointCodeHD["isType"] === "2"
              ? ""
              : response.data.tbPointCodeHD[columns],
            false
          );
        } else {
          formik.setFieldValue(
            columns,
            response.data.tbPointCodeHD[columns] === null
              ? ""
              : response.data.tbPointCodeHD[columns],
            false
          );
        }
      }
      setErrorPointCodeSymbol(false);
      setErrorPointCodeQuantityCode(false);
      setErrorPointCodeLengthSymbol(false);
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

    setStartDateCode(moment(new Date(), "DD/MM/YYYY"));
    setEndDateCode(moment(new Date(), "DD/MM/YYYY"));
    fetchData();
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
      <div className="w-full">
        <div
          className={
            "py-4 relative flex flex-col min-w-0 break-words w-full mb-6 border rounded-b bg-white Overflow-list "
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
              <div
                className={
                  "lg:w-6/12 text-right" + (width < 764 ? " block" : " hidden")
                }
              >
                <button
                  // data-dropdown-toggle="dropdownmenu"
                  className="flex items-center py-4 px-2 w-full text-base font-normal bg-transparent outline-none button-focus"
                  type="button"
                >
                  <i
                    className="fas fa-bars"
                    id={menu ? "dropdownDefaults" : "dropdownDefault"}
                  ></i>
                </button>
                <div
                  id="dropdownmenu"
                  className={
                    "z-10 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 buttonInfo" +
                    (menu ? " block absolute isMenu" : " hidden")
                  }
                >
                  <ul
                    className="py-1 text-sm text-gray-700 dark:text-gray-200"
                    aria-labelledby="dropdownDefault"
                  >
                    <li>
                      <div className="flex flex-wrap" id="save">
                        <span
                          id="save"
                          onClick={() => {
                            openModalImport();
                          }}
                          className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white font-bold text-sm w-8/12"
                        >
                          <i className="fas fa-file-excel mr-2"></i>
                          Import
                        </span>
                      </div>
                    </li>
                    <li>
                      <div className="flex flex-wrap" id="back">
                        <span
                          onClick={() => {
                            openModal();
                          }}
                          id="back"
                          className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white font-bold text-sm w-8/12"
                        >
                          <i className="fas fa-save mr-2"></i>
                          {"เพิ่ม"}แคมเปญ
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div
                className={
                  "lg:w-6/12 text-right" + (width < 764 ? " hidden" : " block")
                }
              >
                <button
                  className="bg-white bg-import text-white  mr-2 active:bg-white font-bold  text-xs px-2 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none  ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => {
                    openModalImport();
                  }}
                >
                  <i className="fas fa-file-import text-gray-700 "></i>{" "}
                  <span className="text-gray-700 text-sm px-2">Import</span>
                </button>
                <Modal
                  isOpen={modalIsOpenImport}
                  // onAfterOpen={afterOpenModal}
                  onRequestClose={closeModalImport}
                  style={width <= 1180 ? useStyleMobile : useStyle}
                  contentLabel="Example Modal"
                  shouldCloseOnOverlayClick={false}
                >
                  <div className="flex flex-wrap">
                    <div className="w-full ">
                      <>
                        <div className={"flex-auto "}>
                          <div className="w-full mt-2">
                            <form>
                              <div className=" flex justify-between align-middle ">
                                <div className=" align-middle  mb-3">
                                  <div className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-base text-green-mbk font-bold whitespace-nowrap p-4">
                                    <label>Import</label>
                                  </div>
                                </div>

                                <div className="  text-right align-middle  mb-3">
                                  <div className=" border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm text-red-500 font-bold whitespace-nowrap p-4">
                                    <label
                                      className="cursor-pointer"
                                      onClick={() => {
                                        // closeModalImport();
                                        closeModal();
                                      }}
                                    >
                                      X
                                    </label>
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-wrap px-24">
                                <div className="w-full lg:w-1/12 px-4 margin-auto-t-b  ">
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
                                <div className="w-full lg:w-11/12 px-4 ">
                                  {/* <Select
                                    id="tbPointCodeHDId	"
                                    name="tbPointCodeHDId	"
                                    onChange={(value) => {
                                      formikImport.setFieldValue(
                                        "tbPointCodeHDId	",
                                        value.value
                                      );
                                    }}
                                    className="border-0 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                    options={optionCampaign}
                                    value={ValidateService.defaultValue(
                                      optionCampaign,
                                      formikImport.values.tbPointCodeHDId
                                    )}
                                    styles={useStyleSelect}
                                  />
                                  {isError ? (
                                    <div className="text-sm py-2 px-2 text-red-500">
                                      * กรุณาเลือก ชื่อแคมเปญ
                                    </div>
                                  ) : null} */}
                                  <input
                                    type="text"
                                    className="border-0 px-2 text-left py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded w-full text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                                    id="pointCodeName"
                                    name="pointCodeName"
                                    maxLength={100}
                                    onChange={(e) => {
                                      setIsModified(true);
                                      formikImport.handleChange(e);
                                    }}
                                    onBlur={formikImport.handleBlur}
                                    value={formikImport.values.pointCodeName}
                                    autoComplete="pointCodeName"
                                  />
                                </div>
                                <div
                                  className={
                                    "w-full lg:w-1/12 px-4 mb-4 " +
                                    (formikImport.errors.pointCodeName &&
                                    width < 764
                                      ? " hidden"
                                      : " block")
                                  }
                                ></div>
                                <div className="w-full lg:w-11/12 px-4 margin-auto-t-b">
                                  {formikImport.touched.pointCodeName &&
                                  formikImport.errors.pointCodeName ? (
                                    <div className="text-sm py-2 px-2 text-red-500">
                                      {formikImport.errors.pointCodeName}
                                    </div>
                                  ) : null}
                                </div>
                                <div className="w-full lg:w-1/12 px-4  margin-auto-t-b">
                                  <label
                                    className="text-blueGray-600 text-sm font-bold "
                                    htmlFor="grid-password"
                                  >
                                    เลือกไฟล์
                                  </label>
                                  <span className="text-sm ml-2 text-red-500">
                                    *
                                  </span>
                                </div>
                                <div className="w-full lg:w-11/12 px-4 margin-auto-t-b ">
                                  <div className="buttonIn image-upload ">
                                    <label
                                      htmlFor="file-input"
                                      className="cursor-pointer"
                                    >
                                      <input
                                        type="text"
                                        className={
                                          "border-0 px-2 text-left py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded w-full text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                                        }
                                        id="fileName"
                                        name="fileName"
                                        value={formikImport.values.fileName}
                                        readOnly
                                      />
                                      <span
                                        className={
                                          "spanUpload px-1 py-1 text-xs font-bold"
                                        }
                                      >
                                        <i className="fas fa-upload text-blueGray-600"></i>
                                      </span>
                                    </label>
                                    <input
                                      id="file-input"
                                      type="file"
                                      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                      onChange={(e) => {
                                        setIsModified(true);
                                        selectFile(e);
                                      }}
                                    />
                                  </div>
                                </div>
                                <div
                                  className={
                                    "w-full lg:w-1/12 px-4 mb-4 " +
                                    (errorImport && width < 764
                                      ? " hidden"
                                      : " block")
                                  }
                                ></div>
                                <div className="w-full lg:w-11/12 px-4 margin-auto-t-b">
                                  {errorImport ? (
                                    <div className="text-sm py-2 px-2 text-red-500">
                                      * กรุณาเลือกไฟล์สำหรับการ Import
                                    </div>
                                  ) : null}
                                  {errorExcel ? (
                                    <div className="text-sm py-2 px-2 text-red-500">
                                      * ประเภทไฟล์ที่เลือกไม่ถูกต้อง
                                      กรุณาเลือกไฟล์ใหม่
                                    </div>
                                  ) : null}
                                </div>
                                <div className="w-full lg:w-1/12 px-4"></div>
                                <div className="w-full lg:w-11/12 px-4 margin-auto-t-b"></div>
                                <div className="w-full lg:w-1/12 px-4 margin-auto-t-b  ">
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
                                <div className="w-full lg:w-5/12 px-4  ">
                                  <input
                                    type="text"
                                    className="border-0 px-2 text-right py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded w-full text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                                    id="pointCodePoint"
                                    name="pointCodePoint"
                                    maxLength={5}
                                    onChange={(event) => {
                                      setIsModified(true);
                                      setlangSymbo(
                                        ValidateService.onHandleNumber(event)
                                      );
                                      formikImport.values.pointCodePoint =
                                        ValidateService.onHandleNumber(event);
                                    }}
                                    onBlur={formikImport.handleBlur}
                                    autoComplete="pointCodePoint"
                                    value={formikImport.values.pointCodePoint}
                                  />
                                </div>
                                <div
                                  className={
                                    "w-full lg:w-6/12 px-4 mb-4 " +
                                    (width < 764 ? " hidden " : "  block")
                                  }
                                ></div>
                                <div
                                  className={
                                    "w-full lg:w-1/12 px-4 mb-4 " +
                                    (formikImport.errors.pointCodePoint &&
                                    width < 764
                                      ? " hidden "
                                      : "  block")
                                  }
                                ></div>
                                <div className="w-full lg:w-11/12 px-4 margin-auto-t-b">
                                  {formikImport.touched.pointCodePoint &&
                                  formikImport.errors.pointCodePoint ? (
                                    <div className="text-sm py-2 px-2 text-red-500">
                                      {formikImport.errors.pointCodePoint}
                                    </div>
                                  ) : null}
                                </div>
                                {/* <div className={"w-full mb-4"}></div> */}
                                <div className="w-full lg:w-1/12 px-4 margin-auto-t-b ">
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
                                          setIsModified(true);
                                          if (e === null) {
                                            formikImport.setFieldValue(
                                              "startDate",
                                              new Date(),
                                              false
                                            );
                                            setErrorStartDateImport(true);
                                          } else {
                                            if(ValidateService.withOutTime(e) > ValidateService.withOutTime(formikImport.values.endDate))
                                              setErrorDate(true);
                                            else  
                                              setErrorDate(false);

                                            setErrorStartDateImport(false);
                                            formikImport.setFieldValue(
                                              "startDate",
                                              moment(e).toDate(),
                                              false
                                            );
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
                                    {formikImport.touched.startDate &&
                                    formikImport.errors.startDate &&
                                    width < 764 ? (
                                      <div className="text-sm py-2 px-2 text-red-500">
                                        {formikImport.errors.startDate}
                                      </div>
                                    ) : null}
                                  </div>
                                </div>
                                <div
                                  className={
                                    "w-full mb-4" +
                                    (width < 764 ? " block" : " hidden")
                                  }
                                ></div>
                                <div className="w-full lg:w-1/12 px-4  margin-auto-t-b ">
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
                                        setIsModified(true);
                                        if (e === null) {
                                          setErrorEndDateImport(true);
                                          formikImport.setFieldValue(
                                            "endDate",
                                            new Date(),
                                            false
                                          );
                                        } else {
                                          setErrorEndDateImport(false);
                                          formikImport.setFieldValue(
                                            "endDate",
                                            moment(e).toDate(),
                                            false
                                          );
                                        }
                                      }}
                                      // value={moment(
                                      //   new Date(formikImport.values.endDate),
                                      //   "DD/MM/YYYY"
                                      // )}
                                    />
                                  </ConfigProvider>
                                  {formikImport.touched.endDate &&
                                  formikImport.errors.endDate &&
                                  width < 764 ? (
                                    <div className="text-sm py-2 px-2 text-red-500">
                                      {formikImport.errors.endDate}
                                    </div>
                                  ) : null}
                                </div>
                                <div
                                  className={
                                    width < 764 ? "hidden" : "w-full flex"
                                  }
                                >
                                  <div className="w-full lg:w-1/12 px-4 margin-auto-t-b "></div>
                                  <div className="w-full lg:w-5/12 px-4 margin-auto-t-b">
                                    {" "}
                                    {errorStartDateImport ? (
                                      <div className="text-sm py-2 px-2 text-red-500">
                                        * กรุณากรอกวันที่เริ่มต้น
                                      </div>
                                    ) : null}
                                    {errorDate ? (
                                      <div className="text-sm py-2 px-2 text-red-500">
                                        * วันที่เริ่มต้น
                                        ต้องน้อยกว่าวันที่สิ้นสุด
                                      </div>
                                    ) : null}
                                  </div>
                                  <div className="w-full lg:w-1/12 px-4  margin-auto-t-b "></div>
                                  <div className="w-full lg:w-5/12 px-4 margin-auto-t-b">
                                    {errorEndDateImport ? (
                                      <div className="text-sm py-2 px-2 text-red-500">
                                        * กรุณากรอกวันที่สิ้นสุด
                                      </div>
                                    ) : null}
                                  </div>
                                </div>

                                <div className="w-full lg:w-1/12 px-4 mb-2 mt-2">
                                  <label
                                    className="text-blueGray-600 text-sm font-bold mb-2"
                                    htmlFor="grid-password"
                                  ></label>
                                </div>

                                <div
                                  className={
                                    "w-full lg:w-11/12 px-4 " +
                                    (width < 764
                                      ? " "
                                      : "  mb-2 " +
                                        (errorStartDateImport
                                          ? "  mt-2"
                                          : " mt-4"))
                                  }
                                >
                                  <Radio.Group
                                    options={options}
                                    onChange={(e) => {
                                      setIsModified(true);
                                      setActive(e.target.value);
                                      formikImport.setFieldValue(
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
                                    {/* <button
                                      className="bg-rose-mbk text-white active:bg-rose-mbk font-bold uppercase text-sm px-2 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                                      type="button"
                                      onClick={() => {
                                        closeModalImport();
                                      }}
                                    >
                                      ย้อนกลับ
                                    </button> */}
                                    <button
                                      className={
                                        "bg-gold-mbk text-white active:bg-gold-mbk font-bold uppercase text-sm px-2 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                                      }
                                      type="button"
                                      onClick={() => {
                                        onValidate();
                                        formikImport.handleSubmit();
                                      }}
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
                <button
                  className="bg-lemon-mbk text-white active:bg-lemon-mbk font-bold  text-xs px-2 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none  ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => {
                    openModal();
                  }}
                >
                  <i className="fas fa-plus-circle text-white "></i>{" "}
                  <span className=" text-sm px-2">{"เพิ่ม"}แคมเปญ</span>
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
                            <form>
                              <div className=" flex justify-between align-middle ">
                                <div className=" align-middle  mb-3">
                                  <div className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-base text-green-mbk font-bold whitespace-nowrap p-4">
                                    <label>{(formik.values.id !== "") ? "แก้ไข" : "เพิ่ม"}แคมเปญ</label>
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
                                {/* <div className="w-full lg:w-1/12 px-4 margin-auto-t-b ">
                                  <label
                                    className="text-blueGray-600 text-sm font-bold mb-2"
                                    htmlFor="grid-password"
                                  >
                                    ประเภทโครงสร้าง
                                  </label>
                                </div>
                                <div className={"w-full lg:w-11/12 px-4 "}>
                                  <Radio.Group
                                    options={optionsImport}
                                    onChange={(e) => {
                                      setType(e.target.value);
                                      formik.setFieldValue(
                                        "isType",
                                        e.target.value
                                      );
                                      if (e.target.value === "2") {
                                        formik.setFieldValue(
                                          "pointCodeSymbol",
                                          ""
                                        );
                                        formik.setFieldValue(
                                          "pointCodeLengthSymbol",
                                          ""
                                        );
                                        formik.setFieldValue(
                                          "pointCodeQuantityCode",
                                          ""
                                        );
                                      }
                                      setIsEnable(
                                        e.target.value === "1" ? false : true
                                      );
                                    }}
                                    value={Type}
                                  />
                                </div>
                                <div className="w-full mb-4"></div> */}
                                <div className="w-full lg:w-1/12 px-4 margin-auto-t-b">
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
                                    className="border-0 px-2 text-left py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded w-full text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                                    id="pointCodeName"
                                    name="pointCodeName"
                                    maxLength={100}
                                    onChange={(e) => {
                                      setIsModified(true);
                                      formik.handleChange(e);
                                    }}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.pointCodeName}
                                    autoComplete="pointCodeName"
                                  />
                                </div>

                                <div
                                  className={
                                    "w-full lg:w-1/12 px-4 mb-4 " +
                                    (formik.errors.pointCodeName && width < 764
                                      ? " hidden"
                                      : " block")
                                  }
                                ></div>
                                <div className="w-full lg:w-11/12 px-4 margin-auto-t-b">
                                  {formik.touched.pointCodeName &&
                                  formik.errors.pointCodeName ? (
                                    <div className="text-sm py-2 px-2 text-red-500">
                                      {formik.errors.pointCodeName}
                                    </div>
                                  ) : null}
                                </div>

                                {/* <div className="w-full mb-4"></div> */}
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
                                <div className="w-full lg:w-5/12 px-4 margin-auto-t-b ">
                                  <input
                                    type="text"
                                    className="border-0 px-2 text-left py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded w-full text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                                    id="pointCodeSymbol"
                                    name="pointCodeSymbol"
                                    maxLength={5}
                                    onChange={(e) => {
                                      setIsModified(true);
                                      if (e.target.value.length > 0) {
                                        setErrorPointCodeSymbol(false);
                                      } else setErrorPointCodeSymbol(true);

                                      formik.handleChange(e);
                                    }}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.pointCodeSymbol}
                                    autoComplete="pointCodeSymbol"
                                    disabled={isEnable || enableCode}
                                  />
                                  {errorPointCodeSymbol && width < 764 ? (
                                    <div className="text-sm py-2 px-2 text-red-500">
                                      * กรุณากรอก รหัสแคมเปญ
                                    </div>
                                  ) : null}
                                </div>
                                <div
                                  className={
                                    "w-full mb-4" +
                                    (width < 764 ? " block" : " hidden")
                                  }
                                ></div>
                                <div className="w-full lg:w-1/12 px-4 margin-auto-t-b ">
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
                                <div className="w-full lg:w-5/12 px-4 margin-auto-t-b ">
                                  <input
                                    type="text"
                                    className="border-0 px-2 text-right py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded w-full text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                                    id="pointCodeLengthSymbol"
                                    name="pointCodeLengthSymbol"
                                    maxLength={2}
                                    onChange={(event) => {
                                      setIsModified(true);
                                      if (event.target.value.length > 0) {
                                        setErrorPointCodeLengthSymbol(false);
                                      } else
                                        setErrorPointCodeLengthSymbol(true);

                                      setlangSymbo(
                                        ValidateService.onHandleNumber(event)
                                      );
                                      formik.values.pointCodeLengthSymbol =
                                        ValidateService.onHandleNumber(event);
                                    }}
                                    onBlur={formik.handleBlur}
                                    autoComplete="pointCodeLengthSymbol"
                                    value={formik.values.pointCodeLengthSymbol}
                                    disabled={isEnable || enableCode}
                                  />
                                  {/* {formik.touched.pointCodeLengthSymbol &&
                                  formik.errors.pointCodeLengthSymbol &&
                                  width < 764 ? (
                                    <div className="text-sm py-2 px-2 text-red-500">
                                      {formik.errors.pointCodeLengthSymbol}
                                    </div>
                                  ) : null} */}
                                  {errorPointCodeLengthSymbol && width < 764 ? (
                                    <div className="text-sm py-2 px-2 text-red-500">
                                      * จำนวนตัวอักษรจะสามารถกำหนดได้ ตั้งแต่ 10
                                      - 16 ตัวอักษรเท่านั้น
                                    </div>
                                  ) : null}
                                </div>

                                <div
                                  className={
                                    width < 764 ? "hidden" : "w-full flex"
                                  }
                                >
                                  <div className="w-full lg:w-1/12 px-4 margin-auto-t-b "></div>
                                  <div className="w-full lg:w-5/12 px-4 margin-auto-t-b">
                                    {" "}
                                    {errorPointCodeSymbol ? (
                                      <div className="text-sm py-2  px-2 text-red-500">
                                        * กรุณากรอก รหัสแคมเปญ
                                      </div>
                                    ) : null}
                                  </div>
                                  <div className="w-full lg:w-1/12 px-4  margin-auto-t-b "></div>
                                  <div className="w-full lg:w-5/12 px-4 margin-auto-t-b">
                                    {/* {errorPointCodeLengthSymbol ? (
                                      <div className="text-sm py-2  px-2 text-red-500">
                                        {formik.errors.pointCodeLengthSymbol}
                                      </div>
                                    ) : null} */}
                                    {errorPointCodeLengthSymbol ? (
                                      <div className="text-sm pt-2  px-2 text-red-500">
                                        * จำนวนตัวอักษรจะสามารถกำหนดได้ ตั้งแต่
                                        10 - 16 ตัวอักษรเท่านั้น
                                      </div>
                                    ) : null}
                                  </div>
                                </div>

                                <div
                                  className={
                                    "w-full mb-4" +
                                    (errorPointCodeSymbol ? " hidden" : " ")
                                  }
                                ></div>

                                <div
                                  className={
                                    "w-full mb-4" +
                                    (width < 764 ? " block" : " hidden")
                                  }
                                ></div>
                                {/* <div className={"w-full mb-4"}></div> */}
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
                                <div className="w-full lg:w-5/12 px-4 margin-auto-t-b ">
                                  <input
                                    type="text"
                                    className="border-0 px-2 text-right py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded w-full text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                                    id="pointCodePoint"
                                    name="pointCodePoint"
                                    maxLength={5}
                                    onChange={(event) => {
                                      setIsModified(true);
                                      setlangSymbo(
                                        ValidateService.onHandleNumber(event)
                                      );
                                      formik.values.pointCodePoint =
                                        ValidateService.onHandleNumber(event);
                                    }}
                                    onBlur={formik.handleBlur}
                                    autoComplete="pointCodePoint"
                                    value={formik.values.pointCodePoint}
                                  />
                                  {formik.touched.pointCodePoint &&
                                  formik.errors.pointCodePoint &&
                                  width < 764 ? (
                                    <div className="text-sm py-2 px-2 text-red-500">
                                      {formik.errors.pointCodePoint}
                                    </div>
                                  ) : null}
                                </div>

                                <div
                                  className={
                                    "w-full flex" +
                                    (width < 764 ? " hidden" : " ")
                                  }
                                >
                                  <div className="w-full lg:w-1/12 px-4  margin-auto-t-b "></div>
                                  <div className="w-full lg:w-5/12 px-4 margin-auto-t-b">
                                    {formik.touched.pointCodePoint &&
                                    formik.errors.pointCodePoint ? (
                                      <div className="text-sm py-2 px-2  text-red-500">
                                        {formik.errors.pointCodePoint}
                                      </div>
                                    ) : null}
                                  </div>
                                </div>

                                <div
                                  className={
                                    "w-full mb-4" +
                                    (formik.errors.pointCodePoint &&
                                    formik.touched.pointCodePoint
                                      ? " hidden"
                                      : " ")
                                  }
                                ></div>

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
                                    className="border-0 px-2 text-right py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded w-full text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                                    id="pointCodeQuantityCode"
                                    name="pointCodeQuantityCode"
                                    maxLength={7}
                                    onChange={(event) => {
                                      setIsModified(true);
                                      if (event.target.value === "") {
                                        setErrorPointCodeQuantityCode(true);
                                      } else {
                                        setErrorPointCodeQuantityCode(false);
                                      }

                                      if (parseInt(event.target.value) === 0) {
                                        setErrorQuantityMoreOne(true);
                                      } else {
                                        setErrorQuantityMoreOne(false);
                                      }

                                      setlangSymbo(
                                        ValidateService.onHandleNumber(event)
                                      );
                                      formik.values.pointCodeQuantityCode =
                                        ValidateService.onHandleNumber(event);

                                      if (
                                        parseInt(event.target.value) > 1000000
                                      )
                                        seterrorPointQuantity(true);
                                      else seterrorPointQuantity(false);
                                    }}
                                    onBlur={formik.handleBlur}
                                    autoComplete="pointCodeQuantityCode"
                                    value={formik.values.pointCodeQuantityCode}
                                    disabled={isEnable || enableCode}
                                  />
                                  {errorPointCodeQuantityCode && width < 764 ? (
                                    <div className="text-sm py-2 px-2 text-red-500">
                                      * กรุณากรอก จำนวน Code
                                    </div>
                                  ) : null}
                                  {errorPointQuantity && width < 764 ? (
                                    <div className="text-sm pt-2  px-2 text-red-500">
                                      * จำนวน Code ต้องน้อยกว่าเท่ากับ 1 ล้าน
                                    </div>
                                  ) : null}
                                  {errorQuantityMoreOne && width < 764 ? (
                                    <div className="text-sm pt-2  px-2 text-red-500">
                                      * จำนวน Code ต้องมากกว่า 0
                                    </div>
                                  ) : null}
                                </div>

                                <div
                                  className={
                                    "w-full flex" +
                                    (width < 764 ? " hidden" : " ")
                                  }
                                >
                                  <div className="w-full lg:w-1/12 px-4  margin-auto-t-b "></div>
                                  <div className="w-full lg:w-5/12 px-4 margin-auto-t-b">
                                    {errorPointCodeQuantityCode ? (
                                      <div className="text-sm py-2 px-2 text-red-500">
                                        * กรุณากรอก จำนวน Code
                                      </div>
                                    ) : null}
                                    {errorPointQuantity ? (
                                      <div className="text-sm pt-2  px-2 text-red-500">
                                        * จำนวน Code ต้องน้อยกว่าเท่ากับ 1 ล้าน
                                      </div>
                                    ) : null}
                                    {errorQuantityMoreOne ? (
                                      <div className="text-sm pt-2  px-2 text-red-500">
                                        * จำนวน Code ต้องมากกว่า 0
                                      </div>
                                    ) : null}
                                  </div>
                                </div>

                                <div
                                  className={
                                    "w-full mb-4" +
                                    (errorPointCodeQuantityCode
                                      ? " hidden"
                                      : " ")
                                  }
                                ></div>

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
                                          setIsModified(true);
                                          if (e === null) {
                                            setErrorStartDate(true);
                                            formik.setFieldValue(
                                              "startDate",
                                              new Date(),
                                              false
                                            );
                                          } else {
                                            setErrorStartDate(false);
                                            formik.setFieldValue(
                                              "startDate",
                                              moment(e).toDate(),
                                              false
                                            );
                                          }
                                        }}
                                        // value={moment(
                                        //   new Date(formik.values.startDate),
                                        //   "DD/MM/YYYY"
                                        // )}
                                      />
                                    </ConfigProvider>
                                    {errorStartDate && width < 764 ? (
                                      <div className="text-sm py-2 px-2 text-red-500">
                                        * กรุณากรอกวันที่เริ่มต้น
                                      </div>
                                    ) : null}
                                  </div>
                                </div>
                                <div
                                  className={
                                    "w-full mb-4" +
                                    (width < 764 && !errorStartDate
                                      ? " block"
                                      : " hidden")
                                  }
                                ></div>
                                <div className="w-full lg:w-1/12 px-4 margin-auto-t-b ">
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
                                        setIsModified(true);
                                        if (e === null) {
                                          setErrorEndDate(true);
                                          formik.setFieldValue(
                                            "endDate",
                                            new Date(),
                                            false
                                          );
                                        } else {
                                          setErrorEndDate(false);
                                          formik.setFieldValue(
                                            "endDate",
                                            moment(e).toDate(),
                                            false
                                          );
                                        }
                                      }}
                                      // value={moment(
                                      //   new Date(formik.values.endDate),
                                      //   "DD/MM/YYYY"
                                      // )}
                                    />
                                  </ConfigProvider>
                                  {errorEndDate && width < 764 ? (
                                    <div className="text-sm py-2 px-2 text-red-500">
                                      * กรุณากรอกวันที่สิ้นสุด
                                    </div>
                                  ) : null}
                                </div>

                                <div
                                  className={
                                    width < 764 ? "hidden" : "w-full flex"
                                  }
                                >
                                  <div className="w-full lg:w-1/12 px-4 margin-auto-t-b "></div>
                                  <div className="w-full lg:w-5/12 px-4 margin-auto-t-b">
                                    {" "}
                                    {errorStartDate ? (
                                      <div className="text-sm py-2 px-2 text-red-500">
                                        * กรุณากรอกวันที่เริ่มต้น
                                      </div>
                                    ) : null}
                                    {errorDate ? (
                                      <div className="text-sm py-2 px-2 text-red-500">
                                        * วันที่เริ่มต้น
                                        ต้องน้อยกว่าวันที่สิ้นสุด
                                      </div>
                                    ) : null}
                                  </div>
                                  <div className="w-full lg:w-1/12 px-4  margin-auto-t-b "></div>
                                  <div className="w-full lg:w-5/12 px-4 margin-auto-t-b">
                                    {errorEndDate ? (
                                      <div className="text-sm py-2 px-2 text-red-500">
                                        * กรุณากรอกวันที่สิ้นสุด
                                      </div>
                                    ) : null}
                                  </div>
                                </div>
                                <div
                                  className={"w-full lg:w-1/12 px-4 mb-2 mt-2"}
                                >
                                  <label
                                    className="text-blueGray-600 text-sm font-bold mb-2"
                                    htmlFor="grid-password"
                                  ></label>
                                </div>
                                <div
                                  className={
                                    "w-full lg:w-11/12 px-4 " +
                                    (width < 764
                                      ? " "
                                      : "  mb-2" +
                                        (errorStartDate ? "  mt-2" : " mt-4"))
                                  }
                                >
                                  <Radio.Group
                                    options={options}
                                    onChange={(e) => {
                                      setIsModified(true);
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
                                    {/* <button
                                      className="bg-rose-mbk text-white active:bg-rose-mbk font-bold uppercase text-sm px-2 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                                      type="button"
                                      onClick={() => {
                                        // setIsOpenEdit(true)
                                        closeModal();
                                      }}
                                    >
                                      ย้อนกลับ
                                    </button> */}
                                    <button
                                      className={
                                        "bg-gold-mbk text-white active:bg-gold-mbk font-bold uppercase text-sm px-2 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                                      }
                                      // type="submit"
                                      type="button"
                                      onClick={() => {
                                        onValidate();
                                        formik.handleSubmit();
                                      }}
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
                          <span className="px-4 margin-a">
                            {pagesVisited + key + 1}
                          </span>
                        </td>
                        <td
                          onClick={() => {
                            openModal(value.id);
                          }}
                          className=" focus-within:border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-left cursor-pointer"
                        >
                          <span
                            title={value.pointCodeName}
                            className="text-gray-mbk  hover:text-gray-mbk "
                          >
                            {value.pointCodeName}
                          </span>
                          <span className="details">more info here</span>
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
                          {value.isActive === "2" ? "Inactive" : "Active"}
                        </td>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center">
                          <span className="text-gray-mbk  hover:text-gray-mbk ">
                            {value.codeCount}
                          </span>
                        </td>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center">
                          <span className="text-gray-mbk  hover:text-gray-mbk ">
                            {value.useCount}
                          </span>
                        </td>
                        <td
                          onClick={() => {
                            ExportFile(value.id, value.pointCodeName,value.pointCodePoint,value.startDate,value.endDate);
                          }}
                          className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center cursor-pointer"
                        >
                          <span className="text-gray-mbk  hover:text-gray-mbk ">
                            <img
                              src={require("assets/img/mbk/excel.png").default}
                              alt="..."
                              className="imgExcel margin-a"
                            ></img>
                          </span>
                        </td>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center">
                          <i
                            className="fas fa-trash text-red-500 cursor-pointer"
                            onClick={() => {
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
              message={" แคมเปญ"}
              hideModal={() => {
                closeModalSubject();
              }}
              confirmModal={(e) => {
                deleteUser(deleteValue);
              }}
            />
          </div>
          <div className="px-4">
            <div className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap ">
              <div
                className="lg:w-6/12 font-bold"
                style={{ alignSelf: "stretch" }}
              >
                {pagesVisited + 10 > listPointCode.length
                  ? listPointCode.length
                  : pagesVisited + 10}{" "}
                {"/"}
                {listPointCode.length} รายการ
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
      <ConfirmEdit
        showModal={modalIsOpenEdit}
        message={"แคมเปญ"}
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
    </>
  );
}
