import React from "react";

//editMode일 시 input tag, 아닐 시 p tag 리턴
export const PinputTag = ({ handleChange, editMode, data, tag_name }) => {
  if (editMode)
    return <input name={tag_name} value={data} onChange={handleChange} />;
  else return <p>{data}</p>;
};

//editMode일 시 update, create버튼 리턴, 아닐 시 edit버튼 리턴
export const ButtonTag = ({ editMode, handleEdit, handleSubmit, handleCreate }) => {
  if (editMode)
    return (
      <div>
        <button onClick={handleSubmit}>
          <img />
          submit
        </button>
        {handleCreate && (
          <button onClick={handleCreate}>
            <img />
            create
          </button>
        )}
      </div>
    );
  else
    return (
      <div>
        <button onClick={handleEdit}>
          <img src="" />
          edit
        </button>
      </div>
    );
};