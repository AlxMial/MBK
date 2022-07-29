import React from "react";
import ReturnTable from "./ReturnTable";

const ReturnList = ({ listData, handleChangeStatus, pageNumber,
    setPageNumber,
    forcePage,
    setForcePage, }) => {
    return (
        <>
            <ReturnTable listData={listData} handleChangeStatus={handleChangeStatus}  pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        forcePage={forcePage}
        setForcePage={setForcePage}/>
        </>
    );
}

export default ReturnList;