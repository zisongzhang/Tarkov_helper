/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import {css} from '@emotion/react';
import './HealthBar.css';

function HealthBar(props){

    const healthBarContainer = css`
        width: 7rem;
        margin: 0;
        position: absolute;
        top: ${props.top}rem;
        left: ${props.left}rem;
    `;
    const [maxHealth, setMaxHealth] = useState(props.maxHealth);   // set max health



    return (
        <div css = {healthBarContainer}>
            
            <progress id="health" value={props.health} max={maxHealth}>{props.health} / {maxHealth}</progress>
            <p className="healthBar">{props.health} / {maxHealth}</p>
            <button className="healthBarBtn" onClick={()=>props.handleDamage(props.name, props.health, props.damage)}>{props.partName}</button>
        </div>
    )
}

export default HealthBar;
