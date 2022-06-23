import SelectUC from 'components/SelectUC';
import React, { useState } from 'react'
import ReactPaginate from "react-paginate";
import ValidateService from "services/validateValue";
import axios from "services/axios";
import { fetchLoading } from 'redux/actions/common';

const LogisticTable = ({ listLogistic, openModal, saveLogisticSuccess, saveLogisticNotSuccess }) => {
    const thClass = "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 ";
    const tdClass = "border-t-0 px-2 align-middle border-b border-l-0 border-r-0 p-3 text-sm whitespace-nowrap";
    const tdSpan = "text-gray-mbk  hover:text-gray-mbk ";

    const [pageNumber, setPageNumber] = useState(0);
    const usersPerPage = 10;
    const pagesVisited = pageNumber * usersPerPage;
    const pageCount = Math.ceil(listLogistic ? listLogistic.length : 0 / usersPerPage);

    const changePage = ({ selected }) => {
        setPageNumber(selected);
    };

    const logisticTypeList = [
        { label: "Kerry Express", value: 'kerry' },
        { label: "Flash Express", value: 'flash' },
        { label: "ไปรษณีย์ไทย", value: 'post' },
    ];

    const showList = [
        { label: "แสดง", value: true },
        { label: "ไม่แสดง", value: false },
    ];

    const handleChangeShowToEmp = (value, newValue) => {
        value.isShow = newValue;
        fetchLoading();
        value.updateBy = sessionStorage.getItem('user');
        console.log(value);
        if (value.id) {
            axios.put("logistic", value).then((res) => {
                if (res.data.status) {
                    saveLogisticSuccess();
                } else {
                    saveLogisticNotSuccess();
                }
            });
        } else {
            value.addBy = sessionStorage.getItem('user');
            axios.post("logistic", value).then(async (res) => {
                if (res.data.status) {
                    saveLogisticSuccess();
                } else {
                    saveLogisticNotSuccess();
                }
            });
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
                                                {value.deliveryName}
                                            </span>
                                        </td>
                                        <td className={tdClass + " cursor-pointer"} onClick={() => {
                                            openModal(value.id);
                                        }}>
                                            <span className={tdSpan}>
                                                {logisticTypeList.filter(item => item.value === value.logisticType)[0].label}
                                            </span>
                                        </td>
                                        <td className={tdClass + " cursor-pointer"} onClick={() => {
                                            openModal(value.id);
                                        }}>
                                            <span className={tdSpan}>
                                                {value.deliveryCost === 0 ? 'ฟรี' : (value.deliveryCost) + ' ฿'}
                                            </span>
                                        </td>
                                        <td className={tdClass + " cursor-pointer"} >
                                            <span className={tdSpan}>
                                                {/* {value.isShowName} */}
                                                <SelectUC
                                                    name="showToEmp"
                                                    onChange={(e) => {
                                                        handleChangeShowToEmp(value, e.value);
                                                    }}
                                                    options={showList}
                                                    value={ValidateService.defaultValue(
                                                        showList,
                                                        value.isShow
                                                    )}
                                                />
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