
export const IsNullOrEmpty = (obj) => {
  if ("undefined" === typeof obj || obj == null) {
    return true;
  } else if (
    typeof obj != "undefined" &&
    obj != null &&
    obj.length != null &&
    obj.length == 0
  ) {
    return true; //array
  } else if ("number" === typeof obj) {
    return obj !== obj; //NaN
  } else if ("string" === typeof obj) {
    return obj.length < 1 ? true : false;
  } else {
    return false;
  }
};
// DateTime To yyyy-MM-dd
export const ConverDateTimeToString = (date) => {
  let str = "";
  if (!IsNullOrEmpty(date)) {
    const MM =
      date.getMonth() < 10
        ? "0" + (date.getMonth()+1)
        : date.getMonth();
    const DD =
      date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    str = date.getFullYear() + "-" + MM + "-" + DD;
  }
  return str;
};

export const ConverDateTimeToDatePicker = (date) => {
  let str = "";
  if (!IsNullOrEmpty(date)) {
    const MM =
      date.getMonth() < 10
        ? "0" +(date.getMonth()+1)
        : date.getMonth();
    const DD =
      date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    str =MM +"-"  +DD + "-"+date.getFullYear() 
  }
  return str;
};

export const  DifferenceDate =(date1, date2)=> {
  
  var result = {
      years:  date2.getYear()  - date1.getYear(),
      months: date2.getMonth() - date1.getMonth(),
      days:   date2.getDate()  - date1.getDate(),
      hours:  date2.getHours() - date1.getHours()
  };
  if (result.hours < 0) {
      result.days--;
      result.hours += 24;
  }
  if (result.days < 0) {
      result.months--;
      // days = days left in date1's month, 
      //   plus days that have passed in date2's month
      var copy1 = new Date(date1.getTime());
      copy1.setDate(32);
      result.days = 32-date1.getDate()-copy1.getDate()+date2.getDate();
  }
  if (result.months < 0) {
      result.years--;
      result.months+=12;
  }
  return result;
}