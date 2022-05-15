const { tbMember } = require("../models");
const ValidateEncrypt = require("./crypto");
const Encrypt = new ValidateEncrypt();

class generateMember {
  generateMemberCard = async () => {
    let MainCard = "PRG";
    let Year = new Date().getFullYear();
    let alfabet ="ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const member = await tbMember.findOne({
      where: { isDeleted: false },
      order: [["createdAt", "DESC"]],
    });
    if (member === null) {
        MainCard = MainCard + Year + '-'+'A'+'00001';;
        return MainCard;
    } else {
        let MemberCard = Encrypt.DecodeKey(member.memberCard)
        
        let firtMember = MemberCard.substring(0,9);
        let secondMember =  MemberCard.substring(MemberCard.length-5,MemberCard.length);
        let newMember = parseInt(secondMember)+1;
        let membberCard = firtMember+("0000" + newMember).slice(-5);
        return membberCard;
    }
  };
}

module.exports = generateMember;
