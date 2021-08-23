import styled, {css} from 'styled-components';

export const Card = styled.div`
    display: flex;
    flex-direction: column;
    align-items: ${props=>props.login ? "center" : "left"};
    margin: ${props=>props.login ? `auto` : `10px 15px 0px 15px`};
    /* ${props=>props.login && css`
        margin: auto;
    `} */
    background-color: white;
    border: 1px solid lightgray;
    border-radius: 4px;
    width: ${props=>props.width};
    height: ${props=>props.height};
`;
