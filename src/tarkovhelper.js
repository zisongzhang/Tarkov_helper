/**@jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react';
import {useHistory} from 'react-router-dom';
import fetch from 'isomorphic-unfetch';
import {css} from '@emotion/react';
import HealthBar from './components/healthBar';

function Tarkovhelper({query}){
    const [inputQuery, setinputQuery] = useState(query || "");
    const [ListRepo, setListRepo] = useState([]);
    const history = useHistory();
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
        };
    },[query]);
    return(
    <div>
        <h1>Hello world</h1>
        <form onSubmit={(e)=>{
                e.preventDefault();
                history.push(`?q=${inputQuery}`);
        }}>
            <li><input placeholder="Charaters" value={inputQuery} onChange={e => setinputQuery(e.target.value)}/></li>
            {/* <li><input placeholder="Bullets" value={inputQuery} onChange={e => setinputQuery(e.target.value)}/></li> */}
            <li><button type = "submit" >Search</button></li>
        </form>
        <div>
            {ListRepo.map(repo_list => (
                <ul>
                    <li><p>Head:{repo_list.head}</p></li>
                </ul>
            ))}
        </div>
        <img src="pic3.png"/>
        <HealthBar />
    </div>
    );
}

export default Tarkovhelper;