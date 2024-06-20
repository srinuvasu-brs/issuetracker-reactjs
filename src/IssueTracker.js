import React, { useState, useEffect, useRef } from 'react';
import './IssueTracker.css';

const priorityList = ["Low", "Medium", "High"];
const assignedToList = ["Edwin", "Tom", "Carl", "Jerome", "Carmelo"];

function IssueTracker() {
  const [storyList, setStoryList] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedto, setAssignedTo] = useState('');
  const [priority, setPriority] = useState('');
  const [descrptionLength, setDescrptionLength] = useState('');
  const titleInputRef = useRef(null);
  const descriptionInputRef = useRef(null);
  const assignedToInputRef = useRef(null);
  const priorityInputRef = useRef(null);

  const maxLength = 100;
  const warnLength = 90;

  useEffect(() => {
    const storedList = JSON.parse(localStorage.getItem("storyList"));
    if (storedList) {
      setStoryList(storedList);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("storyList", JSON.stringify(storyList));
  }, [storyList]);

  const textCounter = () => {
    let count = description.length;
    setDescrptionLength(`${maxLength - count} characters left`);
    if (count === 0) {
      setDescrptionLength(`${maxLength} characters left`);
    }

    if (count > maxLength) {
      setDescription(description.substring(0, maxLength));
      count--;
    }
    if (count > warnLength) {
      setDescrptionLength(`${maxLength - count} characters left`);
    }
  };

  const formValidate = (e) => {
    e.preventDefault();
    if (title === "") {
      alert("Please enter title");
      titleInputRef.current.focus();
      return;
    }
    if (description === "") {
      alert("Please enter description");
      descriptionInputRef.current.focus();
      return;
    }
    if (description.length < 60 || description.trim().length < 60) {
      alert("Description should be at least 60 characters");
      descriptionInputRef.current.focus();
      return;
    }
    if (assignedto === "") {
      alert("Please select assigned to");
      assignedToInputRef.current.focus();
      return;
    }
    if (priority === "") {
      alert("Please select priority");
      priorityInputRef.current.focus();
      return;
    }
    const newStory = {
      id: "id" + Math.random().toString(16).slice(2), //generate id
      description: description,
      assignedTo: assignedto,
      priority: priority,
      title: title,
      storyStatus: "open",
    };
    setStoryList([...storyList, newStory]);
    setDescription('');
    setAssignedTo('');
    setPriority('');
    setDescrptionLength('');
    setTitle('');
  };

  const closeStory = (storyId) => {
    const updatedList = storyList.map((story) =>
      story.id === storyId ? { ...story, storyStatus: "closed" } : story
    );
    setStoryList(updatedList);
  };

  const deleteStory = (storyId) => {
    const updatedList = storyList.filter((story) => story.id !== storyId);
    setStoryList(updatedList);
  };

  return (
    <main role="main" className="container pt-5 pb-5">
      <section>
        <h2 className="display-6 pb-2">Create Agile Story</h2>
        <form onSubmit={formValidate}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">Task Title</label>
            <input ref={titleInputRef} type="text" id="title" className="form-control mb-3" maxLength="50" placeholder="enter title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <label htmlFor="description" className="form-label">Task Description</label>
            <textarea ref={descriptionInputRef}className="form-control" cols="60" rows="3" placeholder="enter task description" id="description" value={description} onChange={(e) => { setDescription(e.target.value); textCounter(); }} />
            <div className="form-text">{descrptionLength}</div>
          </div>
          <div className="mb-3">
            <label htmlFor="assignedto" className="form-label">Assigned To</label>
            <select ref={assignedToInputRef}className="form-control" id="assignedto"  value={assignedto} onChange={(e) => setAssignedTo(e.target.value)}>
              <option value="" disabled>Select assigned to</option>
              {assignedToList.map((name, index) => (
                <option key={index} value={index}>{name}</option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="priority" className="form-label">Priority</label>
            <select ref={priorityInputRef}className="form-control" id="priority"  value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="" disabled>Select priority</option>
              {priorityList.map((value, index) => (
                <option key={index} value={index}>{value}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Create Agile Story</button>
        </form>
      </section>
      <section className="pt-5">
        <div id="storyCardList" className="row g-2">
          {storyList.length > 0 ? storyList.map((issue) => (
            <div key={issue.id} className="col-4">
              <div className="p-3">
                <div className="card">
                  <div className="card-header">Priority: {priorityList[issue.priority]} <span className={`mx-4 badge ${issue.storyStatus === "open" ? "bg-primary" : "bg-danger"}`}>{issue.storyStatus === "open" ? "open" : "closed"}</span></div>
                  <div className="card-body">
                    <h4>Title : {issue.title}</h4>
                    <p className="text-start pb-1">Assigned to : {assignedToList[issue.assignedTo]}</p>
                    <p className="card-text text-start">{issue.description}</p>
                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                      {issue.storyStatus === "closed" ? null :
                        <button type="button" className="btn btn-primary" onClick={() => closeStory(issue.id)} data-bs-toggle="tooltip" data-bs-placement="top" title="close story">Close</button>
                      }
                      <button type="button" className="btn btn-danger" onClick={() => deleteStory(issue.id)} data-bs-toggle="tooltip" data-bs-placement="top" title="delete story">Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )) :
            <div>
              <h2 className="display-6 pb-2">Story List</h2>
              <p className="p-5">No story to display</p>
            </div>
          }
        </div>
      </section>
    </main>
  );
}

export default IssueTracker;