import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

import { getToken, removeToken } from "../auth/Auth";
import { PinputTag, ButtonTag, Ptag, UlTag, LiTag, PtextTag } from "./PortfolioUtil";


const AwardUnit = (props) => {
  const handleChangeWithIndex = (e) => {
    props.handleChange(e, props.index);
  };

  return (
    <div>
      <PinputTag
        index={props.index}
        handleChange={handleChangeWithIndex}
        editMode={props.editMode}
        data={props.input.title}
        tagName="title"
        placeHolder="수상내역"
      />
      <PtextTag
        index={props.index}
        handleChange={handleChangeWithIndex}
        editMode={props.editMode}
        data={props.input.desc}
        tagName="desc"
        placeHolder="상세내역"
      />
    </div>
  );
};

const AwardInfo = ({ canEdit, data }) => {
  const history = useHistory();
  const [input, setInput] = useState(data);
  const [editMode, setEditMode] = useState(false);
  const [createdTmpKey, setCreatedTmpKey] = useState(-1);

  const returnValidData = () => {
    data = input.filter((el) => {
      return el.title !== "" && el.desc !== "";
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
      },
    ]);
    setCreatedTmpKey(createdTmpKey - 1);
  };

  const handleChange = (e, index) => {
    const value = e.target.value;
    const name = e.target.name;

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
    console.log(data);

    try {
      await axios.patch(
        "/api/portfolio/award",
        {
          award: data,
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
    <AwardInfoWrapper>
      <Ptag style={{fontWeight: "bold", fontSize: "20px"}}>수상이력</Ptag>
      <UlTag>
        {input.map((obj, index) => {
          return (
            <LiTag key={obj.id}>
              <AwardUnit
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
    </AwardInfoWrapper>
  );
};

export default AwardInfo;

const AwardInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 10px;
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
