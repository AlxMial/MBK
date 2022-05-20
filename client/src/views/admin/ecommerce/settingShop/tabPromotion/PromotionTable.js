import React, { useState } from 'react'
import ReactPaginate from "react-paginate";

const PromotionTable = ({ listPromotion, openModal }) => {
    const thClass = "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 ";
    const tdClass = "border-t-0 px-2 align-middle border-b border-l-0 border-r-0 p-3 text-sm whitespace-nowrap text-center";
    const tdSpan = "text-gray-mbk  hover:text-gray-mbk ";

    const [pageNumber, setPageNumber] = useState(0);
    const usersPerPage = 10;
    const pagesVisited = pageNumber * usersPerPage;
    const pageCount = Math.ceil(listPromotion.length / usersPerPage);

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
                                ชื่อแคมเปญ
                            </th>
                            <th className={thClass} >
                                ยอดรวม
                            </th>
                            <th className={thClass} >
                                เงื่อนไข
                            </th>
                            <th className={thClass} >
                                รายละเอียด
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {listPromotion
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
                                                {value.bankName}
                                            </span>
                                        </td>
                                        <td
                                            // onClick={() => {
                                            //     openModal(value.id);
                                            // }}
                                            className={tdClass + " cursor-pointer"}
                                        >
                                            <span className={tdSpan}>
                                                {value.accountNumber}
                                            </span>
                                        </td>
                                        <td
                                            // onClick={() => {
                                            //     openModal(value.id);
                                            // }}
                                            className={tdClass + " cursor-pointer"}
                                        >
                                            <span className={tdSpan}>
                                                {value.accountName}
                                            </span>
                                        </td>
                                        <td
                                            // onClick={() => {
                                            //     openModal(value.id);
                                            // }}
                                            className={tdClass + " cursor-pointer"}
                                        >
                                            <span className={tdSpan}>
                                                {value.bankBranchName}
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
                        {pagesVisited + 10 > listPromotion.length
                            ? listPromotion.length
                            : pagesVisited + 10}{" "}
                        {"/"}
                        {listPromotion.length} รายการ
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

export default PromotionTable