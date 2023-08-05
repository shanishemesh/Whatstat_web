import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
// import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Home from "./scenes/Homescreen/Homescreen";
import Dashboard from "./scenes/Dashboard/Dashboard";
import Analysis from './scenes/Analysis/Statistics/Analysis';
import TimeAnalysis from "./scenes/Analysis/Time/TimeAnalysis";
import Relashions from "./scenes/Analysis/Relashions/Relashions";
import Survey from "./scenes/Survey/Survey";

//redux
import { useDispatch } from "react-redux";
import { saveDataFromDB } from "./Redux/features/dataSlice";
//firebase
import {database } from './firebase/firebase';
import { ref, onChildAdded } from 'firebase/database';

import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";

function App() {
  const dispatch = useDispatch();
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const [stat, setStat] = useState({});                             // saving statis data
  const [isLoading, setLoading] = useState(false);

// detect changes to db
useEffect(() => {
  setLoading(true);
  onChildAdded(ref((database), '/'), (snapshot) => {
    if(snapshot.exists()) {
      const data = snapshot.val();
      // console.log(data);
      let main_user_object = {};
      let main_arr = [];
      snapshot.forEach(item => {
        if (item.key === 'group_name') {
          main_user_object['group_name'] = item.val();
        }
        if(item.key === 'message_count') {
          main_user_object['message_count'] = item.val();
        }

        if (item.key === 'user_emoji_counts') { 
          let arr = []; 
          let arrNames = []; 
          let iconArr = []; 
          let userObj = {}; 
          item.forEach(UEC => { 
            let ob = {}; 
            let icon = []; 
            let count = []; 
            UEC.forEach(eachUsersIcons => { 
              icon.push(eachUsersIcons.key); 
              count.push(eachUsersIcons.val()); 
              // ob[eachUsersIcons.key] = eachUsersIcons.val(); 
            }) 
            iconArr.push(icon); 
            icon = []; 
            iconArr.push(count); 
            count = []; 
            userObj[UEC.key] = iconArr; 
            iconArr = []; 
 
          }) 
          main_user_object['user_emoji_counts'] = userObj; 
          userObj = {}; 
        }



        if(item.key === 'media_sent') {
          let userArr = [];
          let countArr = [];
          let ob = {};
          item.forEach(media => {
           userArr.push(media.key);
           countArr.push(media.val());
          })
          ob['user'] = userArr;
          ob['count'] = countArr;
          main_user_object['media_sent'] = ob;
        }

        if(item.key === 'voice_messages_sent') {
          let userArr = [];
          let countArr = [];
          let ob = {};
          item.forEach(media => {
           userArr.push(media.key);
           countArr.push(media.val());
          })
          ob['user'] = userArr;
          ob['count'] = countArr;
          main_user_object['voice_messages_sent'] = ob;
        }

        if (item.key === 'top_emoji') { 
          let arrEmoji = []; 
          let arrCount = []; 
          let ob = {} 
          item.forEach(emoji => { 
            // arrEmoji.push(emoji.val()[0]); 
            arrEmoji.push(emoji.key) 
            // arrCount.push(emoji.val()[1]) 
            arrCount.push(emoji.val()) 
            // ob[emoji.val()[0]] = emoji.val()[1] 
          }) 
          // arr.push(ob); 
          ob['emoji'] = arrEmoji; 
          ob['values'] = arrCount; 
          main_user_object['top_emoji'] = ob; 
        }


        if (item.key === 'user_message_counts' ) {
          let names = [];
          let val = [];
          let userObject = {};
          item.forEach(UEM => {
            names.push(UEM.key);
            val.push(UEM.val());
          })
          userObject['names'] = names;
          userObject['values'] = val;
          main_user_object['user_message_counts'] = userObject;
        }

        if (item.key === 'user_names') {
          let arr = [];
          item.forEach(name => {
            arr.push(name.val());
          })
          main_user_object['user_names'] = arr;
        }

        if (item.key === 'word_count') {
          let arr = [];
          let ob = {};
          item.forEach(word => {
            // ob[word.val()[0]] = word.val()[1];
            ob['text'] = word.val()[0];
            ob['value'] = word.val()[1];
            arr.push(ob);
            ob = {};
          })
          main_user_object['word_count'] = arr;
        }

        if(item.key === 'time') {
          item.forEach(timeItem => {
            let date = [];
            let count = [];
            if (timeItem.key === 'frequency') {
              let ob = {};
              timeItem.forEach(item => {
                date.push(item.key)
                count.push(item.val())
              })
              ob['dates'] = date;
              ob['count'] = count;
              main_user_object['time'] = [];
              main_user_object['time'].push(ob);
            } 
            let obTime = {};

            if (timeItem.key === 'users'){
              obTime[timeItem.key] = timeItem.val();
              main_user_object['time'].push(obTime);
            }
            if (timeItem.key === 'timeStat'){
              obTime[timeItem.key] = timeItem.val();
              main_user_object['time'].push(obTime);
            }
            if (timeItem.key === 'weekday'){
                timeItem.forEach(item => {
                  console.log(item.key);
                  if(item.key === 'frequency'){
                    let days = [];
                    let count = [];
                    item.forEach(dnc => {
                      days.push(dnc.key)
                      count.push(dnc.val())

                    })
                    main_user_object['time'].push(days, count);
                  }
                  else {
                    obTime[item.key] = item.val();
                    main_user_object['time'].push(obTime);

                  }

                })
            }
          })
        }

        let arr = []; 
        if(item.key === 'interactions') {
          let arr = [];
          item.forEach(inter => {
  
            let ob = {};
            inter.forEach(interVal => {
            ob[interVal.key] = interVal.val();
            })
            arr.push(ob);
            main_user_object['interactions'] = arr;
            // main_user_object['interactions'].push(arr)
          })
        }

        if (item.key === 'sentiment'){
          let ob = {};
          let arr = [];
          item.forEach(sent => {
            if ( sent.key === 'negative_sentences' ) {
              sent.forEach(sentences => {
                arr.push(sentences.val());
              }) 
              ob['negative_sentences'] = arr;
              arr = [];
            }
            if ( sent.key === 'positive_sentences' ) {
              sent.forEach(sentences => {
                arr.push(sentences.val());
              })
              ob['positive_sentences'] = arr;
            }
            else { 
              ob[sent.key] = sent.val();
            }
          }) 
          main_user_object['sentiment'] = ob;
        }
        
        setStat(main_user_object);
      })
    }
    else {
      console.log('nothing');
      setLoading(false);
    }
    setLoading(false);
  })
  setLoading(false);
},[]);

useEffect(() => {
  if (Object.keys(stat).length !== 0) {
    //save to redux
    dispatch(saveDataFromDB(stat));
  }
},[stat]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar}/>
          <main className="content">
            <Routes>
              <Route path="/" element={isLoading ? <div>Loading...</div> : <Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/analysis" element={<Analysis />} />
              <Route path="/timeAnalysis" element={<TimeAnalysis />} />
              <Route path="/relashionsAnalysis" element={<Relashions />} />
              <Route path="/survey" element={<Survey />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
