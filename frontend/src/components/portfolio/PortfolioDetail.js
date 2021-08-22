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
        <button onClick={handleSubmit}>
          <img />
          submit
        </button>
        {handleCreate && (
          <button onClick={handleCreate}>
            <img />
            create
          </button>
        )}
      </div>
    );
  else
    return (
      <div>
        <button onClick={handleEdit}>
          <img src="" />
          edit
        </button>
      </div>
    );
};

//좌상단 프로필 영역
export const Profile = ({ canEdit, data, username }) => {
  const [editMode, setEditMode] = useState(false);
  const [input, setInput] = useState({});

  const handleEdit = (e) => {
    setEditMode(true);
  };

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
      <div>
        <input type="image" />
      </div>
      <div>
        <p>{username}</p>
        <PinputTag
          handleChange={handleChange}
          editMode={editMode}
          data={data}
          tag_name="introduce"
        />
        {canEdit === true && (
          <ButtonTag
            editMode={editMode}
            handleEdit={handleEdit}
            handleSubmit={handleSubmit}
          />
        )}
      </div>
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
