class ValidateService {

    onHandleNumberChange = (e) => {
        const re = /^[0-9\b]+$/;

        let result = e.replace("-", "");
        // if value is not blank, then test the regex
        if (e === '' || re.test(e)) {
          return (e)
        } else {
          return ""
        }
    };

    onHandleIdentityCard = (e) => {
      const re = /^[0-9\b]+$/;
      let val = "";
      let result = e.replaceAll("-", "");
      let ArrayStr = result.split("");
      console.log(e)
      if (result === '' || re.test(result)) {
        for(var i = 0 ; i < ArrayStr.length ; i++){
          if(i === 0 && ArrayStr.length >= 2)
          {  
            val = ArrayStr[i] + '-'
          } 
          else if (i === 5 || i === 10 || i === 12 ) {
            val = val + '-' + ArrayStr[i]
          } else {
            val = val + ArrayStr[i] 
          }
        }
        return (val)
      } else {
        return ""
      }
  };
}

export default new ValidateService();