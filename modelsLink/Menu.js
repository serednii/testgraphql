
//link.js
// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
// import LinkItem from './LinkItem';
// const linkSchema = new Schema({
//     type: String,
//     level: Number,
//     menu: LinkItem,
//     idLinks: Array,
// });

// module.exports = mongoose.model('Link', linkSchema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const menuSchema = new Schema({
    menu: Schema.Types.Mixed,
    // type: String,
    // level: Number,
    // nameMenu: String,
    // menu: [{ type: Schema.Types.ObjectId, ref: 'Link' }], // Самопосилання для масиву посилань
    // idLinks: [{ type: Schema.Types.ObjectId, ref: 'LinkItem' }]
}, { collection: 'menu' });

module.exports = mongoose.model('Menu', menuSchema);





// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const linkSchema = new Schema({
//     type: { type: String, required: true },
//     level: { type: Number, required: true },
//     menu: { type: Schema.Types.Mixed },
//     idLinks: [{ type: Schema.Types.ObjectId, ref: 'LinkItem' }]
// });

// const Link = mongoose.models.Link || mongoose.model('Link', linkSchema);
// module.exports = Link;