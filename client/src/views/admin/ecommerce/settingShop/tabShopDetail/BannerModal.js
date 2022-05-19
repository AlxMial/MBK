import React, { useEffect, useState } from 'react'
import Modal from "react-modal";
import {
    customStyles,
    customStylesMobile,
} from "assets/styles/theme/ReactModal";
import LabelUC from 'components/LabelUC';
import useWindowDimensions from "services/useWindowDimensions";
import { Radio } from "antd";
// import { useToasts } from "react-toast-notifications";
import Select from "react-select";
import ValidateService from "services/validateValue";

const BannerModal = ({ open, handleModal, name, modalData, handleSubmitModal }) => {
    Modal.setAppElement("#root");
    const useStyle = customStyles();
    const useStyleMobile = customStylesMobile();
    const { width } = useWindowDimensions();
    // const { addToast } = useToasts();

    const [fileName, setFileName] = useState(modalData ? modalData.fileName : "");
    const [imgSeleted, setImgSeleted] = useState(modalData ? modalData.img : null); //รูป
    const [typeLink, setTypeLink] = useState(modalData ? modalData.typeLink : false);//Radio button
    const [productCategoryId, setProductCategoryId] = useState(modalData ? modalData.productCategoryId : '');// หมวดหมู่
    const [stockId, setStockId] = useState(modalData ? modalData.stockId : '');// สินค้า
    const [dropdown, setDropdown] = useState([]);
    const [dropdownId, setDropdownId] = useState(null);
    const [showErr, setShowErr] = useState(false);

    const typeLinkList = [
        { label: "หมวดหมู่สินค้า", value: false },
        { label: "สินค้า", value: true },
    ];

    const productCategoryList = [
        { label: "ของใช้", value: 1 },
        { label: "ของกิน", value: 2 },
    ];

    const stockList = [
        { label: "กาแฟ", value: 1 },
        { label: "น้ำเปล่า", value: 2 },
    ];

    const onOptionChange = (value) => {
        if (value) {
            setDropdown(stockList);
            setDropdownId(stockList[0].value);
            setStockId(stockList[0].value);
            setProductCategoryId(null);
        } else {
            setDropdown(productCategoryList);
            setDropdownId(productCategoryList[0].value);
            setProductCategoryId(productCategoryList[0].value);
            setStockId(null);
        }
    }
    useEffect(() => {
        if (typeLink) {
            setDropdown(stockList);
            setDropdownId(stockId ? stockId : stockList[0].value);
            setStockId(stockId ? stockId : stockList[0].value);
            setProductCategoryId(null);
        } else {
            setDropdown(productCategoryList);
            setDropdownId(productCategoryId ? productCategoryId : productCategoryList[0].value);
            setProductCategoryId(productCategoryId ? productCategoryId : productCategoryList[0].value);
            setStockId(null);
        }
    }, []);

    const handleSeletectImage = (e) => {
        setImgSeleted(e.target.files[0]);
        setFileName(e.target.files[0].name);
    }

    const setOption = (value) => {
        setTypeLink(value);
        onOptionChange(value);
    }

    const handleChangeDropdown = (value) => {
        setDropdownId(value);
        if (typeLink) {
            setStockId(value);
            setProductCategoryId(null);
        } else {
            setProductCategoryId(value);
            setStockId(null);
        }
        setShowErr(false);
    }

    const onValidate = () => {
        if ((typeLink && !stockId) || (!typeLink && !productCategoryId)) {
            setShowErr(true);
            return false;
        } else {
            setShowErr(false);
            const data = {
                fileName: imgSeleted ? imgSeleted.name : "",
                name,
                img: imgSeleted,
                typeLink,
                productCategoryId,
                stockId,
            }
            handleSubmitModal(data);
        }
    }

    return (
        <Modal
            isOpen={open}
            onRequestClose={handleModal}
            style={width <= 1180 ? useStyleMobile : useStyle}
            contentLabel="Example Modal"
            shouldCloseOnOverlayClick={false}
        >
            <div className="flex flex-wrap">
                <div className="w-full flex-auto mt-2">
                    <form>
                        <div className=" flex justify-between align-middle ">
                            <div className=" align-middle  mb-3">
                                <div className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-base text-green-mbk font-bold whitespace-nowrap p-4">
                                    <label>กำหนด Banner</label>
                                </div>
                            </div>

                            <div className="  text-right align-middle  mb-3">
                                <div className=" border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm text-red-500 font-bold whitespace-nowrap p-4">
                                    <label
                                        className="cursor-pointer"
                                        onClick={() => {
                                            handleModal();
                                        }}
                                    >
                                        X
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap px-24 py-10 justify-center">
                            <div className="w-full lg:w-2/12 px-4 margin-auto-t-b ">
                                <LabelUC label="รูป Banner" />
                            </div>
                            <div className="w-full lg:w-8/12 px-4 margin-auto-t-b ">
                                <div className="buttonIn image-upload ">
                                    <label htmlFor="file-input" className="cursor-pointer" >
                                        <input
                                            type="text"
                                            className={
                                                "border-0 px-2 text-left py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded w-full text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                                            }
                                            id="fileName"
                                            name="fileName"
                                            value={fileName}
                                            readOnly
                                        />
                                        <span className={"spanUpload px-1 py-1 text-xs font-bold"}>
                                            <i className="fas fa-upload text-blueGray-600"></i>
                                        </span>
                                    </label>
                                    <input
                                        id="file-input"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            handleSeletectImage(e);
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="w-full lg:w-2/12 px-4 mb-2 mt-2">
                                <label
                                    className="text-blueGray-600 text-sm font-bold mb-2"
                                    htmlFor="grid-password"
                                ></label>
                            </div>

                            <div
                                className={
                                    "w-full lg:w-8/12 px-4 mb-4 mt-4"
                                }
                            >
                                <Radio.Group
                                    options={typeLinkList}
                                    onChange={(e) => {
                                        setOption(e.target.value);
                                    }}
                                    value={typeLink}
                                />
                            </div>

                            <div className="w-full lg:w-2/12 px-4 margin-auto-t-b">
                                <LabelUC label="หมวดหมู่สินค้า/สินค้า" isRequired={true} />
                            </div>
                            <div className="w-full lg:w-8/12 px-4 margin-auto-t-b">
                                <div className="relative w-full">
                                    <Select
                                        id="dropdown"
                                        name="dropdown"
                                        onChange={(e) => {
                                            handleChangeDropdown(e.value);
                                        }}
                                        className="border-0 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                        options={dropdown}
                                        value={ValidateService.defaultValue(
                                            dropdown,
                                            dropdownId
                                        )}
                                        styles={useStyle}
                                    />
                                </div>
                                <div className="relative w-full px-4">
                                    {!dropdownId && showErr && (
                                        <div className="text-sm py-2 px-2  text-red-500">
                                            * กรุณาเลือกหมวดหมู่สินค้า/สินค้า
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="relative w-full mb-3">
                            <div className=" flex justify-between align-middle ">
                                <div></div>
                                <div className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4">
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
    )
}

export default BannerModal