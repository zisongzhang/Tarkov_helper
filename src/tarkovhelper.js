/**@jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react';
import {useHistory} from 'react-router-dom';
import fetch from 'isomorphic-unfetch';
import {css} from '@emotion/react';
import HealthBar from './components/healthBar';

function Tarkovhelper(query){
    return(
    <div>
        <h1>Hello world</h1>
        <img src="pic3.png"/>
        <HealthBar />
    </div>
    );
}

export default Tarkovhelper;