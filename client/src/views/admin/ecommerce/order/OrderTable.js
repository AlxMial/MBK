import moment from 'moment';
import React, { useState } from 'react'
import ReactPaginate from "react-paginate";
import ModalImage from "react-modal-image";
import FilesService from "services/files";
import Modal from "react-modal";
import SlipModal from './SlipModal';

const OrderTable = ({ orderList, openModal }) => {
    Modal.setAppElement("#root");
    const thClass = "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 ";
    const tdClass = "border-t-0 px-2 align-middle border-b border-l-0 border-r-0 p-3 text-sm whitespace-nowrap";
    const tdSpan = "text-gray-mbk ";

    const [open, setOpen] = useState(false);
    const [image, setImage] = useState('');
    const [pageNumber, setPageNumber] = useState(0);
    const usersPerPage = 10;
    const pagesVisited = pageNumber * usersPerPage;
    const pageCount = Math.ceil(orderList.length / usersPerPage);

    const changePage = ({ selected }) => {
        setPageNumber(selected);
    };

    const getStatus = (value) => {
        if (value.transportStatus && value.transportStatus === 'done')
            return { text: 'ส่งแล้ว', color: ' text-green-500 ' };
        else if (value.transportStatus && value.transportStatus === 'inTransit')
            return { text: 'กำลังส่ง', color: ' text-orange-500 ' };
        else if (value.transportStatus && value.transportStatus === 'prepare')
            return { text: 'เตรียมส่ง', color: ' text-lightBlue-600 ' };
        else if (value.paymentStatus && value.paymentStatus === 'done')
            return { text: 'ชำระเงินแล้ว', color: ' text-lightBlue-500 ' };
        else if (value.paymentStatus && value.paymentStatus === 'wait')
            return { text: 'รอการชำระเงิน', color: ' text-yellow-500 ' };
        else
            return { text: '', color: ' text-gray-mbk ' };
    }

    const onClickAttachment = async (image) => {
        if (image) {
            const _image = await FilesService.buffer64UTF8(image)
            setImage(_image);
            setOpen(true);
        }
    }

    const _thList = ['ลำดับที่', 'เลขที่ใบสั่งซื้อ', 'วันที่สั่งซื้อ', 'ผู้สั่งซื้อ', 'ยอดสุทธิ', 'สถานะ', 'ไฟล์แนบ'];

    return (
        <>
            <div className="block w-full overflow-x-auto  px-4 py-2">
                {/* Projects table */}
                <table className="items-center w-full border ">
                    <thead>
                        <tr>
                            {_thList.map((item, index) => {
                                return (
                                    <th key={index}
                                        className={thClass + (item === 'ลำดับที่' ? ' text-center' : '')}>
                                        {item}
                                    </th>)
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {orderList
                            .slice(pagesVisited, pagesVisited + usersPerPage)
                            .map(function (value, key) {
                                return (
                                    <tr key={key}>
                                        <td className={tdClass + ' text-center'} >
                                            <span className="px-4 margin-a">
                                                {pagesVisited + key + 1}
                                            </span>
                                        </td>
                                        <td className={tdClass + " cursor-pointer"} onClick={() => {
                                            openModal(value.id);
                                        }}>
                                            <span className='text-blue-700'>
                                                {value.orderNumber}
                                            </span>
                                        </td>
                                        <td className={tdClass} >
                                            <span className={tdSpan}>
                                                {moment(value.orderDate).format("DD/MM/YYYY HH:mm:ss") + ' น.'}
                                            </span>
                                        </td>
                                        <td className={tdClass} >
                                            <span className={tdSpan}>
                                                {value.memberName}
                                            </span>
                                        </td>
                                        <td className={tdClass} >
                                            <span className={tdSpan}>
                                                {value.sumPrice ?? 0} ฿
                                            </span>
                                        </td>
                                        <td className={tdClass} >
                                            <span className={getStatus(value).color}>
                                                {getStatus(value).text}
                                            </span>
                                        </td>
                                        <td className={tdClass + (value.imageName ? ' cursor-pointer ' : '')} onClick={() => {
                                            onClickAttachment(value.image);
                                        }} >
                                            <span className={(value.imageName ? ' text-blue-700' : tdSpan)}>
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
            {open && (
                <SlipModal open={open} image={image} handleModal={() => setOpen(false)} />
            )}
        </>
    )
}

export default OrderTable