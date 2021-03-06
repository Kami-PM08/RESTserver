var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var productSchema = new Schema({
    name: { type: String, required: [true, 'Name is required.'] },
    unitPrice: { type: Number, required: [true, 'Unit price is required.'] },
    description: { type: String, required: false },
    available: { type: Boolean, required: true, default: true },
    category: { type: Schema.Types.ObjectId, ref: 'category', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'user' },
    img: {
        type: String
    }
});


module.exports = mongoose.model('Product', productSchema);