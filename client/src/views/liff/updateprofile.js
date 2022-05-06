import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "services/axios";

import * as Address from "../../../src/services/GetAddress.js";
import * as Session from "../../services/Session.service";
import { Radio } from "antd";
import DatePicker from 'react-mobile-datepicker';
import moment from "moment";
import { useToasts } from "react-toast-notifications";
import { path } from "../../layouts/Liff";
import { InputUC, SelectUC, validationSchema, DatePickerContainer, monthMap } from "./profile";


const Updateprofile = () => {
  let history = useHistory();
  const { addToast } = useToasts();
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
  const [Data, settbMember] = useState({});

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target;

    settbMember((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const getMembers = async () => {
    axios.post("/members/checkRegister", { uid: Session.getLiff().uid }).then((res) => {
      console.log(res)
      if (res.data.code === 200) {
        settbMember(res.data.tbMember)
      } else {

      }
    })
  };
  useEffect(() => {
    address();
    getMembers()
  }, []);

  const validation = async () => {
    console.log(Data);

    const isFormValid = await validationSchema.isValid(Data, {
      abortEarly: false
    })

    console.log(validationSchema)
    if (isFormValid) {
      DoSave()
    } else {
      validationSchema.validate(Data, {
        abortEarly: false
      }).catch((err) => {
        const errors = err.inner.reduce((acc, error) => {
          return {
            ...acc,
            [error.path]: true
          }
        }, {})
        console.log(errors)
        setErrors(errors);
      })
    }

    console.log(validationSchema.fields["firstName"].tests[0].OPTIONS.message)
  };
  const DoSave = () => {
    axios.put("members", Data).then((res) => {
      let msg = { msg: "", appearance: "warning" }

      res.data.status ?
        msg = { msg: "บันทึกข้อมูลสำเร็จ", appearance: "success" }
        :
        !res.data.isPhone ?
          msg.msg = "บันทึกข้อมูลไม่สำเร็จ เนื่องจากเบอร์โทรศัพท์เคยมีการลงทะเบียนไว้เรียบร้อยแล้ว"
          : !res.data.isMemberCard ?
            msg.msg = "บันทึกข้อมูลไม่สำเร็จ รหัส Member Card ซ้ำกับระบบที่เคยลงทะเบียนไว้เรียบร้อยแล้ว"
            : msg.msg = "บันทึกข้อมูลไม่สำเร็จ"


      addToast(msg.msg, { appearance: msg.appearance, autoDismiss: true });
      // res.data.status ?
      //   history.push(path.member) : console.log("warning")
    });
  };
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
              error={errors.firstName}
            />
            <InputUC
              name="lastName"
              lbl="นามสกุล"
              length={255}
              type="text"
              onChange={handleChange}
              value={Data.lastName}
              error={errors.lastName}
            />
            <InputUC
              name="phone"
              lbl="เบอร์โทร"
              type="tel"
              onChange={handleChange}
              value={Data.phone}
              error={errors.phone}
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
              error={errors.sex}
            />
            {/* วันเกิด */}

            <div className="mb-5">
              <div className="flex text-green-mbk font-bold text-lg ">{"วันเกิด"}</div>
              <DatePickerContainer>
                <DatePicker
                  isOpen={true}
                  isPopup={false}
                  showHeader={false}
                  // showCaption={true}
                  min={new Date(1970, 0, 1)}
                  max={new Date(2050, 0, 1)}
                  value={moment(new Date(Data.birthDate)).toDate()}
                  dateConfig={{
                    year: {
                      format: "YYYY",
                      caption: "Year",
                      step: 1
                    },
                    month: {
                      format: value => monthMap[value.getMonth() + 1],
                      caption: "Mon",
                      step: 1
                    },
                    date: {
                      format: "D",
                      caption: "Day",
                      step: 1
                    },

                  }}
                  onChange={(e) => {

                    // console.log(moment(new Date()).toDate())
                    settbMember((prevState) => ({
                      ...prevState,
                      ["birthDate"]: moment(new Date(e)).toDate(),
                    }));
                  }}
                />
              </DatePickerContainer>
            </div>

            <InputUC
              name="email"
              lbl="อีเมล"
              type="text"
              onChange={handleChange}
              value={Data.email}
              error={errors.email}
            />
            <div className="mb-5">
              <Radio.Group
                options={[
                  { label: "ค้าปลีก/Retail", value: "1" },
                  { label: "ค้าส่ง/Wholesale", value: "2" },
                ]}
                onChange={(e) => {
                  settbMember((prevState) => ({
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
              error={errors.address}
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

                settbMember((prevState) => ({
                  ...prevState,
                  ["province"]: e.value,
                  ["district"]: district[0].value,
                  ["subDistrict"]: subDistrict[0].value,
                  ["postcode"]: postcode,
                }));
              }}
              value={Data.provice}
              options={dataProvice}
              error={errors.province}
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
                settbMember((prevState) => ({
                  ...prevState,
                  ["district"]: e.value,
                  ["subDistrict"]: subDistrict[0].value,
                  ["postcode"]: postcode,
                }));
              }}
              value={Data.district}
              options={dataDistrict}
              error={errors.district}
            />
            <SelectUC
              name="subDistrict"
              lbl="ตำบล"
              onChange={async (e) => {
                const postcode = await Address.getAddress("postcode", e.value);
                settbMember((prevState) => ({
                  ...prevState,
                  ["subDistrict"]: e.value,
                  ["postcode"]: postcode,
                }));
              }}
              value={Data.subDistrict}
              options={dataSubDistrict}
              error={errors.subDistrict}
            />
            <InputUC
              name="postcode"
              lbl="รหัสไปรษณีย์"
              type="tel"
              onChange={handleChange}
              value={Data.postcode}
              error={errors.postcode}
            />

            <div className="relative  px-4  flex-grow flex-1 flex mt-5">
              <button
                className=" w-6\/12 bg-green-mbk text-white font-bold uppercase px-3 py-2 text-sm rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                style={{ width: "50%" }}
                onClick={() => {
                  history.push(path.member)
                }}
              >
                {"ยกเลิก"}
              </button>
              <button
                className=" w-6\/12 bg-gold-mbk text-white font-bold uppercase px-3 py-2 text-sm rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                style={{ width: "50%" }}
                onClick={validation}
              >
                {"บันทึก"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Updateprofile;
