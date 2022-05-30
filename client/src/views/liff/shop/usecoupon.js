import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Spinner from "components/Loadings/spinner/Spinner";
import { useToasts } from "react-toast-notifications";
import InputMask from "react-input-mask";
import axios from "services/axios";
import { path } from "services/liff.services";
import { IsNullOrEmpty } from "services/default.service";
import * as Storage from "@services/Storage.service";
import * as fn from "@services/default.service";
import ImageUC from "components/Image/index";
// components

const ShowCart = () => {
  const history = useHistory();
  const { addToast } = useToasts();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {}, []);
  return (
    <>
      {isLoading ? <Spinner customText={"Loading"} /> : null}
      <div className="bg-green-mbk">
        <div
          style={{ height: "40px" }}
          className=" noselect text-lg text-white font-bold text-center "
        >
          {"ส่วนลด"}
        </div>
      </div>

      <div
        className="mt-2 line-scroll relative"
        style={{
          height: "750px",
          overflow: "scroll",
          width: "95%",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <div className="flex mt-2" style={{ width: "90%", margin: "auto" }}>
          <div className="noselect  w-full margin-auto-t-b">
            <InputMask
              className={
                " text-center line-input border-0 px-2 py-2 placeholder-blueGray-300 text-gray-mbk bg-white  text-sm  w-full "
              }
              maxLength={22}
              value={""}
              name={"code"}
              type={"text"}
              onChange={(e) => {}}
              placeholder={"XXXX-XXXX-XXXX"}
              maskChar=" "
              //   disabled={e.state ? true : false}
              //   readOnly={e.state ? true : false}
            />
          </div>
        </div>
        <div className="mt-2">
          <div className="px-2 " style={{ width: "50%", margin: "auto" }}>
            <div className="w-full px-2">
              <div
                className="flex bg-lemon-mbk text-white text-center text-lg  font-bold "
                style={{
                  margin: "auto",
                  height: "45px",
                  borderRadius: "10px",
                  padding: "5px",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                // onClick={add_to_cart}
              >
                {"ใช้คูปอง"}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute w-full flex" style={{ bottom: "40px" }}>
          <div style={{ width: "100%", padding: "10px" }}>
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
                history.push(path.showCart);
              }}
            >
              {"กลับไปที่ชำระเงิน"}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ShowCart;
