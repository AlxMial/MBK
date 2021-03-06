// import LabelUC from 'components/LabelUC';
import React from 'react'
import '../index.scss'
import * as fn from "@services/default.service";
const PurchaseOrderExport = ({ props }) => {
    const { orderHD, orderDT, openExport } = props;
    const thClass = "px-2 py-2 text-xs  border-l-0 border-r-0 whitespace-nowrap text-left text-blueGray-500 ";
    const tdClass = "border-t-0  py-2 pl-2 align-middle border-l-0 border-r-0 py-1 text-xs whitespace-normal";
    const tdSpan = "text-gray-mbk hover:text-gray-mbk ";

    const thClassFooter = "px-2  py-2 text-xs  border-l-0 border-r-0 whitespace-nowrap text-left text-blueGray-500 ";
    const tdClassFooter = "border-t-0  py-1 pl-2 align-middle border-l-0 border-r-0 py-1 text-xs whitespace-normal";
    const tdSpanFooter = "text-gray-mbk hover:text-gray-mbk ";
    // const footerClass = "py-1 text-xs  border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-blueGray-500 ";
    // const footerSumPrice = "py-3 text-xs  border-l-0 border-r-0 whitespace-nowrap font-semibold text-left text-green-mbk ";

    const sumPrice = orderDT.reduce((sum, item) => {
        return sum + ((parseFloat(item.price) - parseFloat(item.discount)) * parseFloat(item.amount));
    }, 0);

    const sumDiscount = orderDT.reduce((sum, item) => {
        return parseFloat(sum) + parseFloat(item.discount);
    }, 0);

    return (
        <>
            <div className="w-full lg:w-12/12 pr-2 margin-auto-t-b px-6">
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
                    <tbody style={{ borderBottom: "1px solid  #e5e7eb" }} >
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
                                                    <div className='text-blueGray-400 text-1xs'>
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
                    <tfoot className='mt-2'>
                        <tr>
                            <td className={thClassFooter}>
                                <span className={tdSpanFooter}>

                                </span>
                            </td>
                            <td className={thClassFooter}>
                                <span className={tdSpanFooter}>

                                </span>
                            </td>
                            <td className={tdClassFooter + ' text-right text-12'}>
                                {"ยอดรวมสินค้า (" + orderHD.stockNumber + " ชิ้น)"}
                            </td>
                            <td className={tdClassFooter + ' text-right font-bold text-12'}>
                                <span className={' pr-4'}>
                                    {fn.formatMoney(sumPrice)}
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td className={thClassFooter}>
                                <span className={tdSpanFooter}>

                                </span>
                            </td>
                            <td className={thClassFooter}>
                                <span className={tdSpanFooter}>

                                </span>
                            </td>

                            <td className={tdClassFooter + ' text-right'}>
                                ส่วนลดร้านค้า
                            </td>
                            <td className={tdClassFooter + ' text-right'}>
                                <div className={"text-xs  border-l-0 border-r-0 whitespace-nowrap text-left  pr-4" + (orderHD.discountStorePromotion > 0 ? " text-gold-mbk" : "")}
                                    style={{ textAlign: "end" }}>
                                    {orderHD.discountStorePromotion > 0 ? "-" + fn.formatMoney(orderHD.discountStorePromotion) : fn.formatMoney(0)}
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td className={thClassFooter}>
                                <span className={tdSpanFooter}>

                                </span>
                            </td>
                            <td className={thClassFooter}>
                                <span className={tdSpanFooter}>

                                </span>
                            </td>


                            <td className={tdClassFooter + ' text-right '}>
                                ค่าจัดส่ง
                            </td>
                            <td className={tdClassFooter + ' text-right '}>
                                <div className={"text-xs  border-l-0 border-r-0 whitespace-nowrap text-left  pr-4"}
                                    style={{ textAlign: "end" }}>
                                    {orderHD.deliveryCost > 0 ? fn.formatMoney(orderHD.deliveryCost) : fn.formatMoney(0)}
                                </div>

                            </td>
                        </tr>

                        <tr>
                            <td className={thClassFooter}>
                                <span className={tdSpanFooter}>

                                </span>
                            </td>
                            <td className={thClassFooter}>
                                <span className={tdSpanFooter}>

                                </span>
                            </td>


                            <td className={tdClassFooter + ' text-right '}>
                                ส่วนลดค่าจัดส่ง
                            </td>
                            <td className={tdClassFooter + ' text-right '}>
                                <div className={"text-xs  border-l-0 border-r-0 whitespace-nowrap text-left  pr-4" + (orderHD.discountDelivery > 0 ? " text-gold-mbk" : "")}
                                    style={{ textAlign: "end" }}>
                                    {orderHD.discountDelivery > 0 ? "-" + fn.formatMoney(orderHD.deliveryCost - orderHD.discountDelivery) : fn.formatMoney(0)}
                                </div>

                            </td>
                        </tr>
                        <tr>
                            <td className={thClassFooter}>
                                <span className={tdSpanFooter}>

                                </span>
                            </td>
                            <td className={thClassFooter}>
                                <span className={tdSpanFooter}>

                                </span>
                            </td>
                            <td className={tdClassFooter + ' text-right border-b'}>
                                ส่วนลดคูปอง
                            </td>
                            <td className={tdClassFooter + ' text-right border-b'}>
                                <div className={"text-xs  border-l-0 border-r-0 whitespace-nowrap text-left  pr-4" + (orderHD.discountCoupon > 0 ? " text-gold-mbk " : "")}
                                    style={{ textAlign: "end" }}>
                                    {(orderHD.discountCoupon > 0 ? "-" + fn.formatMoney(orderHD.discountCoupon) : fn.formatMoney(0))}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td className={thClassFooter}>
                                <span className={tdSpanFooter}>

                                </span>
                            </td>
                            <td className={thClassFooter}>
                                <span className={tdSpanFooter}>

                                </span>
                            </td>
                            <td className={tdClassFooter + " text-green-mbk text-right border-b"}>
                                <div className='text-green-mbk font-bold'>{"ยอดสุทธิ"}</div>
                            </td>
                            <td className={tdClassFooter + "  text-right border-b pr-4"}>
                                <div className='text-green-mbk font-bold'>{fn.formatMoney(orderHD.netTotal)} </div>

                            </td>
                        </tr>
                        <tr>
                            <td className={thClassFooter}>
                                <span className={tdSpanFooter}>

                                </span>
                            </td>
                            <td className={thClassFooter}>
                                <span className={tdSpanFooter}>

                                </span>
                            </td>
                            <td className={tdClassFooter + " text-green-mbk text-right "}>
                                <div className='text-green-mbk font-bold'>{""}</div>
                            </td>
                            <td className={tdClassFooter + "  text-right pr-4"}>
                                <div className='text-gold-mbk font-bold text-1xs'>{"+" + orderHD.points + " points"} </div>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </>
    )
}

export default PurchaseOrderExport