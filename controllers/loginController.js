const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserSchema = require('../db-schema/User')

module.exports = {

    createUser: async(req, res) => {

        try {
            let name = 'Manish Prasad';
            let email = 'mprasad75@gmail.com';
            let password = 'MyPass#13';

            let success = false;
            let user = await UserSchema.findOne({ email: email });
            if (user) {
                return res.status(400).json({ success, error: 'Sorry a user with this email already exists' });
            }

            const salt = bcrypt.genSaltSync(10);
            const secPass = bcrypt.hashSync(password, salt);

            user = await UserSchema.create({
                name: name,
                email: email,
                password: secPass
            });

            success = true;

            res.json({ success, message: 'User Added Successful' })

        } catch (error) {

            console.log(error);
            res.status(500).send("Some error occured!");

        }

    },

    validateUser: async(req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, userpassword } = req.body;

        try {

            let success = false;
            let user = await UserSchema.findOne({ email: username });
            if (!user) {
                success = false;
                return res.status(400).json({ success, error: "Username / Password is invalid" });
            }

            let passwordCompare = await bcrypt.compare(userpassword, user.password);
            if (!passwordCompare) {
                success = false;
                return res.status(400).json({ success, error: "Username / Password is invalid" });
            }

            const data = {
                user: {
                    id: user.id
                }
            }
            const authToken = jwt.sign(data, JWT_SECRET);
            success = true;
            res.json({ success, authToken })

        } catch (error) {

            res.status(500).send("Internal Server Error")

        }

    }

}