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
import ButtonUCSaveModal from 'components/ButtonUCSaveModal';
import ModalHeader from 'views/admin/ModalHeader';

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
                        <ModalHeader title="เพิ่มเงื่อนไขโปรโมชั่นการส่ง" handleModal={handleModal} />
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
                        <ButtonUCSaveModal />
                    </div>
                </div>
            </form>
        </Modal>
    )
}

export default DeliveryModal