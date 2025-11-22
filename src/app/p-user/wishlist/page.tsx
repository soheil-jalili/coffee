import UserPanelLayout from "@/components/layouts/UserPanelLayout";
import Product from "@/components/templates/p-user/wishlist/Product";
import connectToDB from "@/configs/connect_Db";
import styles from "@/styles/p-user/wishlist.module.css";
import { authUser } from "@/utils/server-helper";
import WhishlistModel from "../../../../model/Whishlist";

const page = async () => {
  connectToDB();
  const user = await authUser();
  const wishlistUser = await WhishlistModel.find({ user: user._id }).populate(
    "product"
  );

  return (
    <UserPanelLayout>
      <main>
        <h1 className={styles.title}>
          <span>علاقه مندی ها</span>
        </h1>
        <div className={styles.container}>
          {wishlistUser.length !== 0 ? (
            wishlistUser.map((wish: any) => (
              <Product
                key={wish.product._id}
                name={wish.product.name}
                price={wish.product.price}
                score={wish.product.score}
                _id={JSON.parse(JSON.stringify(wish._id))}
              />
            ))
          ) : (
            <p className={styles.empty}>محصولی وجود ندارد</p>
          )}
        </div>
      </main>
    </UserPanelLayout>
  );
};

export default page;
