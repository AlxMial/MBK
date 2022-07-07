import React, { useState, useEffect } from "react";
import { useToasts } from "react-toast-notifications";
import Select from "react-select";
import ImageUC from "components/Image/index";
import { Radio } from "antd";
import { gettbPayment } from "@services/liff.services";
const PaymentModel = ({
  sumprice,
  setpaymentID,
  RadioPayment,
  setRadio,
  paymentID,
  disabled,
}) => {
  const { addToast } = useToasts();
  const [optionPayment, setPayment] = useState([]);
  const [resetRadio, setresetRadio] = useState(false);

  const gettbpayment = async (option) => {
    gettbPayment((res) => {
      if (res.data.code === 200) {
        let option = res.data.tbPayment;
        for (var i = 0; i < option.length; i++) {
          option[i].value = option[i].id;
        }
        console.log(option);
        setPayment(option);
        setpaymentID(option[0].id);
      }
    });
  };
  useEffect(() => {
    gettbpayment();
  }, []);
  return (
    <div
      className="w-full  relative mt-2"
      style={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="w-full mb-2">
        <div style={{ width: "90%", margin: "auto" }}>
          <div className="w-full font-bold">ช่องทางการชำระเงิน</div>
        </div>
      </div>
      <div
        className="px-5 py-5"
        style={{
          width: "90%",
          margin: "auto",
          border: "1px solid var(--mq-txt-color, rgb(170, 170, 170))",
          borderRadius: "10px",
        }}
      >
        <Radio.Group
          className="w-full radio-lbl-full"
          disabled={disabled}
          onChange={(e) => {
            if (e.target.value == 2) {
              if (sumprice >= 500) {
                // addToast("เปลียนช่องทางการชำระเงิน", {
                //   appearance: "success",
                //   autoDismiss: true,
                // });

                gettbpayment(e.target.value);
                setRadio(e.target.value);
              } else {
                addToast("ยอดรวมสินค้าต้องมากกว่า 500 บาท", {
                  appearance: "warning",
                  autoDismiss: true,
                });
              }
            } else {
              // addToast("เปลียนช่องทางการชำระเงิน", {
              //   appearance: "success",
              //   autoDismiss: true,
              // });

              gettbpayment(e.target.value);
              setRadio(e.target.value);
            }
          }}
          value={RadioPayment}
        >
          <Radio value={1} className="w-full Radio-Payment ">
            <div>
              <div className="flex mb-2 text-sm">
                <i
                  className="fas fa-landmark flex "
                  style={{ alignItems: "center", color: "rgb(208 175 44)" }}
                ></i>
                <div className="font-bold px-2">โอนผ่านธนาคาร</div>
              </div>
              {!resetRadio ? (
                <div
                  className="mb-2"
                  style={{
                    display: RadioPayment == 2 ? "none" : "",
                    height: "100px",
                  }}
                >
                  {optionPayment.length > 0 ? (
                    <Select
                      className="text-gray-mbk mt-1 text-sm w-full border-none select-address "
                      isSearchable={false}
                      value={optionPayment.filter((o) => o.value === paymentID)}
                      options={optionPayment}
                      formatOptionLabel={({
                        id,
                        bankName,
                        accountNumber,
                        bankBranchName,
                      }) => (
                        <div>
                          <div
                            className="flex text-sm"
                            style={{ alignItems: "center" }}
                          >
                            <div style={{ height: "15px", width: "15px" }}>
                              {id != null ? <GetImageUC id={id} /> : null}
                            </div>
                            <div className="px-2 font-bold"> {bankName} </div>
                          </div>
                          <div
                            className="text-liff-gray-mbk"
                            style={{ fontWeight: "100" }}
                          >
                            {"เลขบัญชี : " + accountNumber}
                          </div>
                          <div
                            className="text-liff-gray-mbk"
                            style={{ fontWeight: "100" }}
                          >
                            {"สาขา : " + bankBranchName}
                          </div>
                        </div>
                      )}
                      onChange={(e) => {
                        addToast("เปลียนธนาคาร", {
                          appearance: "success",
                          autoDismiss: true,
                        });
                        setresetRadio(true);
                        setTimeout(() => {
                          setresetRadio(false);
                        }, 100);
                        setpaymentID(e.id);
                      }}
                    />
                  ) : null}
                </div>
              ) : (
                <div
                  style={{
                    height: "100px",
                  }}
                ></div>
              )}
            </div>
          </Radio>

          <Radio value={2} className="w-full Radio-Payment ">
            <div>
              <div className="flex  ">
                <i
                  className="fas fa-credit-card flex "
                  style={{ alignItems: "center", color: "rgb(208 175 44)" }}
                ></i>
                <div className="font-bold px-2">ผ่านบัตรเครดิต</div>
              </div>
            </div>
          </Radio>
        </Radio.Group>
      </div>
    </div>
  );
};

const GetImageUC = ({ id }) => {
  return (
    <ImageUC
      style={{ height: "15px", width: "15px" }}
      find={1}
      relatedid={id}
      relatedtable={["payment"]}
      alt=""
      className=" animated-img "
    ></ImageUC>
  );
};

export default PaymentModel;
