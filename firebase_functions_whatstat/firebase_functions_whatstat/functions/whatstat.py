from ws_conversions import reformat_iphone_chat_file, save_android_formatted_file
from ws_statistics import extract_chat_stats, count_top_words, sentiment_analysis, calculate_mean_first_message_time, calculate_mean_last_message_time, detect_earliest_sender, detect_latest_sender, calculate_by_day_frequency, calculate_day_frequency, count_interactions, get_top_interactions

import os
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

# def set_credentials():
#     cred = credentials.Certificate("certs/certificate_whatstats.json")
#     return cred
    


def run_file_process():
    # print("hello")
    # set_credentials()
    print("Start")
    bucket = storage.bucket()
    chat_file_path = 'files/chat.txt'

    blob = bucket.blob(chat_file_path)
    local_file_path = 'local-file.txt'
    file_content = blob.download_as_text(encoding='utf-8')
    local_file = file_content.splitlines()
    android_formatted_lines = reformat_iphone_chat_file(local_file)

    if android_formatted_lines:
        local_file = android_formatted_lines
    else:
        print("The chat file is already formatted in Android style.")    

    # Extract chat statistics
    print("extract_chat_stats")
    total_emoji_used, group_name, user_names, user_message_counts, message_count, user_voice_counts, user_media_counts, user_emoji_counts, media_sent, voice_messages_sent = extract_chat_stats(local_file)

    statistics_ref = db.reference('/statistics')
    statistics_ref.update({
        'group_name' : group_name,
        'user_names': list(user_names),
        'user_message_counts': user_message_counts,
        'user_emoji_counts': user_emoji_counts,
        'top_emoji': total_emoji_used,
        'message_count': message_count,
        'media_sent': user_media_counts,
        'voice_messages_sent': user_voice_counts
    })    


    print("count_top_words")
    top_words = count_top_words(local_file)
        
    # upload to database
    time_ref = db.reference('/statistics')

    time_ref.update({
        'word_count': top_words
    })

    print("calculate_mean_first_message_time")
    mean_hour, mean_minute, day_count = calculate_mean_first_message_time(local_file)
    print(f'First message sent at: {mean_hour}:{mean_minute} calculated based on {day_count} days')


    print("calculate_mean_last_message_time")
    # Calculate the mean time of the last message
    last_mean_hour, last_mean_minute, last_day_count = calculate_mean_last_message_time(local_file)
    print(f'Last message sent at: {last_mean_hour}:{last_mean_minute} calculated based on {last_day_count} days')

    # first_message_time = f'{mean_hour} : {mean_minute}'
    first_message_time_str = ':'.join([str(mean_hour), str(mean_minute)])
    # last_message_time = f'{last_mean_hour} : {last_mean_minute}'
    last_message_time_str = ':'.join([str(last_mean_hour), str(last_mean_minute)])

    # upload to database
    time_ref = db.reference('/statistics/time/timeStat')

    time_ref.update({
        'first_message_time': first_message_time_str,
        'last_message_time': last_message_time_str,
        'day_time': day_count
    })    

    print("detect_earliest_sender")
    earliest_sender = detect_earliest_sender(local_file)
    print(f'Earliest message sender: {earliest_sender}')

    print("detect_latest_sender")
    latest_sender = detect_latest_sender(local_file)
    print(f'Latest message sender: {latest_sender}')

    # upload to database
    time_ref = db.reference('/statistics/time/users')

    time_ref.update({
        'first_message_sender': earliest_sender,
        'last_message_sender': latest_sender,
    })    


    print("calculate_day_frequency")
    day_frequency = calculate_day_frequency(local_file)
    # Find the day of the week with the highest message count
    most_active_day = max(day_frequency, key=day_frequency.get)
    most_active_count = day_frequency[most_active_day]

    # upload to database
    frequency_ref = db.reference('/statistics/time')

    frequency_ref.update({
        'frequency': day_frequency
    })        

    print("Day of the week with the highest message count:", most_active_day)
    print("Number of messages on the most active day:", most_active_count)

    print("calculate_by_day_frequency")
    day_frequency = calculate_by_day_frequency(local_file)

    # Print the message count for each day of the week
    days_of_week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    for day in days_of_week:
        message_count = day_frequency[day]

    # Find the day of the week with the highest message count
    most_active_day = max(day_frequency, key=day_frequency.get)
    most_active_count = day_frequency[most_active_day]

    frequency_ref = db.reference('/statistics/time/weekday')

    frequency_ref.update({
        'frequency': day_frequency,
        'most_active_day': most_active_day,
        'most_active_count': most_active_count,
    })

    print("count_interactions")
    interactions, users = count_interactions(local_file)
    print(interactions, users)

    # Get the top 6 interactions
    print("get_top_interactions")
    num_possible_interactions = len(users)
    top_interactions = get_top_interactions(interactions, top_n=num_possible_interactions)


    # # Upload interactions count to the database
    time_ref = db.reference('/statistics/interactions')
    for i, ((sender, recipient), count) in enumerate(interactions.items(), 1):
        interaction_data = {
            'sender': sender,
            'recipient': recipient,
            'interactionsCount': count
        }
        interaction_key = f'interaction_set_{i}'
        time_ref.child(interaction_key).set(interaction_data)    


    print("sentiment_analysis")
    sentiment_analysis(local_file)

