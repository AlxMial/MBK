import React from 'react'
import { useHistory } from 'react-router';
import { path } from 'services/liff.services';
import './menu.scss'

const Menu = ({ currentMenu }) => {
    const history = useHistory();
    const menuList = [
        { label: 'โปรไฟล์', icon: 'fas fa-user', active: false, path: path.member },
        { label: 'สะสมแต้ม', icon: 'fas fa-star', active: false, path: path.point },
        { label: 'ซื้อสินค้า', icon: 'fas fa-shopping-cart', active: false, path: path.shopMain },
        { label: 'คำสั่งซื้อ', icon: 'fas fa-shopping-basket', active: false, path: path.myorder.replace(":id", "1") },
        { label: 'แลกรางวัล', icon: 'fas fa-gift', active: false, path: path.reward },

    ];

    const menuClick = (path) => {
        if (path.includes('myorder')) {
            localStorage.setItem('pushMyOrder', window.location.pathname);
        }
        history.push(path);
    }

    return (
        <div className='fixed bottom-0 w-full z-2'>
            <div className="menu-box relative w-full pt-3">
                <div className="menu-list z-2  font-bold flex justify-between w-full">
                    {
                        menuList.map((item, index) => {
                            return (
                                <div className={"menu-item text-center cursor-pointer"
                                    + (currentMenu && item.path
                                        && item.path.toLowerCase().includes(currentMenu.toLowerCase()) ? 'active' : '')}
                                    key={index} onClick={() => menuClick(item.path)}>
                                    {
                                        item.label === 'สะสมแต้ม' && (
                                            <div className={"mx-auto menu-icon flex justify-center items-center "
                                                + (currentMenu && item.path
                                                    && item.path.toLowerCase().includes(currentMenu.toLowerCase())
                                                    ? 'bg-gold-mbk' : 'text-menu-point menu-bg-icon-non-active')}>
                                                <div className={"menu-icon-point text-sm  flex items-center justify-center "
                                                    + (currentMenu && item.path
                                                        && item.path.toLowerCase().includes(currentMenu.toLowerCase())
                                                        ? 'text-gold-mbk menu-bg-icon-non-active' : 'bg-green-mbk')}>
                                                    <i className={item.icon}></i></div>
                                            </div>
                                        )
                                    }
                                    {item.label !== 'สะสมแต้ม' && (
                                        <div className={"mx-auto menu-icon flex justify-center items-center "
                                            + (currentMenu && item.path
                                                && item.path.toLowerCase().includes(currentMenu.toLowerCase())
                                                ? 'menu-icon-text-active bg-gold-mbk' : 'text-green-mbk menu-bg-icon-non-active')}
                                            style={{ paddingRight: (item.label === 'ซื้อสินค้า' ? '4px' : '0') }}>
                                            <i className={item.icon}></i>
                                        </div>
                                    )}
                                    <div className={"menu-label text-xs mt-2 " + (currentMenu && item.path
                                        && item.path.toLowerCase().includes(currentMenu.toLowerCase())
                                        ? 'text-gold-mbk' : 'text-white')}>{item.label}</div>

                                </div>

                            )
                        })
                    }
                </div>
                <div className="menu-bg bg-green-mbk w-full absolute bottom-0"></div>
            </div>
        </div>
    )
}

export default Menu