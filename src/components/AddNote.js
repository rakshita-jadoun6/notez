import React, { useContext, useState } from "react";
import noteContext from "../context/notes/noteContext";

const AddNote = (props) => {
  const context = useContext(noteContext);
  const { addNote } = context;
  
  const [note,setNote]=useState({title:"",description:"",tag:""})

  const handleClick = (e) => {
    e.preventDefault();
    addNote(note.title,note.description,note.tag)
    setNote({title: "", description: "", tag: ""})
    props.showAlert("Added Succesfully","success")
  };

  const onChange=(e)=>{
    setNote({...note,[e.target.name]:e.target.value})

  }
  return (
    <div className="container my-3">
      <h2>Add a note</h2>
      <form className="my-3 add-note">
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            onChange={onChange}
            value={note.title}
            minLength={3} required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
            <input
              type="text"
              className="form-control"
              id="description"
              name="description"
              onChange={onChange}
              value={note.description}
              minLength={5} required
            />
        </div>
        <div className="mb-3">
          <label htmlFor="tag" className="form-label">
            Tag
          </label>
            <input
              type="text"
              className="form-control"
              id="tag"
              name="tag"
              onChange={onChange}
              value={note.tag}
            />
        </div>
        <button disabled={note.title.length<3 || note.description.length<5} type="submit" className="btn btn-dark" onClick={handleClick}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddNote;
