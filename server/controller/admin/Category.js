const Admin = require("../../model/adminLoginModel");
const Product = require("../../model/productmodel");
const Category = require("../../model/categoryModel");
const User = require("../../model/userModel");

const getCategories = async (req, res) => {
  try {
    let search = "";
    if (req.query.search) {
      search = new RegExp(".*" + req.query.search + ".*", "i");
    }

    let limit = 5;
    let page = req.query.page ? parseInt(req.query.page) : 1;
    // Fetch categories from database
    const category = await Category.find({
      deletedAt: "listed"})
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();

    const categoryCount = await Category.find({
      deletedAt: "listed"
    }).countDocuments();

    const categories = category.map((category) => {
      return { ...category._doc };
    });

    // Sort categories by _id in descending order
    categories.sort((a, b) => b._id.getTimestamp() - a._id.getTimestamp());

    // Array to store categories with product counts
    const categoryWithProductCount = [];
    for (const category of categories) {
      const productCount = await Product.countDocuments({
        selectedCategory: category.categoryName,
        deletedAt: "Not-Deleted",
      });
      categoryWithProductCount.push({
        category: category,
        productCount: productCount,
      });
    }

    res.render("categories",
     {
      categoryWithProductCount,
      categoryCount,
      limit,
      currentPage : page,
      totalPages : Math.ceil(categoryCount / limit),
      previous : page > 1 ? page - 1 : null,
      next : page < Math.ceil( categoryCount / limit ) ? page + 1 : null
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ Error: "Internal Server Error" });
  }
};

const editCategoryPage = async (req, res) => {
  try {
    const categoryId = req.query.categoryId; // Extract category ID from query parameter
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    return res.render("editCategory", { category });
  } catch (error) {
    console.error("Error fetching category for editing:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching category for editing" });
  }
};

const editedCategory = async (req, res) => {
  try {
    const categoryId = req.query.categoryId; // Access category ID from req.query

    const { categoryName , slug , parentCategory , date , discount , metaDescription , description } = req.body;

    const existingCategory = await Category.findOne({
      deletedAt : 'listed',
      categoryName,
      _id : {$ne : categoryId }
    })

    if(existingCategory){
      return res.status(200).json({existingCategoryError : 'Category already exists'})
    }
    
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId ,
      { categoryName: req.body.categoryName,
        slug : slug,
        parentCategory : parentCategory ,
        date : date ,
        description : description ,
        discount : discount ,
        metaDescription : metaDescription,
        // image : image
      }, // Update category name
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    if(req.file){
      updatedCategory.image = req.file.filename
    }

    await updatedCategory.save();
    // Redirect to categories page after updating

    const discountedCategories = await Category.find({discount : {$ne : null},deletedAt : 'listed'})

    discountedCategories.forEach(async (category)=>{
      const discount = category.discount
      console.log(category.categoryName);
      console.log(discount);

      const products = await Product.find({selectedCategory : category.categoryName})
      console.log('fetching the categories',products);
      products.forEach(async (product)=>{
        const discountedPrice = Math.round(product.salePrice - (product.salePrice * (discount/100)))
        await Product.updateOne(
          {_id: product._id},
          {$set : {salePrice : discountedPrice}}
        )
      })
    })


    return res.status(200).json({redirect : "./categories"});

  } catch (error) {
    console.error("Error updating category:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while updating category" });
  }
};

const getAddCategories = (req, res) => {
  try {
    res.render("addCategory");
  } catch (error) {
    console.log(error);
  }
};

const postAddCategory = async (req, res) => {
  try {
    // Extract category data from the request body
    const {
      categoryName,
      date,
      description,
      discount,
      categoryImage,
    } = req.body;

    // Extract filenames from uploaded files
    const image = req.file.filename;

    const existingCategory = await Category.findOne({ categoryName });
  
    if (existingCategory) {
      return res.status(200).json({ Error: "Category is already exists" });
    }

    // Create a new category instance
    const newCategory = new Category({
      categoryName,
      date,
      description,
      discount,
      categoryImage,
      image,
    });

    // Save the new category to the database
    await newCategory.save();


    const discountedCategories = await Category.find({discount : {$ne : null},deletedAt : 'listed'})
    discountedCategories.forEach(async (category)=>{
      const discount = category.discount
      console.log(discount);
      const products = await Product.find({selectedCategory : category.categoryName})
      console.log('fetching the categories',products);
      products.forEach(async (product)=>{
        const discountedPrice = product.salePrice - (product.salePrice * (discount/100))
        await Product.updateOne(
          {_id: product._id},
          {$set : {salePrice : discountedPrice}}
        )
      })
    })
    // Redirect to the categories page or any other appropriate page
    res.status(200).json({ redirect: "./categories" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ Error: "Internal Server Error" });
  }
};

const categoryDeleting = async (req, res) => {
try {
  const categoryId = req.query.categoryId;

  await Category.findByIdAndUpdate(
    categoryId,
    { deletedAt: "unlisted" },
    { new: true }
  );
  res.redirect("./categories");
} catch (error) {
  console.log(error);
}
};

const deletedCategory = async (req, res) => {
  try {
    const deletedCategories = await Category.find({ deletedAt: "unlisted" });

    const deletedCategory = deletedCategories.map((dltcat) => {
      return { ...dltcat._doc };
    });
    res.render("deletedCategories", { deletedCategory });
  } catch (error) {}
};

module.exports = {
  getCategories,
  getAddCategories,
  postAddCategory,
  editCategoryPage,
  editedCategory,
  categoryDeleting,
  deletedCategory,
};
