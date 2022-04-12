class ValidateService {

    onHandleNumberChange = (e) => {
        const re = /^[0-9\b]+$/;

        // if value is not blank, then test the regex
        if (e === '' || re.test(e)) {
          return (e)
        } else {
          return ""
        }
    };
}

export default new ValidateService();