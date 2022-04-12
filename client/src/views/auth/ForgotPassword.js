import React from "react";
import { Link } from "react-router-dom";

export default function Login() {
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
                  <p>Login</p>
                </a>
              </div>
            </div>
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
              <div className="rounded-t mb-0 px-3 py-3">
              </div>
              <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                <form>
                  <div className="flex flex-wrap mt-6 relative">
                    <div className="lg:w-3/12  margin-auto ">
                      <label
                        className="block text-blueGray-600 text-sm font-bold mb-2"
                        htmlFor="grid-password"
                      >
                        Username
                    </label>
                    </div>
                    <div className="lg:w-9/12 ">
                      <input
                        type="email"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder="Email"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap mt-6 relative">
                    <div className="lg:w-3/12 margin-auto">
                      <label
                        className="block text-blueGray-600 text-sm font-bold mb-2"
                        htmlFor="grid-password"
                      >
                        Password
                      </label>
                    </div>
                    <div className="lg:w-9/12">
                      <input
                        type="password"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder="Password"
                      />
                    </div>
                  </div>

                  {/* <div className="mt-6">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        id="customCheckLogin"
                        type="checkbox"
                        className="form-checkbox border-2 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                      />
                      <span className="ml-2 text-sm font-semibold text-blueGray-600">
                        Remember me
                      </span>
                    </label>
                  </div> */}


                  <div className="flex flex-wrap mt-6 relative">
                    <div className="w-1/2">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          id="customCheckLogin"
                          type="checkbox"
                          className="form-checkbox border-2 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                        />
                        <span className="ml-2 text-sm font-semibold text-blueGray-600">
                          Remember me
                        </span>
                      </label>
                    </div>
                    <div className="w-1/2 text-right">
                      <a
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                        className="text-black"
                      >
                        <small>Forgot password?</small>
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-wrap mt-6 relative">
                    <div className="w-1/2">
                      {/* <a
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                        className="text-black"
                      >
                        <small>Forgot password?</small>
                      </a> */}
                    </div>
                    <div className="w-1/2 text-right">
                        <button
                          className="bg-green-mbk text-white active:bg-green-mbk text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                          type="button"
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
