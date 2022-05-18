import React, { useState } from 'react'
import { useFormik } from "formik";
import axios from "services/axios";
import { fetchLoading, fetchSuccess } from 'redux/actions/common';
import * as yup from "yup";
import { useToasts } from "react-toast-notifications";

const Payment = () => {
    const { addToast } = useToasts();
    const [listPayment, setListPayment] = useState([]);
    const [listSearch, setListSearch] = useState([]);
    const [open, setOpen] = useState(false);

    const fetchData = async () => {
        await axios.get("pointCode").then((response) => {
            if (!response.data.error) {
                setListPayment(response.data.tbPayment);
                setListSearch(response.data.tbPayment);
            }
        });
    };

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
                        fetchSuccess();
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
                });
            } else {
                values.addBy = localStorage.getItem('user');
                axios.post("payment", values).then(async (res) => {
                    if (res.data.status) {
                        fetchData();
                        setOpen(false);
                        fetchSuccess();
                        addToast("บันทึกข้อมูลสำเร็จ",
                            { appearance: "success", autoDismiss: true }
                        );
                    }
                });
            }

        },
    });

    return (
        <div>Payment</div>
    )
}

export default Payment