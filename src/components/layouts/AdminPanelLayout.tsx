import React from "react";
import styles from "./adminPanelLayout.module.css";
import Sidebar from "../modules/p-admin/Sidebar";
import Topbar from "../modules/p-admin/Topbor";
import { authUser } from "@/utils/server-helper";
import { redirect } from "next/navigation";

const AdminPanelLayout: React.FC<{ children: React.ReactNode }> = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const user = await authUser();
  if (!user) {
    redirect("/login-register");
  } else if (user.role !== "ADMIN") {
    return redirect("/not-found");
  }

  return (
    <div className={styles.layout}>
      <section className={styles.section}>
        <Sidebar />
        <div className={styles.contents}>
          <Topbar />
          {children}
        </div>
      </section>
    </div>
  );
};

export default AdminPanelLayout;
