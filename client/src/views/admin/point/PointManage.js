import React,{ useEffect ,useState } from "react";
import "antd/dist/antd.css";
import { Tabs } from "antd";
/* Service */
import PointRegister from "./PointRegister";
import PointEcommerce from "./PointEcommerce";
import PointCode from "./PointCode";
import PointStore from "./PointStore";
import { getPermissionByUserName } from "services/Permission";

export default function PointManage() {
  const { TabPane } = Tabs;
  const [typePermission, setTypePermission] = useState("");
  /* Set useState */

  /* Method Condition */

  function callback(key) {
    //console.log(key);
  }

  /*ตรวจสอบข้อมูล รหัสผ่านตรงกัน*/
  async function fetchData() {}

  const fetchPermission = async  () => {
    const role = await getPermissionByUserName();
    setTypePermission(role);
  }

  
  useEffect( () => {
    fetchPermission();
  }, []);

  return (
    <>
      <div className="flex flex-warp mb-4">
        <span className="text-sm margin-auto-t-b font-bold ">
          <i className="fas fa-cog"></i>&nbsp;&nbsp;
        </span>
        <span className="text-base margin-auto-t-b font-bold">
          CRM&nbsp;&nbsp;/&nbsp;&nbsp;
        </span>
        <span className="text-sm margin-auto-t-b font-bold ">
          <i className="fas fa-chess"></i>&nbsp;&nbsp;
        </span>
        <span className="text-base margin-auto font-bold">เงื่อนไขคะแนน</span>
      </div>
      <Tabs defaultActiveKey="1" onChange={callback} type="card">
        <TabPane tab="Register" key="1">
          <PointRegister />
        </TabPane>
        {/* <TabPane tab="E-Commerce" key="2">
          <PointEcommerce />
        </TabPane> */}
        <TabPane tab="Code" key="3" disabled={((typePermission === "1") ? false : true)}>
          <PointCode />
        </TabPane>
        <TabPane tab="Store" key="4">
          <PointStore />
        </TabPane>
      </Tabs>
    </>
  );
}
