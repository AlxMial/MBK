import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import axios from "services/axios";
import { useToasts } from "react-toast-notifications";
/* Service */
import useWindowDimensions from "services/useWindowDimensions";
import ValidateService from "services/validateValue";
import  { styleSelect } from "assets/styles/theme/ReactSelect.js";
import * as Storage from "../../../../services/Storage.service";
import "antd/dist/antd.css";
import moment from "moment";
import "moment/locale/th";
import locale from "antd/lib/locale/th_TH";
import { DatePicker, Space, ConfigProvider } from "antd";
import * as Address from "../../../../services/GetAddress";
import FilesService from "../../../../services/files";
import CreatableSelect from "react-select/creatable";
import { ActionMeta, OnChangeValue } from "react-select";

export default function StockInfo() {
  /* Option Select */
  const options = [
    { value: "1", label: "ผู้ดูแลระบบ" },
    { value: "2", label: "บัญชี" },
    { value: "3", label: "การตลาด" },
  ];

  const useStyle = styleSelect();
  /* Service Function */
  const { height, width } = useWindowDimensions();
  let { id } = useParams();

  /* Set useState */
  const [postImage, setPostImage] = useState("");
  const [isLoadingSelect, setIsLoadingSelect] = useState(false);


  let history = useHistory();
  const { addToast } = useToasts();
  /* Method Condition */
  const OnBack = () => {
    history.push("/admin/members");
  };

  const createOption = (label) => ({
    label,
    value: label.toLowerCase().replace(/\W/g, ""),
  });

  const handleChange = (
    newValue,
    actionMeta
  ) => {
    console.group('Value Changed');
    console.log(newValue);
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();


    this.setState({ value: newValue });
  };

  const handleCreate = (inputValue) => {
    // this.setState({ isLoading: true });
    setIsLoadingSelect(true);
    console.group("Option created");
    console.log("Wait a moment...");
    setTimeout(() => {
      const { options } = this.state;
      const newOption = createOption(inputValue);
      console.groupEnd();
      this.setState({
        isLoading: false,
        options: [...options, newOption],
        value: newOption,
      });
    }, 1000);
  };

  const inputArr = [
    {
      id: 0,
      postImage: ""
    },
    {
      id: 1,
      postImage: "",
    },
    {
      id: 2,
      postImage: "",
    },
    {
      id: 3,
      postImage: "",
    },
    {
      id: 4,
      postImage: "",
    },
  ];

  const [arr, setArr] = useState(inputArr);

  const addInput = () => {
    setArr((s) => {
      return [
        ...s,
        {
          postImage: "",
          id: "",
        },
      ];
    });
  };

  const handleRemove = (index) => {
    const rows = [...arr];
    rows.splice(index, 1);
    setArr(rows);
  };

  const handleChangeImage = async  (e) => {
    e.preventDefault();

    const index = e.target.id.split(',');
    const base64 =  await FilesService.convertToBase64(e.target.files[0]);
    setArr( (s) => {
      const newArr = s.slice();
      newArr[index[1]].postImage =base64;
      console.log(newArr)
      return newArr;
    });
  };

  useEffect(() => {}, []);

  return (
    <>
      <div className="flex flex-warp">
        <span className="text-sm font-bold margin-auto-t-b">
          <i className="fas fa-user-circle"></i>&nbsp;
        </span>
        <span className="text-base margin-auto font-bold">
          ข้อมูลคลังสินค้า
        </span>
      </div>
      <div className="w-full">
        <form>
          <div className="w-full">
            <div className="flex justify-between py-2 mt-4">
              <span className="text-lg  text-green-mbk margin-auto font-bold">
                จัดการคลังสินค้า
              </span>
            </div>
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 border bg-white rounded-lg">
              <div className="flex-auto lg:px-10 py-10">
                <div className="flex flex-wrap">
                  <div className="w-full lg:w-2/12 px-4 mb-2">
                    <div className="relative w-full margin-a">
                      <label
                        className=" text-blueGray-600 text-sm font-bold "
                        htmlFor="grid-password"
                      >
                        รูปภาพสินค้า
                      </label>
                      <span className="text-sm ml-2 text-red-500">*</span>
                    </div>
                  </div>
                  <div className="w-full lg:w-8/12 px-4 mb-4">
                    <div className="relative flex">
                      {arr.map((item, i) => {
                        return (
                          <div className="image-upload mr-4" key={i}>
                            <label
                              htmlFor={"file-input," + i}
                              className="cursor-pointer"
                            >
                              <div className="img-stock-container">
                                <img
                                  alt="..."
                                  className={
                                    "img-stock  rounded align-middle border-none shadow-lg"
                                  }
                                  src={
                                    item.postImage
                                      ? item.postImage
                                      : require("assets/img/noimg.png").default
                                  }
                                />
                                <div className={"centered text-white font-bold rounded-b-l-r w-full bg-gray-mbk " + ((item.postImage) ? " " : " ")}>
                                  เลือกรูปภาพ
                                </div>
                              </div>
                            </label>
                            <input
                              id={"file-input," + i}
                              type="file"
                              accept="image/jpg, image/jpeg, image/png"
                              onChange={(e) => handleChangeImage(e)}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="w-full lg:w-2/12 px-4  mb-2">
                    <div className="relative w-full">
                      <label
                        className=" text-blueGray-600 text-sm font-bold"
                        htmlFor="grid-password"
                      >
                        หมวดหมู่สินค้า
                      </label>
                      <span className="text-sm ml-2 text-red-500">*</span>
                    </div>
                  </div>
                  <div className="w-full lg:w-8/12 px-4  mb-4">
                    <div className="relative w-full">
                      <CreatableSelect
                        isClearable
                        className="border-0 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        styles={useStyle}
                        isLoading={isLoadingSelect}
                        options={options}
                        onChange={handleChange}
                        placeholder="เลือกข้อมูล / เพิ่มข้อมูล"
                        onCreateOption={handleCreate}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
