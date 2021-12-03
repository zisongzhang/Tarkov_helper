/**@jsxImportSource @emotion/react */
import React, { useState, useEffect, useCallback } from 'react';
import {useHistory} from 'react-router-dom';
import fetch from 'isomorphic-unfetch';
import {css} from '@emotion/react';
import HealthBar from './components/HealthBar.js';
import '../src/tarkovhelper.css'
import DataListInput from "react-datalist-input";
import cloneDeep from 'lodash/cloneDeep';


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
                console.log("responsebody: ", responseBody);
                setIsLoading(false);
                setListRepo(responseBody || []);
                // let tmpMaxArr = ListRepo.map(item => ({...item}));
                // let copiedObject = JSON.parse(JSON.stringify(responseBody))
                var tmpMaxArr = cloneDeep(responseBody);
                console.log({tmpMaxArr})
                setMaxListRepo(tmpMaxArr || []);
            }
        }
        const bullet_controller = new AbortController();
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
                console.log("responseBulletBody: ", responseBulletBody);
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

    function SetDead(props) {  
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
        // let newArr = [...maxListRepo];
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


    const doDamage = (part, health, damage) => {
        health = Math.max(health - damage, 0);
        if((part === "head" || part === "thorax") && health <= 0){
            setListRepo(SetDead(ListRepo));
        }
        else{
            let newArr = [...ListRepo];
            newArr[0][part] = health;
            setListRepo(newArr);
        }
        console.log("btn hit");
        console.log("ListRepo", ListRepo[0]);
        console.log("maxListRepo", maxListRepo[0]);
    }

    return(
    <div className = "mainpage">
        {console.log("ListRepo Div", ListRepo)}
        <form onSubmit={(e)=>{
                e.preventDefault();
                history.push(`?character=${inputQuery}&bullet=${inputBulletQuery}`);
                // history.push(`?bullet=${inputBulletQuery}`);
        }}>
            <li><input placeholder="Charaters" value={inputQuery} onChange={e => setinputQuery(e.target.value)}/></li>
                {/* <option name="male"> male</option> */}
                {/* </select>
                </li> */}
                {/* <DataListInput
                placeholder="Select an option from the drop down menu..."
                items={"iphut","hhhh"}
                onSelect={onSelect}
                /> */}
            <li><input placeholder="Bullets" value={inputBulletQuery} onChange={e => setinputBulletQuery(e.target.value)}/></li>
            <li><button type="submit">Search</button></li>            
        </form>
        <button onClick={handleReset} >Reset</button>
        {/* {console.log("damage: ", BulletListRepo[0].damage)} */}
        <div className = "humansysytem">
            <div>
            {console.log("isLoading: ", isLoading)}
            {console.log("isBulletLoading: ", isBulletLoading)}
            {console.log("condition: ", (isLoading && isBulletLoading))}

                    
            
            {/* {console.log("damage: ", BulletListRepo[0].damage)} */}
            {(isLoading || isBulletLoading) ? (<h1> loading</h1>) : (
                <div>
                    {(BulletListRepo.length > 0 && maxListRepo.length > 0) ? (
                        <div>
                        
                        {console.log("damage: ", BulletListRepo[0].damage)}
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