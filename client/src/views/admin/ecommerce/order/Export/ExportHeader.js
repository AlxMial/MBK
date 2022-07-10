import LabelUC from "components/LabelUC";
import React from "react";
import "../index.scss";

const ExportHeader = ({ dataExport }) => {
  return (
    <div className="px-6">
      {/* <div className="border-t-0 px-6 mb-6 align-middle border-l-0 border-r-0 text-xl text-green-mbk font-bold whitespace-nowrap p-4">
        <label>รายการสั่งซื้อ /Export คำสั่งซื้อ</label>
      </div> */}
      <div className="mt-4 image-header-export flex flex-wrap">
        <img src="/static/media/side_mbk.52180e2c.png" alt="..." />
        <div className="text-header text-left ml-4 ">
          <p className="text-xs font-bold m-0"> บริษัท ข้าวมาบุญครอง จำกัด </p>
          <p className="text-1xs m-0">
            {" "}
            (สำนักงานใหญ่) 88 หมู่ที่ 2 ถนนติวานนท์ ตำบลบางกะดี
            อำเภอเมืองปทุมธานี จังหวัดปทุมธานี 12000
          </p>
          <p className="text-1xs m-0">
            {" "}
            โทรศัพท์: +66 (0) 2501 2175 โทรสาร: +66 (0) 2501 2176 ทะเบียนเลขที่:
            0105540062689
          </p>
          <p className="text-1xs m-0"> เว็บไซต์ : www.mahboonkrongrice.com</p>
        </div>
      </div>
      <div className="py-6 flex justify-center ">
        <div className="text-sm text-header font-bold margin-a">
          ใบเสร็จรับเงิน
        </div>
      </div>

      <hr className="margin-a" />
      <div className=" margin-auto-t-b w-full flex justify-between px-4 pt-2">
        <div className=" text-1xs mt-1 lg:w-6/12 font-bold">
        {dataExport && dataExport.name}      
        </div>
        <div className=" text-1xs mt-1 lg:w-6/12 text-right">
          <span className=" font-bold"> รายการคำสั่งซื้อ : </span>
          {dataExport && dataExport.orderNumber}
        </div>
      </div>
      <div className=" px-4  text-1xs">
        <div className=" text-1xs w-full">
          {dataExport && dataExport.address}
        </div>
      </div>

      <div className="flex border-b py-4 ">
        <div className="margin-auto-t-b lg:w-3/12 flex flex-col px-4 ">
          <div className=" text-1xs mt-1 w-full font-bold">อีเมล :</div>
          <div className=" text-1xs  w-full  lg:w-4/12">
            {dataExport && dataExport.email}
          </div>
        </div>
        <div className="margin-auto-t-b  flex-col px-4 ">
          <div className=" text-1xs mt-1 w-full font-bold">เบอร์โทร :</div>
          <div className=" text-1xs w-full">
            {dataExport && dataExport.phone}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportHeader;
