import React from "react";
import { useHistory } from "react-router-dom";
import {
  path
} from "@services/liff.services";

const FooterButton = ({ sendOrder, text }) => {
  const history = useHistory();
  return (
    <div className="absolute w-full flex" style={{ bottom: "0", backgroundColor: "#FFFFFF" }}>
      <div style={{ width: "50%", padding: "10px" }}>
        <div
          className="flex bg-green-mbk text-white text-center text-base  font-bold bt-line "
          onClick={() => { history.push(path.shopMain) }}
        >
          {"ไปหน้าร้านค้า"}
        </div>
      </div>
      <div style={{ width: "50%", padding: "10px" }}>
        <div
          className="flex bg-gold-mbk text-white text-center text-base  font-bold bt-line "
          onClick={sendOrder}
        >
          {text}
        </div>
      </div>
    </div>
  );
};

export default FooterButton;
