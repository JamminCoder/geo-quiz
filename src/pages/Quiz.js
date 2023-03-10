import { useParams } from "react-router-dom";
import { 
    resolveCountryImagePath,
    createProperName, 
} from '../lib/utils';

import { getRandomCountries } from '../lib/api';
import { LoadingPage } from './Loading';

import { useState, useEffect } from 'react';

const NewQuestionButton = () => 
    <button className='btn bg-white shadow w-fit' onClick={ () => window.location.reload() }>
        New Question
    </button>


function Options({ optionsArray, correctOption, audio }) {
    const [messageColor, setMessageColor] = useState();
    const [btnStyle, setBtnStyle] = useState();

    const [isAnswered, setIsAnswered] = useState(false);
    const properName = createProperName(correctOption.country);
    function handleClick(country) {
        if (isAnswered) return;
        if (country.country === correctOption.country) {
            audio.correct.play();
            setMessageColor('green');
        } else {
            audio.wrong.play();
            setMessageColor('red');
        }

        setBtnStyle({
            pointerEvents: 'none',
            opacity: '50%'
        });

        setIsAnswered(true);
    }

    return (
        <div className='grid gap-8 place-items-center'>
            { 
                isAnswered
                ? <p className='text-xl font-medium' style={{ color: messageColor }}> The correct answer is { properName } </p>
                : ""
            }

            { 
                isAnswered
                ?  <NewQuestionButton/>
                : ""
            }

            <div className='flex flex-wrap justify-center items-centers gap-8'>
                { 
                    optionsArray.map(c => <button 
                        onClick={() => handleClick(c)}
                        style={ btnStyle }
                        className='btn shadow bg-white hover:bg-gray-100 hover:text-gray-900 text-xl' 
                        key={ c.iso }>
                        
                        { createProperName(c.country) }
                    </button>) 
                }

                
            </div>
        </div>
    );
}



export default function Quiz() {
    const [countries, setCountries] = useState();
    const [answerCountry, setAnswerCountry] = useState();
    const [audio, setAudio] = useState();

    const [isLoaded, setIsLoaded] = useState(false);
    const { continentName } = useParams();

    useEffect(() => {
        if (isLoaded) return;
        const correctAudio = new Audio("https://cdn.pixabay.com/download/audio/2021/08/04/audio_bb630cc098.mp3");
        const wrongAudio = new Audio("https://cdn.pixabay.com/download/audio/2022/03/24/audio_757cb20504.mp3");

        setAudio({
            correct: correctAudio,
            wrong: wrongAudio
        });

        getRandomCountries(continentName)
        .then(randCountries => {
            setCountries(randCountries);
            const randIndex = Math.floor(Math.random() * randCountries.length);
            setAnswerCountry(randCountries[randIndex]);

            
        })
        .catch(console.log)
        .finally(() => setIsLoaded(true));
    });

    if (!isLoaded) return <LoadingPage />;

    return (
        <div className='page'>
            <h1 className='text-center text-4xl font-semibold mb-16'>Which country in { createProperName(continentName) } is this?</h1>

            <img src={ resolveCountryImagePath(continentName, answerCountry) } alt="" className='w-64 mb-8'/>

            <Options optionsArray={ countries } audio={ audio } correctOption={ answerCountry }/>
        </div>
    );
}