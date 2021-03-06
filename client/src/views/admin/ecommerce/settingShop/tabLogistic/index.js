import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import axios from "services/axios";
import { fetchLoading, fetchSuccess } from "redux/actions/common";
import * as yup from "yup";
import { useToasts } from "react-toast-notifications";
import LogisticTable from "./LogisticTable";
import LogisticModal from "./LogisticModal";
import DeliveryModal from "./DeliveryModal";
import ButtonModalUC from "components/ButtonModalUC";
import InputSearchUC from "components/InputSearchUC";
import { useDispatch } from "react-redux";

const Logistic = () => {
  const { addToast } = useToasts();
  const dispatch = useDispatch();
  const [listLogistic, setListLogistic] = useState([]);
  const [listSearch, setListSearch] = useState([]);
  const [openDelivery, setOpenDelivery] = useState(false);
  const [openLogistic, setOpenLogistic] = useState(false);

  const fetchData = async () => {
    dispatch(fetchLoading());
    await axios.get("logistic").then((response) => {
      if (!response.data.error) {
        setListLogistic(response.data.tbLogistic);
        setListSearch(response.data.tbLogistic);
      }
    });

    const response = await axios.get("promotionDelivery");
    const promotionDelivery = await response.data.tbPromotionDelivery;
    if (promotionDelivery) {
      for (const columns in promotionDelivery) {
        formikDelivery.setFieldValue(
          columns,
          promotionDelivery[columns],
          false
        );
      }
    }
    dispatch(fetchSuccess());
  };

  useEffect(() => {
    // fetchPermission();
    fetchData();
  }, []);

  const InputSearch = (e) => {
    e = e.toLowerCase();
    if (e === "") {
      setListLogistic(listSearch);
    } else {
      setListLogistic(
        listSearch.filter(
          (x) =>
            x.deliveryName.toLowerCase().includes(e) ||
            x.logisticType.toLowerCase().includes(e) ||
            x.deliveryCost.toString().toLowerCase().includes(e)
        )
      );
    }
  };

  const openModalLogistic = (id) => {
    formikLogistic.resetForm();
    const data = listLogistic.filter((x) => x.id === id);
    if (data && data.length > 0) {
      for (const field in data[0]) {
        formikLogistic.setFieldValue(field, data[0][field], false);
      }
    }
    setOpenLogistic(true);
  };

  const openModalDelivery = async () => {
    dispatch(fetchLoading());
    const response = await axios.get("promotionDelivery");
    const promotionDelivery = await response.data.tbPromotionDelivery;
    if (promotionDelivery) {
      for (const columns in promotionDelivery) {
        formikDelivery.setFieldValue(
          columns,
          promotionDelivery[columns],
          false
        );
      }
    }
    dispatch(fetchSuccess());
    setOpenDelivery(true);
  };

  const formikLogistic = useFormik({
    initialValues: {
      id: "",
      logisticType: "1",
      deliveryName: "",
      deliveryType: "1",
      deliveryTypeName: "",
      deliveryCost: "",
      deliveryCostName: "",
      description: "",
      isShow: true,
      isShowName: "",
      isDeleted: false,
      addBy: "",
      updateBy: "",
      logisticCategoryId: "",
    },
    validationSchema: yup.object({
      logisticType: yup.string().required("* ??????????????????????????? ?????????????????????????????????"),
      deliveryName: yup
        .string()
        .required("* ??????????????????????????? ????????????????????????????????????????????????????????????????????????????????????????????????????????????"),
      deliveryCost: yup.string().required("* ??????????????????????????? ???????????????????????????"),
    }),
    onSubmit: (values) => {
      dispatch(fetchLoading());
      values.updateBy = sessionStorage.getItem("user");
      if (values.id) {
        axios.put("logistic", values).then((res) => {
          if (res.data.status) {
            saveLogisticSuccess();
          } else {
            saveLogisticNotSuccess();
          }
        });
      } else {
        values.addBy = sessionStorage.getItem("user");
        axios.post("logistic", values).then(async (res) => {
          if (res.data.status) {
            saveLogisticSuccess();
          } else {
            saveLogisticNotSuccess();
          }
        });
      }
    },
  });

  const formikDelivery = useFormik({
    initialValues: {
      id: "",
      promotionName: "",
      buy: "",
      deliveryCost: "",
      isInactive: true,
      isShowName: "",
      isDeleted: false,
      addBy: "",
      updateBy: "",
    },
    onSubmit: async (values) => {
      dispatch(fetchLoading());
      values.updateBy = sessionStorage.getItem("user");
      if (values.id) {
        await axios.put("promotionDelivery", values).then((res) => {
          if (res.data.status) {
            dispatch(fetchSuccess());
            setOpenDelivery(false);
            addToast("??????????????????????????????????????????????????????", {
              appearance: "success",
              autoDismiss: true,
            });
          } else {
            saveLogisticNotSuccess();
          }
        });
      } else {
        values.addBy = sessionStorage.getItem("user");
        await axios.post("promotionDelivery", values).then(async (res) => {
          if (res.data.status) {
            dispatch(fetchSuccess());
            setOpenDelivery(false);
            addToast("??????????????????????????????????????????????????????", {
              appearance: "success",
              autoDismiss: true,
            });
          } else {
            saveLogisticNotSuccess();
          }
        });
      }
    },
  });

  const saveLogisticSuccess = () => {
    dispatch(fetchSuccess());
    setOpenLogistic(false);
    fetchData();
    addToast("??????????????????????????????????????????????????????", {
      appearance: "success",
      autoDismiss: true,
    });
  };

  const saveLogisticNotSuccess = () => {
    addToast("???????????????????????????????????????????????????????????????", {
      appearance: "warning",
      autoDismiss: true,
    });
  };

  return (
    <>
      <div className="w-full">
        <div
          className={
            "py-4 relative flex flex-col min-w-0 break-words w-full mb-6 border rounded-b bg-white Overflow-list "
          }
        >
          <div className="rounded-t mb-0 px-4 py-3 border-0">
            <div className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap ">
              <div className="w-full lg:w-6/12">
                <InputSearchUC onChange={(e) => InputSearch(e.target.value)} />
              </div>
              <div className={"lg:w-6/12 text-right block"}>
                <ButtonModalUC
                  onClick={() => openModalDelivery()}
                  label="????????????????????????????????????????????????????????????????????????"
                />
                <ButtonModalUC
                  onClick={() => openModalLogistic()}
                  label="???????????????????????????????????????????????????????????????"
                />
              </div>
            </div>
          </div>
          <LogisticTable
            listLogistic={listLogistic}
            setListLogistic={setListLogistic}
            openModal={openModalLogistic}
            saveLogisticSuccess={saveLogisticSuccess}
            saveLogisticNotSuccess={saveLogisticNotSuccess}
          />
        </div>
      </div>
      {openDelivery && (
        <DeliveryModal
          open={openDelivery}
          formik={formikDelivery}
          handleModal={() => setOpenDelivery(false)}
        />
      )}
      {openLogistic && (
        <LogisticModal
          open={openLogistic}
          formik={formikLogistic}
          handleModal={() => setOpenLogistic(false)}
        />
      )}
    </>
  );
};

export default Logistic;
