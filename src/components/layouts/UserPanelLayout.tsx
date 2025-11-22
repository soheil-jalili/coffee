import React, { ReactNode } from "react";
import styles from "./userPanelLayout.module.css";
import Topbar from "../modules/p-user/Topbar";
import Sidebar from "../modules/p-user/Sidebar";
import { cookies } from "next/headers";
import userTokenExist from "@/utils/user-token-exist";
import { authUser } from "@/utils/server-helper";
import { redirect } from "next/navigation";

const UserPanelLayout = async ({ children }: { children: ReactNode }) => {
  const user = await authUser();
  if (!user) {
    redirect("/login-register");
  }
  const token = (await cookies()).get("token");
  const userToken = await userTokenExist(token?.value!);
  return (
    <div className={styles.layout}>
      <section className={styles.section}>
        <Sidebar user={JSON.parse(JSON.stringify(userToken))} />
        <div className={styles.contents}>
          <Topbar />
          {children}
        </div>
      </section>
    </div>
  );
};

export default UserPanelLayout;
