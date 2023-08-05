print('hello')
import numpy as np # linear algebra
import pandas as pd # data processing, CSV file I/O (e.g. pd.read_csv)
import re
from collections import Counter
import nltk
# import firebase_admin
# from firebase_admin import credentials
# from firebase_admin import storage
# from firebase_admin import db
# pip install firebase-admin
# pip install googletrans
# pip install networkx matplotlib

# for dirname, _, filenames in os.walk('/whatstat-90e21.appspot.com/files'):
#     for filename in filenames:
#         print(os.path.join(dirname, filename))
# nltk.download('punkt') # nltk.sent_tokenize and nltk.word_tokenize
# nltk.download('averaged_perceptron_tagger') # nltk.pos_tag
# nltk.download('maxent_ne_chunker') # nltk.ne_chunk_sents
# nltk.download('words')
# nltk.download('vader_lexicon')

# get credentials to firebase
# cred = credentials.Certificate("../firebase/whatstat-90e21-firebase-adminsdk-sabso-215c3e54ec.json")
# firebase_admin.initialize_app(cred, {
#     'storageBucket': 'whatstat-90e21.appspot.com',
#     'databaseURL': 'https://whatstat-90e21-default-rtdb.europe-west1.firebasedatabase.app/files/'
# })