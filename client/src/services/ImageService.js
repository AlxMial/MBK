import axios from "services/axios";

export const onSaveImage = async (data, callBackFun = null) => {
    data.updateBy = sessionStorage.getItem('user');
    if (data.id) {
        await axios.put("image", data).then((res) => {
            if (callBackFun) callBackFun(res);
        });
    } else {
        data.addBy = sessionStorage.getItem('user');
        await axios.post("image", data).then((res) => {
            if (callBackFun) callBackFun(res);
        });
    }
}