import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useHistory } from "react-router-dom";

import { getToken } from "../auth/Auth";
import { PinputTag, ButtonTag, Ptag } from "./PortfolioUtil";
import { EditableProfileImg } from "../PofileImg";

//좌상단 프로필 영역
const UserInfo = ({ id, canEdit, data, username, setValidToken }) => {
  const history = useHistory();
  const [editMode, setEditMode] = useState(false);
  const [input, setInput] = useState({introduce: data.introduce});

  useEffect(()=>{
    setInput(data);
  }, [data])

  const handleEdit = (e) => {
    setEditMode(!editMode);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setInput({
      [name]: value,
    });
  };

  // submit
  const handleSubmit = async () => {
    try {
      await axios.patch(
        '/api/portfolio/user',
        {
          user: input,
        },
        {
          headers: {
            Authorization: getToken(),
            "Content-Type": `application/json`,
          },
        }
      );
    } catch (e) {
      if (e.response.status === 401) {
        setValidToken(false);
      } else {
        alert(e);
      }
      return;
    }
    setEditMode(false);
  };

  return (
    <UserInfoWrapper>
      <EditableProfileImg
        id={id}
        profile={data.profile}
        setProfile={data.setProfile}
      />
      <Ptag style={{
        fontWeight: "bold", 
        fontSize: "20px",
        marginTop: "15px"
      }}>
        {username}
      </Ptag>
      <PinputTag
        handleChange={handleChange}
        editMode={editMode}
        data={input.introduce}
        tagName="introduce"
        placeHoler="한 줄 소개"
      />
      {canEdit === true && (
        <ButtonTag
          editMode={editMode}
          handleEdit={handleEdit}
          handleSubmit={handleSubmit}
        />
      )}
    </UserInfoWrapper>
  );
};

const UserInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
`;

export default UserInfo;