import UserPanelLayout from "@/components/layouts/UserPanelLayout";
import styles from "@/styles/p-user/sendTicket.module.css";
import Link from "next/link";

import DepartmentModel from "../../../../../model/Department";
import SubDepartmentModel from "../../../../../model/SubDepartment";
import SendTicket from "@/components/templates/p-user/tickets/SendTicket";
import dbConnection from "../../../../../configs/db-connection";

const SendTicketPage = async () => {
  await dbConnection()
  const mainDepartments = await DepartmentModel.find({});
  const subDepartments = await SubDepartmentModel.find({});

  return (
    <UserPanelLayout>
      <main className={styles.container}>
        <h1 className={styles.title}>
          <span>ارسال تیکت جدید</span>
          <Link href="/p-user/tickets"> همه تیکت ها</Link>
        </h1>
        <SendTicket
          mainDepartments={JSON.parse(JSON.stringify(mainDepartments))}
          subDepartments={JSON.parse(JSON.stringify(subDepartments))}
        />
      </main>
    </UserPanelLayout>
  );
};

export default SendTicketPage;
