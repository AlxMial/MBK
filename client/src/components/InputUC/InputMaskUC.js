import React from "react";
import InputMask from "react-input-mask";

const InputMaskUC = ({
  name,
  onChange,
  onBlur,
  disabled,
  value,
  min,
  lbl,
  type = "text",
  moreClassName = "",
  classValue="",
  ...res
}) => {
  const className =  
    "border-0 px-2 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white input-mark " +
    " rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 " + (classValue) +
    (type === "number" || min === "0" ? "text-right" : "");
  return (
    <InputMask
      className={className}
      disabled={disabled ? true : false}
      value={value}
      name={name}
      type={type}
      style={{}}
      onChange={onChange}
      placeholder={name == "phone" ? "0X-XXXX-XXXX" : ""}
      mask={name == "phone" ? "099-999-9999" : "99999"}
      maskChar=" "
      autoComplete="InputMark"
      {...res}
    />
  );
};

export default InputMaskUC;
