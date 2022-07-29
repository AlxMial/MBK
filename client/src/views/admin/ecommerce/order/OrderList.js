import React from "react";
import OrderTable from "./OrderTable";

const OrderList = ({
  openModal,
  orderList,
  pageNumber,
  setPageNumber,
  forcePage,
  setForcePage,
}) => {
  return (
    <>
      <OrderTable
        orderList={orderList}
        openModal={openModal}
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        forcePage={forcePage}
        setForcePage={setForcePage}
      />
    </>
  );
};

export default OrderList;
