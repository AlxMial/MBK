import React, { useState } from "react";
/* Service */
import useWindowDimensions from "services/useWindowDimensions";
import "antd/dist/antd.css";
import "moment/locale/th";
import InputUC from "components/InputUC";
import LabelUC from "components/LabelUC";
import ProfilePictureUC from "components/ProfilePictureUC";
import CheckBoxUC from "components/CheckBoxUC";
import TextAreaUC from "components/InputUC/TextAreaUC";
import FilesService from "../../../../services/files";
import ValidateService from "services/validateValue";

const StandardProduct = ({ formik }) => {
  const { width } = useWindowDimensions();
  const [delay, setDelay] = useState();

  const handleChangeImage = async (e) => {
    const image = document.getElementById("eProductImage");
    image.src = URL.createObjectURL(e.target.files[0]);
    const base64 = await FilesService.convertToBase64(e.target.files[0]);
    formik.setFieldValue("pictureProduct", base64);
  };

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 border bg-white rounded-lg ">
      <div className="flex-auto lg:px-8 py-6">
        <div className="flex flex-wrap">
          <div className="w-full lg:w-1/12 margin-auto-t-b">
            <div className="relative w-full">
              <LabelUC label="รูปสินค้าสัมนาคุณ" isRequired={true} />
              {formik.touched.pictureProduct && formik.errors.pictureProduct ? (
                <div className="text-sm py-2 px-2 text-red-500">&nbsp;</div>
              ) : null}
            </div>
          </div>
          <div className="w-full lg:w-11/12 margin-auto-t-b">
            <div className="relative w-full px-4">
              <ProfilePictureUC
                id="eProductImage"
                hoverText="เลือกรูปสินค้าสัมนาคุณ"
                onChange={handleChangeImage}
                src={formik.values.pictureProduct}
              />

              {formik.touched.pictureProduct && formik.errors.pictureProduct ? (
                <div className="text-sm py-2 px-2  text-red-500">
                  {formik.errors.pictureProduct}
                </div>
              ) : null}
            </div>
          </div>
          <div className="w-full">&nbsp;</div>
          <div className="w-full lg:w-1/12 margin-auto-t-b">
            <div className="relative w-full">
              <LabelUC label="ชื่อสินค้าสัมนาคุณ" isRequired={true} />
              {formik.touched.productName && formik.errors.productName ? (
                <div className="text-sm py-2 px-2  text-red-500">&nbsp;</div>
              ) : null}
            </div>
          </div>
          <div className="w-full lg:w-11/12 margin-auto-t-b">
            <div className="relative w-full px-4">
              <InputUC
                name="productName"
                type="text"
                maxLength={255}
                onBlur={formik.handleBlur}
                value={formik.values.productName}
                onChange={(e) => {
                  formik.handleChange(e);
                }}
              />
              {formik.touched.productName && formik.errors.productName ? (
                <div className="text-sm py-2 px-2  text-red-500">
                  {formik.errors.productName}
                </div>
              ) : null}
            </div>
          </div>

          <div
            className={
              "w-full " +
              (formik.touched.productName && formik.errors.productName
                ? " hidden"
                : "")
            }
          >
            &nbsp;
          </div>
          <div className="w-full lg:w-1/12 margin-auto-t-b ">
            <LabelUC label="จำนวนสูงสุด" isRequired={true} />
            <div className="text-sm py-2 px-2  text-red-500">&nbsp;</div>
            {formik.touched.couponCount && formik.errors.couponCount ? (
              <div className="text-sm py-2 px-2  text-red-500">&nbsp;</div>
            ) : null}
          </div>
          <div className="w-full lg:w-5/12 px-4 margin-auto-t-b">
            <div className="relative flex">
              <InputUC
                name="rewardCount"
                type="text"
                maxLength={7}
                onBlur={formik.handleBlur}
                value={
                  !formik.values.isNoLimitReward
                    ? formik.values.rewardCount
                    : "ไม่จำกัด"
                }
                onChange={(e) => {
                  setDelay(ValidateService.onHandleNumber(e));
                  formik.values.rewardCount = ValidateService.onHandleNumber(e);
                }}
                disabled={formik.values.isNoLimitReward ? true : false}
                min="0"
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
                onChange={(e) => {
                  formik.setFieldValue("isNoLimitReward", e.target.checked);
                  if(e.target.checked)
                    formik.setFieldValue("rewardCount", 1);
                  else  
                    formik.setFieldValue("rewardCount", 0);
                  if (formik.values.rewardCount === "")
                    formik.setFieldValue("rewardCount", 0);
                  
                }}
                onBlur={formik.handleBlur}
                checked={formik.values.isNoLimitReward}
                classLabel="mt-2"
              />
            </div>
          </div>
          <div className="w-full lg:w-1/12 margin-auto-t-b ">&nbsp;</div>
          <div className="w-full lg:w-5/12 px-4 margin-auto-t-b">&nbsp;</div>

          <div className="w-full lg:w-1/12 margin-auto-t-b "></div>
          <div className="w-full lg:w-5/12 px-4 margin-auto-t-b">
            <div className="relative">
              {formik.touched.rewardCount && formik.errors.rewardCount ? (
                <div className="text-sm py-2 px-2  text-red-500">
                  {formik.errors.rewardCount}
                </div>
              ) : null}
            </div>
          </div>
          <div className="w-full lg:w-1/12 margin-auto-t-b ">&nbsp;</div>
          <div className="w-full lg:w-5/12 px-4 margin-auto-t-b">&nbsp;</div>
          <div className="w-full lg:w-1/12 margin-auto-t-b ">
            <LabelUC label="รายละเอียดคูปอง" isRequired={false} />
          </div>
          <div className="w-full lg:w-11/12 px-4 margin-auto-t-b">
            <div className="relative">
              <TextAreaUC
                name="description"
                onBlur={formik.handleBlur}
                value={formik.values.description}
                onChange={(e) => {
                  formik.handleChange(e);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default StandardProduct;