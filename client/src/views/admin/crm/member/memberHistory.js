import React, { useEffect } from "react";
import Modal from "react-modal";
import {
  customStyles,
  customStylesMobile,
} from "assets/styles/theme/ReactModal";
import useWindowDimensions from "services/useWindowDimensions";
import "antd/dist/antd.css";
import { Tabs } from "antd";
import MemberRedemption from "./memberRedemption";
import MemberReward from "./memberReward";

const MemberHistory = ({
  open,
  handleModal,
  name,
  modalData,
  memberId,
  handleSubmitModal,
}) => {
    console.log(memberId)
  Modal.setAppElement("#root");
  const useStyle = customStyles();
  const useStyleMobile = customStylesMobile();
  const { width } = useWindowDimensions();
  const { TabPane } = Tabs;

  const onClose = () => {
    handleSubmitModal();
  };

  useEffect(() => {}, []);

  return (
    <Modal
      isOpen={open}
      onRequestClose={handleModal}
      style={width <= 1180 ? useStyleMobile : useStyle}
      contentLabel="Example Modal"
      shouldCloseOnOverlayClick={false}
    >
      <div className="w-full p-8">
        <div className="flex flex-warp mb-6 justify-between">
          <div>
            <span className="text-sm margin-auto-t-b font-bold ">
              <i className="fas fa-gift"></i>&nbsp;&nbsp;
            </span>
            <span className="text-base margin-auto font-bold">
              ประวัติคะแนน
            </span>
          </div>
          <div>
            <span className="text-base margin-auto font-bold text-red-600 cursor-pointer" onClick={()=>onClose()}>
              X
            </span>
          </div>
        </div>
        <Tabs defaultActiveKey="1" type="card" className="mt-6">
          <TabPane tab="การรับคะแนน" key="1">
            <MemberReward memberId={memberId} />
          </TabPane>
          <TabPane tab="การแลกของรางวัล" key="2" disabled={true}>
            <MemberRedemption/>
          </TabPane>
        </Tabs>
      </div>
    </Modal>
  );
};

export default MemberHistory;
