import React from 'react'
import PageTitle from 'views/admin/PageTitle';
import "antd/dist/antd.css";
import { Tabs } from "antd";
import Setting from './tabShopDetail';
import Payment from './tabPayment';
import Logistic from './tabLogistic';
import Promotion from './tabPromotion';

const SettingShop = () => {
    const { TabPane } = Tabs;

    function callback(key) {
        //console.log(key);
    }

    return (
        <>
            <PageTitle page='settingShop' />
            <Tabs defaultActiveKey="1" onChange={callback} type="card" className="mt-6">
                <TabPane tab="รายละเอียดร้านค้า" key="1">
                    <Setting />
                </TabPane>
                <TabPane tab="ช่องทางการชำระเงิน" key="2">
                    <Payment />
                </TabPane>
                <TabPane tab="กำหนดช่องทางการส่งของ" key="3">
                    <Logistic />
                </TabPane>
                <TabPane tab="โปรโมชั่นหน้าร้าน" key="4">
                    <Promotion />
                </TabPane>
            </Tabs>
        </>
    )
}

export default SettingShop