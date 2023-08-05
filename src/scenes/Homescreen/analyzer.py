import os
import numpy as np # linear algebra
import pandas as pd # data processing, CSV file I/O (e.g. pd.read_csv)
import re
from collections import Counter
# pip install firebase-admin
# pip install googletrans
# pip install networkx matplotlib

# for dirname, _, filenames in os.walk('/whatstat-90e21.appspot.com/files'):
#     for filename in filenames:
#         print(os.path.join(dirname, filename))
import nltk
nltk.download('punkt') # nltk.sent_tokenize and nltk.word_tokenize
nltk.download('averaged_perceptron_tagger') # nltk.pos_tag
nltk.download('maxent_ne_chunker') # nltk.ne_chunk_sents
nltk.download('words')
nltk.download('vader_lexicon')

import firebase_admin
from firebase_admin import credentials
from firebase_admin import storage
from firebase_admin import db

# get credentials to firebase
cred = credentials.Certificate("../firebase/whatstat-90e21-firebase-adminsdk-sabso-215c3e54ec.json")
firebase_admin.initialize_app(cred, {
    'storageBucket': 'whatstat-90e21.appspot.com',
    'databaseURL': 'https://whatstat-90e21-default-rtdb.europe-west1.firebasedatabase.app/files/'
})

# save the file
bucket = storage.bucket()

file_path = 'files/chat.txt'

blob = bucket.blob(file_path)
blob.download_to_filename('local-file.txt')


#!!!!!!!! check for os duh...
def reformat_iphone_chat_file(file_path):
    android_formatted_lines = []

    with open(file_path, 'r', encoding='utf-8') as file:
        for line in file:
            if line.startswith("[") and line.__contains__(" - "):
                # stop the conversion process, android style 
                break
            if line.__contains__('[' and ']') and not line.__contains__('-'):
            # Extract relevant data from each line
                date_time, user_name, message_body = extract_data_from_iphone_line(line)

            # Adjust the timestamp format
                android_timestamp = adjust_timestamp_format(date_time)

            # Reformat the message structure
                android_formatted_line = f"{android_timestamp} - {user_name} {message_body}\n"

                android_formatted_lines.append(android_formatted_line)

    return android_formatted_lines


def extract_data_from_iphone_line(line):
    date_time_pattern = r'\[(.*?)\]'
    user_pattern = r'\](.*?):'
    #get the date and time
    match = re.search(date_time_pattern, line)
    if match:
        date_time = match.group(1)
    else:
        date_time = ""
    
    #line without date n time
    stripped_line = line.replace(f"[{date_time}]", "").strip()
    
    #get the user name and body of message
    user_match = re.search(user_pattern, stripped_line)
    if user_match:
        user_name = user_match.group(1).strip()
        message_body = line[user_match.end():].strip()
    else:
        user_name = ""
        message_body = stripped_line

    return date_time, user_name, message_body


def adjust_timestamp_format(timestamp):
# turn this [15/12/2022, 8:42:11] to this 3/28/23, 19:29
    date_time = timestamp.split(',')
    date = date_time[0].split('/')
    android_date_foramt = f'{date[1]}/{date[0]}/{date[2][-2:]}'
    time = date_time[1].split(':')
    android_time_format = f'{time[0]}:{time[1]}'
    android_timestamp = f'{android_date_foramt}, {android_time_format}'
#     print(f'{android_date_foramt}, {android_time_format}')
    return android_timestamp


def save_android_formatted_file(lines, file_path):
    with open(file_path, 'w', encoding='utf-8', errors='ignore') as file:
        file.writelines(lines)


# Specify the path to the iPhone-exported chat file
file_path = 'local-file.txt'

# Reformat the iPhone chat file to match the Android format
android_formatted_lines = reformat_iphone_chat_file(file_path)

if android_formatted_lines:
    # Save the Android-formatted chat file, overwriting the existing file
    save_android_formatted_file(android_formatted_lines, file_path)
