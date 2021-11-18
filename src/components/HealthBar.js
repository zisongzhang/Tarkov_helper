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
    const [health, setHealth] = useState(props.health);  // set init health
    const [maxHealth, setMaxHealth] = useState(props.MaxHealth);   // set max health
    const [damage, setDamage] = useState(props.damage);     // damage 
    const [name, setName] = useState(props.name);      // part name

    const doDamage = (part) => {
        setHealth(health => Math.max(health - damage, 0));
        
        const tempListRepo = [...props.ListRepo];      // store to local(temp array)
        tempListRepo[0][part] = health;     // copy current health to local(temp array)
        props.setListRepo(tempListRepo);    //  copy local(temp array) to parent array(ListRepo)
    }

    return (
        <div css = {healthBarContainer}>
            <progress id="health" value={health} max={maxHealth}>{health} / {props.health}</progress>
            <p className="healthBar">{health} / {props.health}</p>
            <button className="healthBarBtn" onClick={()=>doDamage(name)}>{name}</button>
        </div>
    )
}

export default HealthBar;
