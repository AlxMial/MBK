import LabelUC from 'components/LabelUC';
import React from 'react'
import './index.scss'

const PurchaseOrder = ({ props }) => {
    const { orderHD, orderDT, openExport } = props;
    const thClass = "px-2  py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-blueGray-500 ";
    const tdClass = "border-t-0 px-2 align-middle border-l-0 border-r-0 p-3 text-sm whitespace-normal";
    const tdSpan = "text-gray-mbk hover:text-gray-mbk ";
    const footerClass = "py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-blueGray-500 ";
    const footerSumPrice = "py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-green-mbk ";


    const sumPrice = orderDT.reduce((sum, item) => {
        return parseFloat(sum) + ((parseFloat(item.price) + parseFloat(item.discount)) * parseFloat(item.amount));
    }, 0);

    const sumDiscount = orderDT.reduce((sum, item) => {
        return parseFloat(sum) + parseFloat(item.discount);
    }, 0);

    return (
        <>
            <div className="w-full lg:w-12/12 pr-2 margin-auto-t-b ">
                <table className="items-center w-full ">
                    <thead>
                        <tr className={openExport ? 'border-b' : ''}>
                            <th className={thClass + ' text-center'} >
                                ลำดับที่
                            </th>
                            <th className={thClass + ' w-6/12'} >
                                สินค้า
                            </th>
                            <th className={thClass + ' text-right'} >
                                จำนวน
                            </th>
                            <th className={thClass + ' text-right'} >
                                ราคาต่อหน่วย
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderDT
                            .map(function (value, key) {
                                return (
                                    <tr key={key} >
                                        <td className={tdClass + ' text-center'}>
                                            <span className="px-4 margin-a">
                                                {key + 1}
                                            </span>
                                        </td>
                                        <td className={tdClass + ' flex margin-auto-t-b'}>
                                            {!openExport &&
                                                <div className="h-full mr-2">
                                                    <img className='order-image-stock' src={value.image ?? require('assets/img/mbk/no-image.png').default} />
                                                </div>
                                            }
                                            <div className="flex flex-col">
                                                <div className={tdSpan}>
                                                    {value.productName}
                                                </div>
                                                <div className='text-blueGray-400 text-xs'>
                                                    {value.description}
                                                </div>
                                            </div>
                                        </td>
                                        <td className={tdClass + ' text-right'}>
                                            <span className={tdSpan}>
                                                {value.amount}
                                            </span>
                                        </td>
                                        {value.discount > 0 ? (
                                            <td className={tdClass + ' margin-auto-t-b text-right'}>
                                                <div className="flex flex-col">
                                                    <div>
                                                        <strike className='text-gray-300'>
                                                            ฿{(parseFloat(parseFloat(value.price) + parseFloat(value.discount)).toFixed(2)).toLocaleString('en')}
                                                        </strike>
                                                    </div>
                                                    <div className='text-red-500'>
                                                        ฿{parseFloat(parseFloat(value.price).toFixed(2)).toLocaleString('en')}
                                                    </div>
                                                </div>
                                            </td>
                                        ) : (
                                            <td className={tdClass + ' text-right'}>
                                                <span className={tdSpan}>
                                                    ฿{parseFloat(value.price).toFixed(2).toLocaleString('en')}
                                                </span>
                                            </td>
                                        )}
                                    </tr>
                                );
                            })}
                    </tbody>
                    <tfoot className=''>
                        <tr>
                            <td className={thClass}>
                                <span className={tdSpan}>

                                </span>
                            </td>
                            <td className={thClass}>
                                <span className={tdSpan}>

                                </span>
                            </td>
                            <td className={tdClass + ' text-right'}>
                                <span className={footerClass}>
                                    ยอดรวม
                                </span>
                            </td>
                            <td className={tdClass + ' text-right'}>
                                <span className={footerSumPrice}>
                                    ฿{parseFloat(sumPrice.toFixed(2)).toLocaleString('en')}
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td className={thClass}>
                                <span className={tdSpan}>

                                </span>
                            </td>
                            <td className={thClass}>
                                <span className={tdSpan}>

                                </span>
                            </td>
                            <td className={tdClass + ' text-right ' + (sumDiscount > 0 ? '' : 'border-b')}>
                                <span className={footerClass}>
                                    ค่าจัดส่ง
                                </span>
                            </td>
                            <td className={tdClass + ' text-right ' + (sumDiscount > 0 ? '' : 'border-b')}>
                                <span className={footerClass}>
                                    {orderHD.deliveryCost === 0 ? 'ฟรี' : ('฿' + orderHD.deliveryCost)}
                                </span>
                            </td>
                        </tr>
                        {
                            sumDiscount > 0 && (
                                <tr>
                                    <td className={thClass}>
                                        <span className={tdSpan}>

                                        </span>
                                    </td>
                                    <td className={thClass}>
                                        <span className={tdSpan}>

                                        </span>
                                    </td>
                                    <td className={tdClass + ' text-right border-b'}>
                                        <span className={footerClass}>
                                            ส่วนลด
                                        </span>
                                    </td>
                                    <td className={tdClass + ' text-right border-b'}>
                                        <span className="py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-red-500 ">
                                            -฿{parseFloat((sumDiscount.toFixed(2))).toLocaleString('en')}
                                        </span>
                                    </td>
                                </tr>
                            )
                        }
                        <tr>
                            <td className={thClass}>
                                <span className={tdSpan}>

                                </span>
                            </td>
                            <td className={thClass}>
                                <span className={tdSpan}>

                                </span>
                            </td>
                            <td className={tdClass + ' text-right border-b'}>
                                <LabelUC label='รวมทั้งสิ้น' />
                            </td>
                            <td className={tdClass + ' text-right border-b'}>
                                <LabelUC label={'฿' + parseFloat(parseFloat(orderHD.deliveryCost + sumPrice - sumDiscount).toFixed(2)).toLocaleString('en')} />
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </>
    )
}

export default PurchaseOrder