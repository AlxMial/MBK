import React, { useState, useEffect } from "react";
import axios from "services/axios";
import { useToasts } from "react-toast-notifications";
/* Service */
import useWindowDimensions from "services/useWindowDimensions";
import "antd/dist/antd.css";
import "moment/locale/th";
import useMenu from "services/useMenu";
import InputSearchUC from "components/InputSearchUC";
import GameInfo from "./GameInfo";
import ConfirmDialog from "components/ConfirmDialog/ConfirmDialog";
import FilesService from "services/files";
import CheckBoxUC from "components/CheckBoxUC";

const GameList = ({ id, setListGame, listGame }) => {
  const { width } = useWindowDimensions();
  const [delay, setDelay] = useState();
  // const [listGame, setlistGame] = useState([]);
  const [listSearch, setListSerch] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const [modalName, setModalName] = useState("");
  const [modalData, setModalData] = useState({ couponName: "" });
  const usersPerPage = 10;
  const pagesVisited = pageNumber * usersPerPage;
  const { menu } = useMenu();
  const [deleteValue, setDeleteValue] = useState("");
  const [modalIsOpenSubject, setIsOpenSubject] = useState(false);
  const [rewardValue, setRewardValue] = useState("");
  const [index, setIndex] = useState();
  const { addToast } = useToasts();
  const InputSearch = (e) => {
    e = e.toLowerCase();
    if (e === "") {
      setListGame(listSearch);
    } else {
      setListGame(
        listSearch.filter((x) => {
          if (x.data.rewardType === "1") {
            x.data.couponName.toLowerCase().includes(e);
          } else if (x.data.rewardType === "2") {
            x.data.productName.toLowerCase().includes(e);
          }
        })
      );
    }
  };

  const deleteGame = (e, type) => {
    axios
      .post("redemptions/redemptionsGame", { rewardId: e, rewardType: type })
      .then(() => {
        setListGame(
          listGame.filter((val) => {
            return val.id !== e;
          })
        );
        addToast("ลบข้อมูลสำเร็จ", {
          appearance: "success",
          autoDismiss: true,
        });
        closeModalSubject();
      });
  };

  /* Modal */
  function openModalSubject(id, type) {
    setDeleteValue(id);
    setRewardValue(type);
    setIsOpenSubject(true);
  }

  function closeModalSubject() {
    setIsOpenSubject(false);
  }

  const OpenModal = (value, key) => {
    setIndex(key);
    setModalData(value);
    setOpen(true);
  };

  const handleSubmitModal = (data) => {
    if (data.id) {
      setListGame((s) => {
        const newArr = s.slice();
        newArr[index] = data;
        return newArr;
      });
      setListSerch((s) => {
        const newArr = s.slice();
        newArr[index] = data;
        return newArr;
      });
    } else {
      setListGame((s) => {
        return [...s, data];
      });
      setListSerch((s) => {
        return [...s, data];
      });
    }
    setOpen(false);
  };

  const handleChange = (e,key) => {
    const { checked } = e.target;
    setListGame((s) => {
      const newArr = s.slice();
      newArr[key].isSelect = checked;
      return newArr;
    });
  };

  useEffect(() => {
    /* Default Value for Testing */
  }, []);

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 border bg-white rounded-lg ">
        <div className="flex-auto lg:px-8 py-6">
          <div className="flex justify-between py-2 ">
            <InputSearchUC onChange={(e) => InputSearch(e.target.value)} />
            <div
              className={
                "margin-auto-t-b" + (width < 764 ? " hidden" : " block")
              }
            >
              <div className="w-full">
                <div className="relative w-full text-right">
                  <button
                    className={
                      " bg-gold-mbk text-white active:bg-gold-mbk font-bold uppercase text-sm px-2 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150 "
                    }
                    type="button"
                    onClick={() => {
                      setOpen(true);
                    }}
                  >
                    เพิ่มของสัมนาคุณ
                  </button>
                </div>
              </div>
            </div>
            <div
              className={
                "margin-auto-t-b" + (width < 764 ? " block" : " hidden")
              }
            >
              <button
                className="flex items-center py-4  w-full text-base font-normal bg-transparent outline-none button-focus"
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
                        onClick={() => {}}
                        className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white font-bold text-sm w-8/12"
                      >
                        <i className="fas fa-save mr-2"></i>
                        บันทึก
                      </span>
                    </div>
                  </li>
                  <li>
                    <div className="flex flex-wrap" id="back">
                      <span
                        onClick={() => {}}
                        id="back"
                        className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white font-bold text-sm w-8/12"
                      >
                        <i className="fas fa-arrow-left mr-2"></i>
                        ย้อนกลับ
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap">
            <table className="items-center w-full border ">
              <thead>
                <tr>
                  <th
                    className={
                      "px-6 align-middle border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-center bg-blueGray-50 text-blueGray-500 w-8"
                    }
                  >
                    เลือก
                  </th>
                  <th
                    className={
                      "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 "
                    }
                  >
                    รายละเอียด
                  </th>
                  <th
                    className={
                      "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-center bg-blueGray-50 text-blueGray-500 "
                    }
                  ></th>
                </tr>
              </thead>

              <tbody>
                {listGame
                  .slice(pagesVisited, pagesVisited + usersPerPage)
                  .map((value, key) => {
                    return (
                      <tr key={key}>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 p-3 text-sm whitespace-nowrap text-center w-8 " style={{paddingLeft:'25px'}}>
               
                            <CheckBoxUC onChange={(e) => { handleChange(e,key) }} checked={value.isSelect} name="isSelect"/>
    
                        </td>
                        <td
                          onClick={() => {
                            OpenModal(value, key);
                          }}
                          className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-left cursor-pointer"
                        >
                          {value.rewardType === "1"
                            ? value.couponName
                            : value.productName}
                        </td>
                        <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center cursor-pointer">
                          <i
                            className="fas fa-trash text-red-500 cursor-pointer"
                            onClick={() => {
                              openModalSubject(value.id, value.rewardType);
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
      <ConfirmDialog
        showModal={modalIsOpenSubject}
        message={"กำหนด Game"}
        hideModal={() => {
          closeModalSubject();
        }}
        confirmModal={() => {
          deleteGame(deleteValue, rewardValue);
        }}
      />
      {open && (
        <GameInfo
          name={modalName}
          open={open}
          modalData={modalData}
          handleSubmitModal={handleSubmitModal}
          handleModal={() => setOpen(false)}
        />
      )}
    </>
  );
};
export default GameList;
