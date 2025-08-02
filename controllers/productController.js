import Product from "../models/Product.js";

export const getProducts = async (req, res) => {
  const { category, color, minPrice, maxPrice, keyword } = req.query;
  let query = {};

  if (keyword) {
    query.name = { $regex: keyword, $options: "i" };
  }

  if (category) {
    query.category = category;
  }

  if (color) {
    query.color = color;
  }

  if (minPrice && maxPrice) {
    query.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
  }

  const products = await Product.find(query);
  res.json(products);
};

export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) res.json(product);
  else res.status(404).json({ message: "Product not found" });
};

export const createProduct = async (req, res) => {
  const { name, price, brand, category, color, countInStock, description } =
    req.body;

  const image = req.file ? `/uploads/${req.file.filename}` : "";

  const product = new Product({
    user: req.user._id,
    name,
    price,
    brand,
    category,
    color,
    countInStock,
    description,
    image,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
};

export const updateProduct = async (req, res) => {
  const { name, price, brand, category, color, countInStock, description } =
    req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.brand = brand;
    product.category = category;
    product.color = color;
    product.countInStock = countInStock;
    product.description = description;
    if (req.file) {
      product.image = `/uploads/${req.file.filename}`;
    }
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
};

export const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product removed" });
  } else {
    res.status(404).json({ message: "Product not found" });
  }
};

export const addProductReview = async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).json({ message: "Product already reviewed" });
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404).json({ message: "Product not found" });
  }
};
