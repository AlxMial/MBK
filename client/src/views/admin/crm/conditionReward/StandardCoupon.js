import React, { useState, useEffect } from "react";
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
import FilesService from "../../../../services/files";
import ValidateService from "services/validateValue";
import SelectUC from "components/SelectUC";

const StandardCoupon = ({ formik }) => {
  const { width } = useWindowDimensions();
  const [isCancel, setIsCancel] = useState(false);
  const [delay, setDelay] = useState();

  const [disableCountCoupon, setDisableCountCoupon] = useState(false);
  const [isClick, setIsClick] = useState({
    couponStart: false,
    couponEnd: false,
    expireDate: false,
  });

  const discountType = [
    { value: "1", label: "บาท" },
    { value: "2", label: "%" },
  ];

  const handleChangeImage = async (e) => {
    const image = document.getElementById("eCouponImage");
    image.src = URL.createObjectURL(e.target.files[0]);
    const base64 = await FilesService.convertToBase64(e.target.files[0]);
    formik.setFieldValue("pictureCoupon", base64);
  };

  useEffect(() => {
    setDisableCountCoupon(formik.values.id !== "" ? true : false)
    /* Default Value for Testing */
  }, []);

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 border bg-white rounded-lg ">
      <div className="flex-auto lg:px-8 py-6">
        <div className="flex flex-wrap">
          <div className="w-full lg:w-1/12 margin-auto-t-b">
            <div className="relative w-full">
              <LabelUC label="รูปคูปอง" isRequired={true} />
              {formik.touched.pictureCoupon && formik.errors.pictureCoupon ? (
                <div className="text-sm py-2 px-2 text-red-500">&nbsp;</div>
              ) : null}
            </div>
          </div>
          <div className="w-full lg:w-11/12 margin-auto-t-b">
            <div className="relative w-full px-4">
              <ProfilePictureUC
                id="eCouponImage"
                hoverText="เลือกรูปภาพคูปอง"
                onChange={handleChangeImage}
                src={formik.values.pictureCoupon}
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
              <LabelUC label="ชื่อคูปอง" isRequired={true} />
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
          <div className="w-full">&nbsp;</div>
          <div className="w-full lg:w-1/12 margin-auto-t-b">
            <div className="relative w-full">
              <LabelUC label="ส่วนลด" isRequired={true} />
              {formik.touched.discount && formik.errors.discount ? (
                <div className="text-sm py-2 px-2  text-red-500">&nbsp;</div>
              ) : null}
            </div>
          </div>
          <div className="w-full lg:w-5/12 margin-auto-t-b">
            <div className="relative flex justify-between px-4">
              <InputUC
                name="discount"
                type="number"
                maxLength={7}
                onBlur={formik.handleBlur}
                value={formik.values.discount}
                onChange={(e) => {
                  if (formik.values.discountType === "2")
                    if (e.target.value > 100) e.target.value = 100;
                  setDelay(ValidateService.onHandleNumber(e));
                  formik.values.discount = ValidateService.onHandleNumberValue(e);
                }}
                min="0"
              />
              <span
                className="margin-auto-t-b font-bold ml-2"
                style={{ minWidth: "100px" }}
              >
                <SelectUC
                  options={discountType}
                  name="discountType"
                  onChange={(value) => {
                    if (value.value === "2")
                      if (formik.values.discount > 100)
                        formik.values.discount = 100;
                    formik.setFieldValue("discountType", value.value);
                  }}
                  value={ValidateService.defaultValue(
                    discountType,
                    formik.values.discountType
                  )}
                />
              </span>
            </div>
            <div className="w-full px-4">
              {formik.touched.discount && formik.errors.discount ? (
                <div className="text-sm py-2 px-2  text-red-500">
                  {formik.errors.discount}
                </div>
              ) : null}
            </div>
          </div>
          <div className="w-full">&nbsp;</div>
          <div className="w-full lg:w-1/12 margin-auto-t-b ">
            <LabelUC label="วันที่เริ่มใช้คูปอง" isRequired={true} />
            <div className="text-sm py-2 px-2  text-red-500">&nbsp;</div>
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
                    formik.setFieldValue("startDate", "", false);

                    if (!formik.values.isNotExpired) {
                      formik.setFieldValue("expireDate", "", false);
                      formik.setFieldValue(
                        "expireDate",
                        "",
                        false
                      );
                    }

                  } else {
                    formik.handleChange({ target: { name: 'startDate', value: e } });
                    formik.setFieldValue(
                      "startDate",
                      moment(e).toDate(),
                      false
                    );
                    if (formik.values.expireDate != null) {
                      if (moment(e).toDate() >= formik.values.expireDate) {
                        formik.setFieldValue(
                          "expireDate",
                          moment(e).add('days', 1).toDate(),
                          false
                        );
                      }
                    }

                  }
                }}
                value={
                  !isClick.couponStart
                    ? formik.values.startDate == "" ? null : moment(new Date(formik.values.startDate), "DD/MM/YYYY")
                    : null
                }



              />
              <div className="text-sm py-2 px-2  text-red-500">&nbsp;</div>
            </div>

            <div className="relative w-full px-4">
              {formik.touched.startDate &&
                formik.errors.startDate ? (
                <div className="text-sm py-2 px-2  text-red-500">
                  {formik.errors.startDate}
                </div>
              ) : null}
            </div>

          </div>
          <div className={"w-full" + (width < 764 ? " block" : " hidden")}>
            &nbsp;
          </div>
          <div className="w-full lg:w-1/12 px-4 margin-auto-t-b ">
            <LabelUC label="วันที่หมดอายุ" isRequired={true} />
            <div className="text-sm py-2 px-2  text-red-500">&nbsp;</div>
          </div>
          <div className="w-full lg:w-5/12 px-4 margin-auto-t-b">
            <div className="relative">
              <DatePickerUC
                placeholder={
                  formik.values.isNotExpired ? "ไม่มีวันหมดอายุ" : "เลือกวันที่"
                }
                disabledValue={formik.values.isNotExpired ? true : false}
                disabled={formik.values.isNotExpired ? true : false}
                onClick={(e) => {
                  setIsClick({
                    ...isClick,
                    expireDate: formik.values.isNotExpired ? false : true,
                  });
                  //   setIsClick({ ...isClick, expireDate: true });
                }}
                onBlur={(e) => {
                  setIsClick({ ...isClick, expireDate: false });
                }}
                onChange={(e) => {
                  setIsClick({ ...isClick, expireDate: false });
                  if (e === null) {
                    formik.setFieldValue("expireDate", "", false);
                  } else {
                    formik.handleChange({ target: { name: 'expireDate', value: e } });
                    formik.setFieldValue(
                      "expireDate",
                      moment(e).toDate(),
                      false
                    );
                  }
                }}
                value={
                  !isClick.expireDate
                    ? formik.values.expireDate === "" ? null : moment(
                      new Date(
                        formik.values.expireDate
                          ? formik.values.expireDate
                          : new Date()
                      ),
                      "DD/MM/YYYY"
                    )
                    : null
                }
                disabledDate={(current) => {
                  if (formik.values.startDate != null) {
                    let day = formik.values.startDate
                    return current && current <= moment(new Date(day)).endOf('day');
                  }
                }}
              />
              <CheckBoxUC
                text="ไม่มีวันหมดอายุ"
                name="isNotExpired"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                checked={formik.values.isNotExpired}
                classLabel="mt-2"
              />
            </div>
            <div className="relative w-full px-4">
              {formik.touched.expireDate &&
                formik.errors.expireDate ? (
                <div className="text-sm py-2 px-2  text-red-500">
                  {formik.errors.expireDate}
                </div>
              ) : null}
            </div>
          </div>
          <div className="w-full">&nbsp;</div>
          <div className="w-full lg:w-1/12  margin-auto-t-b ">
            <LabelUC label="จำนวนคูปอง" isRequired={true} />
            {formik.touched.couponCount && formik.errors.couponCount ? (
              <div className="text-sm py-2 px-2  text-red-500">&nbsp;</div>
            ) : null}
          </div>
          <div className="w-full lg:w-5/12 px-4 margin-auto-t-b">
            <div className="relative">
              <InputUC
                name="couponCount"
                type="number"
                disabled={(formik.values.id !== "") ? true : false}
                maxLength={7}
                onBlur={formik.handleBlur}
                value={formik.values.couponCount}
                onChange={(e) => {
                  //   formik.handleChange(e);
                  setDelay(ValidateService.onHandleNumber(e));
                  formik.values.couponCount = ValidateService.onHandleNumberValue(e);
                }}
                min="0"
              />
              {formik.touched.couponCount && formik.errors.couponCount ? (
                <div className="text-sm py-2 px-2  text-red-500">
                  {formik.errors.couponCount}
                </div>
              ) : null}
            </div>
          </div>
          <div className={"w-full" + (width < 764 ? " block" : " hidden")}>
            &nbsp;
          </div>
          <div className="w-full lg:w-1/12 px-4 margin-auto-t-b ">
            <LabelUC label="จำนวนที่ใช้แลกต่อวัน" isRequired={false} />
            {formik.touched.couponCount && formik.errors.couponCount ? (
              <div className="text-sm py-2 px-2  text-red-500">&nbsp;</div>
            ) : null}
          </div>
          <div className="w-full lg:w-5/12 px-4 margin-auto-t-b">
            <div className="relative">
              <InputUC
                name="usedPerDayCount"
                type="number"
                maxLength={7}
                onBlur={formik.handleBlur}
                value={formik.values.usedPerDayCount}
                onChange={(e) => {
                  setDelay(ValidateService.onHandleNumber(e));
                  formik.values.usedPerDayCount =
                    ValidateService.onHandleNumberValue(e);
                }}
                min="0"
              />
              {formik.touched.couponCount && formik.errors.couponCount ? (
                <div className="text-sm py-2 px-2  text-red-500">&nbsp;</div>
              ) : null}
            </div>
          </div>

          <div className="w-full">&nbsp;</div>
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
          <div className="w-full lg:w-1/12 margin-auto-t-b "></div>
          <div className="w-full lg:w-11/12 px-4 margin-auto-t-b">
            <CheckBoxUC
              text="ยกเลิกคูปอง"
              name="isCancel"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              checked={formik.values.isCancel}
              classLabel="mt-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default StandardCoupon;
