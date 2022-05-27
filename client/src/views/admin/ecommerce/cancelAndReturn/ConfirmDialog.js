import React, { useEffect } from 'react'
import Modal from "react-modal";
import {
    customStyles,
    customStylesMobile,
} from "assets/styles/theme/ReactModal";
import LabelUC from 'components/LabelUC';
import useWindowDimensions from "services/useWindowDimensions";
import TextAreaUC from 'components/InputUC/TextAreaUC';
import ModalHeader from 'views/admin/ModalHeader';

const ConfirmDialog = ({ open, formik, handleModal, status, type }) => {
    Modal.setAppElement("#root");
    const useStyle = customStyles();
    const useStyleMobile = customStylesMobile();
    const { width } = useWindowDimensions();

    const cancelList = [
        { label: "รอยกเลิก", value: 'wait' },
        { label: "ยกเลิกแล้ว", value: 'done' },
    ];

    const returnList = [
        { label: "รอการคืนสินค้า", value: 'wait' },
        { label: "เสร็จสิ้น", value: 'done' },
        { label: "ปฏิเสธ", value: 'notReturn' },
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
                        <ModalHeader title={`ยืนยันการ ${type === 'cancel' ? 'ยกเลิก' : 'คืนสินค้า'}`} handleModal={handleModal} />
                        <div className="flex flex-wrap px-24 py-10 justify-center">
                            <div className="w-full lg:w-10/12 px-4 margin-auto-t-b ">
                                <LabelUC label={`ต้องการเปลี่ยนสถานะเป็น ${(type === 'cancel' ? cancelList : returnList)
                                    .filter(item => item.value === status)[0].label} ใช่หรือไม่?`} />
                                <div className="flex flex-wrap">
                                    <div className="w-full lg:w-12/12 px-4 margin-auto-t-b ">
                                        <LabelUC label={`รายละเอียดที่${type === 'cancel' ? 'ยกเลิก' : 'รับคืน/ปฏิเสธ'}`} />
                                    </div>
                                </div>
                                <div className="flex flex-wrap mt-4">
                                    <div className="w-full lg:w-12/12 margin-auto-t-b">
                                        <div className="relative w-full px-4">
                                            <TextAreaUC
                                                name="description"
                                                onBlur={formik.handleBlur}
                                                value={formik.values.description}
                                                onChange={(e) => {
                                                    formik.handleChange(e);
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative w-full mb-3">
                            <div className=" flex justify-between align-middle ">
                                <div className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4">
                                    <label
                                        className="text-orange-500 cursor-pointer"
                                        onClick={() => handleModal('save')}
                                    >
                                        {" "}
                                        <i className="fas fa-trash"></i> ตกลง
                                    </label>
                                    <label className="font-bold">&nbsp;|&nbsp;</label>
                                    <label className="cursor-pointer" onClick={() => handleModal('cancel')}>
                                        {" "}
                                        <i className="fas fa-times"></i> ยกเลิก
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </Modal >
    )
}

export default ConfirmDialog