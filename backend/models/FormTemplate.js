import mongoose from 'mongoose';

const formtemplateSchema = mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true }, description: String, type: String, slug: String, is_confidential: Boolean, fields: [mongoose.Schema.Types.Mixed]
}, { timestamps: true });

const FormTemplate = mongoose.model('FormTemplate', formtemplateSchema);
export default FormTemplate;