import DataTable from "@/components/templates/p-user/comments/DataTable";
import Layout from "@/components/layouts/UserPanelLayout";
import React from "react";
import connectToDB from "@/configs/connect_Db";
import CommentModel from "../../../../model/Comment";
import styles from "@/styles/p-user/dataTable.module.css";
import { authUser } from "@/utils/server-helper";
const Comments = async () => {
  connectToDB();
  const user = await authUser();
  const comments = await CommentModel.find({ user: user._id }, "-__v").populate('productId' , 'name');


  return (
    <Layout>
      <main>
        {comments.length !== 0 ? (
          <DataTable
            comments={JSON.parse(JSON.stringify(comments))}
            title="لیست کامنت‌ها"
          />
        ) : (
          <p className={styles.empty}>کامنتی وجود ندارد</p>
        )}
      </main>
    </Layout>
  );
};

export default Comments;
