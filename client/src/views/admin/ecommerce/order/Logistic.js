import LabelUC from 'components/LabelUC';
import React, { useEffect, useState } from 'react'
import SelectUC from "components/SelectUC";
import ValidateService from "services/validateValue";
import * as Address from "services/GetAddress.js";
import InputUC from 'components/InputUC';
import CheckBoxUC from "components/CheckBoxUC";
import TextAreaUC from 'components/InputUC/TextAreaUC';

const Logistic = ({ props, setOrderHD, cancelStatus, setcancelStatus }) => {
    const { orderHD, orderHDold, orderDT, memberData,
        isChangeOrderNumber, isCanEdit,
        setIsChangeOrderNumber, orderNumber,
        setOrderNumber, isCancel, setIsCancel
        , transportStatus, setTransportStatus
        , cancelReason, setCancelReason, } = props;
    // const [transportStatus, setTransportStatus] = useState(orderHD.transportStatus);
    const [address, setAddress] = useState(orderHD.address);
    const [province, setProvince] = useState();
    const [isChange, setIsChange] = useState(false);
    const [delay, setDalay] = useState("");
    const [isChangeTrackNo, setisChangeTrackNo] = useState(false);


    const getStatus = (value) => {
        if (value && value === 'done')
            return { text: 'ส่งแล้ว', bg: ' rgba(188, 240, 218, 1) ' };
        else if (value && value === 'inTransit')
            return { text: 'กำลังส่ง', bg: ' rgba(252, 217, 189,1) ' };
        else if (value && value === 'prepare')
            return { text: 'เตรียมส่ง', bg: ' rgba(102, 205 ,255,1) ' };
        else
            return { text: '', bg: ' rgba(102, 205 ,255,1) ' };
    }

    const logisticTypeList = [
        { label: "Kerry Express", value: 'kerry' },
        // { label: "Flash Express", value: 'flash' },
        { label: "ไปรษณีย์ไทย", value: 'post' },
    ];

    // const options = [
    //     { value: 1, label: 'เตรียมส่ง' },
    //     { value: 2, label: 'กำลังส่ง' },
    //     { value: 3, label: 'ส่งแล้ว' },
    // ];

    const getoption = () => {
        if (orderHDold.transportStatus == 1) {
            return [
                { value: 1, label: 'เตรียมส่ง' },
                { value: 2, label: 'กำลังส่ง' },
                { value: 3, label: 'ส่งแล้ว' },
            ]
        } else if (orderHDold.transportStatus == 2) {
            return [
                { value: 1, label: 'เตรียมส่ง', isDisabled: true },
                { value: 2, label: 'กำลังส่ง' },
                { value: 3, label: 'ส่งแล้ว' },
            ]
        } else {
            return [
                { value: 1, label: 'เตรียมส่ง', isDisabled: true },
                { value: 2, label: 'กำลังส่ง', isDisabled: true },
                { value: 3, label: 'ส่งแล้ว' },
            ]
        }

    }

    useEffect(async () => {
        const subDistrict = await Address.getAddressName("subDistrict", memberData.subDistrict);
        const district = await Address.getAddressName("district", memberData.district);
        const _province = await Address.getAddressName("province", memberData.province);

        setAddress((subDistrict ? ('ตำบล/แขวง ' + subDistrict) : '')
            + ' ' + (district ? ('อำเภอ/เขต ' + district) : ''));
        setProvince(_province ? ((_province !== 'กรุงเทพมหานคร' ? 'จังหวัด ' : '') + _province) : '');
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
        <div className='mt-2 px-4'>
            <div className="w-full">
                <div className='flex justify-between'>
                    <div className='py-2 margin-auto-t-b '>
                        <LabelUC label={logisticTypeList.filter(e => e.value === orderHD.logisticType)[0]?.label} />
                    </div>
                    <div className={'p-2 rounded '}>
                        {/* <div>{getStatus(orderHD).text}</div> */}
                        <SelectUC
                            name="transportType"
                            onChange={(value) => {
                                // setTransportStatus(value.value);
                                setOrderHD(p => { return { ...p, transportStatus: value.value } })
                            }}
                            options={getoption()}
                            value={ValidateService.defaultValue(
                                getoption(),
                                orderHD.transportStatus
                            )}
                            // isDisabled={orderHD.paymentStatus != 3 && !isCanEdit}
                            isDisabled={!isCanEdit ? true : orderHD.paymentStatus != 3 ? true : false}
                        // bgColor={getStatus(transportStatus).bg}
                        />
                    </div>
                </div>
                <div className='py-2 margin-auto-t-b w-full'>
                    <LabelUC label={orderHD.memberName} />
                    <div className='text-blueGray-400 text-sm mt-1' >
                        {memberData && memberData.address + ' ' + address}
                    </div>
                    <div className='text-blueGray-400 text-sm mt-1' >
                        {province + ' ' + memberData.postcode}
                    </div>
                    <div className='text-blueGray-400 text-sm mt-1' >
                        {memberData && memberData.country}
                    </div>
                    <div className='text-blueGray-400 text-sm mt-1' >
                        {memberData && memberData.email}
                    </div>
                </div>
                <div className='py-2 margin-auto-t-b w-full'>
                    <LabelUC label={'น้ำหนัก ' + ((orderHD.sumWeight === undefined) ? 0 : orderHD.sumWeight) + ' กิโลกรัม'} />
                </div>
                <div className='py-2 margin-auto-t-b w-full flex'>
                    <label className='text-blueGray-600 text-sm font-bold  margin-auto-t-b' >หมายเลขพัสดุ</label>
                    {!isChangeTrackNo ? (
                        <>
                            <label className='text-blueGray-600 text-sm ml-2 mr-2' >{orderHD.trackNo}</label>
                            {isCanEdit && orderHD.transportStatus > 1 && <i className="fas fa-pen cursor-pointer" onClick={() => setisChangeTrackNo(true)}></i>}
                            {/* <i className="fas fa-pen cursor-pointer" onClick={() => setisChangeTrackNo(true)}></i> */}
                        </>
                    ) : (
                        <div className='flex flex-col'>
                            <div className='w-full pl-4'>
                                <InputUC
                                    name='orderNumber'
                                    maxLength={50}
                                    value={orderHD.trackNo}
                                    moreClassName='lg:w-10/12'
                                    onChange={(e) => {

                                        setOrderHD(p => { return { ...p, trackNo: e.target.value } })
                                    }} />
                                <i className="ml-2 fas fa-times cursor-pointer margin-auto-t-b" onClick={() => setisChangeTrackNo(false)}></i>
                            </div>
                            {isChangeOrderNumber && !orderNumber && (
                                <div className='w-full pl-4'>
                                    <div className="text-sm py-2 px-2  text-red-500">
                                        * กรุณากรอกหมายเลขพัสดุ
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div className='py-2 margin-auto-t-b w-full flex'>
                    <CheckBoxUC
                        text="ยกเลิกคำสั่งซื้อ"
                        name="isCancel"
                        classLabel="mt-2"
                        classSpan='text-cancel'
                        onChange={(e) => {
                            setIsCancel(e.target.checked);
                            if (orderHD.tbCancelOrder === undefined) {
                                orderHD.tbCancelOrder = { cancelDetail: OpenmodelCancel[0].value }
                                setOrderHD(orderHD);

                            }
                            console.log(e.target.checked)
                            setOrderHD(p => { return { ...p, isCancel: e.target.checked } })
                        }}
                        disabled={!isCanEdit ? true : (orderHD.paymentStatus === 3)}
                        checked={isCancel}
                    />
                </div>
                {/* {orderHD.isCancel && ( */}
                <>

                    <div className={'p-2 rounded '}>
                        <SelectUC
                            name="cancelDetail"
                            onChange={(value) => {

                                if (orderHD.tbCancelOrder == null) {
                                    orderHD.tbCancelOrder = { cancelDetail: value.value }
                                } else {
                                    orderHD.tbCancelOrder.cancelDetail = value.value
                                }
                                setDalay(orderHD.tbCancelOrder.cancelDetail);
                                setOrderHD(orderHD)
                            }}
                            options={OpenmodelCancel}
                            value={ValidateService.defaultValue(
                                OpenmodelCancel,
                                orderHD.tbCancelOrder == null ? null : delay
                            )}
                            isDisabled={!isCanEdit ? true : (orderHD.paymentStatus === 3) ? true : !isCancel ? true : false}
                        // bgColor={getStatus(transportStatus).bg}
                        />
                    </div>
                    <div className='py-2 margin-auto-t-b '>
                        <LabelUC label={'สาเหตุที่ยกเลิก'} />
                    </div>
                    <div className='py-2 margin-auto-t-b w-full flex mt-2'>
                        <TextAreaUC
                            name='cancelReason'
                            value={orderHD.tbCancelOrder == null ? "" : orderHD.tbCancelOrder.cancelOtherRemark}
                            rows={3}
                            maxLength={255}
                            disabled={!isCanEdit ? true : (orderHD.paymentStatus === 3) ? true : !isCancel ? true : false}
                            onChange={(e) => {
                                setCancelReason(e.target.value);
                                if (orderHD.tbCancelOrder == null) {
                                    orderHD.tbCancelOrder = { cancelOtherRemark: e.target.value }
                                } else {
                                    orderHD.tbCancelOrder.cancelOtherRemark = e.target.value
                                }
                                setOrderHD(orderHD)

                            }} />
                    </div>
                    <div className='py-2 margin-auto-t-b w-full flex'>
                        <CheckBoxUC
                            text="คืนเงิน"
                            name="isCancel"
                            classLabel="mt-2 text-green-mbk"
                            // classSpan='text-cancel'
                            onChange={(e) => {
                                // setIsCancel(e.target.checked);
                                console.log(orderHD.tbCancelOrder)
                                if (orderHD.tbCancelOrder === undefined) {
                                    orderHD.tbCancelOrder = { cancelStatus: e.target.checked }
                                    console.log(orderHD.tbCancelOrder.cancelStatus)
                                } else {
                                    orderHD.tbCancelOrder.cancelStatus = e.target.checked
                                }
                                setOrderHD(orderHD);
                                setcancelStatus(e.target.checked)

                            }}
                            disabled={!isCanEdit ? true : (orderHD.paymentStatus === 3) ? true : !isCancel ? true : false}
                            checked={cancelStatus}
                        />
                    </div>

                    {!cancelReason && (
                        <div className='py-2 margin-auto-t-b w-full flex'>
                            <div className='w-full'>
                                <div className="text-sm py-2 px-2  text-red-500">
                                    * กรุณากรอกสาเหตุที่ยกเลิกคำสั่งซื้อ
                                </div>
                            </div>
                        </div>
                    )}
                </>
                {/* )} */}
            </div>
        </div >
    )
}

export default Logistic