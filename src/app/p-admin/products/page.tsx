import AdminPanelLayout from "@/components/layouts/AdminPanelLayout";
import React from "react";
import dbConnection from "../../../../configs/db-connection";
import ProductModel from "../../../../model/Product";
import Table from "@/components/templates/p-admin/products/Table";
import styles from "@/components/templates/p-admin/products/table.module.css";
import AddProduct from "@/components/templates/p-admin/products/AddProduct/AddProduct";

const ProductsAdminPanel: React.FC = async () => {
  await dbConnection();
  const products = await ProductModel.find({});
  
  return (
    <AdminPanelLayout>
      <main>
        <AddProduct />

        {products.length === 0 ? (
          <p className={styles.empty}>محصولی وجود ندارد</p>
        ) : (
          <Table
            products={JSON.parse(JSON.stringify(products))}
            title="لیست محصولات"
          />
        )}
      </main>
    </AdminPanelLayout>
  );
};

export default ProductsAdminPanel;
