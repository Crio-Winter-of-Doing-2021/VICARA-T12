const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);

let FolderSchema = new Schema(
  {
    id: { type: Number, default: 0 },
    Name: { type: String },
    favourite: {type: Boolean, default:false},
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    files:[
       
    ],
    size:{
      type:String,
      default:'0'
    },
    
    folders:[  
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Folder"
          }
    ],
    parentFolder: {type:String, default:null},
    isIndependant: {type:Boolean, default:true},
    creator: {
      type: mongoose.Schema.Types.ObjectId
    }
  },
  {
    timestamps: true
  }
);

FolderSchema.plugin(AutoIncrement, { inc_field: "folder_id" });
module.exports = mongoose.model("Folder", FolderSchema);
