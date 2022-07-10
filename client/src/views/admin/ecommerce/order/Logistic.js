import LabelUC from "components/LabelUC";
import React, { useEffect, useState } from "react";
import SelectUC from "components/SelectUC";
import ValidateService from "services/validateValue";
import * as Address from "services/GetAddress.js";
import InputUC from "components/InputUC";
import CheckBoxUC from "components/CheckBoxUC";
import TextAreaUC from "components/InputUC/TextAreaUC";
import { EncodeKey, DecodeKey } from "@services/default.service";
import { Radio } from "antd";

const Logistic = ({
  props,
  setOrderHD,
  cancelStatus,
  setcancelStatus,
  settbCancelOrder,
  tbCancelOrder,
}) => {
  const {
    orderHD,
    orderHDold,
    orderDT,
    memberData,
    isChangeOrderNumber,
    isCanEdit,
    setIsChangeOrderNumber,
    orderNumber,
    setOrderNumber,
    isCancel,
    setIsCancel,
    transportStatus,
    setTransportStatus,
    cancelReason,
    setCancelReason,
    paymentStatus,
  } = props;
  // const [transportStatus, setTransportStatus] = useState(orderHD.transportStatus);
  const [address, setAddress] = useState(orderHD.address);
  const [province, setProvince] = useState();
  const [isChange, setIsChange] = useState(false);
  const [delay, setDalay] = useState("");
  const [isChangeTrackNo, setisChangeTrackNo] = useState(false);
  const optionsPayment = [
    { label: "ไม่คืนเงิน", value: "3" },
    { label: "คืนเงิน", value: "2" },
  ];
  const logisticTypeList = [
    { label: "Kerry Express", value: "kerry" },
    // { label: "Flash Express", value: 'flash' },
    { label: "ไปรษณีย์ไทย", value: "post" },
  ];

  const getoption = () => {
    if (orderHDold.transportStatus == 1) {
      return [
        { value: 1, label: "เตรียมส่ง" },
        { value: 2, label: "กำลังส่ง" },
        { value: 3, label: "ส่งแล้ว" },
      ];
    } else if (orderHDold.transportStatus == 2) {
      return [
        { value: 1, label: "เตรียมส่ง", isDisabled: true },
        { value: 2, label: "กำลังส่ง" },
        { value: 3, label: "ส่งแล้ว" },
      ];
    } else {
      return [
        { value: 1, label: "เตรียมส่ง", isDisabled: true },
        { value: 2, label: "กำลังส่ง", isDisabled: true },
        { value: 3, label: "ส่งแล้ว" },
      ];
    }
  };
  const getCss = (value) => {
    if (value && value == 1)
      return {
        control: (base, state) => ({
          ...base,
          background: "hsl(57deg 87% 91%)",
        }),
      };
    else if (value && value == 2)
      return {
        control: (base, state) => ({
          ...base,
          background: "hsl(148deg 48% 83%)",
        }),
      };
    else
      return {
        control: (base, state) => ({
          ...base,
          background: "hsl(1deg 82% 87%)",
        }),
      };
  };
  useEffect(async () => {
    const subDistrict = await Address.getAddressName(
      "subDistrict",
      memberData.subDistrict
    );
    const district = await Address.getAddressName(
      "district",
      memberData.district
    );
    const _province = await Address.getAddressName(
      "province",
      memberData.province
    );

    setAddress(
      (subDistrict ? "ตำบล/แขวง " + subDistrict : "") +
        " " +
        (district ? "อำเภอ/เขต " + district : "")
    );
    setProvince(
      _province
        ? (_province !== "กรุงเทพมหานคร" ? "จังหวัด " : "") + _province
        : ""
    );
  }, [address, memberData]);

  // const handleChangeOrderNumber = (value) => {
  //     setIsChange(value);
  //     setIsChangeOrderNumber(value);
  // }
  const OpenmodelCancel = [
    {
      value: "ต้องการเปลี่ยนแปลงที่อยู่ในการจัดส่งสินค้า",
      label: "ต้องการเปลี่ยนแปลงที่อยู่ในการจัดส่งสินค้า",
    },
    {
      value: "ผู้ขายไม่ตอบสนองในการสอบถามข้อมูล",
      label: "ผู้ขายไม่ตอบสนองในการสอบถามข้อมูล",
    },
    { value: "สั่งสินค้าผิด", label: "สั่งสินค้าผิด" },
    { value: "เปลี่ยนใจ", label: "เปลี่ยนใจ" },
    { value: "อื่นๆ", label: "อื่นๆ" },
  ];

  return (
    <div className="mt-2 px-4">
      <div className="w-full">
        <div className="flex justify-between">
          <div className="py-2 margin-auto-t-b lg:w-7/12">
            <LabelUC label={orderHD.tbLogistic.deliveryName} />
          </div>
          <div style={{ minWidth: "100px" }}>
            <div className={"p-2 rounded "}>
              {/* <div>{getStatus(orderHD).text}</div> */}
              <SelectUC
                name="transportType"
                onChange={(value) => {
                  setTransportStatus(value.value);
                  if (value.value > 1) {
                    setIsCancel(false);
                    settbCancelOrder(null);
                  }
                }}
                options={getoption()}
                value={ValidateService.defaultValue(
                  getoption(),
                  transportStatus
                )}
                // isDisabled={orderHD.paymentStatus != 3 && !isCanEdit}
                isDisabled={
                  !isCanEdit ? true : paymentStatus != 3 ? true : false
                }
                // customStyles={getCss(orderHD.transportStatus)}
              />
            </div>
          </div>
        </div>
        <div className=" margin-auto-t-b w-full">
          <LabelUC label={orderHD.firstName + " " + orderHD.lastName} />
          <div className="text-blueGray-400 text-sm mt-1">
            {orderHD && orderHD.address + " "}
            {orderHD && orderHD.subDistrict + " "}
            {orderHD && orderHD.district + " "}
          </div>
          <div className="text-blueGray-400 text-sm mt-1">
            {orderHD && orderHD.province} {orderHD && orderHD.postcode + " "}{" "}
            {"โทร "} {orderHD && orderHD.phone + " "}
          </div>
          <div className="text-blueGray-400 text-sm mt-1">
            {orderHD && orderHD.email}
          </div>
        </div>
        <div className="py-2 margin-auto-t-b w-full">
          <LabelUC
            label={
              "น้ำหนัก " +
              (orderHD.sumWeight === undefined ? 0 : orderHD.sumWeight) +
              " กิโลกรัม"
            }
          />
        </div>
        <div className="py-2 margin-auto-t-b w-full flex">
          <label className="text-blueGray-600 text-sm font-bold  margin-auto-t-b">
            หมายเลขพัสดุ
          </label>
          {!isChangeTrackNo ? (
            <>
              <label className="text-blueGray-600 text-sm ml-2 mr-2">
                {orderHD.trackNo}
              </label>
              {isCanEdit && orderHD.transportStatus > 1 && (
                <i
                  className="fas fa-pen cursor-pointer"
                  onClick={() => setisChangeTrackNo(true)}
                ></i>
              )}
              {/* <i className="fas fa-pen cursor-pointer" onClick={() => setisChangeTrackNo(true)}></i> */}
            </>
          ) : (
            <div className="flex flex-col">
              <div className="w-full pl-4">
                <InputUC
                  name="orderNumber"
                  maxLength={50}
                  value={orderHD.trackNo}
                  moreClassName="lg:w-10/12"
                  onChange={(e) => {
                    setOrderHD((p) => {
                      return { ...p, trackNo: e.target.value };
                    });
                  }}
                />
                <i
                  className="ml-2 fas fa-times cursor-pointer margin-auto-t-b"
                  onClick={() => setisChangeTrackNo(false)}
                ></i>
              </div>
              {isChangeOrderNumber && !orderNumber && (
                <div className="w-full pl-4">
                  <div className="text-sm py-2 px-2  text-red-500">
                    * กรุณากรอกหมายเลขพัสดุ
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="py-2 margin-auto-t-b w-full flex">
          <CheckBoxUC
            text="ยกเลิกคำสั่งซื้อ"
            name="isCancel"
            classLabel="mt-2"
            classSpan="text-cancel"
            onChange={(e) => {
              setIsCancel(e.target.checked);
              if (tbCancelOrder === undefined) {
                let tbCancelOrder = {
                  cancelDetail: OpenmodelCancel[0].value,
                };
                settbCancelOrder(tbCancelOrder);
              }
            }}
            disabled={
              !isCanEdit
                ? true
                : transportStatus > 1
                ? true
                : paymentStatus === 3
            }
            checked={isCancel}
          />
        </div>
        {/* {orderHD.isCancel && ( */}
        <>
          <div className={"py-2 pl-6 rounded "}>
            <SelectUC
              name="cancelDetail"
              onChange={(value) => {
                if (tbCancelOrder == null) {
                  tbCancelOrder = { cancelDetail: value.value };
                } else {
                  tbCancelOrder.cancelDetail = value.value;
                }
                setDalay(tbCancelOrder.cancelDetail);
                settbCancelOrder(tbCancelOrder);
              }}
              options={OpenmodelCancel}
              value={ValidateService.defaultValue(
                OpenmodelCancel,
                tbCancelOrder == null
                  ? null
                  : tbCancelOrder.cancelDetail == null
                  ? null
                  : delay
              )}
              isDisabled={
                !isCanEdit
                  ? true
                  : paymentStatus == 3
                  ? true
                  : !isCancel
                  ? true
                  : false
              }
              // bgColor={getStatus(transportStatus).bg}
            />
          </div>
          <div className="py-2 pl-6 margin-auto-t-b ">
            <LabelUC label={"สาเหตุที่ยกเลิก"} />
          </div>
          <div className="py-2 pl-6 margin-auto-t-b w-full flex mt-2">
            <TextAreaUC
              id="cancelOtherRemark"
              name="cancelOtherRemark"
              value={
                !isCancel
                  ? ""
                  : tbCancelOrder
                  ? tbCancelOrder.cancelOtherRemark
                  : ""
              }
              rows={3}
              maxLength={255}
              disabled={
                !isCanEdit
                  ? true
                  : orderHD.paymentStatus === 3
                  ? true
                  : !isCancel
                  ? true
                  : false
              }
              onChange={(e) => {
                if (tbCancelOrder == null) {
                  tbCancelOrder = { cancelOtherRemark: e.target.value };
                } else {
                  setDalay(e.target.value);
                  tbCancelOrder.cancelOtherRemark = e.target.value;
                }
                settbCancelOrder(tbCancelOrder);
              }}
            />
          </div>
          <div className="py-2 pl-6 margin-auto-t-b w-full flex">
            {cancelReason && (
              <div className=" margin-auto-t-b w-full flex">
                <div className="w-full">
                  <div className="text-sm py-2 px-2  text-red-500">
                    * กรุณากรอกสาเหตุที่ยกเลิกคำสั่งซื้อ
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="py-2 pl-6 margin-auto-t-b w-full flex">
            {/* <CheckBoxUC
              text="คืนเงิน"
              name="isCancel"
              classLabel="mt-2 text-green-mbk"
              // classSpan='text-cancel'
              onChange={(e) => {
                if (tbCancelOrder === null || tbCancelOrder === undefined) {
                  tbCancelOrder = { cancelStatus: e.target.checked };
                } else {
                  tbCancelOrder.cancelStatus = e.target.checked;
                }
                setDalay(tbCancelOrder.cancelStatus);
                settbCancelOrder(tbCancelOrder);
              }}
              disabled={
                !isCanEdit
                  ? true
                  : orderHD.paymentStatus === 3
                  ? true
                  : !isCancel
                  ? true
                  : false
              }
              checked={
                tbCancelOrder == null
                  ? false
                  : tbCancelOrder.cancelStatus == null
                  ? false
                  : tbCancelOrder.cancelStatus
              }
            /> */}

            <Radio.Group
              options={optionsPayment}
              onChange={(e) => {
                if (tbCancelOrder === null || tbCancelOrder === undefined) {
                  tbCancelOrder = { cancelStatus: e.target.value };
                } else {
                  tbCancelOrder.cancelStatus = e.target.value;
                }

                setDalay(tbCancelOrder.cancelStatus);
                settbCancelOrder(tbCancelOrder);
              }}
              disabled={isCancel && isCanEdit  ? false : true}
              value={
                !isCancel
                  ? ""
                  : tbCancelOrder == null
                  ? "3"
                  : tbCancelOrder.cancelStatus
              }
            />
          </div>
        </>
        {/* )} */}
      </div>
    </div>
  );
};

export default Logistic;
