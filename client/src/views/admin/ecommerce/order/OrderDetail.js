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

const OrderDetail = ({ open, handleModal, orderImage, handleChangeImage, handleExport }) => {
    Modal.setAppElement("#root");
    const useStyle = customStyles();
    const useStyleMobile = customStylesMobile();
    const { width } = useWindowDimensions();

    return (
        <Modal
            isOpen={open}
            onRequestClose={handleModal}
            style={width <= 1180 ? useStyleMobile : useStyle}
            contentLabel="Example Modal"
            shouldCloseOnOverlayClick={false}
        >
            <div className="flex flex-wrap">
                <div className="w-full flex-auto mt-2">
                    <ModalHeader title="เพิ่มช่องทางการชำระเงิน" handleModal={() => handleModal('close')} />
                    <div className="flex flex-wrap px-24 py-10 justify-center">
                        <div className="w-full lg:w-10/12 px-4 margin-auto-t-b ">


                        </div>
                    </div>
                    <ButtonUCSaveModal showExport={true} exportBtnLabel='Export คำสั่งซื้อ' handleExport={handleExport} />
                </div>
            </div>
        </Modal>
    )
}

export default OrderDetail