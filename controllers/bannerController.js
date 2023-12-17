const { validationResult } = require('express-validator');
const BannerSchema = require('../db-schema/Banner');
const fs = require('fs');
const axios = require('axios');

module.exports = {

    saveBanner: async(req, res) => {

        let success = true;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success, message: errors.array() });
        }

        const { formMode, itemId, itemTitle, itemDescription, itemImage, itemSourceImage, itemImageConfig } = req.body;

        try {

            success = true;

            if (formMode == "insert") {

                //Insert banner data
                const bannerCreate = await BannerSchema.create({
                    title: itemTitle,
                    description: itemDescription,
                    image: "",
                    source_image: "",
                    image_config: itemImageConfig
                });

                var result = await bannerCreate.save();

            } else {

                const bannerUpdate = {
                    title: itemTitle,
                    description: itemDescription,
                    image_config: itemImageConfig,
                };

                var result = await BannerSchema.findByIdAndUpdate(itemId, { $set: bannerUpdate }, { new: true });

            }


            //Update banner data with image
            const bannerId = result._id;

            let imageUploadPath = "./uploads/banners";
            let fileName = bannerId + '.jpg';
            let sourceFileName = bannerId + '-s.jpg';

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

            const updateBanner = {
                image: fileName,
                source_image: sourceFileName,
            };

            var result = await BannerSchema.findByIdAndUpdate(bannerId, { $set: updateBanner }, { new: true });

            return res.status(200).json({ success, message: "Banner saved successfully", result });

        } catch (error) {

            res.status(500).json({ success, message: "Internal Server Error!" });

        }

    },

    fetchBanner: async(req, res) => {

        let success = true;

        try {

            success = true;

            const banner = await BannerSchema.find({});

            return res.status(200).json({ success, data: banner });

        } catch (error) {

            res.status(500).json({ success, message: "Internal Server Error!" });

        }

    },

    fetchEachBanner: async(req, res) => {

        let bannerId = req.body.bannerId;

        let success = true;

        try {

            success = true;

            const banner = await BannerSchema.findOne({ _id: bannerId });

            return res.status(200).json({ success, data: banner });

        } catch (error) {

            res.status(500).json({ success, message: "Internal Server Error!" });

        }

    },

    deleteBanner: async(req, res) => {

        let bannerId = req.body.bannerId;

        let success = true;

        try {

            const banner = await BannerSchema.findOne({ _id: bannerId });

            if (!banner) {
                return res.status(404).json({ success, message: "Record not found!" });
            }

            success = true;

            const result = await BannerSchema.findByIdAndDelete({ _id: bannerId });

            let imageUploadPath = "./uploads/banners";
            let fileName = bannerId + '.jpg';
            let sourceFileName = bannerId + '-s.jpg';

            fs.unlinkSync(imageUploadPath + '/' + sourceFileName);
            fs.unlinkSync(imageUploadPath + '/' + fileName);

            return res.status(200).json({ success, message: "Record deleted successfully", data: result });

        } catch (error) {

            res.status(500).json({ success, message: "Internal Server Error!" });

        }

    }

}