import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import ConfirmDelete from "components/ConfirmDialog/ConfirmDelete";
import Modal from "react-modal";
import Info from "./info";
import axios from "services/axios";
import { useDispatch } from "react-redux";
import { fetchLoading, fetchSuccess } from "redux/actions/common";
import { useToasts } from "react-toast-notifications";
import FilesService from "services/files";
import * as fn from "@services/default.service";
const List = ({
  dataList,
  fetchData,

  pageNumber,
  setPageNumber,
  forcePage,
  setForcePage,
}) => {
  Modal.setAppElement("#root");
  const dispatch = useDispatch();
  const thClass =
    "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 ";
  const tdClass =
    "border-t-0 px-2 align-middle border-b border-l-0 border-r-0 p-3 text-sm whitespace-nowrap";
  const tdSpan = "text-gray-mbk ";
  const { addToast } = useToasts();

  const [infoModel, setinfoModel] = useState({ open: false });
  const [openConfirmDelete, setopenConfirmDelete] = useState({ open: false });

  const usersPerPage = 10;
  const pagesVisited = pageNumber * usersPerPage;
  const pageCount = Math.ceil(dataList.length / usersPerPage) || 1;

  const changePage = ({ selected }) => {
    setPageNumber(selected);
    setForcePage(selected);
  };

  const openModal = async (id) => {
    dispatch(fetchLoading());
    await axios
      .get("productCategory/byId/" + id)
      .then(async (res) => {
        let tbProductCategory = res.data.tbProductCategory;
        tbProductCategory.dataImage =
          tbProductCategory.dataImage == null
            ? null
            : await FilesService.buffer64UTF8(tbProductCategory.dataImage);
        tbProductCategory.errors = { categoryName: null };
        setinfoModel({
          open: true,
          dataModel: tbProductCategory,
          onClose: () => {
            fetchData();
            setinfoModel({ open: false });
          },
        });
      })
      .finally(() => {
        dispatch(fetchSuccess());
      });
  };
  const Delete = (id) => {
    dispatch(fetchLoading());
    axios
      .delete(`productCategory/${id}`)
      .then(async (res) => {
        if (res.data.status) {
          addToast("??????????????????????????????????????????", {
            appearance: "success",
            autoDismiss: true,
          });
          await fetchData();
         
        } else {
          addToast("?????????????????????????????????????????????????????????????????????????????????????????????", {
            appearance: "warning",
            autoDismiss: true,
          });
        }
      })
      .finally(() => {
        dispatch(fetchSuccess());
      });
  };
  const _thList = [
    "????????????????????????",
    "??????????????????????????????????????????????????????",
    "??????????????????????????????",
    "????????????????????????????????????",
    "??????????????????",
  ];

  return (
    <>
      <div className="block w-full overflow-x-auto  px-4 py-2">
        <table className="items-center w-full border ">
          <thead>
            <tr>
              {_thList.map((item, index) => {
                return (
                  <th
                    key={index}
                    className={
                      thClass +
                      (item === "????????????????????????" ||
                      item === "????????????????????????????????????" ||
                      item === "??????????????????"
                        ? " text-center"
                        : item === "????????????????????????"
                        ? " text-right"
                        : "")
                    }
                    style={{
                      width:
                        item === "????????????????????????" || item === "??????????????????" ? "50px" : "",
                    }}
                  >
                    {item}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {dataList
              .slice(pagesVisited, pagesVisited + usersPerPage)
              .map((value, key) => {
                return (
                  <tr key={key} className="cursor-pointer">
                    <td className={tdClass + " text-center"}>
                      <span className="px-4 margin-a">
                        {pagesVisited + key + 1}
                      </span>
                    </td>
                    <td
                      className={tdClass + " cursor-pointer"}
                      onClick={() => {
                        openModal(value.id);
                      }}
                    >
                      <span>{value.categoryName}</span>
                    </td>
                    <td
                      className={tdClass}
                      onClick={() => {
                        openModal(value.id);
                      }}
                      title={
                        fn.IsNullOrEmpty(value.description)
                          ? "-"
                          : value.description
                      }
                    >
                      <span className={tdSpan}>
                        {fn.IsNullOrEmpty(value.description)
                          ? "-"
                          : value.description}
                      </span>
                    </td>
                    <td
                      className={tdClass + " text-center"}
                      onClick={() => {
                        openModal(value.id);
                      }}
                    >
                      <span className={tdSpan}>
                        {value.isInactive ? "?????????????????????" : "????????????"}
                      </span>
                    </td>
                    <td className={tdClass + " text-center"}>
                      <i
                        className="fas fa-trash text-red-500 cursor-pointer"
                        onClick={() => {
                          setopenConfirmDelete({
                            open: true,
                            id: value.id,
                            name: value.categoryName,
                          });
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
          <div className="lg:w-6/12 font-bold" style={{ alignSelf: "stretch" }}>
            {pagesVisited + 10 > dataList.length
              ? dataList.length
              : pagesVisited + 10}
            {"/"}
            {dataList.length} ??????????????????
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
      {infoModel.open ? <Info infoModel={infoModel} /> : null}
      <ConfirmDelete
        showModal={openConfirmDelete.open}
        message={"??????????????????????????????????????????" + openConfirmDelete.name}
        hideModal={() => {
          setopenConfirmDelete({ open: false });
        }}
        returnModal={() => {
          setopenConfirmDelete({ open: false });
        }}
        confirmModal={() => {
          Delete(openConfirmDelete.id);
          setopenConfirmDelete({ open: false });
        }}
      />
    </>
  );
};

export default List;
