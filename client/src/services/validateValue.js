class ValidateService {
  onHandleNumberChange = (e) => {
    const re = /^[0-9\b]+$/;
    // if value is not blank, then test the regex
    if (e === "" || re.test(e)) {
      return e;
    } else {
      return "";
    }
  };

  onHandleDecimalChange = (e) => {
    const re = /([^0-9.]+)/;
    if(re.test(e.target.value))
    { 
      return Number(0).toFixed(2);
    }

    let val = e.target.value;
    val = val.replace(/([^0-9.]+)/, "");
    val = val.replace(/^(0|\.)/, "");
    const match = /(\d{0,7})[^.]*((?:\.\d{0,2})?)/g.exec(val);
    const value = match[1] + match[2];
    if (val.length > 0) {
      e.target.value = Number(value).toFixed(2);
      return e.target.value;
    }

    // console.log(val)
    // if (val.length > 0) {
    //   e.target.value = Number(value).toFixed(2);
    //   e.target.setSelectionRange(this.start, this.start);
    //   return Number(value).toFixed(2);
    // }
  };

  onHandlePhoneChange = (e) => {
    const re = /^[0-9\b]+$/;
    // if value is not blank, then test the regex
    if (e === "" || re.test(e) || e.includes("x")) return e;
    else return "";

    // if ((e === "" || re.test(e)) && e.indexOf('x') === -1 ) {
    //   return e;
    // } else {
    //   return "";
    // }
  };

  onHandleNumber = (e) => {
    var value = this.onHandleNumberChange(e.target.value);
    return value.toString();
  };

  onHandleDecimal = (e) => {
    var value = this.onHandleDecimalChange(e);
    return value;
  };

  onHandleNumberValue = (e) => {
    var value = this.onHandleNumberChange(e.target.value);

    return parseInt(value === "" || value == null ? 0 : value).toString();
  };

  onHandleIdentityCard = (e) => {
    const re = /^[0-9\b]+$/;
    let val = "";
    let result = e.replaceAll("-", "");
    let ArrayStr = result.split("");

    if (result === "" || re.test(result)) {
      for (var i = 0; i < ArrayStr.length; i++) {
        if (i === 0 && ArrayStr.length >= 2) {
          val = ArrayStr[i] + "-";
        } else if (i === 5 || i === 10 || i === 12) {
          val = val + "-" + ArrayStr[i];
        } else {
          val = val + ArrayStr[i];
        }
      }
      return val;
    } else {
      return "";
    }
  };

  defaultValue = (options, value) => {
    if (
      (value === undefined || value === null || value.toString() === "") &&
      options[0] !== undefined
    ) {
      value = options[0].value;
    }
    return options.length > 0
      ? options.find((option) => option.value.toString() === value.toString())
      : "";
  };

  defaultValueText = (options, value) => {
    if (
      (value === undefined || value === null || value.toString() === "") &&
      options[0] !== undefined
    ) {
      value = options[0].value;
    }
    return options
      ? (value = options.filter((x) => x.value === value.toString())[0].label)
      : "";
  };

  withOutTime = (dateTime) => {
    var date = new Date(dateTime);
    date.setHours(0, 0, 0, 0);
    return date;
  };

  validateImage = (e) => {
    var ext = this.getExtension(e);
    switch (ext.toLowerCase()) {
      case 'jpg':
      case 'gif':
      case 'bmp':
      case 'png':
      case 'ico':
        //etc
        return false;
    }
    return true;
  }

  getExtension = (filename) => {
    var parts = filename.split('.');
    return parts[parts.length - 1];
  }


  validateExcel = (e) => {
    var ext = this.getExtension(e);
    switch (ext.toLowerCase()) {
      case 'xls':
      case 'xlsx':
        //etc
        return false;
    }
    return true;
  }


  validateStartEndDate =(e) =>{
    
  }
}

export default new ValidateService();
