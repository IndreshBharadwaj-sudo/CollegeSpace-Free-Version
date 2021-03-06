const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const materialSchema = new Schema({
    description: String,
    courseID: String,
    url: String,
    author:
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
})

module.exports = mongoose.model("Material", materialSchema);