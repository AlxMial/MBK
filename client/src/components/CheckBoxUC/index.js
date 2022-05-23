import React from "react";

const CheckBoxUC = ({
  name,
  onChange,
  onBlur,
  checked,
  text,
  classCheckBox,
  classLabel,
  classSpan,
}) => {
  return (
    <label className={"inline-flex items-center cursor-pointer  float-left " + classLabel}>
      <input
        id={name}
        type="checkbox"
        name={name}
        className={
          "form-checkbox border-2 rounded text-gold-mbk ml-1 w-5 h-5 ease-linear transition-all duration-150 " + classCheckBox
        }
        onChange={onChange}
        onBlur={onBlur}
        checked={checked}
      />
      <span className={"ml-2 text-sm font-semibold text-blueGray-600 text-left " + classSpan}>
        {text}
      </span>
    </label>
  );
};

export default CheckBoxUC;
