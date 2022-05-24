import React, { useEffect, useState } from 'react'
import ReactPaginate from "react-paginate";
import axios from "services/axios";
import ConfirmDialog from "components/ConfirmDialog/ConfirmDialog";

const StockTable = ({ listStock, openModal, setListStock }) => {
    const thClass = "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 ";
    const tdClass = "border-t-0 px-2 align-middle border-b border-l-0 border-r-0 p-3 text-sm whitespace-nowrap";
    const tdSpan = "text-gray-mbk  hover:text-gray-mbk ";

    const [open, setOpen] = useState(false);
    const [pageNumber, setPageNumber] = useState(0);
    const [productCategoryList, setProductCategoryList] = useState([]);
    const usersPerPage = 10;
    const pagesVisited = pageNumber * usersPerPage;
    const pageCount = Math.ceil(listStock.length / usersPerPage);
    const [deleteValue, setDeleteValue] = useState("");

    const changePage = ({ selected }) => {
        setPageNumber(selected);
    };

    // const statusList = [
    //     { label: "พร้อมขาย", value: 'ready' },
    //     { label: "ใกล้หมด", value: 'remain' },
    //     { label: "หมด", value: 'outOfStock' },
    // ];

    const showList = [
        { label: "แสดง", value: true },
        { label: "ไม่แสดง", value: false },
    ];

    useEffect(async () => {
        const res = await axios.get('productCategory');
        const _productCategory = await res.data.tbProductCategory;
        if (_productCategory) {
            setProductCategoryList(_productCategory);
        }
    }, []);

    const deleteStock = (id) => {
        axios.delete(`/stock/${id}`).then(() => {
            setListStock(id);
        });
    };

    const handleDeleteList = (id) => {
        setDeleteValue(id);
        setOpen(true);
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
                                ชื่อสินค้า
                            </th>
                            <th className={thClass} >
                                หมวดหมู่สินค้า
                            </th>
                            <th className={thClass} >
                                ราคา
                            </th>
                            <th className={thClass} >
                                จำนวนสินค้าในคลัง
                            </th>
                            <th className={thClass} >
                                ซื้อ
                            </th>
                            <th className={thClass} >
                                เหลือ
                            </th>
                            <th className={thClass} >
                                สถานะ
                            </th>
                            <th className={thClass} >
                                สถานะการแสดง
                            </th>
                            <th className={thClass + ' text-center'} >
                                จัดการ
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {listStock
                            .slice(pagesVisited, pagesVisited + usersPerPage)
                            .map(function (value, key) {
                                return (
                                    <tr key={key} className="cursor-pointer">
                                        <td className={tdClass + ' text-center'} onClick={() => {
                                            openModal(value.id);
                                        }}>
                                            <span className="px-4 margin-a">
                                                {pagesVisited + key + 1}
                                            </span>
                                        </td>
                                        <td className={tdClass + " cursor-pointer"} onClick={() => {
                                            openModal(value.id);
                                        }}>
                                            <span className={tdSpan}>
                                                {value.productName}
                                            </span>
                                        </td>
                                        <td className={tdClass + " cursor-pointer"} onClick={() => {
                                            openModal(value.id);
                                        }}>
                                            <span className={tdSpan}>
                                                {productCategoryList && productCategoryList.length &&
                                                    productCategoryList.filter(item => item.id === value.productCategoryId)[0].categoryName}
                                            </span>
                                        </td>
                                        <td className={tdClass + " cursor-pointer"} onClick={() => {
                                            openModal(value.id);
                                        }}>
                                            <span className={tdSpan}>
                                                {value.price} ฿
                                            </span>
                                        </td>
                                        <td className={tdClass + " cursor-pointer"} onClick={() => {
                                            openModal(value.id);
                                        }}>
                                            <span className={tdSpan}>
                                                {value.productCount}
                                            </span>
                                        </td>
                                        <td className={tdClass + " cursor-pointer"} onClick={() => {
                                            openModal(value.id);
                                        }}>
                                            <span className={tdSpan}>
                                                {value.buy}
                                            </span>
                                        </td>
                                        <td className={tdClass + " cursor-pointer"} onClick={() => {
                                            openModal(value.id);
                                        }}>
                                            <span className={tdSpan}>
                                                {value.productCount - value.buy}
                                            </span>
                                        </td>
                                        <td className={tdClass + " cursor-pointer "} onClick={() => {
                                            openModal(value.id);
                                        }}>
                                            <span className={(
                                                value.productCount - value.buy > 10 ? "text-green-500" :
                                                    value.productCount - value.buy <= 0 ? "text-red-700" : "text-orange-400")}>
                                                {value.productCount - value.buy > 10 ?
                                                    'พร้อมขาย' :
                                                    value.productCount - value.buy <= 0 ?
                                                        'หมด' :
                                                        'เหลือน้อย'}
                                            </span>
                                        </td>
                                        <td className={tdClass + " cursor-pointer"} onClick={() => {
                                            openModal(value.id);
                                        }}>
                                            <span className={tdSpan}>
                                                {showList.filter(item => item.value === value.isInactive)[0].label}
                                            </span>
                                        </td>
                                        <td className={tdClass + " cursor-pointer text-center"} >
                                            <i
                                                className="fas fa-trash text-red-500 cursor-pointer"
                                                onClick={() => {
                                                    handleDeleteList(value.id);
                                                }}
                                            ></i>
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
                        {pagesVisited + 10 > listStock.length
                            ? listStock.length
                            : pagesVisited + 10}{" "}
                        {"/"}
                        {listStock.length} รายการ
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
            {open && (
                <ConfirmDialog
                    showModal={open}
                    message={"จัดการข้อมูลสมาชิก"}
                    hideModal={() => {
                        setOpen(false);
                    }}
                    confirmModal={() => {
                        deleteStock(deleteValue);
                    }}
                />
            )}
        </>
    )
}

export default StockTable