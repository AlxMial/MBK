import React, { useEffect, useState, useRef } from "react";
import Modal from "react-modal";
import {
  customStyles,
  customStylesMobile,
} from "assets/styles/theme/ReactModal";
import LabelUC from "components/LabelUC";
import useWindowDimensions from "services/useWindowDimensions";
import { Radio } from "antd";
import Select from "react-select";
import ValidateService from "services/validateValue";
import FilesService from "services/files";
import axios from "services/axios";
import ModalHeader from "views/admin/ModalHeader";
import { styleSelect } from "assets/styles/theme/ReactSelect.js";
import ProfilePictureUC from "components/ProfilePictureUC";

const BannerModal = ({
  open,
  handleModal,
  name,
  modalData,
  handleSubmitModal,
}) => {
  Modal.setAppElement("#root");
  const useStyle = customStyles();
  const useStyleMobile = customStylesMobile();
  const { width } = useWindowDimensions();
  const UseStyleSelect = styleSelect();

  const [typeLink, setTypeLink] = useState(
    modalData ? modalData.typeLink : false
  ); //Radio button
  const [stockList, setStockList] = useState([]);
  const [productCategoryList, setProductCategoryList] = useState([]);
  const [productCategoryId, setProductCategoryId] = useState(
    modalData ? modalData.productCategoryId : ""
  ); // หมวดหมู่
  const [stockId, setStockId] = useState(modalData ? modalData.stockId : ""); // สินค้า
  const [dropdown, setDropdown] = useState([{
    dropDown: [],
  }]);
  //   const [dropdownId, setDropdownId] = useState(null);
  const [showErr, setShowErr] = useState(false);

  const typeLinkList = [
    { label: "ไม่กำหนด", value: 0 },
    { label: "หมวดหมู่สินค้า", value: 1 },
    { label: "สินค้า", value: 2 },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const inputArr = [
    {
      type: "text",
      value: "",
      picture: "",
      option: 0,
      categoryId: "",
      id: "",
    },
  ];

  const [arr, setArr] = useState(inputArr);

  const addInput = () => {
    if (arr.length < 6) {
      setArr((s) => {
        return [
          ...s,
          {
            type: "text",
            value: "",
            picture: "",
            option: 0,
            categoryId: "",
            id: "",
          },
        ];
      });

      setDropdown((s) => {
        return [
          ...s,
          {
            dropDown: [],
          },
        ];
      });
    }
  };

  const handleRemove = (index) => {
    const rows = [...arr];
    const rowsDownload = [...arr];
    rows.splice(index, 1);
    rowsDownload.slice(index,1);
    setArr(rows);
    setDropdown(rowsDownload);
  };


  const fetchData = async () => {
    const _stockResponse = await axios.get("stock");
    const stock = await _stockResponse.data.tbStock;
    if (stock) {
      setStockList(
        stock.map((item) => ({
          label: item.productName,
          value: item.id,
        }))
      );
    }

    const _productCategoryResponse = await axios.get("productCategory");
    const productCategory = await _productCategoryResponse.data
      .tbProductCategory;
    if (productCategory) {
      setProductCategoryList(
        productCategory.map((item) => ({
          label: item.categoryName,
          value: item.id,
        }))
      );
    }
    // setDefaultValue();
  };

  const onOptionChange = (value, index) => {
    if (value === 2) {
      const _stockDefault =
        stockList && stockList.length > 0 ? stockList[0].value : "";
      setDropdown((s) => {
        const newArr = s.slice();
        newArr[index].dropDown = stockList;
        return newArr;
      });

      setArr((s) => {
        const newArr = s.slice();
        newArr[index].categoryId = _stockDefault;
        return newArr;
      });
    } else if (value === 1) {
      const _cateDefault =
        productCategoryList && productCategoryList.length > 0
          ? productCategoryList[0].value
          : "";
          setDropdown((s) => {
            const newArr = s.slice();
            newArr[index].dropDown = productCategoryList;
            return newArr;
          });
    
          setArr((s) => {
            const newArr = s.slice();
            newArr[index].categoryId = _cateDefault;
            return newArr;
          });
    } else {
        setDropdown((s) => {
            const newArr = s.slice();
            newArr[index].dropDown = [];
            return newArr;
          });
    
          setArr((s) => {
            const newArr = s.slice();
            newArr[index].categoryId ="";
            return newArr;
          });
    }
  };

//   const setDefaultValue = () => {
//     if (typeLink) {
//       if (stockList && stockList.length > 0) {
//         const _stockDefault = stockList[0].value;
//         setStockId(stockId ? stockId : _stockDefault);
//         setProductCategoryId(null);
//       }
//     } else if (productCategoryList && productCategoryList.length > 0) {
//       const _cateDefault = productCategoryList[0].value;
//       setProductCategoryId(
//         productCategoryId ? productCategoryId : _cateDefault
//       );
//       setStockId(null);
//     }
//   };
  useEffect(() => {
    setTypeLink(0);
    // setDefaultValue();
  }, [productCategoryList, stockList]);

  const handleSeletectImage = async (e) => {
    const index = e.target.id.replace("file", "");
    const base64 = await FilesService.convertToBase64(e.target.files[0]);
    setArr((s) => {
      const newArr = s.slice();
      newArr[index].picture = base64;
      return newArr;
    });
  };

  const setOption = (e) => {
    const index = e.target.name;
    setArr((s) => {
      const newArr = s.slice();
      newArr[index].option = e.target.value;
      return newArr;
    });
    // setTypeLink(e.target.value);
    onOptionChange(e.target.value, index);
  };

  const handleChangeDropdown = (value,index) => {
    setArr((s) => {
        const newArr = s.slice();
        newArr[index].categoryId =value;
        return newArr;
      });
    // setDropdownId(value);
    // if (typeLink) {
    // //   setStockId(value);
    // //   setProductCategoryId(null);
    // } else {
    // //   setProductCategoryId(value);
    // //   setStockId(null);
    // }
    setShowErr(false);
  };

  const onValidate = () => {
    // if ((typeLink && !stockId) || (!typeLink && !productCategoryId)) {
    //   setShowErr(true);
    //   return false;
    // } else {
    setShowErr(false);
    const data = { arr };
    handleSubmitModal(data);
    // }
  };

  return (
    <Modal
      isOpen={open}
      onRequestClose={handleModal}
      style={width <= 1180 ? useStyleMobile : useStyle}
      contentLabel="Example Modal"
      shouldCloseOnOverlayClick={false}
    >
      <div className="flex flex-wrap">
        <div className="w-full flex-auto mt-2 ">
          <form>
            <ModalHeader title="ตั้งค่า Banner" handleModal={handleModal} />
            <div className="flex flex-wrap px-24 pb-4 justify-center Overflow-Banner">
              {arr.map((item, i) => {
                return (
                  <div
                    key={i}
                    className="border rounded-lg px-24 py-4 flex mt-2 mb-2 flex-wrap w-full"
                  >
                    <div className="w-full lg:w-2/12 px-4 margin-auto-t-b ">
                      <ProfilePictureUC
                        id={i}
                        hoverText="เลือกรูปภาพ Banner"
                        onChange={(e) => handleSeletectImage(e)}
                        src={item.picture}
                      />
                    </div>
                    <div className="w-full lg:w-10/12 px-4 margin-auto-t-b">
                      <div className="w-full text-right">
                        <label onClick={() => {handleRemove(i);}} className="text-blueGray-600 text-sm  font-bold mb-2 cursor-pointer">
                          <i className="fas fa-trash"></i>
                        </label>
                      </div>
                      <div className="relative w-full mb-2">
                        <label
                          className="text-blueGray-600 text-lg "
                          htmlFor="grid-password"
                        >
                          เพิ่ม Link ให้ Banner
                        </label>
                      </div>
                      <Radio.Group
                        name={i}
                        options={typeLinkList}
                        onChange={(e) => {
                          setOption(e);
                        }}
                        value={item.option}
                      />
                      <div className="relative w-full mt-2 mb-2">
                        <Select
                          id={i}
                          name="dropdown"
                          onChange={(e) => {
                            handleChangeDropdown(e.value,i);
                          }}
                          placeholder=""
                          isDisabled={item.option === 0 ? true : false}
                          menuPortalTarget={document.body}
                          menuPosition="fixed"
                          className="border-0 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          options={dropdown[i].dropDown}
                          value={
                            item.categoryId !== ""
                              ? ValidateService.defaultValue(
                                  dropdown[i].dropDown,
                                  item.categoryId
                                )
                              : ""
                          }
                          styles={UseStyleSelect}
                        />
                      </div>
                      <div className="relative w-full px-4">
                        {!item.categoryId && showErr && (
                          <div className="text-sm py-2 px-2  text-red-500">
                            * กรุณาเลือกหมวดหมู่สินค้า/สินค้า
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="relative w-full mb-6">
              <div className=" flex justify-between align-middle ">
                <div className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap">
                  <button
                    className={
                      "bg-gold-mbk text-white active:bg-gold-mbk font-bold uppercase text-sm px-2 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                    }
                    type="button"
                    onClick={addInput}
                  >
                    <i className="fas fa-plus-circle"></i> เพิ่ม
                  </button>{" "}
                  {arr.length} / 6 Banner
                </div>
                <div className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap">
                  <button
                    className={
                      "bg-gold-mbk text-white active:bg-gold-mbk font-bold uppercase text-sm px-2 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                    }
                    type="button"
                    onClick={() => {
                      onValidate();
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
    </Modal>
  );
};

export default BannerModal;
