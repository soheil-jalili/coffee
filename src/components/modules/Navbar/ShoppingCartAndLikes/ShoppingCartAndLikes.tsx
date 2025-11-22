import userTokenExist from "@/utils/user-token-exist";
import styles from "../Navbar.module.css";
import Link from "next/link";
import { FaRegHeart, FaShoppingCart } from "react-icons/fa";
import { cookies } from "next/headers";
import WhishlistModel from "../../../../../model/Whishlist";
import connectToDB from "@/configs/connect_Db";

const ShoppingCartAndLikes = async () => {
  const token = (await cookies()).get("token");
  const user = await userTokenExist(token?.value!);

  let wishListUser = [];
  if (user) {
    connectToDB();
    wishListUser = await WhishlistModel.find({ user: user._id }).lean();
  }

  return (
    <div className={styles.navbar_icons}>
      <Link href="/cart">
        <FaShoppingCart />
        <span>1</span>
      </Link>
      <Link href="/wishlist">
        <FaRegHeart />
        {wishListUser.length !== 0 && <span>{wishListUser.length}</span>}
      </Link>
    </div>
  );
};

export default ShoppingCartAndLikes;
