import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Spinner from "components/Loadings/spinner/Spinner";
import { useToasts } from "react-toast-notifications";
import { path } from "services/liff.services";
import axios from "services/axios";
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
    const [tbStock, settbStock] = useState(null);
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
    // let sale = !IsNullOrEmpty(products.discount) ? ((products.discount / products.price) * 100).toFixed(2) : null

    const fetchDatatbStock = async () => {
        await axios.post("stock/getStock", { id: [id] }).then((response) => {
            if (response.data.status) {
                let tbStock = response.data.tbStock
                settbStock(tbStock[0])
            } else {
                settbStock([])
                // error
            }
        });
    };
    useEffect(() => {
        fetchDatatbStock()
    }, []);
    return (
        <>
            {isLoading ? <Spinner customText={"Loading"} /> : null}
            {tbStock != null ?
                <>
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
                            <object style={{ margin: "auto" }} className="w-32" data={require("assets/img/mbk/no-image.png").default} type="image/png">
                                <img
                                    src={tbStock.img}
                                    alt="flash_sale"
                                    className="w-32 border-2 border-blueGray-50"
                                ></img>
                            </object >
                        </div>
                        <div className="font-bold mt-2"> ราคาสินค้า </div>
                        <div
                            className="flex mt-2"
                            style={{
                                color:
                                    tbStock.discount > 0
                                        ? "rgba(0,0,0,.54)"
                                        : "#000",

                            }}
                        >
                            <div style={{
                                textDecoration:
                                    tbStock.discount > 0 ? "line-through" : "none",
                            }}>
                                {"฿" + tbStock.price}
                            </div>
                            {tbStock.discount > 0 ? (
                                <div style={{ color: "red", paddingLeft: "10px" }}>
                                    {"฿" + tbStock.discount}
                                </div>
                            ) : null}
                            {tbStock.discount > 0 ? (

                                <div className="absolute text-white" style={{ borderRadius: "5px", padding: "0 10px", right: "10px", background: "red" }}>
                                    {"SALE -" + tbStock.percent + "%"}
                                </div>
                            ) : null}
                        </div>
                    </div>
                    <div className="liff-inline" />

                    <div style={{ width: "98%", margin: "auto" }}>
                        <div className="font-bold mt-2"> รายละเอียดสินค้า </div>
                        <div className="mt-2"> {tbStock.description} </div>
                    </div>
                    <div
                        className="mt-2"
                        style={{ width: "100%", borderBottom: "1px solid #eee" }}
                    ></div>
                    <div style={{ width: "98%", margin: "auto" }}>
                        <div className="mt-2">
                            <div className="flex " style={{ color: "gray", alignItems: "center" }}>
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

                                <div className=" px-2 absolute" style={{ right: "10px" }}>{"มีสินค้าทั้งหมด "+tbStock.productCount+" ชิ้น"}</div>
                            </div>
                        </div>
                    </div>
                    <div className="liff-inline" />
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
                : null}
        </>
    );
};
export default ShowProducts;
