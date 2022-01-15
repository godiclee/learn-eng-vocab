import { useState, useEffect } from 'react';

import { Button, Card, CardContent, Grid, LinearProgress, 
  TextField, Typography  } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import axios from '../api'

function VocabCard({ username }) {
  /* Card Object */
  const [card, setCard] = useState();
  
  const [chi, setChi] = useState('');
  const [eng, setEng] = useState('');
  const [pos, setPos] = useState('');
  const [chisen, setChisen] = useState('')
  const [engsen, setEngsen] = useState([]);
  const [level, setLevel] = useState(0);
  const [holes, setHoles] = useState([]);

  const [newCard, setNewCard] = useState(false);
  const [progress, setProgress] = useState(0);
  const [buffer, setBuffer] = useState(0);

  /* TextField Related */
  const [userAnswer, setUserAnswer] = useState([]);
  const [showFirst, setShowFirst] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [correct, setCorrect] = useState([]);
  const [incorrect, setIncorrect] = useState([]);

  /* Whether it is already wrong (due to different behaviour during submit) */
  const [alreadyCorrect, setAlreadyCorrect] = useState(false); /* for progress bar color */
  const [alreadyWrong, setAlreadyWrong] = useState(false);

  const getCard = async () => {

    const {
			data: { card, holes, score, newcard, show_first },
		} = await axios.get('/card/get-card', {params: { username }});

    setCard(card);

    setChi(card.chi);
    setEng(card.eng);
    setPos(card.pos);
    setChisen(card.chisen);
    setLevel(card.level);
    
    let engsen_ = card.engsen.split(' ');
    setEngsen(engsen_);
    
    setHoles(holes);
    setNewCard(newcard);
    setShowFirst(show_first);
    setProgress(score * 0.1);
    setBuffer(score * 0.1);

    setUserAnswer(Array(card.holes.length).fill(''));
    setShowHint(false);
    setAlreadyCorrect(false);
    setAlreadyWrong(false);
    setCorrect(Array(card.holes.length).fill(0));
    setIncorrect(Array(card.holes.length).fill(0));

    /* Focus on first TextField */
    if (holes.length)
      document.getElementById('0').focus();
  };

  const updateCorrect = async () => {
    const {
			data: { score },
		} = await axios.post('/card/correct', { username, card, newCard });
    setProgress(score * 0.1)
  };
  
  const updateIncorrect = async () => {
    const {
      data: { score },
    } = await axios.post('/card/incorrect', { username, card, newCard });
    setProgress(score * 0.1);
  };

  const submitAnswer = async (e) => {
    /* check answer and show correct / incorrect boy color */
    let result = 'correct';
    let first_incorrect = true;
    for (let i = 0; i < holes.length; i++) {
      if (engsen[holes[i]].toLowerCase() !== userAnswer[i].toLowerCase()) {
        setIncorrect(incorrect => incorrect.slice(0, i).concat([1], incorrect.slice(i+1)));
        if (first_incorrect) {
          document.getElementById(i.toString()).focus();
          first_incorrect = false;
          if (!alreadyWrong) {
            updateIncorrect();
          }
          setAlreadyWrong(true);
        }
        result = 'incorrect';
      } else {
        setCorrect(correct => correct.slice(0, i).concat([1], correct.slice(i+1)));
      }
    }

    /* Wait for 1s to either 1. show new card 2. show hints and wait for new answer */
    if (result === 'correct') {
      if (!alreadyWrong) {
        setAlreadyCorrect(true);
        updateCorrect();
      }
      setTimeout(() => { 
        getCard(); 
      }, 250);
    } else {
      setTimeout(() => { 
        setUserAnswer(Array(card.holes.length).fill('')); 
        setShowHint(true);
      }, 1);
    }
  }

  /* enter: to next textfield or to submit answer */
  const handleEnter = (e, i) => {
    if (e.key === 'Enter') {
      if (i < holes.length - 1) {
        let next = document.getElementById((i+1).toString());
        next.focus();
      } else {
        submitAnswer();
      }
    }
  };

  /* set textfield(s) value to state */
  const typeUserAnswer = (value, i) => {
    setUserAnswer(userAnswer => userAnswer.slice(0, i).concat([value], userAnswer.slice(i+1)));
  };

  const deleteCard = async () => {
    if (window.confirm('你確定要刪除這張卡片嗎? 請只在這張卡片有誤時刪除')) {
      await axios.post('/card/delete-card', { username, card, newCard });
      getCard();
    }
  };

  /* card is rendered when first loaded */
  useEffect(() => {
    getCard();
    // eslint-disable-next-line
  }, []);
  
  return (
      <Card raised sx={{  color: 'primary.main', 
                          border: 1, 
                          overflow: 'auto',
                          mb: 7, 
                          width: { xs: 1.0, sm: 400, md: 600 } }}>
        <CardContent>
          <Typography variant='h7'>
            Level {level} {newCard ? 'New Card' : ''}
          </Typography>
          
          <LinearProgress 
            variant="buffer" 
            value={progress} 
            valueBuffer={buffer}
            color={alreadyCorrect ? 'success' : alreadyWrong ? 'warning' : 'secondary'}
          />
        </CardContent>
        <CardContent sx={{color: 'text.primary'}}>
          {engsen.map((element, index) => {
            const i = holes.indexOf(index); /* i is the position in holes */
            return holes.includes(index) ? 
              <>
                <TextField 
                  id={i.toString()}
                  value={userAnswer[i]}
                  placeholder={showHint ? element : showFirst ? element[0] : ''}
                  onChange={(e) => typeUserAnswer(e.target.value, i)}
                  onKeyDown={(e) => handleEnter(e, i)}
                  /* styles */
                  focused
                  variant='filled'
                  inputProps={{style: {fontSize: '20px', fontFamily: 'Monospace', padding: 5}}}
                  sx={{ fontFamily: 'Monospace', width: `${10 + 12.4*element.length}px` }} 
                    
                  color={correct[i] ? 'success' 
                    : incorrect[i] ? 'warning' : 'primary'}
                /> {' '}
              </> : 
              <Typography display='inline' variant='h5'>
                {element + ' '}
              </Typography>
          })}
        </CardContent>
        <CardContent sx={{color: 'text.primary'}}>
          <Typography variant='h6'>
            {chisen}
          </Typography>
        </CardContent>
        <CardContent>
          <Typography variant='h6'>({pos}) {chi}</Typography>
          <Typography sx={{color: 'text.secondary', fontSize: 12}}>{eng}</Typography>
        </CardContent>
        
        <Grid container justifyContent='center'>
          <Button variant='contained' 
            startIcon={<SendIcon />}
            disabled={!holes.length}
            onClick={submitAnswer}>送出</Button>
          <Button variant='outlined' 
            startIcon={<SkipNextIcon />}
            onClick={getCard}>略過</Button>
          <IconButton aria-label="delete" disabled={!holes.length}>
            <DeleteIcon onClick={deleteCard} />
          </IconButton>
        </Grid>
      </Card>
  );
};

export default VocabCard;