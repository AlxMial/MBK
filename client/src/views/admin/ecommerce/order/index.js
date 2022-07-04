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
    const [orderImage, setOrderImage] = useState(null);
    const [memberData, setMemberData] = useState(null);
    const [transportStatus, setTransportStatus] = useState(null);
    const [isChangeOrderNumber, setIsChangeOrderNumber] = useState(false);
    const [orderNumber, setOrderNumber] = useState(null);
    const [isCancel, setIsCancel] = useState(false);
    const [cancelReason, setCancelReason] = useState('');

    const fetchData = async () => {
        dispatch(fetchLoading());
        setOrderImage(null);
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
                            order.phone = member[0].phone;
                            setMemberData(member[0]);
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
                listSearch.filter(
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
        dispatch(fetchLoading());
        const data = orderList.filter((x) => x.id === id);
        if (data && data.length > 0) {
            setOrderHD(data[0]);
            setOrderNumber(data[0].orderNumber);
            setTransportStatus(data[0].transportStatus);
            setIsCancel(data[0].isCancel);
            if (data[0].isCancel) {
                const res = await axios.get("cancelOrder/byOrderId/" + id);
                if (!res.data.error && res.data.tbCancelOrder) {
                    setCancelReason(res.data.tbCancelOrder.description);
                }
            }
            const res = await axios.get("order/orderDT/byOrderId/" + id);
            if (!res.data.error && res.data.tbOrderDT) {
                const _orderDT = res.data.tbOrderDT;
                setOrderDT(_orderDT.map((x) => {
                    if (x.image) {
                        const base64 = FilesService.buffer64UTF8(x.image);
                        return { ...x, image: base64 };
                    }
                    return x;
                }));
            }

            const _orderImage = await axios.get(`image/byRelated/${id}/tbOrderHD`);
            if (_orderImage && _orderImage.data.tbImage) {
                const image = FilesService.buffer64UTF8(_orderImage.data.tbImage.image)
                setOrderImage(image);
            }

            dispatch(fetchSuccess());
            setOpen(true);
        } else {
            dispatch(fetchSuccess());
        }
    }

    const handleModal = async (value) => {
        if (value === 'save') {
            dispatch(fetchLoading());
            if ((!isCancel || (isCancel && cancelReason !== ''))
                && ((orderNumber !== orderHD.orderNumber
                    && isChangeOrderNumber && orderNumber !== '') || !isChangeOrderNumber)) {

                const res = await axios.get("order/orderHD/ById/" + orderHD.id);
                if (!res.data.error && res.data.tbOrderHD) {
                    // console.log(res.data.tbOrderHD);
                    const _dataHD = res.data.tbOrderHD;

                    _dataHD.transportStatus = orderHD.transportStatus;
                    _dataHD.paymentStatus = orderHD.paymentStatus;
                    _dataHD.trackNo = orderHD.trackNo;
                    // if (isChangeOrderNumber) {
                    //     _dataHD.orderNumber = orderNumber;
                    // }
                    _dataHD.isCancel = isCancel;
                   
                    await axios.put("order/orderHD", _dataHD).then(async (res) => {
                        if (res.data.error) {
                            dispatch(fetchSuccess());
                            addToast("บันทึกข้อมูลไม่สำเร็จ", {
                                appearance: "warning",
                                autoDismiss: true,
                            });
                        } else if (isCancel) {
                            // insert into tbCancelOrder
                            const _dataCancel = {
                                id: '',
                                orderId: orderHD.id,
                                cancelStatus: 'done',
                                cancelDetail: orderHD.tbCancelOrder.cancelDetail,
                                description: cancelReason,
                                addBy: sessionStorage.getItem('user'),
                                updateBy: sessionStorage.getItem('user'),
                                isDeleted: false,
                            }
                            console.log(_dataCancel)
                            await axios.post("cancelOrder", _dataCancel).then(async (res) => {
                                if (res.data.status) {
                                    addToast("บันทึกข้อมูลสำเร็จ",
                                        { appearance: "success", autoDismiss: true }
                                    );
                                } else {
                                    addToast("บันทึกข้อมูลไม่สำเร็จ", {
                                        appearance: "warning",
                                        autoDismiss: true,
                                    });
                                }
                                dispatch(fetchSuccess());
                            });
                        }
                    });
                    await fetchData();
                    setOpen(false);
                }
            }else {     dispatch(fetchSuccess()); }

            // await saveImage(orderHD.id);
        } else {
            setOpen(false);
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
                orderImage={orderImage}
                orderHD={orderHD}
                orderHDold={orderHD}
                orderDT={orderDT}
                memberData={memberData}
                handleExport={handleExport}
                isChangeOrderNumber={isChangeOrderNumber}
                setIsChangeOrderNumber={setIsChangeOrderNumber}
                setOrderNumber={setOrderNumber}
                isCancel={isCancel}
                setIsCancel={setIsCancel}
                orderNumber={orderNumber}
                cancelReason={cancelReason}
                setCancelReason={setCancelReason}
                transportStatus={transportStatus}
                setTransportStatus={setTransportStatus}
                handleModal={handleModal}
                setOrderHD={setOrderHD} />}
        </>
    )
}

export default Order