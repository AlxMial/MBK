import React from 'react'
import Modal from "react-modal";
import {
    customStyles,
    customStylesMobile,
} from "assets/styles/theme/ReactModal";
import LabelUC from 'components/LabelUC';
import useWindowDimensions from "services/useWindowDimensions";
import InputUC from 'components/InputUC';
import ProfilePictureUC from 'components/ProfilePictureUC';
import FilesService from "services/files";
import ValidateService from "services/validateValue";
import ButtonUCSaveModal from 'components/ButtonUCSaveModal';
import ModalHeader from 'views/admin/ModalHeader';
import PurchaseOrder from './PurchaseOrder';
import CustomerName from './CustomerName';
import Payment from './Payment';
import Logistic from './Logistic';

const OrderDetail = ({ open, handleModal, orderHD, orderDT, memberData, orderImage, handleExport }) => {
    Modal.setAppElement("#root");
    const useStyle = customStyles({ width: '70vw' });
    const useStyleMobile = customStylesMobile();
    const { width } = useWindowDimensions();

    const propsPurchaseOrder = { orderHD, orderDT };
    const propsPayment = { orderHD, orderDT }
    const propsLogistic = { orderHD, orderDT, memberData }

    return (
        <Modal
            isOpen={open}
            onRequestClose={() => handleModal('close')}
            style={width <= 1180 ? useStyleMobile : useStyle}
            contentLabel="Example Modal"
            shouldCloseOnOverlayClick={false}
        >
            <form onSubmit={() => handleModal('save')}>
                <div className="flex flex-wrap">
                    <div className="w-full flex-auto mt-2">
                        <ModalHeader title="รายละเอียดการสั่งซื้อ" handleModal={() => handleModal('close')} />
                        <div className="flex flex-wrap justify-center">
                            <div className="w-full p-4 margin-auto-t-b flex flex-wrap Overflow-info">
                                <div className="w-full lg:w-8/12 px-4  flex flex-col">
                                    <div className="w-full">
                                        <LabelUC label='รายการคำสั่งซื้อ' moreClassName='border-b py-2' />
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
                                        <Payment props={propsPayment} />
                                    </div>
                                    <div className="w-full mt-4">
                                        <LabelUC label='การจัดส่ง' moreClassName='border-b py-2' />
                                        <Logistic props={propsLogistic} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <ButtonUCSaveModal showExport={true} exportBtnLabel='Export คำสั่งซื้อ' handleExport={handleExport} />
                    </div>
                </div>
            </form>
        </Modal>
    )
}

export default OrderDetail