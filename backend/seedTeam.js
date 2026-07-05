import mongoose from 'mongoose';
import TeamMember from './models/TeamMember.js';
import dotenv from 'dotenv';

dotenv.config();

const defaultSocieties = [
  {
    id: 1,
    name: "Computer Society (CS Society)",
    faculty1: { name: "Dr. S. Varadhaganapathy", position: "Society Chairman", phone: "+91 98427 21111", image: "/assets/faculty_male_1.png" },
    faculty2: { name: "Dr. P. Natesan", position: "Society Vice Chairman", phone: "+91 98427 22222", image: "/assets/faculty_male_2.png" }
  },
  {
    id: 2,
    name: "Robotics and Automation Society (RAS)",
    faculty1: { name: "Dr. R. Murugesan", position: "Society Chairman", phone: "+91 98427 23333", image: "/assets/faculty_male_3.png" },
    faculty2: { name: "Mr. S. Albert Alexander", position: "Society Vice Chairman", phone: "+91 98427 24444", image: "/assets/faculty_male_4.png" }
  },
  {
    id: 3,
    name: "Women in Engineering (WIE)",
    faculty1: { name: "Dr. J. Premalatha", position: "Society Chairman", phone: "+91 98427 25555", image: "/assets/faculty_female_1.png" },
    faculty2: { name: "Dr. S. Kalaiselvi", position: "Society Vice Chairman", phone: "+91 98427 26666", image: "/assets/faculty_female_2.png" }
  },
  {
    id: 4,
    name: "Power & Energy Society (PES)",
    faculty1: { name: "Dr. N. Nithyadevi", position: "Society Chairman", phone: "+91 98427 27777", image: "/assets/faculty_female_3.png" },
    faculty2: { name: "Dr. A. Sheela", position: "Society Vice Chairman", phone: "+91 98427 28888", image: "/assets/faculty_female_4.png" }
  },
  {
    id: 5,
    name: "Communications Society (ComSoc)",
    faculty1: { name: "Dr. K. Senthil Kumar", position: "Society Chairman", phone: "+91 98427 29999", image: "/assets/faculty_male.png" },
    faculty2: { name: "Dr. G. Murugesan", position: "Society Vice Chairman", phone: "+91 98427 20000", image: "/assets/faculty_male_1.png" }
  },
  {
    id: 6,
    name: "AP-S (Antennas and Propagation Society)",
    faculty1: { name: "Dr. T. Meeradevi", position: "Society Chairman", phone: "+91 98427 21122", image: "/assets/faculty_female.png" },
    faculty2: { name: "Dr. K. Albert", position: "Society Vice Chairman", phone: "+91 98427 33344", image: "/assets/faculty_male_2.png" }
  }
];

