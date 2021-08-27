import React from "react";
import styled from "styled-components";

import { Card } from "../Card";
import { NoneditableProfileImg } from "../PofileImg";
import { Ptag, BtnTag } from "../portfolio/PortfolioUtil";

const UserBriefUnit = (props) => {
  // const [profile, setProfile] = useState(props.profile);

  // useEffect(()=>{
  //   setProfile(props.profile);
  // }, [props.profile])

  return (
    <Card width="250px" height="320px">
      <UserInfoWrapper>
        <NoneditableProfileImg profile={props.data.profile} />
        <Ptag
          style={{
            fontWeight: "bold",
            fontSize: "20px",
            marginTop: "15px",
            color: "black"
          }}
        >
          {props.data.name}
        </Ptag>
        <WrappingPtag
          data-placeholder="한 줄 소개"
        >
          {props.data.introduce}
        </WrappingPtag>
        <BtnTag
          style={{
            width: "80px",
            height: "35px",
            fontWeight: "bold",
          }}
          onClick={(e) => props.handleClick(e, props.data.id)}
        >
          정보보기
        </BtnTag>
      </UserInfoWrapper>
    </Card>
  );
};

export default UserBriefUnit;

const UserInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
`;

const WrappingPtag = styled.p`
  width: 200px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  line-height: 25px;
  height: 50px;
  margin: 10px 0 10px 0;
  text-align: center;

  &:empty::before {
    content: attr(data-placeholder);
    color: gray;
  }
`;