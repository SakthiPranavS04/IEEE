const fs = require('fs');
const content = fs.readFileSync('d:/IEEE/public-website/src/pages/Execomm.jsx', 'utf8');

const socMatch = content.match(/const defaultSocieties = (\[[\s\S]*?\]);\n\n    \/\/ 2/);
const studMatch = content.match(/const defaultStudents = (\[[\s\S]*?\]);\n\n    const storedSocieties/);

if (socMatch && studMatch) {
  const seedScript = `import mongoose from 'mongoose';
import dotenv from 'dotenv';
import TeamMember from '../models/TeamMember.js';

dotenv.config();

const defaultSocieties = ${socMatch[1]};
const defaultStudents = ${studMatch[1]};

const seedTeam = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ieee', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    await TeamMember.deleteMany({});
    console.log('Cleared existing team members');

    const teamDocs = [];
    
    defaultSocieties.forEach((soc) => {
      if (soc.faculty1) {
        teamDocs.push({
          name: soc.faculty1.name,
          role: soc.faculty1.position,
          category: 'Faculty',
          image: soc.faculty1.image || '',
          order: 1,
          isActive: true
        });
      }
      if (soc.faculty2) {
        teamDocs.push({
          name: soc.faculty2.name,
          role: soc.faculty2.position,
          category: 'Faculty',
          image: soc.faculty2.image || '',
          order: 2,
          isActive: true
        });
      }
    });

    defaultStudents.forEach((stud, index) => {
      teamDocs.push({
        name: stud.name,
        role: stud.position,
        category: stud.society || 'IEEE KEC SB',
        image: stud.image || '',
        linkedin: '',
        github: '',
        order: index + 1,
        isActive: true
      });
    });

    await TeamMember.insertMany(teamDocs);
    console.log('Database seeded with team members successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedTeam();
`;

  fs.mkdirSync('d:/IEEE/backend/scripts', { recursive: true });
  fs.writeFileSync('d:/IEEE/backend/scripts/seedTeam.js', seedScript);
  console.log('Seed script created');
} else {
  console.log('Could not find matches');
}
