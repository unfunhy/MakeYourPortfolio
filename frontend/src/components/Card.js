import styled, {css} from 'styled-components';

export const Card = styled.div`
    display: flex;
    flex-direction: column;
    align-items: ${props=>props.login ? "center" : "left"};
    margin: ${props=>props.login ? `auto` : `7px 10px 0 10px`};
    /* ${props=>props.login && css`
        margin: auto;
    `} */
    background-color: rgb(250,250,250);
    //background-color: white;
    border: 1px solid lightgray;
    border-radius: 10px;
    width: ${props=>props.width};
    height: ${props=>props.height};
    box-sizing: border-box;
`;
