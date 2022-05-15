import React, { useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import axios from "services/axios";
import { useToasts } from "react-toast-notifications";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function ResetPassword() {
  const { addToast } = useToasts();
  const [confirmPassword, setConfirmPassword] = useState(false);
  const [valueConfirm, setValueConfirm] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);
  const [passwordConfirmShown, setPasswordConfirmShown] = useState(false);
  let { id } = useParams();
  let history = useHistory();

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  const togglePasswordConfirm = () => {
    setPasswordConfirmShown(!passwordConfirmShown);
  };

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string().required("* กรุณากรอกรหัสผ่าน"),
    }),
    onSubmit: (values) => {
      if (!confirmPassword) {
        const data = { id: id, password: values.password };
        axios.put("users/updatePassword", data).then((response) => {
          if (!response.data.errors) {
            addToast("เปลี่ยนแปลงรหัสผ่านเสร็จเรียบร้อย", {
              appearance: "success",
              autoDismiss: true,
            });
            history.push("/auth/login");
          } else {
            addToast("Oops, something went wrong. Try again", {
              appearance: "error",
              autoDismiss: true,
            });
          }
        });
      }
    },
  });

  /*ตรวจสอบข้อมูล รหัสผ่านตรงกัน*/
  const validateConfirm = (e) => {
    if (e !== formik.values.password) setConfirmPassword(true);
    else setConfirmPassword(false);
  };

  return (
    <>
      <div className="container mx-auto px-4 h-full">
        <div className="flex content-center items-center justify-center h-full">
          <div className="w-full lg:w-5/12 px-4 text-center">
            <div className="flex flex-wrap mt-6 relative justify-center">
              <div className="่">
                <span className="text-green-mbk text-3xl">
                  <p className="mb-0">Reset Password</p>
                </span>
              </div>
            </div>
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
              <div className="rounded-t mb-0 px-3 py-3"></div>
              <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                <form onSubmit={formik.handleSubmit}>
                  <div className="flex flex-wrap mt-6 relative">
                    <div className="lg:w-3/12 margin-auto-t-r  ">
                      <label
                        className="block text-blueGray-600 text-sm font-bold mb-2 text-left" 
                        htmlFor="grid-password"
                      >
                        Password
                      </label>
                    </div>
                    <div className="lg:w-9/12 ">
                      <span
                        onClick={togglePassword}
                        className="z-3 h-full leading-snug font-normal text-blueGray-600 absolute right-2  bg-transparent text-sm py-2"
                      >
                        <i
                          className={
                            passwordShown ? "fas fa-eye-slash" : "fas fa-eye"
                          }
                        ></i>
                      </span>
                      <input
                        type={passwordShown ? "text" : "password"}
                        maxLength="100"
                        className="border-0 px-2 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder="Password"
                        id="password"
                        name="password"
                        onChange={(e) => {
                          if (e.target.value !== valueConfirm) {
                            setConfirmPassword(e.target.value);
                          } else if (
                            (e.target.value === "" && valueConfirm === "") ||
                            e.target.value === valueConfirm
                          ) {
                            setConfirmPassword(null);
                          }
                          formik.handleChange(e);
                        }}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap relative">
                    <div className="lg:w-3/12 margin-auto-t-r "></div>
                    <div className="lg:w-9/12">
                      {formik.touched.password && formik.errors.password ? (
                        <div className="text-sm py-2 px-2 text-red-500">
                          {formik.errors.password}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex flex-wrap mt-6 relative">
                    <div className="lg:w-3/12 margin-auto-t-r ">
                      <label
                        className="block text-blueGray-600 text-sm font-bold mb-2 text-left"
                        htmlFor="grid-password"
                      >
                        Confirm Password
                      </label>
                    </div>
                    <div className="lg:w-9/12 ">
                      <span
                        onClick={togglePasswordConfirm}
                        className="z-3 h-full leading-snug font-normal text-blueGray-600 absolute right-2  bg-transparent text-sm py-2"
                      >
                        <i
                          className={
                            passwordConfirmShown
                              ? "fas fa-eye-slash"
                              : "fas fa-eye"
                          }
                        ></i>
                      </span>
                      <input
                        type={passwordConfirmShown ? "text" : "password"}
                        maxLength="100"
                        className="border-0 px-2 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder="Confirm Password"
                        id="confirmPassword"
                        name="confirmPassword"
                        onChange={(e) => {
                          validateConfirm(e.target.value);
                          setValueConfirm(e.target.value);
                        }}
                        value={valueConfirm}
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap relative">
                    <div className="lg:w-3/12 margin-auto-t-r "></div>
                    <div className="lg:w-9/12">
                      {confirmPassword ? (
                        <div className="text-sm py-2 px-2 text-red-500">
                          * รหัสผ่านไม่ตรงกัน
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex flex-wrap mt-6 relative">
                    <div className="w-1/2 margin-auto text-left">
                      <Link
                        className="cursor-pointer link-focus text-sm font-bold text-blue-mbk "
                        to="/auth/login"
                      >
                        {" "}
                        Go to Login{" "}
                      </Link>
                    </div>
                    <div className="w-1/2 text-right">
                      <button
                        className="bg-gold-mbk text-white active:bg-gold-mbk text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                        type="submit"
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