const defaultStudents = [
  {
    name: "Abhishek M.",
    department: "Computer Science and Engineering",
    yearOfStudy: "IV",
    ieeeNumber: "92837482",
    position: "Chairman",
    society: "IEEE KEC SB",
    image: "/assets/student_male.png"
  },
  {
    name: "Sneha R.",
    department: "Electronics and Communication Engineering",
    yearOfStudy: "IV",
    ieeeNumber: "92837483",
    position: "Vice Chairman",
    society: "IEEE KEC SB",
    image: "/assets/student_female.png"
  },
  {
    name: "Rajesh Kumar K.",
    department: "Computer Science and Engineering",
    yearOfStudy: "IV",
    ieeeNumber: "92837494",
    position: "Student Branch Chair",
    society: "IEEE KEC SB",
    image: "/assets/student_male_1.png"
  },
  {
    name: "Karthik Raja V.",
    department: "Electrical and Electronics Engineering",
    yearOfStudy: "IV",
    ieeeNumber: "92837484",
    position: "Society Chairman",
    society: "Computer Society (CS Society)",
    image: "/assets/student_male_1.png"
  },
  {
    name: "Priyanka S.",
    department: "Information Technology",
    yearOfStudy: "IV",
    ieeeNumber: "92837485",
    position: "Society Vice Chairman",
    society: "Women in Engineering (WIE)",
    image: "/assets/faculty_female_4.png"
  },
  {
    name: "Manoj Prabhakar S.",
    department: "Mechanical Engineering",
    yearOfStudy: "IV",
    ieeeNumber: "92837495",
    position: "Society Chairman",
    society: "Robotics and Automation Society (RAS)",
    image: "/assets/student_male_2.png"
  },
  {
    name: "Harish K.",
    department: "Electronics and Instrumentation Engineering",
    yearOfStudy: "III",
    ieeeNumber: "92837486",
    position: "Additional Secretary",
    society: "IEEE KEC SB",
    image: "/assets/student_male_2.png"
  },
  {
    name: "Deepa N.",
    department: "Electronics and Communication Engineering",
    yearOfStudy: "III",
    ieeeNumber: "92837496",
    position: "Additional Secretary",
    society: "IEEE KEC SB",
    image: "/assets/student_female.png"
  },
  {
    name: "Vijay Anand R.",
    department: "Information Technology",
    yearOfStudy: "III",
    ieeeNumber: "92837497",
    position: "Additional Secretary",
    society: "IEEE KEC SB",
    image: "/assets/student_male_3.png"
  },
  {
    name: "Naveen S.",
    department: "Mechanical Engineering",
    yearOfStudy: "III",
    ieeeNumber: "92837487",
    position: "Joint Secretary",
    society: "IEEE KEC SB",
    image: "/assets/student_male_3.png"
  },
  {
    name: "Keerthana M.",
    department: "Electrical and Electronics Engineering",
    yearOfStudy: "III",
    ieeeNumber: "92837498",
    position: "Joint Secretary",
    society: "IEEE KEC SB",
    image: "/assets/student_female.png"
  },
  {
    name: "Rahul E.",
    department: "Electronics and Instrumentation Engineering",
    yearOfStudy: "III",
    ieeeNumber: "92837499",
    position: "Joint Secretary",
    society: "IEEE KEC SB",
    image: "/assets/student_male_4.png"
  },
  {
    name: "Dharini P.",
    department: "Computer Science and Engineering",
    yearOfStudy: "III",
    ieeeNumber: "92837488",
    position: "Web Team Chairman",
    society: "IEEE KEC SB",
    image: "/assets/faculty_female_3.png"
  },
  {
    name: "Arun Kumar S.",
    department: "Chemical Engineering",
    yearOfStudy: "III",
    ieeeNumber: "92837489",
    position: "Event Team Chairman",
    society: "IEEE KEC SB",
    image: "/assets/student_male_4.png"
  },
  {
    name: "Sanjay B.",
    department: "Information Technology",
    yearOfStudy: "III",
    ieeeNumber: "92837500",
    position: "Media Team Chairman",
    society: "IEEE KEC SB",
    image: "/assets/student_male_1.png"
  },
  {
    name: "Divya K.",
    department: "Food Technology",
    yearOfStudy: "II",
    ieeeNumber: "92837490",
    position: "Office Bearer",
    society: "Women in Engineering (WIE)",
    image: "/assets/faculty_female_2.png"
  },
  {
    name: "Vignesh S.",
    department: "Electrical and Electronics Engineering",
    yearOfStudy: "II",
    ieeeNumber: "92837501",
    position: "Executive Member",
    society: "Power & Energy Society (PES)",
    image: "/assets/student_male.png"
  },
  {
    name: "Sandhya R.",
    department: "Electronics and Communication Engineering",
    yearOfStudy: "II",
    ieeeNumber: "92837502",
    position: "Executive Member",
    society: "Communications Society (ComSoc)",
    image: "/assets/student_female.png"
  },
  {
    name: "Kavya R.",
    department: "Electronics and Communication Engineering",
    yearOfStudy: "II",
    ieeeNumber: "92837491",
    position: "Member",
    society: "Robotics and Automation Society (RAS)",
    image: "/assets/faculty_female_1.png"
  },
  {
    name: "Surya K.",
    department: "Electronics and Communication Engineering",
    yearOfStudy: "II",
    ieeeNumber: "92837503",
    position: "Student Member",
    society: "AP-S (Antennas and Propagation Society)",
    image: "/assets/student_male.png"
  },
  {
    name: "Shalini D.",
    department: "Computer Science and Engineering",
    yearOfStudy: "II",
    ieeeNumber: "92837504",
    position: "Student Member",
    society: "Computer Society (CS Society)",
    image: "/assets/student_female.png"
  }
];

const seedTeam = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ieee_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');

    await TeamMember.deleteMany({});
    
    let docs = [];

    // Add faculties
    defaultSocieties.forEach((soc, idx) => {
        if (soc.faculty1) {
            docs.push({
                name: soc.faculty1.name,
                role: soc.faculty1.position,
                category: soc.name,
                type: 'Faculty',
                image: soc.faculty1.image,
                phone: soc.faculty1.phone,
                order: idx * 2
            });
        }
        if (soc.faculty2) {
            docs.push({
                name: soc.faculty2.name,
                role: soc.faculty2.position,
                category: soc.name,
                type: 'Faculty',
                image: soc.faculty2.image,
                phone: soc.faculty2.phone,
                order: idx * 2 + 1
            });
        }
    });

    // Add students
    defaultStudents.forEach((stud, idx) => {
        docs.push({
            name: stud.name,
            role: stud.position,
            category: stud.society,
            type: 'Student',
            department: stud.department,
            year: stud.yearOfStudy,
            ieeeNumber: stud.ieeeNumber,
            image: stud.image,
            order: idx + 100
        });
    });

    await TeamMember.insertMany(docs);
    console.log(`Seeded ${docs.length} team members successfully!`);
    
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    mongoose.connection.close();
  }
};

seedTeam();
