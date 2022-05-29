const AuthorModel = require("../models/authorModel");
const moment = require("moment")
const BlogModel = require("../models/blogModel");
const mongoose = require("mongoose");
const validator = require('../Middleware/validation');
const blogModel = require("../models/blogModel");



const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}

//====================================================create blogs============================================***


const createBlogs = async function (req, res) {
    try {
        let data = req.body
        

        const {title,body,authorId,tags,category,subcategory} = data
   
        if(!validator.isValid(title)){
            return res.status(400).send({status:false, msg:"title is required"})
        }
        if(!validator.isValid(body)){
            return res.status(400).send({status:false, msg:"body is required"})
        }
        if (!isValidObjectId(authorId)) {
            return res.status(400).send({ status: false, message: `This ${authorId} is invalid` });
        }
        if(!validator.isValid(tags)){
            return res.status(400).send({status:false, msg:"tags is required"})
        }
        if(!validator.isValid(category)){
            return res.status(400).send({status:false, msg:"category is required"})
        }
        if(!validator.isValid(subcategory)){
            return res.status(400).send({status:false, msg:"subCategory is required"})
        }
        
        let blogCreate = await blogModel.create(data)
        
            res.status(201).send({status:true,data:blogCreate})
        
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message });
    }
};
 


//======================================get blogs=================================================***

const getBlogs = async function (req, res) {
    try {
        req.query.isDeleted = false
        req.query.isPublished = true


        // here we are checking query validation
        let filter = await BlogModel.find(req.query).populate("authorId");
        if (!filter.length)
            return res.status(404).send({ status: false, msg: "No such documents found." })

        res.status(200).send({ status: true, data: filter })

    }
    catch (err) {
        console.log(err.message)
        res.status(500).send({ status: false, msg: err.message })
    }
}
 

//===============================================update blogs=============================================***

const updateBlogs = async function (req, res) {
    try {
        let Id = req.params.blogId;
        let PostData = req.body;

        let { body, title, tags, subcategory,isPublished, isDeleted } = PostData

        if (Id.length < 24) {
            return res.status(404).send({ msg: "Enter Valid Blog-Id" });
        }
        let user = await BlogModel.findById(Id)
        if (!user) {
            return res.status(404).send({ staus: false, msg: "No such blog exists" });
        }

        let updateBlog1 = await BlogModel.findByIdAndUpdate({ _id: Id }, {
            $set: { body: body, title: title, isPublished: isPublished, isDeleted: isDeleted },
            $push: { tags: tags, subcategory: subcategory }
        }, { new: true })

        if (updateBlog1.isPublished == true) {
            
            let updatedData = await BlogModel.findOneAndUpdate({ _id: Id }, { publishedAt: new String(Date())},{new:true});
        }
        if (updateBlog1.isPublished == false) {
            let updatedData = await BlogModel.findOneAndUpdate({ _id: Id }, { publishedAt: null });;
        }
        if (updateBlog1.isDeleted == true) {
            let updatedData = await BlogModel.findOneAndUpdate({ _id: Id }, { deletedAt: new String(Date())},{new:true});
        }
        if (updateBlog1.isDeleted == false) {
            let updatedData = await BlogModel.findOneAndUpdate({ _id: Id }, { deletedAt: null });
        }

        return res.status(201).send({ status: true, data: updateBlog1 });
    }
    catch (err) {
        return res.status(500).send({ msg: err.message });
    }
};
 

//=================================================update======================================***

const daleteBlog = async function (req, res) {
    try {
        let blogId = req.params.blogId
        if (!isValidObjectId(blogId)) {
            return res.status(400).send({ status: false, message: `This ${blogId} is invalid` });
        }
        let validateblogId = await BlogModel.findOne({ _id: blogId, isDeleted: false })

        if (!validateblogId) {
            return res.status(404).send({ status: false, msg: "BlogId does not exist." })
        }
        let updatedBlog = await BlogModel.findByIdAndUpdate({ _id: blogId },
            { $set: { isDeleted: true } }, { deletedAt: Date.now() })
        res.status(200).send({ status: true, msg: "Successfully updated." })
    }
    catch (err) {
        console.log(err.message)
        res.status(500).send({ status: false, msg: err.message })
    }
};
 

//=============================================delet blogs=========================================***


const deleteBlogsByQuery = async function (req, res) {
    try {
        let data = req.query;
        // add a query variable and add a default key value [ isDeleted: false ]
        let query = { isDeleted: false} ;

        if (Object.keys(data).length == 0) {
            //-> if data undefined
            return res.status(400).send({ status: false, msg: "no query params available "  });
        } else {
            //-> if tags defined
            if (data.tags) { data.tags = { $in: data.tags }; }

            //-> if subcategory defined
            if (data.subcategory) {
                data.subcategory = { $in: data.subcategory };
            }

            // create a query structure in [ query.$or = ... }
            query["$or"] = [{ authorId: data.authorId }, { tags: data.tags }, { category: data.category }, { subcategory: data.subcategory }];
        }

        // console.log(query)
        // check if the query related data exist OR not
        const available = await BlogModel.find(query).count();
        if (available == 0) {
            return res.status(404).send({ status: false, msg: "query data not found" });
        }

        // perform delete here using update many 
        const deleteData = await BlogModel.updateMany(query, { $set: { isDeleted: true } });
        res.status(200).send({ status: true, data: deleteData });

    } catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
};


module.exports = {createBlogs,getBlogs,updateBlogs,daleteBlog,deleteBlogsByQuery}

