const { validationResult } = require('express-validator');
const ProductsSchema = require('../db-schema/Products');
const fs = require('fs');

module.exports = {

    fetchProducts: async(req, res) => {

        let categoryId = req.body.category_id;

        let success = true;

        try {

            success = true;

            const products = await ProductsSchema.find({ category_id: categoryId });

            return res.status(200).json({ success, data: products });

        } catch (error) {

            res.status(500).json({ success, message: "Internal Server Error!" });

        }

    },

    fetchEachProduct: async(req, res) => {

        let productId = req.body.productId;

        let success = true;

        try {

            success = true;

            const product = await ProductsSchema.findOne({ _id: productId });

            return res.status(200).json({ success, data: product });

        } catch (error) {

            res.status(500).json({ success, message: "Internal Server Error!" });

        }

    },

    saveProduct: async(req, res) => {

        let success = true;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success, message: errors.array() });
        }

        const { formMode, itemId, itemTitle, itemDescription, itemCategory, itemPrice, itemImage, itemSourceImage, itemImageConfig } = req.body;

        try {

            success = true;

            if (formMode == "insert") {

                //Insert product data
                const productCreate = await ProductsSchema.create({
                    title: itemTitle,
                    description: itemDescription,
                    category_id: itemCategory,
                    price: itemPrice,
                    image: "",
                    source_image: "",
                    image_config: itemImageConfig
                });

                var result = await productCreate.save();

            } else {

                const productUpdate = {
                    title: itemTitle,
                    description: itemDescription,
                    category_id: itemCategory,
                    price: itemPrice,
                    image_config: itemImageConfig,
                };

                var result = await ProductsSchema.findByIdAndUpdate(itemId, { $set: productUpdate }, { new: true });

            }


            //Update product data with image
            const productId = result._id;

            let imageUploadPath = "./uploads/products";
            let fileName = productId + '.jpg';
            let sourceFileName = productId + '-s.jpg';

            if (!fs.existsSync(imageUploadPath)) {
                fs.mkdirSync(imageUploadPath);
            }

            var itemImageFile = itemImage.split(';base64,').pop();
            fs.writeFileSync(imageUploadPath + '/' + fileName, itemImageFile, { encoding: 'base64' });


            if (itemSourceImage.indexOf('base64') != -1) {
                var itemSourceImageFile = itemSourceImage.split(';base64,').pop();
                fs.writeFileSync(imageUploadPath + '/' + sourceFileName, itemSourceImageFile, { encoding: 'base64' });
            } else {
                const response = await axios.get(itemSourceImage, { responseType: 'arraybuffer' });
                fs.writeFileSync(imageUploadPath + '/' + sourceFileName, Buffer.from(response.data));
            }

            const updateProduct = {
                image: fileName,
                source_image: sourceFileName,
            };

            var result = await ProductsSchema.findByIdAndUpdate(productId, { $set: updateProduct }, { new: true });

            return res.status(200).json({ success, message: "Product saved successfully", result });

        } catch (error) {

            res.status(500).json({ success, message: "Internal Server Error!" });

        }

    },

    deleteProduct: async(req, res) => {

        let productId = req.body.productId;

        let success = true;

        try {

            const product = await ProductsSchema.findOne({ _id: productId });

            if (!product) {
                return res.status(404).json({ success, message: "Record not found!" });
            }

            success = true;

            const result = await ProductsSchema.findByIdAndDelete({ _id: productId });

            let imageUploadPath = "./uploads/products";
            let fileName = productId + '.jpg';
            let sourceFileName = productId + '-s.jpg';

            fs.unlinkSync(imageUploadPath + '/' + sourceFileName);
            fs.unlinkSync(imageUploadPath + '/' + fileName);

            return res.status(200).json({ success, message: "Record deleted successfully", data: result });

        } catch (error) {

            res.status(500).json({ success, message: "Internal Server Error!" });

        }

    }

}