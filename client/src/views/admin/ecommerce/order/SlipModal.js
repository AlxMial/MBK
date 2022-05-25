import React from 'react'
import Modal from "react-modal";
import {
    customStyles,
    customStylesMobile,
} from "assets/styles/theme/ReactModal";
import useWindowDimensions from "services/useWindowDimensions";

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
            shouldCloseOnOverlayClick={false}
        >
            <form>
                <div className="flex flex-wrap">
                    <div className="w-full flex-auto mt-2">
                        <div className=" flex justify-between align-middle ">
                            <div className=" align-middle  mb-3">
                                <div className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-base text-green-mbk font-bold whitespace-nowrap p-4">
                                    <label>ไฟล์แนบ</label>
                                </div>
                            </div>

                            <div className="  text-right align-middle  mb-3">
                                <div className=" border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm text-red-500 font-bold whitespace-nowrap p-4">
                                    <label
                                        className="cursor-pointer"
                                        onClick={() => {
                                            handleModal();
                                        }}
                                    >
                                        X
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap px-10 py-10 justify-center">
                            <div className="w-full lg:w-10/12 margin-auto-t-b ">
                                <div className="flex flex-wrap">
                                    <div className="w-full">
                                        <img src={image} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </Modal>
    )
}

export default SlipModal