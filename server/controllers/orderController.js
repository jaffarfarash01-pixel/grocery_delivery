
const {
  sequelize,
  Cart,
  CartItem,
  Product,
  Order,
  OrderItem,
} = require("../models");

const { Op } = require("sequelize");

// PLACE ORDER FROM CART
exports.placeOrder = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { userId } = req.body;

    if (!userId) {
      await transaction.rollback();

      return res.status(400).json({
        message: "User ID is required",
      });
    }

    const cart = await Cart.findOne({
      where: { userId },
      include: [
        {
          model: CartItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
            },
          ],
        },
      ],
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!cart || cart.items.length === 0) {
      await transaction.rollback();

      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    // Validate products and calculate the total
    let totalAmount = 0;

    for (const item of cart.items) {
      const product = await Product.findByPk(item.productId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (
        !product ||
        product.isAvailable === false ||
        product.stock < item.quantity
      ) {
        await transaction.rollback();

        return res.status(400).json({
          message: `Insufficient stock or unavailable product: ${
            product ? product.name : item.productId
          }`,
        });
      }

      totalAmount += Number(product.price) * item.quantity;
    }

    // Create the order
    const order = await Order.create(
      {
        userId,
        totalAmount: Number(totalAmount.toFixed(2)),
        status: "pending",
        paymentStatus: "pending",
      },
      { transaction }
    );

    // Save order items and reduce stock
    for (const item of cart.items) {
      const product = await Product.findByPk(item.productId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      await OrderItem.create(
        {
          orderId: order.id,
          productId: product.id,
          quantity: item.quantity,
          price: product.price,
        },
        { transaction }
      );

      await product.update(
        {
          stock: product.stock - item.quantity,
        },
        { transaction }
      );
    }

    // Clear the cart after the order is saved
    await CartItem.destroy({
      where: {
        cartId: cart.id,
      },
      transaction,
    });

    await transaction.commit();

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }

    res.status(500).json({
      message: error.message,
    });
  }
};
