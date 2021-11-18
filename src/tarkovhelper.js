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
    const [ isLoading, setIsLoading ] = useState(false);
    const [ isBulletLoading, setIsBulletLoading ] = useState(false);
    const history = useHistory();
    // const [item, setItem] = useState();
    // const onSelect = useCallback((selectedItem) => {
    //     console.log("selectedItem", selectedItem);
    //   }, []);


    const [damage, setDamage] = useState(70);

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

    const testDmg = (part) =>{
        const tempListRepo = [...ListRepo];
      	tempListRepo[0][part] = 10;
        setListRepo(tempListRepo);
    }


    return(
    <div className = "mainpage">
        {console.log("ListRepo Div", ListRepo)}
        {/* <h1>Hello world</h1> */}
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
            <li><button onClick={()=>testDmg("head")}>testDmg</button></li>
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
                    {BulletListRepo.length > 0 ? (
                        <div>
                            {console.log("damage: ", BulletListRepo[0].damage)}
                        {ListRepo.map(repo_list => (
                        <ul key={repo_list.id}>
                        <HealthBar left = "21" top = "0" maxHealth={repo_list.head} health = {repo_list.head} damage = {BulletListRepo[0].damage} name="head" ListRepo = {ListRepo} setListRepo={setListRepo}/>
                        {/* <HealthBar left = "14" top = "6" health={repo_list.thorax} damage= "70" name="Thorax"/>
                        <HealthBar left = "14" top = "12" health={repo_list.stomach} damage= "70" name="Stomach"/>
                        <HealthBar left = "2.8" top = "12" health={repo_list.right_arm} damage= "70" name="Right arm"/>
                        <HealthBar left = "5" top = "21.5" health={repo_list.right_leg} damage= "70" name="Right leg"/>
                        <HealthBar left = "26" top = "12" health={repo_list.left_arm} damage= "70" name="Left arm"/>
                        <HealthBar left = "23" top = "21.5" health={repo_list.left_leg} damage= "70" name="Left leg"/> */}
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