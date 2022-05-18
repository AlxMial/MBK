import React, { useEffect, useState } from 'react'
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
import { useFormik } from "formik";
import * as yup from "yup";
import { getPermissionByUserName } from "services/Permission";

const SettingShop = () => {
    const dispatch = useDispatch();
    // เรียกใช้ Redux
    const { currentShopSetting } = useSelector(({ shopSetting }) => shopSetting);
    const [typePermission, setTypePermission] = useState('');
    const [isModified, setIsModified] = useState(false);
    const [banner1, setBanner1] = useState(null);
    const [banner2, setBanner2] = useState(null);
    const [banner3, setBanner3] = useState(null);
    const [banner4, setBanner4] = useState(null);
    const [banner5, setBanner5] = useState(null);
    const [banner6, setBanner6] = useState(null);

    const { TabPane } = Tabs;

    useEffect(() => {
        // Set ค่าให้ Redux
        dispatch(setCurrentShopSetting('Set Shop Setting When UseEffect Called'));
        //set loading
        // dispatch(fetchLoading());
        // setTimeout(() => {
        //     //finish loading
        //     dispatch(fetchSuccess());
        // }, 2000);
        fetchPermission();
    }, [currentShopSetting]);

    const fetchPermission = async () => {
        const role = await getPermissionByUserName();
        setTypePermission(role);
    };

    const onSubmitModal = ({ data }) => {
        formik.setFieldValue(data.name, data.fileName);
        // prepare for save
        switch (data.name) {
            case 'banner1Name':
                setBanner1(data);
                break;
            case 'banner2Name':
                setBanner2(data);
                break;
            case 'banner3Name':
                setBanner3(data);
                break;
            case 'banner4Name':
                setBanner4(data);
                break;
            case 'banner5Name':
                setBanner5(data);
                break;
            case 'banner6Name':
                setBanner6(data);
                break;
            default:
                break;
        }
    };

    function callback(key) {
        //console.log(key);
    }

    const emailRegExp = /^[A-Za-z0-9_.@]+$/;
    const phoneRegExp = /^[0-9]+$/;
    function isValidateEmail() {
        return this
            .matches(
                emailRegExp,
                "* ขออภัย อนุญาตให้ใช้เฉพาะตัวอักษร (a-z), ตัวเลข (0-9) และเครื่องหมายมหัพภาค (.) เท่านั้น"
            )
            .email("* รูปแบบอีเมลไม่ถูกต้อง")
    }
    yup.addMethod(yup.string, "isValidateEmail", isValidateEmail);

    const formik = useFormik({
        initialValues: {
            shopId: '',
            banner1Id: '',
            banner2Id: '',
            banner3Id: '',
            banner4Id: '',
            banner5Id: '',
            banner6Id: '',
            banner1Name: '',
            banner2Name: '',
            banner3Name: '',
            banner4Name: '',
            banner5Name: '',
            banner6Name: '',
            shopName: '',
            description: '',
            email1: '',
            email2: '',
            email3: '',
            email4: '',
            isDeleted: false,
            addBy: '',
            addDate: '',
            editBy: '',
            editDate: ''
        },
        validationSchema: yup.object({
            email1: yup.string().isValidateEmail(),
            email2: yup.string().isValidateEmail(),
            email3: yup.string().isValidateEmail(),
            email4: yup.string().isValidateEmail(),
        }),
        onSubmit: (values) => {
            console.log('submit', formik);
        }
    });

    const propsSetting = { typePermission, formik, setIsModified, onSubmitModal }
    const propsPayment = { typePermission, formik, setIsModified }
    const propsLogistic = { typePermission, formik, setIsModified }
    const propsPromotion = { typePermission, formik, setIsModified }
    return (
        <>
            <PageTitle page='settingShop' />
            <Tabs defaultActiveKey="1" onChange={callback} type="card" className="mt-6">
                <TabPane tab="รายละเอียดร้านค้า" key="1">
                    <Setting props={propsSetting} />
                </TabPane>
                <TabPane tab="ช่องทางการชำระเงิน" key="2">
                    <Payment props={propsPayment} />
                </TabPane>
                <TabPane tab="กำหนดช่องทางการส่งของ" key="3"
                // disabled={((typePermission === "1") ? false : true)}
                >
                    <Logistic props={propsLogistic} />
                </TabPane>
                <TabPane tab="โปรโมชั่นหน้าร้าน" key="4">
                    <Promotion props={propsPromotion} />
                </TabPane>
            </Tabs>
        </>
    )
}

export default SettingShop