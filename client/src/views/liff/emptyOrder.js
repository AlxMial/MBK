import React from "react";

const EmptyOrder = ({ text }) => {
  return (
    <div
      className="flex mb-2 text-liff-gray-mbk h-full"
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div>
        <i
          className="flex fas fa-box-open mb-2"
          style={{
            alignItems: "center",
            justifyContent: "center",
            fontSize: "28px",
          }}
        ></i>
        <div> {text} </div>
      </div>
    </div>
  );
};

export default EmptyOrder;
