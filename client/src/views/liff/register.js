import React, { useState, useEffect } from "react";
import InputMask from "react-input-mask";
import Select from "react-select";
import * as Address from "../../../src/services/GetAddress.js";
import * as Session from "../../services/Session.service";
import { Radio } from "antd";
import { DropdownDate } from "react-dropdown-date";
import moment from "moment";
// components

const Register = () => {
  const [dataProvice, setDataProvice] = useState([]);
  const [dataDistrict, setDataDistrict] = useState([]);
  const [dataSubDistrict, setSubDistrict] = useState([]);
  const address = async () => {
    const province = await Address.getProvince();
    const district = await Address.getAddress("district", "1");
    const subDistrict = await Address.getAddress("subDistrict", "1001");
    setDataProvice(province);
    setDataDistrict(district);
    setSubDistrict(subDistrict);
  };
  // address();
  const [Data, setData] = useState({
    id: "",
    memberCard: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    birthDate: "",
    registerDate: "",
    address: "",
    subDistrict: "",
    district: "",
    province: "",
    country: "",
    postcode: "",
    isDeleted: false,
    sex: "1",
    isMemberType: "1",
    uid: Session.getLiff().uid,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // // let value = !Data[name];
    // console.log(value);
    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  useEffect(() => {
    address();
  }, []);

  const validation = () => {
    console.log(Data);
  };
  const DoSave = () => {};
  return (
    <>
      <div className="bg-green-mbk" style={{ height: "calc(100vh - 100px)" }}>
        <div
          style={{
            width: "90%",
            padding: "10px",
            margin: "auto",
          }}
        >
          <div
            style={{
              width: "100%",
              backgroundColor: "#FFF",
              height: "calc(100vh - 200px)",
              borderRadius: "10px",
              padding: "20px",
              overflow: "scroll",
            }}
          >
            <InputUC
              name="firstName"
              lbl="ชื่อ"
              length={255}
              type="text"
              onChange={handleChange}
              value={Data.firstName}
            />
            <InputUC
              name="lastName"
              lbl="นามสกุล"
              length={255}
              type="text"
              onChange={handleChange}
              value={Data.lastName}
            />
            <InputUC
              name="phone"
              lbl="เบอร์โทร"
              type="tel"
              onChange={handleChange}
              value={Data.phone}
            />
            <SelectUC
              name="sex"
              lbl="เพศ"
              onChange={(e) => {
                handleChange({ target: { name: "sex", value: e.value } });
              }}
              value={Data.sex}
              options={[
                { value: "1", label: "ชาย" },
                { value: "2", label: "หณิง" },
              ]}
            />
            {/* วันเกิด */}

            <div>
              <DropdownDate
                startDate={
                  // optional, if not provided 1900-01-01 is startDate
                  "1990-01-01" // 'yyyy-mm-dd' format only
                }
                endDate={
                  // optional, if not provided current date is endDate
                  "2050-12-31" // 'yyyy-mm-dd' format only
                }
                selectedDate={moment(new Date()).format("YYYY-MM-DD")}
                onDateChange={(date) => {
                  // optional
                  // console.log(moment(new Date()).format("YYYY-MM-DD"));
                  // this.setState({ date: date, selectedDate: formatDate(date) });
                }}
              />
            </div>
            <InputUC
              name="email"
              lbl="อีเมล"
              type="text"
              onChange={handleChange}
              value={Data.email}
            />
            <div className="mb-5">
              <Radio.Group
                options={[
                  { label: "ค้าปลีก/Retail", value: "1" },
                  { label: "ค้าส่ง/Wholesale", value: "2" },
                ]}
                onChange={(e) => {
                  setData((prevState) => ({
                    ...prevState,
                    ["isMemberType"]: e.target.value,
                  }));
                }}
                value={Data.isMemberType}
              />
            </div>

            <InputUC
              name="address"
              lbl="ที่อยู่"
              type="text"
              onChange={handleChange}
              value={Data.address}
            />
            <SelectUC
              name="province"
              lbl="จังหวัด"
              onChange={async (e) => {
                const district = await Address.getAddress("district", e.value);
                const subDistrict = await Address.getAddress(
                  "subDistrict",
                  district[0].value
                );
                const postcode = await Address.getAddress(
                  "postcode",
                  subDistrict[0].value
                );
                setDataDistrict(district);
                setSubDistrict(subDistrict);

                setData((prevState) => ({
                  ...prevState,
                  ["province"]: e.value,
                  ["district"]: district[0].value,
                  ["subDistrict"]: subDistrict[0].value,
                  ["postcode"]: postcode,
                }));
              }}
              value={Data.provice}
              options={dataProvice}
            />
            <SelectUC
              name="district"
              lbl="อำเภอ"
              onChange={async (e) => {
                // handleChange({ target: { name: "district", value: e.value } });
                const subDistrict = await Address.getAddress(
                  "subDistrict",
                  e.value
                );
                const postcode = await Address.getAddress(
                  "postcode",
                  subDistrict[0].value
                );
                setSubDistrict(subDistrict);
                setData((prevState) => ({
                  ...prevState,
                  ["district"]: e.value,
                  ["subDistrict"]: subDistrict[0].value,
                  ["postcode"]: postcode,
                }));
              }}
              value={Data.district}
              options={dataDistrict}
            />
            <SelectUC
              name="subDistrict"
              lbl="ตำบล"
              onChange={async (e) => {
                // handleChange({
                //   target: { name: "subDistrict", value: e.value },
                // });
                const postcode = await Address.getAddress("postcode", e.value);
                setData((prevState) => ({
                  ...prevState,
                  ["subDistrict"]: e.value,
                  ["postcode"]: postcode,
                }));
              }}
              value={Data.subDistrict}
              options={dataSubDistrict}
            />
            <InputUC
              name="postcode"
              lbl="รหัสไปรษณีย์"
              type="tel"
              onChange={handleChange}
              value={Data.postcode}
            />

            <div className="relative  px-4  flex-grow flex-1 flex mt-5">
              <button
                className=" w-6\/12 bg-green-mbk text-white font-bold uppercase px-3 py-2 text-sm rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                style={{ width: "50%" }}
                // onClick={windowclose}
              >
                {"Cancel"}
              </button>
              <button
                className=" w-6\/12 bg-gold-mbk text-white font-bold uppercase px-3 py-2 text-sm rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                style={{ width: "50%" }}
                onClick={validation}
              >
                {"Register"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const formatDate = (date) => {
  // formats a JS date to 'yyyy-mm-dd'
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};

const InputUC = ({ name, lbl, length, type, onChange, value }) => {
  return (
    <>
      <div className="mb-5">
        <div className="flex text-green-mbk font-bold text-lg ">{lbl}</div>
        {type == "text" ? (
          <input
            type={type}
            className="border-0 px-2 py-1 placeholder-blueGray-300 text-gray-mbk bg-white text-base  focus:outline-none w-full ease-linear transition-all duration-150"
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
              "border-0 px-2 py-1 placeholder-blueGray-300 text-gray-mbk bg-white  text-base  focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
            }
            style={{ borderBottom: "1px solid #d6d6d6" }}
            value={value}
            name={name}
            type={type}
            onChange={onChange}
            placeholder={name == "phone" ? "0X-XXXX-XXXX" : lbl}
            mask={name == "phone" ? "099-999-9999" : "99999"}
            maskChar=" "
          />
        )}
      </div>
    </>
  );
};
const SelectUC = ({ name, lbl, onChange, options, value }) => {
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
export default Register;
