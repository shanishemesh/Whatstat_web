import React, { useState, useContext, useRef, useEffect } from "react";
import Instruction from "./Instruction";
import { Box, Button, Typography, List, ListItem, ListItemText, ListItemButton, ListItemIcon, Input, useTheme } from "@mui/material";
import axios from "axios";
import { getFunctions, httpsCallable } from "firebase/functions";

//firebase
import { storage, database } from '../../firebase/firebase';
import { ref, remove, set } from 'firebase/database';
import { ref as refUpload, uploadBytes } from "firebase/storage";

//redux
import { useDispatch } from "react-redux";
import { deleteTextFile, saveDataFromDB } from "../../Redux/features/dataSlice";

//theme
import { ColorModeContext, tokens } from "../../theme";

//icons
import { LightModeOutlined, DarkModeOutlined, CloudUploadRounded, HourglassTopOutlined } from "@mui/icons-material";


const Dashboard = () => {
const inputRef = useRef();
const dispatch = useDispatch();
const theme = useTheme();
const colors = tokens(theme.palette.mode);
const colorMode = useContext(ColorModeContext);
const [isLoading, setLoading] = useState(false);
const [openInstructions, setInstructions] = useState(false);
const [displayMessage, setDisplayMessage] = useState(false);      // show data control menu
const [savedFileContent, setFileContent] = useState('');          // saved file
const [showRawData, setShowRawData] = useState(false);            // control the data display
const [stat, setStat] = useState({});                             // saving statis data
const [data, setData] = useState(null);



function onCLickCreate() {
    //logicbefore
    const functions = getFunctions();
    const callableReturnMessage = httpsCallable(functions, 'run_file_process_on_call');

    callableReturnMessage().then((result) => {
      console.log(result);
      console.log("Done processing, reloading")
      window.location.reload()
    }).catch((error) => {
      console.log(error);
      window.location.reload()
     });
 }

// uploading to storage 
const handleFileUpload = (event) => {
  setLoading(prv => prv = true);
  const file = event.target.files[0];
  const reader = new FileReader();
  console.log('ran');

  const chatRef = refUpload(storage, 'files/chat.txt');
  uploadBytes(chatRef, file)
    .then((snapshot) => {
      console.log('Uploaded a file!');
      onCLickCreate();
      // triggerFunction();
    })
    .then(() => {
      remove(ref(database))
    })
    .catch((err) => {
      console.log(err, 'Error');
    })



  reader.onload = (e) => {
    const content = e.target.result;
    
    setTimeout(() => {
      setFileContent(content);
      setLoading(false);
      setDisplayMessage(true);
    }, 500);
  }
  reader.readAsText(file);
};

  return (
    // dashboard screen
    <Box sx={{ display: 'flex', flexDirection: 'column', maxHeight: '100vh', overflow: 'hidden' }}>
      {openInstructions && <Instruction openInstructions={openInstructions} setInstructions={() => setInstructions(false)} />}
      {/* header */}
      <List sx={{ display: 'flex', justifyContent: 'space-between', paddingX: '30px' }}>
        <ListItem disableGutters>
          <ListItemText 
            primary='Welcome to Whatstat' 
            primaryTypographyProps={{ fontSize: '38px', fontWeight: '700' }} 
            secondary='Analyze your WhatsApp chats' 
            secondaryTypographyProps={{ color: 'rgb(112, 216, 189)', fontSize: '22px', fontWeight: '400' }}
          />
        </ListItem>
        <ListItem disableGutters sx={{ width: '100px', alignItems: 'center' }}>
          <List>
            <ListItem disableGutters>
              <ListItemButton onClick={colorMode.toggleColorMode}>
                <ListItemIcon>
                { theme.palette.mode === "dark" ? <DarkModeOutlined /> : <LightModeOutlined /> }
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
          </List>
        </ListItem>
      </List>

      <Box sx={{ padding: '60px'}}>
        <Button variant="contained" onClick={() => setInstructions(!openInstructions)}>Instructions</Button>
      </Box>
      
      {/* dashboard main container */}
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
        {/* upload button */}
        <Button
          variant="contained"
          type="input"
          component="label"
          sx={{
            backgroundColor: colors.blueAccent[700],
            width: '400px',
            padding: "5px 100px"      
          }}
          startIcon={!isLoading ? <CloudUploadRounded fontSize="36px" sx={{ fontSize: "36px" }} /> : <HourglassTopOutlined /> }>
          <Typography sx={{ fontSize: "30px", fontWeight: "bold", color: colors.grey[100],}}>
            Upload File
          </Typography>
            <Input
              ref={inputRef}
              type="file"
              inputProps={{ accept: 'text/plain'}}
              style={{ display: "none" }}
              onChange={handleFileUpload} 
            />
        </Button>
      </Box>
        {isLoading && <Typography>Uploading...</Typography>}
    </Box>
  );
};

export default Dashboard;


