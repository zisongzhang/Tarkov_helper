import React, { useState } from 'react';
import './Header.css';

const Header = () => {

    const [ifDisplay, setIfDisplay] = useState(false); 
    const [timer, setTimer] = useState(0);


    function handleDisplay(){
        setIfDisplay(!ifDisplay);
    }

    function timeOut(){
        setIfDisplay(false);
        clearTimeout(timer);
    }

    function handleOnMouseLeaveDelay(){
        timer = setTimeout(timeOut, 100);
    }


    return (
        <div className="header">
            <img src="/OSUicon.png" alt=""/>
            <a className="headerLink" href="https://escapefromtarkov.fandom.com/wiki/Escape_from_Tarkov_Wiki">Wiki</a>

            <div className="dropDowncontainer">
                <button 
                    className="dropDownBtn"
                    onClick={handleDisplay}
                    // onMouseEnter={() => handleDisplay()}
                    // onMouseLeave={() => handleDisplay()}
                    onMouseEnter={() => setIfDisplay(true)}
                    onMouseOver={() => setIfDisplay(true)}
                    onMouseLeave={() => handleOnMouseLeaveDelay}
                    open={ifDisplay}
                    >
                    Streamer
                </button>
                { ifDisplay && (
                <div className="dropdownMenu">
                    <a className="headerLink" href="https://www.youtube.com/c/AquaFPS">AquaFPS</a>
                    <a className="headerLink" href="https://www.youtube.com/c/LVNDMARK">LVNDMARK</a>
                </div>
                ) }
            </div>
           <p></p>
        </div>
    )
}

export default Header;