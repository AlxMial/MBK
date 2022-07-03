import React, { useEffect, useState } from "react";
import axios from "services/axios";
import FilesService from "../../services/files";
const ImageUC = (prop) => {
  const [Img, setImg] = useState(null);
  const [ImgisLoading, setImgisLoading] = useState(false);
  const { ...other } = prop;
  const fetchImg = async () => {
    setImgisLoading(true);
    await axios
      .post("stock/getImg", {
        id: other.relatedid,
        relatedTable: other.relatedtable,
      })
      .then((response) => {
        if (response.data.status) {
          if (response.data.data.length > 0) {
            if (response.data.data[0].image == null) {
              tobase64(require("assets/img/mbk/no-image.png").default);
            } else {
              tobase64(response.data.data[0].image.data);
            }
          } else {
            tobase64(require("assets/img/mbk/no-image.png").default);
          }
        } else {
          tobase64(require("assets/img/mbk/no-image.png").default);
        }
      })
      .catch(() => {
        setImgisLoading(false);
        tobase64(require("assets/img/mbk/no-image.png").default);
      })
      .finally(() => { });
  };
  const tobase64 = async (data) => {
    const base64 = await FilesService.buffer64UTF8(data);
    setImg(base64);
    setImgisLoading(false);
  };
  useEffect(() => {
    fetchImg();
  }, []);
  let className = other.className;
  return (
    <div className="w-full h-full">
      {ImgisLoading ? (
        <div {...other} className={className}></div>
      ) : (
        <img
          {...other}
          id={other.relatedid + other.relatedtable}
          className={className.repeat("animated-img", "") + (other.imgclassname ? other.imgclassname : "")}
          src={Img}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null;
            currentTarget.src = require("assets/img/mbk/no-image.png").default;
          }}
        ></img>
      )}
    </div>
  );
};

export default ImageUC;
