import LabelUC from 'components/LabelUC';
import React, { useEffect, useState } from 'react'
import axios from "services/axios";
import moment from 'moment';

const Payment = ({ props }) => {
    const { orderHD, orderDT } = props;
    const [payment, setPayment] = useState(null);
    const getStatus = (value) => {
        if (value.paymentStatus && value.paymentStatus === 'done')
            return { text: 'ชำระเงินแล้ว', bg: ' bg-lightBlue-200 ' };
        else if (value.paymentStatus && value.paymentStatus === 'wait')
            return { text: 'รอชำระเงิน', bg: ' bg-yellow-200 ' };
        else
            return { text: 'รอชำระเงิน', bg: ' bg-yellow-200 ' };
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
                    <div className='py-2 margin-auto-t-b lg:w-8/12'>
                        <LabelUC label={payment && payment.bankName} />
                        <div className='text-blueGray-400 text-sm mt-1' >{payment && payment.accountNumber}</div>
                        <div className='text-blueGray-400 text-sm mt-1' >{orderHD && orderHD.memberName}</div>
                        <div className='text-blueGray-400 text-sm mt-1' >
                            {orderHD && moment(orderHD.orderDate).format("DD/MM/YYYY HH:mm:ss") + ' น.'}
                        </div>

                    </div>
                    <div>
                        <div className={'p-2 rounded ' + getStatus(orderHD).bg}>
                            <div>{getStatus(orderHD).text}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Payment