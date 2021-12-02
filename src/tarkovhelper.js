/**@jsxImportSource @emotion/react */
import React, { useState, useEffect, useCallback } from 'react';
import {useHistory} from 'react-router-dom';
import fetch from 'isomorphic-unfetch';
import {css} from '@emotion/react';
import HealthBar from './components/HealthBar.js';
import '../src/tarkovhelper.css'
import DataListInput from "react-datalist-input";


function Tarkovhelper({query, query_bullet}){
    const [inputQuery, setinputQuery] = useState(query || "");
    const [inputBulletQuery, setinputBulletQuery] = useState(query_bullet || "");
    const [ListRepo, setListRepo] = useState([]); // for charater
    const [maxListRepo, setMaxListRepo] = useState([]); // store all the max health
    const [BulletListRepo, setBulletListRepo] = useState([]); // for bullet
    const [isLoading, setIsLoading] = useState(false);
    const [isBulletLoading, setIsBulletLoading ] = useState(false);
    const history = useHistory();
    // const [item, setItem] = useState();
    // const onSelect = useCallback((selectedItem) => {
    //     console.log("selectedItem", selectedItem);
    //   }, []);

    // check death
    const [ifVital, setIfVital] = useState(true);
    const [ifDead, setIfDead] = useState(false);
    


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
                setMaxListRepo(responseBody || []);
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

    function User(props) {  
        return [{...props[0], left_leg: 0}];
    }

    const test = () => {

        // if(ifDead === true){
        //     console.log("KIA=====================");
        // }

        console.log("KIA=====================");
        let newArr = [...ListRepo];
        console.log("--------List repo array: ", ListRepo);
        // console.log("copy old array: ", newArr);
        newArr[0].thorax = 0;
        setListRepo(User(ListRepo));
        // console.log("copy old array head: ", newArr[0].head);
    }


    const testDoDamage = (part, health, damage) => {
        // console.log("==============\n", health, "\n======================")
        // console.log("==============\n", damage, "\n======================")
        health = Math.max(health - damage, 0)

        // console.log("==============\n", health, "\n======================")
        let newArr = [...ListRepo];
        newArr[0].head = health;
        console.log("==============\n", newArr[0], "\n==================");
        setListRepo(newArr);

        console.log("btn hit")
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
            <li><button type = "submit" >Search</button></li>
            
        </form>
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
                                name="head" 
                                 
                                 
                                ListRepo = {ListRepo} 
                                setListRepo = {setListRepo}

                                testBtn = {testDoDamage}
                                test = {test}
                                ifDead = {ifDead}
                                setIfDead = {setIfDead}
                                />

                            <HealthBar left = "14" top = "6" 
                                maxHealth = {maxListRepo[0].thorax} 
                                damage = {BulletListRepo[0].damage} 
                                health ={repo_list.thorax} 
                                name="thorax" 

                                ListRepo = {ListRepo} 
                                setListRepo = {setListRepo}

                                testBtn = {testDoDamage}
                                test = {test}
                                ifDead = {ifDead}
                                setIfDead = {setIfDead}
                                />

                            {/* <HealthBar left = "14" top = "12" 
                                maxHealth={maxListRepo[0].stomach} 
                                health = {repo_list.stomach} 
                                damage = {BulletListRepo[0].damage} 
                                name="stomach" 
                                ListRepo = {ListRepo} 
                                setListRepo = {setListRepo}

                                test = {test}
                                ifDead = {ifDead}
                                setIfDead = {setIfDead}
                                />

                            <HealthBar left = "2.8" top = "12" 
                                maxHealth = {maxListRepo[0].right_arm} 
                                health = {repo_list.right_arm} 
                                damage = {BulletListRepo[0].damage} 
                                name = "right_arm" 
                                ListRepo = {ListRepo} 
                                setListRepo = {setListRepo}
                                
                                test = {test}
                                ifDead = {ifDead}
                                setIfDead = {setIfDead}
                                />

                            <HealthBar left = "5" top = "21.5" 
                                maxHealth = {maxListRepo[0].right_leg} 
                                health = {repo_list.right_leg} 
                                damage = {BulletListRepo[0].damage} 
                                name = "right_leg" 
                                ListRepo = {ListRepo} 
                                setListRepo = {setListRepo}
                                
                                test = {test}
                                ifDead = {ifDead}
                                setIfDead = {setIfDead}
                                />

                            <HealthBar left = "26" top = "12" 
                            maxHealth = {maxListRepo[0].left_arm} 
                            health = {repo_list.left_arm} 
                            damage = {BulletListRepo[0].damage} 
                            name = "left_arm" 
                            ListRepo = {ListRepo} 
                            setListRepo = {setListRepo}
                            
                            test = {test}
                            ifDead = {ifDead}
                            setIfDead = {setIfDead}
                            />

                            <HealthBar left = "23" top = "21.5" 
                            maxHealth = {maxListRepo[0].left_leg} 
                            health = {repo_list.left_leg} 
                            damage = {BulletListRepo[0].damage} 
                            name = "left_leg" 
                            ListRepo = {ListRepo} 
                            setListRepo = {setListRepo}
                            
                            test = {test}
                            ifDead = {ifDead}
                            setIfDead = {setIfDead}
                            /> */}

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