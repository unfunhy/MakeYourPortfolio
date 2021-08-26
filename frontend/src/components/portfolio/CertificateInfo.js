import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";

import { getToken } from "../auth/Auth";
import { PinputTag, ButtonTag, Ptag, InputTag, LiTag, UlTag, DeleteBtn } from "./PortfolioUtil";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

  const handleDeleteWithIndex = (e) => {
    props.handleDelete(e, props.index);
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
    <FlexRow>
      <FlexCol>
      <PinputTag
        index={props.index}
        handleChange={handleChangeWithIndex}
        editMode={props.editMode}
        data={props.input.title}
        tagName="title"
        placeHolder="자격증"
        style={{fontWeight:"bold", fontSize:"17px"}}
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
      </FlexCol>
      {props.editMode && <DeleteBtn handleDelete={handleDeleteWithIndex}/>}
    </FlexRow>
  );
};

const CertificateInfo = ({ canEdit, data, setValidToken }) => {
  const [input, setInput] = useState(data);
  const [editMode, setEditMode] = useState(false);
  const [createdTmpKey, setCreatedTmpKey] = useState(-1);

  useEffect(()=>{
    setInput(data);
  }, [data])

  const returnValidData = () => {
    const ret = input.filter((el) => {
      return el.title !== "" && el.auth !== "";
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
        auth: "",
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
    const ret = returnValidData();
    ret.forEach(el=>{
      el.acq_date = new Date(el.acq_date);
    });

    return ret;
  }

  const handleSubmit = async () => {
    const validInput = convertTimeformat();
    
    let res;
    try {
      res = await axios.patch(
        '/api/portfolio/certificate',
        {
          certificate: validInput,
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
      await axios.delete("/api/portfolio/certificate", {
        headers: {
          Authorization: getToken(),
        },
        data: {
          id: curId,
        },
      })
    }
    setInput(input.filter(data=>data.id != curId));
  };

  return (
    <CertificateInfoWrapper>
      <Ptag style={{fontWeight: "bold", fontSize: "20px", color:"black"}}>자격증</Ptag>
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