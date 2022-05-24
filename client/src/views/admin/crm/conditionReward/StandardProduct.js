import React, { useState } from "react";
/* Service */
import useWindowDimensions from "services/useWindowDimensions";
import "antd/dist/antd.css";
import moment from "moment";
import "moment/locale/th";
import { Space, Radio } from "antd";
import InputUC from "components/InputUC";
import LabelUC from "components/LabelUC";
import DatePickerUC from "components/DatePickerUC";
import ProfilePictureUC from "components/ProfilePictureUC";
import CheckBoxUC from "components/CheckBoxUC";
import TextAreaUC from "components/InputUC/TextAreaUC";

const StandardProduct = ({ formik, handleChangeImage }) => {
  const { width } = useWindowDimensions();
  const [isCancel, setIsCancel] = useState(false);
  const [isClick, setIsClick] = useState({
    couponStart: false,
    couponEnd: false,
    expireDate: false,
  });

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 border bg-white rounded-lg ">
      <div className="flex-auto lg:px-8 py-10">
        <div className="flex flex-wrap">
          <div className="w-full lg:w-1/12 margin-auto-t-b">
            <div className="relative w-full">
              <LabelUC label="รูปสินค้าสัมนาคุณ" isRequired={true} />
              {formik.touched.pictureCoupon && formik.errors.pictureCoupon ? (
                <div className="text-sm py-2 px-2 text-red-500">&nbsp;</div>
              ) : null}
            </div>
          </div>
          <div className="w-full lg:w-11/12 margin-auto-t-b">
            <div className="relative w-full px-4">
              <ProfilePictureUC
                id="eCouponImage"
                hoverText="เลือกรูปสินค้าสัมนาคุณ"
                onChange={handleChangeImage}
              />

              {formik.touched.pictureCoupon && formik.errors.pictureCoupon ? (
                <div className="text-sm py-2 px-2  text-red-500">
                  {formik.errors.pictureCoupon}
                </div>
              ) : null}
            </div>
          </div>
          <div className="w-full">&nbsp;</div>
          <div className="w-full lg:w-1/12 margin-auto-t-b">
            <div className="relative w-full">
              <LabelUC label="ชื่อสินค้าสัมนาคุณ" isRequired={true} />
              {formik.touched.couponName && formik.errors.couponName ? (
                <div className="text-sm py-2 px-2  text-red-500">&nbsp;</div>
              ) : null}
            </div>
          </div>
          <div className="w-full lg:w-11/12 margin-auto-t-b">
            <div className="relative w-full px-4">
              <InputUC
                name="couponName"
                type="text"
                maxLength={255}
                onBlur={formik.handleBlur}
                value={formik.values.couponName}
                onChange={(e) => {
                  formik.handleChange(e);
                }}
              />
              {formik.touched.couponName && formik.errors.couponName ? (
                <div className="text-sm py-2 px-2  text-red-500">
                  {formik.errors.couponName}
                </div>
              ) : null}
            </div>
          </div>

          <div
            className={
              "w-full " +
              (formik.touched.couponName && formik.errors.couponName
                ? " hidden"
                : "")
            }
          >
            &nbsp;
          </div>
          <div className="w-full lg:w-1/12 margin-auto-t-b ">
            <LabelUC label="จำนวนสูงสุด" isRequired={true} />
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
                value={formik.values.rewardCount}
                onChange={(e) => {
                  formik.handleChange(e);
                }}
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
                name="isNotExpired"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                checked={formik.values.isNotExpired}
                classLabel="mt-2"
              />
            </div>
          </div>
          <div className="w-full lg:w-1/12 margin-auto-t-b ">&nbsp;</div>
          <div className="w-full lg:w-5/12 px-4 margin-auto-t-b">&nbsp;</div>

          <div className="w-full lg:w-1/12 margin-auto-t-b "></div>
          <div className="w-full lg:w-5/12 px-4 margin-auto-t-b">
            <div className="relative">
              {formik.touched.couponCount && formik.errors.couponCount ? (
                <div className="text-sm py-2 px-2  text-red-500">
                  {formik.errors.couponCount}
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
