import Breadcrumb from "@/components/modules/Breadcrumb/Breadcrumb";
import connectToDB from "@/configs/connect_Db";
import styles from "@/styles/wishlist.module.css";
import Link from "next/link";
import { FaRegHeart } from "react-icons/fa";
import WhishlistModel from "../../../model/Whishlist";
import { cookies } from "next/headers";
import userTokenExist from "@/utils/user-token-exist";
import ProductModel from "../../../model/Product";
import RelatedProduct from "@/types/related-product";
import Product from "@/components/modules/Product/Product";
import { redirect, RedirectType } from "next/navigation";
import { verifyToken } from "@/utils/auth";

const Wishlist = async () => {
  const token = (await cookies()).get("token");

  // if (!token?.value! || !verifyToken(token.value!)) {
  //   redirect("/login-register");
  // }

  const user = await userTokenExist(token?.value!);

  if (!user) {
    return redirect("/login-register");
  }

  connectToDB();
  const whishlistUser = await WhishlistModel.findOne({ user: user._id });

  return (
    <>
      <Breadcrumb route={"علاقه مندی ها"} />
      {!whishlistUser ||
      !whishlistUser.product ||
      whishlistUser.product.length === 0 ? (
        <div className={styles.wishlist_empty} data-aos="fade-up">
          <FaRegHeart />
          <p>محصولی یافت نشد</p>
          <span>شما هنوز هیچ محصولی در لیست علاقه مندی های خود ندارید.</span>
          <span>در صفحه "فروشگاه" محصولات جالب زیادی پیدا خواهید کرد.</span>
          <div>
            <Link href="/category">بازگشت به فروشگاه</Link>
          </div>
        </div>
      ) : (
        <main className={styles.container} data-aos="fade-up">
          <p className={styles.title}>محصولات مورد علاقه شما</p>
          <section>
            {
            (
              await ProductModel.find({ _id: whishlistUser.product })
                .populate("comments")
                .lean()
            ).map((product: RelatedProduct) => (
              <Product {...product} key={product._id} />
            ))
            
            }
          </section>
        </main>
      )}
    </>
  );
};

export default Wishlist;
