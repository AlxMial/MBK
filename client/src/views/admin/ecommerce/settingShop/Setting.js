import InputUC from 'components/InputUC';
import TextAreaUC from 'components/InputUC/TextAreaUC';
import LabelUC from 'components/LabelUC';
import ProfilePictureUC from 'components/ProfilePictureUC';
import React, { useState } from 'react'
import BannerControl from './BannerControl';
import BannerModal from './BannerModal';
import './index.scss'

const Setting = ({ props }) => {
    const { typePermission, formik, setIsModified, onSubmitModal } = props;
    const [open, setOpen] = useState(false);
    const [modalName, setModalName] = useState('');

    const handleChangeImg = (e) => {
        var image = document.getElementById("output");
        image.src = URL.createObjectURL(e.target.files[0]);
    };

    const handleOpenModal = (name) => {
        console.log('handleOpenModal', name);
        setModalName(name);
        setOpen(true);
    }

    const handleSubmitModal = (data) => {
        onSubmitModal(data);
        setOpen(false);
    }

    const BannerPicker = ({ name }) => {
        return (
            <div className="w-full lg:w-2/12 px-4 banner-picker">
                <BannerControl
                    formik={formik}
                    typePermission={typePermission}
                    name={name}
                    onClick={handleOpenModal}
                    setIsModified={setIsModified} />
            </div>
        )
    }

    const bannerList = ['banner1Name', 'banner2Name', 'banner3Name', 'banner4Name', 'banner5Name', 'banner6Name'];
    const emailList = ['email1', 'email2', 'email3', 'email4'];
    return (
        <>

            <div className="w-full">
                <form onSubmit={formik.handleSubmit}>
                    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 border bg-white rounded-lg Overflow-info py-10 lg:px-10">
                        <div className="banner flex flex-col flex-wrap justify-between">
                            <div className="px-4 lg:w-2/12">
                                <ProfilePictureUC
                                    hoverText='เลือกรูปร้านค้า'
                                    handleChangeImg={handleChangeImg} />
                            </div>
                            <div className="w-full lg:w-2/12 px-4 h-full">
                                <div className="relative w-full px-4">
                                    <label
                                        className=" text-blueGray-600 text-sm font-bold "
                                    // htmlFor="grid-password"
                                    >
                                        กำหนด Banner
                                    </label>
                                </div>
                            </div>
                            {bannerList.map((name, index) => {
                                return (
                                    <BannerPicker
                                        key={index}
                                        name={name}
                                    />
                                )
                            })}
                        </div>
                        <div className="flex flex-wrap mt-4">
                            {/* ชื่อร้านค้า */}
                            <div className="w-full lg:w-2/12 px-4">
                                <LabelUC label="ชื่อร้านค้า" />
                            </div>
                            <div className="w-full lg:w-10/12 margin-auto-t-b">
                                <div className="relative w-full px-4">
                                    <InputUC
                                        name='shopName'
                                        maxLength={100}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.shopName}
                                        disabled={typePermission !== "1"}
                                        onChange={(e) => {
                                            formik.handleChange(e);
                                            setIsModified(true);
                                        }} />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap mt-4">
                            {/* รายละเอียดร้านค้า */}
                            <div className="w-full lg:w-2/12 px-4">
                                <LabelUC label="รายละเอียดร้านค้า" />
                            </div>
                            <div className="w-full lg:w-10/12 margin-auto-t-b">
                                <div className="relative w-full px-4">
                                    <TextAreaUC
                                        name='description'
                                        onBlur={formik.handleBlur}
                                        value={formik.values.shopName}
                                        disabled={typePermission !== "1"}
                                        onChange={(e) => {
                                            formik.handleChange(e);
                                            setIsModified(true);
                                        }} />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap mt-4">
                            {/* Email แจ้งเตือนคำสั่งซื้อ */}
                            <div className="w-full lg:w-2/12 px-4">
                                <LabelUC label="Email แจ้งเตือนคำสั่งซื้อ" />
                            </div>
                            <div className="w-full lg:w-10/12 flex flex-wrap">
                                {emailList.map((name, index) => {
                                    return (
                                        <div className="w-full lg:w-4/12 px-4 mb-4" key={index}>
                                            <div className="relative w-full">
                                                <InputUC
                                                    name={name}
                                                    maxLength={100}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values[name]}
                                                    disabled={typePermission !== "1"}
                                                    placeholder={"Email " + (index + 1)}
                                                    onChange={(e) => {
                                                        formik.handleChange(e);
                                                        setIsModified(true);
                                                    }} />
                                            </div>
                                            <div className="relative w-full mt-2">
                                                {formik.touched[name] && formik.errors[name] ? (
                                                    <div className="text-sm py-2 px-2 text-red-500">
                                                        {formik.errors[name]}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <div className="w-full px-4">
                            <div className="relative w-full text-right">
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
                </form>
            </div>
            {open && <BannerModal
                name={modalName}
                open={open}
                onSubmitModal={handleSubmitModal}
                handleModal={() => setOpen(false)} />}
        </>
    )
}

export default Setting