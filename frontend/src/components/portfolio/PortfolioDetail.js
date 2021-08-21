import React, { useState } from "react";
import styled from "styled-components";

//editMode일 시 input tag, 아닐 시 p tag 리턴
const PinputTag = ({ handleChange, editMode, value, tag_name }) => {
  if (editMode)
    return <input name={tag_name} value={value} onChange={handleChange} />;
  else return <p>{value}</p>;
};

//editMode일 시 update, create버튼 리턴, 아닐 시 edit버튼 리턴
const ButtonTag = ({ editMode, handleEdit, handleSubmit, handleCreate }) => {
  if (editMode)
    return (
      <div>
        <botton onClick={handleSubmit}>
          <img />
        </botton>
        {handleCreate && (
          <button onClick={handleCreate}>
            <img />
          </button>
        )}
      </div>
    );
  else
    return (
      <div>
        <button onClick={handleEdit}>
          <img src="" />
        </button>
      </div>
    );
};

//좌상단 프로필 영역
export const Profile = ({ canEdit, data, username }) => {
  const [editMode, setEditMode] = useState(false);
  const [input, setInput] = useState({});

  const handleEdit = () => setEditMode(true);

  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setInput({
      ...input,
      [name]: value,
    });
  };

  const handleSubmit = () => {};

  return (
    <div>
      <input type="image" />
      <form onSubmit={handleSubmit}>
        <p>{username}</p>
        <PinputTag props={[handleChange, editMode, data, "introduce"]} />
        {canEdit && (
          <ButtonTag
            editMode={editMode}
            handleEdit={handleEdit}
            handleSubmit={handleSubmit}
          />
        )}
      </form>
    </div>
  );
};

export const Education = ({ canEdit, data }) => {
  const [editMode, setEditMode] = useState(false);

  const hadleEdit = () => setEditMode(true);
  const handleSubmit = () => {};

  const handleCreate = () => {};

  return (
    <form>
      <input />
    </form>
  );
};

export const Award = ({ canEdit, data }) => {
  return <div></div>;
};

export const Project = ({ canEdit, data }) => {
  return <div></div>;
};

export const Certificate = ({ handleSubmit, handleChange }) => {
  return <div></div>;
};
