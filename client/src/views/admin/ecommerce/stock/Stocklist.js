import React from "react";
import StockTable from "./StockTable";

const StockList = ({ openModal, setListStock, listStock }) => {
  return (
    <>
      <StockTable listStock={listStock} openModal={openModal} setListStock={setListStock}  />
    </>
  );
}

export default StockList;