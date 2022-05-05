import React from "react";
// components

const MyOrder = () => {
  return (
    <>
      {" "}
      <div className="mt-2 " style={{ padding: "10px" }}>
        <div className="flex relative">
          <div className="text-green-mbk font-bold text-xs">
            คำสั่งชื้อของฉัน
          </div>
          <div className=" text-xs absolute right-0">ดูทั้งหมด</div>
        </div>
      </div>
    </>
  );
};
export default MyOrder;
