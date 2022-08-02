import React, { useState } from "react";
import { Radio } from "antd";
import { useDispatch } from "react-redux";
import { fetchLoading, fetchSuccess } from "redux/actions/common";
import InputUC from "components/InputUC";
import TextAreaUC from "components/InputUC/TextAreaUC";
import Modal from "react-modal";
import LabelUC from "components/LabelUC";
import axios from "services/axios";
import useWindowDimensions from "services/useWindowDimensions";
import ProfilePictureUC from "components/ProfilePictureUC";
import ValidateService from "services/validateValue";
import ConfirmEdit from "components/ConfirmDialog/ConfirmEdit";
import {
  customStyles,
  customStylesMobile,
} from "assets/styles/theme/ReactModal";
import { useToasts } from "react-toast-notifications";
import * as fn from "@services/default.service";

const Info = (prop) => {
  const dispatch = useDispatch();
  const { infoModel } = prop;
  const [dataModel, setdataModel] = useState(infoModel.dataModel);
  const [errorImage, setErrorImage] = useState(false);
  const [modalIsOpenEdit, setmodalIsOpenEdit] = useState(false);
  const { addToast } = useToasts();
  const useStyle = customStyles();
  const useStyleMobile = customStylesMobile();
  const { width } = useWindowDimensions();
  const onChangeImage = async (e) => {
    const image = document.getElementById("CategoryImage");
    if (e.target.files.length > 0) {
      const dataImage = ValidateService.validateImage(e.target.files[0].name);
      setErrorImage(dataImage);
      if (!dataImage) {
        image.src = URL.createObjectURL(e.target.files[0]);
        const base64 = await fn.resizeFile(e.target.files[0]); // 500px * 500px

        let errors = dataModel.errors;
        errors.dataImage = null;
        setdataModel((pre) => ({ ...pre, dataImage: base64, errors: errors }));
      }
    }
  };

  const doSave = async () => {
    if (await valid()) {
      dispatch(fetchLoading());
      if (fn.IsNullOrEmpty(dataModel.id)) {
        dataModel.addBy = sessionStorage.getItem("user");
        axios
          .post("productCategory", dataModel)
          .then((res) => {
            if (res.data.status) {
              addToast("บันทึกข้อมูลสำเร็จ", {
                appearance: "success",
                autoDismiss: true,
              });
              infoModel.onClose();
            } else {
              addToast("บันทึกข้อมูลหมวดหมู่สินค้าไม่สำเร็จ", {
                appearance: "warning",
                autoDismiss: true,
              });
            }
          })
          .finally(() => {
            dispatch(fetchSuccess());
          });
      } else {
        dataModel.updateBy = sessionStorage.getItem("user");
        axios
          .put("productCategory", dataModel)
          .then((res) => {
            if (res.data.status) {
              addToast("บันทึกข้อมูลสำเร็จ", {
                appearance: "success",
                autoDismiss: true,
              });
              infoModel.onClose();
            } else {
              addToast("บันทึกข้อมูลหมวดหมู่สินค้าไม่สำเร็จ", {
                appearance: "warning",
                autoDismiss: true,
              });
            }
          })
          .finally(() => {
            dispatch(fetchSuccess());
          });
      }
    }
  };
  const valid = async () => {
    let isValid = true;
    let errors = {};
    if (fn.IsNullOrEmpty(dataModel.categoryName)) {
      isValid = false;
      errors.categoryName = "* กรุณาระบุชื่อหมวดหมู่สินค้า";
    }
    if (fn.IsNullOrEmpty(dataModel.dataImage)) {
      isValid = false;
      errors.dataImage = "กรุณาระบุรูปหมวดหมู่สินค้า";
    }
    if (isValid) {
      const tbProductCategory = await axios
        .get("productCategory", dataModel)
        .then((res) => {
          if (res.data.status) {
            return res.data.tbProductCategory;
          } else {
            return null;
          }
        })
        .catch(() => {
          return null;
        })
        .finally(() => {
          dispatch(fetchSuccess());
        });
      if (tbProductCategory != null) {
        const duplicate = tbProductCategory.find(
          (e) =>
            e.categoryName.toLowerCase() ===
              dataModel.categoryName.toLowerCase() && e.id !== dataModel.id
        );
        if (!fn.IsNullOrEmpty(duplicate)) {
          isValid = false;
          errors.categoryName = "* ชื่อหมวดหมู่สินค้าซ้ำ";
        }
      }
    }
    setdataModel((pre) => ({
      ...pre,
      errors: errors,
    }));
    return isValid;
  };
  const onClose = () => {
    let newdata = dataModel;
    let olddata = infoModel.dataModel;

    if (
      newdata.categoryName !== olddata.categoryName ||
      newdata.description !== olddata.description ||
      newdata.dataImage !== olddata.dataImage ||
      newdata.isInactive !== olddata.isInactive
    ) {
      setmodalIsOpenEdit(true);
    } else {
      infoModel.onClose();
    }
  };

  return (
    <>
      <Modal
        isOpen={infoModel.open}
        onRequestClose={onClose}
        style={width <= 1180 ? useStyleMobile : useStyle}
        contentLabel="Example Modal"
        shouldCloseOnOverlayClick={false}
      >
        {infoModel.open ? (
          <div className="flex flex-wrap">
            <div className="w-full flex-auto mt-2">
              <form>
                <div className=" flex justify-between align-middle ">
                  <div className=" align-middle  mb-3">
                    <div className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-base text-green-mbk font-bold whitespace-nowrap p-4">
                      <label>
                        {dataModel.id === null ? "เพิ่ม" : "แก้ไข"}
                        หมวดหมู่สินค้า
                      </label>
                    </div>
                  </div>
                  <div className="  text-right align-middle  mb-3">
                    <div className=" border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm text-red-500 font-bold whitespace-nowrap p-4">
                      <label className="cursor-pointer" onClick={onClose}>
                        X
                      </label>
                    </div>
                  </div>
                </div>
                <div
                  className="flex flex-wrap px-24 py-4 justify-center"
                  style={{ height: "100%", overflowY: "auto" }}
                >
                  <div className="w-full lg:w-1/12 margin-auto-t-b ">
                    <LabelUC label="รูปหมวดหมู่สินค้า" isRequired={true} />
                  </div>
                  <div className="w-full  lg:w-11/12 px-4 margin-auto-t-b ">
                    <div className="relative w-full px-4">
                      <ProfilePictureUC
                        id="CategoryImage"
                        hoverText="เลือกรูปหมวดหมู่สินค้า"
                        onChange={onChangeImage}
                        src={dataModel.dataImage}
                      />
                      {errorImage || dataModel.errors.dataImage ? (
                        <div className="text-sm py-2 px-2  text-red-500">
                          * {errorImage || dataModel.errors.dataImage}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="w-full">&nbsp;</div>
                  <div className="w-full lg:w-1/12 margin-auto-t-b ">
                    <LabelUC label="ชื่อหมวดหมู่สินค้า" isRequired={true} />
                  </div>
                  <div className="w-full  lg:w-11/12 px-4 margin-auto-t-b ">
                    <div className="relative w-full px-4">
                      <InputUC
                        name="categoryName"
                        type="text"
                        maxLength={255}
                        value={dataModel.categoryName}
                        onChange={(e) => {
                          let errors = dataModel.errors;
                          errors.categoryName = null;
                          setdataModel((pre) => ({
                            ...pre,
                            categoryName: e.target.value,
                            errors: errors,
                          }));
                        }}
                      />
                      {dataModel.errors.categoryName ? (
                        <div className="text-sm py-2 px-2  text-red-500">
                          {dataModel.errors.categoryName}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="w-full">&nbsp;</div>
                  <div className="w-full lg:w-1/12 margin-auto-t-b ">
                    <LabelUC label="รายละเอียด" />
                  </div>
                  <div className="w-full  lg:w-11/12 px-4 margin-auto-t-b ">
                    <div className="relative w-full px-4">
                      <TextAreaUC
                        name="description"
                        type="text"
                        maxLength={255}
                        value={dataModel.description}
                        onChange={(e) => {
                          setdataModel((pre) => ({
                            ...pre,
                            description: e.target.value,
                          }));
                        }}
                      />
                      {dataModel.errors.description ? (
                        <div className="text-sm py-2 px-2  text-red-500">
                          {dataModel.errors.description}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="w-full">&nbsp;</div>
                  <div className="w-full lg:w-2/12 margin-auto-t-b "></div>
                  <div className="w-full lg:w-10/12 px-4 margin-auto-t-b ">
                    <Radio.Group
                      options={[
                        { label: "เปิดการใช้งาน", value: false },
                        { label: "ปิดการใช้งาน", value: true },
                      ]}
                      onChange={(e) => {
                        setdataModel((pre) => ({
                          ...pre,
                          isInactive: e.target.value,
                        }));
                      }}
                      value={dataModel.isInactive}
                    />
                  </div>
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
                        onClick={doSave}
                      >
                        บันทึกข้อมูล
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        ) : null}
      </Modal>
      <ConfirmEdit
        showModal={modalIsOpenEdit}
        message={"หมวดหมู่สินค้า"}
        hideModal={() => {
          infoModel.onClose();
        }}
        confirmModal={() => {
          doSave();
          setmodalIsOpenEdit(false);
        }}
        returnModal={() => {
          infoModel.onClose();
        }}
      />
    </>
  );
};

export default Info;
