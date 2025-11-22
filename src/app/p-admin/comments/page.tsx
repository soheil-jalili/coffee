import AdminPanelLayout from "@/components/layouts/AdminPanelLayout";
import React from "react";
import dbConnection from "../../../../configs/db-connection";
import CommentModel from "../../../../model/Comment";
import styles from "@/components/templates/p-admin/comments/table.module.css";
import Table from "@/components/templates/p-admin/comments/Table";

const CommentAdminPanel: React.FC = async () => {
  await dbConnection();
  const comments = await CommentModel.find({})
    .populate("productId")
    .populate("user").sort({_id : -1});

    console.log(comments)
  return (
    <AdminPanelLayout>
      <main>
        {comments.length === 0 ? (
          <p className={styles.empty}>کامنتی وجود ندارد</p>
        ) : (
          <Table
            comments={JSON.parse(JSON.stringify(comments))}
            title="لیست کامنت ها"
          />
        )}
      </main>
    </AdminPanelLayout>
  );
};

export default CommentAdminPanel;
