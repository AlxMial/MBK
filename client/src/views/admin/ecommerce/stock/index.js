import React, { useState, useEffect } from 'react'
import { useFormik } from "formik";
import axios from "services/axios";
import { fetchLoading, fetchSuccess } from 'redux/actions/common';
import * as yup from "yup";
import { useToasts } from "react-toast-notifications";
import InputSearchUC from 'components/InputSearchUC';
import ButtonModalUC from 'components/ButtonModalUC';
import StockInfo from './StockInfo';
import StockList from './Stocklist';
import PageTitle from 'views/admin/PageTitle';
import FilesService from "../../../../services/files";

const Stock = () => {
    const { addToast } = useToasts();
    const [listStock, setListStock] = useState([]);
    const [listSearch, setListSearch] = useState([]);
    const [open, setOpen] = useState(false);

    const _defaultImage = {
        id: null,
        image: null,
        relatedId: null,
        relatedTable: 'stock1',
        isDeleted: false,
        addBy: null,
        updateBy: null,
    }

    const [stockImage, setStockImage] = useState([
        _defaultImage,
        { ..._defaultImage, relatedTable: 'stock2' },
        { ..._defaultImage, relatedTable: 'stock3' },
        { ..._defaultImage, relatedTable: 'stock4' },
        { ..._defaultImage, relatedTable: 'stock5' },
    ]);

    const fetchData = async () => {
        await axios.get("stock").then((response) => {
            if (!response.data.error && response.data.tbStock) {
                console.log('fetchData', response.data.tbStock);
                setListStock(response.data.tbStock);
                setListSearch(response.data.tbStock);
            }
        });
    };

    useEffect(() => {
        // fetchPermission();
        fetchData();
    }, []);

    const InputSearch = (e) => {
        e = e.toLowerCase();
        if (e === "") {
            setListStock(listSearch);
        } else {
            setListStock(
                listStock.filter(
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
        const data = listStock.filter((x) => x.id === id);
        if (data && data.length > 0) {
            for (const field in data[0]) {
                formik.setFieldValue(field, data[0][field], false);
            }
        }
        setOpen(true);
    }

    const handleChangeImage = async (e) => {
        e.preventDefault();
        const base64 = await FilesService.convertToBase64(e.target.files[0]);
        const index = parseInt(e.target.id.replace('file', ''));
        setStockImage({ ...stockImage[index], image: base64 });
    };

    const formik = useFormik({
        initialValues: {
            id: "",
            productName: '',
            productCategoryId: '',
            price: '',
            discount: '',
            discountType: 'baht',
            productCount: '',
            weight: '',
            description: '',
            descriptionPromotion: '',
            isFlashSale: false,
            startDateCampaign: '',
            endDateCampaign: '',
            startTimeCampaign: '',
            endTimeCampaign: '',
            isInactive: true,
            isDeleted: false,
            addBy: '',
            updateBy: '',
        },
        validationSchema: yup.object({
            productName: yup.string().required("* กรุณากรอก ชื่อสินค้า"),
            productCategoryId: yup.string().required("* กรุณากรอก หมวดหมู่สินค้า"),
            price: yup.string().required("* กรุณากรอก ราคา"),
        }),
        onSubmit: (values) => {
            fetchLoading();
            values.updateBy = localStorage.getItem('user');
            if (values.id) {
                axios.put("stock", values).then((res) => {
                    if (res.data.status) {
                        fetchData();
                        setOpen(false);
                        fetchSuccess();
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
                axios.post("stock", values).then(async (res) => {
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

    const handleDeleteList = (id) => {
        setListStock(listStock.filter((x) => x.id !== id));
    }

    return (
        <>
            <PageTitle page='stock' />
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
                                    label='เพิ่มสินค้า' />
                            </div>
                        </div>
                    </div>
                    <StockList listStock={listStock} openModal={openModal} setListStock={handleDeleteList} />
                </div>
            </div>
            {open && <StockInfo
                open={open}
                formik={formik}
                handleChangeImage={handleChangeImage}
                stockImage={stockImage}
                handleModal={() => setOpen(false)} />}
        </>
    )
}

export default Stock