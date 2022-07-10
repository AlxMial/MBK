import React from 'react'

const ModalHeader = ({ title, handleModal,isClose = true }) => {
    return (
        <>
            <div className=" flex justify-between align-middle ">
                <div className=" align-middle  mb-3">
                    <div className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-base text-green-mbk font-bold whitespace-nowrap p-4">
                        <label>{title}</label>
                    </div>
                </div>

                <div className= {"  text-right align-middle  mb-3" +((!isClose) ? " hidden" : "")}>
                    <div className=" border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm text-red-500 font-bold whitespace-nowrap p-4">
                        <label
                            className="cursor-pointer"
                            onClick={() => handleModal()}
                        >
                            X
                        </label>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ModalHeader