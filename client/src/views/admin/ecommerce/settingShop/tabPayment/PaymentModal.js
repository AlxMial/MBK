import React from 'react'
import Modal from "react-modal";
import {
    customStyles,
    customStylesMobile,
} from "assets/styles/theme/ReactModal";
import LabelUC from 'components/LabelUC';
import useWindowDimensions from "services/useWindowDimensions";
import InputUC from 'components/InputUC';
import ProfilePictureUC from 'components/ProfilePictureUC';

const PaymentModal = ({ open, formik, handleModal, setSelectedImage }) => {
    Modal.setAppElement("#root");
    const useStyle = customStyles();
    const useStyleMobile = customStylesMobile();
    const { width } = useWindowDimensions();

    const handleSeletectImage = (e) => {
        setSelectedImage(e.target.files[0]);
    }

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
                            <div className="w-full lg:w-10/12 px-4 margin-auto-t-b ">
                                <div className="flex flex-wrap">
                                    <div className="w-full lg:w-2/12 px-4 margin-auto-t-b ">
                                        <LabelUC label="ชื่อธนาคาร" isRequired={true} />
                                    </div>
                                    <div className="w-full lg:w-10/12 margin-auto-t-b">
                                        <div className="relative w-full px-4">
                                            <InputUC
                                                name='bankName'
                                                maxLength={100}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.bankName}
                                                // disabled={typePermission !== "1"}
                                                onChange={(e) => {
                                                    formik.handleChange(e);
                                                }} />
                                        </div>
                                        <div className="relative w-full px-4">
                                            {formik.touched.bankName &&
                                                formik.errors.bankName ? (
                                                <div className="text-sm py-2 px-2  text-red-500">
                                                    {formik.errors.bankName}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-wrap mt-4">
                                    <div className="w-full lg:w-2/12 px-4 margin-auto-t-b ">
                                        <LabelUC label="เลขบัญชี" isRequired={true} />
                                    </div>
                                    <div className="w-full lg:w-10/12 margin-auto-t-b">
                                        <div className="relative w-full px-4">
                                            <InputUC
                                                name='accountNumber'
                                                maxLength={100}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.accountNumber}
                                                // disabled={typePermission !== "1"}
                                                onChange={(e) => {
                                                    formik.handleChange(e);
                                                }} />
                                        </div>
                                        <div className="relative w-full px-4">
                                            {formik.touched.accountNumber &&
                                                formik.errors.accountNumber ? (
                                                <div className="text-sm py-2 px-2  text-red-500">
                                                    {formik.errors.accountNumber}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-wrap mt-4">
                                    <div className="w-full lg:w-2/12 px-4 margin-auto-t-b ">
                                        <LabelUC label="ชื่อบัญชี" isRequired={true} />
                                    </div>
                                    <div className="w-full lg:w-10/12 margin-auto-t-b">
                                        <div className="relative w-full px-4">
                                            <InputUC
                                                name='accountName'
                                                maxLength={100}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.accountName}
                                                // disabled={typePermission !== "1"}
                                                onChange={(e) => {
                                                    formik.handleChange(e);
                                                }} />
                                        </div>
                                        <div className="relative w-full px-4">
                                            {formik.touched.accountName &&
                                                formik.errors.accountName ? (
                                                <div className="text-sm py-2 px-2  text-red-500">
                                                    {formik.errors.accountName}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-wrap mt-4">
                                    <div className="w-full lg:w-2/12 px-4 margin-auto-t-b ">
                                        <LabelUC label="สาขาธนาคาร" />
                                    </div>
                                    <div className="w-full lg:w-10/12 margin-auto-t-b">
                                        <div className="relative w-full px-4">
                                            <InputUC
                                                name='bankBranchName'
                                                maxLength={100}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.bankBranchName}
                                                // disabled={typePermission !== "1"}
                                                onChange={(e) => {
                                                    formik.handleChange(e);
                                                }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full lg:w-2/12 px-4">
                                <ProfilePictureUC
                                    hoverText='เลือกรูปธนาคาร'
                                    handleChangeImg={handleSeletectImage} />
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

export default PaymentModal