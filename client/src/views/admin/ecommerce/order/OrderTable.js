import React, { useState } from 'react'
import ReactPaginate from "react-paginate";

const OrderTable = ({ orderList, openModal }) => {
    const thClass = "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 ";
    const tdClass = "border-t-0 px-2 align-middle border-b border-l-0 border-r-0 p-3 text-sm whitespace-nowrap";
    const tdSpan = "text-gray-mbk  hover:text-gray-mbk ";

    const [pageNumber, setPageNumber] = useState(0);
    const usersPerPage = 10;
    const pagesVisited = pageNumber * usersPerPage;
    const pageCount = Math.ceil(orderList.length / usersPerPage);

    const changePage = ({ selected }) => {
        setPageNumber(selected);
    };

    const getStatus = (value) => {
        if (value.transportStatus === 'done')
            return 'ส่งแล้ว';
        else if (value.transportStatus === 'inTransit')
            return 'กำลังส่ง';
        else if (value.transportStatus === 'prepare')
            return 'เตรียมส่ง';
        else if (value.paymentStatus === 'done')
            return 'ชำระเงินแล้ว';
        else if (value.paymentStatus === 'waiting')
            return 'รอการชำระเงิน';
    }

    const onClickAttachment = (image) => {
        if (image) {
            console.log(image);
        }
    }

    return (
        <>
            <div className="block w-full overflow-x-auto  px-4 py-2">
                {/* Projects table */}
                <table className="items-center w-full border ">
                    <thead>
                        <tr>
                            <th className={thClass + ' text-center'} >
                                ลำดับที่
                            </th>
                            <th className={thClass} >
                                เลขที่ใบสั่งซื้อ
                            </th>
                            <th className={thClass} >
                                วันที่สั่งซื้อ
                            </th>
                            <th className={thClass} >
                                ผู้สั่งซื้อ
                            </th>
                            <th className={thClass} >
                                ยอดสุทธิ
                            </th>
                            <th className={thClass} >
                                สถานะ
                            </th>
                            <th className={thClass} >
                                ไฟล์แนบ
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderList
                            .slice(pagesVisited, pagesVisited + usersPerPage)
                            .map(function (value, key) {
                                return (
                                    <tr key={key} className="cursor-pointer">
                                        <td className={tdClass + ' text-center'} >
                                            <span className="px-4 margin-a">
                                                {pagesVisited + key + 1}
                                            </span>
                                        </td>
                                        <td className={tdClass + " cursor-pointer text-blue-500"} onClick={() => {
                                            openModal(value.id);
                                        }}>
                                            <span className={tdSpan}>
                                                {value.orderNumber}
                                            </span>
                                        </td>
                                        <td className={tdClass + " cursor-pointer"} >
                                            <span className={tdSpan}>
                                                {value.orderDate}
                                            </span>
                                        </td>
                                        <td className={tdClass + " cursor-pointer"} >
                                            <span className={tdSpan}>
                                                {value.memberName}
                                            </span>
                                        </td>
                                        <td className={tdClass + " cursor-pointer"} >
                                            <span className={tdSpan}>
                                                {value.sumPrice ?? 0} ฿
                                            </span>
                                        </td>
                                        <td className={tdClass + " cursor-pointer"} >
                                            <span className={tdSpan}>
                                                {getStatus(value)}
                                            </span>
                                        </td>
                                        <td className={tdClass + " cursor-pointer"} onClick={() => {
                                            onClickAttachment(value.image);
                                        }} >
                                            <span className={tdSpan}>
                                                {value.imageName ?? 'ไม่มีไฟล์แนบ'}
                                            </span>
                                        </td>

                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </div>
            <div className="px-4">
                <div className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap ">
                    <div
                        className="lg:w-6/12 font-bold"
                        style={{ alignSelf: "stretch" }}
                    >
                        {pagesVisited + 10 > orderList.length
                            ? orderList.length
                            : pagesVisited + 10}{" "}
                        {"/"}
                        {orderList.length} รายการ
                    </div>
                    <div className="lg:w-6/12">
                        <ReactPaginate
                            previousLabel={" < "}
                            nextLabel={" > "}
                            pageCount={pageCount}
                            onPageChange={changePage}
                            containerClassName={"paginationBttns"}
                            previousLinkClassName={"previousBttn"}
                            nextLinkClassName={"nextBttn"}
                            disabledClassName={"paginationDisabled"}
                            activeClassName={"paginationActive"}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default OrderTable