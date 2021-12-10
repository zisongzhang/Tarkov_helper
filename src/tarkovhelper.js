/**@jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react';
import {useHistory} from 'react-router-dom';
import fetch from 'isomorphic-unfetch';
import HealthBar from './components/HealthBar.js';
import '../src/tarkovhelper.css'
import cloneDeep from 'lodash/cloneDeep';

/*
* background
* title color and name
*/

function Tarkovhelper({query, query_bullet}){
    const [inputQuery, setinputQuery] = useState(query || "");
    const [inputBulletQuery, setinputBulletQuery] = useState(query_bullet || "");
    const [ListRepo, setListRepo] = useState([]); // for charater
    const [maxListRepo, setMaxListRepo] = useState([]); // store all the max health
    const [BulletListRepo, setBulletListRepo] = useState([]); // for bullet
    const [isLoading, setIsLoading] = useState(false);
    const [isBulletLoading, setIsBulletLoading ] = useState(false);
    const history = useHistory();
    
    useEffect(()=>{
        let ignore = false;
        const controller = new AbortController();  // set controll
        async function fetchResult(){       //fetch character
            let responseBody = {};
            setIsLoading(true);
            try{
                console.log("Query: ", query);
                const res = await fetch(
                    `http://localhost:3001/Characters/?q=${query}`,
                    {signal: controller.signal}
                );
                responseBody = await res.json();
            }catch(e){
                if (e instanceof DOMException) {
                    console.log("HTTP request aborted");
                  } else {
                    // setIsError(true);
                    console.log(e);
                  }
            }
            if (!ignore){
                // console.log("responsebody: ", responseBody);
                setIsLoading(false);
                setListRepo(responseBody || []);
                // let tmpMaxArr = ListRepo.map(item => ({...item}));
                // let copiedObject = JSON.parse(JSON.stringify(responseBody))
                var tmpMaxArr = cloneDeep(responseBody);
                // console.log({tmpMaxArr})
                setMaxListRepo(tmpMaxArr || []);
            }
        }
        // const bullet_controller = new AbortController();
        async function fetchBulletResult(){       //fetch character
            let responseBulletBody = {};
            setIsBulletLoading(true);
            try{
                console.log("Bullet Query: ", query_bullet);
                const res = await fetch(
                    `http://localhost:3001/Bullets/?q=${query_bullet}`,
                    {signal: controller.signal}
                );
                responseBulletBody = await res.json();
            }catch(e){
                if (e instanceof DOMException) {
                    console.log("HTTP request aborted");
                  } else {
                    // setIsError(true);
                    console.log(e);
                  }
            }
            if (!ignore){
                // console.log("responseBulletBody: ", responseBulletBody);
                setIsBulletLoading(false);
                setBulletListRepo(responseBulletBody || []);    // store bullet
            }
        }
        if (query || query_bullet){
            fetchResult();
            fetchBulletResult();
        }
        return () => {
            controller.abort();
            ignore = true;
            console.log("ListRepo", ListRepo);
        };
    },[query, query_bullet]);

    function setDead(props) {  
        return [{...props[0],
            head:0,
            thorax:0,
            stomach:0,
            right_arm:0,
            right_leg:0,
            left_arm:0,
            left_leg:0,
            total:0
        }];
    }

    async function handleReset(){
        try{
            const res = await fetch(
                `http://localhost:3001/Characters/?q=${query}`
            );
            const responseBody = await res.json();
            setListRepo(responseBody);
        }catch(e){
            if (e instanceof DOMException) {
                console.log("HTTP request aborted");
              } else {
                console.error(e);
              }
        }
    }


    function calculateSpreadDmg(nPart, partName, damage){   // helper function for handleDmgSpread(), calculate spread dmg
        var dmgMultiplier = 0;  // damage multiplier                   

        if(partName.includes('arm')){   // base on the blackout limb, assigning different damage multiplier
            console.log("ARM");
            dmgMultiplier = 0.7;
        }
        if(partName.includes('stomach')){
            console.log("STOMACH");
            dmgMultiplier = 1.5;
        }
        if(partName.includes('leg')){
            console.log("LEG");
            dmgMultiplier = 1;
        }

        var sprDmg = Math.round((damage * dmgMultiplier)/nPart);    // acutall spread damage
        return sprDmg;
    }


    function handleDmgSpread(partName, damage){
        console.log("handling ",partName," dmg spread");

        const dmgArr = [];      // array to store the unblackout part

        if(ListRepo[0].head !== 0){ // check if there are still health in that part
            dmgArr.push('head');
        }
        if(ListRepo[0].throax !== 0){
            dmgArr.push('thorax');
        }
        if(ListRepo[0].stomach !== 0){
            dmgArr.push('stomach');
        }
        if(ListRepo[0].left_arm !== 0){
            dmgArr.push('left_arm');
        }
        if(ListRepo[0].left_leg !== 0){
            dmgArr.push('left_leg');
        }
        if(ListRepo[0].right_arm !== 0){
            dmgArr.push('right_arm');
        }
        if(ListRepo[0].right_leg !== 0){
            dmgArr.push('right_leg');
        }


        var sprDmg = calculateSpreadDmg(dmgArr.length, partName, damage);   // calculate the spread damage

        console.log("==============\n");
        for(var i = 0; i < dmgArr.length; i++){
            console.log(ListRepo[0][dmgArr[i]]);
        }
        console.log("==============\n");

        for(var i = 0; i < dmgArr.length; i++){
            let health = Math.max(ListRepo[0][dmgArr[i]] - sprDmg, 0);

            if((dmgArr[i] === "head" || dmgArr[i] === "thorax") && health === 0){
                console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>spread dead<<<<<<<<<<<<<<<<<<<<<<<<<<")
                setListRepo(setDead(ListRepo));
                return;
            }

            let newArr = [...ListRepo];
            newArr[0][dmgArr[i]] = health;
            setListRepo(newArr);
        }

        console.log("sprDmg: ", sprDmg);
        console.log("dmgArr Len: ", dmgArr.length);
        console.log("dmgArr: ", dmgArr);

        
    }

    const doDamage = (part, health, damage) => {

        var ifBlackout = false;     // flag to check limb already blackout

        if(health <= 0){
            ifBlackout = true;      // limb blackout
        }

        health = Math.max(health - damage, 0);  // calculate health

        
        if(ifBlackout === false){   // if not blackout, decrease health noramlly 
            let newArr = [...ListRepo];
            newArr[0][part] = health;
            setListRepo(newArr);
        }
        else{                       // if blackout
            handleDmgSpread(part, damage);  // do spread damage
        }

        if((part === "head" || part === "thorax") && health <= 0){  // after doing all the calculation, check if player is dead
            setListRepo(setDead(ListRepo));                         // if so, set all health to 0
        }
        console.log("btn hit");
        console.log("ListRepo", ListRepo[0]);
    }

    return(
    <div className = "mainpage">
        {/* {console.log("ListRepo Div", ListRepo)} */}

        
        <form className="inputBox" onSubmit={(e)=>{
                e.preventDefault();
                history.push(`?character=${inputQuery}&bullet=${inputBulletQuery}`);
        }}>
            <input placeholder="Charaters" value={inputQuery} onChange={e => setinputQuery(e.target.value)}/>
                {/* <option name="male"> male</option> */}
                {/* </select>
                </li> */}
                {/* <DataListInput
                placeholder="Select an option from the drop down menu..."
                items={"iphut","hhhh"}
                onSelect={onSelect}
                /> */}
            <input placeholder="Bullets" value={inputBulletQuery} onChange={e => setinputBulletQuery(e.target.value)}/>
            <button type="submit">Search</button>
            <button onClick={handleReset} >Reset</button>
        </form>
        <div className = "humansysytem">
            <div>
            {/* {console.log("isLoading: ", isLoading)} */}
            {/* {console.log("isBulletLoading: ", isBulletLoading)} */}
            {/* {console.log("condition: ", (isLoading && isBulletLoading))} */}

            {(isLoading || isBulletLoading) ? (<h1> loading</h1>) : (
                <div>
                    {(BulletListRepo.length > 0 && maxListRepo.length > 0) ? (
                        <div>
                        
                        {/* {console.log("damage: ", BulletListRepo[0].damage)} */}
                        {ListRepo.map(repo_list => (
                            <ul key={repo_list.id}>
                            <HealthBar left = "21" top = "0" 
                                maxHealth = {maxListRepo[0].head} 
                                damage = {BulletListRepo[0].damage} 
                                health = {repo_list.head} 
                                handleDamage = {doDamage}
                                partName = "HEAD"
                                name="head"
                                />

                            <HealthBar left = "14" top = "6" 
                                maxHealth = {maxListRepo[0].thorax} 
                                damage = {BulletListRepo[0].damage} 
                                health ={repo_list.thorax} 
                                handleDamage = {doDamage}
                                partName = "THORAX"
                                name="thorax"
                                />

                            <HealthBar left = "14" top = "12" 
                                maxHealth={maxListRepo[0].stomach} 
                                damage = {BulletListRepo[0].damage} 
                                health = {repo_list.stomach} 
                                handleDamage = {doDamage}
                                partName = "STOMACH"
                                name="stomach"
                                />

                            <HealthBar left = "2.8" top = "12" 
                                maxHealth = {maxListRepo[0].right_arm} 
                                damage = {BulletListRepo[0].damage} 
                                health = {repo_list.right_arm} 
                                handleDamage = {doDamage}
                                partName = "RIGHT ARM"
                                name = "right_arm"
                                />

                            <HealthBar left = "5" top = "21.5" 
                                maxHealth = {maxListRepo[0].right_leg} 
                                damage = {BulletListRepo[0].damage} 
                                health = {repo_list.right_leg} 
                                handleDamage = {doDamage}
                                partName = "RIGHT LEG"
                                name = "right_leg"
                                />

                            <HealthBar left = "26" top = "12" 
                                maxHealth = {maxListRepo[0].left_arm} 
                                damage = {BulletListRepo[0].damage} 
                                health = {repo_list.left_arm} 
                                handleDamage = {doDamage}
                                partName = "LEFT ARM"
                                name = "left_arm"
                                
                                
                            />

                            <HealthBar left = "23" top = "21.5" 
                                maxHealth = {maxListRepo[0].left_leg} 
                                damage = {BulletListRepo[0].damage} 
                                health = {repo_list.left_leg} 
                                handleDamage = {doDamage}
                                partName = "LEFT LEG"
                                name = "left_leg"
                            />

                            </ul>
                        ))}
                        </div>
                    ):(<h1> loading</h1>)
                    }
                </div>
            )}
            </div>
        </div>
        
    </div>
    );
}

export default Tarkovhelper;