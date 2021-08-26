import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";

import { baseURL } from "../../Config";
import { getToken, removeToken } from "../auth/Auth";
import { PinputTag, ButtonTag, Ptag, PradioTag, UlTag, LiTag } from "./PortfolioUtil";
import { useHistory } from "react-router-dom";

const EducationUnit = (props) => {
  const handleChangeWithIndex = (e) => {
    props.handleChange(e, props.index);
  };

  return (
    <>
      <PinputTag
        index={props.index}
        handleChange={handleChangeWithIndex}
        editMode={props.editMode}
        data={props.input.school}
        tagName="school"
        placeHoler="학교이름"
      />
      <PinputTag
        index={props.index}
        handleChange={handleChangeWithIndex}
        editMode={props.editMode}
        data={props.input.major}
        tagName="major"
        placeHolder="전공"
      />
      <PradioTag
        index={props.index}
        handleChange={handleChangeWithIndex}
        editMode={props.editMode}
        tagName="state"
        values={["재학중", "학사졸업", "석사졸업", "박사졸업"]}
        state={props.input.state}
      />
    </>
  );
};

const EducationInfo = ({ canEdit, data }) => {
  const history = useHistory();
  const [input, setInput] = useState(data);
  const [editMode, setEditMode] = useState(false);
  const [createdTmpKey, setCreatedTmpKey] = useState(-1);
  
  useEffect(()=>{
    setInput(data);
  }, [data])

  const returnValidData = () => {
    data = input.filter((el) => {
      return el.school !== "" && el.major !== "" && el.state !== 0;
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
        school: "",
        major: "",
        state: 0,
      },
    ]);
    setCreatedTmpKey(createdTmpKey - 1);
  };

  const handleChange = (e, index) => {
    let value = e.target.value;
    let name = e.target.name;

    if (name.indexOf("state") !== -1) {
      value = parseInt(value);
      name = name.split("_")[1];
    }

    setInput([
      ...input.slice(0, index),
      {
        ...input[index],
        [name]: value,
      },
      ...input.slice(index + 1, input.length),
    ]);
  };

  const handleSubmit = async () => {
    data = returnValidData();
    setInput(data);

    try {
      await axios.patch(
        `${baseURL}/api/portfolio/education`,
        {
          education: data,
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
    <EducationInfoWrapper>
      <Ptag style={{fontWeight: "bold", fontSize: "20px"}}>학력</Ptag>
      <UlTag>
        {input.map((obj, index) => {
          return (
            <LiTag key={obj.id}>
              <EducationUnit
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
    </EducationInfoWrapper>
  );
};

export default EducationInfo;

const EducationInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 10px;
`;