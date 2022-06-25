import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { IsNullOrEmpty } from "@services/default.service";
import moment from "moment";
import Spinner from "components/Loadings/spinner/Spinner";
import MyPoint from "../myPointUC";
// components

const Reward = () => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  return (
    <>
      {isLoading ? <Spinner customText={"Loading"} /> : null}
      {/* card */}
      <div style={{ marginTop: "-200px", position: "absolute", width: "100%" }}>
        <MyPoint />

        <div className="mt-2">
          <div style={{ width: "90%", margin: "auto" }}>
            <div className="flex h-10">
              <div className="bg-green-mbk" style={{ width: "10px" }}></div>
              <div style={{ padding: "10px" }}>รางวัลที่สามารถแลกได้</div>
            </div>
            <div>detail</div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Reward;
