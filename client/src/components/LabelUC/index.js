import React from 'react'

const LabelUC = ({ label, isRequired = false }) => {
    return (
        <div className="relative w-full">
            <label className=" text-blueGray-600 text-sm font-bold ">
                {label}
            </label>
            {isRequired && <span className="text-sm ml-2 text-red-500">*</span>}
        </div>
    )
}

export default LabelUC
