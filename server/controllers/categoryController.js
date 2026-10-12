const {Category} = require("../models");

// CREATE CATEGORY
exports.createCategory = async (req , res) => {
    try{
        const category = await  Category.create(req.body);

        res.status(201).json({
            message: "category created successfully",
            category,
        });
    } catch(error){
        res.status(400).json({
            message: error.message,
        });
    }
};

// GET ALL CATEGORIES

exports.getAllcategories = async (req , res) => {
    try{
        const categories = await Category.findAll();

        res.status(200).json(categories);
    }catch(error){
        res.status(500).json({
            message: error.message
        });
    }
};