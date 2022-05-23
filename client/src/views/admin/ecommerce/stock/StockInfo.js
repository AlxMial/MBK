import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
/* Service */
import useWindowDimensions from "services/useWindowDimensions";
// import { styleSelect } from "assets/styles/theme/ReactSelect.js";
import "antd/dist/antd.css";
import "moment/locale/th";
import CreatableSelect from "react-select/creatable";
import Modal from "react-modal";
import LabelUC from "components/LabelUC";
import {
  customStyles,
  customStylesMobile,
} from "assets/styles/theme/ReactModal";
import ProfilePictureUC from 'components/ProfilePictureUC';
import InputUC from "components/InputUC";

const StockInfo = ({ handleModal, formik, open, handleChangeImage, stockImage }) => {
  Modal.setAppElement("#root");
  /* Option Select */
  const options = [
    { value: "1", label: "ผู้ดูแลระบบ" },
    { value: "2", label: "บัญชี" },
    { value: "3", label: "การตลาด" },
  ];

  const useStyle = customStyles();
  const useStyleMobile = customStylesMobile();
  /* Service Function */
  const { width } = useWindowDimensions();
  let { id } = useParams();

  /* Set useState */
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

  // const handleRemove = (index) => {
  //   const rows = [...arr];
  //   rows.splice(index, 1);
  //   setArr(rows);
  // };

  // const handleChangeImage = async (e) => {
  //   e.preventDefault();

  //   // const index = e.target.id.split(',');
  //   const base64 = await FilesService.convertToBase64(e.target.files[0]);
  //   setArr((s) => {
  //     const newArr = s.slice();
  //     newArr[e.target.id.replace('file', '')].image = base64;
  //     console.log(newArr)
  //     return newArr;
  //   });
  // };

  return (
    <>
      <Modal
        isOpen={open}
        onRequestClose={handleModal}
        style={width <= 1180 ? useStyleMobile : useStyle}
        contentLabel="Example Modal"
        shouldCloseOnOverlayClick={false}
      >
        <div className="flex flex-wrap">
          <div className="w-full flex-auto mt-2">
            <form>
              <div className=" flex justify-between align-middle ">
                <div className=" align-middle  mb-3">
                  <div className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-base text-green-mbk font-bold whitespace-nowrap p-4">
                    <label>เพิ่มสินค้า</label>
                  </div>
                </div>

                <div className="  text-right align-middle  mb-3">
                  <div className=" border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm text-red-500 font-bold whitespace-nowrap p-4">
                    <label
                      className="cursor-pointer"
                      onClick={() => {
                        handleModal();
                      }}
                    >
                      X
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap px-24 py-10 justify-center">
                <div className="w-full lg:w-12/12 px-4 margin-auto-t-b ">
                  <div className="flex flex-wrap">
                    {/* รูปสินค้า */}
                    <div className="w-full lg:w-2/12 px-4 margin-auto-t-b ">
                      <LabelUC label="รูปสินค้า" isRequired={true} />
                    </div>
                    <div className="w-full lg:w-10/12 margin-auto-t-b">
                      <div className="relative w-full px-4 flex">
                        {stockImage.map((item, i) => {
                          return (
                            <ProfilePictureUC
                              className='pr-4'
                              key={i}
                              id={i}
                              hoverText='เลือกรูปสินค้า'
                              src={item.image}
                              onChange={handleChangeImage} />
                          )
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap mt-4">
                    <div className="w-full lg:w-2/12 px-4 margin-auto-t-b ">
                      <LabelUC label="ชื่อสินค้า" isRequired={true} />
                    </div>
                    <div className="w-full lg:w-6/12 margin-auto-t-b">
                      <div className="relative w-full px-4">
                        <InputUC
                          name='productName'
                          maxLength={100}
                          onBlur={formik.handleBlur}
                          value={formik.values.productName}
                          onChange={(e) => {
                            formik.handleChange(e);
                          }} />
                      </div>
                      <div className="relative w-full px-4">
                        {formik.touched.productName &&
                          formik.errors.productName ? (
                          <div className="text-sm py-2 px-2  text-red-500">
                            {formik.errors.productName}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  {/* หมวดหมู่สินค้า */}
                  <div className="flex flex-wrap  mt-4">
                    <div className="w-full lg:w-2/12 px-4 margin-auto-t-b ">
                      <LabelUC label="หมวดหมู่สินค้า" isRequired={true} />
                    </div>
                    <div className="w-full lg:w-6/12 margin-auto-t-b">
                      <div className="relative w-full px-4">
                        <CreatableSelect
                          isClearable
                          className="border-0 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          styles={useStyle}
                          isLoading={isLoadingSelect}
                          options={options}
                          onChange={handleChange}
                          placeholder="เลือกข้อมูล / เพิ่มข้อมูล"
                          onCreateOption={handleCreate}
                          value={formik.values.productCategory}
                        />
                      </div>
                      <div className="relative w-full px-4">
                        {formik.touched.productCategory &&
                          formik.errors.productCategory ? (
                          <div className="text-sm py-2 px-2  text-red-500">
                            {formik.errors.productCategory}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default StockInfo;