import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

import UserContext from "../UserContext";
import { Card } from "../Card";
import UserInfo from "./UserInfo";
import { getToken, removeToken } from "../auth/Auth";

const Portfolio = (props) => {
  const id = parseInt(props.match.params.user_id);

  const { user, setUser } = useContext(UserContext);
  const [data, setData] = useState({});
  const [profileReady, setProfileReady] = useState(false);
  const history = useHistory();

  const getData = async () => {
    if (Object.keys(data).length === 0) {
      try {
        const res = await axios.get("/api/portfolio", {
          headers: { Authorization: getToken() },
        });
        console.log("response data ...", res.data);
        setData(res.data);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const getProfileData = async () => {
    /*
    # profile 데이터를 받아서 localstorage에 저장하고
    # profileReady state를 true로 바꿔 저장이 완료되었음을 알림
    */
    if (localStorage.getItem("profile-img") === null) {
      try {
        const res = await axios.get("/api/portfolio/profile", {
          headers: { Authorization: getToken() },
        });
        localStorage.setItem("profile-img", res.data.profile);
      } catch (e) {
        console.log(e);
        localStorage.setItem("profile-img", "empty");
      }
    }
    setProfileReady(true);
  };

  useEffect(() => {
    /* 
    # componentDidMount
    # 
    # 1. user.id가 0이 아닌 경우 portfolio data 요청
    # 2. user.id가 0인 경우(새로고침 등의 이유로 context가 초기화된 경우)
    #    userInfo 요청 후 portfolio data 요청
    */
    if (user.id !== 0) {
      getData();
      getProfileData();
    }
    else {
      const getUser = async () => {
        try {
          const userInfo = await axios.get("/api/login", {
            headers: { Authorization: getToken() },
          });
          //useContext가 의미가 있나 확인 필요
          //refresh할 때 마다 초기화 됨 -> 결국 서버에서 id, name 다시 얻어와야함
          //그럼 전역을 쓰는 이유가 무엇? 그냥 useState쓰면 안되나
          setUser({ id: userInfo.data.id, name: userInfo.data.name });
        } catch (e) {
          alert(e);
          removeToken();
          history.push("/login");
          return;
        }
      };
      getUser();
      getProfileData();
      getData();
    }
  }, []);

  if (Object.keys(data).length === 0 || user.id === 0 || !profileReady)
    return <div style={{paddingTop: 100}}>로딩 중...</div>;
  else
    return (
      <PortfolioWrapper>
        <UserInfoWrapper>
          <Card width="200px" height="auto">
            <UserInfo
              canEdit={user.id === id}
              data={{
                //id: user.id,
                introduce: data.user.introduce,
                //profile: data.user.profile,
              }}
              username={user.name}
            />
          </Card>
        </UserInfoWrapper>
        <DetailInfoWrapper>
          <Card width="600px" height="auto">
            <p>asdfasdf</p>
          </Card>
          <Card width="600px" height="auto">
            <p>asdfasdf</p>
          </Card>
          <Card width="600px" height="auto">
            <p>asdfasdf</p>
          </Card>
          <Card width="600px" height="auto">
            <p>asdfasdf</p>
          </Card>
          <Card width="600px" height="auto">
            <p>asdfasdf</p>
          </Card>
        </DetailInfoWrapper>
      </PortfolioWrapper>
    );
};

const PortfolioWrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: flex-start;
  padding-top: 50px;
  padding-left: 10px;
`;

const DetailInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserInfoWrapper = styled.div`

`;

export default Portfolio;
