import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Spinner from "components/Loadings/spinner/Spinner";
import { useToasts } from "react-toast-notifications";
import { path } from "services/liff.services";
// components

const Cancel = () => {
  const history = useHistory();
  const { addToast } = useToasts();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      {isLoading ? <Spinner customText={"Loading"} /> : null}
      <div className="bg-green-mbk">
        <div
          style={{ height: "40px" }}
          className=" noselect text-lg text-white font-bold 
      text-center "
        >
          {"คำสั่งซื้อของฉัน"}
        </div>
      </div>
      <div
        className=" "
        style={{ height: "calc(100vh - 230px)", marginTop: "-1px" }}
      >
        <div
          style={{
            width: "90%",
            padding: "10px",
            margin: "auto",
          }}
        >
          <>detail Return Page</>
        </div>
      </div>

      <div className="absolute w-full" style={{ bottom: "40px" }}>
        <div
          className="bg-green-mbk text-white text-center font-bold "
          style={{
            margin: "auto",
            width: "90%",
            height: "35px",
            borderRadius: "10px",
            padding: "5px",
          }}
          onClick={() => {
            history.push(path.member);
          }}
        >
          {"กลับหน้าหลัก"}
        </div>
      </div>
    </>
  );
};
export default Cancel;
