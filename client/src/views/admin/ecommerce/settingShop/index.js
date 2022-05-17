import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSuccess } from 'redux/actions/common';
import { fetchLoading } from 'redux/actions/common';
import { setCurrentShopSetting } from 'redux/actions/shopSetting';
import PageTitle from 'views/admin/PageTitle';
import "antd/dist/antd.css";
import { Tabs } from "antd";
import Setting from './Setting';
import Payment from './Payment';
import Logistic from './Logistic';
import Promotion from './Promotion';

const SettingShop = () => {
    const dispatch = useDispatch();
    // เรียกใช้ Redux
    const { currentShopSetting } = useSelector(({ shopSetting }) => shopSetting);
    const { TabPane } = Tabs;

    useEffect(() => {
        // Set ค่าให้ Redux
        dispatch(setCurrentShopSetting('Set Shop Setting When UseEffect Called'));
        //set loading
        dispatch(fetchLoading());
        setTimeout(() => {
            //finish loading
            dispatch(fetchSuccess());
        }, 2000);
    }, [currentShopSetting]);

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
                <TabPane tab="กำหนดช่องทางการส่งของ" key="3"
                // disabled={((typePermission === "1") ? false : true)}
                >
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