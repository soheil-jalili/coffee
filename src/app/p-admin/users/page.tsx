import AdminPanelLayout from "@/components/layouts/AdminPanelLayout";
import React from "react";
import dbConnection from "../../../../configs/db-connection";
import UserModel from "../../../../model/User";
import styles from "@/components/templates/p-admin/users/table.module.css";
import Table from "@/components/templates/p-admin/users/Table";

const UsersAdminPanel: React.FC = async () => {
  await dbConnection();
  const users = await UserModel.find({});
  return (
    <AdminPanelLayout>
      <main>
        {users.length === 0 ? (
          <p className={styles.empty}>کاربری وجود ندارد</p>
        ) : (
          <Table
            users={JSON.parse(JSON.stringify(users))}
            title="لیست کاربران"
          />
        )}
      </main>
    </AdminPanelLayout>
  );
};

export default UsersAdminPanel;
