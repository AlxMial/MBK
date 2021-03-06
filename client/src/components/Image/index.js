import React, { useEffect, useState } from "react";
import axios from "services/axios";
import FilesService from "../../services/files";
import * as Session from "@services/Session.service";
const ImageUC = (prop, { setErrorFile }) => {
  const [Img, setImg] = useState(null);
  const [ImgisLoading, setImgisLoading] = useState(false);
  const { ...other } = prop;

  const fetchImg = async () => {
    const imgStorage = Session.getImageStorage(
      other.relatedid + "," + JSON.stringify(other.relatedtable)
    );
    setImgisLoading(true);
    if (imgStorage == null) {
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
                tobase64(
                  response.data.data[0].image.data,
                  true,
                  other.relatedid + "," + JSON.stringify(other.relatedtable)
                );
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
        .finally(() => {});
    } else {
      setImgisLoading(false);
      setImg(imgStorage);
    }
  };

  const tobase64 = async (data, storage, id) => {
    const base64 = await FilesService.buffer64UTF8(data);
    setImg(base64);
    setImgisLoading(false);
    //เก็บ
    if (storage == true) {
      Session.setImageStorage({ id: id, data: base64 });
    }
  };
  useEffect(() => {
    fetchImg();
  }, []);
  let classNamediv = other.classnamediv===undefined ?"w-full h-full flex" :other.classnamediv;
  let className = other.className;
  return (
    <div
      className={
        classNamediv + (other.divimage ? " " + other.divimage : "")
      }
      style={{
        justifyContent: "center",
      }}
    >
      {ImgisLoading ? (
        <div {...other} className={className}></div>
      ) : (
        <img
          {...other}
          id={other.relatedid + other.relatedtable}
          className={
            "object-cover " +
            className.repeat("animated-img", "") +
            (other.imgclassname ? " " + other.imgclassname : "")
          }
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
