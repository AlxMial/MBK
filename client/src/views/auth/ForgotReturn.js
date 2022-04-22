import React from "react";
import { Link } from "react-router-dom";

export default function ForgotReturn() {
  return (
    <>
      <div className="container mx-auto px-4 h-full">
        <div className="flex content-center items-center justify-center h-full">
          <div className="w-full lg:w-4/12 px-4">
          <div className="flex flex-wrap mt-6 relative justify-center">
              <div className="่">
                <a
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                  className="text-green-mbk text-6xl"
                >
                  <p>Reset your password</p>
                </a>
              </div>
            </div>
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
              <div className="rounded-t mb-0 px-3 py-3">
              </div>
              <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                    <div className="flex flex-wrap relative">
                        <div className="justify-center mb-6 w-full flex flex-wrap relative">
                                <img
                                    src={require("assets/img/mbk/logo_mbk.png").default}
                                    alt="..."
                                ></img>
                        </div>
                        <div className="justify-center mb-6 w-full flex flex-wrap relative">
                            <span className=" text-sm">
                                Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.
                            </span>
                        </div>
                        <div className="justify-center  w-full flex flex-wrap relative">
     
                            <Link to="/auth/login">
                                <button
                                    className=" text-white bg-gold-mbk active:bg-gold-mbk   text-sm font-bold px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all"
                                    type="submit"
                                    >
                                    Return to sign in
                                </button>
                            </Link>
                        </div>
                    </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}