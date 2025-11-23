import Details from "@/components/templates/product/Details";
import Gallery from "@/components/templates/product/Gallery";
import MoreProducts from "@/components/templates/product/MoreProducts";
import Tabs from "@/components/templates/product/Tabs";
import styles from "@/styles/product.module.css";
import dbConnection from "../../../../configs/db-connection";
import ProductModel from "../../../../model/Product";
import RelatedProduct from "@/types/related-product";
import { authUser } from "@/utils/server-helper";

type Prop = {
  params: Promise<{ id: string }>;
};

const product = async ({ params }: Prop) => {
  const productID = (await params).id;
  dbConnection();

  const product = await ProductModel.findOne({ _id: productID }).populate(
    "comments"
  );

  const relatedProduct = await ProductModel.find({
    smell: product.smell,
    _id: { $ne: product._id },
  }).populate("comments");

  const user = await authUser();

  return (
    <div className={styles.container}>
      <div data-aos="fade-up" className={styles.contents}>
        <div className={styles.main}>
          <Details product={JSON.parse(JSON.stringify(product))} />
          <Gallery />
        </div>
        <Tabs
          product={JSON.parse(JSON.stringify(product))}
          emailLoginUser={user?.email || null}
        />
        <MoreProducts
          relatedProduct={JSON.parse(JSON.stringify(relatedProduct))}
        />
      </div>
    </div>
  );
};

export default product;
