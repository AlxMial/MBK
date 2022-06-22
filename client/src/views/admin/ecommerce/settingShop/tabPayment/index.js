import React, { useState, useEffect } from 'react'
import { useFormik } from "formik";
import axios from "services/axios";
import { fetchLoading, fetchSuccess } from 'redux/actions/common';
import * as yup from "yup";
import { useToasts } from "react-toast-notifications";
import PaymentModal from './PaymentModal';
import PaymentTable from './PaymentTable';
import InputSearchUC from 'components/InputSearchUC';
import ButtonModalUC from 'components/ButtonModalUC';
import FilesService from "services/files";
import { onSaveImage } from 'services/ImageService';
import { useDispatch } from 'react-redux';

const Payment = () => {
    const { addToast } = useToasts();
    const dispatch = useDispatch();
    const [listPayment, setListPayment] = useState([]);
    const [listSearch, setListSearch] = useState([]);
    const [open, setOpen] = useState(false);
    const _defaultImage = {
        id: null,
        image: null,
        relatedId: null,
        relatedTable: 'payment',
        isDeleted: false,
        addBy: null,
        updateBy: null,
    }
    const [paymentImage, setPaymentImage] = useState(_defaultImage);

    const fetchData = async () => {
        dispatch(fetchLoading());
        await axios.get("payment").then((response) => {
            if (!response.data.error) {
                setListPayment(response.data.tbPayment);
                setListSearch(response.data.tbPayment);
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
            setListPayment(listSearch);
        } else {
            setListPayment(
                listSearch.filter(
                    (x) =>
                        x.accountName.toLowerCase().includes(e) ||
                        x.accountNumber.toLowerCase().includes(e) ||
                        x.bankName.toLowerCase().toString().includes(e) ||
                        x.bankBranchName.toLowerCase().includes(e)
                )
            );
        }
    };

    const openModal = async (id) => {
        // formik.resetForm();
        const data = listPayment.filter((x) => x.id === id);
        if (data && data.length > 0) {
            const _paymentImage = await axios.get(`image/byRelated/${id}/payment`);
            if (_paymentImage && _paymentImage.data.tbImage) {
                const image = await FilesService.buffer64UTF8(_paymentImage.data.tbImage.image)
                setPaymentImage({ ..._paymentImage.data.tbImage, image: image });
            }
            console.log(data[0])
            for (const field in data[0]) {
                formik.setFieldValue(field, data[0][field], false);
            }
        }
        setOpen(true);
    }

    const formik = useFormik({
        initialValues: {
            id: "",
            bankName: "",
            accountNumber: "",
            accountName: "",
            bankBranchName: "",
            isDeleted: false,
            addBy: "",
            updateBy: ""
        },
        validationSchema: yup.object({
            bankName: yup.string().required("* กรุณากรอก ชื่อธนาคาร"),
            accountNumber: yup.string().required("* กรุณากรอก เลขที่บัญชี"),
            accountName: yup.string().required("* กรุณากรอก ชื่อบัญชี"),
        }),
        onSubmit: (values) => {
            fetchLoading();
            values.updateBy = sessionStorage.getItem('user');
            if (values.id) {
                axios.put("payment", values).then(async (res) => {
                    if (res.data.status) {
                        // Save Image ต่อ
                        if (paymentImage) {
                            const imageData = { ...paymentImage, relatedId: values.id };
                            await onSaveImage(imageData, (res) => {
                                if (res.data.status) {
                                    afterSave(true);
                                } else {
                                    afterSave(false);
                                }
                            });
                        } else {
                            afterSave(true);
                        }
                    } else {
                        afterSave(false);
                    }
                });
            } else {
                values.addBy = sessionStorage.getItem('user');
                axios.post("payment", values).then(async (res) => {
                    if (res.data.status) {
                        // Save Image ต่อ
                        if (paymentImage) {
                            const imageData = { ...paymentImage, relatedId: res.data.tbPayment.id };
                            await onSaveImage(imageData, (res) => {
                                if (res.data.status) {
                                    afterSave(true);
                                } else {
                                    afterSave(false);
                                }
                            });
                        } else {
                            afterSave(true);
                        }
                    }
                });
            }

        },
    });

    const afterSave = (success) => {
        dispatch(fetchSuccess());
        if (success) {
            setOpen(false);
            fetchData();
            addToast("บันทึกข้อมูลสำเร็จ",
                { appearance: "success", autoDismiss: true }
            );
        } else {
            addToast("บันทึกข้อมูลสำเร็จ",
                { appearance: "success", autoDismiss: true }
            );
        }

    }
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
                                    label='เพิ่มช่องทางการชำระเงิน' />
                            </div>
                        </div>
                    </div>
                    <PaymentTable listPayment={listPayment} openModal={openModal} />
                </div>
            </div>
            {open && <PaymentModal
                open={open}
                formik={formik}
                paymentImage={paymentImage}
                setPaymentImage={setPaymentImage}
                handleModal={() => setOpen(false)} />}
        </>
    )
}

export default Payment