import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Spinner from "components/Loadings/spinner/Spinner";
import { useToasts } from "react-toast-notifications";
import { path } from "services/liff.services";
import { IsNullOrEmpty } from "services/default.service";
import * as Storage from "@services/Storage.service";
import * as fn from "@services/default.service";
// components

const ShowProducts = () => {
    const history = useHistory();
    const { addToast } = useToasts();
    const [isLoading, setIsLoading] = useState(false);
    const [cartNumberBadge, setcartNumberBadge] = useState(fn.getCartNumberBadge());
    const [spin, setspin] = useState(1);
    const { id } = useParams();
    const [products, setproducts] = useState(
        {
            id: 6,
            img: require("assets/img/mbk/no-image.png").default,
            detail:
                "flashsale 1flashsale 1flashsale 1flashsale 1flashsale 1flashsale 1",
            endtime: "2022-05-24 13:00",
            time: "",
            price: 100,
            discount: 9.80,
            status: null
        },
    );
    const spinButton = (e) => {
        if (e === "plus") {
            setspin(spin + 1)
        } else {
            setspin(spin - 1)
        }
    }

    const NumberBadge = () => {
        setcartNumberBadge(fn.getCartNumberBadge())
    }
    const add_to_cart = () => {
        Storage.set_add_to_cart({ id: id, quantity: spin })
        NumberBadge()

        addToast("คุณได้เพิ่มสินค้าลงในรถเข็นเรียบร้อยแล้ว", {
            appearance: "success",
            autoDismiss: true,
        });
    }
    // NumberBadge()
    let sale = !IsNullOrEmpty(products.discount) ? ((products.discount / products.price) * 100).toFixed(2) : null
    return (


        <>
            {isLoading ? <Spinner customText={"Loading"} /> : null}
            <div className="bg-green-mbk">
                <div
                    style={{ height: "40px" }}
                    className=" noselect text-lg text-white font-bold text-center "
                >
                    {"ร้านค้าออนไลน์"}
                </div>
            </div>

            <div className="flex relative " style={{ height: "35px", alignItems: "center" }}>

                <div className="px-2 absolute flex" style={{
                    right: "0",
                    alignItems: "center"
                }}>
                    <i className="fas fa-cart-plus relative icon-cart"></i>
                    {!IsNullOrEmpty(cartNumberBadge) ?
                        <div className="cart-number-badge" style={{
                        }}>{cartNumberBadge} </div>
                        : null}
                </div>
            </div>
            <div className="liff-inline" />


            {/* products */}
            <div style={{ width: "98%", margin: "auto" }}>
                <div>
                    <img
                        style={{ margin: "auto" }}
                        src={products.img}
                        alt="flash_sale"
                        className="w-32 border-2 border-blueGray-50"
                    ></img>
                </div>
                <div className="font-bold mt-2"> ราคาสินค้า </div>
                <div
                    className="flex mt-2"
                    style={{
                        color:
                            products.discount !== null
                                ? "rgba(0,0,0,.54)"
                                : "#000",

                    }}
                >
                    <div style={{
                        textDecoration:
                            products.discount !== null ? "line-through" : "none",
                    }}>
                        {"฿" + products.price}
                    </div>
                    {products.discount !== null ? (
                        <div style={{ color: "red", paddingLeft: "10px" }}>
                            {"฿" + products.discount}
                        </div>
                    ) : null}
                    {products.discount !== null ? (

                        <div className="absolute text-white" style={{ borderRadius: "5px", padding: "0 10px", right: "10px", background: "red" }}>
                            {"SALE " + sale + "%"}
                        </div>
                    ) : null}
                </div>
            </div>
            <div className="liff-inline" />

            <div style={{ width: "98%", margin: "auto" }}>
                <div className="font-bold mt-2"> รายละเอียดสินค้า </div>
                <div className="mt-2"> {products.detail} </div>
            </div>
            <div
                className="mt-2"
                style={{ width: "100%", borderBottom: "1px solid #eee" }}
            ></div>
            <div style={{ width: "98%", margin: "auto" }}>
                <div className="mt-2">
                    <div className="flex" style={{ color: "gray", alignItems: "center" }}>
                        <div className=" px-2">จำนวน</div>
                        <button
                            name="minus"
                            disabled={spin === 0 ? true : false}
                            style={{
                                width: "35px",
                                border: "1px solid #ddd",
                                height: "35px",
                                outline: "none",
                                color: spin === 0 ? "gray" : "#000"
                            }} onClick={() => {
                                if (spin !== 0) {
                                    spinButton("minus")
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
                            value={spin}
                            onChange={(e) => {
                                console.log(e.target.value)
                                let value = e.target.value
                                if (!fn.IsNullOrEmpty(value)) {
                                    value = parseInt(e.target.value)
                                }
                                setspin(value)
                            }}
                            onBlur={(e) => {
                                let value = e.target.value
                                if (fn.IsNullOrEmpty(value)) {
                                    value = 0
                                    setspin(value)
                                }
                            }} />
                        <button name="plus"
                            style={{
                                width: "35px",
                                border: "1px solid #ddd",
                                height: "35px",
                                outline: "none",
                                color: "#000"
                            }} onClick={() => {
                                spinButton("plus")
                            }}>
                            <i className="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div className="liff-inline" />
            <div
                className=" "
                style={{ height: "calc(100vh - 230px)", marginTop: "-1px" }}
            >
                <div
                    style={{
                        width: "90%",
                        padding: "10px",
                        margin: "auto",
                    }}
                >
                    <>{"id " + id}</>
                </div>
            </div>

            <div className="absolute w-full flex" style={{ bottom: "40px" }}>
                <div style={{ width: "50%", padding: "10px" }}>
                    <div
                        className="bg-green-mbk text-white text-center text-lg  font-bold "
                        style={{
                            margin: "auto",
                            height: "45px",
                            borderRadius: "10px",
                            padding: "5px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                        onClick={add_to_cart}
                    >
                        {"เพิ่มไปยังรถเข็น"}
                    </div>
                </div>
                <div style={{ width: "50%", padding: "10px" }}>
                    <div
                        className="bg-yellow-mbk  text-white text-center text-lg  font-bold "
                        style={{
                            margin: "auto",
                            height: "45px",
                            borderRadius: "10px",
                            padding: "5px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                        onClick={() => {
                            Storage.set_add_to_cart({ id: id, quantity: spin })
                            // history.push(path.member);
                        }}
                    >
                        {"ซื้อสินค้า"}
                    </div>
                </div>
            </div>
        </>
    );
};
export default ShowProducts;
