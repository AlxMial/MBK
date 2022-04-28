import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "services/axios";
import { useToasts } from "react-toast-notifications";
import "antd/dist/antd.css";
import { Radio } from "antd";

/* Service */
import useWindowDimensions from "services/useWindowDimensions";
import ValidateService from "services/validateValue";

export default function PointRegister() {
  /* Set useState */
  const [Active, setActive] = useState("1");
  const [score, setScore] = useState(0);
  const { height, width } = useWindowDimensions();

  /* Method Condition */
  const options = [
    { label: "Active", value: "1" },
    { label: "Inactive", value: "2" },
  ];

  /*พิมพ์เบอร์โทรศัพท์*/
  const onHandleScore = (e) => {
    if (
      ValidateService.onHandleNumberChange(e.target.value) !== "" ||
      e.target.value === ""
    ) {
      setScore(e.target.value);
      formik.values.score = e.target.value;
    }
  };

  /* formik */
  const formik = useFormik({
    initialValues: {
      score: '',
    },
    onSubmit: (values) => {
        console.log(values)
    },
  });

  useEffect(() => {
    /* Default Value for Testing */
  }, []);

  return (
    <>
      <div className="w-full">
        <form onSubmit={formik.handleSubmit}>
          <div className="w-full ">
            <div className="px-4 py-4 relative flex flex-col min-w-0 break-words w-full mb-6 border bg-white rounded-lg">
              <div className="flex-auto lg:px-10 py-10">
                <div className="flex flex-wrap">
                  <div className="w-full lg:w-2/12 px-4 mb-2 margin-auto-t-b">
                    <label
                      className="text-blueGray-600 text-sm font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      คะแนนสำหรับสมาชิกใหม่
                    </label>
                  </div>
                  <div className="w-full lg:w-8/12 px-4 mb-4 margin-auto-t-b">
                    <input
                      type="text"
                      className="border-0 px-2 text-right py-1 placeholder-blueGray-300 text-blueGray-600 bg-white rounded w-10/12 text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                      id="score"
                      name="score"
                      maxLength={100}
                      onChange={(event) => {
                        onHandleScore(event);
                      }}
                      onBlur={formik.handleBlur}
                      value={formik.values.score}
                      autoComplete="score"
                    />
                    <span className="text-blueGray-600 text-sm font-bold mb-2 ml-2">
                      คะแนน
                    </span>
                  </div>

                  <div className="w-full lg:w-2/12 px-4 mb-2 mt-4">
                    <label
                      className="text-blueGray-600 text-sm font-bold mb-2"
                      htmlFor="grid-password"
                    ></label>
                  </div>
                  <div
                    className={
                      "w-full lg:w-8/12 px-4 " +
                      (width < 1024 ? " " : "  mb-4 mt-4")
                    }
                  >
                    <Radio.Group
                      options={options}
                      onChange={(e) => {
                        console.log(e.target.value);
                        setActive(e.target.value);
                      }}
                      value={Active}
                    />
                  </div>
                  <div className="w-full px-4">
                    <div className="relative w-full text-right">
                      <button
                        className={
                          "bg-gold-mbk text-white active:bg-gold-mbk font-bold uppercase text-sm px-2 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                        }
                        type="submit"
                      >
                        บันทึกข้อมูล
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
        
      </div>
    </>
  );
}
