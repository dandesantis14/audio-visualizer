import React, { useState, useRef, useEffect } from 'react'
import Controls from './Controls';


const AudioPlayer = ({tracks}) => {
    //STATES TO MANAGE PLAYMENT
    //Tracks which song in collection
    const [trackIndex, setTrackIndex] = useState(0);
    //Tracks the current song as it plays
    const [trackProgress, setTrackProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    //Destructure so I don't go crazy
    const { title, artist, audioSource } = tracks[trackIndex]

    //Refs to handle creation of Audio elements
    const audioRef = useRef(new Audio(audioSource))
    const intervalRef = useRef();
    const isReady = useRef(false);

    //Grab track length
    const {duration} = audioRef.current;

    //Control functionality
    const nextTrack = () => {
        if (trackIndex < tracks.length - 1){
            setTrackIndex(trackIndex+1)
        } else {
            setTrackIndex(0)
        }
    } 
    const prevTrack = () => {
        if (trackIndex - 1 < 0){
            setTrackIndex(tracks.length-1)
        } else {
            setTrackIndex(trackIndex-1)
        }
    }

    //Play Pause Functionality Effects----------------------->
    //Tracks playing
    useEffect(()=>{
        if (isPlaying){
            audioRef.current.play()
            startTimer()
        } else {
            audioRef.current.pause()
        }
    },[isPlaying])
    //Tracks song index
    useEffect(()=>{
        audioRef.current.pause()
        
        audioRef.current = new Audio(audioSource)
        setTrackProgress(audioRef.current.currentTime)
        
        if (isReady.current){
            audioRef.current.play();
            setIsPlaying(true);
            startTimer()
        } else {
            isReady.current = true;
        }
    },[trackIndex])
    //Clean up after dismount
    useEffect(()=>{
        return () => {
            audioRef.current.pause()
            clearInterval(intervalRef.current)
        }
    },[])

    //Timer Functionality checking for song ending-------------->
    const startTimer = () => {
        clearInterval(intervalRef.current);

        intervalRef.current = setInterval(()=> {
            if (audioRef.current.ended){
                nextTrack()
            } else {
                setTrackProgress(audioRef.current.currentTime)
            }
        },[1000])
    }

    //Scrubbing Functionality---------------------------------->
    const onScrub = (timestamp) => {
        clearInterval(intervalRef.current)
        audioRef.current.currentTime = timestamp;
        setTrackProgress(audioRef.current.currentTime)
    }
    const  onScrubEnd = () => {
        startTimer();
    }
    
    return (
        <div className='player'>
            <div className='trackInfo'>
                <h3 className='trackTitle'>{title}</h3>
                <h4 className='trackArtist'>{artist}</h4>
            </div>
            <Controls 
                isPlaying={isPlaying}
                onPrevClick={prevTrack}
                onNextClick={nextTrack}
                onPlayPauseClick={setIsPlaying}
            />
            <input 
                type = "range"
                value = {trackProgress}
                step = "1"
                min = "0"
                max = {duration ? duration : `${duration}`}
                className = "scrubber"
                onChange = {(e)=> onScrub(e.target.value)}
                onMouseUp = {onScrubEnd}
                onKeyUp = {onScrubEnd}
            />
        </div>
    );
}
export default AudioPlayer