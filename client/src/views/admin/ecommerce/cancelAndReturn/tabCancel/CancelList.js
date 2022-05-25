import React from "react";
import CancelTable from "./CancelTable";

const CancelList = ({ listData, handleChangeStatus }) => {
    return (
        <>
            <CancelTable listData={listData} handleChangeStatus={handleChangeStatus} />
        </>
    );
}

export default CancelList;