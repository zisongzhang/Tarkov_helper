import React, { useState } from 'react';
import './HealthBar.css'

function HealthBar(props){

    const [health, setHealth] = useState(props.health);
    const [damage, setDamage] = useState(props.damage);
    const [name, setName] = useState(props.name);

    const doDamage = () => {
        setHealth(health => Math.max(health - damage, 0));
    }


    return (
        <div className="healthBar">
            <div>
                <p></p>
                <p>{health}/{props.health}</p>
            </div>
            <button onClick={doDamage}>{name}</button>
        </div>
    )
}

export default HealthBar;