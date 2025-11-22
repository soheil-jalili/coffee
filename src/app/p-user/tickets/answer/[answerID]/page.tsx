import UserPanelLayout from "@/components/layouts/UserPanelLayout";
import mongoose from "mongoose";
import React from "react";

import styles from "@/styles/p-user/answerTicket.module.css";
import Link from "next/link";
import Answer from "@/components/templates/p-user/tickets/Answer";
import connectToDB from "@/configs/connect_Db";
import TicketModel from "../../../../../../model/Ticket";
import UserModel from "../../../../../../model/User";

const page = async ({
  params,
}: {
  params: Promise<{ answerID: mongoose.Types.ObjectId }>;
}) => {
  const { answerID } = await params;
  await connectToDB();
  const ticket = await TicketModel.findOne({ _id: answerID })
    .populate("user")
    .lean();
  const answerTicket = await TicketModel.findOne({ mainTicketID: ticket._id })
    .populate("mainTicketID")
    .populate("user").lean();

  console.log(answerTicket.user.name);
  return (
    <UserPanelLayout>
      <main className={styles.container}>
        <h1 className={styles.title}>
          <span>{ticket.title}</span>
          <Link href="/p-user/tickets/sendTicket">ارسال تیکت جدید</Link>
        </h1>

        <div>
          <Answer type="user" {...ticket} />

          {answerTicket && (
            <Answer
              user={answerTicket.user}
              body={answerTicket.body}
              createdAt={answerTicket.createdAt}
              title={answerTicket.title}
              type="admin"
            />
          )}

          {!answerTicket && (
            <div className={styles.empty}>
              <p>هنوز پاسخی دریافت نکردید</p>
            </div>
          )}
        </div>
      </main>
    </UserPanelLayout>
  );
};

export default page;
