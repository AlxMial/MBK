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

const StandardCoupon = ({ formik }) => {
  const { width } = useWindowDimensions();
  const [isCancel, setIsCancel] = useState(false);
  const [delay, setDelay] = useState();
  const [isClick, setIsClick] = useState({
    couponStart: false,
    couponEnd: false,
    expireDate: false,
  });

  const handleChangeImage = async (e) => {
    const image = document.getElementById("eCouponImage");
    image.src = URL.createObjectURL(e.target.files[0]);
    const base64 = await FilesService.convertToBase64(e.target.files[0]);
    formik.setFieldValue("pictureCoupon", base64);
  };

  useEffect(() => {
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
          <div className="w-full lg:w-1/12 margin-auto-t-b ">
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
                    formik.setFieldValue("startDate", new Date(), false);
                  } else {
                    formik.setFieldValue(
                      "startDate",
                      moment(e).toDate(),
                      false
                    );
                  }
                }}
                value={
                  !isClick.couponStart
                    ? moment(new Date(formik.values.startDate), "DD/MM/YYYY")
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
                    formik.setFieldValue("endDate", new Date(), false);
                  } else {
                    formik.setFieldValue("endDate", moment(e).toDate(), false);
                  }
                }}
                value={
                  !isClick.couponEnd
                    ? moment(new Date(formik.values.endDate), "DD/MM/YYYY")
                    : null
                }
              />
            </div>
          </div>
          <div className="w-full">&nbsp;</div>
          <div className="w-full lg:w-1/12 margin-auto-t-b ">
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
                    formik.setFieldValue("expiredDate", new Date(), false);
                  } else {
                    formik.setFieldValue(
                      "expiredDate",
                      moment(e).toDate(),
                      false
                    );
                  }
                }}
                value={
                  !isClick.expireDate
                    ? moment(
                        new Date(
                          formik.values.expiredDate
                            ? formik.values.expiredDate
                            : new Date()
                        ),
                        "DD/MM/YYYY"
                      )
                    : null
                }
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
          </div>
          <div className={"w-full" + (width < 764 ? " block" : " hidden")}>
            &nbsp;
          </div>
          <div className="w-full lg:w-1/12 margin-auto-t-b "></div>
          <div className="w-full lg:w-5/12 px-4 margin-auto-t-b">
            <div className="relative"></div>
          </div>
          <div className="w-full">&nbsp;</div>
          <div className="w-full lg:w-1/12 margin-auto-t-b ">
            <LabelUC label="จำนวนคูปอง" isRequired={true} />
            {formik.touched.couponCount && formik.errors.couponCount ? (
              <div className="text-sm py-2 px-2  text-red-500">&nbsp;</div>
            ) : null}
          </div>
          <div className="w-full lg:w-5/12 px-4 margin-auto-t-b">
            <div className="relative">
              <InputUC
                name="couponCount"
                type="text"
                maxLength={7}
                onBlur={formik.handleBlur}
                value={formik.values.couponCount}
                onChange={(e) => {
                  //   formik.handleChange(e);
                  setDelay(ValidateService.onHandleNumber(e));
                  formik.values.couponCount = ValidateService.onHandleNumber(e);
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
          <div className="w-full lg:w-1/12 margin-auto-t-b "></div>
          <div className="w-full lg:w-5/12 px-4 margin-auto-t-b">
            <div className="relative"></div>
          </div>
          <div className="w-full">&nbsp;</div>
          <div className="w-full lg:w-1/12 margin-auto-t-b ">
            <LabelUC label="จำนวนที่ใช้แลกต่อวัน" isRequired={false} />
          </div>
          <div className="w-full lg:w-5/12 px-4 margin-auto-t-b">
            <div className="relative">
              <InputUC
                name="usedPerDayCount"
                type="text"
                maxLength={7}
                onBlur={formik.handleBlur}
                value={formik.values.usedPerDayCount}
                onChange={(e) => {
                //   formik.handleChange(e);
                  setDelay(ValidateService.onHandleNumber(e));
                  formik.values.usedPerDayCount = ValidateService.onHandleNumber(e);
                }}
                min="0"
              />
            </div>
          </div>
          <div className={"w-full" + (width < 764 ? " block" : " hidden")}>
            &nbsp;
          </div>
          <div className="w-full lg:w-1/12 margin-auto-t-b "></div>
          <div className="w-full lg:w-5/12 px-4 margin-auto-t-b">
            <div className="relative"></div>
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
          <div className="w-full">&nbsp;</div>
          <div className="w-full lg:w-1/12 margin-auto-t-b ">
            <CheckBoxUC
              text="ยกเลิก / เรียกคืน"
              name="isCancelReclaim"
              onChange={(e) => {
                setIsCancel(e.target.checked);
                formik.setFieldValue("isCancelReclaim", e.target.checked);
              }}
              onBlur={formik.handleBlur}
              checked={formik.values.isCancelReclaim}
            />
          </div>
          <div className="w-full lg:w-11/12 px-4 margin-auto-t-b">
            <div
              className={
                "relative border rounded px-2 py-2 " +
                (!isCancel ? " disabled" : " ")
              }
            >
              <Radio.Group
                disabled={!isCancel}
                onChange={(e) => {
                  formik.setFieldValue(
                    "isCancel",
                    e.target.value === "1" ? true : false
                  );
                  formik.setFieldValue(
                    "isReclaim",
                    e.target.value === "2" ? true : false
                  );
                }}
                onBlur={formik.handleBlur}
                value={
                  !formik.values.isCancelReclaim
                    ? 3
                    : formik.values.isReclaim
                    ? 2
                    : 1
                }
              >
                <Space direction="vertical">
                  <Radio value={1}>ยกเลิกคูปอง</Radio>
                  <Radio value={2}>
                    เรียกคืนคูปอง (เฉพาะที่ถูกนำไปใช้งานแล้วเท่านั้น)
                  </Radio>
                </Space>
              </Radio.Group>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default StandardCoupon;
