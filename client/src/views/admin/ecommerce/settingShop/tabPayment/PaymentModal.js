import React from "react";
import Modal from "react-modal";
import {
  customStyles,
  customStylesMobile,
} from "assets/styles/theme/ReactModal";
import LabelUC from "components/LabelUC";
import useWindowDimensions from "services/useWindowDimensions";
import InputUC from "components/InputUC";
import ProfilePictureUC from "components/ProfilePictureUC";
import FilesService from "services/files";
import ValidateService from "services/validateValue";
import ButtonUCSaveModal from "components/ButtonUCSaveModal";
import ModalHeader from "views/admin/ModalHeader";
const PaymentModal = ({
  open,
  formik,
  handleModal,
  paymentImage,
  setPaymentImage,
  paymentImageQrCode,
  setPaymentImageQrCode,
  errorImage,
  setErrorImage,
}) => {
  Modal.setAppElement("#root");
  const useStyle = customStyles();
  const useStyleMobile = customStylesMobile();
  const { width } = useWindowDimensions();
  const handleChangeImage = async (e) => {
    if (e.target.files.length > 0) {
      if (e.target.id === "filebankImageQrCode") {
        if (e.target.files[0].type.includes("png")) {
          const dataImage = ValidateService.validateImage(
            e.target.files[0].name
          );
          setErrorImage({ ...errorImage, qr: dataImage });
          if (!dataImage) {
            const base64 = await FilesService.convertToBase64(
              e.target.files[0]
            );
            setPaymentImageQrCode({
              ...paymentImageQrCode,
              image: base64,
              relatedTable: "paymentQrCode",
            });
          }
        } else {
          setErrorImage((per) => ({
            ...per,
            qr: true,
          }));
        }
      } else {
        const dataImage = ValidateService.validateImage(e.target.files[0].name);
        setErrorImage({ ...errorImage, logo: dataImage });
        if (!dataImage) {
          const base64 = await FilesService.convertToBase64(e.target.files[0]);
          setPaymentImage({
            ...paymentImage,
            image: base64,
            relatedTable: "payment",
          });
        }
      }
    }
  };

  const handleChangeAccountNumber = (e) => {
    if (
      ValidateService.onHandleNumberChange(e.target.value) !== "" ||
      e.target.value === ""
    ) {
      formik.setFieldValue("accountNumber", e.target.value, false);
    }
  };

  return (
    <Modal
      isOpen={open}
      onRequestClose={handleModal}
      style={width <= 1180 ? useStyleMobile : useStyle}
      contentLabel="Example Modal"
      shouldCloseOnOverlayClick={false}
    >
      <form onSubmit={formik.handleSubmit}>
        <div className="flex flex-wrap">
          <div className="w-full flex-auto mt-2">
            <ModalHeader
              title="?????????????????????????????????????????????????????????????????????"
              handleModal={handleModal}
            />
            <div className="px-24 py-10 ">
              <div className="flex flex-wrap justify-center">
                <div className="w-full lg:w-10/12 px-4 margin-auto-t-b ">
                  <div className="flex flex-wrap">
                    <div className="w-full lg:w-2/12 px-4 margin-auto-t-b ">
                      <LabelUC label="??????????????????????????????" isRequired={true} />
                    </div>
                    <div className="w-full lg:w-10/12 margin-auto-t-b">
                      <div className="relative w-full px-4">
                        <InputUC
                          name="bankName"
                          maxLength={100}
                          onBlur={formik.handleBlur}
                          value={formik.values.bankName}
                          // disabled={typePermission !== "1"}
                          onChange={(e) => {
                            formik.handleChange(e);
                          }}
                        />
                      </div>
                      <div className="relative w-full px-4">
                        {formik.touched.bankName && formik.errors.bankName ? (
                          <div className="text-sm py-2 px-2  text-red-500">
                            {formik.errors.bankName}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap mt-4">
                    <div className="w-full lg:w-2/12 px-4 margin-auto-t-b ">
                      <LabelUC label="????????????????????????" isRequired={true} />
                    </div>
                    <div className="w-full lg:w-10/12 margin-auto-t-b">
                      <div className="relative w-full px-4">
                        <InputUC
                          name="accountNumber"
                          maxLength={15}
                          onBlur={formik.handleBlur}
                          value={formik.values.accountNumber}
                          // disabled={typePermission !== "1"}
                          onChange={(e) => {
                            handleChangeAccountNumber(e);
                          }}
                        />
                      </div>
                      <div className="relative w-full px-4">
                        {formik.touched.accountNumber &&
                        formik.errors.accountNumber ? (
                          <div className="text-sm py-2 px-2  text-red-500">
                            {formik.errors.accountNumber}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap mt-4">
                    <div className="w-full lg:w-2/12 px-4 margin-auto-t-b ">
                      <LabelUC label="???????????????????????????" isRequired={true} />
                    </div>
                    <div className="w-full lg:w-10/12 margin-auto-t-b">
                      <div className="relative w-full px-4">
                        <InputUC
                          name="accountName"
                          maxLength={100}
                          onBlur={formik.handleBlur}
                          value={formik.values.accountName}
                          // disabled={typePermission !== "1"}
                          onChange={(e) => {
                            formik.handleChange(e);
                          }}
                        />
                      </div>
                      <div className="relative w-full px-4">
                        {formik.touched.accountName &&
                        formik.errors.accountName ? (
                          <div className="text-sm py-2 px-2  text-red-500">
                            {formik.errors.accountName}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap mt-4">
                    <div className="w-full lg:w-2/12 px-4 margin-auto-t-b ">
                      <LabelUC label="??????????????????????????????" />
                    </div>
                    <div className="w-full lg:w-10/12 margin-auto-t-b">
                      <div className="relative w-full px-4">
                        <InputUC
                          name="bankBranchName"
                          maxLength={100}
                          onBlur={formik.handleBlur}
                          value={formik.values.bankBranchName}
                          // disabled={typePermission !== "1"}
                          onChange={(e) => {
                            formik.handleChange(e);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap mt-4">
                    <div className="w-full lg:w-2/12 px-4 margin-auto-t-b ">
                      <LabelUC label="QR Code " isRequired={true} />
                    </div>
                    <div className="w-full lg:w-10/12 margin-auto-t-b">
                      <div className="relative w-full px-4">
                        <ProfilePictureUC
                          id="bankImageQrCode"
                          hoverText="???????????????????????? QR Code"
                          src={paymentImageQrCode.image}
                          onChange={handleChangeImage}
                          accept="image/png"
                        />
                        {errorImage.qr ? (
                          <div className="text-sm py-2 px-2  text-red-500">
                            * ??????????????????????????????????????????????????????????????????????????????
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full lg:w-2/12 px-4">
                  <ProfilePictureUC
                    id="bankImage"
                    hoverText="??????????????????????????????????????????"
                    src={paymentImage.image}
                    onChange={handleChangeImage}
                  />
                  {errorImage.logo ? (
                    <div className="text-sm py-2 px-2  text-red-500">
                      * ??????????????????????????????????????????????????????????????????????????????
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            <ButtonUCSaveModal />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default PaymentModal;
