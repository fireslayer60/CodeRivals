import React from 'react'
import bronze1 from "../../../../assets/ranks/bronze/bronze_1.png";
import bronze2 from "../../../../assets/ranks/bronze/bronze_2.png";
import silver1 from "../../../../assets/ranks/silver/silver_1.png";
import silver2 from "../../../../assets/ranks/silver/silver_2.png";
import gold1 from "../../../../assets/ranks/gold/gold_1.png";
import gold2 from "../../../../assets/ranks/gold/gold_2.png";
import platinum1 from "../../../../assets/ranks/platinum/platinum_1.png";
import platinum2 from "../../../../assets/ranks/platinum/platinum_2.png";
import diamond1 from "../../../../assets/ranks/diamond/diamond_1.png";
import diamond2 from "../../../../assets/ranks/diamond/diamond_2.png";
import elite1 from "../../../../assets/ranks/elite/elite_1.png";
import elite2 from "../../../../assets/ranks/elite/elite_2.png";
import master from "../../../../assets/ranks/master/master.png";
// ... import other rank images

const rankImages = {
  Bronze: [bronze1, bronze2],
  Silver: [silver1,silver2],
  Gold: [gold1, gold2],
  Platinum: [platinum1,platinum2],
  Diamond: [diamond1,diamond2],
  Elite: [elite1, elite2],
  Master:[master],
  

  // ...
  
};



function Rank_img(props) {
    const rankImage = props.subRank ? rankImages[props.rank][props.subRank - 1] : rankImages[props.rank];
  return (
    <img src={rankImage} alt={`${props.rank} ${props.subRank || ""}`} />
  )
}

export default Rank_img
