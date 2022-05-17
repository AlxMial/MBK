import React from 'react'

function PageTitle({ page }) {
    let module = '';
    let pageName = '';
    let moduleIcon = '';
    let pageIcon = '';
    switch (page) {
        case 'settingShop':
            module = 'E-commerce';
            pageName = 'ตั้งค่าร้านค้า';
            moduleIcon = 'fas fa-shopping-cart';
            pageIcon = 'fas fa-store';
            break;
        default:
            break;
    }

    return (
        <div className="flex flex-warp mb-6">
            <span className="text-sm margin-auto-t-b font-bold ">
                <i className={moduleIcon}></i>&nbsp;&nbsp;
            </span>
            <span className="text-base margin-auto-t-b font-bold">
                {module}&nbsp;&nbsp;/&nbsp;&nbsp;
            </span>
            <span className="text-sm margin-auto-t-b font-bold ">
                <i className={pageIcon}></i>&nbsp;&nbsp;
            </span>
            <span className="text-base margin-auto font-bold">{pageName}</span>
        </div>
    )
}

export default PageTitle