import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Select from "react-select";
import api_province from "../../../assets/data/api_province.json";
import api_amphure from "../../../assets/data/api_amphure.json";
import api_tombon from "../../../assets/data/api_tombon.json";
import { path } from "services/liff.services";
import { getMemberAddress } from "@services/liff.services";
const AddressModel = ({ isAddress, onChange, setisAddress }) => {
  const history = useHistory();
  const [optionaddress, setoptionaddress] = useState([]);
  const getMemberaddress = async () => {
    getMemberAddress((res) => {
      if (res.data.code === 200) {
        let option = res.data.option;
        option.map((e, i) => {
          if (e.isDefault) {
            setisAddress(e.id);
          }
        });
        getAddress(option);
      }
    });
  };
  const getAddress = async (option) => {
    for (var i = 0; i < option.length; i++) {
      let province = await api_province;
      province = province.find(
        (e) => e.value.toString() === option[i].province
      );

      let district = await api_amphure;
      district = district.find(
        (e) => e.value.toString() === option[i].district
      );

      let subDistrict = await api_tombon;
      subDistrict = subDistrict.find(
        (e) => e.value.toString() === option[i].subDistrict
      );

      option[
        i
      ].address = `${option[i].address} ต.${subDistrict.label} อ.${district.label} จ.${province.label} ${option[i].postcode} ${option[i].email}`;
      option[i].name = `คุณ${option[i].firstName} ${option[i].lastName}`;
      option[i].value = option[i].id;
    }
    setoptionaddress(option);
  };
  useEffect(() => {
    getMemberaddress();
  }, []);
  return (
    <div
      className="w-full  relative mt-2"
      style={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="w-full mb-2 text-sm">
        <div style={{ width: "90%", margin: "auto" }}>
          <div className="w-full font-bold">ที่อยู่จัดส่ง</div>
        </div>
      </div>
      <div
        className="px-5 py-5"
        style={{
          width: "90%",
          margin: "auto",
          border: "1px solid var(--mq-txt-color, rgb(170, 170, 170))",
          borderRadius: "10px",
        }}
      >
        <div className="mb-2">
          {optionaddress.length > 0 ? (
            <Select
              className="text-gray-mbk mt-1 text-sm w-full border-none select-address "
              isSearchable={false}
              id={"category"}
              name={"category"}
              value={optionaddress.filter((o) => o.value === isAddress)}
              options={optionaddress}
              formatOptionLabel={({ address, name }) => (
                <div className="text-sm">
                  <div className="font-bold">{name}</div>
                  <div
                    className="w-full text-liff-gray-mbk"
                    style={{
                      whiteSpace: "break-spaces",
                    }}
                  >
                    {address}
                  </div>
                </div>
              )}
              onChange={onChange}
            />
          ) : (
            <div
              className="animated-img"
              style={{
                height: "100px",
                borderRadius: "20px",
              }}
            ></div>
          )}
        </div>
        <div
          className="flex"
          onClick={() => {
            history.push(path.addAddress);
          }}
        >
          <i
            className="fas fa-plus-circle flex text-sm "
            style={{ alignItems: "center" }}
          ></i>
          <div className="px-2">เพิ่มที่อยู่</div>
        </div>
      </div>
    </div>
  );
};

export default AddressModel;
