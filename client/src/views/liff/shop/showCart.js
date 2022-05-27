import React, { useState ,useEffect} from "react";
import { useHistory, useParams } from "react-router-dom";
import Spinner from "components/Loadings/spinner/Spinner";
import { useToasts } from "react-toast-notifications";
import { path } from "services/liff.services";
import { IsNullOrEmpty } from "services/default.service";
import * as Storage from "@services/Storage.service";
import * as fn from "@services/default.service";
// components

const ShowCart = () => {
    const history = useHistory();
    const { addToast } = useToasts();
    const [isLoading, setIsLoading] = useState(false);
    let shop_orders = Storage.get_cart().shop_orders
    const [CartItem, setCartItem] = useState(shop_orders);

    const getProducts = () => {
        let id = []
        CartItem.map((e, i) => {
            id.push(e.id)

        })
        console.log(id)
    }

    useEffect(() => {
        getProducts();
    }, []);
    return (


        <>
            {isLoading ? <Spinner customText={"Loading"} /> : null}
            <div className="bg-green-mbk">
                <div
                    style={{ height: "40px" }}
                    className=" noselect text-lg text-white font-bold text-center "
                >
                    {"รถเข็น"}
                </div>
            </div>

            {/* <div className="liff-inline" /> */}
            <div className="mt-2">
                {[...CartItem].map((e, i) => {
                    return <div key={i}>
                        <div className="flex " style={{ height: "180px ", border: "1px solid red" }}>
                            <div style={{ width: "30%", border: "1px solid red" }}>
                                {"image " + e.id}
                            </div>
                            <div style={{ width: "70%", border: "1px solid red" }} >
                                <div className="flex" style={{ height: "70%", border: "1px solid red" }}>
                                    <div style={{ width: "80%", border: "1px solid red" }}>{"รายละเอียด " + e.id}</div>
                                    <div style={{ width: "20%", border: "1px solid red" }} >{"icon "}</div>
                                </div>
                                <div className="flex relative" style={{ height: "30%", border: "1px solid red", alignItems: "center", justifyContent: "center" }}>
                                    {/* {e.quantity} */}
                                    <div className="absolute" style={{ left: "10px" }}>{"ik8k"}</div>
                                    <div className="flex absolute" style={{ color: "gray", alignItems: "center", right: "10px" }}>
                                        {/* <div className=" px-2">จำนวน</div> */}
                                        <button
                                            name="minus"
                                            // disabled={spin === 0 ? true : false}
                                            style={{
                                                width: "35px",
                                                border: "1px solid #ddd",
                                                height: "35px",
                                                outline: "none",
                                                color: e.quantity === 0 ? "gray" : "#000"
                                            }} onClick={() => {
                                                if (e.quantity !== 0) {
                                                    // spinButton("minus")
                                                }
                                            }}>
                                            <i className="fas fa-minus"></i>

                                        </button>
                                        <input style={{
                                            width: "50px",
                                            border: "1px solid #ddd",
                                            height: "35px",
                                            color: "#000"
                                        }}
                                            type="tel"
                                            value={e.quantity}
                                        // onChange={(e) => {
                                        //     console.log(e.target.value)
                                        //     let value = e.target.value
                                        //     if (!fn.IsNullOrEmpty(value)) {
                                        //         value = parseInt(e.target.value)
                                        //     }
                                        //     setspin(value)
                                        // }}
                                        // onBlur={(e) => {
                                        //     let value = e.target.value
                                        //     if (fn.IsNullOrEmpty(value)) {
                                        //         value = 0
                                        //         setspin(value)
                                        //     }
                                        // }}
                                        />
                                        <button name="plus"
                                            style={{
                                                width: "35px",
                                                border: "1px solid #ddd",
                                                height: "35px",
                                                outline: "none",
                                                color: "#000"
                                            }} onClick={() => {
                                                // spinButton("plus")
                                            }}>
                                            <i className="fas fa-plus"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                })}
            </div >
            <div className="liff-inline" />
            <div className="flex relative" style={{ height: "40px", alignItems: "center", justifyContent: "center" }}>
                <div className="px-2 absolute" style={{ left: "10px" }}> icon </div>
                <div className="px-2 absolute" style={{ left: "50px" }}> รหัสส่วนลด </div>
                <div className="absolute" style={{ right: "10px" }}>{"ใช้ส่วนลด >"}</div>
            </div>
            <div className="liff-inline" />
            <div className="absolute w-full flex" style={{ bottom: "40px" }}>
                <div style={{ width: "100%", padding: "10px" }}>
                    <div
                        className="flex bg-green-mbk text-white text-center text-lg  font-bold "
                        style={{
                            margin: "auto",
                            height: "45px",
                            borderRadius: "10px",
                            padding: "5px",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    // onClick={add_to_cart}
                    >
                        {"กลับไปที่ร้านค้า"}
                    </div>
                </div>

            </div>
        </>
    );
};
export default ShowCart;
