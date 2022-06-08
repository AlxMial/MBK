import React from "react";
import { useHistory, Link } from "react-router-dom";
import axios from "services/axios";
import urlForgot from "services/urlForgot";
import { useToasts } from "react-toast-notifications";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function ForgotPassword() {
  const { addToast } = useToasts();
  let history = useHistory();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("* กรุณากรอก Email"),
    }),
    onSubmit: (values) => {
      axios.get(`/users/getemail/${values.email}`).then((response) => {
        if (response.data !== null) {
          sendmail(values.email, response.data.id);
        } else {
          addToast("ไม่พบอีเมลในระบบ กรุณาทำการกรอกอีเมลใหม่อีกครั้ง", {
            appearance: "warning",
            autoDismiss: true,
          });
        }
      });
    },
  });

  const sendmail = (tomail, id) => {
    const fullName = localStorage.getItem("fullName");
    axios
      .post("mails", {
        frommail: "no-reply@prg.co.th",
        password: "Tus92278",
        tomail: tomail,
        fullName: fullName,
        resetUrl: urlForgot + `/auth/resetpassword/${id}`,
      })
      .then((response) => {
        if (response.data.msg === "success") {
          // addToast("ส่ง Email สำเร็จ กรุณราทำการตรวจสอบ Email", {
          //   appearance: "success",
          //   autoDismiss: true,
          // });
        } else if (response.data.msg === "fail") {
          addToast("Oops, something went wrong. Try again", {
            appearance: "error",
            autoDismiss: true,
          });
        }
      });
    history.push("/auth/forgotreturn");
  };

  return (
    <>
      <div className="container mx-auto px-4 h-full">
        <div className="flex content-center items-center justify-center h-full">
          <div className="w-full lg:w-5-5/12 px-4 text-center">
            <div className="flex flex-wrap mt-6 relative justify-center">
              <div className="่">
                <span className="text-green-mbk text-3xl">
                  <p className="mb-0">Forgot Password</p>
                </span>
              </div>
            </div>
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
            <div className="rounded-t mb-0 px-3 py-3"></div>
              <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                <form onSubmit={formik.handleSubmit}>
                  <div className="flex flex-wrap mt-6 relative">
                    <div className="lg:w-3/12  margin-auto-t-r ">
                      <label
                        className="block text-blueGray-600 text-sm font-bold mb-2 text-left"
                        htmlFor="grid-password"
                      >
                        Email
                      </label>
                    </div>
                    <div className="lg:w-9/12 ">
                      <input
                        type="email"
                        className="border-0 px-2 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder="Email"
                        id="email"
                        name="email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                        autoComplete="emailxxx"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap relative">
                    <div className="lg:w-3/12 "></div>
                    <div className="lg:w-9/12 text-left">
                      {formik.touched.email && formik.errors.email ? (
                        <div className="text-sm py-2 px-2 text-red-500">
                          {formik.errors.email}
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
