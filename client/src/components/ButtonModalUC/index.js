import React from 'react'
import useWindowDimensions from "services/useWindowDimensions";

const ButtonModalUC = ({ onClick, label }) => {
    const { width } = useWindowDimensions();
    const _btnClass = "bg-lemon-mbk text-white active:bg-lemon-mbk font-bold  text-xs px-2 "
        + "py-2 rounded shadow hover:shadow-md outline-none focus:outline-none  ease-linear "
        + "transition-all duration-150 " + (width < 768 ? " w-full mt-2" : "ml-2");

    return (
        <>
            <button
                className={_btnClass}
                type="button"
                onClick={onClick}
            >
                <span className=" text-sm px-2">{label}</span>
            </button>
        </>
    )
}

export default ButtonModalUC