import React, { useState, useEffect } from 'react'
import axios from "services/axios";
import { useHistory } from 'react-router';
import { path } from 'services/liff.services';
import Spinner from "components/Loadings/spinner/Spinner";
import FilesService from "services/files";

const ProductCategory = ({ showHeader = true, setselectMenu }) => {
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(false);
    const [productCategory, setproductCategory] = useState([]);
    const fetchproductCategory = async () => {
        setIsLoading(true);
        await axios.get("productCategory/getProductCategory").then((response) => {
            if (response.status) {
                const data = response.data.tbProductCategory;
                data.map(item => {
                    if (item.img) {
                        item.img = FilesService.buffer64UTF8(item.img);
                    }
                    return item;
                })
                setproductCategory(data);
            }
        });
        setIsLoading(false);
    };

    useEffect(() => {
        fetchproductCategory();
    }, []);

    const onClickCategory = (type) => {
        if (type === 'category') {
            history.push({
                pathname: path.shopListCategory,
                state: { selectedMenu: 3 }
            });
        } else {
            history.push(path.shopList);
        }
    }

    const onClickItem = (id) => {
        if (window.location.pathname.includes('/shopList')) {
            // console.log('setcategoryview');
            history.replace({
                pathname: path.shopList,
                state: { productCategoryId: id }
            });
            setselectMenu(id);
            // window.location.reload();
        } else {
            history.push({
                pathname: path.shopList,
                state: {
                    productCategoryId: id
                }
            });
        }
    }

    const _height = window.innerWidth + 'px';
    const _min_h_category = (`calc((${_height} / 2) - 28px)`);

    return (
        <>
            {isLoading ? <Spinner customText={"Loading"} /> : null}
            <div className="w-full category-section p-3">
                {showHeader && (
                    <>
                        <div className="category-title flex justify-between text-xs cursor-pointer">
                            <div className="w-6/12 text-category text-center text-green-mbk underline font-bold"
                                onClick={() => onClickCategory('category')}>
                                สินค้าตามหมวดหมู่
                            </div>
                            <div className="w-6/12 text-category text-center"
                                onClick={() => onClickCategory('all')}>
                                สินค้าทั้งหมด
                            </div>
                        </div>
                        <div className="liff-inline" />
                    </>
                )}
                {productCategory && (
                    <div className="category-list flex flex-wrap mt-2">
                        {productCategory.map((item, index) => {
                            return (
                                <div className="category-item p-2 w-6/12"
                                    onClick={() => onClickItem(item.id)}
                                    key={index}>
                                    <div className="category-image text-center">
                                        <img
                                            // src={item.img}
                                            src={item.img ?? require("assets/img/mbk/no-image.png").default}
                                            alt="category"
                                            className='object-cover w-full'
                                            style={{ minHeight: _min_h_category, borderRadius: '5px' }}
                                        />
                                        <div className="category-text mt-2 text-xs">
                                            {item.name}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </>
    )
}

export default ProductCategory