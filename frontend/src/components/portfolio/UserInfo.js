import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { getToken } from "../auth/Auth";
import { PinputTag, ButtonTag, Ptag } from "./PortfolioUtil";
import * as FormData from "form-data";

const ProfilePic = () => {
  const [imgSrc, setImgSrc] = useState(localStorage.getItem("profile-img"));

  const upload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      await axios.post("/api/portfolio/profile", formData, {
        headers: {
          "Content-Type": `multipart/form-data`,
          Authorization: getToken(),
        },
      });
    } catch (e) {
      alert(e);
    }
  };

  const handleChange = async (e) => {
    const possible_format = [
      "image/png",
      "image/jpg",
      "image/jpeg",
      "image/gif",
    ];

    const file = e.target.files[0];
    if (file === undefined) return;
    console.log(file);
    // 2MB 초과 시 alert
    if (file.size > 2 * (2 << 20)) {
      alert("프로필 사진은 2MB를 초과할 수 없습니다.");
      return;
    }
    // 확장자 검사
    if (!possible_format.includes(file.type)) {
      alert("프로필 사진은 png, jpg, jpeg, gif 확장자만 가능합니다.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImgSrc(reader.result);
      localStorage.setItem("profile-img", reader.result);
      upload(file);
    };

    reader.readAsDataURL(file);
  };

  return (
    <ImgContainer>
      <form>
        <label htmlFor="file">
          <RoundImg
            src={imgSrc}
            onError={(e) => (e.target.src = "/images/default_img.png")}
          />
        </label>
        <input
          type="file"
          id="file"
          name="file"
          accept=".png, .jpg, .jpeg, .gif"
          style={{ display: "none" }}
          onChange={handleChange}
        />
      </form>
    </ImgContainer>
  );
};

//좌상단 프로필 영역
const UserInfo = ({ canEdit, data, username }) => {
  const [editMode, setEditMode] = useState(false);
  const [input, setInput] = useState(data);

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
        "/api/portfolio/user",
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
      alert(e.response.data);
      return;
    }
    setEditMode(false);
  };

  return (
    <UserInfoWrapper>
      <ProfilePic />
      <Ptag>{username}</Ptag>
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

const ImgContainer = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 70%;
  overflow: hidden;
`;

const RoundImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const UserInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
`;



export default UserInfo;