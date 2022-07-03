import LabelUC from 'components/LabelUC';
import React, { useEffect, useState } from 'react'
import axios from "services/axios";
import moment from 'moment';
import SelectUC from "components/SelectUC";
import ValidateService from "services/validateValue";
const Payment = ({ props, setOrderHD }) => {
    const { orderHD, orderDT } = props;
    const [payment, setPayment] = useState(null);


    const options = [
        { value: 1, label: 'รอชำระเงิน' },
        { value: 2, label: 'รอตรวจสอบ' },
        { value: 3, label: 'ชำระเงินแล้ว' },
    ];

    const getStatus = (value) => {
        if (value == 3)
            return { text: 'ชำระเงินแล้ว', bg: ' bg-lightBlue-200 ' };
        else if (value === 1)
            return { text: 'รอชำระเงิน', bg: ' bg-yellow-200 ' };
        else
            return { text: 'รอตรวจสอบ', bg: ' bg-yellow-200 ' };
    }

    useEffect(async () => {
        const response = await axios.get(`/payment/byId/${orderHD.paymentId}`);
        if (response.data.status) {
            setPayment(response.data.tbPayment);

        }
    }, []);

    return (
        <div className='mt-2 px-4'>
            <div className="w-full">
                <div className='flex justify-between'>
                    <div className='py-2 margin-auto-t-b lg:w-7/12'>
                        <LabelUC label={payment && payment.bankName} />
                        <div className='text-blueGray-400 text-sm mt-1' >{payment && payment.accountNumber}</div>
                        <div className='text-blueGray-400 text-sm mt-1' >{orderHD && orderHD.memberName}</div>
                        <div className='text-blueGray-400 text-sm mt-1' >
                            {orderHD && moment(orderHD.orderDate).format("DD/MM/YYYY HH:mm:ss") + ' น.'}
                        </div>

                    </div>
                    <div>
                        <div className={'p-2 rounded '}>
                            <SelectUC
                                name="transportType"
                                onChange={(value) => {

                                    setOrderHD(p => { return { ...p, paymentStatus: value.value } })
                                }}
                                options={options}
                                value={ValidateService.defaultValue(
                                    options,
                                    orderHD.paymentStatus
                                )}
                                // isDisabled={!isCanEdit}
                                // bgColor={getStatus(orderHD.paymentStatus).bg}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Payment