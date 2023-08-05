import React, { useState } from 'react';
import { Typography, Box, List, ListItem, ListItemText, Button } from '@mui/material';

export default function Instruction({ openInstructions, setInstructions }) {
    const [isHeb, setHeb] = useState(false);
  
  return (
        <Box sx={{transform: !openInstructions ? "translateY(-100%)" : "translateY(0%)", direction: isHeb ? 'rtl' : 'ltr', transition: 'all linear 2s', display: 'flex', position: 'absolute', zIndex: '3', backgroundColor: 'InfoBackground', color: 'black', borderRadius: '10px', padding: '10px' }}>
        <Button sx={[{position: 'absolute', zIndex:'5', top: '15px'}, !isHeb ? {right: '10px'} : {left: '10px'}]} variant="contained" onClick={() => setHeb(!isHeb)} >{!isHeb ? 'Change Language' : 'שנה שפה'}</Button>
        {!isHeb ? <Typography>UExplanation of the site:</Typography> : <Typography> הסבר על האתר:</Typography>}
        {!isHeb ? <List>
            <ListItem>
                <ListItemText><br />The site analyzes chat correspondence in WhatsApp groups.<br />
                First you have to choose a group that you want to join and You must get permission from all the members of the group to perform the analysis.</ListItemText>
            </ListItem>
            <ListItem>
                <ListItemText><span style={{ backgroundColor: '#6bc2ac' }}>Downloading and uploading the chat:</span><br />
                    You must enter the group settings in the application and scroll down and click on "Export chat" and then select "with media", the last media sent will always be added as attachments, it is advisable to save the file in a place where you can upload it to the website.<br />
                    Click the UPLOAD FILE button and select the desired file and then you will see the different results.</ListItemText>
                </ListItem>
            <ListItem>
                <ListItemText><span style={{ backgroundColor: '#6bc2ac' }}>Dashboard:</span><br />
                Arriving at the results is done by a script that uses regular expressions to process each line in the text file of the chat and extract relevant information.<br />
                1. General data about the group is presented.<br />
                2. TOP analysis of most sent words - the technique used in this script is basic text processing and word frequency counting. The algorithm used to count the occurrences of the word is implemented using the `Counter` class provided by Python's collections module.<br />
                3. Amount of messages per user.<br />
                4.  Amount of media and voice message per user.<br />
                5. Analysis of TOP emojis.<br />
                6. Number of emojis per user.<br />
                </ListItemText>
            </ListItem>
            <ListItem>
                <ListItemText><span style={{ backgroundColor: '#6bc2ac' }}>Text Analysis:</span><br />
                The algorithm used in sentiment analysis with 'TextBlob' based on TextBlob Sentiment Analyzer. It relies on a pre-trained sentiment lexicon (a list of words with associated polarity scores) to analyze the sentiment of each word in the text. The final sentiment score is a weighted average of the individual word scores.<br />
                Also uses the Google Translate API to translate Hebrew text into English. For this purpose, the `translator' class from the `googletrans' library is used.                
                </ListItemText>
            </ListItem>
            <ListItem>
                <ListItemText><span style={{ backgroundColor: '#6bc2ac' }}>Time Analysis:</span><br />
                The technique is basic word processing and time calculation.<br />The algorithm is a simple iterative approach to extract the date and time information from each line in the chat and calculate the sum of hours and minutes for the first and last messages of each day.<br />
                The script does not use any advanced natural language processing (NLP) or machine learning algorithms.<br />
                Regarding the calculation of message frequency per day/week, the technique is basic text processing and date manipulation. Extract the date of the message, calculate the frequency of messages per day, and determine the day of the week with the highest number of messages.
                </ListItemText>
            </ListItem>
            <ListItem>
                <ListItemText><span style={{ backgroundColor: '#6bc2ac' }}>Relationship Analysis:</span><br />
                The technique used in this script is regular expression matching and dictionary manipulation. The algorithm is a linear scan through the chat log, extracting information about each message and determining interactions between users.<br />
                An interaction is counted when two users exchange messages on consecutive lines.<br />
                The algorithm processes each line in the chat log sequentially and identifies interactions by tracking the name of the previous sender. If the current message has a different sender than the previous one, it considers it a new interaction.
                </ListItemText>
            </ListItem>
            <ListItem>
                <ListItemText>Enjoy 😊 .</ListItemText>
            </ListItem>
            
            <Button sx={{position: 'absolute', bottom: '15px', right: '15px'}} onClick={() => setInstructions(!openInstructions)}>Close</Button>
        </List> 
        :
        <List sx={{direction:'ltr', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}} >
            <ListItem sx={{direction:'rtl', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'start'}}>
                <ListItemText><br />האתר מנתח תכתובות צא'ט בקבוצות ה- WhatsApp.<br />
                תחילה יש לבחור קבוצה שאותה שתרצה לנתח, לאחר מכן לקבל אישור מכל חברי הקבוצה לביצוע הניתוח.
                </ListItemText>
            </ListItem>
            <ListItem  sx={{direction:'rtl', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'start'}}>
                <ListItemText><span style={{ backgroundColor: '#6bc2ac' }}>הורדת והעלאת הצא'ט:</span><br /></ListItemText>
            </ListItem>
            <ListItem  sx={{direction:'rtl', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'start'}}>
                <ListItemText>יש להיכנס להגדרות הקבוצה באפליקציה וגלגל מטה ותלחץ על "ייצוא צא'ט" ואז תבחר "עם מדיה", תמיד המדיה האחרונה שנשלחה תתווסף כקבצים מצורפים, רצוי לשמור את הקובץ במקום שתוכל לעלות אותו לאתר.<br />
                לחץ על הלחצן UPLOAD FILE ויש לבחור את הקובץ הרצוי ולאחר מכן תראה את התוצאות השונות.
                </ListItemText>
            </ListItem>
            <ListItem  sx={{direction:'rtl', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'start'}}>
                <ListItemText><span style={{ backgroundColor: '#6bc2ac' }}>Dashboard:</span><br />
                הגעה לתוצאות נעשה ע"י סקריפט המשתמש בביטויים רגולריים כדי לעבד כל שורה בקובץ הטקסט של הצ'אט ולחלץ מידע רלוונטי.<br />
                1.	מוצגים נתונים כללים על אודות הקבוצה.<br />
                2.	ניתוח TOP מילים שהכי הרבה שלחו אותן - הטכניקה המשמשת בסקריפט זה היא עיבוד טקסט בסיסי וספירת תדירות מילים. האלגוריתם המשמש לספירת מופעי המילה מיושם באמצעות מחלקת `Counter` שמסופקת על ידי collections module של Python.<br />
                3.	כמות הודעות פר משתמש.<br />
                4.	כמות מדיה והודעה קולית פר משתמש.<br />
                5.	ניתוח TOP אימוג'ים.<br />
                6.	כמות אימוג'ים פר משתמש.<br /></ListItemText>
            </ListItem>
            <ListItem  sx={{direction:'rtl', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'start'}}>
                <ListItemText><span style={{ backgroundColor: '#6bc2ac' }}>Text Analysis:</span><br />
                האלגוריתם המשמש בניתוח sentiment עם 'TextBlob' המבוסס על TextBlob Sentiment Analyzer. הוא מסתמך על לקסיקון סנטימנטים מאומן מראש (רשימה של מילים עם ציוני קוטביות קשורים) כדי לנתח את הסנטימנט של כל מילה בטקסט.<br />
                ציון הסנטימנט הסופי הוא ממוצע משוקלל של ציוני המילים הבודדות.<br />
                משתמש גם ב-Google Translate API כדי לתרגם טקסט עברי לאנגלית. למטרה זו נעשה שימוש במחלקה `מתרגם` מספריית `googletrans`.
                </ListItemText>
            </ListItem>
            <ListItem  sx={{direction:'rtl', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'start'}}>
                <ListItemText><span style={{ backgroundColor: '#6bc2ac' }}>Time Analysis:</span><br />
                הטכניקה היא עיבוד טקסט בסיסי וחישוב זמן. האלגוריתם הוא גישה איטרטיבית פשוטה כדי לחלץ את מידע התאריך והשעה מכל שורה בצ'אט ולחשב את סכום השעות והדקות עבור ההודעות הראשונות והאחרונות של כל יום.<br />
                הסקריפט אינו משתמש באף אלגוריתם מתקדם של עיבוד שפה טבעית (NLP) או למידת מכונה.<br />
                בנוגע לחישוב תדירות הודעות ליום/ שבוע, הטכניקה היא עיבוד טקסט בסיסי ומניפולציה בתאריכים. לחלץ את תאריך ההודעה, לחשב את תדירות ההודעות ביום, ולקבוע את היום בשבוע עם ספירת ההודעות הגבוהה ביותר.
                </ListItemText>
            </ListItem>
            <ListItem  sx={{direction:'rtl', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'start'}}>
                <ListItemText><span style={{ backgroundColor: '#6bc2ac' }}>Relationships Analysis:</span><br />
                הטכניקה המשמשת בסקריפט זה היא התאמת ביטוי רגולרי ומניפולציה במילון. האלגוריתם הוא סריקה ליניארית דרך יומן הצ'אט, חילוץ מידע על כל הודעה וקביעת אינטראקציות בין משתמשים.<br />
                אינטראקציה נספרת כאשר שני משתמשים מחליפים הודעות בשורות עוקבות.<br />
                האלגוריתם מעבד כל שורה ביומן הצ'אט ברצף ומזהה אינטראקציות על ידי מעקב אחר שם השולח הקודם. <br />
                אם להודעה הנוכחית יש שולח שונה מהקודם, היא מחשיבה אותה כאינטראקציה חדשה.
                </ListItemText>
            </ListItem>
            <ListItem  sx={{direction:'rtl', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'start'}}>
            </ListItem>
            <ListItem  sx={{direction:'rtl', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'start'}}>
                <ListItemText>תהנו 😊 .</ListItemText>
            </ListItem>
            <Button sx={{position: 'absolute', bottom: '20px', left: '20px'}} onClick={() => setInstructions(!openInstructions)}>Close</Button>
        </List>}
    </Box>
  )
}
