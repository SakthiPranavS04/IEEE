import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Setting from './models/Setting.js';
import TeamMember from './models/TeamMember.js';

dotenv.config();

const syncTeamMembers = async (key, valueStr) => {
  try {
    const data = JSON.parse(valueStr);
    if (!Array.isArray(data)) return;

    if (key === 'ieee_execomm_societies_v3') {
      await TeamMember.deleteMany({ type: 'Faculty' });
      const newMembers = [];
      data.forEach(soc => {
        if (soc.faculty1 && soc.faculty1.name) {
          newMembers.push({
            name: soc.faculty1.name,
            role: soc.faculty1.position || 'Member',
            category: soc.name,
            type: 'Faculty',
            image: soc.faculty1.image,
            linkedin: soc.faculty1.linkedin,
            email: soc.faculty1.email,
            phone: soc.faculty1.phone,
            order: 1
          });
        }
        if (soc.faculty2 && soc.faculty2.name) {
          newMembers.push({
            name: soc.faculty2.name,
            role: soc.faculty2.position || 'Member',
            category: soc.name,
            type: 'Faculty',
            image: soc.faculty2.image,
            linkedin: soc.faculty2.linkedin,
            email: soc.faculty2.email,
            phone: soc.faculty2.phone,
            order: 2
          });
        }
      });
      if (newMembers.length > 0) await TeamMember.insertMany(newMembers);
      console.log('Synced societies to TeamMember collection.');
    } 
    else if (key === 'ieee_execomm_students_v3') {
      await TeamMember.deleteMany({ type: 'Student' });
      const newMembers = data.filter(st => st && st.name).map((st, idx) => ({
        name: st.name,
        role: st.position || 'Member',
        category: st.society || 'IEEE KEC SB',
        type: 'Student',
        image: st.image,
        department: st.department,
        year: st.yearOfStudy,
        ieeeNumber: st.ieeeNumber,
        order: idx
      }));
      if (newMembers.length > 0) await TeamMember.insertMany(newMembers);
      console.log('Synced students to TeamMember collection.');
    }
  } catch(e) {
    console.error('Failed to sync to TeamMember DB:', e);
  }
};

const run = async () => {
  try {
    await connectDB();
    const societies = await Setting.findOne({ key: 'ieee_execomm_societies_v3' });
    if (societies) await syncTeamMembers(societies.key, societies.value);

    const students = await Setting.findOne({ key: 'ieee_execomm_students_v3' });
    if (students) await syncTeamMembers(students.key, students.value);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    process.exit(0);
  }
};

run();
