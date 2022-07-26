import React, { useState, useEffect } from "react";
import PageTitle from "views/admin/PageTitle";
import "antd/dist/antd.css";
import InputSearchUC from "components/InputSearchUC";
import ButtonModalUC from "components/ButtonModalUC";
import { useDispatch } from "react-redux";
import { fetchLoading, fetchSuccess } from "redux/actions/common";
import axios from "services/axios";
import * as fn from "@services/default.service";
import List from "./list";
import Info from "./info";
const ProductCategorylist = () => {
  const dispatch = useDispatch();
  const InputSearch = (e) => {
    e = e.toLowerCase();
    if (!fn.IsNullOrEmpty(e)) {
      setdataListSearch(
        dataList.filter((f) => {
          if (
            f.categoryName.includes(e) ||
            (f.description || "-").includes(e) ||
            (f.isInactive ? "แสดง" : "ไม่แสดง").includes(e)
          ) {
            return f;
          }
        })
      );
    } else {
      setdataListSearch(dataList);
    }
  };
  const [dataList, setdataList] = useState([]);
  const [dataListSearch, setdataListSearch] = useState([]);

  const [infoModel, setinfoModel] = useState({ open: false });
  const fetchData = async () => {
    dispatch(fetchLoading());
    const res = await axios.get("productCategory");
    const productCategory = await res.data.tbProductCategory;
    if (productCategory) {
      setdataList(productCategory);
      setdataListSearch(productCategory);
    }
    dispatch(fetchSuccess());
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <PageTitle page="ProductCategory" />
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
                  onClick={() =>
                    setinfoModel({
                      open: true,

                      dataModel: {
                        categoryName: null,
                        description: null,
                        isInactive: true,
                        dataImage: null,
                        isDeleted: false,
                        errors: { categoryName: null },
                      },
                      onClose: () => {
                        fetchData();
                        setinfoModel({ open: false });
                      },
                    })
                  }
                  label="เพิ่มหมวดหมู่สินค้า"
                />
              </div>
            </div>
          </div>
          <List dataList={dataListSearch} fetchData={fetchData} />
        </div>
      </div>
      {infoModel.open ? <Info infoModel={infoModel} /> : null}
    </>
  );
};

export default ProductCategorylist;
