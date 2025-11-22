import UserPanelLayout from "@/components/layouts/UserPanelLayout";
import connectToDB from "@/configs/connect_Db";
import TicketModel from "../../../../model/Ticket";
import Tickets from "@/components/templates/p-user/tickets/Tickets";
import { authUser } from "@/utils/server-helper";

const TicketsPage = async () => {
  await connectToDB();
  const user = await authUser();

  const tickets = await TicketModel.find({ user: user._id, isAnswer : false }, "-__v")
    .populate("department")
    .sort({ _id: -1 });

  return (
    <UserPanelLayout>
      <Tickets tickets={JSON.parse(JSON.stringify(tickets))} />
    </UserPanelLayout>
  );
};

export default TicketsPage;
