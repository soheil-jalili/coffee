import React from "react";

type Prop = {
  longDescription: string;
};
const Description = ({ longDescription }: Prop) => {
  return (
    <div>
      <p>توضیحات :</p>
      <hr />
      <p>{longDescription}</p>
    </div>
  );
};

export default Description;
