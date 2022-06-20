
import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Spinner from "components/Loadings/spinner/Spinner";
import { useToasts } from "react-toast-notifications";
import axios from "services/axios";
import { path } from "services/liff.services";
import * as Storage from "@services/Storage.service";
import * as fn from "@services/default.service";
import ImageUC from "components/Image/index";


const Return = () => {

    const history = useHistory();

    const [isLoading, setIsLoading] = useState(false);
    const [selectMenu, setselectMenu] = useState(1);
    useEffect(() => {

    }, []);


    return (
        <>
            <div>Return</div>
        </>
    );
};

export default Return;
