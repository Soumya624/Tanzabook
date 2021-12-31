// @flow

import axios from "axios";
import React from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import type { T_Highlight } from "react-pdf-highlighter/src/types";
import { API_URI } from "../Network/config";
type T_ManuscriptHighlight = T_Highlight;

type Props = {
  highlights: Array<T_ManuscriptHighlight>,
  resetHighlights: () => void,
  toggleDocument: () => void,
  setType: () => void,
  uploadType: () => viod,
  v3: () => void
};

const updateHash = highlight => {
  document.location.hash = `highlight-${highlight.id}`;
};




function Sidebar({ highlights, toggleDocument, resetHighlights, setType, uploadType, v3 }: Props) {

  const onDelete = (data) => {

    let x = v3.filter(x => { return x.json_data?.id === data?.id }).map(x => { return x.id })

    console.log(x[0])

    axios.post(`${API_URI}/delete_annotation/${x[0]}`,
      {
        document_id: `${localStorage.getItem('pdf_document_id')}`
      }
      , {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('tbztoken')
        },

      })
      .then(() => {
        toast.success('Deleted!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setTimeout(() => {
          window.location.reload()
        }, 3000)
      }).catch(() => {
        toast.warn('Failed!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })

  }

  return (
    <div className="sidebar" style={{ width: "25vw" }}>
      <div className="description" style={{ padding: "1rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Annoataions</h2>
        <ToastContainer />
        <div>
          <h5>Set Audio Type</h5>
          <div className="row">
            <div className="form-group p-1 col-4">
              <label className="m-1">Upload</label>
              <input type="radio" name="type" onClick={() => setType('upload')} value="upload" checked={uploadType === "upload" && "checked"} />
            </div>
            <div className="form-group p-1 col-6">
              <label className="m-1">Record</label>
              <input type="radio" name="type" onClick={() => setType('record')} value="record" checked={uploadType === "record" && "checked"} />
            </div>
          </div>
        </div>

        {/* <p style={{ fontSize: "0.7rem" }}>
          <a href="https://github.com/agentcooper/react-pdf-highlighter">
            Open in GitHub
          </a>
        </p> */}

        <p>
          <small>
            To create area highlight hold ⌥ Option key (Alt), then click and
            drag.
          </small>
        </p>
      </div>

      <ul className="sidebar__highlights">
        {highlights.map((highlight, index) => (
          <li
            key={index}
            className="sidebar__highlight"
            onClick={() => {
              updateHash(highlight);
            }}
          >
            <div>
              <strong>{highlight.comment.text}</strong>
              {highlight.content.text ? (
                <div className="row">
                  <div className="col-8">
                    <blockquote style={{ marginTop: "0.3rem" }}>
                      {`${highlight.content.text.slice(0, 90).trim()}…`}
                    </blockquote>
                  </div>
                  <div className="col-4">
                    <input type="button" value="Delete" className="btn btn-outline-secondary btn-sm" onClick={() => onDelete(highlight)} />
                  </div>
                </div>

              ) : null}
              {highlight.content.image ? (
                <div
                  className="highlight__image"
                  style={{ marginTop: "0.5rem" }}
                >
                  <img src={highlight.content.image} alt={"Screenshot"} />
                </div>
              ) : null}
            </div>
            <div className="highlight__location">
              Page {highlight.position.pageNumber}
            </div>
          </li>
        ))}
      </ul>
      {/* <div style={{ padding: "1rem" }}>
        <button onClick={toggleDocument}>Toggle PDF document</button>
      </div> */}
      {highlights.length > 0 ? (
        <div style={{ padding: "1rem" }}>
          <button onClick={resetHighlights}>Reset highlights</button>
        </div>
      ) : null}
    </div>
  );
}

export default Sidebar;
