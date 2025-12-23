import os
path = r'c:\Users\tusha\Desktop\ucm2\university-cms\src\pages\InstructorDashboard.jsx'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Find the bad string and replace it along with all duplicate code
bad_start = content.find('            })}\"')
if bad_start != -1:
    # Find where the next good code starts
    good_marker = '          {courses.length === 0 && ('
    next_good = content.find(good_marker, bad_start)
    
    if next_good != -1:
        # Get the part before the bad code
        before = content[:bad_start]
        # Get the part from the next good marker onwards
        after = content[next_good:]
        # Combine with proper closing
        new_content = before + '            })}\n          </div>\n\n          ' + after
        
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Fixed!")
