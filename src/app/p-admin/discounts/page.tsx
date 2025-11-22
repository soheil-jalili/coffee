import AdminPanelLayout from "@/components/layouts/AdminPanelLayout";
import React from "react";
import dbConnection from "../../../../configs/db-connection";
import Table from "@/components/templates/p-admin/discounts/Table";
import styles from '@/components/templates/p-admin/discounts/table.module.css'
import DiscountModel from "../../../../model/Discount";
import AddDiscount from "@/components/templates/p-admin/discounts/AddDiscount/AddDiscount";

const DiscountAdminPanel: React.FC = async () => {
  await dbConnection();
  const discounts = await DiscountModel.find({})
    .populate("product")
    .populate("user")
    .sort({ _id: -1 });
  return (
    <AdminPanelLayout>
      <main>
        <AddDiscount />
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
