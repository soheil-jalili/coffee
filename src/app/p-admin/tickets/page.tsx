import AdminPanelLayout from "@/components/layouts/AdminPanelLayout";
import React from "react";
import dbConnection from "../../../../configs/db-connection";
import TicketModel from "../../../../model/Ticket";
import styles from "@/components/templates/p-admin/tickets/table.module.css";
import Table from "@/components/templates/p-admin/tickets/Table";

const TicketAdminPanel: React.FC = async () => {
  await dbConnection();
  const tickets = await TicketModel.find({ isAnswer: false })
    .populate("department")
    .populate("user")
    .sort({ priority: 1, _id: -1 });

  return (
    <AdminPanelLayout>
      <main>
        {tickets.length === 0 ? (
          <p className={styles.empty}>تیکتی وجود ندارد</p>
        ) : (
          <Table
            tickets={JSON.parse(JSON.stringify(tickets))}
            title="لیست تیکت ها"
          />
        )}
      </main>
    </AdminPanelLayout>
  );
};

export default TicketAdminPanel;
