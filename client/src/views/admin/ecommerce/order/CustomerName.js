import LabelUC from 'components/LabelUC';
import React from 'react'

const CustomerName = ({ orderHD }) => {
    console.log(orderHD)
    return (
        <div className='mt-2 px-4'>
            <div className="w-full">
                <LabelUC label={orderHD.memberName} />
                <div className='text-blueGray-400 text-sm mt-1' >{orderHD.phone}</div>
            </div>
        </div>
    )
}

export default CustomerName