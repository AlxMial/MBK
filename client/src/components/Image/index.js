import React, { useEffect, useState } from "react";
import axios from "services/axios";
import FilesService from "../../services/files";
const ImageUC = (prop) => {
  const [Img, setImg] = useState(null);
  const { ...other } = prop;
  const fetchImg = async () => {
    await axios
      .post("stock/getImg", {
        id: other.relatedid,
        relatedTable: other.relatedtable,
      })
      .then((response) => {
        if (response.data.status) {
          if (response.data.data.length > 0) {
            tobase64(response.data.data[0].image.data);
          } else {
            tobase64(require("assets/img/mbk/no-image.png").default);
          }
        } else {
          tobase64(require("assets/img/mbk/no-image.png").default);
        }
      });
  };
  const tobase64 = async (data) => {
    const base64 = await FilesService.buffer64UTF8(data);
    setImg(base64);
  };
  useEffect(() => {
    fetchImg();
  }, []);

  return <img {...other} src={Img}></img>;
};

export default ImageUC;
