import React, {useState, useEffect} from 'react';
import axios from "axios";
import styled from "styled-components";
import { getToken } from "../auth/Auth";
import { PinputTag, ButtonTag, Ptag } from "./PortfolioUtil";

const EducationInfo = () => {

    return (
        <div>
            <p>학력</p>

        </div>
    );
};

export default EducationInfo;


// const handleChange = (e) => {
//     const value = e.target.value;
//     const name = e.target.name;
//     setInput({
//       ...input,
//       [name]: value,
//     });
//   };