else:
    print("The chat file is already formatted in Android style.")


# get statistic
def extract_chat_stats(file_path):
    user_names = set()
    message_count = 0
    user_message_counts = {}
    user_voice_counts = {}
    user_media_counts = {}
    user_emoji_counts = {}
    media_sent = 0
    voice_messages_sent = 0

    with open(file_path, 'r', encoding='utf-8') as file:
        for line in file:
#             print(line)
            if re.search(r'\b[\w\s]+\b', line) and ':' in line and not re.search(r'\d+:\d+-\d+:\d+', line):
                # Split the line into parts based on the delimiter "-"
                parts = line.split('-', maxsplit=1)
                if len(parts) >= 2:
                    # Extract the user name
                    message_body_name = parts[1].split(':')
#                     print(parts)
                    if len(message_body_name) >= 2:
                        user_name = message_body_name[0].strip()
                        user_names.add(user_name)
        
                        if user_name in user_message_counts:
                            user_message_counts[user_name] += 1
                        else:
                            user_message_counts[user_name] = 1
                        
                        # Check if the line contains a voice message
                        if re.search(r'PTT-\d+-WA\d+\.opus \(file attached\)', message_body_name[1].strip()):

                            # Increment the voice message count for the user
                            if user_name in user_voice_counts:
                                user_voice_counts[user_name] += 1
                            else:
                                user_voice_counts[user_name] = 1
                        # Check if the line contains a media file
                        if re.search(r'\b[A-Z]+\d+(?:[_-]\d+)*\.(?:jpg|jpeg|png|mp4|pdf|txt)\b', message_body_name[1].strip()):
                            # Increment the media file count for the user
                            if user_name in user_media_counts:
                                user_media_counts[user_name] += 1
                            else:
                                user_media_counts[user_name] = 1        
                                
                         # Extract and count emojis
                        emojis = re.findall(r'[\U0001F000-\U0001F999]', parts[1])
                        if user_name not in user_emoji_counts:
                            user_emoji_counts[user_name] = {}
                        for emoji in emojis:
#                             count top 10 emojis
                            if emoji in user_emoji_counts[user_name]:
                                user_emoji_counts[user_name][emoji] += 1
                            else:
                                user_emoji_counts[user_name][emoji] = 1
                    # Increment the message count
                    message_count += 1


    return user_names, user_message_counts, message_count, user_voice_counts, user_media_counts, user_emoji_counts, media_sent, voice_messages_sent

# Specify the path to the WhatsApp chat text file
file_path = 'local-file.txt'

# Extract chat statistics
user_names, user_message_counts, message_count, user_voice_counts, user_media_counts, user_emoji_counts, media_sent, voice_messages_sent = extract_chat_stats(file_path)

# Print the extracted statistics
print("Message Count per User:")
for user, count in user_message_counts.items():
    print(f"{user}: {count}")
    
# Print voice messages count
print("Media count per User:")
for user, count in user_media_counts.items():
    print(f"{user}: {count} media messages\n")
    
# Print voice messages count
print("Voice messages count per User:")
for user, count in user_voice_counts.items():
    print(f"{user}: {count} voice messages\n")
    
print("Emoji Count per User:")
for user, emojis in user_emoji_counts.items():
    print(f"{user}: Total Emojis - {sum(emojis.values())}")
    sorted_emojis = sorted(emojis.items(), key=lambda x: x[1], reverse=True)[:10]
    print(f"Top 10 Emojis: ")
    for emoji, count in sorted_emojis:
        print(f"{emoji}: {count}")
    
print("User Names:", user_names)
print("Message Count:", message_count)


# upload to database
statistics_ref = db.reference('/statistics')

statistics_ref.set({
    'user_names': list(user_names),
    'user_message_counts': user_message_counts,
    'user_emoji_counts': user_emoji_counts,
    'user_top_emoji': sorted_emojis,
    'message_count': message_count,
    'media_sent': user_media_counts,
    'voice_messages_sent': user_voice_counts
})
