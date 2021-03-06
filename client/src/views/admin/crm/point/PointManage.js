import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
import { Tabs } from "antd";
import axios from "services/axios";
/* Service */
import PointRegister from "./PointRegister";
import PointEcommerce from "./PointEcommerce";
import PointCode from "./PointCode";
import PointStore from "./PointStore";
import { GetPermissionControl } from "services/Permission";
import ConfirmEdit from "components/ConfirmDialog/ConfirmEdit";
import { useToasts } from "react-toast-notifications";
import { set } from "react-ga";

export default function PointManage() {
  const { TabPane } = Tabs;
  const [typePermission, setTypePermission] = useState(false);
  const [permissioncontrol, setPermissioncontrol] = useState([]);
  const [isModified, setModified] = useState(false);
  const [modalIsOpenEdit, setIsOpenEdit] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const [activeConfirmTab, setActiveConfirmTab] = useState();
  const { addToast } = useToasts();

  const [callbackSettab, setcallbackSettab] = useState(null);
  const [reload, setreload] = useState(false);

  const [data, setData] = useState({
    id: "",
    pointRegisterScore: "",
    isActive: "",
    addBy: "",
    updateBy: "",
    isDeleted: false,
  });
  function openModalSubject() {
    setIsOpenEdit(true);
  }

  function closeModalSubject() {
    setIsOpenEdit(false);
    setActiveTab(callbackSettab);
    setModified(false);
    setreload(true);
    setTimeout(() => {
      setreload(false);
    }, 500);
  }

  const changeMo = () => {
    setModified(false);
  };

  const onEditValue = async () => {
    if (data.id === "") {
      setData((prevState) => {
        return {
          ...prevState,
          addBy: sessionStorage.getItem("user"),
        };
      });
      axios.post("pointRegister", data).then((res) => {
        if (res.data.status) {
          setData((prevState) => {
            return {
              ...prevState,
              id: res.data.tbPointRegister.id,
            };
          });

          setModified(false);
          addToast(
            "??????????????????????????????????????????????????????",

            { appearance: "success", autoDismiss: true }
          );
        }
      });
    } else {
      axios.put("pointRegister", data).then((res) => {
        if (res.data.status) {
          setModified(false);
          // setModified(...isModified, false);
          addToast("??????????????????????????????????????????????????????", {
            appearance: "success",
            autoDismiss: true,
          });
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
    if (isModified) {
      setcallbackSettab(activeKey);
      openModalSubject();
    } else setActiveTab(activeKey);
  };

  const fetchPermission = async () => {
    const role = await GetPermissionControl(2);
    if (role.data.data !== null) {
      if (role.data.data.length > 0) {
        setTypePermission(role.data.data[0].isEnable);
        let Permission = [];
        role.data.data.filter((e) => {
          Permission.push({ controlName: e.controlName, isEnable: e.isEnable });
        });
        setPermissioncontrol(Permission);
      } else {
        setTypePermission(false);
      }
    }
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
        <span className="text-base margin-auto font-bold">???????????????????????????????????????</span>
      </div>
      <Tabs
        activeKey={activeTab}
        onChange={changeTab}
        type="card"
        className="mt-6"
      >
        <TabPane id="tbRegister" tab="Register" key="1">
          {reload ? null : (
            <PointRegister setModified={setModified} setData={setData} />
          )}
        </TabPane>
        <TabPane tab="E-Commerce" key="2">
          <PointEcommerce />
        </TabPane>
        <TabPane
          tab="Code"
          id="tabCode"
          key="3"
          disabled={
            permissioncontrol.find((e) =>
              e.controlName.trim().toLowerCase().includes("tabcode")
            ) === undefined
              ? false
              : !permissioncontrol.find((e) =>
                  e.controlName.trim().toLowerCase().includes("tabcode")
                ).isEnable
          }
        >
          <PointCode />
        </TabPane>
        <TabPane id="tabStore" tab="Store" key="4">
          <PointStore />
        </TabPane>
      </Tabs>
      <ConfirmEdit
        showModal={modalIsOpenEdit}
        message={"???????????????????????????????????????????????????????????????"}
        hideModal={() => {
          closeModalSubject();
          callbackSettab();
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
