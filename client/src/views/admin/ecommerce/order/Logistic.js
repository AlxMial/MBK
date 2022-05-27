import LabelUC from 'components/LabelUC';
import React, { useEffect, useState } from 'react'
import SelectUC from "components/SelectUC";
import ValidateService from "services/validateValue";
import * as Address from "services/GetAddress.js";
import InputUC from 'components/InputUC';
import CheckBoxUC from "components/CheckBoxUC";
import TextAreaUC from 'components/InputUC/TextAreaUC';

const Logistic = ({ props }) => {
    const { orderHD, orderDT, memberData,
        isChangeOrderNumber, isCanEdit,
        setIsChangeOrderNumber, orderNumber,
        setOrderNumber, isCancel, setIsCancel
        , transportStatus, setTransportStatus
        , cancelReason, setCancelReason } = props;
    // const [transportStatus, setTransportStatus] = useState(orderHD.transportStatus);
    const [address, setAddress] = useState(orderHD.address);
    const [province, setProvince] = useState();
    const [isChange, setIsChange] = useState(false);

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

    const options = [
        { value: 'prepare', label: 'เตรียมส่ง' },
        { value: 'inTransit', label: 'กำลังส่ง' },
        { value: 'done', label: 'ส่งแล้ว' },
    ];

    useEffect(async () => {
        const subDistrict = await Address.getAddressName("subDistrict", "100101");
        const district = await Address.getAddressName("district", memberData.district);
        const _province = await Address.getAddressName("province", memberData.province);

        setAddress((subDistrict ? ('ตำบล/แขวง ' + subDistrict) : '')
            + ' ' + (district ? ('อำเภอ/เขต ' + district) : ''));
        setProvince(_province ? ('จังหวัด ' + _province) : '');
    }, [address, memberData]);

    const handleChangeOrderNumber = (value) => {
        setIsChange(value);
        setIsChangeOrderNumber(value);
    }

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
                                setTransportStatus(value.value);
                            }}
                            options={options}
                            value={ValidateService.defaultValue(
                                options,
                                transportStatus
                            )}
                            isDisabled={!isCanEdit}
                            bgColor={getStatus(transportStatus).bg}
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
                    <LabelUC label={'น้ำหนัก ' + orderHD.sumWeight + ' กิโลกรัม'} />
                </div>
                <div className='py-2 margin-auto-t-b w-full flex'>
                    <label className='text-blueGray-600 text-sm font-bold  margin-auto-t-b' >หมายเลขพัสดุ</label>
                    {!isChange ? (
                        <>
                            <label className='text-blueGray-600 text-sm ml-2 mr-2' >{orderHD.orderNumber}</label>
                            {isCanEdit && <i className="fas fa-pen cursor-pointer" onClick={() => handleChangeOrderNumber(true)}></i>}
                        </>
                    ) : (
                        <div className='flex flex-col'>
                            <div className='w-full pl-4'>
                                <InputUC
                                    name='orderNumber'
                                    maxLength={50}
                                    value={orderNumber}
                                    moreClassName='lg:w-10/12'
                                    onChange={(e) => {
                                        setOrderNumber(e.target.value);
                                    }} />
                                <i className="ml-2 fas fa-times cursor-pointer margin-auto-t-b" onClick={() => handleChangeOrderNumber(false)}></i>
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
                        }}
                        disabled={!isCanEdit}
                        checked={isCancel}
                    />
                </div>
                {isCancel && (
                    <>
                        <LabelUC label={'สาเหตุที่ยกเลิก'} isRequired={true} />
                        <div className='py-2 margin-auto-t-b w-full flex mt-2'>
                            <TextAreaUC
                                name='cancelReason'
                                value={cancelReason}
                                rows={3}
                                maxLength={255}
                                disabled={!isCanEdit}
                                onChange={(e) => {
                                    setCancelReason(e.target.value);
                                }} />
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
                )}
            </div>
        </div >
    )
}

export default Logistic