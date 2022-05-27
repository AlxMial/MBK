import React from "react";
import ReturnTable from "./ReturnTable";

const ReturnList = ({ listData, handleChangeStatus }) => {
    return (
        <>
            <ReturnTable listData={listData} handleChangeStatus={handleChangeStatus} />
        </>
    );
}

export default ReturnList;