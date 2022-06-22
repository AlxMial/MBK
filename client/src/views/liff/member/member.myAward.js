import React from "react";
// components

const MyAward = () => {
  return (
    <>
      <div className="mt-2 " style={{ border: "1px solid", padding: "10px", height: "calc(100vh - 490px)" }}>
        <div className="flex relative">
          <div className="text-green-mbk font-bold text-xs">รางวัลของฉัน</div>
          <div className=" text-xs absolute right-0">ดูทั้งหมด</div>
        </div>
      </div>
    </>
  );
};
export default MyAward;
