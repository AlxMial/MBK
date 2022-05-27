import LabelUC from 'components/LabelUC';
import React, { useEffect, useState } from 'react'
import SelectUC from "components/SelectUC";
import ValidateService from "services/validateValue";
import * as Address from "services/GetAddress.js";

const Logistic = ({ props }) => {
    const { orderHD, orderDT, memberData } = props;
    const [transportStatus, setTransportStatus] = useState(orderHD.transportStatus);
    const [address, setAddress] = useState(orderHD.address);
    const [province, setProvince] = useState();

    const getStatus = (value) => {
        if (value && value === 'done')
            return { text: 'ส่งแล้ว', bg: ' rgba(188, 240, 218, 1) ' };
        else if (value && value === 'inTransit')
            return { text: 'กำลังส่ง', bg: ' rgba(252, 217, 189,1) ' };
        else if (value && value === 'prepare')
            return { text: 'เตรียมส่ง', bg: ' rgba(125, 211, 252,1) ' };
        else
            return { text: '', bg: ' rgba(125, 211, 252,1) ' };
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
        console.log('memberData', memberData);
        const subDistrict = await Address.getAddressName("subDistrict", "100101");
        const district = await Address.getAddressName("district", memberData.district);
        const _province = await Address.getAddressName("province", memberData.province);

        setAddress((subDistrict ? ('ตำบล/แขวง ' + subDistrict) : '')
            + ' ' + (district ? ('อำเภอ/เขต ' + district) : ''));
        setProvince(_province ? ('จังหวัด ' + _province) : '');
    }, [address, memberData]);

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
            </div>
        </div>
    )
}

export default Logistic