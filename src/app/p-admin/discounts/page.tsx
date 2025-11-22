import AdminPanelLayout from "@/components/layouts/AdminPanelLayout";
import React from "react";
import dbConnection from "../../../../configs/db-connection";
import styles from "@/components/templates/p-admin/tickets/table.module.css";
import Table from "@/components/templates/p-admin/discounts/Table";
import DiscountModel from "../../../../model/Discount";

const DiscountAdminPanel: React.FC = async () => {
  await dbConnection();
  const discounts = await DiscountModel.find({})
    .populate("product")
    .sort({ _id: -1 });
  return (
    <AdminPanelLayout>
      <main>
        {discounts.length === 0 ? (
          <p className={styles.empty}>کد تخفیفی وجود ندارد</p>
        ) : (
          <Table
            discounts={JSON.parse(JSON.stringify(discounts))}
            title="لیست کد تخفیف ها"
          />
        )}
      </main>
    </AdminPanelLayout>
  );
};

export default DiscountAdminPanel;
