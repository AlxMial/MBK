import LabelUC from 'components/LabelUC'
import React from 'react'
import '../index.scss'

const ExportHeader = ({ dataExport }) => {

    return (
        <>
            <div className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xl text-green-mbk font-bold whitespace-nowrap p-4">
                <label>รายการสั่งซื้อ /Export คำสั่งซื้อ</label>
            </div>
            <div className="mt-4 image-header-export bg-green-mbk flex justify-center">
                <img src="/static/media/side_mbk.52180e2c.png" alt="..." />
            </div>
            <div className="image-header-export flex justify-center border-b">
                <div className="text-lg text-header font-bold">ใบเสร็จรับเงิน</div>
            </div>
            <div className="py-4 px-4 ">
                <LabelUC label={dataExport && dataExport.name} />
            </div>
            <div className='py-4 margin-auto-t-b w-full flex justify-between px-4 '>
                <div className=' text-sm mt-1 lg:w-6/12' >
                    {dataExport && dataExport.address}
                </div>
                <div className=' text-sm mt-1 lg:w-6/12 text-right' >
                    <span className=' font-bold'> เลขที่ใบสั่งซื้อ : </span>{dataExport && dataExport.orderNumber}
                </div>
            </div>
            <div className="flex border-b py-4 ">
                <div className='margin-auto-t-b w-full lg:w-5/12 flex flex-col px-4 '>
                    <div className=' text-sm mt-1 w-full font-bold' >
                        อีเมล :
                    </div>
                    <div className=' text-sm mt-1 w-full  lg:w-4/12' >
                        {dataExport && dataExport.email}
                    </div>
                </div>
                <div className='margin-auto-t-b w-full flex lg:w-5/12 flex-col px-4 '>
                    <div className=' text-sm mt-1 w-full font-bold' >
                        เบอร์โทร :
                    </div>
                    <div className=' text-sm mt-1 w-full' >
                        {dataExport && dataExport.phone}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ExportHeader