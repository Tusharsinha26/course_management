const fs = require('fs');
const path = 'c:\\Users\\tusha\\Desktop\\ucm2\\university-cms\\src\\pages\\InstructorDashboard.jsx';

let content = fs.readFileSync(path, 'utf-8');

const badStart = '            })}\"';
const goodMarker = '          {courses.length === 0 && (';

const badIdx = content.indexOf(badStart);
if (badIdx !== -1) {
    const goodIdx = content.indexOf(goodMarker, badIdx);
    if (goodIdx !== -1) {
        const before = content.substring(0, badIdx);
        const after = content.substring(goodIdx);
        const fixed = before + '            })}\n          </div>\n\n          ' + after;
        fs.writeFileSync(path, fixed, 'utf-8');
        console.log('Fixed!');
    }
}
