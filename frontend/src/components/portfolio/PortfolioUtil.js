import React from "react";
import styled from "styled-components";

export const Ptag = styled.p`
  margin: 10px 5px 0px 5px;
`;

const BtnTagWrapper = styled.div`
  display: flex;
  margin-left: auto;
  padding-right: 5px;
`;

const BtnTag = styled.button`

  + button {
    margin-left: 10px;
  }
`;
//editMode일 시 input tag, 아닐 시 p tag 리턴
export const PinputTag = ({ handleChange, editMode, data, tag_name }) => {
  if (editMode)
    return <input name={tag_name} value={data} onChange={handleChange} />;
  else return <Ptag>{data}</Ptag>;
};

//editMode일 시 update, create버튼 리턴, 아닐 시 edit버튼 리턴
export const ButtonTag = ({ editMode, handleEdit, handleSubmit, handleCreate }) => {
  if (editMode)
    return (
      <BtnTagWrapper>
        <BtnTag onClick={handleSubmit}>
          <img />
          submit
        </BtnTag>
        {handleCreate && (
          <BtnTag onClick={handleCreate}>
            <img />
            create
          </BtnTag>
        )}
      </BtnTagWrapper>
    );
  else
    return (
      <BtnTagWrapper>
        <BtnTag onClick={handleEdit}>
          <img src="" />
          edit
        </BtnTag>
      </BtnTagWrapper>
    );
};