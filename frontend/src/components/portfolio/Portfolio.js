import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

import { baseURL } from "../../Config";
import UserContext from "../UserContext";
import { Card } from "../Card";
import { getToken, removeToken } from "../auth/Auth";
import UserInfo from "./UserInfo";
import EducationInfo from "./EducationInfo";
import AwardInfo from "./AwardInfo";
import ProjectInfo from "./ProjectInfo";
import CertificateInfo from "./CertificateInfo";

const Portfolio = (props) => {
  const id = parseInt(props.match.params.user_id);
  const { user, setUser } = useContext(UserContext);
  const [data, setData] = useState({});
  const [profileImg, setProfileImg] = useState("");
  const history = useHistory();

  const getData = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/portfolio`, {
        headers: { Authorization: getToken() },
        params: { id: id },
      });
      setData(res.data);
    } catch (e) {
      if (e.response.status === 401) {
        removeToken(history, 1);
      }
    }
  };

  const getProfileData = async () => {
    /*
    # 해당 사용자 데이터라면 localstorage에 저장 및 사용
    # 아니라면 매번 데이터 요청
    */
    if (user.id === 0) return;

    if (user.id === id) {
      const localData = localStorage.getItem(`profile-img-${id}`);
      if (localData !== null) {
        setProfileImg(localData);
        return;
      }
    }

    try {
      const res = await axios.get(`${baseURL}/api/portfolio/profile`, {
        headers: { Authorization: getToken() },
        params: { id: id },
      });
      setProfileImg(res.data.profile);
      if (user.id === id)
        localStorage.setItem(`profile-img-${id}`, res.data.profile);
    } catch (e) {
      if (user.id === id) localStorage.setItem(`profile-img-${id}`, "empty");
      console.log(e);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    getProfileData();
  }, [user]);

  // Navigation을 통해 portfolio -> portfolio이동 시 데이터 재설정
  useEffect(()=>{
    getData();
    getProfileData();
  }, [id]);

  if (Object.keys(data).length === 0 || user.id === 0)
    return <div>로딩 중...</div>;
  else
    return (
      <PortfolioWrapper>
        <PortfolioMainFrame>
          <UserInfoWrapper>
            <Card width="228px" height="auto" style={{ marginRight: 10 }}>
              <UserInfo
                id={id}
                canEdit={user.id === id}
                data={{
                  introduce: data.user.introduce,
                  profile: profileImg,
                  setProfile: setProfileImg,
                }}
                username={data.user.name}
              />
            </Card>
          </UserInfoWrapper>
          <DetailInfoWrapper>
            <Card width="600px" height="auto">
              <EducationInfo canEdit={user.id === id} data={data.education} />
            </Card>
            <Card width="600px" height="auto">
              <AwardInfo canEdit={user.id === id} data={data.award} />
            </Card>
            <Card width="600px" height="auto">
              <ProjectInfo canEdit={user.id === id} data={data.project} />
            </Card>
            <Card width="600px" height="auto">
              <CertificateInfo
                canEdit={user.id === id}
                data={data.certificate}
              />
            </Card>
          </DetailInfoWrapper>
        </PortfolioMainFrame>
      </PortfolioWrapper>
    );
};

const PortfolioMainFrame = styled.div`
  display: flex;
  justify-content: flex-start;
  height: 100%;
  width: 888px;
  box-sizing: border-box;
  padding: 10px;
  background-color: #dad0c2;
  border-radius: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
  //border: 1px solid lightgray;
`;

const PortfolioWrapper = styled.div`
  height: 100%auto;
  display: flex;
  justify-content: center;
  padding-top: 50px;
  padding-left: 10px;
`;

const DetailInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 7px;
`;

const UserInfoWrapper = styled.div``;

export default Portfolio;
