const { Cart, CartItem, Product, Vendor, Category } = require("../models");


// const { Cart, CartItem, Product, Vendor, Category } = require("../models");

// CREATE OR GET CART
exports.getOrCreateCart = async (req, res) => {
  try {
    // For now, use the user ID sent in the request
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    let cart = await Cart.findOne({
      where: { userId },
    });

    if (!cart) {
      cart = await Cart.create({ userId });
    }

    res.status(200).json({
      message: "Cart retrieved successfully",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


exports.addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || !Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        message: "Valid userId, productId, and quantity are required",
      });
    }

    const cart = await Cart.findOne({
      where: { userId },
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found. Create a cart first.",
      });
    }

    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (product.isAvailable === false || product.stock < quantity) {
      return res.status(400).json({
        message: "Product is unavailable or stock is insufficient",
      });
    }

    const existingItem = await CartItem.findOne({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;

      if (product.stock < newQuantity) {
        return res.status(400).json({
          message: "Insufficient stock for requested quantity",
        });
      }

      await existingItem.update({ quantity: newQuantity });

      return res.status(200).json({
        message: "Cart item quantity updated",
        item: existingItem,
      });
    }

    const item = await CartItem.create({
      cartId: cart.id,
      productId,
      quantity,
    });

    res.status(201).json({
      message: "Product added to cart successfully",
      item,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


exports.getCart = async (req, res) => {
  try {
    const { userId } = req.params;

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
              attributes: ["id", "name", "price", "unit", "stock"],
              include: [
                {
                  model: Vendor,
                  as: "vendor",
                  attributes: ["id", "name"],
                },
                {
                  model: Category,
                  as: "category",
                  attributes: ["id", "name"],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const total = cart.items.reduce((sum, item) => {
      return sum + Number(item.product.price) * item.quantity;
    }, 0);

    res.status(200).json({
      message: "Cart retrieved successfully",
      cart,
      total: Number(total.toFixed(2)),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


exports.updateCartItem = async (req, res) => {
  try {
    const { userId, quantity } = req.body;
    const { itemId } = req.params;

    if (!userId || !Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        message: "Valid userId and quantity are required",
      });
    }

    const cart = await Cart.findOne({
      where: { userId },
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const item = await CartItem.findOne({
      where: {
        id: itemId,
        cartId: cart.id,
      },
    });

    if (!item) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

    const product = await Product.findByPk(item.productId);

    if (!product || product.isAvailable === false || product.stock < quantity) {
      return res.status(400).json({
        message: "Product is unavailable or stock is insufficient",
      });
    }

    await item.update({ quantity });

    res.status(200).json({
      message: "Cart item quantity updated successfully",
      item,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


exports.removeCartItem = async (req, res) => {
  try {
    const { userId } = req.body;
    const { itemId } = req.params;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    const cart = await Cart.findOne({
      where: { userId },
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const item = await CartItem.findOne({
      where: {
        id: itemId,
        cartId: cart.id,
      },
    });

    if (!item) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

    await item.destroy();

    res.status(200).json({
      message: "Product removed from cart successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
