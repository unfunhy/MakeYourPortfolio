import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";

import { getToken } from "../auth/Auth";
import {
  PinputTag,
  ButtonTag,
  Ptag,
  UlTag,
  LiTag,
  PtextTag,
  DeleteBtn,
} from "./PortfolioUtil";

const AwardUnit = (props) => {
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
        data={props.input.title}
        tagName="title"
        placeHolder="수상내역"
        style={{fontWeight:"bold", fontSize:"17px"}}
      />
      <PtextTag
        index={props.index}
        handleChange={handleChangeWithIndex}
        editMode={props.editMode}
        data={props.input.desc}
        tagName="desc"
        placeHolder="상세내역"
      />
      </FlexCol>
      {props.editMode && <DeleteBtn handleDelete={handleDeleteWithIndex}/>}
    </FlexRow>
  );
};

const AwardInfo = ({ canEdit, data, setValidToken }) => {
  const [input, setInput] = useState(data);
  const [editMode, setEditMode] = useState(false);
  const [createdTmpKey, setCreatedTmpKey] = useState(-1);

  useEffect(() => {
    setInput(data);
  }, [data]);

  const returnValidData = () => {
    const ret = input.filter((el) => {
      return el.title !== "" && el.desc !== "";
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
    const validInput = returnValidData();

    let res;
    try {
      res = await axios.patch(
        '/api/portfolio/award',
        {
          award: validInput,
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
      await axios.delete("/api/portfolio/award", {
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
    <AwardInfoWrapper>
      <Ptag style={{ fontWeight: "bold", fontSize: "20px", color:"black" }}>수상이력</Ptag>
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
                handleDelete={handleDelete}
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
