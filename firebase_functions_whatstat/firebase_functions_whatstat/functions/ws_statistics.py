import re
import math
import time
from collections import Counter
from firebase_admin import db
from textblob import TextBlob
from googletrans import Translator
from collections import defaultdict
from datetime import datetime
import googletrans


def extract_chat_stats(file):
    
    group_name = {}
    user_names = set()
    message_count = 0
    user_message_counts = {}
    user_voice_counts = {}
    user_media_counts = {}
    user_emoji_counts = {}
    total_emoji_used = {}
    media_sent = 0
    voice_messages_sent = 0
    clean_pattern = r'[^\x00-\x7F]+'

    first_line = True  # Flag to skip the first line
    for line in file:
        if first_line and re.search(r'\b[\w\s]+\b', line) and ':' in line and not re.search(r'\d+:\d+-\d+:\d+', line):
            parts = line.split('-', maxsplit=1)
            if len(parts) >= 2:
                message_body_name = parts[1].split(':')
                if len(message_body_name) >= 2:
                    group_name = message_body_name[0].strip()
                    if first_line:
                        first_line = False
                        continue  # Skip the first line
#             print(line)
        if re.search(r'\b[\w\s]+\b', line) and ':' in line and not re.search(r'\d+:\d+-\d+:\d+', line):
            # Split the line into parts based on the delimiter "-"
#                 print(first_line)
            parts = line.split('-', maxsplit=1)
            if len(parts) >= 2:
                # Extract the user name
#                     print(parts)
                message_body_name = parts[1].split(':')
#                     print(message_body_name)
                if len(message_body_name) >= 2:

                    user_name = message_body_name[0].strip()
                    if user_name == group_name: 
                        continue
                    user_names.add(user_name.replace('\u200e', '').strip())

                    if user_name in user_message_counts:
                        user_message_counts[user_name] += 1
                    else:
                        user_message_counts[user_name] = 1

                    # Check if the line contains a voice message
                    if re.search(r'\.opus', message_body_name[1].strip()):

                        # Increment the voice message count for the user
                        if user_name in user_voice_counts:
                            user_voice_counts[user_name] += 1
                        else:
                            user_voice_counts[user_name] = 1
                    # Check if the line contains a media file
#                         print(line)
                    if re.search(r'\.webp|.jpg.jpeg|.png|.mp4', line):
                        # Increment the media file count for the user
#                             print(line)
                        if user_name in user_media_counts:
                            user_media_counts[user_name] += 1
                        else:
                            user_media_counts[user_name] = 1        

                     # Extract and count emojis
                    emojis = re.findall(r'[\U0001F000-\U0001F999]', parts[1])
                    # total
                    for emoji in emojis:
                        if emoji in total_emoji_used:
                            total_emoji_used[emoji] += 1
                        else:
                            total_emoji_used[emoji] = 1
                    # per user
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


    return total_emoji_used, group_name, user_names, user_message_counts, message_count, user_voice_counts, user_media_counts, user_emoji_counts, media_sent, voice_messages_sent


def count_top_words(file):
    word_counts = Counter()
    for line in file:
        if '-' and ':' in line and not '<attached' in line:
            # split line
            parts = line.split('-', maxsplit=1)
            # split and get line without date and time and user name
            message_body_name = parts[1].split(':')
            #split the message
            words = message_body_name[1].split()
            word_counts.update(words)
            ignored_characters = ['?', '!', '(file', 'attached)', 'https']
        
    top_words = [word for word in word_counts.most_common(20) if word[0] not in ignored_characters]
    return top_words


def translate_to_english(text):
    translator = Translator()
    translated_text = translator.translate(text, dest='en')
    return translated_text.text


