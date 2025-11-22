import React from "react";
import Stepper from "@/components/modules/stepper/Stepper";
import Table from "@/components/templates/cart/Table";
import styles from "@/styles/cart.module.css";
const CartPage: React.FC = () => {
  return (
    <>
      <Stepper step="cart" />

      <main className={styles.cart} data-aos="fade-up">
        <Table />
      </main>

      {/* <div class={styles.cart_empty} data-aos="fade-up">
                      <TbShoppingCartX />
                      <p>سبد خرید شما در حال حاضر خالی است. </p>
                      <span>قبل از تسویه حساب، باید چند محصول را به سبد خرید خود اضافه کنید.</span>
                      <span>در صفحه "فروشگاه"، محصولات جالب زیادی خواهید یافت.</span>
                      <div>
                          <Link href='/category'>بازگشت به فروشگاه</Link>
                      </div>
                  </div> */}
    </>
  );
};

export default CartPage;
