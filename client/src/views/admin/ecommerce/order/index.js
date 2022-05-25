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
import { EncodeKey } from 'services/default.service';
import OrderDetail from './OrderDetail';

const Order = () => {
    const dispatch = useDispatch();
    const { addToast } = useToasts();
    const [orderList, setOrderList] = useState([]);
    const [listSearch, setListSearch] = useState([]);
    const [open, setOpen] = useState(false);
    const [orderHD, setOrderHD] = useState({});
    const [orderDT, setOrderDT] = useState([]);

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
        dispatch(fetchLoading());
        await axios.get("order/orderHD").then(async (response) => {
            if (!response.data.error && response.data.tbOrderHD) {
                let _orderData = response.data.tbOrderHD;
                await axios.get("members").then(res => {
                    _orderData = _orderData.map(order => {
                        const member = res.data.tbMember.filter(
                            member => member.id === EncodeKey(order.memberId)
                        );
                        if (member && member.length > 0) {
                            order.memberName = member[0].firstName + ' ' + member[0].lastName;
                        }
                        return order;
                    })
                    dispatch(fetchSuccess());
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
                        x.sumPrice.toString().toLowerCase().includes(e) ||
                        x.imageName.toLowerCase().includes(e)
                )
            );
        }
    };

    const openModal = async (id) => {
        const data = orderList.filter((x) => x.id === id);
        if (data && data.length > 0) {

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

    const saveImage = async (id) => {
        if (orderImage.image) {
            orderImage.relatedId = id;
            await onSaveImage(orderImage);
        }
    }

    const handleModal = async (value) => {
        if (value === 'save') {
            await saveImage(orderHD.id);
        }
    }

    const handleExport = async () => {

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
                        </div>
                    </div>
                    <OrderList orderList={orderList} openModal={openModal} />
                </div>
            </div>
            {open && <OrderDetail
                open={open}
                handleChangeImage={handleChangeImage}
                orderImage={orderImage}
                handleExport={handleExport}
                handleModal={handleModal} />}
        </>
    )
}

export default Order