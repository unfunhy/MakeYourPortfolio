import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";

import { baseURL } from "../../Config";
import { getToken, removeToken } from "../auth/Auth";
import { PinputTag, ButtonTag, Ptag, InputTag, LiTag, UlTag } from "./PortfolioUtil";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useHistory } from "react-router-dom";

const CertificateUnit = (props) => {
  const handleChangeWithIndex = (e) => {
    props.handleChange(e, props.index);
  };

  const handleDateChangeWithIndex = (e) => {
    props.handleChange(
      {
        target: {
          name: "acq_date",
          value: e,
        },
      },
      props.index
    );
  };

  const dateToString = () => {
    const acqDate = new Date(props.input.acq_date);

    const acq = [
      acqDate.getFullYear(),
      acqDate.getMonth() + 1,
      acqDate.getDate(),
    ].join(".");
    return acq;
  };

  return (
    <div>
      <PinputTag
        index={props.index}
        handleChange={handleChangeWithIndex}
        editMode={props.editMode}
        data={props.input.title}
        tagName="title"
        placeHolder="자격증"
      />
      <PinputTag
        index={props.index}
        handleChange={handleChangeWithIndex}
        editMode={props.editMode}
        data={props.input.auth}
        tagName="auth"
        placeHolder="발급기관"
      />
      {props.editMode ? (
        <div>
          <DatePicker
            selected={props.input.acq_date}
            onChange={handleDateChangeWithIndex}
            dateFormat="yyyy년 M월 d일"
            customInput={<InputTag style={{marginTop: 0}}/>}
          />
        </div>
      ) : (
        <Ptag>{dateToString()}</Ptag>
      )}
    </div>
  );
};

const CertificateInfo = ({ canEdit, data }) => {
  const history = useHistory();
  const [input, setInput] = useState(data);
  const [editMode, setEditMode] = useState(false);
  const [createdTmpKey, setCreatedTmpKey] = useState(-1);

  useEffect(()=>{
    setInput(data);
  }, [data])

  const returnValidData = () => {
    data = input.filter((el) => {
      return el.title !== "" && el.auth !== "" && el.acq_date !== "";
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
        acq_date: new Date("2020/09/02"),
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

  const convertTimeformat = () => {
    data = returnValidData();
    data.forEach(el=>{
        el.acq_date = new Date(el.acq_date);
    });

    return data;
  }

  const handleSubmit = async () => {
    data = convertTimeformat();
    setInput(data);
    console.log("submit data ...", data);

    try {
      await axios.patch(
        `${baseURL}/api/portfolio/certificate`,
        {
          certificate: data,
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
    <CertificateInfoWrapper>
      <Ptag style={{fontWeight: "bold", fontSize: "20px"}}>자격증</Ptag>
      <UlTag>
        {input.map((obj, index) => {
          return (
            <LiTag key={obj.id}>
              <CertificateUnit
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
    </CertificateInfoWrapper>
  );
};

export default CertificateInfo;

const CertificateInfoWrapper = styled.div`
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
