import React from 'react'

const TextAreaUC = ({ type = 'text', rows = '5', name, onChange, onBlur, value, disabled }) => {
    return (
        <textarea
            type={type}
            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
            rows={rows}
            id={name}
            name={name}
            onChange={onChange}
            onBlur={onBlur}
            value={value}
            autoComplete={name}
            disabled={disabled}
        />
    )
}

export default TextAreaUC