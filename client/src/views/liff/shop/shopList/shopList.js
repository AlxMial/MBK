import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import Spinner from "components/Loadings/spinner/Spinner";
import { path } from "services/liff.services";
import SlideShow from "../SlideShow";
import axios from "services/axios";
import * as fn from "services/default.service";
import FilesService from "../../../../services/files";
import Select from "react-select";
import { styleSelectLine } from "assets/styles/theme/ReactSelect";
import * as Storage from "@services/Storage.service";
import * as Session from "@services/Session.service";
import { get_shopcart } from "@services/liff.services";
// import ImageUC from "components/Image/index";
import FlashsaleUC from "./flashsaleUC";
import StockominalUC from "./stockominal";
import { useDispatch } from "react-redux";
import { backPage } from "redux/actions/common";

const useStyle = styleSelectLine();
// components

const ShopList = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [ImgBanner, setImgBanner] = useState([]);
  const [IsImgBanner, setIsImgBanner] = useState(true);

  const [y, setY] = useState(0);

  const [category, setcategory] = useState(0);
  const [productCategory, setproductCategory] = useState([]);

  const [cartNumberBadge, setcartNumberBadge] = useState(null);
  const [tbStock, settbStock] = useState([]); //ทั้งหมด

  const [selectMenu, setselectmenu] = useState(1); //ทั้งหมด

  const [tbStockiewNominal, settbStockiewNominal] = useState([]); //แสดงตาม category
  const [tbStockiewFlashSale, settbStockiewFlashSale] = useState([]); //แสดงตาม category

  const [isLoadingData, setisLoadingData] = useState(false); //แสดงตาม category

  const setselectMenu = (e) => {
    setselectmenu(e);
    setcategoryview(category, e);
  };

  const setcategoryview = (id, e) => {
    setcategory(id);
    setisLoadingData(true);
    setTimeout(() => {
      if (id === 0) {
        let tbStockiewNominal = [];
        let tbStockiewFlashSale = [];
        let dataTemp = tbStock;
        if (e == 2) {
          dataTemp = dataTemp.filter((e) => {
            if (e.isBestSeller) {
              return e;
            }
          });
        }

        dataTemp.filter((e) => {
          if (!e.isFlashSale) {
            tbStockiewNominal.push(e);
          } else {
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
                tbStockiewFlashSale.push(e);
              } else {
                tbStockiewNominal.push(e);
              }
            } else {
              tbStockiewNominal.push(e);
            }
          }
        });
        settbStockiewNominal(tbStockiewNominal);
        settbStockiewFlashSale(tbStockiewFlashSale);
        setisLoadingData(false);
      } else {
        let dataTemp = tbStock;
        if (e == 2) {
          dataTemp = dataTemp.filter((e) => {
            if (e.isBestSeller) {
              return e;
            }
          });
        }

        let tbStockview = dataTemp.filter((e, i) => {
          if (e.productCategoryId === id) {
            return e;
          }
        });

        let tbStockiewNominal = [];
        let tbStockiewFlashSale = [];
        tbStockview.filter((e) => {
          if (!e.isFlashSale) {
            tbStockiewNominal.push(e);
          } else {
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
              if (today > startTimeCampaign && today < endTimeCampaign) {
                tbStockiewFlashSale.push(e);
              } else {
                tbStockiewNominal.push(e);
              }
            } else {
              tbStockiewNominal.push(e);
            }
          }
        });
        settbStockiewNominal(tbStockiewNominal);
        settbStockiewFlashSale(tbStockiewFlashSale);
        setisLoadingData(false);
      }
    }, 100);
  };
  //#region รูป Banner
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
  const fetchproductCategory = async () => {
    await axios.get("productCategory/getProductCategory").then((response) => {
      if (response.status) {
        let tbProductCategory = [{ value: 0, label: "สินค้าตามหมวดหมู่" }];
        response.data.tbProductCategory.map((e, i) => {
          tbProductCategory.push({ value: e.id, label: e.name });
        });
        setproductCategory(tbProductCategory);
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
  //#endregion รูป Banner

  //#region
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
          settbStock(tbStock);
          let tbStockiewNominal = [];
          let tbStockiewFlashSale = [];
          tbStock.filter((e) => {
            if (e.isFlashSale === false) {
              tbStockiewNominal.push(e);
            } else {
              if (fn.isFlashSale(e)) {
                tbStockiewFlashSale.push(e);
              } else {
                tbStockiewNominal.push(e);
              }
            }
          });
          settbStockiewNominal(tbStockiewNominal);
          settbStockiewFlashSale(tbStockiewFlashSale);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  //#endregion

  const listenScrollEvent = (e) => {
    const scrollTop = e.currentTarget.scrollTop;
    setY(scrollTop);
  };

  const Get_shopcart = () => {
    get_shopcart({ uid: Session.getLiff().uid }, (res) => {
      if (res.data.status) {
        if (res.data.shop_orders) {
          setcartNumberBadge(res.data.shop_orders.length);
        }
      }
    });
  };
  useEffect(() => {
    dispatch(backPage(false));
    fetchDataImgBanner();
    fetchDatatbStock();
    fetchproductCategory();
    Get_shopcart();
  }, []);

  let isFlashsale = false;
  tbStockiewFlashSale.map((e, i) => {
    if (e.isFlashSale) {
      isFlashsale = true;
    }
  });
  return (
    <>
      {isLoading ? <Spinner customText={"Loading"} /> : null}
      <div className="h-full">
        <div
          style={{
            height: 150 - y + "px",
            margin: "auto",
            display: y > 120 ? "none" : "",
          }}
          className={"wfull animated-SlideShow "}
        >
          {ImgBanner.length > 0 && IsImgBanner ? (
            <SlideShow
              img={ImgBanner}
              duration={5000}
              setcategoryview={setcategoryview}
              selectMenu={selectMenu}
            />
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

        <div
          className="flex relative  mt-2"
          style={{ height: "40px", alignItems: "center", fontSize: "12px" }}
        >
          <div
            className="px-2"
            style={{
              textDecoration: selectMenu == 1 ? "underline" : "",
              textUnderlineOffset: "5px",
              width: "80px",
              color: selectMenu == 1 ? "#007a40" : "#000",
            }}
            onClick={() => {
              setselectMenu(1);
            }}
          >
            สินค้าทั้งหมด
          </div>
          <div
            className="px-2"
            style={{
              textDecoration: selectMenu == 2 ? "underline" : "",
              textUnderlineOffset: "5px",
              width: "70px",
              color: selectMenu == 2 ? "#007a40" : "#000",
            }}
            onClick={() => {
              setselectMenu(2);
            }}
          >
            สินค้าขายดี
          </div>
          <div className="px-2" style={{ width: "calc(100% - 185px)" }}>
            {productCategory.length > 0 ? (
              <Select
                className="text-gray-mbk   w-full border-none"
                isSearchable={false}
                // style={{ margin: "0" }}
                id={"category"}
                name={"category"}
                // placeholder={lbl}
                onChange={(e) => {
                  setcategoryview(e.value, selectMenu);
                }}
                value={productCategory.filter(
                  (option) => option.value === category
                )}
                options={productCategory}
                styles={useStyle}
              />
            ) : null}
          </div>
          <div
            className="px-2 absolute flex"
            style={{ right: "0" }}
            onClick={() => {
              Storage.removeconpon_cart();
              history.push(path.showCart);
            }}
          >
            <i
              className="fas fa-shopping-cart relative icon-cart"
              style={{ color: "#d0b027" }}
            ></i>
            {!fn.IsNullOrEmpty(cartNumberBadge) ? (
              cartNumberBadge > 0 ? (
                <div className="cart-number-badge" ><div className="absolute" style={{ paddingTop: "2px" }}>{cartNumberBadge}</div></div>
              ) : null
            ) : null}
          </div>
        </div>
        <div className="liff-inline" />
        {isLoadingData ? null : (
          <div
            id="scroll"
            className="product-scroll "
            style={{
              width: "90%",
              margin: "auto",
              height: "calc(100% - " + (y > 120 ? 58 : 210 - y) + "px)",
              overflow: "scroll",
            }}
            onScroll={listenScrollEvent}
          >
            {/* flash_sale */}
            {isFlashsale ? <FlashsaleUC data={tbStockiewFlashSale} /> : null}

            <StockominalUC data={tbStockiewNominal} />
          </div>
        )}
      </div>
    </>
  );
};
export default ShopList;
