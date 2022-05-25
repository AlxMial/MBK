import React, { useEffect } from 'react'
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
import axios from "services/axios";
import ButtonUCSaveModal from 'components/ButtonUCSaveModal';
import ModalHeader from 'views/admin/ModalHeader';

const PromotionModal = ({ open, formik, handleModal }) => {
    Modal.setAppElement("#root");
    const useStyle = customStyles();
    const useStyleMobile = customStylesMobile();
    const { width } = useWindowDimensions();
    const [stockList, setStockList] = React.useState([]);

    const conditionType = [
        { label: "ส่วนลด", value: 'discount' },
        { label: "%ส่วนลด", value: 'percentDiscount' },
        { label: "สินค้าสมนาคุณ", value: 'product' },
    ];

    // const stockList = [
    //     { label: "กาแฟ", value: 1 },
    //     { label: "น้ำเปล่า", value: 2 },
    // ];

    const options = [
        { label: "เปิดการใช้งาน", value: true },
        { label: "ปิดการใช้งาน", value: false },
    ];

    useEffect(async () => {
        const _stockResponse = await axios.get('stock');
        const stock = await _stockResponse.data.tbStock;
        if (stock) {
            setStockList(stock.map(item => ({
                label: item.productName,
                value: item.id,
            })));
            if (!formik.values.stockId && stockList && stockList.length > 0) {
                formik.setFieldValue('stockId', stockList[0].value);
            }
        }
    }, []);

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
                        <ModalHeader title={"เพิ่มโปรโมชั่นหน้าร้าน"} handleModal={handleModal} />
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
                                                options={conditionType}
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
                        <ButtonUCSaveModal />
                    </div>
                </div>
            </form>
        </Modal>
    )
}

export default PromotionModal