import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import {
  customStyles,
  customStylesMobile,
} from "assets/styles/theme/ReactModal";
import LabelUC from "components/LabelUC";
import useWindowDimensions from "services/useWindowDimensions";
import ValidateService from "services/validateValue";
import FilesService from "services/files";
import axios from "services/axios";
import SelectUC from "components/SelectUC";
import ProfilePictureUC from "components/ProfilePictureUC";
import InputUC from "components/InputUC";
import moment from "moment";
import DatePickerUC from "components/DatePickerUC";
import CheckBoxUC from "components/CheckBoxUC";
import TextAreaUC from "components/InputUC/TextAreaUC";

const GameInfo = ({
  open,
  handleModal,
  name,
  modalData,
  handleSubmitModal,
}) => {
  Modal.setAppElement("#root");
  const useStyle = customStyles();
  const useStyleMobile = customStylesMobile();
  const { width } = useWindowDimensions();
  const [isClick, setIsClick] = useState(false);

  const rewardType = [
    { value: "1", label: "E-Coupon" },
    { value: "2", label: "สินค้า" },
  ];

  useEffect(() => {}, []);

  const handleSeletectImage = async (e) => {
    const image = document.getElementById("eProductImage");
    image.src = URL.createObjectURL(e.target.files[0]);
    const base64 = await FilesService.convertToBase64(e.target.files[0]);
    modalData["pictureProduct"] = base64;
  };

  return (
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
                  <label>เพิ่มของสัมนาคุณ</label>
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
            <div className="flex flex-wrap px-24 py-4 justify-center">
              <div className="w-full lg:w-1/12 px-4 margin-auto-t-b ">
                <LabelUC label="ประเภท" isRequired={true} />
              </div>
              <div className="w-full lg:w-11/12 px-4 margin-auto-t-b ">
                <SelectUC
                  name="rewardType"
                  value={ValidateService.defaultValue(
                    rewardType,
                    modalData.rewardType
                  )}
                  onChange={(value) => {
                    modalData["rewardType"] = value.value;
                  }}
                  options={rewardType}
                />
              </div>
              <div className="w-full">&nbsp;</div>
              <div className="w-full lg:w-1/12 px-4 margin-auto-t-b">
                <LabelUC label="รูปสินค้า" />
              </div>
              <div className={"w-full lg:w-11/12 px-4 margin-auto-t-b"}>
                <div className="relative w-full">
                  <ProfilePictureUC
                    id="eProductImage"
                    hoverText="เลือกรูปภาพสินค้า"
                    onChange={handleSeletectImage}
                    src={modalData.pictureProduct}
                  />
                </div>
              </div>
              <div className="w-full">&nbsp;</div>
              <div className="w-full lg:w-1/12 px-4 margin-auto-t-b ">
                <LabelUC label="ชื่อสินค้า" isRequired={true} />
              </div>
              <div className="w-full lg:w-11/12 px-4 margin-auto-t-b ">
                <InputUC
                  name="productName"
                  maxLength={100}
                  onChange={(e) => {
                    modalData["productName"] = e.target.value;
                  }}
                />
              </div>

              <div className="w-full">&nbsp;</div>
              <div className="w-full lg:w-1/12 px-4 margin-auto-t-b ">
                <LabelUC label="จำนวนสูงสุด" isRequired={true} />
                <div className="text-sm py-2 px-2  text-red-500">&nbsp;</div>
              </div>
              <div className="w-full lg:w-5/12 px-4 margin-auto-t-b">
                <div className="relative flex">
                  <InputUC
                    name="rewardCount"
                    type="text"
                    maxLength={7}
                    onChange={(e) => {
                      modalData["rewardCount"] = e.target.value;
                    }}
                    min="0"
                    value={modalData.rewardCount}
                  />
                  <span
                    className="margin-auto-t-b font-bold"
                    style={{ marginLeft: width < 764 ? "1rem" : "2rem" }}
                  >
                    ชิ้น
                  </span>
                </div>
                <div className="relative">
                  <CheckBoxUC
                    text="ไม่มีวันหมดอายุ"
                    name="isNoLimitReward"
                    classLabel="mt-2"
                    onChange={(e) => { 
                      modalData = ({...modalData,})
                      modalData['isNoLimitReward'] = e.target.checked;
                    }}
                    checked={modalData.isNoLimitReward}
                  />
                </div>
              </div>
              <div className="w-full lg:w-1/12 px-4 margin-auto-t-b ">
                &nbsp;
              </div>
              <div className="w-full lg:w-5/12 px-4 margin-auto-t-b">
                &nbsp;
              </div>
              <div className="w-full">&nbsp;</div>
              <div className="w-full lg:w-1/12 px-4 margin-auto-t-b ">
                <LabelUC label="รายละเอียดคูปอง" isRequired={false} />
              </div>
              <div className="w-full lg:w-11/12 px-4 margin-auto-t-b">
                <div className="relative">
                  <TextAreaUC name="description" onChange={(e) => {}} />
                </div>
              </div>
              {/* <div className="w-full lg:w-1/12 px-4 margin-auto-t-b ">
                <LabelUC label="วันที่เริ่มต้น" isRequired={true} />
              </div>
              <div className="w-full lg:w-5/12 px-4 margin-auto-t-b">
                <div className="relative">
                  <DatePickerUC
                    onClick={(e) => {
                      setIsClick({ ...isClick, couponStart: true });
                    }}
                    onBlur={(e) => {
                      setIsClick({ ...isClick, couponStart: false });
                    }}
                    onChange={(e) => {
                      setIsClick({ ...isClick, couponStart: false });
                      if (e === null) {
                       
                      } else {
                    
                      }
                    }}
                    value={
                      !isClick.couponStart
                        ? moment(
                            new Date(),
                            "DD/MM/YYYY"
                          )
                        : null
                    }
                  />
                </div>
              </div>
              <div className={"w-full" + (width < 764 ? " block" : " hidden")}>
                &nbsp;
              </div>
              <div className="w-full lg:w-1/12 px-4 margin-auto-t-b ">
                <LabelUC label="วันที่สิ้นสุด" isRequired={true} />
              </div>
              <div className="w-full lg:w-5/12 px-4 margin-auto-t-b">
                <div className="relative">
                  <DatePickerUC
                    onClick={(e) => {
                      setIsClick({ ...isClick, couponEnd: true });
                    }}
                    onBlur={(e) => {
                      setIsClick({ ...isClick, couponEnd: false });
                    }}
                    onChange={(e) => {
                      setIsClick({ ...isClick, couponEnd: false });
                      if (e === null) {
                       
                      } else {
                        
                      }
                    }}
                    value={
                      !isClick.couponEnd
                        ? moment(new Date(), "DD/MM/YYYY")
                        : null
                    }
                  />
                </div>
              </div> */}
            </div>
            <div className="relative w-full mb-3">
              <div className=" flex justify-between align-middle ">
                <div></div>
                <div className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4">
                  <button
                    className={
                      "bg-gold-mbk text-white active:bg-gold-mbk font-bold uppercase text-sm px-2 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                    }
                    type="button"
                    onClick={() => {}}
                  >
                    บันทึกข้อมูล
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default GameInfo;
