const fs = require('fs');
const path = require('path');

const baseDir = 'd:\\IEEE\\backend';

const modelsToCreate = [
  { name: 'Achievement', schema: `title: { type: String, required: true }, category: String, desc: String, iconType: String` },
  { name: 'Committee', schema: `name: { type: String, required: true }, title: String, description: String, chairs: [mongoose.Schema.Types.Mixed], members: [mongoose.Schema.Types.Mixed]` },
  { name: 'Society', schema: `name: { type: String, required: true }, faculty1: mongoose.Schema.Types.Mixed, faculty2: mongoose.Schema.Types.Mixed` },
  { name: 'FormTemplate', schema: `title: { type: String, required: true }, description: String, type: String, slug: String, is_confidential: Boolean, fields: [mongoose.Schema.Types.Mixed]` },
  { name: 'Video', schema: `title: { type: String, required: true }, url: String, category: String, description: String` },
  { name: 'NewsItem', schema: `title: { type: String, required: true }, content: String, date: String, category: String, image: String` }
];

modelsToCreate.forEach(m => {
  // Model
  const modelContent = `import mongoose from 'mongoose';

const ${m.name.toLowerCase()}Schema = mongoose.Schema({
  ${m.schema}
}, { timestamps: true });

const ${m.name} = mongoose.model('${m.name}', ${m.name.toLowerCase()}Schema);
export default ${m.name};`;
  
  fs.writeFileSync(path.join(baseDir, 'models', `${m.name}.js`), modelContent);

  // Controller
  const controllerContent = `import ${m.name} from '../models/${m.name}.js';

export const get${m.name}s = async (req, res) => {
  try { const items = await ${m.name}.find({}); res.json(items); }
  catch (error) { res.status(500).json({ message: error.message }); }
};

export const create${m.name} = async (req, res) => {
  try { const item = new ${m.name}(req.body); const created = await item.save(); res.status(201).json(created); }
  catch (error) { res.status(400).json({ message: error.message }); }
};

export const update${m.name} = async (req, res) => {
  try { const item = await ${m.name}.findByIdAndUpdate(req.params.id, req.body, {new:true});
    if (item) res.json(item); else res.status(404).json({ message: 'Not found' });
  } catch (error) { res.status(400).json({ message: error.message }); }
};

export const delete${m.name} = async (req, res) => {
  try { const item = await ${m.name}.findByIdAndDelete(req.params.id);
    if (item) res.json({ message: 'Removed' }); else res.status(404).json({ message: 'Not found' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};`;

  fs.writeFileSync(path.join(baseDir, 'controllers', `${m.name.toLowerCase()}Controller.js`), controllerContent);

  // Route
  const routeContent = `import express from 'express';
import { get${m.name}s, create${m.name}, update${m.name}, delete${m.name} } from '../controllers/${m.name.toLowerCase()}Controller.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(get${m.name}s).post(protect, create${m.name});
router.route('/:id').put(protect, update${m.name}).delete(protect, delete${m.name});

export default router;`;

  fs.writeFileSync(path.join(baseDir, 'routes', `${m.name.toLowerCase()}Routes.js`), routeContent);
});

console.log("Scaffolding complete.");
