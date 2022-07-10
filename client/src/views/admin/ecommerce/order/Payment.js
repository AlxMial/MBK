import LabelUC from 'components/LabelUC';
import React, { useEffect, useState } from 'react'
import axios from "services/axios";
import moment from 'moment';
import SelectUC from "components/SelectUC";
import ValidateService from "services/validateValue";
const Payment = ({ props, setOrderHD }) => {
    const { orderHD, orderHDold, orderDT, isCanEdit, paymentStatus, setpaymentStatus, setTransportStatus } = props;
    const [payment, setPayment] = useState(null);

    const getoption = () => {
        if (orderHDold.paymentStatus == 1) {
            return [
                { value: 1, label: 'รอชำระเงิน' },
                { value: 2, label: 'รอตรวจสอบ' },
                { value: 3, label: 'ชำระเงินแล้ว' },
            ]
        } else if (orderHDold.paymentStatus == 2) {
            return [
                { value: 1, label: 'รอชำระเงิน', isDisabled: true },
                { value: 2, label: 'รอตรวจสอบ' },
                { value: 3, label: 'ชำระเงินแล้ว' },
            ]
        } else {
            return [
                { value: 1, label: 'รอชำระเงิน', isDisabled: true },
                { value: 2, label: 'รอตรวจสอบ', isDisabled: true },
                { value: 3, label: 'ชำระเงินแล้ว' },
            ]
        }

    }
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
                        <LabelUC label={orderHD && (orderHD.paymentType == 2 ? "ผ่านบัตรเครดิต" : "" )} />
                        {/* <div className='text-blueGray-400 text-sm mt-1 font-bold' >{orderHD && (orderHD.paymentType == 2 ? "ผ่านบัตรเครดิต" : "" )}</div> */}
                        <div className='text-blueGray-400 text-sm mt-1' >{orderHD && (orderHD.paymentType == 2 ? "หมายเลข " + (orderHD.creditCard == null ? "" : orderHD.creditCard) : "" )}</div>
                        <div className='text-blueGray-400 text-sm mt-1' >{payment && payment.accountName}</div>
                        <div className='text-blueGray-400 text-sm mt-1' >{orderHD && orderHD.paymentType == 1  ? "เลขบัญชี " : ""}{payment && payment.accountNumber}</div>
                        {/* <div className='text-blueGray-400 text-sm mt-1' >{orderHD && orderHD.memberName}</div> */}
                        <div className='text-blueGray-400 text-sm mt-1' >
                            {orderHD && (orderHD.paymentDate) ?   'วันที่ชำระ ' +  moment(orderHD.paymentDate).format("DD/MM/YYYY HH:mm") + ' น.' : "ยังไม่ได้ชำระ"}
                        </div>
                    </div>
                    <div style={{ minWidth: "100px" }} >
                        <div className={'p-2 rounded '}>
                            <SelectUC
                                name="transportType"
                                onChange={(value) => {

                                    setpaymentStatus(value.value)
                                    if (value.value != 3) {
                                        setTransportStatus(1)
                                    }
                                }}
                                options={getoption()}
                                value={ValidateService.defaultValue(
                                    getoption(),
                                    paymentStatus
                                )}
                                isOptionDisabled={(option) => option.disabled}
                                isDisabled={orderHD && (orderHD.paymentDate == null) ? true :  !isCanEdit}
                            // customStyles={getCss( orderHD.paymentStatus)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Payment