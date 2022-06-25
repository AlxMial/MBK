import React, { useState, useEffect } from "react";
import Modal from "react-modal";
// components

const Error = ({ data ,setmodeldata}) => {
  // const [isOpen, setisOpen] = useState(Open);
  return <Modal
    isOpen={data.open}
    className="Modal-error"
    style={{ borderRadius: "10px" }}
  >
    <div className="w-full flex flex-wrap" style={{ height: "100%" }}>
      <div className="w-full flex-auto relative">
        <div className=" flex justify-between align-middle ">
          <div className="w-full align-middle flex" style={{
            justifyContent: "center"
          }}>
            <div className="border-t-0 px-6 align-middle border-l-0 border-r-0  text-green-mbk font-bold whitespace-nowrap p-4" style={{ fontSize: "24px" }}>
              <label>{data.title}</label>
            </div>
          </div>

          <div className="  text-right align-middle absolute " style={{
            right: "0"
          }}>
            <div className=" border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm text-red-500 font-bold whitespace-nowrap p-4">
              <label
                className="cursor-pointer"
                onClick={() => {
                  setmodeldata({ open: false })
                }}
              >
                <i className="flex fas fa-times" style={{ alignItems: "center" }}></i>
              </label>
            </div>
          </div>
        </div>

      </div>

      <div className="line-scroll" style={{ width: "100%", height: "100px", borderRadius: "18px" }}>
        <div className="px-2 py-2 text-green-mbk" style={{ fontSize: "20px", textAlign: "center" }}>
          <div className="font-bold">{data.msg} </div>
        </div>
      </div>
      <div className=" w-full flex" style={{ bottom: "10px" }}>
        <div className=" w-full" style={{
          padding: "10px", margin: "auto",
          width: "50%"
        }}>
          <div
            className="flex bg-green-mbk text-white text-center text-lg  font-bold "
            style={{
              margin: "auto",
              height: "45px",
              borderRadius: "10px",
              padding: "5px",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => {
              setmodeldata({ open: false })
            }}
          >
            {"ตกลง"}
          </div>
        </div>

      </div>
    </div>
  </Modal>
};

export default Error;
