import React, { useState } from 'react'
import ReactPaginate from "react-paginate";

const LogisticTable = ({ listLogistic, openModal }) => {
    const thClass = "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 ";
    const tdClass = "border-t-0 px-2 align-middle border-b border-l-0 border-r-0 p-3 text-sm whitespace-nowrap text-center";
    const tdSpan = "text-gray-mbk  hover:text-gray-mbk ";

    const [pageNumber, setPageNumber] = useState(0);
    const usersPerPage = 10;
    const pagesVisited = pageNumber * usersPerPage;
    const pageCount = Math.ceil(listLogistic ? listLogistic.length : 0 / usersPerPage);

    const changePage = ({ selected }) => {
        setPageNumber(selected);
    };

    return (
        <>
            <div className="block w-full overflow-x-auto  px-4 py-2">
                {/* Projects table */}
                <table className="items-center w-full border ">
                    <thead>
                        <tr>
                            <th className={thClass} >
                                ชื่อการจัดส่ง
                            </th>
                            <th className={thClass} >
                                ประเภทการจัดส่ง
                            </th>
                            <th className={thClass} >
                                ค่าจัดส่ง
                            </th>
                            <th className={thClass} >
                                แสดงผลต่อลูกค้า
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {listLogistic
                            .slice(pagesVisited, pagesVisited + usersPerPage)
                            .map(function (value, key) {
                                return (
                                    <tr key={key} className="cursor-pointer"
                                        onClick={() => {
                                            openModal(value.id);
                                        }}>
                                        <td className={tdClass}>
                                            <span className="px-4 margin-a">
                                                {pagesVisited + key + 1}
                                            </span>
                                        </td>
                                        <td
                                            // onClick={() => {
                                            //     openModal(value.id);
                                            // }}
                                            className={tdClass + " cursor-pointer"}
                                        >
                                            <span className={tdSpan}>
                                                {value.deliveryName}
                                            </span>
                                        </td>
                                        <td
                                            // onClick={() => {
                                            //     openModal(value.id);
                                            // }}
                                            className={tdClass + " cursor-pointer"}
                                        >
                                            <span className={tdSpan}>
                                                {value.deliveryTypeName}
                                            </span>
                                        </td>
                                        <td
                                            // onClick={() => {
                                            //     openModal(value.id);
                                            // }}
                                            className={tdClass + " cursor-pointer"}
                                        >
                                            <span className={tdSpan}>
                                                {value.deliveryCostName}
                                            </span>
                                        </td>
                                        <td
                                            // onClick={() => {
                                            //     openModal(value.id);
                                            // }}
                                            className={tdClass + " cursor-pointer"}
                                        >
                                            <span className={tdSpan}>
                                                {value.isShowName}
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
                        {pagesVisited + 10 > listLogistic.length
                            ? listLogistic.length
                            : pagesVisited + 10}{" "}
                        {"/"}
                        {listLogistic.length} รายการ
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

export default LogisticTable