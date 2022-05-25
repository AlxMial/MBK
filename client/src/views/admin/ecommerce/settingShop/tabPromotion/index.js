import React, { useState, useEffect } from 'react'
import { useFormik } from "formik";
import axios from "services/axios";
import { fetchLoading, fetchSuccess } from 'redux/actions/common';
import * as yup from "yup";
import { useToasts } from "react-toast-notifications";
import PromotionModal from './PromotionModal';
import PromotionTable from './PromotionTable';
import InputSearchUC from 'components/InputSearchUC';
import ButtonModalUC from 'components/ButtonModalUC';
import { useDispatch } from 'react-redux';

const Promotion = () => {
    const { addToast } = useToasts();
    const dispatch = useDispatch();
    const [listPromotion, setListPromotion] = useState([]);
    const [listSearch, setListSearch] = useState([]);
    const [open, setOpen] = useState(false);

    const fetchData = async () => {
        dispatch(fetchLoading());
        await axios.get("promotionStore").then((response) => {
            if (!response.data.error) {
                setListPromotion(response.data.tbPromotionStore);
                setListSearch(response.data.tbPromotionStore);
            }
            dispatch(fetchSuccess());
        });
    };

    useEffect(() => {
        // fetchPermission();
        fetchData();
    }, []);

    const InputSearch = (e) => {
        e = e.toLowerCase();
        if (e === "") {
            setListPromotion(listSearch);
        } else {
            setListPromotion(
                listPromotion.filter(
                    (x) =>
                        x.accountName.toLowerCase().includes(e) ||
                        x.accountNumber.toLowerCase().includes(e) ||
                        x.bankName.toLowerCase().toString().includes(e) ||
                        x.bankBranchName.toLowerCase().includes(e)
                )
            );
        }
    };

    const openModal = (id) => {
        formik.resetForm();
        const data = listPromotion.filter((x) => x.id === id);
        if (data && data.length > 0) {
            for (const field in data[0]) {
                formik.setFieldValue(field, data[0][field], false);
            }
        }
        setOpen(true);
    }

    const formik = useFormik({
        initialValues: {
            id: "",
            campaignName: "",
            buy: '',
            condition: 'discount',
            discount: '',
            discountName: '',
            percentDiscount: '',
            percentDiscountAmount: '',
            stockId: '',
            description: '',
            isInactive: true,
            isDeleted: false,
            addBy: "",
            updateBy: ""
        },
        validationSchema: yup.object({
            campaignName: yup.string().required("* กรุณากรอก ชื่อแคมเปญ"),
            condition: yup.string().required("* กรุณากรอก เงื่อนไข"),
            discount: yup.string().required("* กรุณากรอก ส่วนลด"),
            percentDiscount: yup.string().required("* กรุณากรอก %ส่วนลด"),
            percentDiscountAmount: yup.string().required("* กรุณากรอก ส่วนลดสูงสุด"),
            stockId: yup.string().required("* กรุณากรอก สินค้าจากคลัง"),
        }),
        onSubmit: (values) => {
            dispatch(fetchLoading());
            values.updateBy = localStorage.getItem('user');
            if (values.id) {
                axios.put("promotionStore", values).then((res) => {
                    if (res.data.status) {
                        fetchData();
                        setOpen(false);
                        dispatch(fetchSuccess());
                        addToast("บันทึกข้อมูลสำเร็จ",
                            { appearance: "success", autoDismiss: true }
                        );
                    } else {
                        addToast("บันทึกข้อมูลไม่สำเร็จ", {
                            appearance: "warning",
                            autoDismiss: true,
                        });
                    }
                });
            } else {
                values.addBy = localStorage.getItem('user');
                axios.post("promotionStore", values).then(async (res) => {
                    if (res.data.status) {
                        fetchData();
                        setOpen(false);
                        dispatch(fetchSuccess());
                        addToast("บันทึกข้อมูลสำเร็จ",
                            { appearance: "success", autoDismiss: true }
                        );
                    }
                });
            }

        },
    });

    return (
        <>
            <div className="w-full">
                <div
                    className={
                        "py-4 relative flex flex-col min-w-0 break-words w-full mb-6 border rounded-b bg-white Overflow-list "
                    }
                >
                    <div className="rounded-t mb-0 px-4 py-3 border-0">
                        <div className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap ">
                            <div className="w-full lg:w-6/12">
                                <InputSearchUC onChange={(e) => InputSearch(e.target.value)} />
                            </div>
                            <div className={"w-full lg:w-6/12 text-right block"} >
                                <ButtonModalUC onClick={() => openModal()}
                                    label='เพิ่มโปรโมชั่น' />
                            </div>
                        </div>
                    </div>
                    <PromotionTable listPromotion={listPromotion} openModal={openModal} />
                </div>
            </div>
            {open && <PromotionModal
                open={open}
                formik={formik}
                handleModal={() => setOpen(false)} />}
        </>
    )
}

export default Promotion