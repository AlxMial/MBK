import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import {
  customStyles,
  customStylesMobile,
} from "assets/styles/theme/ReactModal";
import LabelUC from "components/LabelUC";
import useWindowDimensions from "services/useWindowDimensions";
import InputUC from "components/InputUC";
// import Select from "react-select";
import ValidateService from "services/validateValue";
import TextAreaUC from "components/InputUC/TextAreaUC";
import { Radio } from "antd";
import SelectUC from "components/SelectUC";
import ButtonUCSaveModal from "components/ButtonUCSaveModal";
import ModalHeader from "views/admin/ModalHeader";
import CreatableSelect from "react-select/creatable";
import { styleSelect } from "assets/styles/theme/ReactSelect.js";
import axios from "services/axios";
import { useToasts } from "react-toast-notifications";
import LogisticCategorylist from "./LogisticCategorylist";

const LogisticModal = ({ open, formik, handleModal }) => {
  Modal.setAppElement("#root");
  const useStyle = customStyles();
  const useStyleMobile = customStylesMobile();
  const { width } = useWindowDimensions();
  const useStyleCreate = styleSelect();
  const [isLoadingSelect, setIsLoadingSelect] = useState(false);
  const [logisticCategorylist, setLogisticCategorylist] = useState([]);
  const [categoryValue, setCategoryValue] = useState(null);
  const [delayValue, setDelayValue] = useState([]);
  const [openCategory, setOpenCategory] = useState(false);
  const logisticTypeList = [
    { label: "Kerry Express", value: "1" },
    // { label: "Flash Express", value: 'flash' },
    { label: "ไปรษณีย์ไทย", value: "2" },
  ];
  const { addToast } = useToasts();
  const optionsDelivery = [{ label: "ค่าจัดส่งคงที่", value: "1" }];
  /* Method Condition */
  const optionsActive = [
    { label: "เปิดการใช้งาน", value: "1" },
    { label: "ปิดการใช้งาน", value: "0" },
  ];

  const createOption = (label) => ({
    label,
    value: label.toLowerCase().replace(/\W/g, ""),
  });

  const handleChange = (newValue, actionMeta) => {
    if (newValue !== null) {
      const _categoryValue =
        logisticCategorylist &&
        logisticCategorylist.filter((item) => item.value === newValue);
      if (_categoryValue) {
        setCategoryValue(_categoryValue[0]);
      }
    }
    formik.setFieldValue(
      "logisticCategoryId",
      newValue !== null ? newValue.value : "",
      false
    );
  };

  const handleCreate = (inputValue) => {
    setIsLoadingSelect(true);
    const newOption = createOption(inputValue);
    const newItem = {
      id: "",
      logisticCategory: inputValue,
      isDeleted: false,
      addBy: sessionStorage.getItem("user"),
      updateBy: sessionStorage.getItem("user"),
    };
    axios.post("logisticCategory", newItem).then((res) => {
      if (res.data.status) {
        // setLogisticCategorylist([...logisticCategorylist, newOption]);
        newOption.value = res.data.tbLogisticCategory.id;
        setLogisticCategorylist((s) => {
          return [
            ...s,
            {
              value: newOption.value,
              label: newOption.label,
            },
          ];
        });
        setDelayValue("setvalue");
        setIsLoadingSelect(false);
        setCategoryValue(newOption);
        formik.setFieldValue("logisticCategoryId", newOption.value);
      } else {
        setIsLoadingSelect(false);
        addToast("บันทึกข้อมูลบริษัทขนส่งไม่สำเร็จ", {
          appearance: "warning",
          autoDismiss: true,
        });
      }
    });
  };

  const onOpenModal = () => {
    setOpenCategory(true);
  };

  const onCloseModal = () => {
    setOpenCategory(false);
  };

  useEffect(async () => {
    await fetchData();
  }, []);

  const fetchData = async () => {
    const res = await axios.get("logisticCategory");
    const logisticCategory = await res.data.tbLogisticCategory;
    if (logisticCategory) {
      setLogisticCategorylist(
        logisticCategory.map((item) => ({
          label: item.logisticCategory,
          value: item.id,
        }))
      );
    }
  };

  useEffect(() => {
    // default

    if (logisticCategorylist && logisticCategorylist.length > 0) {
      if (!formik.values.logisticCategoryId) {
        setCategoryValue(logisticCategorylist[0]);
        formik.setFieldValue(
          "logisticCategoryId",
          logisticCategorylist[0].value
        );
      } else {
        setCategoryValue(
          logisticCategorylist.find(
            (item) => item.value === formik.values.logisticCategoryId
          )
        );
      }
    }
  }, [logisticCategorylist]);

  return (
    <>
      <Modal
        isOpen={open}
        onRequestClose={handleModal}
        style={width <= 1180 ? useStyleMobile : useStyle}
        contentLabel="Example Modal"
        shouldCloseOnOverlayClick={false}
      >
        <form onSubmit={formik.handleSubmit}>
          <div className="flex flex-wrap">
            <div className="w-full flex-auto mt-2">
              <ModalHeader
                title="เพิ่มช่องทางการส่งของ"
                handleModal={handleModal}
              />
              <div className="flex flex-wrap px-24 py-10 justify-center">
                <div className="w-full lg:w-12/12 px-4 margin-auto-t-b ">
                  <div className="flex flex-wrap">
                    <div className="w-full lg:w-4/12 px-4 margin-auto-t-b ">
                      <LabelUC label="บริษัทขนส่ง" isRequired={true} />
                    </div>
                    <div className="w-full lg:w-6/12 margin-auto-t-b">
                      <div className="relative w-full px-4">
                        {/* <SelectUC
                        id="logisticType"
                        name="logisticType"
                        onChange={(e) => {
                          formik.setFieldValue("logisticType", e.value);
                        }}
                        options={logisticTypeList}
                        value={ValidateService.defaultValue(
                          logisticTypeList,
                          formik.values.logisticType
                        )}
                      /> */}
                        <div className="flex flex-warp">
                          <div className="relative w-full ">
                            <CreatableSelect
                              isClearable
                              className="border-0 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                              styles={useStyleCreate}
                              menuPortalTarget={document.body}
                              menuPosition="fixed"
                              isLoading={isLoadingSelect}
                              options={logisticCategorylist}
                              onChange={handleChange}
                              placeholder="เลือกข้อมูล / เพิ่มข้อมูล"
                              onCreateOption={handleCreate}
                              value={categoryValue}
                            />
                          </div>
                          <div className="relative px-4 margin-a ">
                            <i
                              className=" cursor-pointer fas fa-bars"
                              onClick={() => {
                                onOpenModal();
                              }}
                            ></i>
                          </div>
                        </div>
                      </div>
                      <div className="relative w-full px-4">
                        {formik.touched.logisticType &&
                        formik.errors.logisticType ? (
                          <div className="text-sm py-2 px-2  text-red-500">
                            {formik.errors.logisticType}
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="w-full lg:w-1/12 px-4 margin-auto-t-b ">
                      <LabelUC label="" />
                    </div>
                  </div>
                  <div className="flex flex-wrap mt-4">
                    <div className="w-full lg:w-4/12 px-4 margin-auto-t-b ">
                      <LabelUC
                        label="ชื่อที่แสดงในหน้าสั่งซื้อสินค้าของลูกค้า"
                        isRequired={true}
                      />
                    </div>
                    <div className="w-full lg:w-6/12 margin-auto-t-b">
                      <div className="relative w-full px-4">
                        <InputUC
                          name="deliveryName"
                          maxLength={100}
                          onBlur={formik.handleBlur}
                          value={formik.values.deliveryName}
                          // disabled={typePermission !== "1"}
                          onChange={(e) => {
                            formik.handleChange(e);
                          }}
                        />
                      </div>
                      <div className="relative w-full px-4">
                        {formik.touched.deliveryName &&
                        formik.errors.deliveryName ? (
                          <div className="text-sm py-2 px-2  text-red-500">
                            {formik.errors.deliveryName}
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="w-full lg:w-1/12 px-4 margin-auto-t-b ">
                      <LabelUC label="" />
                    </div>
                  </div>
                  <div className="flex flex-wrap mt-4">
                    <div className="w-full lg:w-4/12 px-4">
                      <LabelUC label="รายละเอียด" />
                    </div>
                    <div className="w-full lg:w-6/12 margin-auto-t-b">
                      <div className="relative w-full px-4">
                        <TextAreaUC
                          name="description"
                          onBlur={formik.handleBlur}
                          value={formik.values.description}
                          onChange={(e) => {
                            formik.handleChange(e);
                          }}
                        />
                      </div>
                      <div className="relative w-full px-4">
                        {formik.touched.description &&
                        formik.errors.description ? (
                          <div className="text-sm py-2 px-2  text-red-500">
                            {formik.errors.description}
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="w-full lg:w-1/12 px-4 margin-auto-t-b ">
                      <LabelUC label="" />
                    </div>
                  </div>
                  <div className="flex flex-wrap mt-4">
                    <div className="w-full lg:w-4/12 px-4 margin-auto-t-b ">
                      <LabelUC label="ประเภทการจัดส่ง" />
                    </div>
                    <div className="w-full lg:w-6/12 margin-auto-t-b">
                      <div className="relative w-full px-4">
                        <Radio.Group
                          options={optionsDelivery}
                          onChange={(e) => {
                            formik.setFieldValue(
                              "deliveryType",
                              e.target.value
                            );
                          }}
                          value={formik.values.deliveryType}
                        />
                      </div>
                    </div>
                    <div className="w-full lg:w-1/12 px-4 margin-auto-t-b ">
                      <LabelUC label="" />
                    </div>
                  </div>
                  <div className="flex flex-wrap mt-4">
                    <div className="w-full lg:w-4/12 px-4 margin-auto-t-b ">
                      <LabelUC label="ค่าจัดส่ง" isRequired={true} />
                    </div>
                    <div className="w-full lg:w-6/12 margin-auto-t-b">
                      <div className="relative w-full px-4">
                        <InputUC
                          type="number"
                          name="deliveryCost"
                          maxLength={100}
                          onBlur={formik.handleBlur}
                          value={formik.values.deliveryCost}
                          onChange={(e) => {
                            formik.handleChange(e);
                          }}
                        />
                      </div>
                    </div>
                    <div className="w-full lg:w-1/12 px-4 margin-auto-t-b ">
                      <LabelUC label="บาท" />
                    </div>
                  </div>

                  <div className="flex flex-wrap mt-4">
                    <div className="w-full lg:w-4/12 px-4 margin-auto-t-b ">
                      <LabelUC label="" />
                    </div>
                    <div className="w-full lg:w-6/12 margin-auto-t-b">
                      <div className="relative w-full px-4">
                        <Radio.Group
                          options={optionsActive}
                          onChange={(e) => {
                            formik.setFieldValue("isShow", e.target.value);
                          }}
                          value={formik.values.isShow === true ? "1" : "0"}
                        />
                      </div>
                    </div>
                    <div className="w-full lg:w-1/12 px-4 margin-auto-t-b ">
                      <LabelUC label="" />
                    </div>
                  </div>
                </div>
              </div>
              <ButtonUCSaveModal />
            </div>
          </div>
        </form>
      </Modal>

      <LogisticCategorylist
        listCategory={logisticCategorylist}
        setProductCategoryList={setLogisticCategorylist}
        showModal={openCategory}
        hideModal={() => setOpenCategory(false)}
      />
    </>
  );
};

export default LogisticModal;
