import axios from "services/axios";

export const onSaveImage = async (data) => {
    data.updateBy = localStorage.getItem('user');
    if (data.id) {
        axios.put("image", data).then((res) => {
            if (res.data.status) {
                return res.data;
            } else {
                return null;
            }
        });
    } else {
        data.addBy = localStorage.getItem('user');
        axios.post("image", data).then((res) => {
            if (res.data.status) {
                return res.data;
            } else {
                return null;
            }
        });
    }
}