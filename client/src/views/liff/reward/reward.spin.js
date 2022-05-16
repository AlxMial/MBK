import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "services/axios";
import { useHistory } from "react-router-dom";
import { path } from "@services/liff.services";
import { IsNullOrEmpty } from "@services/default.service";
import * as Session from "@services/Session.service";
import moment from "moment";
// components

const RewardSpen = () => {
  const history = useHistory();
  const { id } = useParams();
  return (
    <>
      {/* card */}
      <div style={{ marginTop: "0px", position: "absolute", width: "100%" }}>
        <div className="mt-6">
          <div style={{ width: "90%", margin: "auto" }}>
            <div>{" RewardSpen id : " + id} </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default RewardSpen;
