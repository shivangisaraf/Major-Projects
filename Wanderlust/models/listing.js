const mongoose = require("mongoose");
const Review = require("./review.js");
const Schema  = mongoose.Schema;

const listingSchema  = new Schema({
  title:{
    type: String,
    required: true
  },
  description: String,
  image: {
    filename: {
        type: String,
        default: "listingimage"
    },
    url: {
        type: String,
        set: (v) => v === "" ? "https://a0.muscache.com/im/pictures/miso/Hosting-694055224756906854/original/76f85a0c-b3e2-4f1d-9aa9-d7838f2393c6.jpeg?im_w=1200&im_q=highq" : v
    }
},
  price: Number,
  location: String,
  country: String,
  reviews:[
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    }
  ],
  owner:{
    type:Schema.Types.ObjectId,
    ref: "User"
  },
  geometry:{
    type:{
      type: String,
      enum: ["Point"],
      required: true
    },
     coordinates:{
      type: [Number],
      required: true
     }
  }
});


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

