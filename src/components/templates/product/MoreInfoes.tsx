import React from "react";

type Prop = {
  weight: number;
  suitableFor: string;
  smell: string;
};
const MoreInfoes = ({ weight, suitableFor, smell }: Prop) => {
  return (
    <div>
      <p>اطلاعات بیشتر :</p>
      <hr />
      <main>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p>وزن</p>
          <p>{weight} گرم</p>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p>مناسب برای</p>
          <p>{suitableFor}</p>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p>میزان بو</p>
          <p>{smell}</p>
        </div>
      </main>
    </div>
  );
};

export default MoreInfoes;
