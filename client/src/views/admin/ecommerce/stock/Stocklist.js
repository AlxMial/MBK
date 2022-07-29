import React from "react";
import StockTable from "./StockTable";

const StockList = ({
  openModal,
  setListStock,
  listStock,
  pageNumber,
  setPageNumber,
  forcePage,
  setForcePage,
}) => {
  return (
    <>
      <StockTable
        listStock={listStock}
        openModal={openModal}
        setListStock={setListStock}
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        forcePage={forcePage}
        setForcePage={setForcePage}
      />
    </>
  );
};

export default StockList;
