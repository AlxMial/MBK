import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import axios from "services/axios";
import { fetchLoading, fetchSuccess } from "redux/actions/common";
import * as yup from "yup";
import { useToasts } from "react-toast-notifications";
import InputSearchUC from "components/InputSearchUC";
import ButtonModalUC from "components/ButtonModalUC";
import StockInfo from "./StockInfo";
import StockList from "./Stocklist";
import PageTitle from "views/admin/PageTitle";
import FilesService from "../../../../services/files";
import { onSaveImage } from "services/ImageService";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

const Stock = () => {
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const [listStock, setListStock] = useState([]);
  const [listSearch, setListSearch] = useState([]);
  const [open, setOpen] = useState(false);
  let history = useHistory();

  const _defaultImage = {
    id: null,
    image: null,
    relatedId: null,
    relatedTable: "stock1",
    isDeleted: false,
    addBy: null,
    updateBy: null,
  };

  const _arrDefaultImage = [
    _defaultImage,
    { ..._defaultImage, relatedTable: "stock2" },
    { ..._defaultImage, relatedTable: "stock3" },
    { ..._defaultImage, relatedTable: "stock4" },
    { ..._defaultImage, relatedTable: "stock5" },
  ];

  const [stockImage, setStockImage] = useState(_arrDefaultImage);
  const [isImageCoverNull, setIsImageCoverNull] = useState(false);

  const fetchData = async () => {
    dispatch(fetchLoading());
    await axios.get("stock").then(async (response) => {
      if (!response.data.error && response.data.tbStock) {
        let _stockData = response.data.tbStock;
        _stockData = await _stockData.map((stock) => {
          if (stock.productCount - stock.buy > 10) {
            stock.status = "พร้อมขาย";
          } else if (stock.productCount - stock.buy <= 0) {
            stock.status = "หมด";
          } else {
            stock.status = "เหลือน้อย";
          }
          return stock;
        });
        setOpen(false);
        dispatch(fetchSuccess());
        setListStock(_stockData);
        setListSearch(_stockData);
      }
    });
  };

  useEffect(() => {
    // fetchPermission();
    fetchData();
  }, []);

  const InputSearch = (e) => {
    e = e.toLowerCase();
    if (e === "") {
      setListStock(listSearch);
    } else {
      setListStock(
        listSearch.filter(
          (x) =>
            x.productName.toString().toLowerCase().includes(e) ||
            x.categoryName.toString().toLowerCase().includes(e) ||
            x.status.toString().toLowerCase().includes(e) ||
            x.price.toString().toLowerCase().includes(e) ||
            x.buy.toString().toLowerCase().includes(e) ||
            x.productCount.toString().toLowerCase().includes(e)
        )
      );
    }
  };

  const openModal = async (id) => {
    formik.resetForm();
    setStockImage(_arrDefaultImage);
    const data = listStock.filter((x) => x.id === id);
    if (data && data.length > 0) {
      for (const field in data[0]) {
        formik.setFieldValue(field, data[0][field], false);
      }

      await getStockImage(id);
    }
    setOpen(true);
  };

  const getStockImage = async (id) => {
    dispatch(fetchLoading());
    const res = await axios.get(`image/getAllByRelated/${id}/stock`);

    let _stockImage = [..._arrDefaultImage];
    if (res && res.data.tbImage && res.data.tbImage.length > 0) {
      res.data.tbImage.map((item) => {
        const base64 = FilesService.buffer64UTF8(item.image);
        _stockImage = _stockImage.map((x) => {
          if (x.relatedTable === item.relatedTable) {
            return { ...item, image: base64 };
          }
          return x;
        });
      });
    }
    setStockImage(_stockImage);
    dispatch(fetchSuccess());
  };

  const handleChangeImage = async (e) => {
    e.preventDefault();
    dispatch(fetchLoading());
    const base64 = await FilesService.convertToBase64(e.target.files[0]);
    const index = parseInt(e.target.id.replace("file", ""));
    setStockImage(
      stockImage.map((x, i) => {
        if (i + 1 === index) {
          return { ...x, image: base64 };
        }
        return x;
      })
    );
    if (index === 1) {
      setIsImageCoverNull(false);
    }
    dispatch(fetchSuccess());
  };

  const formik = useFormik({
    initialValues: {
      id: "",
      isBestSeller: false,
      productName: "",
      productCategoryId: "",
      price: "",
      discount: "",
      percent:"",
      productCount: "",
      weight: "",
      description: "",
      descriptionPromotion: "",
      isFlashSale: false,
      startDateCampaign: "",
      endDateCampaign: "",
      startTimeCampaign: "",
      endTimeCampaign: "",
      isInactive: true,
      isDeleted: false,
      addBy: "",
      updateBy: "",
    },
    validationSchema: yup.object({
      productName: yup.string().required("* กรุณากรอก ชื่อสินค้า"),
      productCategoryId: yup.string().required("* กรุณากรอก หมวดหมู่สินค้า"),
      price: yup.string().required("* กรุณากรอก ราคา"),
      discount: yup.string().required("* กรุณากรอก ส่วนลด"),
    }),
    onSubmit: (values) => {
      dispatch(fetchLoading());
      const cover = stockImage.filter((x) => x.relatedTable === "stock1")[0]
        .image;
      if (!cover) {
        setIsImageCoverNull(true);
        dispatch(fetchSuccess());
      } else {
        values.updateBy = sessionStorage.getItem("user");
        if (values.id) {
          axios.put("stock", values).then(async (res) => {
            if (res.data.status) {
              await saveImage(values.id);
              afterSaveSuccess();
            } else {
              dispatch(fetchSuccess());
              addToast("บันทึกข้อมูลไม่สำเร็จ", {
                appearance: "warning",
                autoDismiss: true,
              });
            }
          });
        } else {
          values.addBy = sessionStorage.getItem("user");
          axios.post("stock", values).then(async (res) => {
            if (res.data.status) {
              await saveImage(res.data.tbStock.id);
              afterSaveSuccess();
            } else {
              dispatch(fetchSuccess());
              addToast("บันทึกข้อมูลไม่สำเร็จ", {
                appearance: "warning",
                autoDismiss: true,
              });
            }
          });
        }
      }
    },
  });

  const afterSaveSuccess = async () => {
    await fetchData();
    history.push(window.location.pathname);
    // setOpen(false);
    // dispatch(fetchSuccess());

    addToast("บันทึกข้อมูลสำเร็จ", {
      appearance: "success",
      autoDismiss: true,
    });
  };

  const saveImage = async (id) => {
    stockImage.forEach(async (item, index) => {
      if (item.image) {
        item.relatedId = id;
        await onSaveImage(item);
      }
    });
  };

  const handleDeleteList = (id) => {
    setListStock(listStock.filter((x) => x.id !== id));
  };

  return (
    <>
      <PageTitle page="stock" />
      <div className="w-full">
        <div
          className={
            "py-4 relative flex flex-col min-w-0 break-words w-full mb-6 border rounded-b bg-white Overflow-list "
          }
        >
          <div className="rounded-t mb-0 px-4 py-3 border-0">
            <div className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap ">
              <div className="w-full lg:w-6/12">
                <InputSearchUC onChange={(e) => InputSearch(e.target.value)} />
              </div>
              <div className={"w-full lg:w-6/12 text-right block"}>
                <ButtonModalUC
                  onClick={() => openModal()}
                  label="เพิ่มสินค้า"
                />
              </div>
            </div>
          </div>
          <StockList
            listStock={listStock}
            openModal={openModal}
            setListStock={handleDeleteList}
          />
        </div>
      </div>
      {open && (
        <StockInfo
          open={open}
          formik={formik}
          handleChangeImage={handleChangeImage}
          isImageCoverNull={isImageCoverNull}
          stockImage={stockImage}
          handleModal={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default Stock;
