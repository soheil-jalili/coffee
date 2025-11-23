import { NextRequest } from "next/server";
import dbConnection from "../../../../../configs/db-connection";
import DiscountModel from "../../../../../model/Discount";

export const PUT = async (request: NextRequest) => {
  try {
    await dbConnection();
    const { discount, productId } = await request.json();
    // productId = array of product IDs in the cart

    const mainDiscount = await DiscountModel.findOne({ code: discount });

    if (!mainDiscount) {
      return Response.json(
        { message: "This discount code does not exist." },
        { status: 404 }
      );
    }

    if (mainDiscount.uses === mainDiscount.maxUse) {
      return Response.json(
        { message: "The Code is expired ..." },
        { status: 410 }
      );
    }

    // If this discount belongs to a specific product
    if (mainDiscount.product !== null) {
      const discountProductId = String(mainDiscount.product);

      // Check if the discounted product exists in the cart
      const isInCart = productId.map(String).includes(discountProductId);

      if (!isInCart) {
        return Response.json(
          {
            message:
              "This discount code is not valid for the products in your cart.",
          },
          { status: 422 }
        );
      }
    }

    return Response.json(mainDiscount, { status: 200 });
  } catch (error) {
    console.log("ERROR IN USE API DISCOUNT => ", error);
    return Response.json({ message: error.message }, { status: 500 });
  }
};
