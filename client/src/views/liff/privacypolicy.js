import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { path } from "@services/liff.services";
// components
const Privacypolicy = () => {
  let history = useHistory();
  const [Data, setData] = useState({
    policy1: false,
    policy2: false,
    policy3: false,
  });
  const handleChange = (e) => {
    const { name } = e.target;
    let value = !Data[name];
    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const windowclose = () => {
    console.log("window close");
  };
  const allow = () => {
    ///
    history.push(path.otp);
  };
  return (
    <>
      <div className="bg-green-mbk" style={{ height: "calc(100% - 100px)" }}>
        <div
          className="line-scroll"
          style={{
            width: "90%",
            backgroundColor: "#FFF",
            height: "calc(100% - 400px)",
            padding: "10px",
            margin: "auto",
            borderRadius: "10px",
          }}
        >
          เงื่อนไขการใช้งาน 1. ผู้ใช้งานต้องยอมรับข้อตกลงและเงื่อนไขของ
          Mahboonkrongrice ก่อนเข้าเป็นสมาชิกในการใช้งาน
          โดยสมาชิกไม่สามารถยกเลิกการยอมรับดังกล่าวได้
          ทั้งนี้การใช้งานโปรแกรมนี้
          จะต้องยอมรับข้อตกลงการใช้งานที่เกี่ยวเนื่องกับ Mahboonkrongrice
          วิธีการซื้อสินค้า วิธีการสะสมคะแนน และรับสิทธิพิเศษต่างๆ
          หากข้อตกลงนี้มีเนื้อหาที่ขัดกับข้อตกลงการใช้งานให้ถือบังคับใช้ตามที่ข้อตกลงการใช้งานแอปพลิเคชั่น
          Line @mahboonkrongrice เป็นหลัก 2.
          กรณีที่ผู้ใช้งานยังไม่บรรลุนิติภาวะต้องได้รับความยินยอมจากผู้แทนโดยชอบธรรม
          (รวมถึงการยอมรับข้อตกลงนี้) ก่อนใช้งาน 3.
          สำหรับสมาชิกที่ยังไม่บรรลุนิติภาวะในขณะที่ยอมรับข้อตกลงนี้และใช้งานโปรแกรมนี้หลังจากบรรลุนิติภาวะแล้ว
          จะถือว่าสมาชิกดังกล่าวยอมรับการกระทำทุกอย่างที่ผ่านมาเกี่ยวกับโปรแกรมนี้
          4. ข้อตกลงและเงื่อนไขดังกล่าวอาจมีการเปลี่ยนแปลงตามที่บริษัทฯ
          พิจารณาและเห็นสมควร โดยไม่ต้องแจ้งก่อนล่วงหน้า 5. หากบริษัทฯ
          มีการเปลี่ยนแปลงข้อตกลงนี้ จะแสดงบนเว็บไซต์ของบริษัท
          และให้การเปลี่ยนแปลงข้อตกลงนี้มีผลบังคับใช้ทันทีที่แสดงข้อมูลดังกล่าว
          6. หากสมาชิกไม่ยอมรับการเปลี่ยนแปลงตามข้อตกลงนี้
          โปรดหยุดการใช้งานโปรแกรมนี้ทันที
          ซึ่งกรณีดังกล่าวอาจทำให้คะแนนที่สะสมเป็นโมฆะ โดยบริษัทฯ
          มิจำเป็นต้องรับผิดชอบใด ๆ ต่อความเสียหายอันอาจเกิดต่อสมาชิก 7.
          ผู้ที่สามารถสมัครเป็นสมาชิกโปรแกรมนี้ ต้องมีอายุตั้งแต่ 13
          ปีบริบูรณ์ขึ้นไปและพำนักอยู่ในประเทศไทยเท่านั้น 8.
          ผู้ที่มีความประสงค์จะเป็นสมาชิก
          ต้องสมัครสมาชิกโดยลงทะเบียนข้อมูลสมาชิกและรหัสผ่านตามที่บริษัทฯ
          กำหนดในการใช้งานโปรแกรมนี้ 9. สมาชิกสามารถสร้างบัญชีได้ท่านละ 1
          บัญชีเท่านั้น ผู้ที่เป็นสมาชิกอยู่แล้วไม่สามารถสมัครสมาชิกเพิ่มได้ 10.
          บริษัทฯ
          จะมอบบริการเกี่ยวกับโปรแกรมนี้ให้ตามข้อมูลที่สมาชิกให้ไว้เท่านั้น
          กรณีเกิดความเสียหาย เช่น ของรางวัลส่งไปไม่ถึงสมาชิก ฯลฯ
          เนื่องจากการปลอมแปลงข้อมูลสมาชิก กรอกข้อมูลผิดหรือไม่ครบถ้วน บริษัทฯ
          ไม่จำเป็นต้องรับผิดชอบต่อความเสียหายดังกล่าว 11.
          สมาชิกต้องรักษารหัสผ่านที่ลงทะเบียนไว้เป็นอย่างดี
          และไม่ให้บุคคลอื่นใดนำไปใช้ บริษัทฯ
          จะถือว่าทุกการกระทำที่ดำเนินไปโดยใช้รหัสผ่านที่ลงทะเบียนไว้เป็นการกระทำของสมาชิกเจ้าของรหัสผ่านดังกล่าวทั้งหมด
          หากสมาชิกไม่สามารถเข้าใช้งานได้เนื่องจากลืมรหัสผ่านที่ลงทะเบียนไว้
          บริษัทฯ ไม่ต้องรับผิดชอบใด ๆ
          ต่อความเสียหายที่เกิดขึ้นกับสมาชิกจากการกระทำดังกล่าว 12.
          สมาชิกไม่สามารถยกเลิกการเป็นสมาชิกได้ 13.
          สมาชิกสามารถใช้โปรแกรมนี้เพื่อวัตถุประสงค์ในการใช้งานส่วนบุคคลเท่านั้น
          14. ในการใช้งานโปรแกรมนี้ สมาชิกต้องจัดเตรียมอุปกรณ์เทคโนโลยีสารสนเทศ
          ซอฟต์แวร์ เครือข่ายอินเทอร์เน็ต
          และสภาพแวดล้อมการใช้งานอินเทอร์เน็ตอื่นที่จำเป็นด้วยความรับผิดชอบของตนเองและด้วยค่าใช้จ่ายด้วยตนเอง
          15. บริษัทฯ สามารถเปลี่ยนแปลง เพิ่มเติม หรือลบ
          เนื้อหาของโปรแกรมนี้ทั้งหมดหรือบางส่วนได้
          โดยไม่จำเป็นต้องแจ้งให้สมาชิกทราบล่วงหน้า และบริษัทฯ
          ไม่ต้องรับผิดชอบต่อความเสียหายที่อาจเกิดต่อสมาชิกจากการกระทำดังกล่าว
        </div>
        <div style={{ width: "90%", margin: "auto" }}>
          <div className="mt-5">
            <label className="inline-flex items-center cursor-pointer">
              <input
                id="remember"
                type="checkbox"
                name="policy1"
                className="form-checkbox border-2 rounded text-gold-mbk ml-1 w-5 h-5 ease-linear transition-all duration-150"
                onChange={handleChange}
                checked={Data.policy1}
                style={{ alignSelf: "stretch" }}
              />
              <span
                className="ml-2 text-sm font-normal text-white line-clamp-3"
                style={{ whiteSpace: "pre-wrap" }}
              >
                {"ข้าพเจ้าได้อ่านและยอมรับ ข้อกำหนดและเงื่อนไข"}
                <span style={{ fontSize: "0.745rem" }}>
                  {"\nI have read and agree with the Terms and Conditions"}{" "}
                </span>
              </span>
            </label>

            <label className="inline-flex items-center cursor-pointer"></label>
          </div>
          <div className="mt-5">
            <label className="inline-flex items-center cursor-pointer">
              <input
                id="remember"
                type="checkbox"
                name="policy2"
                className="form-checkbox border-2 rounded text-gold-mbk ml-1 w-5 h-5 ease-linear transition-all duration-150"
                onChange={handleChange}
                checked={Data.policy2}
                style={{ alignSelf: "stretch" }}
              />
              <span
                className="ml-2 text-sm font-normal text-white line-clamp-3"
                style={{ whiteSpace: "pre-wrap" }}
              >
                {"ข้าพเจ้าได้อ่านและยอมรับ นโยบายความเป็นส่วนตัว"}
                <span style={{ fontSize: "0.745rem" }}>
                  {"\nI have read and agree with the Privacy Policy."}{" "}
                </span>
              </span>
            </label>
          </div>
          <div className="mt-5">
            <label className="inline-flex items-center cursor-pointer">
              <input
                id="remember"
                type="checkbox"
                name="policy3"
                className="form-checkbox border-2 rounded text-gold-mbk ml-1 w-5 h-5 ease-linear transition-all duration-150"
                onChange={handleChange}
                checked={Data.policy3}
                style={{ alignSelf: "stretch" }}
              />
              <span
                className="ml-2 text-sm font-normal text-white"
                style={{ whiteSpace: "pre-wrap" }}
              >
                {"เพื่อรับข่าวสารล่าสุด และข้อมูลโปรโมชั่นต่าง ๆ"}
                <span style={{ fontSize: "0.745rem" }}>
                  {"\nTo receive special promotion and update news."}{" "}
                </span>
              </span>
            </label>
          </div>
        </div>

        <div className="relative  px-4  flex-grow flex-1 flex mt-5">
          <button
            className=" w-6\/12 bg-green-mbk text-white font-bold uppercase px-3 py-2 text-sm rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
            style={{ width: "50%" }}
            onClick={windowclose}
          >
            {"ยกเลิก"}
          </button>
          <button
            className=" w-6\/12 bg-gold-mbk text-white font-bold uppercase px-3 py-2 text-sm rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
            style={{ width: "50%" }}
            onClick={allow}
          >
            {"อนุญาต"}
          </button>
        </div>
      </div>
    </>
  );
};

export default Privacypolicy;
