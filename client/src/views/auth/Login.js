import React, { useState, useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "services/axios";
import { useHistory, Link } from "react-router-dom";
import { AuthContext } from "../../services/AuthContext";
import { useToasts } from "react-toast-notifications";
import { useFormik } from "formik";
import * as Yup from "yup";
import useWindowDimensions from "services/useWindowDimensions";
import { GetPermissionByUserName } from "../../services/Permission";

export default function Login() {
  /* Variable Set UseState */
  const { setAuthState } = useContext(AuthContext);
  const { addToast } = useToasts();
  const { height, width } = useWindowDimensions();
  const [passwordShown, setPasswordShown] = useState(false);
  const [typePermission, setTypePermission] = useState("");
  let history = useHistory();
  const dispatch = useDispatch();
  const togglePassword = () => {
    if(formik.values.password !== "")
      setPasswordShown(!passwordShown);
  };

  const formik = useFormik({
    initialValues: {
      userName: "",
      password: "",
      isRemember: false,
    },
    validationSchema: Yup.object({
      userName: Yup.string().required("* กรุณากรอกข้อมูล Username"),
      password: Yup.string().required("* กรุณากรอกข้อมูล Password"),
    }),
    onSubmit: (values) => {
      const data = { userName: values.userName, password: values.password };
      axios.post("/users/login", data).then(async (response) => {
        if (response.data.error) {
          addToast(
            "ไม่สามารถเข้าสู่ระบบได้ เนื่องจาก Username หรือ Passwod ที่คุณป้อนไม่ถูกต้อง",
            {
              appearance: "error",
              autoDismiss: true,
            }
          );
        } else if (width < 768) {
          /*ปรับการ Login Mobile ให้ตรวจสอบเฉพาะ Admin*/
          addToast(
            "ไม่สามารถทำการเข้าสู่ระบบได้ ต้องใช้งานผ่านระบบ Computer เท่านั้น",
            { appearance: "error", autoDismiss: true }
          );
        } else {
          sessionStorage.removeItem("accessToken");
          if (formik.values.isRemember)
            localStorage.setItem(
              "login",
              JSON.stringify({
                userName: values.userName,
                password: values.password,
              })
            );
          else localStorage.removeItem("login");

          addToast("เข้าสู่ระบบสำเร็จ", {
            appearance: "success",
            autoDismiss: true,
          });

          sessionStorage.setItem("accessToken", response.data.token);
          sessionStorage.setItem("roleUser", response.data.role);
          sessionStorage.setItem("user", response.data.userName);
          sessionStorage.setItem(
            "fullName",
            response.data.firstName + " " + response.data.lastName
          );
          setAuthState({
            userName: response.data.userName,
            id: response.data.id,
            status: true,
          });
          //window.location.replace('/admin/users');
          sessionStorage.setItem('linkPage',response.data.link);
          history.push(response.data.link);
          //set loading
          setTimeout(() => {
            //finish loading
          }, 2000);
        }
      });
    },
  });

  const fetchPermission = async () => {
    
  }


  useEffect(() => {
    fetchPermission();
    var retrievedObject = JSON.parse(localStorage.getItem("login"));
    if (retrievedObject !== null) {
      formik.setFieldValue("userName", retrievedObject.userName);
      formik.setFieldValue("password", retrievedObject.password);
      formik.setFieldValue("isRemember", true);
    }
  }, []);

  return (
    <>
      <div className="container mx-auto px-4 h-full">
        <div className="flex content-center items-center justify-center h-full">
          <div className="w-full lg:w-5-5/12 px-4 text-center">
            <div className="flex flex-wrap mt-6 relative justify-center">
              <div className="่">
                <span className="text-green-mbk text-3xl">
                  <p className="mb-0">Login</p>
                </span>
              </div>
            </div>
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
              <div className="rounded-t mb-0 px-3 py-3"></div>
              <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                <form onSubmit={formik.handleSubmit}>
                  <div className="flex flex-wrap mt-6 relative ">
                    <div className="lg:w-3/12 margin-auto-t-r">
                      <label
                        className="block text-blueGray-600 text-sm font-bold mb-2 text-left"
                        htmlFor="grid-password"
                      >
                        Username
                      </label>
                    </div>
                    <div className="lg:w-9/12 ">
                      <input
                        type="text"
                        className="border-0 px-2 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder="Username"
                        id="userName"
                        name="userName"
                        maxLength={50}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.userName}
                      />
                      {/* {formik.touched.userName && formik.errors.userName ? (
                        <div className="text-sm py-2 px-2 text-red-500">
                          {formik.errors.userName}
                        </div>
                      ) : null} */}
                    </div>
                  </div>
                  <div className="flex flex-wrap relative">
                    <div className="lg:w-3/12 "></div>
                    <div className="lg:w-9/12">
                      {formik.touched.userName && formik.errors.userName ? (
                        <div className="text-sm  text-left py-2 px-2 text-red-500">
                          {formik.errors.userName}
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
                        Password
                      </label>
                    </div>
                    <div className="lg:w-9/12">
                      <div>
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
                          className="border-0 px-2 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          placeholder="Password"
                          name="password"
                          id="password"
                          maxLength={50}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.password}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap relative">
                    <div className="lg:w-3/12"></div>
                    <div className="lg:w-9/12 ">
                      {formik.touched.password && formik.errors.password ? (
                        <div className="text-sm py-2 px-2 text-left text-red-500">
                          {formik.errors.password}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex flex-wrap mt-6 relative">
                    <div className="w-1/2 ">
                      <label className="inline-flex items-center cursor-pointer float-left">
                        <input
                          id="remember"
                          type="checkbox"
                          name="isRemember"
                          className="form-checkbox border-2 rounded text-gold-mbk ml-1 w-5 h-5 ease-linear transition-all duration-150"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.isRemember}
                        />
                        <span className="ml-2 text-sm font-semibold text-blueGray-600 text-left">
                          Remember me
                        </span>
                      </label>
                    </div>
                    <div className="w-1/2 text-right">
                      <Link
                        className="cursor-pointer link-focus text-sm font-bold text-blue-mbk"
                        to="/auth/forgotpassword"
                      >
                        {" "}
                        Forgot Password?{" "}
                      </Link>
                    </div>
                  </div>

                  <div className="flex flex-wrap mt-6 relative">
                    <div className="w-1/2"></div>
                    <div className="w-1/2 text-right">
                      <button
                        className="bg-gold-mbk text-white active:bg-gold-mbk text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                        type="submit"
                        // onClick={() => {
                        //   OnHomePage();
                        // }}
                      >
                        Login
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
