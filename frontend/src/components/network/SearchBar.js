import React from "react";
import styled from "styled-components";

import { InputTag } from "../portfolio/PortfolioUtil";

const SearchBar = ({ search, setSearch }) => {
  return (
    <>
      <InputTag
        placeholder="이름으로 검색"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          height: "40px",
          fontSize: "17px",
          paddingTop: "3px",
        }}
      />
      {search !== "" && search.length < 2 &&
        <Ptag>두 글자 이상 입력해주세요.</Ptag>
      }
    </>
  );
};

export default SearchBar;

const Ptag = styled.p`
  position: relative;
  top: -56px;
  right: 15px;
  text-align: right;
  color: red;
  font-weight: bold;
  opacity: 0.5;
`;
