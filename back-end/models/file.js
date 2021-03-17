const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const AutoIncrement = require("mongoose-sequence")(mongoose);

let FilesSchema = new Schema(
  {
    document_id: { type: Number, default: 0 },
    description: { type: String },
    fileLink: { type: String },
    s3_key: { type: String },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }

    ],

    favourite: {type: Boolean, default:false}
  },
  {
   
    timestamps: true
  }
);

FilesSchema.plugin(AutoIncrement, { inc_field: "document_id" });

module.exports = mongoose.model("Files", FilesSchema);
