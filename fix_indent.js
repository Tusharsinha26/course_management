const fs = require('fs');
const path = 'c:\\Users\\tusha\\Desktop\\ucm2\\university-cms\\src\\pages\\InstructorDashboard.jsx';

let content = fs.readFileSync(path, 'utf-8');

// Fix the indentation issue
content = content.replace(/\n                    \{courses\.length === 0/m, '\n          {courses.length === 0');

fs.writeFileSync(path, content, 'utf-8');
console.log('Fixed indentation!');
