/**@jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react';
import {useHistory} from 'react-router-dom';
import fetch from 'isomorphic-unfetch';
import {css} from '@emotion/react';
import HealthBar from './components/HealthBar';

function Tarkovhelper(query){
    return(
    <div>
        <h1>Hello world</h1>
        <img src="pic3.png"/>
        <HealthBar health="35" damage="25" name="Head"/>
    </div>
    );
}

export default Tarkovhelper;