import psycopg2
import requests
import csv

term = '2251'  # Update this value to reflect semester of which to scrape courses & sections from
# Term is '2' + 'last2digitsofyear' + '1' for spring, '5' for summer, '8' for fall
last_control_number = 0  

def construct_api_url(term, last_control_number):
    return f"https://one.ufl.edu/apix/soc/schedule/?category=RES&term={term}&last-control-number={last_control_number}"

# Fetch from UF API
def fetch_courses(last_control_number):
    api_url = construct_api_url(term, last_control_number)
    response = requests.get(api_url)
    if response.status_code == 200:
        data = response.json()
        print(data)
        return data
    else:
        raise Exception(f"API request failed with status code {response.status_code}")

# Export to CSV
def export_courses_and_sections_to_csv(courses, course_file='spring_courses.csv', section_file='spring_sections.csv'):
    with open(course_file, mode='a', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        if file.tell() == 0:
            writer.writerow(['course_code', 'course_title', 'departmentID', 'credits', 'prerequisites'])

        course_count = 0 

        for course_info in courses[0]['COURSES']:
            course_code = course_info['code']
            course_title = course_info['name']
            departmentID = course_info['sections'][0]['deptCode'] if course_info['sections'] else ''  
            prerequisites = course_info.get('prerequisites', '')
            credits = course_info['sections'][0].get('credits', '') if course_info['sections'] else ''

            writer.writerow([course_code, course_title, departmentID, credits, prerequisites])
            course_count += 1

    print(f"Number of courses added to CSV: {course_count}")

    with open(section_file, mode='a', newline='', encoding='utf-8') as file:
        writer = csv.writer(file, quoting=csv.QUOTE_MINIMAL)  
        if file.tell() == 0:
            writer.writerow(['section_id', 'course_code', 'term', 'instructor', 'room', 'meeting_times'])

        for course_info in courses[0]['COURSES']:
            course_code = course_info['code']
            term = 'Spring 2025'  # Set term for all entries, based on term number set at top of file

            for section in course_info['sections']:
                section_id = section['classNumber']  

                instructors = section.get('instructors', [])
                if instructors:
                    processed_instructors = []
                    for instructor in instructors:
                        name = instructor['name'].replace('"', '').strip()  # Remove quotes and strip whitespace
                        # Check if the name is all caps
                        if name.isupper():
                            # Capitalize first letter of names
                            name = ' '.join(part.capitalize() for part in name.split())
                        processed_instructors.append(name)
                    instructors = ', '.join(processed_instructors) or 'STAFF'
                else:
                    instructors = 'STAFF'  # Default to STAFF 

                if section.get('meetTimes'):
                    meeting_times_list = []  
                    for meeting in section['meetTimes']:
                        meet_building = str(meeting.get('meetBuilding', '')).strip()  
                        meet_room = str(meeting.get('meetRoom', '')).strip()  
                        room = f"{meet_building} {meet_room}".strip() or 'Not listed'  # Use 'Not listed' if both are empty

                        day_mapping = {'M': 'Mon', 'T': 'Tue', 'W': 'Wed', 'R': 'Thu', 'F': 'Fri'}
                        days = '/'.join(day_mapping.get(day, '') for day in meeting['meetDays'] if day in day_mapping)
                        days = days if days else 'Not listed'  # Default 

                        meeting_times = f"{days}: {meeting['meetTimeBegin']} - {meeting['meetTimeEnd']}"
                        meeting_times_list.append(meeting_times)

                    meeting_times_combined = ' | '.join(meeting_times_list)  
                else:
                    room = 'Not listed'
                    meeting_times_combined = 'Not listed'

                writer.writerow([section_id, course_code, term, instructors, room, meeting_times_combined])

try:
    total_courses_added = 0  
    while True:
        courses_data = fetch_courses(last_control_number)
        courses_count = len(courses_data[0]['COURSES'])
        
        export_courses_and_sections_to_csv(courses_data)

        # Check if number of courses added is less than 50 -> we are done
        if courses_count < 50:
            break
        last_control_number += 50

except Exception as e:
    print(f"An error occurred: {e}")

