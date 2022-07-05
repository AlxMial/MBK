import React from 'react'
import useWindowDimensions from "services/useWindowDimensions";

const ModuleButton = ({ onClick, label, icon, typePermission }) => {
    const { width } = useWindowDimensions();
    return (
        <button
            type="button"
            className={
                "flex items-center py-4 px-2 w-full text-sm font-normal bg-transparent outline-none button-focus" +
                (width < 765 ? " text-blueGray-700" : " text-white") + ((typePermission === "2" && label === "CRM") ? " hidden" : " ")
            }
            onClick={onClick}
        >
            <i className={icon + " text-sm"}></i>
            <span className="text-sm px-4 pt-1 font-bold block">{label}</span>
            <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                ></path>
            </svg>
        </button>
    )
}

export default ModuleButton