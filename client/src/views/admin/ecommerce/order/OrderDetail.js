import React, { useEffect, useState } from 'react'
import Modal from "react-modal";
import {
    customStyles,
    customStylesMobile,
} from "assets/styles/theme/ReactModal";
import LabelUC from 'components/LabelUC';
import useWindowDimensions from "services/useWindowDimensions";
// import InputUC from 'components/InputUC';
// import ProfilePictureUC from 'components/ProfilePictureUC';
// import FilesService from "services/files";
// import ValidateService from "services/validateValue";
import ButtonUCSaveModal from 'components/ButtonUCSaveModal';
import ModalHeader from 'views/admin/ModalHeader';
import PurchaseOrder from './PurchaseOrder';
import CustomerName from './CustomerName';
import Payment from './Payment';
import Logistic from './Logistic';
import ExportPdf from './Export/ExportPdf';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
// import ExportHeader from './ExportHeader';
import { useDispatch } from 'react-redux';
import { fetchLoading, fetchSuccess } from 'redux/actions/common';
import * as Address from "services/GetAddress.js";

const OrderDetail = ({
    open, handleModal, orderHD, orderHDold, orderDT, memberData, orderImage,
    handleExport, transportStatus, setTransportStatus,
    isChangeOrderNumber,
    setIsChangeOrderNumber, orderNumber, setOrderNumber,
    isCancel, setIsCancel, cancelReason, setCancelReason, setOrderHD }) => {
    Modal.setAppElement("#root");
    const dispatch = useDispatch();
    const useStyle = customStyles({ width: '70vw' });
    const useStyleMobile = customStylesMobile();
    const [isCanEdit, setIsCanEdit] = useState(true);
    const { width } = useWindowDimensions();
    const [openExport, setOpenExport] = useState(false);
    const [dataExport, setDataExport] = useState({});

    const propsPurchaseOrder = { orderHD, orderDT, openExport };
    const propsPayment = { orderHD, orderHDold, orderDT, isCanEdit }
    const propsLogistic = {
        orderHD, orderDT,orderHDold, memberData, setIsChangeOrderNumber, isCanEdit,
        orderNumber, setOrderNumber, isCancel, setIsCancel, isChangeOrderNumber,
        cancelReason, setCancelReason, transportStatus, setTransportStatus
    }

    useEffect(async () => {
        //สถานะยกเลิก
        if (orderHDold.isCancel) {
            setIsCanEdit(false);
        }
        //มีการขอยกเลิก
        if (orderHD.tbCancelOrder != null) {
            setIsCanEdit(false);
        }

        const subDistrict = await Address.getAddressName("subDistrict", memberData.subDistrict);
        const district = await Address.getAddressName("district", memberData.district);
        const _province = await Address.getAddressName("province", memberData.province);

        setDataExport({
            name: orderHD.memberName,
            orderNumber: orderHD.orderNumber,
            address: (subDistrict ? ('ตำบล/แขวง ' + subDistrict) : '')
                + ' ' + (district ? ('อำเภอ/เขต ' + district) : '')
                + ' ' + (_province ? ((_province !== 'กรุงเทพมหานคร' ? 'จังหวัด ' : '') + _province) : '')
                + ' ' + memberData.postcode
                + ' ' + memberData.country,
            phone: memberData.phone,
            email: memberData.email,
        });
    }, []);

    useEffect(async () => {
        if (openExport && dataExport) {
            dispatch(fetchLoading());
            const pdf = new jsPDF("portrait", "px", "a4");
            const data = await html2canvas(document.querySelector("#purchaseOrder"));
            const img = data.toDataURL("image/png");
            const imgProperties = pdf.getImageProperties(img);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
            pdf.addImage(img, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save("Export คำสั่งซื้อ.pdf");
            setOpenExport(false);
            dispatch(fetchSuccess());
        }
    }, [openExport, dataExport]);


    // console.log(orderHD)

    return (
        <Modal
            isOpen={open}
            onRequestClose={() => handleModal('save')}
            style={width <= 1180 ? useStyleMobile : useStyle}
            contentLabel="Example Modal"
            shouldCloseOnOverlayClick={false}
        >
            <div className="flex flex-wrap">
                <div className="w-full flex-auto mt-2">
                    <ModalHeader title="รายละเอียดการสั่งซื้อ" handleModal={() => handleModal('close')} />
                    <div className="flex flex-wrap justify-center  Overflow-info">
                        <div className="w-full p-4 margin-auto-t-b flex flex-wrap ">
                            <div className="w-full lg:w-8/12 px-4  flex flex-col">
                                <div className="w-full" id='purchaseOrder'>
                                    {/* {!openExport && <LabelUC label='รายการคำสั่งซื้อ' moreClassName='border-b py-2' />}
                                    {openExport && (<ExportHeader dataExport={dataExport} />)} */}
                                    {/* <LabelUC label='รายการคำสั่งซื้อ' moreClassName='border-b py-2' /> */}
                                    <div className='flex'>
                                        <div className='font-bold' style={{ width: "100px" }}>รายการคำสั่งซื้อ</div>
                                        <div style={{ width: "calc(100% - 100px)", textAlign: "end" }}>{"หมายเลขคำสั่งซื้อ " + orderHD.orderNumber}</div>
                                    </div>
                                    <PurchaseOrder props={propsPurchaseOrder} />

                                </div>
                                <div className="w-full">
                                    <LabelUC label='หลักฐานการชำระ' moreClassName='py-2' />
                                    <div className="pt-2 text-center px-12">
                                        <img src={orderImage} className='image-slip' />
                                    </div>
                                </div>
                            </div>
                            <div className="w-full h-full lg:w-4/12 px-4 flex flex-col">
                                <div className="w-full">
                                    <LabelUC label='ชื่อลูกค้า' moreClassName='border-b py-2' />
                                    <CustomerName orderHD={orderHD} />
                                </div>
                                <div className="w-full mt-4">
                                    <LabelUC label='การชำระเงิน' moreClassName='border-b py-2' />
                                    <Payment props={propsPayment}
                                        setOrderHD={setOrderHD} />
                                </div>
                                <div className="w-full mt-4">
                                    <LabelUC label='การจัดส่ง' moreClassName='border-b py-2' />
                                    <Logistic props={propsLogistic}
                                        setOrderHD={setOrderHD} />
                                </div>
                            </div>
                        </div>
                        <div className="flex w-full justify-end">
                            <ExportPdf props={propsPurchaseOrder} dataExport={dataExport} />
                            <ButtonUCSaveModal
                                // showExport={true}
                                // exportBtnLabel='Export คำสั่งซื้อ'
                                // handleExport={createPDF}
                                // isShowSave={isCanEdit}
                                onClick={() => {
                                    if (isCanEdit) {
                                        handleModal('save')
                                    }
                                }
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default OrderDetail