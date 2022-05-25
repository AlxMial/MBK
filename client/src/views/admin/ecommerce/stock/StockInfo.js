import React, { useState, useEffect } from "react";
/* Service */
import useWindowDimensions from "services/useWindowDimensions";
import { Radio } from "antd";
import "antd/dist/antd.css";
import "moment/locale/th";
import moment from "moment";
import CreatableSelect from "react-select/creatable";
import Modal from "react-modal";
import LabelUC from "components/LabelUC";
import {
  customStyles,
  customStylesMobile,
} from "assets/styles/theme/ReactModal";
import ProfilePictureUC from 'components/ProfilePictureUC';
import InputUC from "components/InputUC";
import SelectUC from 'components/SelectUC';
import ValidateService from "services/validateValue";
import TextAreaUC from "components/InputUC/TextAreaUC";
import Switch from "react-switch";
import DatePickerUC from "components/DatePickerUC";
import ButtonUCSaveModal from "components/ButtonUCSaveModal";
import axios from "services/axios";
import { useToasts } from "react-toast-notifications";
import ModalHeader from "views/admin/ModalHeader";

const StockInfo = ({ handleModal, formik, open, handleChangeImage, stockImage }) => {
  Modal.setAppElement("#root");

  const discountList = [
    { value: 'baht', label: 'บาท' },
    { value: 'percent', label: '%' },
  ]

  const inactiveList = [
    { label: "เปิดการใช้งาน", value: true },
    { label: "ปิดการใช้งาน", value: false },
  ];

  const { addToast } = useToasts();
  const useStyle = customStyles();
  const useStyleMobile = customStylesMobile();
  /* Service Function */
  const { width } = useWindowDimensions();
  const [isLoadingSelect, setIsLoadingSelect] = useState(false);
  const [productCategoryList, setProductCategoryList] = useState([]);
  const [categoryValue, setCategoryValue] = useState(null);

  useEffect(async () => {
    await fetchData();
  }, []);

  const fetchData = async () => {
    const res = await axios.get('productCategory');
    const productCategory = await res.data.tbProductCategory;
    if (productCategory) {
      // console.log('setProductCategoryList', productCategory);
      setProductCategoryList(productCategory.map(item => ({
        label: item.categoryName,
        value: item.id,
      })));
    }
  }

  useEffect(() => {
    // default
    if (productCategoryList && productCategoryList.length > 0) {
      if (!formik.values.productCategoryId) {
        setCategoryValue(productCategoryList[0]);
        console.log('setDefault', productCategoryList[0]);
        formik.setFieldValue('productCategoryId', productCategoryList[0].value);
      } else {
        setCategoryValue(productCategoryList.find(item => item.value === formik.values.productCategoryId));
      }
    }

  }, [productCategoryList]);

  const createOption = (label) => ({
    label,
    value: label.toLowerCase().replace(/\W/g, ""),
  });

  const handleChange = (
    newValue,
    actionMeta
  ) => {

    // console.group('Value Changed');
    // console.log(newValue);
    // console.log(`action: ${actionMeta.action}`);
    // console.groupEnd();
    const _categoryValue = productCategoryList && productCategoryList.filter(item => item.value === newValue);
    if (_categoryValue) {
      setCategoryValue(_categoryValue[0]);
    }
    formik.setFieldValue('productCategoryId', newValue, false);
  };

  const handleCreate = (inputValue) => {
    setIsLoadingSelect(true);
    console.group("Option created");
    console.log("Wait a moment...");
    setTimeout(() => {
      const newOption = createOption(inputValue);
      const newItem = {
        id: '',
        categoryName: inputValue,
        isDeleted: false,
        addBy: localStorage.getItem('user'),
        updateBy: localStorage.getItem('user'),
      }
      axios.post('productCategory', newItem).then(res => {
        if (res.data.status) {
          console.groupEnd();
          setProductCategoryList([...productCategoryList, newOption]);
          setIsLoadingSelect(false);
          console.log('newOption', newOption);
          setCategoryValue(newOption);
          formik.setFieldValue('productCategoryId', newOption.value, false);
        } else {
          setIsLoadingSelect(false);
          addToast("บันทึกข้อมูลหมวดหมู่สินค้าไม่สำเร็จ", {
            appearance: "warning",
            autoDismiss: true,
          });
        }
      });
    }, 1000);
  };

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
            <form onSubmit={formik.handleSubmit}>
              <ModalHeader title="เพิ่มสินค้า" handleModal={handleModal} />
              <div className="flex flex-wrap px-24 py-10 justify-center">
                <div className="w-full lg:w-12/12 px-4 margin-auto-t-b Overflow-info">
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
                              key={i + 1}
                              id={i + 1}
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
                    <div className="w-full lg:w-8/12 margin-auto-t-b">
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
                    <div className="w-full lg:w-8/12 margin-auto-t-b">
                      <div className="relative w-full px-4">
                        <CreatableSelect
                          isClearable
                          className="border-0 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          styles={useStyle}
                          isLoading={isLoadingSelect}
                          options={productCategoryList}
                          onChange={handleChange}
                          placeholder="เลือกข้อมูล / เพิ่มข้อมูล"
                          onCreateOption={handleCreate}
                          value={categoryValue}
                        />
                      </div>
                      <div className="relative w-full px-4">
                        {formik.touched.productCategoryId &&
                          formik.errors.productCategoryId ? (
                          <div className="text-sm py-2 px-2  text-red-500">
                            {formik.errors.productCategoryId}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap mt-4">
                    <div className="w-full lg:w-2/12 px-4 margin-auto-t-b ">
                      <LabelUC label="ราคา" isRequired={true} />
                    </div>
                    <div className="w-full lg:w-2/12 margin-auto-t-b">
                      <div className="relative w-full px-4">
                        <InputUC
                          type="number"
                          name='price'
                          maxLength={10}
                          onBlur={formik.handleBlur}
                          value={formik.values.price}
                          // disabled={typePermission !== "1"}
                          onChange={(e) => {
                            formik.handleChange(e);
                          }} />
                      </div>
                      <div className="relative w-full px-4">
                        {formik.touched.price &&
                          formik.errors.price ? (
                          <div className="text-sm py-2 px-2  text-red-500">
                            {formik.errors.price}
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="w-full lg:w-1/12 px-4 margin-auto-t-b flex justify-between">
                      <LabelUC label="บาท" />
                      <LabelUC label="ส่วนลด" />
                    </div>
                    {/* ส่วนลด */}
                    <div className="w-full lg:w-1/12 margin-auto-t-b">
                      <div className="relative w-full px-4">
                        <InputUC
                          type="number"
                          name='discount'
                          maxLength={10}
                          onBlur={formik.handleBlur}
                          value={formik.values.discount}
                          // disabled={typePermission !== "1"}
                          onChange={(e) => {
                            formik.handleChange(e);
                          }} />
                      </div>
                    </div>
                    <div className="w-full lg:w-1/12 pl-4 margin-auto-t-b ">
                      <SelectUC
                        id="discountType"
                        name="discountType"
                        onChange={(e) => {
                          formik.setFieldValue("discountType", e.value);
                        }}
                        options={discountList}
                        value={ValidateService.defaultValue(
                          discountList,
                          formik.values.discountType
                        )}
                      />
                    </div>
                  </div>
                  {/* จำนวนสินค้าในคลัง */}
                  <div className="flex flex-wrap mt-4">
                    <div className="w-full lg:w-2/12 px-4 margin-auto-t-b ">
                      <LabelUC label="จำนวนสินค้าในคลัง" />
                    </div>
                    <div className="w-full lg:w-2/12 margin-auto-t-b">
                      <div className="relative w-full px-4">
                        <InputUC
                          type="number"
                          name='productCount'
                          maxLength={10}
                          onBlur={formik.handleBlur}
                          value={formik.values.productCount}
                          // disabled={typePermission !== "1"}
                          onChange={(e) => {
                            formik.handleChange(e);
                          }} />
                      </div>
                    </div>
                    <div className="w-full lg:w-1/12 px-4 margin-auto-t-b ">
                      <LabelUC label="ชิ้น" />
                    </div>
                  </div>
                  {/* น้ำหนัก */}
                  <div className="flex flex-wrap mt-4">
                    <div className="w-full lg:w-2/12 px-4 margin-auto-t-b ">
                      <LabelUC label="น้ำหนัก" />
                    </div>
                    <div className="w-full lg:w-2/12 margin-auto-t-b">
                      <div className="relative w-full px-4">
                        <InputUC
                          type="number"
                          name='weight'
                          maxLength={10}
                          onBlur={formik.handleBlur}
                          value={formik.values.weight}
                          // disabled={typePermission !== "1"}
                          onChange={(e) => {
                            formik.handleChange(e);
                          }} />
                      </div>
                    </div>
                    <div className="w-full lg:w-1/12 px-4 margin-auto-t-b ">
                      <LabelUC label="กิโลกรัม" />
                    </div>
                  </div>
                  {/* รายละเอียด */}
                  <div className="flex flex-wrap mt-4">
                    <div className="w-full lg:w-2/12 px-4 margin-auto-t-b ">
                      <LabelUC label="รายละเอียด" />
                    </div>
                    <div className="w-full lg:w-8/12 margin-auto-t-b">
                      <div className="relative w-full px-4">
                        <TextAreaUC
                          row={3}
                          name='description'
                          onBlur={formik.handleBlur}
                          value={formik.values.description}
                          onChange={(e) => {
                            formik.handleChange(e);
                          }} />
                      </div>
                    </div>
                  </div>
                  {/* รายละเอียดโปรโมชั่น */}
                  <div className="flex flex-wrap mt-4">
                    <div className="w-full lg:w-2/12 px-4 margin-auto-t-b ">
                      <LabelUC label="รายละเอียดโปรโมชั่น" />
                    </div>
                    <div className="w-full lg:w-8/12 margin-auto-t-b">
                      <div className="relative w-full px-4">
                        <TextAreaUC
                          row={3}
                          name='descriptionPromotion'
                          onBlur={formik.handleBlur}
                          value={formik.values.descriptionPromotion}
                          onChange={(e) => {
                            formik.handleChange(e);
                          }} />
                      </div>
                    </div>
                  </div>
                  {/* FLASH SALE */}
                  <div className="flex flex-wrap mt-4">
                    <div className="w-full lg:w-2/12 px-4 margin-auto-t-b ">
                      <LabelUC label="FLASH SALE" isRequired={true} />
                    </div>
                    <div className="w-full lg:w-6/12 margin-auto-t-b">
                      <div className="relative w-full px-4">
                        <Switch
                          uncheckedIcon={false}
                          checkedIcon={false}
                          onChange={(value) => {
                            formik.setFieldValue("isFlashSale", value);
                          }}
                          checked={formik.values.isFlashSale} />
                      </div>
                    </div>
                  </div>
                  {/* ระยะเวลาแคมเปญ */}
                  <div className="flex flex-wrap mt-4">
                    <div className="w-full lg:w-2/12 px-4 margin-auto-t-b ">
                      <LabelUC label="ระยะเวลาแคมเปญ" />
                    </div>
                    <div className="w-full lg:w-2/12 margin-auto-t-b">
                      <div className="relative w-full px-4">
                        <DatePickerUC
                          onChange={(e) => {
                            formik.setFieldValue(
                              "startDateCampaign",
                              moment(e).toDate(),
                              false
                            );
                          }}
                          value={
                            formik.values.startDateCampaign
                              ? moment(
                                new Date(formik.values.startDateCampaign),
                                "DD/MM/YYYY"
                              )
                              : null
                          }
                        />
                      </div>
                    </div>
                    <div className="w-full lg:w-1/12 px-4 margin-auto-t-b">
                      <LabelUC label="ถึง" moreClassName=' text-center' />
                    </div>
                    <div className="w-full lg:w-2/12 margin-auto-t-b">
                      <div className="relative w-full px-4">
                        <DatePickerUC
                          onChange={(e) => {
                            formik.setFieldValue(
                              "endDateCampaign",
                              moment(e).toDate(),
                              false
                            );
                          }}
                          value={
                            formik.values.endDateCampaign
                              ? moment(
                                new Date(formik.values.endDateCampaign),
                                "DD/MM/YYYY"
                              )
                              : null
                          }
                        />
                      </div>
                    </div>
                  </div>
                  {/*  ช่วงเวลาแคมเปญ */}
                  <div className="flex flex-wrap mt-4">
                    <div className="w-full lg:w-2/12 px-4 margin-auto-t-b ">
                      <LabelUC label="ช่วงเวลาแคมเปญ" />
                    </div>
                    <div className="w-full lg:w-2/12 margin-auto-t-b">
                      <div className="relative w-full px-4">
                        <InputUC
                          type="time"
                          name='startTimeCampaign'
                          maxLength={10}
                          onBlur={formik.handleBlur}
                          value={formik.values.startTimeCampaign}
                          // disabled={typePermission !== "1"}
                          onChange={(e) => {
                            formik.handleChange(e);
                          }} />
                      </div>
                    </div>
                    <div className="w-full lg:w-1/12 px-4 margin-auto-t-b">
                      <LabelUC label="ถึง" moreClassName=' text-center' />
                    </div>
                    <div className="w-full lg:w-2/12 margin-auto-t-b">
                      <div className="relative w-full px-4">
                        <InputUC
                          type="time"
                          name='endTimeCampaign'
                          maxLength={10}
                          onBlur={formik.handleBlur}
                          value={formik.values.endTimeCampaign}
                          // disabled={typePermission !== "1"}
                          onChange={(e) => {
                            formik.handleChange(e);
                          }} />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap mt-4 ">
                    <div className="w-full lg:w-2/12 px-4 margin-auto-t-b ">
                      <LabelUC label="" />
                    </div>
                    <div className="w-full lg:w-6/12 margin-auto-t-b">
                      <div className="relative w-full px-4">
                        <Radio.Group
                          options={inactiveList}
                          onChange={(e) => {
                            formik.setFieldValue(
                              "isInactive",
                              e.target.value
                            );
                          }}
                          value={formik.values.isInactive}
                        />
                      </div>
                    </div>
                  </div>
                  <ButtonUCSaveModal />
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