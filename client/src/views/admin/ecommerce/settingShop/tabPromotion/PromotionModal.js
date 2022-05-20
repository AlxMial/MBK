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
import SelectUC from 'components/SelectUC';
import ValidateService from "services/validateValue";
import TextAreaUC from 'components/InputUC/TextAreaUC';

const PromotionModal = ({ open, formik, handleModal }) => {
    Modal.setAppElement("#root");
    const useStyle = customStyles();
    const useStyleMobile = customStylesMobile();
    const { width } = useWindowDimensions();

    const discountType = [
        { label: "ส่วนลด", value: 'discount' },
        { label: "%ส่วนลด", value: 'percentDiscount' },
        { label: "สินค้าสมนาคุณ", value: 'product' },
    ];

    const stockList = [
        { label: "กาแฟ", value: 1 },
        { label: "น้ำเปล่า", value: 2 },
    ];

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
                                    <label>เพิ่มช่องทางการชำระเงิน</label>
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
                                        <LabelUC label="ชื่อแคมเปญ" isRequired={true} />
                                    </div>
                                    <div className="w-full lg:w-6/12 margin-auto-t-b">
                                        <div className="relative w-full px-4">
                                            <InputUC
                                                name='campaignName'
                                                maxLength={100}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.campaignName}
                                                onChange={(e) => {
                                                    formik.handleChange(e);
                                                }} />
                                        </div>
                                        <div className="relative w-full px-4">
                                            {formik.touched.campaignName &&
                                                formik.errors.campaignName ? (
                                                <div className="text-sm py-2 px-2  text-red-500">
                                                    {formik.errors.campaignName}
                                                </div>
                                            ) : null}
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
                                                type='number'
                                                name='buy'
                                                maxLength={100}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.buy}
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
                                        <LabelUC label="เงื่อนไข" />
                                    </div>
                                    <div className="w-full lg:w-6/12 margin-auto-t-b">
                                        <div className="relative w-full px-4">
                                            <Radio.Group
                                                options={discountType}
                                                onChange={(e) => {
                                                    formik.setFieldValue(
                                                        "condition",
                                                        e.target.value
                                                    );
                                                }}
                                                value={formik.values.condition}
                                            />
                                        </div>
                                        <div className="relative w-full px-4">
                                            {formik.touched.condition &&
                                                formik.errors.condition ? (
                                                <div className="text-sm py-2 px-2  text-red-500">
                                                    {formik.errors.condition}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="w-full lg:w-1/12 px-4 margin-auto-t-b ">
                                        <LabelUC label="" />
                                    </div>
                                </div>
                                <div className="flex flex-wrap mt-4 justify-center">
                                    <div className="w-full lg:w-2/12 px-4 margin-auto-t-b ">
                                        <LabelUC label="ส่วนลด" isRequired={true} />
                                    </div>
                                    <div className="w-full lg:w-6/12 margin-auto-t-b">
                                        <div className="relative w-full px-4">
                                            <InputUC
                                                type='number'
                                                name='discount'
                                                maxLength={100}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.discount}
                                                onChange={(e) => {
                                                    formik.handleChange(e);
                                                }} />
                                        </div>
                                        <div className="relative w-full px-4">
                                            {formik.touched.discount &&
                                                formik.errors.discount ? (
                                                <div className="text-sm py-2 px-2  text-red-500">
                                                    {formik.errors.discount}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="w-full lg:w-1/12 px-4 margin-auto-t-b ">
                                        <LabelUC label="บาท" />
                                    </div>
                                </div>
                                <div className="flex flex-wrap mt-4 justify-center">
                                    <div className="w-full lg:w-2/12 px-4 margin-auto-t-b ">
                                        <LabelUC label="% ส่วนลด" isRequired={true} />
                                    </div>
                                    <div className="w-full lg:w-1/12 margin-auto-t-b">
                                        <div className="relative w-full px-4">
                                            <InputUC
                                                name='percentDiscount'
                                                maxLength={3}
                                                type='number'
                                                onBlur={formik.handleBlur}
                                                value={formik.values.percentDiscount}
                                                onChange={(e) => {
                                                    formik.handleChange(e);
                                                }} />
                                        </div>
                                        <div className="relative w-full px-4">
                                            {formik.touched.percentDiscount &&
                                                formik.errors.percentDiscount ? (
                                                <div className="text-sm py-2 px-2  text-red-500">
                                                    {formik.errors.percentDiscount}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className={"w-full lg:w-1/12 px-4 margin-auto-t-b flex justify-between "
                                        + (width < 768 ? 'flex-wrap' : '')}>
                                        <LabelUC label="%" />
                                        <LabelUC label="สูงสุด" isRequired={true} />
                                    </div>
                                    <div className="w-full lg:w-2/12 margin-auto-t-b">
                                        <div className="relative w-full px-4">
                                            <InputUC
                                                name='percentDiscountAmount'
                                                type='number'
                                                maxLength={100}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.percentDiscountAmount}
                                                onChange={(e) => {
                                                    formik.handleChange(e);
                                                }} />
                                        </div>
                                        <div className="relative w-full px-4">
                                            {formik.touched.percentDiscountAmount &&
                                                formik.errors.percentDiscountAmount ? (
                                                <div className="text-sm py-2 px-2  text-red-500">
                                                    {formik.errors.percentDiscountAmount}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="w-full lg:w-1/12 px-4 margin-auto-t-b">
                                        <LabelUC label="บาท" />
                                    </div>
                                </div>
                                <div className="flex flex-wrap mt-4 justify-center">
                                    <div className="w-full lg:w-2/12 px-4 margin-auto-t-b ">
                                        <LabelUC label="สินค้าจากคลัง" isRequired={true} />
                                    </div>
                                    <div className="w-full lg:w-6/12 margin-auto-t-b">
                                        <div className="relative w-full px-4">
                                            <SelectUC
                                                id="stockId"
                                                name="stockId"
                                                onChange={(e) => {
                                                    formik.setFieldValue("stockId", e.value);
                                                }}
                                                options={stockList}
                                                value={ValidateService.defaultValue(
                                                    stockList,
                                                    formik.values.stockId
                                                )}
                                            />
                                        </div>
                                        <div className="relative w-full px-4">
                                            {formik.touched.stockId &&
                                                formik.errors.stockId ? (
                                                <div className="text-sm py-2 px-2  text-red-500">
                                                    {formik.errors.stockId}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="w-full lg:w-1/12 px-4 margin-auto-t-b ">
                                        <LabelUC label="" />
                                    </div>
                                </div>
                                <div className="flex flex-wrap mt-4 justify-center">
                                    <div className="w-full lg:w-2/12 px-4 ">
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
                                    </div>
                                    <div className="w-full lg:w-1/12 px-4 margin-auto-t-b ">
                                        <LabelUC label="" />
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
                                    // type="button"
                                    // onClick={() => { onValidate() }}
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

export default PromotionModal