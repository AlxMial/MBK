import React from "react";
import Select from "react-select";
import { styleSelect } from "assets/styles/theme/ReactSelect.js";

const SelectUC = ({ name, options, value, onChange, isDisabled, bgColor, placeholder }) => {
  const useStyle = styleSelect(bgColor);
  const className = "border-0 placeholder-blueGray-300 text-blueGray-600 bg-white rounded "
    + "text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150";
  return (
    <Select
      id={name}
      name={name}
      onChange={onChange}
      className={className}
      menuPortalTarget={document.body}
      menuPosition="fixed"
      placeholder={placeholder}
      options={options}
      value={value}
      isDisabled={(isDisabled) ? isDisabled : false}
      menuPlacement="auto"
      styles={useStyle}
    />
  );
};

export default SelectUC;
