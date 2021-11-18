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
    const [maxHealth, setMaxHealth] = useState(props.maxHealth);   // set max health
    const [damage, setDamage] = useState(props.damage);     // damage 
    const [name, setName] = useState(props.name);      // part name

    const doDamage = (part) => {
        setHealth(health => Math.max(health - damage, 0));
        
        const tempListRepo = [...props.ListRepo];      // store to local(temp array)
        tempListRepo[0][part] = health;     // copy current health to local(temp array)
        props.setListRepo(tempListRepo);    //  copy local(temp array) to parent array(ListRepo)
    }

    

    const checkDeath = (health) => {
        if((name === "head" || name === "thorax") && health <= 0){

            // props.setIfDead(true);
            // console.log("===================KIA================");
            // const tmpList = [...props.ListRepo];
            // tmpList[0].head = 0;
            // tmpList[0].thorax = 0;
            // tmpList[0].left_arm = 0;
            // tmpList[0].left_leg = 0;
            // tmpList[0].right_arm = 0;
            // tmpList[0].right_leg = 0;
            // props.setListRepo(tmpList);

            props.test();
        }
    }

    return (
        <div css = {healthBarContainer}>
            
            <progress id="health" value={health} max={maxHealth}>{health} / {maxHealth}</progress>
            <p className="healthBar">{health} / {maxHealth}</p>
            <button className="healthBarBtn" onClick={()=>doDamage(name)}>{name}</button>
            {checkDeath(health)}
        </div>
    )
}

export default HealthBar;
