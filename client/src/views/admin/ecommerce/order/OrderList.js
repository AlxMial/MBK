import React from "react";
import OrderTable from "./OrderTable";

const OrderList = ({ openModal, orderList }) => {
  return (
    <>
      <OrderTable orderList={orderList} openModal={openModal} />
    </>
  );
}

export default OrderList;