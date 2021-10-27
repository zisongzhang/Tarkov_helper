import React, { useState } from 'react';
import {css} from '@emotion/react';
import './HealthBar.css'

function HealthBar(props){

    const [health, setHealth] = useState(props.health);
    const [maxHealth, setMaxHealth] = useState(props.health);
    const [damage, setDamage] = useState(props.damage);
    const [name, setName] = useState(props.name);

    const doDamage = () => {
        setHealth(health => Math.max(health - damage, 0));
    }

    return (
        <div className="healthBarContainer">
            {/* <p className="healthBar">{health} / {props.health}</p>
            <p className="healthBarB">1</p> */}
            <progress id="health" value={health} max={maxHealth}>{health} / {props.health}</progress>
            <p className="healthBar">{health} / {props.health}</p>
            <button className="healthBarBtn" onClick={doDamage}>{name}</button>
        </div>
    )
}

export default HealthBar;
