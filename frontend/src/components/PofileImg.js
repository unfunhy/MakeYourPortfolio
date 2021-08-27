import React, { useEffect, useState } from "react";
import FormData from "form-data";
import axios from "axios";
import styled from "styled-components";

import { getToken } from "./auth/Auth";

export const NoneditableProfileImg = ({ profile }) => {
  const [imgSrc, setImgSrc] = useState("");

  useEffect(() => {
    if (!profile || profile.length === 0 || profile.length > 50) return;
    setImgSrc(`/api/img?imgSrc=${profile}`);
  }, [profile]);

  return (
    <ImgContainer>
      <RoundImg
        src={imgSrc}
        onError={(e) => (e.target.src = "/images/default_img.png")}
      />
    </ImgContainer>
  );
};

export const EditableProfileImg = ({ id, profile, setProfile }) => {
  const [imgSrc, setImgSrc] = useState("");

  useEffect(() => {
    if (profile === null || profile.length === 0 || profile.length > 50) return;
    setImgSrc(`/api/img?imgSrc=${profile}`);
  }, [profile]);

  const upload = async (file) => {
    if (imgSrc === "empty") return;

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
      localStorage.setItem(`profile-img-${id}`, reader.result);
      upload(file);
      setProfile(reader.result);
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

const ImgContainer = styled.div`
  width: 128px;
  height: 128px;
  border-radius: 70%;
  margin-top: 15px;
  overflow: hidden;
`;

const RoundImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
