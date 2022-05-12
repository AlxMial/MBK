import React, { useState, useEffect } from "react";
import InputMask from "react-input-mask";
import Select from "react-select";
import * as Yup from "yup";
import styled from "styled-components";
const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const EmailRegExp = /^[A-Za-z0-9_.@]+$/;
export const validationSchema = Yup.object({
    firstName: Yup.string().required("* กรุณากรอก ชื่อ"),
    lastName: Yup.string().required("* กรุณากรอก นามสกุล"),
    phone: Yup.string().matches(phoneRegExp, "* รูปแบบเบอร์โทรศัพท์ ไม่ถูกต้อง")
        .required("* กรุณากรอก เบอร์โทรศัพท์"),
    email: Yup.string()
        .matches(EmailRegExp, "* ขออภัย อนุญาตให้ใช้เฉพาะตัวอักษร (a-z), ตัวเลข (0-9) และเครื่องหมายมหัพภาค (.) เท่านั้น")
        .email("* กรุณากรอก อีเมล"),
})
export const DatePickerContainer = styled.div`
  .datepicker {
    position: initial;
  }

  .datepicker-navbar {
    display: none;
  }
`;
export const monthMap = {
    "1": "Jan",
    "2": "Feb",
    "3": "Mar",
    "4": "Apr",
    "5": "May",
    "6": "Jun",
    "7": "Jul",
    "8": "Aug",
    "9": "Sep",
    "10": "Oct",
    "11": "Nov",
    "12": "Dec"
};
export const InputUC = ({ name, lbl, length, type, onChange, value, error }) => {
    return (
        <>
            <div className="mb-5">
                <div className="flex text-green-mbk font-bold text-lg ">{lbl}</div>
                {type == "text" ? (
                    <input
                        type={type}
                        className="border-0 px-2 py-2 placeholder-blueGray-300 text-gray-mbk bg-white text-base  focus:outline-none w-full ease-linear transition-all duration-150"
                        style={{ borderBottom: "1px solid #d6d6d6" }}
                        id={name}
                        name={name}
                        placeholder={lbl}
                        maxLength={length}
                        onChange={onChange}
                        value={value}
                    />
                ) : (
                    <InputMask
                        className={
                            "border-0 px-2 py-2 placeholder-blueGray-300 text-gray-mbk bg-white  text-base  focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        }
                        style={{ borderBottom: "1px solid #d6d6d6" }}
                        value={value}
                        name={name}
                        type={type}
                        onChange={onChange}
                        placeholder={name == "phone" ? "0X-XXXX-XXXX" : lbl}
                        mask={name == "phone" ? "099-999-9999" : "99999"}
                        maskChar=" "
                        // disabled={name == "phone" ? true : false}
                    />
                )}
                {error == true ?
                    <div className="text-sm py-2 px-2 text-red-500">{validationSchema.fields[name].tests[0].OPTIONS.message}</div>
                    : null
                }</div>
        </>
    );
};
export const SelectUC = ({ name, lbl, onChange, options, value }) => {
    return (
        <>
            <div className="mb-5">
                <div className="flex text-green-mbk font-bold text-lg ">{lbl}</div>
                <Select
                    className="select-line border-0  py-1  text-gray-mbk bg-white text-base  focus:outline-none w-full ease-linear transition-all duration-150"
                    style={{ borderBottom: "1px solid #d6d6d6" }}
                    id={name}
                    name={name}
                    placeholder={lbl}
                    onChange={onChange}
                    value={options.filter((e) => e.value === value)}
                    options={options}
                />
            </div>
        </>
    );
};