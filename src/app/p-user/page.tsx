import styles from "@/styles/p-user/index.module.css";
import Box from "@/components/templates/p-user/index/Box";
import Tickets from "@/components/templates/p-user/index/Tickets";
import Orders from "@/components/templates/p-user/index/Orders";
import UserPanelLayout from "@/components/layouts/UserPanelLayout";
import { authUser } from "@/utils/server-helper";
import { redirect } from "next/navigation";
import dbConnection from "../../../configs/db-connection";
import TicketModel from "../../../model/Ticket";
import CommentModel from "../../../model/Comment";
import WhishlistModel from "../../../model/Whishlist";

const page = async () => {
  await dbConnection();
  const user = await authUser();
  if (!user) {
    return redirect("/login-register");
  }

  const ticketsLength = await TicketModel.find({ user: user._id }).populate(
    "department"
  );

  const mainTicket = await TicketModel.find(
    { user: user._id },
    "title body createdAt hasAnswer department"
  )
    .populate("department")

    .limit(3)
    .populate("mainTicketID")
    .sort({ _id: -1 });

  const commentsLength = await CommentModel.find({ user: user._id });
  const wishlistsLength = await WhishlistModel.find({ user: user._id });

  return (
    <UserPanelLayout>
      <main>
        <section className={styles.boxes}>
          <Box title="مجموع تیکت ها " value={ticketsLength.length} />
          <Box title="مجموع کامنت ها " value={commentsLength.length} />
          <Box title="مجموع سفارشات" value={0} />
          <Box title="مجموع علاقه مندی ها" value={wishlistsLength.length} />
        </section>
        <section className={styles.contents}>
          <Tickets tickets={JSON.parse(JSON.stringify(mainTicket))} />
          <Orders />
        </section>
      </main>
    </UserPanelLayout>
  );
};

export default page;
