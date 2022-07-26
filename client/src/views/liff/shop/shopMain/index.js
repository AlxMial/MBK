import React, { useState, useEffect } from 'react'
// import SlideShow from './SlideShowMain'
import axios from "services/axios";
import Spinner from "components/Loadings/spinner/Spinner";
import FilesService from "../../../../services/files";
import { backPage } from 'redux/actions/common';
import { useDispatch } from 'react-redux';
import '../shop.scss'
import FlashsaleUC from '../shopList/flashsaleUC';
import * as fn from "services/default.service";
import BestSellerUC from './bestSellerUC';
import ProductCategory from './productCategory';
import Slide from './Slide';


const ShopMain = () => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [ImgBanner, setImgBanner] = useState([]);
    const [IsImgBanner, setIsImgBanner] = useState(true);
    const [tbStockViewFlashSale, settbStockViewFlashSale] = useState([]); //แสดงตาม category
    const [tbBestSeller, setTbBestSeller] = useState([]); //แสดงตาม category

    const fetchDataImgBanner = async () => {
        await axios.get("stock/getImgBanner").then((response) => {
            if (response.data.ImgBanner.length > 0) {
                let ImgBanner = response.data.ImgBanner;
                bufferToBase64(ImgBanner);
            } else {
                setIsImgBanner(false);
            }
        });
    };

    const bufferToBase64 = async (ImgBanner) => {
        let dataImg = [];
        for (var i = 0; i < ImgBanner.length; i++) {
            const base64 = await FilesService.buffer64UTF8(ImgBanner[i].image.data);
            ImgBanner[i].image = base64;
            dataImg.push({
                url: base64,
                typeLink: ImgBanner[i].typeLink,
                stockId: ImgBanner[i].stockId,
                productCategoryId: ImgBanner[i].productCategoryId,
            });
        }
        setImgBanner(dataImg);
    };

    const fetchDatatbStock = async () => {
        setIsLoading(true);
        await axios
            .post("stock/getStock")
            .then((response) => {
                if (response.data.status) {
                    let tbStock = response.data.tbStock;
                    tbStock = tbStock.filter((e) => {
                        if (e.productCount > 0) {
                            return e;
                        }
                    });
                    // console.log('tbStock', tbStock);
                    let tbBestSeller = [];
                    let tbStockViewFlashSale = [];

                    tbStock.filter((e) => {
                        if (e.isBestSeller) {
                            tbBestSeller.push(e);
                        }
                        if (e.isFlashSale) {
                            let startDateCampaign = new Date(
                                new Date(e.startDateCampaign)
                                    .toISOString()
                                    .split("T")[0]
                                    .replace(/-/g, "/")
                            );
                            let endDateCampaign = new Date(
                                new Date(e.endDateCampaign)
                                    .toISOString()
                                    .split("T")[0]
                                    .replace(/-/g, "/")
                            );
                            let today = new Date(
                                new Date().toISOString().split("T")[0].replace(/-/g, "/")
                            );
                            if (today >= startDateCampaign && today <= endDateCampaign) {
                                let startTimeCampaign = new Date(
                                    new Date().toISOString().split("T")[0].replace(/-/g, "/") +
                                    " " +
                                    e.startTimeCampaign
                                );
                                let endTimeCampaign = new Date(
                                    new Date().toISOString().split("T")[0].replace(/-/g, "/") +
                                    " " +
                                    e.endTimeCampaign
                                );
                                today = new Date();
                                if (today >= startTimeCampaign && today <= endTimeCampaign) {
                                    tbStockViewFlashSale.push(e);
                                }
                            }
                        }
                    });
                    settbStockViewFlashSale(tbStockViewFlashSale);
                    setTbBestSeller(tbBestSeller);
                    setIsLoading(false);
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        dispatch(backPage(false));
        fetchDataImgBanner();
        fetchDatatbStock();
    }, []);

    const _h_section1 = (window.innerWidth - 90) + 'px';
    const _width = window.innerWidth + 'px';
    const _height = window.innerWidth + 'px';
    const _flashSales_height = (`calc(${_width} - 45px - 1.25rem - 40px)`);
    const _min_h_category = (`calc((${_height} / 2) - 28px)`);
    let isFlashsale = false;
    tbStockViewFlashSale.map((e, i) => {
        if (e.isFlashSale) {
            isFlashsale = true;
        }
    });

    return (
        <>
            {isLoading ? <Spinner customText={"Loading"} /> : null}
            <div className="h-full" style={{ paddingBottom: '110px' }}>
                <div className="banner-section relative" style={{ height: _h_section1 }}>
                    {/* <div className="bg-green-mbk w-full absolute top-0" style={{ height: '90px' }}></div> */}
                    <div className={"w-full h-full animated-SlideShow "}
                    >
                        {ImgBanner.length > 0 && IsImgBanner ? (
                            // <SlideShow
                            //     img={ImgBanner}
                            // />
                            <Slide ImgBanner={ImgBanner} />
                        ) : !IsImgBanner ? (
                            <div
                                className="flex w-full text-green-mbk font-bold"
                                style={{
                                    height: "100%",
                                    backgroundColor: "#ddd",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                {"ไม่มีแบนเนอร์"}
                            </div>
                        ) : (
                            <div className="animated-img"></div>
                        )}
                    </div>
                </div>
                {isFlashsale && (
                    <div className="w-full flashSale-section bg-red-600 p-3 px-6" style={{ height: _height }}>
                        <div className="w-full flex justify-center py-2" style={{ height: '40px' }}>
                            <div className="img-flash-sale px-2 bg-white shadow flex justify-center items-center" style={{ borderRadius: '3px' }}>
                                <img
                                    src={require("assets/img/shop-main/flashSale.png").default}
                                    alt="flashSale"
                                    style={{
                                        objectFit: "fill",
                                        maxWidth: "100px",
                                        height: "auto",
                                    }}
                                ></img>
                            </div>
                        </div>
                        <div className="bg-white  mt-3" style={{ borderRadius: '15px' }}>
                            {tbStockViewFlashSale && (
                                <div
                                    id="scroll"
                                    className="product-scroll w-full"
                                    style={{
                                        margin: "auto",
                                        height: 'auto',
                                        overflow: "scroll",
                                    }}
                                >
                                    <FlashsaleUC
                                        isShowLogo={false}
                                        data={tbStockViewFlashSale} />
                                </div>
                            )}
                        </div>
                    </div>)}
                <div className="w-full best-seller-section p-3" style={{ height: _height }}>
                    <div className="w-full flex justify-center py-2" style={{ height: '40px' }}>
                        <div className="img-best-seller px-2 bg-white shadow flex justify-center items-center" style={{ borderRadius: '3px' }}>
                            <img
                                src={require("assets/img/shop-main/best-seller.png").default}
                                alt="best-seller"
                                style={{
                                    objectFit: "fill",
                                    maxWidth: "100px",
                                    height: "auto",
                                }}
                            ></img>
                        </div>
                    </div>
                    <div className="bg-white p-3" style={{ borderRadius: '15px' }}>
                        {tbBestSeller && (
                            <div
                                id="scroll"
                                className="product-scroll w-full"
                                style={{
                                    margin: "auto",
                                    height: _flashSales_height,
                                    overflow: "scroll",
                                }}
                            >
                                <BestSellerUC
                                    isShowLogo={false}
                                    data={tbBestSeller} />
                            </div>
                        )}
                    </div>
                </div>
                <ProductCategory />
                <div className="footer" style={{ height: '110px' }}></div>
            </div >
        </>
    )
}

export default ShopMain