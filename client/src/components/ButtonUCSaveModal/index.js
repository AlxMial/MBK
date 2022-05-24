
import React from 'react'

const ButtonUCSaveModal = () => {
    return (
        <>
            <div className="relative w-full mb-3">
                <div className=" flex justify-between align-middle ">
                    <div></div>
                    <div className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4">
                        <button
                            className={
                                "bg-gold-mbk text-white active:bg-gold-mbk font-bold uppercase text-sm px-2 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                            }
                            type="submit"
                        >
                            บันทึกข้อมูล
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ButtonUCSaveModal