def sentiment_analysis(local_file):
# Open the file and read the content

    lines = local_file
    positive_sentences = []
    negative_sentences = []
    positive_score = 0
    negative_score = 0
    num_positive_messages = 0
    num_negative_messages = 0
    user_sentiment_scores = {}
    user_message_counts = {}
    first_line_skipped = False  # Flag to keep track of whether the first line is skipped

    for line in lines:
        if not first_line_skipped:  # Check if it's the first line
            first_line_skipped = True
            continue  # Skip the first line and move to the next iteration
        if '-' and ':' in line and not '<attached' in line:
            parts = line.split('-', maxsplit=1)
            # split and get line without date and time and user name
            message_body_name = parts[1].split(':')
            # split the message
            words = message_body_name[1]
            user_name = message_body_name[0]
            # Translate Hebrew word to English
            translated_word = translate_to_english(words)
            # Get sentiment score for the translated sentence
            sentiment = TextBlob(translated_word).sentiment.polarity
            
            # Determine if the sentence is positive or negative based on the sentiment score
            if sentiment > 0:
                positive_sentences.append((translated_word, sentiment))
                num_positive_messages += 1
                positive_score += sentiment
                # Update user sentiment score and message count
                if user_name not in user_sentiment_scores:
                    user_sentiment_scores[user_name] = 0
                    user_message_counts[user_name] = 0
                else:
                    user_sentiment_scores[user_name] += sentiment
                    user_message_counts[user_name] += 1
            elif sentiment < 0:
                negative_sentences.append((translated_word, sentiment))
                num_negative_messages += 1
                negative_score += sentiment
                # Update user sentiment score and message count
                if user_name not in user_sentiment_scores:
                    user_sentiment_scores[user_name] = 0
                    user_message_counts[user_name] = 0
                else:
                    user_sentiment_scores[user_name] += sentiment
                    user_message_counts[user_name] += 1
    # Calculate average sentiment score for each user
    user_average_sentiment = {}
    for user, total_score in user_sentiment_scores.items():
        message_count = user_message_counts[user]
        average_sentiment = total_score / message_count
        user_average_sentiment[user] = average_sentiment
        
    # Find the most positive user
    most_positive_user = max(user_average_sentiment, key=user_average_sentiment.get)

    # Find the most negative user
    most_negative_user = min(user_average_sentiment, key=user_average_sentiment.get)


    # Save positive and negative sentences to database (example)
    positive_sentences_db = [sentence for sentence, _ in positive_sentences]
    positive_sentences_score = [score for _, score in positive_sentences]
    negative_sentences_db = [sentence for sentence, _ in negative_sentences]
    negative_sentences_score = [score for _, score in negative_sentences]

    # Upload to database (replace with your database update logic)
    time_ref = db.reference('/statistics/sentiment')

    time_ref.update({
        "positive_sentences": positive_sentences_db,
        "positive_sentences_score": positive_sentences_score,
        'most_positive_user': most_positive_user,
        'most_positive_user_score': user_average_sentiment[most_positive_user],
        'total_positive_messages': len(positive_sentences),
        'total_positive_score': positive_score/len(positive_sentences),
    })          
    time.sleep(10)
    time_ref.update({
        'negative_sentences': negative_sentences_db,
        "negative_sentences_score": negative_sentences_score,
        "most_negative_user": most_negative_user,
        "most_negative_user_score": user_average_sentiment[most_negative_user],
        'total_negative_messages': len(negative_sentences),
        'total_negative_score': negative_score/len(negative_sentences)
    })          


def calculate_mean_first_message_time(file):
    first_message_times = { 'hours': 0, 'minutes': 0 }
    previous_date = None
    day_count = 0
    
    for line in file:
        if '-' in line and ':' in line:
            parts = line.split('-', maxsplit=1)
            message_date_time = parts[0].strip()
            time = message_date_time.split(',')[1].strip()
            date = message_date_time.split(',')[0].strip()

            # if date changes add the time of first message
            if previous_date != date:
                hour = time.split(':')[0]
                minute = time.split(':')[1]
                first_message_times['hours'] += int(hour)
                first_message_times['minutes'] += int(minute)

                day_count += 1
                previous_date = date
    
    if first_message_times:
        mean_hour = math.floor(first_message_times['hours'] / day_count)
        mean_minute = math.floor(first_message_times['minutes'] / day_count)
        
        return mean_hour, mean_minute, day_count
    else:
        return None

