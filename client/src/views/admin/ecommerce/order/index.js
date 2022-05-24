import React, { useState, useEffect } from 'react'
import { useFormik } from "formik";
import axios from "services/axios";
import { fetchLoading, fetchSuccess } from 'redux/actions/common';
import * as yup from "yup";
import { useToasts } from "react-toast-notifications";
import InputSearchUC from 'components/InputSearchUC';
import ButtonModalUC from 'components/ButtonModalUC';
import PageTitle from 'views/admin/PageTitle';
import FilesService from "../../../../services/files";
import { onSaveImage } from 'services/ImageService';
import { useDispatch } from 'react-redux';
import OrderList from './OrderList';

const Order = () => {
    const dispatch = useDispatch();
    const { addToast } = useToasts();
    const [orderList, setOrderList] = useState([]);
    const [listSearch, setListSearch] = useState([]);
    const [open, setOpen] = useState(false);

    const _defaultImage = {
        id: null,
        image: null,
        relatedId: null,
        relatedTable: 'order',
        isDeleted: false,
        addBy: null,
        updateBy: null,
    }

    const [orderImage, setOrderImage] = useState(_defaultImage);

    const fetchData = async () => {
        await axios.get("order/orderHD").then(async (response) => {
            if (!response.data.error && response.data.tbOrderHD) {
                let _orderData = response.data.tbOrderHD;
                await axios.get("members").then(res => {
                    _orderData = _orderData.map(order => {
                        const member = res.data.tbMember.find(
                            member => member.id === order.memberId
                        );
                        order.memberName = member[0].firstName + ' ' + member[0].lastName;
                    })
                });
                setOrderList(_orderData);
                setListSearch(_orderData);
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
            setOrderList(listSearch);
        } else {
            setOrderList(
                orderList.filter(
                    (x) =>
                        x.orderNumber.toLowerCase().includes(e) ||
                        x.orderDate.toLowerCase().includes(e) ||
                        x.memberName.toLowerCase().includes(e) ||
                        x.sumPrice.toLowerCase().toString().includes(e) ||
                        x.imageName.toLowerCase().includes(e)
                )
            );
        }
    };

    const openModal = async (id) => {
        formik.resetForm();
        const data = orderList.filter((x) => x.id === id);
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
        setOrderImage(orderImage.map((x, i) => {
            if ((i + 1) === index) {
                return { ...x, image: base64 };
            }
            return x;
        }));
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
            console.log('onSubmit', values);
            dispatch(fetchLoading());
            values.updateBy = localStorage.getItem('user');
            if (values.id) {
                axios.put("stock", values).then(async (res) => {
                    console.log('res', res);
                    if (res.data.status) {
                        await saveImage(values.id);
                        afterSaveSuccess();
                    } else {
                        dispatch(fetchSuccess());
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
                        await saveImage(res.data.tbStock.id);
                        afterSaveSuccess();
                    } else {
                        dispatch(fetchSuccess());
                        addToast("บันทึกข้อมูลไม่สำเร็จ", {
                            appearance: "warning",
                            autoDismiss: true,
                        });
                    }
                });
            }

        },
    });

    const afterSaveSuccess = () => {
        fetchData();
        setOpen(false);
        dispatch(fetchSuccess());
        addToast("บันทึกข้อมูลสำเร็จ",
            { appearance: "success", autoDismiss: true }
        );
    }

    const saveImage = async (id) => {
        orderImage.forEach(async (item, index) => {
            if (item.image) {
                item.relatedId = id;
                await onSaveImage(item);
            }
        });
    }

    return (
        <>
            <PageTitle page='order' />
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
                                    label='เพิ่มรายการสั่งซื้อ' />
                            </div>
                        </div>
                    </div>
                    <OrderList orderList={orderList} openModal={openModal} />
                </div>
            </div>
            {/* {open && <StockInfo
                open={open}
                formik={formik}
                handleChangeImage={handleChangeImage}
                stockImage={stockImage}
                handleModal={() => setOpen(false)} />} */}
        </>
    )
}

export default Order