import React, { useState } from "react";
import { path } from "services/liff.services";
import { useHistory } from "react-router-dom";
// components

const GameUC = ({ UseGame }) => {
    const history = useHistory();
    const [image360, setimage360] = useState(false);
    return (
        <>
            <div style={{ height: "100%", backgroundColor: "#007a40" }}>
                <div className="w-full">

                    <div className="w-full flex" style={{
                        justifyContent: "center"
                        , color: "#FFFFFF"
                        , fontSize: "50px"
                        , height: "350px"
                        , border: "1px solid "
                    }}>
                        <div className="relative" style={{ width: "350px", height: "350px" }} >
                            <div className="absolute" style={{ width: "320px", height: "320px" }}>
                                <img
                                    style={{
                                        width: "320px",
                                        height: "320px",
                                    }}
                                    src={require("assets/img/mbk/game_bg.png").default}
                                    alt="game_bg"
                                    className=" absolute"
                                ></img>
                            </div>
                            <div className="absolute " style={{ width: "320px", height: "320px" }}>
                                <img
                                    style={{
                                        width: "150px",
                                        height: "150px",
                                        left: "27.7%",
                                        top: "23.5%"
                                    }}
                                    src={require("assets/img/mbk/game.png").default}
                                    alt="game_bg"
                                    className={" absolute " + (image360 ? "image360" : "")}
                                ></img>
                            </div>

                        </div>
                    </div>

                    <div className="w-full flex" style={{
                        justifyContent: "center"
                        , color: "#FFFFFF"
                        , fontSize: "30px"
                        , height: "50px"
                    }}>
                        หมุนวงล้อ
                    </div>
                    <div className="w-full flex" style={{
                        justifyContent: "center"
                        , color: "#FFFFFF"
                        , fontSize: "30px"
                        , height: "50px"
                    }}>
                        เพื่อรับของรางวัล
                    </div>
                </div>

                <div className="w-full" style={{ position: "absolute", bottom: "10px" }}>
                    <div className="w-full flex mb-2" style={{ justifyContent: "center" }}>
                        <div className=" w-full" style={{
                            padding: "10px", margin: "auto",
                            width: "50%"
                        }}>
                            <div
                                className="flex bg-gold-mbk text-white text-center text-lg  font-bold "
                                style={{
                                    margin: "auto",
                                    height: "40px",
                                    borderRadius: "20px",
                                    padding: "5px",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                                onClick={() => {
                                    setimage360(true)
                                    setTimeout(() => {
                                        setimage360(false)
                                        UseGame()
                                    }, 2000);
                                }}
                            >
                                {"เปิด"}
                            </div>
                        </div>
                    </div>
                    <div className="w-full flex mb-2" style={{ justifyContent: "center" }}>
                        <div className=" w-full" style={{
                            padding: "10px", margin: "auto",
                            width: "50%"
                        }}>
                            <div
                                className="flex bg-green-mbk text-white text-center text-lg  font-bold "
                                style={{
                                    margin: "auto",
                                    height: "40px",
                                    borderRadius: "20px",
                                    padding: "5px",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: "1px solid #FFFFFF"
                                }}
                                onClick={() => {
                                    history.push(path.reward)

                                }}
                            >
                                {"กลับไปแลกรางวัล"}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
};
export default GameUC;
