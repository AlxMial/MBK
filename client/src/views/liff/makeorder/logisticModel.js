import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Select from "react-select";
import * as fn from "@services/default.service";
import {
    gettbLogistic,
} from "@services/liff.services";
const LogisticModel = ({ isLogistic, onChange,setisLogistic,setdeliveryCost,settbPromotionDelivery }) => {
    const history = useHistory();

    const [optionLogistic, setoptionLogistic] = useState([]);
    const getTbLogistic = async (option) => {
        gettbLogistic(
            (res) => {
                if (res.data.status) {
                    let option = res.data.tbLogistic
                    let tbPromotionDelivery = res.data.tbPromotionDelivery

                    for (var i = 0; i < option.length; i++) {
                        option[i].value = option[i].id
                        option[i].name = `${option[i].deliveryName}`
                    }
                    setoptionLogistic(option)
                    setisLogistic(option[0].value)
                    setdeliveryCost(option[0].deliveryCost)
                    settbPromotionDelivery(tbPromotionDelivery)
                }
            },
        );
    }
    useEffect(() => {
        getTbLogistic()
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
                    <div className="w-full font-bold">ช่องทางการขนส่ง</div>
                </div>
            </div>
            <div className="px-5 py-5" style={{
                width: "90%", margin: "auto",
                border: "1px solid var(--mq-txt-color, rgb(170, 170, 170))",
                borderRadius: "10px"
            }}>
                <div className="mb-2">

                    {optionLogistic.length > 0 ?
                        <Select
                            className="text-gray-mbk mt-1 text-sm w-full border-none select-Logistic "
                            isSearchable={false}
                            value={optionLogistic.filter(o => o.value === isLogistic)}
                            options={optionLogistic}

                            formatOptionLabel={({ name, description, deliveryCost }) => (
                                <div >
                                    <div className="font-bold">{name}</div>
                                    <div className="w-full text-liff-gray-mbk" style={{
                                        whiteSpace: "break-spaces",
                                    }}>{fn.IsNullOrEmpty(description) ? "-" : description}</div>
                                    <div className="w-full text-liff-gray-mbk" style={{
                                        whiteSpace: "break-spaces",
                                    }}>{deliveryCost == 0 ? "ส่งฟรี" : ("฿ " + fn.formatMoney(deliveryCost))}</div>

                                </div>
                            )}
                            onChange={onChange}
                        />
                        : <div className="animated-img" style={{
                            height: "90px",
                            borderRadius: "20px"
                        }}></div>}

                </div>

            </div>
        </div>
    );
};

export default LogisticModel;
