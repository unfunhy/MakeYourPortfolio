import React, {useState} from "react";
import styled from "styled-components";

const PinputTag = ([handleChange, editMode, value, tag_name]) => {
    if (editMode)
        return <input name={tag_name} value={value} onChange={handleChange} />
    else
        return <p>{value}</p>
};

const ButtonTag = (editMode, handleEdit, handleSubmit, handleCreate) => {
    if (editMode)
        return (
            <div>
                <botton onClick={handleSubmit}>
                    <img />
                </botton>
                {handleCreate &&
                    <button onClick={handleCreate}>
                        <img />
                    </button>
                }
            </div>
        );
    else
        return (
            <div>
                <button onClick={handleEdit}>
                    <img src="" />
                </button>
            </div>
        );
}

const Profile = ({canEdit, data, username}) => {
  console.log(canEdit, data, username);
  const [editMode, setEditMode] = useState(false);
  const [input, setInput] = useState({});

  const handleEdit = () => setEditMode(true);
  
  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setInput({
        ...input,
        [name]: value
    });
  };
  
  const handleSubmit = () => {

  };

  return (
    <div>
      <input type="image" />
      <form onSubmit={handleSubmit}>
        <p>{username}</p>
        <PinputTag props={[handleChange, editMode, data, "introduce"]} />
        {canEdit &&
            <ButtonTag props={[editMode, handleEdit, handleSubmit]} />
        }
      </form>
    </div>
  );
};

export default Profile;