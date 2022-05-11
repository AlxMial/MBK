import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "services/axios";
import { useHistory } from "react-router-dom";
import { path } from "../../../layouts/Liff";
import { IsNullOrEmpty } from "../../../services/default.service";
import * as Session from "../../../services/Session.service";
import moment from "moment";
// components

const Rewardredeem = () => {
  const history = useHistory();
  const { id } = useParams();
  return (
    <>
      {/* card */}
      <div
        className="bg-green-mbk absolute w-full noselect"
        style={{
          marginTop: "0px",
          height: "calc(50vh - 100px)",
        }}
      ></div>

      <div className="mt-6 absolute  w-full noselect">
        <div
          style={{
            width: "90%",
            margin: "auto",
            border: "2px solid red",
            height: "200px",
          }}
        >
          <div>{"image  Rewardredeem id : " + id} </div>
        </div>

        <div
          className="mt-6 bg-white rounded-xl text-center relative"
          style={{
            width: "90%",
            border: "2px solid red",
            height: "450px",
            marginRight: "auto",
            marginBottom: "auto",
            marginLeft: "auto",
          }}
        >
          <div className="strong mt-4 text-lg">
            <strong>{"โค้ดส่วนลดมูลค่า 100 บาท"}</strong>
          </div>
          <div
            className="mt-4"
            style={{ borderBottom: "1px solid #eee" }}
          ></div>
          <div className="strong mt-4">
            <strong>{"รายละเอียด"}</strong>
          </div>
          <div
            className="mt-4"
            style={{ borderBottom: "1px solid #eee" }}
          ></div>
          <div className=" mt-4">{"Detail"} </div>

          <div
            className="absolute w-full"
            style={{
              bottom: "10px",
            }}
          >
            <div>
              <div style={{ color: "silver" }}>ใช้ 500 คะแนน</div>
              <button
                className=" w-6\/12 bg-green-mbk text-white font-bold uppercase px-3 py-2 text-sm rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                style={{ width: "50%" }}
                // onClick={validation}
              >
                {"แลกคูปอง"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Rewardredeem;
