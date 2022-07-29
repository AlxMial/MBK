import React from "react";
import CancelTable from "./CancelTable";

const CancelList = ({
  listData,
  handleChangeStatus,
  pageNumber,
  setPageNumber,
  forcePage,
  setForcePage,
}) => {
  return (
    <>
      <CancelTable
        listData={listData}
        handleChangeStatus={handleChangeStatus}
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        forcePage={forcePage}
        setForcePage={setForcePage}
      />
    </>
  );
};

export default CancelList;
