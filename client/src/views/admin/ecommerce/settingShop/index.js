import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentShopSetting } from 'redux/actions/shopSetting';
const SettingShop = () => {
    const dispatch = useDispatch();
    // เรียกใช้ Redux
    const { currentShopSetting } = useSelector(({ shopSetting }) => shopSetting);

    useEffect(() => {
        // Set ค่าให้ Redux
        dispatch(setCurrentShopSetting('Set Shop Setting When UseEffect Called'));
    }, [currentShopSetting]);

    return (
        <>
            <p>{currentShopSetting}</p>
        </>
    )
}

export default SettingShop