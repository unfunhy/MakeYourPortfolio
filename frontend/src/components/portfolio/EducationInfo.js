import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";

import { getToken } from "../auth/Auth";
import { PinputTag, ButtonTag, Ptag, PradioTag, UlTag, LiTag, DeleteBtn } from "./PortfolioUtil";

const EducationUnit = (props) => {
  const handleChangeWithIndex = (e) => {
    props.handleChange(e, props.index);
  };

  const handleDeleteWithIndex = (e) => {
    props.handleDelete(e, props.index);
  };

  return (
    <FlexRow>
      <FlexCol>
      <PinputTag
        index={props.index}
        handleChange={handleChangeWithIndex}
        editMode={props.editMode}
        data={props.input.school}
        tagName="school"
        placeHolder="학교이름"
        style={{fontWeight:"bold", fontSize:"17px"}}
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
      </FlexCol>
      {props.editMode && <DeleteBtn handleDelete={handleDeleteWithIndex}/>}
    </FlexRow>
  );
};

const EducationInfo = ({ canEdit, data, setValidToken }) => {
  const [input, setInput] = useState(data);
  const [editMode, setEditMode] = useState(false);
  const [createdTmpKey, setCreatedTmpKey] = useState(-1);
  
  useEffect(()=>{
    setInput(data);
  }, [data])

  const returnValidData = () => {
    const ret = input.filter((el) => {
      return el.school !== "" && el.major !== "" && el.state !== 0;
    });
    return ret;
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
    const validInput = returnValidData();

    let res;
    try {
      res = await axios.patch(
        '/api/portfolio/education',
        {
          education: validInput,
        },
        {
          headers: {
            Authorization: getToken(),
            "Content-Type": `application/json`,
          },
        }
      );
    } catch (e) {
      if (e.response.status === 401){
        setValidToken(false);
      } else {
        alert(e);
      }
      return;
    }
    const newInput = validInput.map((data, index) => {
      return {
        ...data,
        id: res.data[index],
      }
    });
    setInput(newInput);
    setEditMode(false);
  };

  const handleDelete = async (e, index) => {
    const curId = input[index].id;
    if (curId > 0) {
      await axios.delete("/api/portfolio/education", {
        headers: {
          Authorization: getToken(),
        },
        data: {
          id: curId,
        },
      })
    }
    setInput(input.filter(data=>data.id !== curId));
  };

  return (
    <EducationInfoWrapper>
      <Ptag style={{fontWeight: "bold", fontSize: "20px", color:"black"}}>학력</Ptag>
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
                handleDelete={handleDelete}
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

const FlexRow = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;
`;

const FlexCol = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;