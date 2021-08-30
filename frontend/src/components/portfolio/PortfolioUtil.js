import React from "react";
import styled from "styled-components";

export const Ptag = styled.p`
  //display: inline-block;
  //background-color: cyan;
  margin: 5px 0 0 0;
  padding: 3px 12px;
  color: rgb(50,50,50);
  font-weight: 500;
  &:empty::before {
    content: attr(data-placeholder);
    color: gray;
  }
`;

export const InputTag = styled.input`
  box-sizing: border-box;
  margin: 5px 0 10px 0;
  height: 35px;
  width: 100%;
  font-size: 14px;
  padding: 3px 0 3px 12px;
  border: 2px solid lightgray;
  border-radius: 10px;

  + input {
    margin-top: 0;
  }
`;

const TextAreaTag = styled.textarea`
  box-sizing: border-box;
  margin: 0 10px 10px 0;
  //height: 35px;
  width: 100%;
  font-size: 14px;
  padding: 6px 0 3px 12px;
  border: 2px solid lightgray;
  border-radius: 10px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
`;

export const UlTag = styled.ul`
  //list-style: none;
  width: 95%;
  padding: 5px 10px 5px 40px;
  margin: 20px 0 0 0;
`;

export const LiTag = styled.li`
padding-bottom: 20px;
box-sizing: border-box;
//background-color: cyan;
list-style: none;
width: 90%;

  + li {
    border-top: 2px solid lightgray;
    padding-top: 15px;
  }
`;

const BtnTagWrapper = styled.div`
  display: flex;
  margin-left: auto;
  padding-right: 5px;
`;

export const BtnTag = styled.button`
  width: 30px;
  height: 30px;
  background-color: white;
  border: 2px solid lightgray;
  border-radius: 5px;
  box-shadow: 3px 2px 2px gray;
  font-size: 14px;
  cursor: pointer;

  + button {
    margin-left: 10px;
  }
`;

const ImgTag = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const RadioWrapper = styled.div`
  margin-top: 5px;
`;

const RadioSpan = styled.span`
  margin-top: 5px;
  + span {
    margin-left: 15px;
  }
`;

const DelBtnWrapper = styled.p`
  margin:auto;
  margin-left: 15px;
`;

export const DeleteBtn = (props) => {
  return (
    <DelBtnWrapper>
      <BtnTag onClick={props.handleDelete}>
        <ImgTag src="/images/delete_img.png" />
      </BtnTag>
    </DelBtnWrapper>
  );
};

//editMode일 시 input tag, 아닐 시 p tag 리턴
export const PinputTag = (props) => {
  if (props.editMode) {
    return (
      <InputTag
        name={props.tagName}
        value={props.data}
        onChange={props.handleChange}
        placeholder={props.placeHolder}
      />
    );
  }
  else 
    return (
      <Ptag 
        data-placeholder={props.placeHoler}
        style={props.style}
      >{props.data}</Ptag>
    );
};

export const PtextTag = (props) => {
  if (props.editMode)
    return (
      <TextAreaTag
        rows="3"
        name={props.tagName}
        value={props.data}
        onChange={props.handleChange}
        placeholder={props.placeHolder}
      />
    );
  else {
    const lines = props.data.split("\n");
    return (
      <div style={{paddingTop: "5px", paddingBottom: "5px", marginTop: "10px"}}>
        {
          lines.map((line, index) => {
            return (
              <Ptag 
                key={index} 
                data-placeholder={props.placeHoler}
                style={{
                  paddingTop: 0,
                  paddingBottom: 0,
                  marginTop: 0
                }}
              >
                {line}
              </Ptag>
            );
          })
        }
      </div>
    );
    
  } 
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
      <RadioWrapper>
        {props.values.map((el, index) => {
          return (
            <RadioSpan key={index}>
              <input
                type="radio"
                id={props.tagName}
                name={`${props.index}_${props.tagName}`}
                value={index + 1}
                onChange={props.handleChange}
                checked={index === props.state - 1 ? "checked" : ""}
              />
              <label htmlFor={props.tagName}> {el}</label>
            </RadioSpan>
          );
        })}
      </RadioWrapper>
    );
};