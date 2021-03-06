import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TopNav from "../Utility/topNav";
import { useLocation } from "react-router-dom";
import SideNav from "../Utility/sideNav";
import { API_URI } from "../Network/config";
import Modal from "react-modal";

let global_id = 0;
let global_item = 0;
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
  },
};
var arr = [];
export default function Project() {
  let data = useLocation();

  // console.log(data.state.data.id)

  const handleDocument = (x) => {
    localStorage.setItem(
      "pdfIndex",
      data.state.data.pdf_documents.findIndex((el) => el.id === x.id)
    );
    localStorage.setItem("pdfurl", x.url);
    localStorage.setItem("pdf_document_id", x.id);
    localStorage.setItem("project_id", x.project_id);
    const document_id = x.id;
    const project_id = x.project_id;
    console.log(document_id);
    console.log(project_id);
  };

  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalIsOpen1, setIsOpen1] = useState(false);
  const [file, setFile] = useState();
  const [otherMail, setOtherMail] = useState();
  const [project, setProject] = useState();
  const [folder, setFolder] = useState([]);
  const [name, setName] = useState();
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false);
  const [testid, setTestid] = useState("");
  const [testitem, setTestitem] = useState("");
  const [folder12, setFolder12] = useState([]);
  useEffect(() => {
    getFolderList();
  }, []);

  function handleRemove(id, item) {
    const newList = folder.filter((x) => x.id !== id);
    setFolder(newList);
    console.log(id);
    console.log(item);
    const identity = item.project_id;
    axios
      .delete(`${API_URI}/documents/${id}?project_id=${identity}`, {
        headers: {
          Authorization: localStorage.getItem("tbztoken"),
        },
      })
      .then((result) => {
        if (result.status === 200) {
          getFolderList();
          console.log(result.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const handleSubmit1 = (e) => {
    e.preventDefault();
    console.log(otherMail);
    const user_reqid = otherMail;
    const user_ids = user_reqid.split(",");
    const document_id = global_id;
    const project_id = global_item.project_id;
    console.log(document_id, project_id);
    axios
      .post(
        `${API_URI}/documents/${document_id}/share?project_id=${project_id}`,
        {
          user_ids,
          document_id,
          project_id,
        },
        {
          headers: {
            Authorization: localStorage.getItem("tbztoken"),
          },
        }
      )
      .then((result) => {
        if (result.status === 200) {
          console.log(result.data);
          setOtherMail("");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    setLoader(true);
    var formData = new FormData();

    formData.append("document[document]", file);
    formData.append("project_id", data?.state?.data?.id);
    formData.append("document[name]", name);

    axios
      .post(`${API_URI}/documents`, formData, {
        headers: {
          Authorization: localStorage.getItem("tbztoken"),
        },
      })
      .then((result) => {
        if (result.status === 200) {
          setLoader(false);
          setMessage("File Uploaded Successfully");
          getFolderList();
          closeModal();

          // localStorage.setItem('pdfurl', result.data.data.url)
          // setRedirect(true)
        }
      })
      .catch((error) => {
        console.log(error);
        setLoader(false);
      });
    setLoader(false);
  };

  const getFolderList = async () => {
    axios
      .get(`${API_URI}/projects`, {
        headers: {
          Authorization: localStorage.getItem("tbztoken"),
        },
      })
      .then((result) => {
        if (result.status === 200) {
          setFolder(
            result.data.data.filter((x) => x.id === data.state.data.id)
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }
  function openModal1(id, item) {
    setIsOpen1(true);
    global_id = id;
    global_item = item;
  }

  function closeModal1() {
    setIsOpen1(false);
    global_id = 0;
    global_item = 0;
  }

  return (
    <div>
      <TopNav />
      <div className="row">
        <div className="col-1"></div>
        <div className="col-11">
          <div className="mt-4">
            <h4>Create New Document</h4>
            <div className="col-2">
              <img
                src="/edit-icon.png"
                onClick={openModal}
                style={{ width: "100px", height: "100px" }}
              />
              <br />
              <div style={{ marginLeft: "1%", marginTop: "3px" }}>
                <label
                  onClick={openModal}
                  style={{ color: "black", textDecoration: "none" }}
                  className=""
                >
                  Create New
                </label>
              </div>
            </div>
          </div>
          <hr />
          <div className="mt-4">
            <h4>Exsiting Documents</h4>

            {
              <div className="row mt-2">
                {folder[0]?.pdf_documents.map((x) => {
                  return (
                    <div className="col-2">
                      <a href="/annotator" onClick={() => handleDocument(x)}>
                        <img
                          src="/word-icon.png"
                          style={{ width: "100px", height: "100px" }}
                        />
                      </a>
                      <br />
                      <div style={{ marginLeft: "1%", marginTop: "3px" }}>
                        <a
                          href="/annotator"
                          style={{ color: "black", textDecoration: "none" }}
                          onClick={() => handleDocument(x)}
                          className=""
                        >
                          {x.name}
                        </a>
                        <br />
                        <button
                          type="button"
                          onClick={() => openModal1(x.id, x)}
                          style={{padding:"2%", margin: "1%"}}
                        >
                          Share
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemove(x.id, x)}
                          style={{padding:"2%", margin: "1%"}}
                        >
                          Remove{" "}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            }
          </div>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div
          className="col-12"
          style={{ border: "3px solid #DDE0E3", padding: "10px" }}
        >
          <h4>Upload Document</h4>
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Document Name"
                name="name"
                onChange={(e) => setName(e.target.value)}
                className="form-control mt-2 mb-3"
                required
              />
              <input
                onChange={(e) => setFile(e.target.files[0])}
                className="form-control mt-2 mb-3"
                type="file"
                required
              />
              <button
                className="btn btn-outline-secondary mt-2"
                style={{ marginRight: "10px" }}
                type="submit"
              >
                {loader ? "Loading" : "Upload"}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary float-right mt-2 mr-2"
                onClick={closeModal}
              >
                close
              </button>
            </div>
            {<div className="mt-1 mb-3">{message}</div>}
          </form>
        </div>
      </Modal>
      <Modal
        isOpen={modalIsOpen1}
        onRequestClose={closeModal1}
        style={customStyles}
        contentLabel="Example Modal"
        style={{overflowY:"scroll"}}
      >
        <div
          className="col-12"
          style={{ border: "3px solid #DDE0E3", padding: "10px", height:"100%"}}
        >
          <h4>Share Tanzabook</h4>
          <form onSubmit={(e) => handleSubmit1(e)}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Enter The User ID of That Person"
                name="emailShare"
                onChange={(e) => {
                  setOtherMail(e.target.value);
                  axios
                    .get(`${API_URI}/users?search=${e.target.value}`, {
                      headers: {
                        Authorization: localStorage.getItem("tbztoken"),
                      },
                    })
                    .then((result) => {
                      if (result.status === 200) {
                        arr = result.data.data.map(
                          (x) => x.email + "(" + x.id + ")"
                        );
                        console.log(arr);
                        setFolder12(arr);
                      }
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                }}
                className="form-control mt-2 mb-3"
              />
              <button
                className="btn btn-outline-secondary mt-2"
                style={{ marginRight: "10px" }}
                type="submit"
              >
                Update
              </button>
            </div>
          </form>
          <br/>
          {folder12.map((x) => {
            return (
              <div>
                <li>{x}</li>
              </div>
            );
          })}
          {/* <div id="abc" style={{width:"100%"}}>Available ID: [{arr}]</div> */}
        </div>
      </Modal>
    </div>
  );
}
