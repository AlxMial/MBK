import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "services/axios";
import { useToasts } from "react-toast-notifications";
import "antd/dist/antd.css";
import { Radio } from "antd";
import * as Storage from "../../../services/Storage.service";
/* Service */
import useWindowDimensions from "services/useWindowDimensions";
import ValidateService from "services/validateValue";

export default function PointRegister() {
  /* Set useState */
  const [Active, setActive] = useState("1");
  const [pointRegisterScore, setpointRegisterScore] = useState(0);
  const { height, width } = useWindowDimensions();
  const { addToast } = useToasts();
  const [isNew, setIsNew] = useState(true);

  /* Method Condition */
  const options = [
    { label: "Active", value: "1" },
    { label: "Inactive", value: "2" },
  ];

  /*พิมพ์เบอร์โทรศัพท์*/
  const onHandlepointRegisterScore = (e) => {
    if (
      ValidateService.onHandleNumberChange(e.target.value) !== "" ||
      e.target.value === ""
    ) {
      setpointRegisterScore(e.target.value);
      formik.values.pointRegisterScore = e.target.value;
    }
  };

  /* formik */
  const formik = useFormik({
    initialValues: {
      id: "",
      pointRegisterScore: "",
      isActive: "1",
      isDeleted: false,
    },
    validationSchema: Yup.object({
      pointRegisterScore: Yup.string().required(
        Storage.GetLanguage() === "th"
          ? "* กรุณากรอก คะแนนสำหรับสมาชิกใหม่"
          : "* Please enter your Score"
      ),
    }),
    onSubmit: (values) => {
      if (isNew) {
        axios.post("pointRegister", values).then((res) => {
          if (res.data.status) {
            formik.values.id = res.data.tbPointRegister.id;
            fetchData();
            addToast(
              Storage.GetLanguage() === "th"
                ? "บันทึกข้อมูลสำเร็จ"
                : "Save data successfully",
              { appearance: "success", autoDismiss: true }
            );
          }
        });
      } else {
        axios.put("pointRegister", values).then((res) => {
          if (res.data.status) {
            formik.values.id = res.data.tbPointRegister.id;
            fetchData();
            addToast(
              Storage.GetLanguage() === "th"
                ? "บันทึกข้อมูลสำเร็จ"
                : "Save data successfully",
              { appearance: "success", autoDismiss: true }
            );
          }
        });
      }
    },
  });

  const fetchData = async () => {
    axios.get("pointRegister").then((response) => {
      if (response.data.error) {
      } else {
        if (response.data.tbPointRegister.length > 0) {
          setIsNew(false);
          setActive(response.data.tbPointRegister[0].isActive)
          formik.setFieldValue('id',response.data.tbPointRegister[0].id);
          formik.setFieldValue('pointRegisterScore',response.data.tbPointRegister[0].pointRegisterScore);
          formik.setFieldValue('isActive',response.data.tbPointRegister[0].isActive);
        }
      }
    });
  };

  useEffect(() => {
    setIsNew(true);
    fetchData();
    /* Default Value for Testing */
  }, []);

  return (
    <>
      <div className="w-full">
        <form onSubmit={formik.handleSubmit}>
          <div className="w-full ">
            <div className=" py-4 relative flex flex-col min-w-0 break-words w-full mb-6 border bg-white rounded-b">
              <div className="flex-auto lg:px-10 py-4">
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
                      className="border-0 px-2 text-right py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded w-10/12 text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                      id="pointRegisterScore"
                      name="pointRegisterScore"
                      maxLength={100}
                      onChange={(event) => {
                        onHandlepointRegisterScore(event);
                      }}
                      onBlur={formik.handleBlur}
                      value={formik.values.pointRegisterScore}
                      autoComplete="pointRegisterScore"
                    />
                    <span className="text-blueGray-600 text-sm font-bold mb-2 ml-2">
                      คะแนน
                    </span>
                    {formik.touched.pointRegisterScore &&
                    formik.errors.pointRegisterScore ? (
                      <div className="text-sm py-2 px-2 text-red-500">
                        {formik.errors.pointRegisterScore}
                      </div>
                    ) : null}
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
                        setActive(e.target.value);
                        formik.setFieldValue("isActive", e.target.value);
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
