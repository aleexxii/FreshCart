const Products = require("../../model/productmodel");
const Category = require("../../model/categoryModel");
const Promotions = require("../../model/promotionModel");

const getCategoryList = async (req, res) => {
  try {
    const clickedCategory = req.params.clickedCategory;

    const userId = req.user.userId;
    const limit = 20;
    let page = req.query.page || 1;
    const categories = await Category.find({});

    const products = await Products.aggregate([
      {
        $match: {
          selectedCategory: clickedCategory,
          deletedAt: "Not-Deleted",
        },
      },
    ]);

    const productCount = await Products.countDocuments({
      selectedCategory: clickedCategory,
      deletedAt: "Not-Deleted",
    });

    const bottomPromo = await Promotions.find({ position: "Top-Bottom" });

    res.render("shopGrid", {
      bottomPromo,
      clickedCategory,
      products,
      categories,
      productCount,
      limit,
      currentPage: page,
      totalPages: Math.ceil(productCount / limit),
      previous: page > 1 ? page - 1 : null,
      next: page < Math.ceil(productCount / limit) ? page + 1 : null,
    });
  } catch (error) {
    console.log(error);
  }
};

const filter = async (req, res) => {
  console.log(req.body);
  const { selectedFilter, clickedCategory } = req.body;

  try {
    const productsArray = await Products.aggregate([
      {
        $match: {
          selectedCategory: clickedCategory,
          deletedAt: "Not-Deleted",
        },
      },
    ]);
    let products = [];
    if (selectedFilter === "Low to High") {
      products = productsArray.sort((a, b) => a.salePrice - b.salePrice);
    } else if (selectedFilter === "High to Low") {
      products = productsArray.sort((a, b) => b.salePrice - a.salePrice);
    } else if (selectedFilter === "Release Date") {
      products = productsArray.sort((a, b) => b.createdAt - a.createdAt);
    } else if (selectedFilter === "Avg. Rating") {
    }

    return res.status(200).json({ products: products });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};


const search = async (req,res)=>{
try {
  const category = req.params.category
  const search_input = req.body.search_text

  const searchedProducts = await Products.find({
    deletedAt : 'Not-Deleted',
    selectedCategory : category,
    $or : [
      {productName : {$regex : search_input , $options : 'i'}},
      {selectedCategory : {$regex : search_input , $options : 'i'}}
    ]
  })
  res.status(200).json({searchedProducts})
} catch (error) {
  console.log(error);
}
}
module.exports = {
  getCategoryList,
  filter,
  search
};
