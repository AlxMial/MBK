import React, { useEffect, useState } from "react";
import axios from "services/axios";
import Modal from "react-modal";
import StockTable from "./StockTable";

// components
Modal.setAppElement("#root");

const StockList = ({ openModal, setListStock, listStock }) => {
  return (
    <>
      <StockTable listStock={listStock} openModal={openModal} setListStock={setListStock} />
    </>
  );
}

export default StockList;