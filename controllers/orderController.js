
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


 // GET ORDER HISTORY FOR A USER
exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.findAll({
      where: { userId },
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name", "price", "unit"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


 // UPDATE ORDER STATUS
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status",
        allowedStatuses,
      });
    }

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    await order.update({ status });

    res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.cancelOrder = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      await transaction.rollback();
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    const order = await Order.findOne({
      where: { id, userId },
      include: [{ model: OrderItem, as: "items" }],
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!order) {
      await transaction.rollback();
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (!["pending", "confirmed"].includes(order.status)) {
      await transaction.rollback();
      return res.status(400).json({
        message: "This order can no longer be cancelled",
      });
    }

    for (const item of order.items) {
      const product = await Product.findByPk(item.productId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (product) {
        await product.update(
          { stock: product.stock + item.quantity },
          { transaction }
        );
      }
    }

    await order.update({ status: "cancelled" }, { transaction });

    await transaction.commit();

    res.status(200).json({
      message: "Order cancelled successfully",
      orderId: order.id,
      status: "cancelled",
    });
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }

    res.status(500).json({ message: error.message });
  }
};


 // GET ORDER DETAILS BY ID
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id, {
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name", "price", "unit"],
            },
          ],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


 // UPDATE PAYMENT STATUS
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    const allowedStatuses = [
      "pending",
      "paid",
      "failed",
      "refunded",
    ];

    if (!allowedStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        message: "Invalid payment status",
        allowedStatuses,
      });
    }

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    await order.update({ paymentStatus });

    res.status(200).json({
      message: "Payment status updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
