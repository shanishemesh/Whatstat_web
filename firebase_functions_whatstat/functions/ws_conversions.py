import re

#!!!!!!!! check for os duh...
def reformat_iphone_chat_file(file_path):
    android_formatted_lines = []

    with open(file_path, 'r') as file:
        for line in file:
            if not line.startswith("[") and line.__contains__(" - "):
                # stop the conversion process, android style 
                break 
            if line.__contains__('[' and ']') and not line.__contains__('-'):
            # Extract relevant data from each line
                android_timestamp, user_name, message_body = extract_data_from_iphone_line(line)

            # Adjust the timestamp format
#                 android_timestamp = adjust_timestamp_format(date_time)

            # Reformat the message structure
                android_formatted_line = f"{android_timestamp} - {user_name} : {message_body}\n"

                android_formatted_lines.append(android_formatted_line)
            if line.__contains__("<attached:"):
            # Extract relevant data from each line
                android_timestamp, user_name, message_body = extract_data_from_iphone_line(line)
            # Adjust the timestamp format
#                 android_timestamp = adjust_timestamp_format(date_time)
                
            # Convert lines with attachments to Android-style format
                android_formatted_line = convert_attachment_to_android_style(android_timestamp, user_name, message_body, line)
#                 android_formatted_line = f"{android_timestamp} - {user_name} {message_body}\n"
                android_formatted_lines.append(android_formatted_line)
        return android_formatted_lines


def extract_data_from_iphone_line(line):
    date_time_pattern = r'\[(.*?)\]'
    user_pattern = r'\](.*?):'
    clean_pattern = r'[^\x00-\x7F]+'
#     pattern = r'\[(.*?)\] (.*?): (.*)'
    
    #get the date and time
    match = re.search(date_time_pattern, line)
    if match:
        date_time = match.group(1)
    else:
        date_time = ""
    
    #line without date n time
    stripped_line = line.replace(f"[{date_time}]", "").strip()
    
    #get the user name and body of message
#     user_match = re.search(user_pattern, stripped_line)
    user_name = stripped_line.replace('\u200e', '').split(":",1)[0]
    message_body = stripped_line.replace('\u200e', '').split(":",1)[1]
#     print(stripped_line.replace('\u200e', '').split(":",1))
#     if user_match:
#         user_name = user_match.group(1).strip()
#         message_body = line[user_match.end():].strip()
#     else:
#         user_name = ""
#         message_body = stripped_line
    android_timestamp = adjust_timestamp_format(date_time)
    return android_timestamp, user_name, message_body


def adjust_timestamp_format(timestamp):
# turn this [15/12/2022, 8:42:11] to this 3/28/23, 19:29
    date_time = timestamp.split(',')
    date = date_time[0].split('/')
    android_date_foramt = f'{date[1]}/{date[0]}/{date[2][-2:]}'
    time = date_time[1].split(':')
    android_time_format = f'{time[0]}:{time[1]}'
    android_timestamp = f'{android_date_foramt}, {android_time_format}'

    return android_timestamp

def convert_attachment_to_android_style(date_time, user_name, message_body, line):
    date_time_pattern = r'\[(.*?)\]'
    attachment_pattern = r'attached: (\d+-([A-Z]+)-\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2}\.\w+)'

    attachment_type = message_body.split(':', 1)
#     user_name = attachment_type[0]
    android_attachment_line = f"{date_time} - {user_name} : {attachment_type[1]} (file attached)\n"
#     print(android_attachment_line)
#     print(user_name, ':')
    return android_attachment_line

def save_android_formatted_file(lines, file_path):
    with open(file_path, 'w') as file:
        file.writelines(lines)
