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
import * as Storage from "../../../services/Storage.service";
import ConfirmDialog from "components/ConfirmDialog/ConfirmDialog";
import {
  customEcomStyles,
  customStylesMobile,
} from "assets/styles/theme/ReactModal";
/* Service */
import useWindowDimensions from "services/useWindowDimensions";
import ValidateService from "services/validateValue";

export default function PointStore() {
  /* Set useState */
  const [Active, setActive] = useState("1");
  const [score, setScore] = useState(0);
  const { height, width } = useWindowDimensions();
  const [listStore, setlistStore] = useState([]);
  const [listSearch, setListSerch] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [isNew, setIsNew] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);
  const usersPerPage = 10;
  const pagesVisited = pageNumber * usersPerPage;
  const useStyle = customEcomStyles();
  const useStyleMobile = customStylesMobile();
  const pageCount = Math.ceil(listStore.length / usersPerPage);
  const [langSymbo, setlangSymbo] = useState("");
  const [deleteValue, setDeleteValue] = useState("");
  const [modalIsOpenSubject, setIsOpenSubject] = useState(false);
  const { addToast } = useToasts();
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  /* Method Condition */
  const options = [
    { label: "Active", value: "1" },
    { label: "Inactive", value: "2" },
  ];

  function openModal(id) {
    if (id) {
      fetchDataById(id);
      setIsNew(false);
    } else {
      setArr([]);
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
  function openModalSubject(id) {
    setDeleteValue(id);
    setIsOpenSubject(true);
  }

  function closeModalSubject() {
    setIsOpenSubject(false);
  }

  const InputSearch = (e) => {
    if (e === "") {
      setlistStore(listSearch);
    } else {
      setlistStore(
        listStore.filter(
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
      pointStoreName: "",
      isDeleted: false,
    },
    validationSchema: Yup.object({
      pointStoreName: Yup.string().required(
        Storage.GetLanguage() === "th"
          ? "* กรุณากรอก ชื่อร้านค้า"
          : "* Please enter your Store Name"
      ),
    }),
    onSubmit: (values) => {
      if (isNew) {
        values["branch"] = arr;
        axios.post("pointStore", values).then((res) => {
          if (res.data.status) {
            formik.values.id = res.data.tbPointStoreHD.id;
            fetchData();
            addToast(
              Storage.GetLanguage() === "th"
                ? "บันทึกข้อมูลสำเร็จ"
                : "Save data successfully",
              { appearance: "success", autoDismiss: true }
            );
          } else {
            if (res.data.isPointStoreName) {
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
        values["branch"] = arr;
        axios.put("pointStore", values).then((res) => {
          if (res.data.status) {
            fetchData();
            addToast(
              Storage.GetLanguage() === "th"
                ? "บันทึกข้อมูลสำเร็จ"
                : "Save data successfully",
              { appearance: "success", autoDismiss: true }
            );
          } else {
            if (res.data.isPointStoreName) {
              addToast(
                "บันทึกข้อมูลไม่สำเร็จ เนื่องจากชื่อร้านค้าเคยมีการบันทึกเรียบร้อยแล้ว",
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

  const deleteUser = (e) => {
    axios.delete(`/pointStore/${e}`).then(() => {
      setlistStore(
        listStore.filter((val) => {
          return val.id !== e;
        })
      );
      closeModalSubject();
    });
  };

  const fetchDataById = async (id) => {
    let response = await axios.get(`/pointStore/byId/${id}`);
    let pointStore = await response.data.tbPointStoreHD;
    let pointStoreDT = await response.data.tbPointStoreDT;
    if (pointStore !== null) {
      for (var columns in response.data.tbPointStoreHD) {
        formik.setFieldValue(
          columns,
          response.data.tbPointStoreHD[columns],
          false
        );
      }
      let storeDt = [];
      var i = 0;
      await pointStoreDT.forEach((field) => {
        storeDt.push({
          type: "text",
          id: field.id,
          value: field.pointBranchName,
        });
        i++;
      });
      setArr(storeDt);
    }
  };

  const fetchData = async () => {
    axios.get("pointStore").then((response) => {
      if (response.data.error) {
      } else {
        setlistStore(response.data.tbPointStoreHD);
        setListSerch(response.data.tbPointStoreHD);
      }
    });
  };

  const inputArr = [];

  const [arr, setArr] = useState(inputArr);

  const addInput = () => {
    setArr((s) => {
      return [
        ...s,
        {
          type: "text",
          value: "",
          id:"",
        },
      ];
    });
  };

  const handleRemove = (index) => {
    const rows = [...arr];
    rows.splice(index, 1);
    setArr(rows);
  };

  const handleChangeBranch = (e) => {
    e.preventDefault();

    const index = e.target.id;
    setArr((s) => {
      const newArr = s.slice();
      newArr[index].value = e.target.value;

      return newArr;
    });
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
            " py-4 relative flex flex-col min-w-0 break-words w-full mb-6 border rounded-b bg-white"
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
                  <span className="text-sm px-2">เพิ่มร้านค้า</span>
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
                                    <label>เพิ่มร้านค้า</label>
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-wrap px-24 mb-6">
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
                                    ชื่อร้านค้า
                                  </label>
                                  <span className="text-sm ml-2 text-red-500">
                                    *
                                  </span>
                                </div>
                                <div className="w-full lg:w-11/12 px-4 margin-auto-t-b">
                                  <input
                                    type="text"
                                    className="border-0 px-2 text-left py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded w-full  text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                                    id="pointStoreName"
                                    name="pointStoreName"
                                    maxLength={100}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.pointStoreName}
                                    autoComplete="pointStoreName"
                                  />
                                  {formik.touched.pointStoreName &&
                                  formik.errors.pointStoreName ? (
                                    <div className="text-sm pt-2 px-2 text-red-500">
                                      {formik.errors.pointStoreName}
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                              <div className="w-full px-24">
                                <div
                                  className={
                                    " py-4 relative flex flex-col min-w-0 break-words w-full mb-6 border rounded-b bg-white OverflowModal-info"
                                  }
                                >
                                  <div className="rounded-t mb-0 px-4 border-0">
                                    <div className="w-full mx-autp items-center ">
                                      <div className="flex flex-wrap w-full">
                                        <div className="w-full mb-3 flex justify-between">
                                          <div>
                                            <label className="text-blueGray-600 text-sm font-bold "></label>
                                          </div>
                                          <div>
                                            <button
                                              className={
                                                "bg-gold-mbk text-white active:bg-gold-mbk font-bold uppercase text-sm px-2 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                                              }
                                              onClick={addInput}
                                              type="button"
                                            >
                                              เพิ่มข้อมูลสาขา
                                            </button>
                                          </div>
                                        </div>

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
                                                ชื่อสาขา
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
                                            {arr.map((item, i) => {
                                              return (
                                                <tr key={i}>
                                                  <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 p-3 text-sm whitespace-nowrap text-center w-8">
                                                    <span className="px-4 margin-a">
                                                      {i + 1}
                                                    </span>
                                                  </td>
                                                  <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-left cursor-pointer">
                                                    <div className="w-full margin-auto-t-b">
                                                      <input
                                                        onChange={
                                                          handleChangeBranch
                                                        }
                                                        value={item.value}
                                                        id={i}
                                                        maxLength={100}
                                                        type={item.type}
                                                        className="border-0 margin-auto-t-b px-2 text-left py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded w-full  text-sm  focus:outline-none focus:ring ease-linear transition-all duration-150"
                                                      />
                                                    </div>
                                                  </td>
                                                  <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center cursor-pointer">
                                                    <i
                                                      className="fas fa-trash text-red-500 cursor-pointer"
                                                      onClick={() => {
                                                        handleRemove(i);
                                                      }}
                                                    ></i>
                                                  </td>
                                                </tr>
                                              );
                                            })}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  </div>
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
                    ชื่อร้าน
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
                {listStore
                  .slice(pagesVisited, pagesVisited + usersPerPage)
                  .map(function (value, key) {
                    return (
                      <tr key={key}>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 p-3 text-sm whitespace-nowrap text-center w-8">
                          <span className="px-4 margin-a">{key + 1}</span>
                        </td>
                        <td
                          onClick={() => {
                            openModal(value.id);
                          }}
                          className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-left cursor-pointer"
                        >
                          {value.pointStoreName}
                        </td>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center cursor-pointer">
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
              message={"จัดการข้อมูล Code"}
              hideModal={() => {
                closeModalSubject();
              }}
              confirmModal={(e) => {
                deleteUser(deleteValue);
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
            />
          </div>
        </div>
      </div>
    </>
  );
}
