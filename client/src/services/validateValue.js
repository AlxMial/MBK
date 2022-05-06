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

  /*พิมพ์เบอร์โทรศัพท์*/
  onHandleScore = (e) => {
    var value = this.onHandleNumberChange(e.target.value);
    return value.toString();
  };

  onHandleIdentityCard = (e) => {
    const re = /^[0-9\b]+$/;
    let val = "";
    let result = e.replaceAll("-", "");
    let ArrayStr = result.split("");
    console.log(e);
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
    if (value.toString() === "" && options[0] !== undefined) {
      value = options[0].value;
    }
    return options
      ? options.find((option) => option.value.toString() === value.toString())
      : "";
  };
}

export default new ValidateService();