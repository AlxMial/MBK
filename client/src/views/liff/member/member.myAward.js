import React from "react";
import { useHistory } from "react-router-dom";
import { path } from "services/liff.services";
// components

const MyAward = () => {
  const history = useHistory();
  return (
    <>
      <div className="mt-2 " style={{ border: "1px solid", padding: "10px", height: "calc(100vh - 490px)" }}>
        <div className="flex relative">
          <div className="text-green-mbk font-bold text-xs">รางวัลของฉัน</div>
          <div className=" text-xs absolute right-0" onClick={()=>{
            history.push(path.shopList)
          }}>ดูทั้งหมด</div>
        </div>
      </div>
    </>
  );
};
export default MyAward;
