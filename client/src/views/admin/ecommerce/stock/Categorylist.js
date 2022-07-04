import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import axios from "services/axios";
import Modal from "react-modal";
import { fetchLoading } from "redux/actions/common";
import { useDispatch } from "react-redux";
import { fetchSuccess } from "redux/actions/common";
import ConfirmDelete from "components/ConfirmDialog/ConfirmDelete";
import ModalHeader from "views/admin/ModalHeader";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    padding: "0%",
    transform: "translate(-50%, -50%)",
    overflowY: "auto",
    overflowX: "auto",
    backgroundColor: "white",
    border: "1px solid #047a40",
    //   height:"80vh",
    width: "45vw",
    maxWidth: "75vw",
  },
  overlay: { zIndex: 300, backgroundColor: "rgba(70, 70, 70, 0.5)" },
};

function Categorylist({
  showModal,
  hideModal,
  afterOpenModal,
  listCategory,
  setProductCategoryList,
}) {
  const thClass =
    "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 ";
  const tdClass =
    "border-t-0 px-2 align-middle border-b border-l-0 border-r-0 p-3 text-sm whitespace-nowrap";
  const tdSpan = "text-gray-mbk  hover:text-gray-mbk ";
  const [open, setOpen] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const usersPerPage = 10;
  const pagesVisited = pageNumber * usersPerPage;
  const pageCount = Math.ceil(listCategory.length / usersPerPage);
  const [deleteValue, setDeleteValue] = useState("");
  const dispatch = useDispatch();

  const deleteCategory = (id) => {
    dispatch(fetchLoading());
    axios.delete(`/productCategory/${id}`).then(() => {
        setProductCategoryList(
        listCategory.filter((val) => {
          return val.value !== id;
        })
      );
    });
    setOpen(false);
    dispatch(fetchSuccess());
  };

  const handleDeleteList = (id) => {
    setDeleteValue(id);
    setOpen(true);
  };
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  return (
    <>
      <Modal
        isOpen={showModal}
        onAfterOpen={afterOpenModal}
        onRequestClose={hideModal}
        style={customStyles}
        contentLabel="Example Modal"
        shouldCloseOnOverlayClick={false}
      >
        <div className="flex flex-wrap">
          <div className="w-full ">
            <>
              <ModalHeader
                title="ข้อมูลหมวดหมู่สินค้า"
                handleModal={hideModal}
              />
              <div className="block w-full overflow-x-auto  px-4 py-2">
                {/* Projects table */}
                <table className="items-center w-full border ">
                  <thead>
                    <tr>
                      <th className={thClass + " text-center"}>ลำดับที่</th>
                      <th className={thClass}>หมวดหมู่สินค้า</th>
                      <th className={thClass + " text-center"}>จัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listCategory
                      .slice(pagesVisited, pagesVisited + usersPerPage)
                      .map(function (value, key) {
                        return (
                          <tr key={key} className="cursor-pointer">
                            <td className={tdClass + " text-center"}>
                              <span className="px-4 margin-a">
                                {pagesVisited + key + 1}
                              </span>
                            </td>

                            <td className={tdClass + " cursor-pointer"}>
                              <span className={tdSpan}>{value.label}</span>
                            </td>
                            <td
                              className={
                                tdClass + " cursor-pointer text-center"
                              }
                            >
                              <i
                                className="fas fa-trash text-red-500 cursor-pointer"
                                onClick={() => {
                                  handleDeleteList(value.value);
                                }}
                              ></i>
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
                    {pagesVisited + 10 > listCategory.length
                      ? listCategory.length
                      : pagesVisited + 10}{" "}
                    {"/"}
                    {listCategory.length} รายการ
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
              {open && (
                <ConfirmDelete
                  showModal={open}
                  message={"จัดการข้อมูลสินค้า"}
                  hideModal={() => {
                    setOpen(false);
                  }}
                  confirmModal={() => {
                    deleteCategory(deleteValue);
                  }}
                />
              )}
            </>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default Categorylist;
