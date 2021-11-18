/**@jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react';
import {useHistory} from 'react-router-dom';
import fetch from 'isomorphic-unfetch';
import {css} from '@emotion/react';
import HealthBar from './components/HealthBar.js';
import '../src/tarkovhelper.css'


function Tarkovhelper({query, query_bullet}){
    const [inputQuery, setinputQuery] = useState(query || "");
    const [inputBulletQuery, setinputBulletQuery] = useState(query_bullet || "");
    const [ListRepo, setListRepo] = useState([]); // for charater
    const [maxListRepo, setMaxListRepo] = useState([]); // store all the max health
    const [BulletListRepo, setBulletListRepo] = useState([]); // for bullet
    const [isLoading, setIsLoading] = useState(false);
    const [isBulletLoading, setIsBulletLoading ] = useState(false);
    const history = useHistory();

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


    const test = () => {

        // if(ifDead === true){
        //     console.log("KIA=====================");
        // }

        console.log("KIA=====================");
        
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
                                health = {repo_list.head} 
                                damage = {BulletListRepo[0].damage} 
                                name="head" ListRepo = {ListRepo} 
                                setListRepo = {setListRepo}


                                test = {test}
                                ifDead = {ifDead}
                                setIfDead = {setIfDead}
                                />

                            <HealthBar left = "14" top = "6" 
                                maxHealth = {maxListRepo[0].thorax} 
                                health ={repo_list.thorax} 
                                damage = {BulletListRepo[0].damage} 
                                name="thorax" 
                                ListRepo = {ListRepo} 
                                setListRepo = {setListRepo}

                                test = {test}
                                ifDead = {ifDead}
                                setIfDead = {setIfDead}
                                />

                            <HealthBar left = "14" top = "12" 
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