def calculate_mean_last_message_time(file):
    last_message_times = { 'hours': 0, 'minutes': 0 }
    prev_time = { 'hours': 0, 'minutes': 0 }
    previous_date = None
    last_day_count = 0
    
    for line in file:
        if '-' in line and ':' in line:
            parts = line.split('-', maxsplit=1)
            message_date_time = parts[0].strip()
            time = message_date_time.split(',')[1].strip()
            date = message_date_time.split(',')[0].strip()

            # if date same replace temp saved time
            if previous_date == date:
                hour = time.split(':')[0]
                minute = time.split(':')[1]
                prev_time.update({'hours': int(hour)})
                prev_time.update({'minutes': int(minute)})

                # if date changed add the last saved time
            else:
                hour = time.split(':')[0]
                minute = time.split(':')[1]
                last_message_times['hours'] += prev_time['hours']
                last_message_times['minutes'] += prev_time['minutes']
#                     print(last_message_times, '....', prev_time )
                prev_time.update({'hours': 0})
                prev_time.update({'minutes': 0})
                last_day_count += 1
                previous_date = date
#                     else: 
            previous_date = date
    
    #calculate the mean time of last message
    if last_message_times: 
        last_mean_hour = math.floor(last_message_times['hours'] / last_day_count)
        last_mean_minute = math.floor(last_message_times['minutes'] / last_day_count)
        return last_mean_hour, last_mean_minute, last_day_count
    else:
        return None    

def detect_earliest_sender(file):
    earliest_sender = None
    earliest_time = None
    
    for line in file:
        if '-' in line and ':' in line:
            
            parts = line.split('-', maxsplit=1)
            user = parts[1].split(':', maxsplit=1)[0].strip()
            time = parts[0].strip().split(',')[1].strip()
            hour, minute = time.split(':')
            message_time = int(hour) * 60 + int(minute)
            
            if earliest_time is None or message_time < earliest_time:
                earliest_time = message_time
                earliest_sender = user
    
    return earliest_sender

def detect_latest_sender(file):
    latest_sender = None
    latest_time = None

    for line in file:
        if '-' in line and ':' in line:
            parts = line.split('-', maxsplit=1)
            user = parts[1].split(':', maxsplit=1)[0].strip()
            time = parts[0].strip().split(',')[1].strip()
            hour, minute = time.split(':')
            message_time = int(hour) * 60 + int(minute)
            
            if latest_time is None or message_time > latest_time:
                latest_time = message_time
                latest_sender = user

    return latest_sender        

def calculate_day_frequency(file):
    day_frequency = defaultdict(int)
    
    for line in file:
        if '-' in line and ':' in line:
            parts = line.split('-', maxsplit=1)
            message_date = parts[0].strip().split(',')[0].strip()
            message_date = message_date.replace('/', '-')
            day_frequency[message_date] += 1
            
            # Convert the message date to the corresponding day of the week    
    return day_frequency
    
def calculate_by_day_frequency(file):
    day_frequency = defaultdict(int)
    
    for line in file:
        if '-' in line and ':' in line:
            parts = line.split('-', maxsplit=1)
            message_date = parts[0].strip().split(',')[0].strip()
            message_date = message_date.replace('/', '-')
            
            # Convert the message date to the corresponding day of the week
            date_obj = datetime.strptime(message_date, '%m-%d-%y')
            day_of_week = date_obj.strftime('%A')
            
            # Increment the message count for the corresponding day of the week
            day_frequency[day_of_week] += 1
        
    return day_frequency    
    
def count_interactions(file):
    interactions = defaultdict(int)
    users = set()

    previous_sender = None
    for line in file:
        if re.match(r'^\d{2}/\d{2}/\d{2},\s+\d{2}:\d{2}\s+-\s+.*:\s+.+$', line):
            parts = re.split(r'-|:', line)
            sender = parts[2].strip()
            message = parts[3].strip()
            users.add(sender)

            if previous_sender is not None and sender != previous_sender:
                interaction_key = (previous_sender, sender)
                interactions[interaction_key] += 1
                if (previous_sender, sender) in interactions:
                    interactions[interaction_key] += 1

            previous_sender = sender

    return interactions, users

def get_top_interactions(interactions, top_n=None):
    sorted_interactions = dict(sorted(interactions.items(), key=lambda x: x[1], reverse=True))
    if top_n is None:
        top_n = len(sorted_interactions)
    return dict(list(sorted_interactions.items())[:top_n])
# Provide the path to your chat log file    