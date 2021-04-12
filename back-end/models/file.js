const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const AutoIncrement = require("mongoose-sequence")(mongoose);

let FilesSchema = new Schema(
  {
   id: { type: Number, default: 0 },
    description: { type: String },
    fileLink: { type: String },
    s3_key: { type: String },
    favourite: {type: Boolean, default:false},
    viewers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }

    ],
  
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      

    ],
    creator: {type: mongoose.Schema.Types.ObjectId},
    parentFolder: {type:String, default:null},
    isIndependant: {type:Boolean, default:true},
    type: {type:String},
    size:{type:String}
  },
  {
    timestamps: true
  }
);

FilesSchema.plugin(AutoIncrement, { inc_field: "id" });

module.exports = mongoose.model("Files", FilesSchema);
