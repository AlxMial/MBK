import api_province from "../assets/data/api_province.json";
import api_amphure from "../assets/data/api_amphure.json";
import api_tombon from "../assets/data/api_tombon.json";

const SortValue = (Json) => {
  Json.sort(function (a, b) {
    return a.label.localeCompare(b.label);
  });
  return Json;
};

export const getSubDistrict = () => {
  var JsonSubDistrict = [];
  api_tombon.forEach((field) => {
    JsonSubDistrict.push({ value: field.value.toString(), label: field.label });
  });
  SortValue(JsonSubDistrict);
  return JsonSubDistrict;
};

export const getProvince = async () => {
  var JsonProvince = [];
  await api_province.forEach((field) => {
    JsonProvince.push({ value: field.value.toString(), label: field.label });
  });
  SortValue(JsonProvince);
  return JsonProvince;
};

export const getDistrict = async () => {
  var JsonDistrict = [];
  await api_amphure.forEach((field) => {
    JsonDistrict.push({ value: field.value.toString(), label: field.label });
  });
  SortValue(JsonDistrict);
  return JsonDistrict;
};

export const getAddress = async (type, id) => {
  var Json = [];
  if (type === "district") {
    await api_amphure
      .filter((e) => e.province_id.toString() === id)
      .forEach((field) => {
        Json.push({
          value: field.value.toString(),
          label: field.label,
        });
      });

    SortValue(Json);
    return Json;
  } else if (type === "subDistrict") {
    await api_tombon
      .filter((e) => e.value.toString().substring(0, 4) === id)
      .forEach((field) => {
        Json.push({
          value: field.value.toString(),
          label: field.label,
        });
      });

    SortValue(Json);
    return Json;
  } else if (type === "postcode") {

    await api_tombon
      .filter((e) => e.value.toString() === id)
      .forEach((field) => {
        Json.push({
          value: field.value.toString(),
          label: field.zip_code,
        });
      });
    SortValue(Json);
    return Json.length > 0 ? Json[0].label : "";
  }
};

export const getAddressName = async (type, id) => {
  let valueAddress = "";
  if (type === "province") {
    valueAddress = await api_province.filter((e) => e.value.toString() === id)[0].label;
  } else if (type === "district") {
    valueAddress = await api_amphure.filter((e) => e.value.toString() === id)[0].label;
  } else if (type === "subDistrict") {
    try {
      console.log(id)
      valueAddress = await api_tombon.filter((e) => e.value.toString() === id)[0].label;
    } catch {
      valueAddress = ""
    }
  }
  return valueAddress;
};
