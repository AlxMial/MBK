import React, { useState } from 'react'
import { useFormik } from "formik";
import axios from "services/axios";
import { fetchLoading, fetchSuccess } from 'redux/actions/common';
import * as yup from "yup";
import { useToasts } from "react-toast-notifications";
import PaymentModal from './PaymentModal';
import PaymentTable from './PaymentTable';
import InputSearchUC from 'components/InputSearchUC';
import ButtonModalUC from 'components/ButtonModalUC';

const Payment = () => {
    const { addToast } = useToasts();
    const [listPayment, setListPayment] = useState([]);
    const [listSearch, setListSearch] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const fetchData = async () => {
        await axios.get("payment").then((response) => {
            if (!response.data.error) {
                setListPayment(response.data.tbPayment);
                setListSearch(response.data.tbPayment);
            }
        });
    };

    const handleChangeImage = (e) => {
        const image = document.getElementById("bankImage");
        image.src = URL.createObjectURL(e.target.files[0]);
        setSelectedImage(e.target.files[0]);
    };

    const InputSearch = (e) => {
        e = e.toLowerCase();
        if (e === "") {
            setListPayment(listSearch);
        } else {
            setListPayment(
                listPayment.filter(
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
        const data = listPayment.filter((x) => x.id === id);
        if (data) {
            for (const field in data) {
                formik.setFieldValue(field, data[field], false);
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
            values.updateBy = localStorage.getItem('user');
            if (values.id) {
                axios.put("payment", values).then((res) => {
                    if (res.data.status) {
                        // Save Image ต่อ
                        if (selectedImage) {
                            fetchSuccess();
                            fetchData();
                            addToast("บันทึกข้อมูลสำเร็จ",
                                { appearance: "success", autoDismiss: true }
                            );
                        } else {
                            fetchSuccess();
                            fetchData();
                            addToast("บันทึกข้อมูลสำเร็จ",
                                { appearance: "success", autoDismiss: true }
                            );
                        }
                    } else {
                        addToast("บันทึกข้อมูลไม่สำเร็จ", {
                            appearance: "warning",
                            autoDismiss: true,
                        });
                    }
                });
            } else {
                values.addBy = localStorage.getItem('user');
                axios.post("payment", values).then(async (res) => {
                    if (res.data.status) {
                        // Save Image ต่อ
                        if (selectedImage) {
                            fetchSuccess();
                            setOpen(false);
                            fetchData();
                            addToast("บันทึกข้อมูลสำเร็จ",
                                { appearance: "success", autoDismiss: true }
                            );
                        } else {
                            fetchData();
                            setOpen(false);
                            fetchSuccess();
                            addToast("บันทึกข้อมูลสำเร็จ",
                                { appearance: "success", autoDismiss: true }
                            );
                        }
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
                handleChangeImage={handleChangeImage}
                handleModal={() => setOpen(false)} />}
        </>
    )
}

export default Payment