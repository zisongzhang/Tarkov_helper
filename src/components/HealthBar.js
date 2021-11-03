/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import {css} from '@emotion/react';
import './HealthBar.css'


function HealthBar(props){

    const healthBarContainer = css`
        width: 7rem;
        margin: 0;
        position: absolute;
        top: ${props.top}rem;
        left: ${props.left}rem;
    `;
    const [health, setHealth] = useState(props.health);
    const [maxHealth, setMaxHealth] = useState(props.health);
    const [damage, setDamage] = useState(props.damage);
    const [name, setName] = useState(props.name);

    const doDamage = () => {
        setHealth(health => Math.max(health - damage, 0));
    }

    return (
        <div css = {healthBarContainer}>
            <progress id="health" value={health} max={maxHealth}>{health} / {props.health}</progress>
            <p className="healthBar">{health} / {props.health}</p>
            <button className="healthBarBtn" onClick={doDamage}>{name}</button>
        </div>
    )
}

export default HealthBar;
