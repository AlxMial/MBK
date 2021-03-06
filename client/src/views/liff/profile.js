import React from "react";
import InputMask from "react-input-mask";
import Select from "react-select";
import * as Yup from "yup";
import styled from "styled-components";
import { styleSelectLine } from "assets/styles/theme/ReactSelect";
import "antd/dist/antd.css";
import { Radio } from "antd";

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const EmailRegExp = /^[A-Za-z0-9_.@]+$/;
const useStyle = styleSelectLine();

export const validationSchema = Yup.object({
  firstName: Yup.string().required("* โปรดระบุชื่อ"),
  lastName: Yup.string().required("* โปรดระบุนามสกุล"),
  phone: Yup.string()
    .matches(phoneRegExp, "* รูปแบบเบอร์โทรศัพท์ ไม่ถูกต้อง")
    .required("* โปรดระบุเบอร์โทร"),
  email: Yup.string()
    .matches(
      EmailRegExp,
      "* ขออภัย อนุญาตให้ใช้เฉพาะตัวอักษร (a-z), ตัวเลข (0-9) และเครื่องหมายมหัพภาค (.) เท่านั้น"
    )
    .email("* รูปแบบอีเมลไม่ถูกต้อง")
    .required("* กรุณากรอก Email"),
  address: Yup.string().required("* โปรดระบุที่อยู่"),
  postcode: Yup.string().required("* โปรดระบุรหัสไปรษณีย์"),
  eating: Yup.string().required("* โปรดระบุ"),
});

export const validateShopUpdate = Yup.object({
  firstName: Yup.string().required("* โปรดระบุชื่อ"),
  lastName: Yup.string().required("* โปรดระบุนามสกุล"),
  phone: Yup.string()
    .matches(phoneRegExp, "* รูปแบบเบอร์โทรศัพท์ ไม่ถูกต้อง")
    .required("* โปรดระบุเบอร์โทร"),
    email: Yup.string()
    .matches(
      EmailRegExp,
      "* ขออภัย อนุญาตให้ใช้เฉพาะตัวอักษร (a-z), ตัวเลข (0-9) และเครื่องหมายมหัพภาค (.) เท่านั้น"
    )
    .email("* รูปแบบอีเมลไม่ถูกต้อง")
    .required("* กรุณากรอก Email"),
  address: Yup.string().required("* โปรดระบุที่อยู่"),
  postcode: Yup.string().required("* โปรดระบุรหัสไปรษณีย์"),
});

export const validateShopAddress = Yup.object({
  firstName: Yup.string().required("* โปรดระบุชื่อ"),
  lastName: Yup.string().required("* โปรดระบุนามสกุล"),
  phone: Yup.string()
    .matches(phoneRegExp, "* รูปแบบเบอร์โทรศัพท์ ไม่ถูกต้อง")
    .required("* โปรดระบุเบอร์โทร"),
  address: Yup.string().required("* โปรดระบุที่อยู่"),
  postcode: Yup.string().required("* โปรดระบุรหัสไปรษณีย์"),
});
export const DatePickerContainer = styled.div`
  .datepicker {
    position: initial;
  }

  .datepicker-navbar {
    display: none;
  }
`;
export const monthMap = {
  1: "มกราคม",
  2: "กุมภาพันธ์",
  3: "มีนาคม",
  4: "เมษายน",
  5: "พฤษภาคม",
  6: "มิถุนายน",
  7: "กรกฎาคม",
  8: "สิงหาคม",
  9: "กันยายน",
  10: "ตุลาคม",
  11: "พฤศจิกายน",
  12: "ธันวาคม",
};
export const InputUC = ({
  name,
  lbl,
  length,
  type,
  onChange,
  value,
  error,
  valid,
  refs,
  disabled,
}) => {
  return (
    <>
      <div className="mb-4">
        <div
          className={
            "noselect flex text-green-mbk font-bold text-sm " +
            (type === "description" ? " hidden" : " ")
          }
        >
          {lbl}{" "}
          {valid === true ? (
            <span className="ml-1" style={{ color: "red" }}>
              {" *"}
            </span>
          ) : null}
        </div>
        {type === "text" || type === "description" ? (
          <input
            disabled={disabled ? true : false}
            type={type === "description" ? "text" : type}
            className="border-0 px-2 pt-2 placeholder-blueGray-300 text-gray-mbk bg-white text-sm w-full "
            style={{ borderBottom: "1px solid #d6d6d6" }}
            id={name}
            name={name}
            placeholder={lbl}
            maxLength={length}
            onChange={onChange}
            value={value}
            autoComplete="dsfasdf"
            ref={refs}
          />
        ) : (
          <InputMask
            className={
              "border-0 px-2 pt-2 placeholder-blueGray-300 text-gray-mbk bg-white text-sm w-full unsetInputMark "
            }
            disabled={disabled ? true : false}
            style={{ borderBottom: "1px solid #d6d6d6" }}
            value={value}
            name={name}
            type={type}
            onChange={onChange}
            placeholder={name == "phone" ? "0X-XXXX-XXXX" : lbl}
            mask={name == "phone" ? "099-999-9999" : "99999"}
            maskChar=" "
            autoComplete="InputMark"
            ref={refs}
          />
        )}
        {error == true ? (
          <div className="text-xs py-2 px-2 text-red-500">
            {validationSchema.fields[name].tests[0].OPTIONS.message}
          </div>
        ) : null}
      </div>
    </>
  );
};
export const RadioUC = ({
  name,
  lbl,
  error,
  valid,
  options,
  onChange,
  Active,
}) => {
  return (
    <>
      <div className="mb-2">
        <div className="noselect flex text-green-mbk font-bold text-sm ">
          {lbl}{" "}
          {valid === true ? (
            <span className="ml-1" style={{ color: "red" }}>
              {" *"}
            </span>
          ) : null}
        </div>
        {
          <Radio.Group
            options={options}
            onChange={onChange}
            value={Active.toString()}
          />
        }
        {error == true ? (
          <div className="text-xs py-2 px-2 text-red-500">
            {validationSchema.fields[name].tests[0].OPTIONS.message}
          </div>
        ) : null}
      </div>
    </>
  );
};
export const SelectUC = ({ name, lbl, onChange, options, value, valid }) => {
  return (
    <>
      <div className="mb-4">
        <div className="noselect flex text-green-mbk font-bold text-sm ">
          {lbl}
          {valid == true ? (
            <span className="ml-1" style={{ color: "red" }}>
              {" *"}
            </span>
          ) : null}
        </div>

        <Select
          className="text-gray-mbk mt-1 text-sm w-full border-none"
          isSearchable={false}
          id={name}
          name={name}
          placeholder={lbl}
          onChange={onChange}
          value={options.filter((e) => e.value === value)}
          options={options}
          styles={useStyle}
        />
      </div>
    </>
  );
};
