import React from 'react'
import Modal from "react-modal";
import {
    customStyles,
    customStylesMobile,
} from "assets/styles/theme/ReactModal";
import LabelUC from 'components/LabelUC';
import useWindowDimensions from "services/useWindowDimensions";
import Select from "react-select";
import ValidateService from "services/validateValue";
import InputUC from 'components/InputUC';

const PaymentModal = ({ open, handleModal, formik, onSubmitModal }) => {
    Modal.setAppElement("#root");
    const useStyle = customStyles();
    const useStyleMobile = customStylesMobile();
    const { width } = useWindowDimensions();

    const handleSeletectImage = (e) => {
        setImgSeleted(e.target.files[0]);
        setFileName(e.target.files[0].name);
    }

    const onValidate = () => {
        console.log(category)
        if (!category) {
            addToast("กรุณาเลือกหมวดหมู่สินค้า/สินค้า", {
                appearance: "warning",
                autoDismiss: true,
            });
            return false;
        } else {
            const data = {
                fileName: imgSeleted.name,
                name,
                img: imgSeleted,
                option,
                category
            }
            onSubmitModal(data);
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
                        <div className="relative w-full mb-3">
                            <div className=" align-middle  mb-3">
                                <div className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-base text-green-mbk font-bold whitespace-nowrap p-4">
                                    <label>เพิ่มช่องทางการชำระเงิน</label>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap px-24 py-10 justify-center">
                            <div className="w-full lg:w-2/12 px-4 margin-auto-t-b ">
                                <LabelUC label="ชื่อธนาคาร" isRequired={true} />
                            </div>
                            <div className="w-full lg:w-6/12 margin-auto-t-b">
                                <div className="relative w-full px-4">
                                    <InputUC
                                        name='bankName'
                                        maxLength={100}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.bankName}
                                        disabled={typePermission !== "1"}
                                        onChange={(e) => {
                                            formik.handleChange(e);
                                        }} />
                                </div>
                            </div>
                            <div className="w-full lg:w-2/12 px-4 margin-auto-t-b ">
                                <LabelUC label="เลขบัญชี" isRequired={true} />
                            </div>
                            <div className="w-full lg:w-6/12 margin-auto-t-b">
                                <div className="relative w-full px-4">
                                    <InputUC
                                        name='accountNumber'
                                        maxLength={100}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.accountNumber}
                                        disabled={typePermission !== "1"}
                                        onChange={(e) => {
                                            formik.handleChange(e);
                                        }} />
                                </div>
                            </div>
                            <div className="w-full lg:w-2/12 px-4 margin-auto-t-b ">
                                <LabelUC label="ชื่อบัญชี" isRequired={true} />
                            </div>
                            <div className="w-full lg:w-6/12 margin-auto-t-b">
                                <div className="relative w-full px-4">
                                    <InputUC
                                        name='accountName'
                                        maxLength={100}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.accountName}
                                        disabled={typePermission !== "1"}
                                        onChange={(e) => {
                                            formik.handleChange(e);
                                        }} />
                                </div>
                            </div>
                        </div>
                        <div className="relative w-full mb-3">
                            <div className=" flex justify-between align-middle ">
                                <div></div>
                                <div className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4">
                                    <button
                                        className="bg-rose-mbk text-white active:bg-rose-mbk font-bold uppercase text-sm px-2 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => handleModal()}
                                    >
                                        ย้อนกลับ
                                    </button>
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

export default PaymentModal