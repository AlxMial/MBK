import React from 'react'
import Modal from "react-modal";
import {
    customStyles,
    customStylesMobile,
} from "assets/styles/theme/ReactModal";
import LabelUC from 'components/LabelUC';
import useWindowDimensions from "services/useWindowDimensions";
import InputUC from 'components/InputUC';
// import Select from "react-select";
import ValidateService from "services/validateValue";
import TextAreaUC from 'components/InputUC/TextAreaUC';
import { Radio } from "antd";
import SelectUC from 'components/SelectUC';
import ButtonUCSaveModal from 'components/ButtonUCSaveModal';

const LogisticModal = ({ open, formik, handleModal }) => {
    Modal.setAppElement("#root");
    const useStyle = customStyles();
    const useStyleMobile = customStylesMobile();
    const { width } = useWindowDimensions();

    const logisticTypeList = [
        { label: "Kerry Express", value: 'kerry' },
        // { label: "Flash Express", value: 'flash' },
        { label: "ไปรษณีย์ไทย", value: 'post' },
    ];

    const optionsDelivery = [
        { label: "ค่าจัดส่งคงที่", value: 'constant' },
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
                                    <label>เพิ่มช่องทางการส่งของ</label>
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
                                <div className="flex flex-wrap">
                                    <div className="w-full lg:w-4/12 px-4 margin-auto-t-b ">
                                        <LabelUC label="บริษัทขนส่ง" isRequired={true} />
                                    </div>
                                    <div className="w-full lg:w-6/12 margin-auto-t-b">
                                        <div className="relative w-full px-4">
                                            <SelectUC
                                                id="logisticType"
                                                name="logisticType"
                                                onChange={(e) => {
                                                    formik.setFieldValue("logisticType", e.value);
                                                }}
                                                options={logisticTypeList}
                                                value={ValidateService.defaultValue(
                                                    logisticTypeList,
                                                    formik.values.logisticType
                                                )}
                                            />
                                        </div>
                                        <div className="relative w-full px-4">
                                            {formik.touched.logisticType &&
                                                formik.errors.logisticType ? (
                                                <div className="text-sm py-2 px-2  text-red-500">
                                                    {formik.errors.logisticType}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="w-full lg:w-1/12 px-4 margin-auto-t-b ">
                                        <LabelUC label="" />
                                    </div>
                                </div>
                                <div className="flex flex-wrap mt-4">
                                    <div className="w-full lg:w-4/12 px-4 margin-auto-t-b ">
                                        <LabelUC label="ชื่อที่แสดงในหน้าสั่งซื้อสินค้าของลูกค้า" isRequired={true} />
                                    </div>
                                    <div className="w-full lg:w-6/12 margin-auto-t-b">
                                        <div className="relative w-full px-4">
                                            <InputUC
                                                name='deliveryName'
                                                maxLength={100}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.deliveryName}
                                                // disabled={typePermission !== "1"}
                                                onChange={(e) => {
                                                    formik.handleChange(e);
                                                }} />
                                        </div>
                                        <div className="relative w-full px-4">
                                            {formik.touched.deliveryName &&
                                                formik.errors.deliveryName ? (
                                                <div className="text-sm py-2 px-2  text-red-500">
                                                    {formik.errors.deliveryName}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="w-full lg:w-1/12 px-4 margin-auto-t-b ">
                                        <LabelUC label="" />
                                    </div>
                                </div>
                                <div className="flex flex-wrap mt-4">
                                    <div className="w-full lg:w-4/12 px-4">
                                        <LabelUC label="รายละเอียด" />
                                    </div>
                                    <div className="w-full lg:w-6/12 margin-auto-t-b">
                                        <div className="relative w-full px-4">
                                            <TextAreaUC
                                                name='description'
                                                onBlur={formik.handleBlur}
                                                value={formik.values.description}
                                                onChange={(e) => {
                                                    formik.handleChange(e);
                                                }} />
                                        </div>
                                        <div className="relative w-full px-4">
                                            {formik.touched.description &&
                                                formik.errors.description ? (
                                                <div className="text-sm py-2 px-2  text-red-500">
                                                    {formik.errors.description}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="w-full lg:w-1/12 px-4 margin-auto-t-b ">
                                        <LabelUC label="" />
                                    </div>
                                </div>
                                <div className="flex flex-wrap mt-4">
                                    <div className="w-full lg:w-4/12 px-4 margin-auto-t-b ">
                                        <LabelUC label="ประเภทการจัดส่ง" />
                                    </div>
                                    <div className="w-full lg:w-6/12 margin-auto-t-b">
                                        <div className="relative w-full px-4">
                                            <Radio.Group
                                                options={optionsDelivery}
                                                onChange={(e) => {
                                                    formik.setFieldValue(
                                                        "deliveryType",
                                                        e.target.value
                                                    );
                                                }}
                                                value={formik.values.deliveryType}
                                            />
                                        </div>
                                    </div>
                                    <div className="w-full lg:w-1/12 px-4 margin-auto-t-b ">
                                        <LabelUC label="" />
                                    </div>
                                </div>
                                <div className="flex flex-wrap mt-4">
                                    <div className="w-full lg:w-4/12 px-4 margin-auto-t-b ">
                                        <LabelUC label="ค่าจัดส่ง" isRequired={true} />
                                    </div>
                                    <div className="w-full lg:w-6/12 margin-auto-t-b">
                                        <div className="relative w-full px-4">
                                            <InputUC
                                                type="number"
                                                name='deliveryCost'
                                                maxLength={100}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.deliveryCost}
                                                onChange={(e) => {
                                                    formik.handleChange(e);
                                                }} />
                                        </div>
                                    </div>
                                    <div className="w-full lg:w-1/12 px-4 margin-auto-t-b ">
                                        <LabelUC label="บาท" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <ButtonUCSaveModal />
                    </div>
                </div>
            </form>
        </Modal>
    )
}

export default LogisticModal