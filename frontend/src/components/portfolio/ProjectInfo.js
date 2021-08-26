import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { getToken, removeToken } from "../auth/Auth";
import { PinputTag, ButtonTag, Ptag, InputTag, LiTag, UlTag, PtextTag } from "./PortfolioUtil";
import { useHistory } from "react-router-dom";

const ProjectUnit = (props) => {
  const handleChangeWithIndex = (e) => {
    props.handleChange(e, props.index);
  };

  const handleStartChangeWithIndex = (e) => {
    props.handleChange(
      {
        target: {
          name: "start",
          value: e
        },
      },
      props.index
    );
  };

  const handleEndChangeWithIndex = (e) => {
    props.handleChange(
        {
          target: {
            name: "end",
            value: e
          },
        },
        props.index
      );
  };

  const dateToString = () => {
    const startDate = new Date(props.input.start);
    const endDate = new Date(props.input.end);

    const start = [
      startDate.getFullYear(),
      startDate.getMonth() + 1,
      startDate.getDate(),
    ].join(".");
    const end = [
      endDate.getFullYear(),
      endDate.getMonth() + 1,
      endDate.getDate(),
    ].join(".");
    return `${start} ~ ${end}`;
  };

  return (
    <>
      <PinputTag
        index={props.index}
        handleChange={handleChangeWithIndex}
        editMode={props.editMode}
        data={props.input.title}
        tagName="title"
        placeHolder="프로젝트 이름"
      />
      <PtextTag
        index={props.index}
        handleChange={handleChangeWithIndex}
        editMode={props.editMode}
        data={props.input.desc}
        tagName="desc"
        placeHolder="상세내역"
      />
      {props.editMode ? (
        <DatePickerContainer>
          <DatePicker
            selected={props.input.start}
            onChange={handleStartChangeWithIndex}
            selectsStart
            startDate={props.input.start}
            endDate={props.input.end}
            dateFormat="yyyy년 M월 d일"
            customInput={<InputTag style={{
              width: "100%", 
              textAlign: "center",
              padding: 0,
              marginTop: 0
            }}/>}
          />
          <DatePicker
            selected={props.input.end}
            onChange={handleEndChangeWithIndex}
            selectsEnd
            startDate={props.input.start}
            endDate={props.input.end}
            minDate={props.input.start}
            dateFormat="yyyy년 M월 d일"
            customInput={<InputTag style={{
              width: "100%", 
              textAlign: "center",
              padding: 0,
              marginTop: 0
            }}/>}
          />
        </DatePickerContainer>
      ) : (
        <Ptag>{dateToString()}</Ptag>
      )}
    </>
  );
};

const ProjectInfo = ({ canEdit, data }) => {
  const history = useHistory();
  const [input, setInput] = useState(data);
  const [editMode, setEditMode] = useState(false);
  const [createdTmpKey, setCreatedTmpKey] = useState(-1);

  useEffect(()=>{
    setInput(data);
  }, [data])

  const returnValidData = () => {
    data = input.filter((el) => {
      return el.title !== "" && el.desc !== "" && el.start !== "" && el.end !== "";
    });
    return data;
  };

  const handleEdit = (e) => {
    setEditMode(!editMode);
    setInput(returnValidData());
  };

  const handleCreate = () => {
    setInput([
      ...input,
      {
        id: createdTmpKey,
        title: "",
        desc: "",
        start: new Date("2020/09/02"),
        end: new Date("2020/09/02"),
      },
    ]);
    setCreatedTmpKey(createdTmpKey - 1);
  };

  const handleChange = (e, index) => {
    const name = e.target.name;
    const value = e.target.value;

    setInput([
      ...input.slice(0, index),
      {
        ...input[index],
        [name]: value,
      },
      ...input.slice(index + 1, input.length),
    ]);
  };

  // 서버로부터 timestamp 형식의 date 정보를 받기 때문에
  // 서버로 전송하기 전 데이터 포멧이 timestamp형식이라면 js date형식으로 변경
  const convertTimeformat = () => {
    data = returnValidData();
    data.forEach(el=>{
        el.start = new Date(el.start);
        el.end = new Date(el.end);
    });

    return data;
  }

  const handleSubmit = async () => {
    data = convertTimeformat();
    setInput(data);

    try {
      await axios.patch(
        '/api/portfolio/project',
        {
          project: data,
        },
        {
          headers: {
            Authorization: getToken(),
            "Content-Type": `application/json`,
          },
        }
      );
    } catch (e) {
      if (e.response.status == 401){
        removeToken(history, 1);
      }
      return;
    }
    setEditMode(false);
  };

  return (
    <ProjectInfoWrapper>
      <Ptag style={{fontWeight: "bold", fontSize: "20px"}}>프로젝트</Ptag>
      <UlTag>
        {input.map((obj, index) => {
          return (
            <LiTag key={obj.id}>
              <ProjectUnit
                index={index}
                editMode={editMode}
                handleEdit={handleEdit}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                input={obj}
              />
            </LiTag>
          );
        })}
      </UlTag>
      {canEdit === true && (
        <ButtonTag
          editMode={editMode}
          handleEdit={handleEdit}
          handleSubmit={handleSubmit}
          handleCreate={handleCreate}
        />
      )}
    </ProjectInfoWrapper>
  );
};

export default ProjectInfo;

const ProjectInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 10px;
`;

const DatePickerContainer = styled.div`
  display: flex;
`;
// 전송 데이터 형태
/*
    {
      "table": [
        {
          id,
          ...,
          ...,
        },
        {
          id,
          ...,
          ...,
        }
      ]
    }
  */
