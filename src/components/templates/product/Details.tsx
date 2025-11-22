import { FaFacebookF, FaStar, FaTwitter } from "react-icons/fa";
import { IoCheckmark } from "react-icons/io5";
import { TbSwitch3 } from "react-icons/tb";
import { FaTelegram, FaLinkedinIn, FaPinterest } from "react-icons/fa";
import styles from "./details.module.css";
import Breadcrumb from "./Breadcrumb";
import CommentType from "@/types/comment-type";
import averageScore from "@/utils/avg-score";
import AddToWishList from "../wishlist/AddToWishList";
import { cookies } from "next/headers";
import userTokenExist from "@/utils/user-token-exist";
import WhishlistModel from "../../../../model/Whishlist";
import AddBasket from "./AddBasket";

type Prop = {
  product: {
    _id: string;
    name: string;
    shortDescription: string;
    price: number;
    score: number;
    tags: string[];
    comments: CommentType[];
  };
};

const Details = async ({
  product: { _id, comments, name, price, score, shortDescription, tags },
}: Prop) => {
  const token = (await cookies()).get("token");
  const user = await userTokenExist(token?.value!);

  let isInWishList = {};

  if (user) {
    isInWishList = await WhishlistModel.findOne({
      product: _id,
      user: user._id,
    }).lean();
  }

  return (
    <main style={{ width: "63%" }}>
      <Breadcrumb title={name} />
      <h2>{name}</h2>

      <div className={styles.rating}>
        <div>
          {Array.from({ length: 5 }).map((item, index: number) => {
            return index <= Math.round(averageScore(comments)) - 1 ? (
              <FaStar key={index} color="orange" />
            ) : (
              <FaStar key={index} color="#eee" />
            );
          })}
        </div>
        <p>
          (دیدگاه{" "}
          {comments.filter((comment: CommentType) => comment.isAccept).length}{" "}
          کاربر)
        </p>
      </div>

      <p className={styles.price}>{price.toLocaleString()} تومان</p>
      <span className={styles.description}>{shortDescription}</span>

      <hr />

      <div className={styles.Available}>
        <IoCheckmark />
        <p>موجود در انبار</p>
      </div>

      <AddBasket _id={_id} name={name} price={price} />
      <section className={styles.wishlist}>
        <AddToWishList
          product_id={JSON.parse(JSON.stringify(_id))}
          user={JSON.parse(JSON.stringify(user))}
          isInWishList={isInWishList && Object.keys(isInWishList).length > 0}
        />
        <div>
          <TbSwitch3 />
          <a href="/">مقایسه</a>
        </div>
      </section>

      <hr />

      <div className={styles.details}>
        <strong>شناسه محصول: {_id.toString()}</strong>
        <p>
          <strong>برچسب:</strong>{" "}
          {tags.length === 0 ? "خالی" : tags.join(" , ")}
        </p>
      </div>

      <div className={styles.share}>
        <p>به اشتراک گذاری: </p>
        <a href="/">
          <FaTelegram />
        </a>
        <a href="/">
          <FaLinkedinIn />
        </a>
        <a href="/">
          <FaPinterest />
        </a>
        <a href="/">
          <FaTwitter />
        </a>
        <a href="/">
          <FaFacebookF />
        </a>
      </div>

      <hr />
    </main>
  );
};

export default Details;
