import InputUC from 'components/InputUC';
import TextAreaUC from 'components/InputUC/TextAreaUC';
import LabelUC from 'components/LabelUC';
import ProfilePictureUC from 'components/ProfilePictureUC';
import React, { useState, useEffect } from 'react'
import BannerControl from './BannerControl';
import BannerModal from './BannerModal';
import './index.scss'
import { useFormik } from "formik";
import * as yup from "yup";
import { GetPermissionByUserName } from "services/Permission";
import axios from "services/axios";
import { fetchLoading, fetchSuccess } from 'redux/actions/common';
import { useToasts } from "react-toast-notifications";

const Setting = () => {
    // const { formik, onSubmitModal,
    //     banner1, banner2, banner3, banner4, banner5, banner6 } = props;
    const { addToast } = useToasts();
    const [open, setOpen] = useState(false);
    const [modalName, setModalName] = useState('');
    const [modalData, setModalData] = useState({});
    const [typePermission, setTypePermission] = useState('');
    const [banner1, setBanner1] = useState(null);
    const [banner2, setBanner2] = useState(null);
    const [banner3, setBanner3] = useState(null);
    const [banner4, setBanner4] = useState(null);
    const [banner5, setBanner5] = useState(null);
    const [banner6, setBanner6] = useState(null);

    useEffect(() => {
        fetchPermission();
    }, []);

    const fetchPermission = async () => {
        const role = await GetPermissionByUserName();
        setTypePermission(role);
    };

    const onSubmitModal = (data) => {
        console.log(data)
        formik.setFieldValue(data.name, data.fileName);
        // prepare for save
        switch (data.name) {
            case 'banner1Name':
                setBanner1(data);
                break;
            case 'banner2Name':
                setBanner2(data);
                break;
            case 'banner3Name':
                setBanner3(data);
                break;
            case 'banner4Name':
                setBanner4(data);
                break;
            case 'banner5Name':
                setBanner5(data);
                break;
            case 'banner6Name':
                setBanner6(data);
                break;
            default:
                break;
        }
    };

    const handleChangeImg = (e) => {
        var image = document.getElementById("output");
        image.src = URL.createObjectURL(e.target.files[0]);
    };

    const handleOpenModal = (name) => {
        switch (name) {
            case 'banner1Name':
                setModalData(banner1);
                break;
            case 'banner2Name':
                setModalData(banner2);
                break;
            case 'banner3Name':
                setModalData(banner3);
                break;
            case 'banner4Name':
                setModalData(banner4);
                break;
            case 'banner5Name':
                setModalData(banner5);
                break;
            case 'banner6Name':
                setModalData(banner6);
                break;
            default:
                break;
        }
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
                    onClick={typePermission !== '1' ? () => { } : handleOpenModal} />
            </div>
        )
    }

    const emailRegExp = /^[A-Za-z0-9_.@]+$/;
    function isValidateEmail() {
        return this
            .matches(
                emailRegExp,
                "* ขออภัย อนุญาตให้ใช้เฉพาะตัวอักษร (a-z), ตัวเลข (0-9) และเครื่องหมายมหัพภาค (.) เท่านั้น"
            )
            .email("* รูปแบบอีเมลไม่ถูกต้อง")
    }
    yup.addMethod(yup.string, "isValidateEmail", isValidateEmail);

    const formik = useFormik({
        initialValues: {
            shopId: '',
            banner1Id: '',
            banner2Id: '',
            banner3Id: '',
            banner4Id: '',
            banner5Id: '',
            banner6Id: '',
            banner1Name: '',
            banner2Name: '',
            banner3Name: '',
            banner4Name: '',
            banner5Name: '',
            banner6Name: '',
            shopName: '',
            description: '',
            email1: '',
            email2: '',
            email3: '',
            email4: '',
            isDeleted: false,
            addBy: '',
            addDate: '',
            editBy: '',
            editDate: ''
        },
        validationSchema: yup.object({
            email1: yup.string().isValidateEmail(),
            email2: yup.string().isValidateEmail(),
            email3: yup.string().isValidateEmail(),
            email4: yup.string().isValidateEmail(),
        }),
        onSubmit: (values) => {
            fetchLoading();
            values.updateBy = localStorage.getItem('user');
            if (values.id) {
                axios.put("shop", values).then((res) => {
                    if (res.data.status) {
                        fetchData();
                        addToast("บันทึกข้อมูลสำเร็จ",
                            { appearance: "success", autoDismiss: true }
                        );
                    } else {
                        addToast("บันทึกข้อมูลไม่สำเร็จ", {
                            appearance: "warning",
                            autoDismiss: true,
                        });
                    }
                    fetchSuccess();
                });
            } else {
                values.addBy = localStorage.getItem('user');
                axios.post("shop", values).then(async (res) => {
                    if (res.data.status) {
                        fetchData();
                        fetchSuccess();
                        addToast("บันทึกข้อมูลสำเร็จ",
                            { appearance: "success", autoDismiss: true }
                        );
                    }
                });
            }

        },
    });

    async function fetchData() {
        const response = await axios.get('shop');
        const shop = await response.data.tbShop;
        formik.resetForm();
        if (shop !== null) {
            for (const columns in shop) {
                formik.setFieldValue(columns, response.data.tbUser[columns], false);
            }
        }
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
                                        value={formik.values.description}
                                        disabled={typePermission !== "1"}
                                        onChange={(e) => {
                                            formik.handleChange(e);
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
                modalData={modalData}
                onSubmitModal={handleSubmitModal}
                handleModal={() => setOpen(false)} />}
        </>
    )
}

export default Setting