// import LabelUC from 'components/LabelUC';
import React from 'react'
import './index.scss'

const PurchaseOrder = ({ props }) => {
    const { orderHD, orderDT, openExport } = props;
    const thClass = "px-2  py-1 text-sm  border-l-0 border-r-0 whitespace-nowrap text-left text-blueGray-500 ";
    const tdClass = "border-t-0 pl-2 align-middle border-l-0 border-r-0 py-1 text-sm whitespace-normal";
    const tdSpan = "text-gray-mbk hover:text-gray-mbk ";
    // const footerClass = "py-1 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-blueGray-500 ";
    // const footerSumPrice = "py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-green-mbk ";

    const sumPrice = orderDT.reduce((sum, item) => {
        console.log(sum + ((parseFloat(item.price) - parseFloat(item.discount) ) * parseFloat(item.amount)))
        return  sum + ((parseFloat(item.price) - parseFloat(item.discount) ) * parseFloat(item.amount));
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
                            <th className={thClass + ' text-center'}  >
                                ลำดับที่
                            </th>
                            <th className={thClass + ' w-6/12'} >
                                สินค้า
                            </th>
                            <th className={thClass + ' text-right'}  >
                                จำนวน
                            </th>
                            <th className={thClass + ' text-right pr-4'} >
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
                                        <td className={tdClass + ' w-full'}>
                                            <div className='flex'>
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
                                            </div>
                                        </td>
                                        <td className={tdClass + ' text-right'}>
                                            <span className={tdSpan}>
                                                {value.amount}
                                            </span>
                                        </td>
                                        {value.discount > 0 ? (
                                            <td className={tdClass + ' margin-auto-t-b text-right pr-4'}>
                                                <div className="flex flex-col">
                                                    <div>
                                                        <strike className='text-gray-300'>
                                                            
                                                            {(parseInt(value.price)).toFixed(2)}
                                                        </strike>
                                                    </div>
                                                    <div className='text-red-500'>
                                                        {(parseFloat(value.price) - parseFloat(value.discount)).toFixed(2).toLocaleString('en')}
                                                    </div>
                                                </div>
                                            </td>
                                        ) : (
                                            <td className={tdClass + ' text-right pr-4'}>
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
                                ยอดรวมสินค้า
                            </td>
                            <td className={tdClass + ' text-right font-bold'}>
                                <span className={' pr-4'}>
                                    {parseFloat(sumPrice).toFixed(2).toLocaleString('en')}
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

                            <td className={tdClass + ' text-right'}>
                                ส่วนลดร้านค้า
                            </td>
                            <td className={tdClass + ' text-right'}>
                                <div className={"text-sm  border-l-0 border-r-0 whitespace-nowrap text-left  pr-4"}
                                    style={{ textAlign: "end" }}>
                                    {orderHD.discountStorePromotion}
                                </div>
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


                            <td className={tdClass + ' text-right '}>
                                ค่าจัดส่ง
                            </td>
                            <td className={tdClass + ' text-right '}>
                                <div className={"text-sm  border-l-0 border-r-0 whitespace-nowrap text-left  pr-4"}
                                    style={{ textAlign: "end" }}>
                                    {orderHD.deliveryCost > orderHD.discountDelivery ? (orderHD.deliveryCost) : (orderHD.discountDelivery)}
                                </div>

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
                            <td className={tdClass + ' text-right border-b'}>
                                ส่วนลดคูปอง
                            </td>
                            <td className={tdClass + ' text-right border-b'}>
                                <div className={"text-sm  border-l-0 border-r-0 whitespace-nowrap text-left  pr-4" + (orderHD.discountCoupon > 0 ? " text-red-500 " : "")}
                                    style={{ textAlign: "end" }}>
                                    {(orderHD.discountCoupon > 0 ? "-" : "") + parseFloat((orderHD.discountCoupon)).toLocaleString('en')}
                                </div>
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
                            <td className={tdClass + " text-green-mbk text-right border-b"}>
                                <div className='text-green-mbk font-bold'>{"ยอดสุทธิ"}</div>
                            </td>
                            <td className={tdClass + "  text-right border-b pr-4"}>
                                <div className='text-green-mbk font-bold'>{"฿" + parseFloat(orderHD.netTotal).toFixed(2).toLocaleString('en')} </div>

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
                            <td className={tdClass + " text-green-mbk text-right "}>
                                <div className='text-green-mbk font-bold'>{""}</div>
                            </td>
                            <td className={tdClass + "  text-right pr-4"}>
                                <div className='text-gold-mbk font-bold text-xs'>{"+" + orderHD.points + " points"} </div>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </>
    )
}

export default PurchaseOrder