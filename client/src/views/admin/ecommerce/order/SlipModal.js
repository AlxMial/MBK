import React from 'react'
import Modal from "react-modal";
import {
    customStyles,
    customStylesMobile,
} from "assets/styles/theme/ReactModal";
import useWindowDimensions from "services/useWindowDimensions";
import ModalHeader from 'views/admin/ModalHeader';

const SlipModal = ({ open, image, handleModal }) => {
    Modal.setAppElement("#root");
    const useStyle = customStyles({ width: 'auto' });
    const useStyleMobile = customStylesMobile();
    const { width } = useWindowDimensions();

    return (
        <Modal
            isOpen={open}
            onRequestClose={handleModal}
            style={width <= 1180 ? useStyleMobile : useStyle}
            contentLabel="Example Modal"
            shouldCloseOnOverlayClick={true}
        >
            <div className="flex flex-wrap">
                <div className="w-full flex-auto mt-2">
                    <ModalHeader title="รูปภาพ" handleModal={handleModal} />
                    <div className="flex flex-wrap px-10 p-3 justify-center">
                        <div className="w-full">
                            <img src={image} />
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default SlipModal