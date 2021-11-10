/**@jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react';
import {useHistory} from 'react-router-dom';
import fetch from 'isomorphic-unfetch';
import {css} from '@emotion/react';
import HealthBar from './components/HealthBar.js';
import '../src/tarkovhelper.css'


function Tarkovhelper({query}){
    const [inputQuery, setinputQuery] = useState(query || "");
    const [ListRepo, setListRepo] = useState([]);
    const history = useHistory();


    const [damage, setDamage] = useState(70);

    useEffect(()=>{
        let ignore = false;
        const controller = new AbortController();  // set controll
        async function fetchResult(){       //fetch character
            let responseBody = {};
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
                setListRepo(responseBody || []);
            }
        }
        if (query){
            fetchResult();
        }
        return () => {
            controller.abort();
            ignore = true;
            console.log("ListRepo", ListRepo);
        };
        // console.log(ListRepo);
    },[query]);


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
                history.push(`?q=${inputQuery}`);
        }}>
            <li><input placeholder="Charaters" value={inputQuery} onChange={e => setinputQuery(e.target.value)}/></li>
            <li><input placeholder="Bullets" value={inputQuery} onChange={e => setinputQuery(e.target.value)}/></li>
            <li><button type = "submit" >Search</button></li>
            <li><button onClick={()=>testDmg("head")}>testDmg</button></li>
        </form>
        <div className = "humansysytem">
            <div>
                {ListRepo.map(repo_list => (
                    <ul key={repo_list.id}>
                        <HealthBar left = "21" top = "0" health = {repo_list.head} damage = "70" name="head" ListRepo = {ListRepo} setListRepo={setListRepo}/>
                        {/* <HealthBar left = "14" top = "6" health={repo_list.thorax} damage= "70" name="Thorax"/>
                        <HealthBar left = "14" top = "12" health={repo_list.stomach} damage= "70" name="Stomach"/>
                        <HealthBar left = "2.8" top = "12" health={repo_list.right_arm} damage= "70" name="Right arm"/>
                        <HealthBar left = "5" top = "21.5" health={repo_list.right_leg} damage= "70" name="Right leg"/>
                        <HealthBar left = "26" top = "12" health={repo_list.left_arm} damage= "70" name="Left arm"/>
                        <HealthBar left = "23" top = "21.5" health={repo_list.left_leg} damage= "70" name="Left leg"/> */}
                    </ul>
                ))}
            </div>
        </div>
        
    </div>
    );
}

export default Tarkovhelper;