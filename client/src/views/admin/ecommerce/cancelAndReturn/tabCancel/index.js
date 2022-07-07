import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import axios from "services/axios";
import { fetchLoading, fetchSuccess } from "redux/actions/common";
import * as yup from "yup";
import { useToasts } from "react-toast-notifications";
import InputSearchUC from "components/InputSearchUC";
import { useDispatch } from "react-redux";
import CancelList from "./CancelList";
import ConfirmDialog from "../ConfirmDialog";
import { EncodeKey } from "services/default.service";

const TabCancel = () => {
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const [listData, setListData] = useState([]);
  const [listSearch, setListSearch] = useState([]);
  const [open, setOpen] = useState(false);
  // const [cancelStatus, setCancelStatus] = useState(false);

  const fetchData = async () => {
    dispatch(fetchLoading());
    await axios.get("cancelOrder").then(async (response) => {
      if (!response.data.error && response.data.tbCancelOrder) {
        console.log("response.data.tbCancelOrder", response.data.tbCancelOrder);
        let _cancelData = response.data.tbCancelOrder;
        await axios.get("members").then((res) => {
          _cancelData = _cancelData.map((order) => {
            const member = res.data.tbMember.find(
              (member) => member.id === EncodeKey(order.memberId)
            );
            if (member) {
              order.memberName = member.firstName + " " + member.lastName;
            }
            return order;
          });
        });
        setListData(_cancelData);
        setListSearch(_cancelData);
      }
      dispatch(fetchSuccess());
    });
  };

  useEffect(() => {
    // fetchPermission();
    fetchData();
  }, []);

  const InputSearch = (e) => {
    e = e.toLowerCase();
    if (e === "") {
      setListData(listSearch);
    } else {
      console.log(listSearch);
      setListData(
        listSearch.filter(
          (x) =>
            x.orderNumber.toLowerCase().includes(e) ||
            x.orderDate.toLowerCase().includes(e) ||
            x.memberName.toLowerCase().includes(e) ||
            x.sumPrice.toString().toLowerCase().includes(e) ||
            (x.cancelStatus === "1"
              ? "รอการยกเลิก"
              : x.cancelStatus === "2"
              ? "คืนเงิน"
              : "ไม่คืนเงิน"
            )
              .toLowerCase()
              .includes(e) ||
            x.cancelDetail.toString().toLowerCase().includes(e) ||
            x.cancelOtherRemark.toString().toLowerCase().includes(e)
        )
      );
    }
  };

  const formik = useFormik({
    initialValues: {
      id: "",
      orderId: "",
      cancelStatus: "",
      cancelDetail: "",
      description: "",
      isDeleted: false,
      addBy: "",
      updateBy: "",
      cancelOtherRemark: "",
    },
    // validationSchema: yup.object({
    //     description: yup.string().required("* กรุณากรอก รายละเอียด"),
    // }),
    onSubmit: (values) => {
      console.log("onSubmit", values);
      dispatch(fetchLoading());
      values.updateBy = sessionStorage.getItem("user");
      if (values.id) {
        console.log("onSubmit update", values);
        axios.put("cancelOrder", values).then(async (res) => {
          console.log("res", res);
          if (res.data.status) {
            afterSaveSuccess();
          } else {
            dispatch(fetchSuccess());
            addToast("บันทึกข้อมูลไม่สำเร็จ", {
              appearance: "warning",
              autoDismiss: true,
            });
          }
        });
      } else {
        values.addBy = sessionStorage.getItem("user");
        axios.post("cancelOrder", values).then(async (res) => {
          if (res.data.status) {
            afterSaveSuccess();
          } else {
            dispatch(fetchSuccess());
            addToast("บันทึกข้อมูลไม่สำเร็จ", {
              appearance: "warning",
              autoDismiss: true,
            });
          }
        });
      }
    },
  });

  const handleChangeStatus = (row, status) => {
    for (const field in row) {
      formik.setFieldValue(field, row[field], false);
    }
    formik.setFieldValue("cancelStatus", status, false);
    // setCancelStatus(status);
    setOpen(true);
  };

  const handleModal = (data) => {
    if (data === "save") {
      // formik.setFieldValue('cancelStatus', 'done', false);
      formik.handleSubmit();
    } else {
      setOpen(false);
      fetchData();
    }
  };

  const afterSaveSuccess = () => {
    fetchData();
    setOpen(false);
    dispatch(fetchSuccess());
    addToast("บันทึกข้อมูลสำเร็จ", {
      appearance: "success",
      autoDismiss: true,
    });
  };

  return (
    <>
      {/* <PageTitle page='order' /> */}
      {/* <div className="w-full">
        <div
          className={
            "py-4 relative flex flex-col min-w-0 break-words w-full mb-6 border rounded-b bg-white "
          }
        >
          <div className="rounded-t mb-0 px-4 py-3 border-0">
            <div className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap ">
              <div className="w-full lg:w-6/12">
                <InputSearchUC onChange={(e) => InputSearch(e.target.value)} />
              </div>
            </div>
          </div>
          <CancelList
            listData={listData}
            handleChangeStatus={handleChangeStatus}
          />
        </div>
      </div> */}

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
              <div className="w-full lg:w-6/12"></div>
            </div>
          </div>
          <CancelList
            listData={listData}
            handleChangeStatus={handleChangeStatus}
          />
        </div>
      </div>
      {open && (
        <ConfirmDialog
          open={open}
          formik={formik}
          status={formik.values.cancelStatus}
          handleModal={handleModal}
          type="cancel"
        />
      )}
    </>
  );
};

export default TabCancel;
