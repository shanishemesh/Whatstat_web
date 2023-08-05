import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';

export default function Form() {
    const [age, setAge] = useState('');
    const [isAdmin, setIsAdmin] = useState();
    const [important, setImportant] = useState('');
    const [conclusions, setCoclusions] = useState('');
    const [differently, setDifferently] = useState('');
    const [further, setFurther] = useState('');
    const [improve, setImprove] = useState('');
    const [recommend, setRecommend] = useState('');
    const [thanks, setThanks] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.defaults.headers.post['Content-Type'] = 'application/json';
        axios.post('https://formsubmit.co/ajax/shanishemesh1111@gmail.com', {
            "age": age,
            "admin?": isAdmin,
            "Why was it important for you to analyze your group?": important,
            "What conclusions and insights did you have?": conclusions,
            "When you saw the results of the analyzes of the correspondence, did you think of doing things differently?": differently,
            "What further analysis would you like to see?": further,
            "Where do you think it could be improved?": improve,
            "Would you recommend us?": recommend
        })
            .then(response => console.log(response))
            .catch(error => console.log(error));
            setThanks(true);
        setTimeout(() => {
            setAge('');
            setIsAdmin();
            setImportant('');
            setCoclusions('');
            setDifferently('');
            setFurther('');
            setImprove('');
            setRecommend('');
            setThanks(false);
        }, 3000)
    };
    
  return (
    <form id='form' onSubmit={(event) => handleSubmit(event) } style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '85%', display: 'flex', flexDirection: 'column', gap: '40px'}}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid lightGrey'}}>
                <label style={{ fontSize: '16px' }}>Your age:</label>
                    <div>
                        <input type='radio' id='15-30' name='age' value='15-30' onClick={() => setAge('15-30')}/>
                        <label htmlFor='15-30'>15-30</label>
                    </div>
                    <div>
                        <input type='radio' id='30-55' name='age' value='30-55' onClick={() => setAge('30-55')}/>
                        <label htmlFor='30-55'>30-55</label>
                    </div>
                    <div>
                        <input type='radio' id='55+' name='age' value='55+' onClick={() => setAge('55+')}/>
                        <label htmlFor='55+'>55+</label>
                    </div>       
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid lightGrey'}}>
                <label style={{ fontSize: '16px' }}>Are you group admin?</label>
                    <input type='radio' id='true' name='admin' value='true' onClick={() => setIsAdmin('Admin')}/>
                    <label htmlFor='true'>Yes</label>
                    <input type='radio' id='false' name='admin' value='false' onClick={() => setIsAdmin('Not')}/>
                    <label htmlFor='false'>No</label>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid lightGrey'}}>
                <label style={{ fontSize: '16px' }}>Why was it important for you to analyze your group?</label>
                    <input type='radio' id='important1' name='important' value='To learn about myself better' onClick={() => setImportant('To learn about myself better')}/>
                    <label htmlFor='important1'>To learn about myself better</label>
                    <input type='radio' id='important2' name='important' value='To learn about my group members' onClick={() => setImportant('To learn about my group members')}/>
                    <label htmlFor='important2'>To learn about my group members</label>
                    <input type='radio' id='important3' name='important' value='To see key issues better' onClick={() => setImportant('To see key issues better')}/>
                    <label htmlFor='important3'>To see key issues better</label>
                    <input type='radio' id='important4' name='important' value='Other' onClick={() => setImportant('Other')}/>
                    <label htmlFor='important4'>Other</label>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: '16px' }}>What conclusions and insights did you have?</label>
                <input type='text' value={conclusions} style={{ backgroundColor: 'lightGrey', padding: '18px', borderRadius: '10px'}} onChange={(e) => setCoclusions(e.target.value)} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label>When you saw the results of the analyzes of the correspondence, did you think of doing things differently?</label>
                <input type='text' value={differently} style={{ backgroundColor: 'lightGrey',  padding: '18px', borderRadius: '10px'}} onChange={(e) => setDifferently(e.target.value)} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: '16px' }}>What further analysis would you like to see?</label>
                <input type='text' value={further} style={{ backgroundColor: 'lightGrey',  padding: '18px', borderRadius: '10px'}} onChange={(e) => setFurther(e.target.value)} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: '16px' }}>Where do you think it could be improved?</label>
                <input type='text' value={improve} style={{ backgroundColor: 'lightGrey',  padding: '18px', borderRadius: '10px'}} onChange={(e) => setImprove(e.target.value)} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between'}}>
                <label style={{ fontSize: '16px' }}>Would you recommend us?</label>
                <div>
                    <input type='radio' id='yes' name='recommend' value='yes' onClick={() => setRecommend('yes')}/>
                    <label htmlFor='yes'>Yes</label>
                </div>
                <div>
                    <input type='radio' id='no' name='recommend' value='no' onClick={() => setRecommend('no')}/>
                    <label htmlFor='no'>No</label>
                </div>
                <div>
                    <input type='radio' id='maybe' name='recommend' value='maybe' onClick={() => setRecommend('maybe')}/>
                    <label htmlFor='maybe'>Maybe</label>
                </div>
            </div>
            <Button variant='contained' type='submit'>Submit</Button>
            {thanks && <div style={{ fontSize: '16px' }}>Thank you for filling the survey!</div>}     
        </div>  
    </form>
  )
}
