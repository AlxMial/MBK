const { tbMember } = require("../models");

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
        
    }
  };
}

module.exports = generateMember;
