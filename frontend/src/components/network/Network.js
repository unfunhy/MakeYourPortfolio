import React, {useState} from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

import { Card } from "../Card";
import SearchBar from "./SearchBar";

const UserBriefUnit = () => {
  
    retrun (
        <Card>

        </Card>
    );
};

const Network = () => {
    const history = useHistory();

  return (
    <MainFrame>
    <SearchBar></SearchBar>
    <GridLayout>
      
    </GridLayout>
    </MainFrame>
  );
};

const MainFrame = styled.div`

`;


const GridLayout = styled.div`
  display: grid;
`;

export default Network;
