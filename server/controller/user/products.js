const Products = require('../../model/productmodel')


const filteredProducts = async (req,res)=>{

    const { category } = req.params
    try {
        const limit = 20;
        let page = req.query.page || 1
        const ProductCount = await Products.countDocuments({ selectedCategory : category})
        const products = await Products.find({ selectedCategory : category})
        res.json(products)
    } catch (error) {
        console.log('error : ' , error);
    }
}

const search = async(req,res)=>{
console.log(req.body);

try {
    const { search_text } = req.body;
    const searchedProducts = await Products.find(
      {
      deletedAt : "Not-Deleted",
      $or: [
        { productName: { $regex: search_text , $options : 'i' } },
        { selectedCategory: { $regex: search_text , $options : 'i' } },
      ],
    });
    res.status(200).json({ searchedProducts });
  } catch (err) {
    console.log(err);
  }
}


module.exports ={
    filteredProducts,
    search
}