import React from 'react'

const InputUC = ({ name, onChange, onBlur, disabled, value, type = 'text', ...res }) => {
    return (
        <input
            type={type}
            className="border-0 px-2 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
            id={name}
            name={name}
            onBlur={onBlur}
            value={value}
            autoComplete={name}
            disabled={disabled}
            onChange={onChange}
            {...res}
        />
    )
}

export default InputUC