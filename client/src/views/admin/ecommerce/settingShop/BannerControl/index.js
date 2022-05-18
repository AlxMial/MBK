import React from 'react'

const BannerControl = ({ formik, typePermission, setIsModified, name, onClick }) => {

    return (
        <div className="relative w-full">
            <span
                onClick={() => onClick(name)}
                className="z-3 h-full leading-snug font-normal text-blueGray-600 absolute bg-transparent text-sm py-2 cursor-pointer right-2"
            >
                <i className={"fas fa-ellipsis-h"} ></i>
            </span>
            <input
                type="text"
                className="border-0 px-2 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                id={name}
                name={name}
                onChange={(e) => {
                    formik.handleChange(e);
                    setIsModified(true);
                }}
                onBlur={formik.handleBlur}
                value={formik.values[name]}
                // autoComplete="firstName"
                disabled={typePermission !== "1"}
            />
        </div>
    )
}

export default BannerControl