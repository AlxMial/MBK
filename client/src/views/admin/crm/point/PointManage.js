import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
import { Tabs } from "antd";
import axios from "services/axios";
/* Service */
import PointRegister from "./PointRegister";
import PointEcommerce from "./PointEcommerce";
import PointCode from "./PointCode";
import PointStore from "./PointStore";
import { GetPermissionByUserName } from "services/Permission";
import ConfirmEdit from "components/ConfirmDialog/ConfirmEdit";
import { useToasts } from "react-toast-notifications";

export default function PointManage() {
  const { TabPane } = Tabs;
  const [typePermission, setTypePermission] = useState("");
  const [isModified, setModified] = useState(false);
  const [modalIsOpenEdit, setIsOpenEdit] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const [activeConfirmTab, setActiveConfirmTab] = useState();
  const { addToast } = useToasts();
  const [data, setData] = useState({
    id: "",
    pointRegisterScore: "",
    isActive: "",
    addBy:"",
    updateBy:"",
    isDeleted:false
  });
  function openModalSubject() {
    setIsOpenEdit(true);
  }

  function closeModalSubject() {
    setIsOpenEdit(false);
  }

  const onEditValue = async () => {
    if (data.id === "") {
      setData((prevState) => {
        return {
          ...prevState,
          addBy: localStorage.getItem("user")
        };
      });
      axios.post("pointRegister", data).then((res) => {
        if (res.data.status) {
          setData((prevState) => {
            return {
              ...prevState,
              id: res.data.tbPointRegister.id
            };
          });
          setModified(false);
          addToast("บันทึกข้อมูลสำเร็จ",
            
            { appearance: "success", autoDismiss: true }
          );
        }
      });
    } else {
      axios.put("pointRegister", data).then((res) => {
        if (res.data.status) {
          setModified(false);
          addToast("บันทึกข้อมูลสำเร็จ",
            { appearance: "success", autoDismiss: true }
          );
        }
      });
    }
    setActiveTab(activeConfirmTab);
    closeModalSubject();
  };

  const onReturn = () => {
    closeModalSubject();
  };

  /* Set useState */

  /* Method Condition */
  const changeTab = (activeKey) => {
    setActiveConfirmTab(activeKey);
    if (isModified) openModalSubject();
    else setActiveTab(activeKey);
  };

  const fetchPermission = async () => {
    const role = await GetPermissionByUserName();
    setTypePermission(role);
  };

  useEffect(() => {
    fetchPermission();
  }, []);

  return (
    <>
      <div className="flex flex-warp mb-6">
        <span className="text-sm margin-auto-t-b font-bold ">
          <i className="fas fa-cog"></i>&nbsp;&nbsp;
        </span>
        <span className="text-base margin-auto-t-b font-bold">
          CRM&nbsp;&nbsp;/&nbsp;&nbsp;
        </span>
        <span className="text-sm margin-auto-t-b font-bold ">
          <i className="fas fa-coins"></i>&nbsp;&nbsp;
        </span>
        <span className="text-base margin-auto font-bold">เงื่อนไขคะแนน</span>
      </div>
      <Tabs
        activeKey={activeTab}
        onChange={changeTab}
        type="card"
        className="mt-6"
      >
        <TabPane tab="Register" key="1">
          <PointRegister setModified={setModified} setData={setData} />
        </TabPane>
        {/* <TabPane tab="E-Commerce" key="2">
          <PointEcommerce />
        </TabPane> */}
        <TabPane
          tab="Code"
          key="3"
          disabled={typePermission === "1" ? false : true}
        >
          <PointCode />
        </TabPane>
        <TabPane tab="Store" key="4">
          <PointStore />
        </TabPane>
      </Tabs>
      <ConfirmEdit
        showModal={modalIsOpenEdit}
        message={"คะแนนสำหรับสมาชิกใหม่"}
        hideModal={() => {
          closeModalSubject();
        }}
        confirmModal={() => {
          onEditValue();
        }}
        returnModal={() => {
          onReturn();
        }}
      />
    </>
  );
}
