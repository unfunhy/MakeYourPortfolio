import React, {useState} from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";

export const Ptag = styled.p`
  margin: 10px 5px 0px 5px;
  &:empty::before {
    content: attr(data-placeholder);
    color: gray;
  }
`;

const BtnTagWrapper = styled.div`
  display: flex;
  margin-left: auto;
  padding-right: 5px;
`;

const BtnTag = styled.button`
  width: 30px;
  height: 30px;
  background-color: white;
  border: 2px solid lightgray;
  border-radius: 5px;
  box-shadow: 3px 2px 2px gray;
  + button {
    margin-left: 10px;
  }
`;

const ImgTag = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

//editMode일 시 input tag, 아닐 시 p tag 리턴
export const PinputTag = (props) => {
  if (props.editMode)
    return (
      <input
        name={props.tagName}
        value={props.data}
        onChange={props.handleChange}
        placeholder={props.placeHolder}
      />
    );
  else return <Ptag data-placeholder={props.placeHoler}>{props.data}</Ptag>;
};

//editMode일 시 update, create버튼 리턴, 아닐 시 edit버튼 리턴
export const ButtonTag = (props) => {
  if (props.editMode)
    return (
      <BtnTagWrapper>
        <BtnTag onClick={props.handleSubmit}>
          <ImgTag src="/images/submit_img.png" alt="submit_btn"/>
        </BtnTag>
        {props.handleCreate && (
          <BtnTag onClick={props.handleCreate}>
            <ImgTag src="/images/plus_img.png" alt="create_btn"/>
          </BtnTag>
        )}
        <BtnTag onClick={props.handleEdit}>
          <ImgTag src="/images/x_img.png"alt="cancel_btn"/>
        </BtnTag>
      </BtnTagWrapper>
    );
  else
    return (
      <BtnTagWrapper>
        <BtnTag onClick={props.handleEdit}>
          <ImgTag src="/images/edit_img.png" alt="edit_btn"/>
        </BtnTag>
      </BtnTagWrapper>
    );
};

export const PradioTag = (props) => {
  if (!props.editMode) return <Ptag>{props.values[props.state - 1]}</Ptag>;
  else
    return (
      <div>
        {props.values.map((el, index) => {
          return (
            <span key={index}>
              <input
                type="radio"
                id={props.tagName}
                name={`${props.index}_${props.tagName}`}
                value={index + 1}
                onChange={props.handleChange}
                checked={index === props.state - 1 ? "checked" : ""}
              />
              <label htmlFor={props.tagName}>{el}</label>
            </span>
          );
        })}
      </div>
    );
};