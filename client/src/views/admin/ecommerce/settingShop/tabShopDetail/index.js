import InputUC from 'components/InputUC';
import TextAreaUC from 'components/InputUC/TextAreaUC';
import LabelUC from 'components/LabelUC';
import ProfilePictureUC from 'components/ProfilePictureUC';
import React, { useState, useEffect } from 'react'
import BannerControl from './BannerControl';
import BannerModal from './BannerModal';
import '../index.scss'
import { useFormik } from "formik";
import * as yup from "yup";
import { GetPermissionByUserName } from "services/Permission";
import axios from "services/axios";
import { fetchLoading, fetchSuccess } from 'redux/actions/common';
import { useToasts } from "react-toast-notifications";
import useWindowDimensions from "services/useWindowDimensions";
import FilesService from "services/files";
import { onSaveImage } from 'services/ImageService';
import { useDispatch } from 'react-redux';

const ShopDetail = () => {
    const _defaultImage = {
        id: null,
        image: null,
        relatedId: null,
        relatedTable: 'shop',
        isDeleted: false,
        addBy: null,
        updateBy: null,
    }
    const dispatch = useDispatch();
    const { width } = useWindowDimensions();
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
    const [shopImage, setShopImage] = useState(_defaultImage);

    async function fetchData() {
        dispatch(fetchLoading());
        const response = await axios.get('shop');
        const shop = await response.data.tbShop;

        if (shop) {
            for (const columns in shop) {
                formik.setFieldValue(columns, shop[columns], false);
            }

            const _shopImage = await axios.get(`image/byRelated/${shop.id}/shop`);
            if (_shopImage && _shopImage.data.tbImage) {
                const image = await FilesService.buffer64UTF8(_shopImage.data.tbImage.image)
                setShopImage({ ..._shopImage.data.tbImage, image: image });
            }

            const resBanner = await axios.get(`banner/byShopId/${shop.id}`);
            if (resBanner.data.tbBanner && resBanner.data.tbBanner.length > 0) {
                resBanner.data.tbBanner.forEach(async (e) => {
                    const resImg = await axios.get(`image/byRelated/${e.id}/${e.level}`);
                    let image = null;
                    if (resImg.data.tbImage) {
                        image = await FilesService.buffer64UTF8(resImg.data.tbImage.image);
                    }
                    e.name = e.level;
                    if (image) {
                        // formik.setFieldValue(`${e.level}`, `Image Banner ${e.level.replace('banner', '')}`, false);
                        formik.setFieldValue(`${e.level}`, resImg.data.tbImage.imageName ?? 'Image selected', false);
                    }
                    if (e.level === 'banner1') {
                        setBanner1(image ? { ...e, image: resImg.data.tbImage } : e);
                    } else if (e.level === 'banner2') {
                        setBanner2(image ? { ...e, image: resImg.data.tbImage } : e);
                    } else if (e.level === 'banner3') {
                        setBanner3(image ? { ...e, image: resImg.data.tbImage } : e);
                    } else if (e.level === 'banner4') {
                        setBanner4(image ? { ...e, image: resImg.data.tbImage } : e);
                    } else if (e.level === 'banner5') {
                        setBanner5(image ? { ...e, image: resImg.data.tbImage } : e);
                    } else if (e.level === 'banner6') {
                        setBanner6(image ? { ...e, image: resImg.data.tbImage } : e);
                    }
                });
            }
        }
        dispatch(fetchSuccess());
    }

    useEffect(() => {
        fetchPermission();
        fetchData();
    }, []);

    const fetchPermission = async () => {
        const role = await GetPermissionByUserName();
        setTypePermission(role);
    };

    const onSubmitModal = (data) => {
        formik.setFieldValue(data.name, data.imageName);
        data.image.imageName = data.imageName;
        // prepare for save
        switch (data.name) {
            case 'banner1':
                setBanner1(data);
                break;
            case 'banner2':
                setBanner2(data);
                break;
            case 'banner3':
                setBanner3(data);
                break;
            case 'banner4':
                setBanner4(data);
                break;
            case 'banner5':
                setBanner5(data);
                break;
            case 'banner6':
                setBanner6(data);
                break;
            default:
                break;
        }
    };

    const handleChangeImg = async (e) => {
        const base64 = await FilesService.convertToBase64(e.target.files[0]);
        setShopImage({ ...shopImage, image: base64 });
    };

    const handleOpenModal = (name) => {
        switch (name) {
            case 'banner1':
                setModalData(banner1);
                break;
            case 'banner2':
                setModalData(banner2);
                break;
            case 'banner3':
                setModalData(banner3);
                break;
            case 'banner4':
                setModalData(banner4);
                break;
            case 'banner5':
                setModalData(banner5);
                break;
            case 'banner6':
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
            id: '',
            banner1: '',
            banner2: '',
            banner3: '',
            banner4: '',
            banner5: '',
            banner6: '',
            shopName: '',
            description: '',
            email1: '',
            email2: '',
            email3: '',
            email4: '',
            isDeleted: false,
            addBy: '',
            updateBy: '',
        },
        validationSchema: yup.object({
            email1: yup.string().isValidateEmail(),
            email2: yup.string().isValidateEmail(),
            email3: yup.string().isValidateEmail(),
            email4: yup.string().isValidateEmail(),
        }),
        onSubmit: (values) => {
            dispatch(fetchLoading());
            values.updateBy = localStorage.getItem('user');
            if (values.id) {
                axios.put("shop", values).then(async (res) => {
                    if (res.data.status) {
                        await saveAfterShop(values.id);
                    } else {
                        addToast("บันทึกข้อมูลไม่สำเร็จ", {
                            appearance: "warning",
                            autoDismiss: true,
                        });
                    }
                    dispatch(fetchSuccess());
                });
            } else {
                values.addBy = localStorage.getItem('user');
                axios.post("shop", values).then(async (res) => {
                    if (res.data.status) {
                        await saveAfterShop(res.data.tbShop.id);
                    } else {
                        addToast("บันทึกข้อมูลไม่สำเร็จ", {
                            appearance: "warning",
                            autoDismiss: true,
                        });
                    }
                    dispatch(fetchSuccess());
                });
            }
        },
    });

    const saveAfterShop = async (id) => {
        // save shop image
        let success = true;
        dispatch(fetchLoading());
        if (shopImage) {
            const imageData = { ...shopImage, relatedId: id };
            await onSaveImage(imageData, async (res) => {
                success = res.data.status;
                if (success) {
                    // save banner
                    if (await saveBanner(id)) {
                        afterSaveSuccess();
                    } else {
                        dispatch(fetchSuccess());
                        addToast("บันทึกข้อมูลไม่สำเร็จ", {
                            appearance: "warning",
                            autoDismiss: true,
                        });
                    }
                } else {
                    dispatch(fetchSuccess());
                    addToast("บันทึกข้อมูลไม่สำเร็จ", {
                        appearance: "warning",
                        autoDismiss: true,
                    });
                }
            });
        } else {
            // save banner
            if (await saveBanner(id)) {
                afterSaveSuccess();
            } else {
                dispatch(fetchSuccess());
                addToast("บันทึกข้อมูลไม่สำเร็จ", {
                    appearance: "warning",
                    autoDismiss: true,
                });
            }
        }
    }

    const afterSaveSuccess = () => {
        dispatch(fetchSuccess());
        // fetchData();
        addToast("บันทึกข้อมูลสำเร็จ",
            { appearance: "success", autoDismiss: true }
        );
    }

    const saveBanner = async (id) => {
        let success = true;
        if (banner1) {
            success = await saveBanners(banner1, id);
        }
        if (success && banner2) {
            success = await saveBanners(banner2, id);
        }
        if (success && banner3) {
            success = await saveBanners(banner3, id);
        }
        if (success && banner4) {
            success = await saveBanners(banner4, id);
        }
        if (success && banner5) {
            success = await saveBanners(banner5, id);
        }
        if (success && banner6) {
            success = await saveBanners(banner6, id);
        }
        return success;
    }


    const saveBanners = async (data, id) => {
        data.updateBy = localStorage.getItem('user');
        data.shopId = id;
        data.isDeleted = false;
        dispatch(fetchLoading());
        if (data.id) {
            axios.put("banner", data).then(async (res) => {
                if (res.data.status) {
                    const success = await saveBannerImage(data, data.id);
                    return success
                } else {
                    dispatch(fetchSuccess());
                    return false;
                }
            });
        } else {
            data.addBy = localStorage.getItem('user');
            axios.post("banner", data).then(async (res) => {
                if (res.data.status) {
                    const success = await saveBannerImage(data, res.data.tbBanner.id);
                    return success
                } else {
                    dispatch(fetchSuccess());
                    return false;
                }
            });
        }
        return true;
    }

    const saveBannerImage = async (data, id) => {
        // Save Image Banner
        dispatch(fetchLoading());
        if (data.image) {
            data.image.relatedId = id;
            data.image.isDeleted = false;
            await onSaveImage(data.image, (res) => {
                dispatch(fetchSuccess());
                return true;
            })

        } else {
            dispatch(fetchSuccess());
            addToast("บันทึกข้อมูลสำเร็จ",
                { appearance: "success", autoDismiss: true }
            );
            return true;
        }
    }

    const bannerList = ['banner1', 'banner2', 'banner3', 'banner4', 'banner5', 'banner6'];
    const emailList = ['email1', 'email2', 'email3', 'email4'];

    return (
        <>
            <div className="w-full">
                <form onSubmit={formik.handleSubmit}>
                    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 border bg-white rounded-b Overflow-info py-10 lg:px-10">
                        <div className={"flex flex-wrap justify-between " + (width > 768 ? ' banner flex-col' : '')}>
                            <div className="w-full px-4 lg:w-2/12 ">
                                <ProfilePictureUC
                                    src={shopImage.image}
                                    id='shopImage'
                                    hoverText='เลือกรูปร้านค้า'
                                    onChange={handleChangeImg} />
                            </div>
                            <div className={"w-full lg:w-2/12 px-4 " + (width > 768 ? ' banner-label' : ' text-center mt-4')}>
                                <div className="relative w-full px-4">
                                    <label className=" text-blueGray-600 text-sm font-bold ">
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
                handleSubmitModal={handleSubmitModal}
                handleModal={() => setOpen(false)} />}
        </>
    )
}

export default ShopDetail