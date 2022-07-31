import axios from "./axios";

const SortValue = (Json) => {
  Json.sort(function (a, b) {
    return a.label.localeCompare(b.label);
  });
  return Json;
};

export const getProvince = async () => {
  var JsonProvince = [];
  const dataValues = await axios.get("/addressline/province");
  if (dataValues.data) {
    
    await dataValues.data.address.forEach((field) => {
      JsonProvince.push({
        value: field.provinceId.toString(),
        label: field.provinceName,
      });
    });

    SortValue(JsonProvince);
    return JsonProvince;
  }
  // await axios.get("/addressline/province").then(async (response) => {
  //   if (response.data.error) {
  //   } else {
  //     await response.data.address.forEach((field) => {
  //       JsonProvince.push({
  //         value: field.provinceId.toString(),
  //         label: field.provinceName,
  //       });
  //     });
  //     SortValue(JsonProvince);
  //     return JsonProvince;
  //   }
  // });
};

export const getDistrict = async () => {
  var JsonDistrict = [];
  const dataValues = await axios.get("/addressline/district");
  if (dataValues.data) {
    await dataValues.data.address.forEach((field) => {
      JsonDistrict.push({
        value: field.districtId.toString(),
        label: field.districtName,
      });
    });
    SortValue(JsonDistrict);
    return JsonDistrict;
  }

  // await axios.get("/addressline/district").then(async (response) => {
  //   if (response.data.error) {
  //   } else {
  //     await response.data.address.forEach((field) => {
  //       JsonDistrict.push({
  //         value: field.districtId.toString(),
  //         label: field.districtName,
  //       });
  //     });
  //     SortValue(JsonDistrict);
  //     return JsonDistrict;
  //   }
  // });
};

export const getSubDistrict = async () => {
  var JsonSubDistrict = [];
  const dataValues = await axios.get("/addressline/subdistrict");
  if (dataValues.data) {
    await dataValues.data.address.forEach((field) => {
      JsonSubDistrict.push({
        value: field.subdistrictId.toString(),
        label: field.subdistrictName,
      });
    });
    SortValue(JsonSubDistrict);
    return JsonSubDistrict;
  }

  // await axios.get("/addressline/subdistrict").then(async (response) => {
  //   if (response.data.error) {
  //   } else {
  //     await response.data.address.forEach((field) => {
  //       JsonSubDistrict.push({
  //         value: field.subdistrictId.toString(),
  //         label: field.subdistrictName,
  //       });
  //     });
  //     SortValue(JsonSubDistrict);
  //     return JsonSubDistrict;
  //   }
  // });
};

export const getAddress = async (type, id) => {
  var Json = [];
  if (type === "district") {
    const dataValues = await axios.get(`/addressline/district/byIdProvince/${id}`);
    if (dataValues.data) {
      await dataValues.data.address.forEach((field) => {
        Json.push({
          value: field.districtId.toString(),
          label: field.districtName,
        });
      });
      SortValue(Json);
      return Json;
    }
    // await axios.get(`/addressline/district/byIdProvince/${id}`).then(async (response) => {
    //   if (response.data.error) {}
    //   else {
    //     await response.data.address.forEach((field) => {
    //       Json.push({ value: field.districtId.toString(), label: field.districtName });
    //     });
    //     SortValue(Json);
    //     return Json;
    //   }
    // });
  } else if (type === "subDistrict") {
    const dataValues = await axios.get(
      `/addressline/subdistrict/byIdDistrict/${id}`
    );
    if (dataValues.data) {
      await dataValues.data.address.forEach((field) => {
        Json.push({
          value: field.subdistrictId.toString(),
          label: field.subdistrictName,
        });
      });

      SortValue(Json);
      return Json;
    }
    // await axios.get(`/addressline/subdistrict/byIdDistrict/${id}`).then(async (response) => {
    //   if (response.data.error) {}
    //   else {

    //     await response.data.address.forEach((field) => {
    //       Json.push({ value: field.subdistrictId.toString(), label: field.subdistrictName});
    //     });

    //     SortValue(Json);
    //     return Json;
    //   }
    // });
  } else if (type === "postcode") {

    const dataValues = await axios.get(
      `/addressline/subdistrict/byIdSubdistrict/${id}`
    );
    if (dataValues.data) {
      return dataValues.data.address[0].postCode;
    }
  }
};

export const getAddressName = async (type, id) => {
  let valueAddress = "";

  if (type === "province") {
    const dataValues = await axios.get(`/addressline/province/ById/${id}`);
    if (dataValues.data.address.length > 0) {
      valueAddress = dataValues.data.address[0].provinceName;
      return valueAddress;
    }
    // await axios.get(`/addressline/province/ById/${id}`).then(async (response) => {
    //   if (response.data.error) {
    //   } else {
    //     valueAddress = response.data.address.provinceName;
    //     return valueAddress;
    //   }
    // });
  } else if (type === "district") {
    const dataValues = await axios.get(`/addressline/district/ById/${id}`);
    if (dataValues.data.address.length > 0) {
      valueAddress = dataValues.data.address[0].districtName;
      return valueAddress;
    }

    // await axios.get(`/addressline/district/ById/${id}`).then(async (response) => {
    //   if (response.data.error) {}
    //   else {
    //     valueAddress = response.data.address.districtName;
    //     return valueAddress;
    //   }
    // });
  } else if (type === "subDistrict") {
    try {
      const dataValues = await axios.get(`/addressline/subdistrict/ById/${id}`);
      if (dataValues.data.address.length > 0) {
        valueAddress = dataValues.data.address[0].subdistrictName;
        return valueAddress;
      }
      // await axios.get(`/addressline/subdistrict/ById/${id}`).then(async (response) => {
      //   if (response.data.error) {}
      //   else {
      //     valueAddress = response.data.address.subdistrictName;
      //     return valueAddress;
      //   }
      // });
    } catch {
      valueAddress = "";
    }
  }
  // } else if (type === "postcode") {
  //   try {
  //     const dataValues = await axios.get(`/addressline/subdistrict/byIdSubdistrict/${id}`);
  //     console.log(dataValues)
  //     if (dataValues.data) {
  //       valueAddress = dataValues.data.address.postCode;
  //       return valueAddress;
  //     }
  //     // await axios.get(`/addressline/subdistrict/ById/${id}`).then(async (response) => {
  //     //   if (response.data.error) {}
  //     //   else {
  //     //     valueAddress = response.data.address.subdistrictName;
  //     //     return valueAddress;
  //     //   }
  //     // });
  //   } catch {
  //     valueAddress = "";
  //   }
  // }
  return valueAddress;
};
