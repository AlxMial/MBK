class decodeCoupon {
    
     decryptCoupon = (codeCoupon,length) =>{
        const iv = '283d0ce11c80a9a4da9eebcb40e7c7d9';
        const content = '1fda3b405f0edf98ef80';
        var code = codeCoupon.substring(length-4, length).split('');
        var isMatch = 0;
        for(var i = 0 ; i < 4 ; i++){
          isMatch = content.indexOf(code[0]);
          if(isMatch < 0)
            break;
        }
        return (isMatch < 0) ? false : true;
      }
}    

module.exports = decodeCoupon;