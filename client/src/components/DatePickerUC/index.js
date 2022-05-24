import React from "react";
import moment from "moment";
import locale from "antd/lib/locale/th_TH";
import { DatePicker, ConfigProvider } from "antd";
import "antd/dist/antd.css";

const DatePickerUC = ({  value, onChange,onClick,onBlur,disabled,placeholder,disabledValue }) => {
  return (
    <ConfigProvider locale={locale}>
      <DatePicker
        format={"DD/MM/yyyy"}
        placeholder={placeholder}
        showToday={false}
        disabled={disabled}
        defaultValue={moment(new Date(), "DD/MM/YYYY")}
        onBlur={onBlur}
        onClick={onClick}
        style={{
          height: "100%",
          width: "100%",
          borderRadius: "0.25rem",
          cursor: "pointer",
          margin: "0px",
          paddingTop: "0.5rem",
          paddingBottom: "0.5rem",
          paddingLeft: "0.5rem",
          paddingRight: "0.5rem",
        }}
        value={(disabledValue) ? null : value}
        onChange={onChange}
      />
    </ConfigProvider>
  );
};

export default DatePickerUC;
