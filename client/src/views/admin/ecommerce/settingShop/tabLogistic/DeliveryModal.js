import React from 'react'
import Modal from "react-modal";
import {
    customStyles,
    customStylesMobile,
} from "assets/styles/theme/ReactModal";
import LabelUC from 'components/LabelUC';
import useWindowDimensions from "services/useWindowDimensions";
import InputUC from 'components/InputUC';
import { Radio } from "antd";

const DeliveryModal = ({ open, formik, handleModal }) => {
    Modal.setAppElement("#root");
    const useStyle = customStyles();
    const useStyleMobile = customStylesMobile();
    const { width } = useWindowDimensions();

    const options = [
        { label: "เปิดการใช้งาน", value: true },
        { label: "ปิดการใช้งาน", value: false },
    ];

    return (
        <Modal
            isOpen={open}
            onRequestClose={handleModal}
            style={width <= 1180 ? useStyleMobile : useStyle}
            contentLabel="Example Modal"
            shouldCloseOnOverlayClick={false}
        >
            <form onSubmit={formik.handleSubmit}>
                <div className="flex flex-wrap">
                    <div className="w-full flex-auto mt-2">
                        <div className=" flex justify-between align-middle ">
                            <div className=" align-middle  mb-3">
                                <div className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-base text-green-mbk font-bold whitespace-nowrap p-4">
                                    <label>เพิ่มเงื่อนไขโปรโมชั่นการส่ง</label>
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
                            <div className="w-full lg:w-12/12 px-4 margin-auto-t-b ">
                                <div className="flex flex-wrap justify-center">
                                    <div className="w-full lg:w-2/12 px-4 margin-auto-t-b ">
                                        <LabelUC label="โปรโมชั่น" />
                                    </div>
                                    <div className="w-full lg:w-6/12 margin-auto-t-b">
                                        <div className="relative w-full px-4">
                                            <InputUC
                                                name='promotionName'
                                                maxLength={100}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.promotionName}
                                                // disabled={typePermission !== "1"}
                                                onChange={(e) => {
                                                    formik.handleChange(e);
                                                }} />
                                        </div>
                                    </div>
                                    <div className="w-full lg:w-1/12 px-4 margin-auto-t-b ">
                                        <LabelUC label="" />
                                    </div>
                                </div>
                                <div className="flex flex-wrap mt-4 justify-center">
                                    <div className="w-full lg:w-2/12 px-4 margin-auto-t-b ">
                                        <LabelUC label="ซื้อครบ" />
                                    </div>
                                    <div className="w-full lg:w-6/12 margin-auto-t-b">
                                        <div className="relative w-full px-4">
                                            <InputUC
                                                type="number"
                                                name='buy'
                                                maxLength={100}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.buy}
                                                // disabled={typePermission !== "1"}
                                                onChange={(e) => {
                                                    formik.handleChange(e);
                                                }} />
                                        </div>
                                    </div>
                                    <div className="w-full lg:w-1/12 px-4 margin-auto-t-b ">
                                        <LabelUC label="บาท" />
                                    </div>
                                </div>
                                <div className="flex flex-wrap mt-4 justify-center">
                                    <div className="w-full lg:w-2/12 px-4 margin-auto-t-b ">
                                        <LabelUC label="ค่าจัดส่ง" />
                                    </div>
                                    <div className="w-full lg:w-6/12 margin-auto-t-b">
                                        <div className="relative w-full px-4">
                                            <InputUC
                                                type="number"
                                                name='deliveryCost'
                                                maxLength={100}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.deliveryCost}
                                                // disabled={typePermission !== "1"}
                                                onChange={(e) => {
                                                    formik.handleChange(e);
                                                }} />
                                        </div>
                                    </div>
                                    <div className="w-full lg:w-1/12 px-4 margin-auto-t-b ">
                                        <LabelUC label="บาท" />
                                    </div>
                                </div>
                                <div className="flex flex-wrap mt-4 justify-center">
                                    <div className="w-full lg:w-2/12 px-4 margin-auto-t-b ">
                                        <LabelUC label="" />
                                    </div>
                                    <div className="w-full lg:w-6/12 margin-auto-t-b">
                                        <div className="relative w-full px-4">
                                            <Radio.Group
                                                options={options}
                                                onChange={(e) => {
                                                    formik.setFieldValue(
                                                        "isInactive",
                                                        e.target.value
                                                    );
                                                }}
                                                value={formik.values.isInactive}
                                            />
                                        </div>
                                    </div>
                                    <div className="w-full lg:w-1/12 px-4 margin-auto-t-b ">
                                        <LabelUC label="" />
                                    </div>
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
                                        type="submit"
                                    >
                                        บันทึกข้อมูล
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </Modal>
    )
}

export default DeliveryModal