import React from 'react'
import PageTitle from 'views/admin/PageTitle';
import "antd/dist/antd.css";
import { Tabs } from "antd";
import TabCancel from './tabCancel';
import TabReturn from './tabReturn';

const CancelAndReturn = () => {
    const { TabPane } = Tabs;

    function callback(key) {
        //console.log(key);
    }

    return (
        <>
            <PageTitle page='cancelAndReturn' />
            <Tabs defaultActiveKey="1" onChange={callback} type="card" className="mt-6">
                <TabPane tab="ยกเลิก" key="1">
                    <TabCancel />
                </TabPane>
                <TabPane tab="คืนสินค้า" key="2">
                    <TabReturn />
                </TabPane>
            </Tabs>
        </>
    )
}

export default CancelAndReturn