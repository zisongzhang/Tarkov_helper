/** @jsxImportSource @emotion/react */
import React from 'react';
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

    return (
        <div css = {healthBarContainer}>
            
            <progress id="health" value={props.health} max={props.maxHealth}>{props.health} / {props.maxHealth}</progress>
            <p className="healthBar">{props.health} / {props.maxHealth}</p>
            <button className="healthBarBtn" onClick={()=>props.handleDamage(props.name, props.health, props.damage)}>{props.partName}</button>
        </div>
    )
}

export default HealthBar;
