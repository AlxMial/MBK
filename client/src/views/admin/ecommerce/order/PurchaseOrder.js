// import LabelUC from 'components/LabelUC';
import React from 'react'
import './index.scss'
import * as fn from "@services/default.service";
const PurchaseOrder = ({ props }) => {
    const { orderHD, orderDT, openExport } = props;
    const thClass = "px-2  py-4 text-sm  border-l-0 border-r-0 whitespace-nowrap text-left text-blueGray-500 ";
    const tdClass = "border-t-0  py-3 pl-2 align-middle border-l-0 border-r-0 py-1 text-sm whitespace-normal";
    const tdSpan = "text-gray-mbk hover:text-gray-mbk ";
    // const footerClass = "py-1 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-blueGray-500 ";
    // const footerSumPrice = "py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-green-mbk ";

    const sumPrice = orderDT.reduce((sum, item) => {
        console.log(sum + ((parseFloat(item.price) - parseFloat(item.discount)) * parseFloat(item.amount)))
        return sum + ((parseFloat(item.price) - parseFloat(item.discount)) * parseFloat(item.amount));
    }, 0);

    const sumDiscount = orderDT.reduce((sum, item) => {
        return parseFloat(sum) + parseFloat(item.discount);
    }, 0);

    return (
        <>
            <div className="w-full lg:w-12/12 pr-2 margin-auto-t-b ">
                <table className="items-center w-full ">
                    <thead>
                        <tr className={openExport ? '' : ''} style={{ borderTop: "1px solid  #e5e7eb", borderBottom: "1px solid  #e5e7eb" }}>
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
                                                        ฿{(parseFloat(value.price) - parseFloat(value.discount)).toFixed(2).toLocaleString('en')}
                                                    </div>
                                                    {/* <div>
                                                        <strike className='text-gray-300'>

                                                            {fn.formatMoney(value.price)}
                                                        </strike>
                                                    </div>
                                                    
                                                    <div className='text-red-500'>
                                                        {fn.formatMoney(value.price - value.discount)}
                                                    </div>*/}
                                                </div>
                                            </td>
                                        ) : (
                                            <td className={tdClass + ' text-right pr-4'}>
                                                <span className={tdSpan}>
                                                    {fn.formatMoney(value.price)}
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
                                {"ยอดรวมสินค้า (" + orderHD.stockNumber + " ชิ้น)"}
                            </td>
                            <td className={tdClass + ' text-right font-bold'}>
                                <span className={' pr-4'}>
                                    {fn.formatMoney(sumPrice)}
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
                                <div className={"text-sm  border-l-0 border-r-0 whitespace-nowrap text-left  pr-4" + (orderHD.discountStorePromotion > 0 ? " text-gold-mbk" : "")}
                                    style={{ textAlign: "end" }}>
                                    {orderHD.discountStorePromotion > 0 ? "-" + fn.formatMoney(orderHD.discountStorePromotion) : fn.formatMoney(0)}
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
                                    {orderHD.deliveryCost > 0 ? fn.formatMoney(orderHD.deliveryCost) : fn.formatMoney(0)}
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
                                ส่วนลดค่าจัดส่ง
                            </td>
                            <td className={tdClass + ' text-right '}>
                                <div className={"text-sm  border-l-0 border-r-0 whitespace-nowrap text-left  pr-4" + (orderHD.discountDelivery > 0 ? " text-gold-mbk" : "")}
                                    style={{ textAlign: "end" }}>
                                    {orderHD.discountDelivery > 0 ? "-" + fn.formatMoney(orderHD.discountDelivery) : fn.formatMoney(0)}
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
                                <div className={"text-sm  border-l-0 border-r-0 whitespace-nowrap text-left  pr-4" + (orderHD.discountCoupon > 0 ? " text-gold-mbk " : "")}
                                    style={{ textAlign: "end" }}>
                                    {(orderHD.discountCoupon > 0 ? "-" + fn.formatMoney(orderHD.discountCoupon) : fn.formatMoney(0))}
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
                                <div className='text-green-mbk font-bold'>{fn.formatMoney(orderHD.netTotal)} </div>

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