// @flow
/* eslint import/no-webpack-loader-syntax: 0 */

import React, { Component } from "react";
import PDFWorker from "worker-loader!pdfjs-dist/lib/pdf.worker";

import {
  PdfLoader,
  PdfHighlighter,
  Tip,
  Highlight,
  Popup,
  AreaHighlight,
  setPdfWorker
} from "react-pdf-highlighter";

import testHighlights from "./test-highlights";

import Spinner from "./Spinner";
import Sidebar from "./Sidebar";

import { Recorder } from 'react-voice-recorder'
import 'react-voice-recorder/dist/index.css'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import type {
  T_Highlight,
  T_NewHighlight
} from "react-pdf-highlighter/src/types";

import "./style/App.css";
import TopNav from "../Utility/topNav";
import { Link } from 'react-router-dom'
import axios from "axios";
import { API_URI } from "../Network/config";

setPdfWorker(PDFWorker);

type Props = {};

type State = {
  url: string,
  highlights: Array<T_Highlight>,
  record: Boolean,
  uploadType: string,
  audioDetails: any,
  setAudioFile: any,
  recordedFile: any,
  annotation_id: any,
  fileAnnotations: any,
  play: Boolean,
  v3: any,
  mp3: any
};

const getNextId = () => String(Math.random()).slice(2);

const parseIdFromHash = () =>
  document.location.hash.slice("#highlight-".length);

const resetHash = () => {
  document.location.hash = "";
};

const HighlightPopup = ({ comment }) =>
  comment.text ? (
    <div className="Highlight__popup">
      {comment.emoji} {comment.text}
    </div>
  ) : null;

const PRIMARY_PDF_URL = localStorage.getItem('pdfurl')
// const PRIMARY_PDF_URL = "https://testing-buckettt.s3-us-east-2.amazonaws.com/tanzabook/pdf_documents/5/1/testprint.pdf";
// const SECONDARY_PDF_URL = "https://arxiv.org/pdf/1604.02480.pdf";

const searchParams = new URLSearchParams(document.location.search);

const initialUrl = searchParams.get("url") || PRIMARY_PDF_URL;

class App extends Component<Props, State> {
  state = {
    url: initialUrl,
    // set Exsiting url
    // highlights: testHighlights[initialUrl]
    //   ? [...testHighlights[initialUrl]]
    //   : []
    highlights: [],
    uploadType: "record",
    audioDetails: {
      url: null,
      blob: null,
      chunks: null,
      duration: {
        h: 0,
        m: 0,
        s: 0
      }
    },
    setAudioFile: "",
    recordedFile: "",
    annotation_id: "",
    fileAnnotations: "",
    play: false,
    v3: '',
    mp3: ''
  };

  state: State;


  resetHighlights = () => {
    this.setState({
      highlights: []
    });
  };

  toggleDocument = () => {
    const newUrl =
      //toogle pdf url
      // this.state.url === PRIMARY_PDF_URL ? SECONDARY_PDF_URL : PRIMARY_PDF_URL;
      this.state.url === PRIMARY_PDF_URL
    this.setState({
      url: newUrl,
      // default highlights
      highlights: testHighlights[newUrl] ? [...testHighlights[newUrl]] : []
    });
  };

  scrollViewerTo = (highlight: any) => { };

  scrollToHighlightFromHash = () => {
    const highlight = this.getHighlightById(parseIdFromHash());

    if (highlight) {
      this.scrollViewerTo(highlight);
    }
  };

  componentDidMount() {

    window.addEventListener(
      "hashchange",
      this.scrollToHighlightFromHash,
      false
    );
    this.getAnnotations()
    toast.warn('Please Select Upload Type!', {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  getAnnotations() {
    axios.get(`${API_URI}/projects`, {
      headers: {
        'Authorization': localStorage.getItem('tbztoken')
      }
    }).then(result => {
      if (result.status === 200) {

        let data = result.data.data.filter(el => el.id === parseInt(localStorage.getItem('project_id')))

        let annotationArray = data[0].pdf_documents.map(x => x.annotations)

        let data2 = annotationArray.map(y => { return y })

        let ind = localStorage.getItem('pdfIndex')

        let v1 = data2[ind].map(x => { return x.json_data })

        this.setState({
          v3: data2[ind]
        })

        let v2 = v1.map(x => {
          return {
            content: {
              text: x?.content?.text
            },
            position: {
              boundingRect: {
                x1: parseFloat(x?.position?.boundingRect.x1),
                y1: parseFloat(x?.position?.boundingRect.y1),
                x2: parseFloat(x?.position?.boundingRect.x2),
                y2: parseFloat(x?.position?.boundingRect.y2),
                width: parseFloat(x?.position?.boundingRect.width),
                height: parseFloat(x?.position?.boundingRect.height)
              },
              rects: [
                {
                  x1: parseFloat(x?.position?.rects.x1),
                  y1: parseFloat(x?.position?.rects.y1),
                  x2: parseFloat(x?.position?.rects.x2),
                  y2: parseFloat(x?.position?.rects.y2),
                  width: parseFloat(x?.position?.rects.width),
                  height: parseFloat(x?.position?.rects.height)
                },
                {
                  x1: parseFloat(x?.position?.boundingRect.x1),
                  y1: parseFloat(x?.position?.boundingRect.y1),
                  x2: parseFloat(x?.position?.boundingRect.x2),
                  y2: parseFloat(x?.position?.boundingRect.y2),
                  width: parseFloat(x?.position?.boundingRect.width),
                  height: parseFloat(x?.position?.boundingRect.height)
                }
              ],
              pageNumber: parseFloat(x?.position?.pageNumber)
            },
            comment: {
              text: x?.comment?.text,
              audio: x?.comment?.audio
            },
            id: x?.id
          }
        })

        this.setState({
          highlights: v2
        })

      }
    }).catch(error => {
      console.log(error)
    })
  }

  getHighlightById(id: string) {
    const { highlights } = this.state;

    return highlights.find(highlight => highlight.id === id);
  }

  addHighlight(highlight: T_NewHighlight) {
    const { highlights } = this.state;

    console.log("Saving highlight", highlight);

    var id = getNextId()

    axios.put(`${API_URI}/annotations/${this.state.annotation_id}`,
      {
        "document_id": localStorage.getItem('pdf_document_id'),
        "annotation_json": {
          "content": {
            "text": highlight?.content?.text
          },
          "position": {
            "boundingRect": {
              "x1": highlight?.position?.boundingRect?.x1,
              "y1": highlight?.position?.boundingRect?.y1,
              "x2": highlight?.position?.boundingRect?.x2,
              "y2": highlight?.position?.boundingRect?.y2,
              "width": highlight?.position?.boundingRect?.width,
              "height": highlight?.position?.boundingRect?.height
            },
            "rects": [
              {
                "x1": highlight?.position?.rects?.x1,
                "y1": highlight?.position?.rects?.y1,
                "x2": highlight?.position?.rects?.x2,
                "y2": highlight?.position?.rects?.y2,
                "width": highlight?.position?.rects?.width,
                "height": highlight?.position?.rects?.height
              },
              {
                "x1": highlight?.position?.rects?.x1,
                "y1": highlight?.position?.rects?.y1,
                "x2": highlight?.position?.rects?.x2,
                "y2": highlight?.position?.rects?.y2,
                "width": highlight?.position?.rects?.width,
                "height": highlight?.position?.rects?.height
              }
            ],
            "pageNumber": highlight?.position?.pageNumber
          },
          "comment": {
            "audio": this.state.recordedFile
          },
          "id": id
        }
      }
      , {
        headers: {
          'Authorization': localStorage.getItem('tbztoken')
        }
      }).then((res) => {
        window.location.reload()
      })

    this.setState({
      highlights: [{ ...highlight, id: id }, ...highlights]
    });
  }

  updateHighlight(highlightId: string, position: Object, content: Object) {
    console.log("Updating highlight", highlightId, position, content);

    this.setState({
      highlights: this.state.highlights.map(h => {
        const {
          id,
          position: originalPosition,
          content: originalContent,
          ...rest
        } = h;
        return id === highlightId
          ? {
            id,
            position: { ...originalPosition, ...position },
            content: { ...originalContent, ...content },
            ...rest
          }
          : h;
      })
    });
  }

  handleAudioStop(data) {
    // console.log(data)
    this.setState({ audioDetails: data });
  }
  handleAudioUpload(file, content, position, comment) {

    let formData = new FormData()

    formData.append('annotations[file]', file)
    formData.append('document_id', localStorage.getItem('pdf_document_id'))

    axios.post(`${API_URI}/annotations`, formData, {
      headers: {
        'Authorization': localStorage.getItem('tbztoken')
      }
    }).then(result => {
      if (result.status === 200) {
        console.log(result.data.data)
        this.setState({ recordedFile: result.data.data.url, annotation_id: result.data.data.id });
        this.addHighlight({ content, position, comment });
        // window.location.reload()
      }
    }).catch(error => {
      console.log(error)
    })


  }
  handleReset() {
    const reset = {
      url: null,
      blob: null,
      chunks: null,
      duration: {
        h: 0,
        m: 0,
        s: 0
      }
    };
    this.setState({ audioDetails: reset });
  }


  handleUploadType(type) {
    this.setState({ uploadType: type })
  }

  handleUpload(content, position, comment) {

    let formData = new FormData()

    formData.append('annotations[file]', this.state.setAudioFile)
    formData.append('document_id', localStorage.getItem('pdf_document_id'))

    axios.post(`${API_URI}/annotations`, formData, {
      headers: {
        'Authorization': localStorage.getItem('tbztoken')
      }
    }).then(result => {
      if (result.status === 200) {
        console.log(result.data.data)
        this.setState({ recordedFile: result.data.data.url, annotation_id: result.data.data.id });
        this.addHighlight({ content, position, comment });
        // window.location.reload()
      }
    }).catch(error => {
      console.log(error)
    })

    // this.addHighlight({ content, position, comment });
  }

  togglePlay = (audio, type) => {

    let file

    if (type === "play") {
      file = new Audio(audio)
      this.setState({ mp3: file })
    } else {
      file = this.state.mp3
    }

    this.setState({ play: !this.state.play }, () => {

      this.state.play ? file.play() : file.pause();
    });
  }



  render() {
    const { url, highlights, uploadType, audioDetails } = this.state;
    return (
      <div>
        <ToastContainer />
        <TopNav />
        <div>
          {/* <div>
            <Link to="/welcome">Back</Link>
          </div> */}
          <div className="App" style={{ display: "flex", height: "100vh", width: "100wh" }}>

            <div
              style={{
                height: "100vh",
                width: "75vw",
                position: "relative"
              }}
            >
              <PdfLoader url={url} beforeLoad={<Spinner />}>
                {pdfDocument => (
                  <PdfHighlighter
                    pdfDocument={pdfDocument}
                    enableAreaSelection={event => event.altKey}
                    onScrollChange={resetHash}
                    // pdfScaleValue="page-width"
                    scrollRef={scrollTo => {
                      this.scrollViewerTo = scrollTo;

                      this.scrollToHighlightFromHash();
                    }}
                    onSelectionFinished={(
                      position,
                      content,
                      hideTipAndSelection,
                      transformSelection
                    ) => (

                      <div>
                        <div className="btn dropdown">
                          {/* <button type="button" className="btn dropbtn">Select One</button>
                            <div className="dropdown-content">
                              <button type="button" className="btn" onClick={() => this.handleUploadType("upload")}>Upload Audio</button>
                              <button type="button" className="btn" onClick={() => this.handleUploadType("record")}>Record Audio</button>
                            </div> */}
                          {
                            uploadType === "upload" && (
                              <div className="form-group">
                                <input className="form-control mt-1 mb-2" type="file" name="audio" onChange={(e) => this.setState({ setAudioFile: e.target.files[0] })} />
                                <button type="button" onClick={() => this.handleUpload(content, position, this.state.uploadType)}>Save</button>
                              </div>
                            )
                          }
                          {
                            uploadType === "record" && (
                              <div >
                                <Recorder
                                  record={true}
                                  title={""}
                                  audioURL={audioDetails.url}
                                  showUIAudio
                                  handleAudioStop={data => this.handleAudioStop(data)}
                                  handleAudioUpload={data => this.handleAudioUpload(data, content, position, "test")}
                                  handleReset={() => this.handleReset()}
                                  mimeTypeToUseWhenRecording={`audio/webm`} // For specific mimetype.
                                />

                              </div>
                            )
                          }

                        </div>
                        {/* <Tip
                      onOpen={transformSelection}
                      onConfirm={comment => {
                        this.addHighlight({ content, position, comment });
                        hideTipAndSelection();
                      }}
                    /> */}
                      </div>


                    )}
                    highlightTransform={(
                      highlight,
                      index,
                      setTip,
                      hideTip,
                      viewportToScaled,
                      screenshot,
                      isScrolledTo
                    ) => {
                      const isTextHighlight = !Boolean(
                        highlight.content && highlight.content.image
                      );

                      const component = isTextHighlight ? (
                        <div >
                          <Highlight
                            isScrolledTo={isScrolledTo}
                            position={highlight.position}
                            comment={highlight.comment}
                            onMouseOver={() => {
                              this.togglePlay(highlight?.comment?.audio, 'play')
                            }}
                            onMouseOut={() => {
                              this.togglePlay(highlight?.comment?.audio, 'pause')
                            }}
                            className="Highlight__part"
                          />
                        </div>
                      ) : (
                        <AreaHighlight
                          isScrolledTo={isScrolledTo}
                          highlight={highlight}
                          onChange={boundingRect => {
                            this.updateHighlight(
                              highlight.id,
                              { boundingRect: viewportToScaled(boundingRect) },
                              { image: screenshot(boundingRect) }
                            );
                          }}
                        />
                      );

                      return (
                        <Popup
                          popupContent={<HighlightPopup {...highlight} />}
                          onMouseOver={popupContent =>
                            setTip(highlight, highlight => popupContent)
                          }
                          onMouseOut={hideTip}
                          key={index}
                          children={component}
                        />
                      );
                    }}
                    highlights={highlights}
                  />
                )}
              </PdfLoader>
            </div>
            <Sidebar
              highlights={highlights}
              resetHighlights={this.resetHighlights}
              toggleDocument={this.toggleDocument}
              setType={(type) => this.handleUploadType(type)}
              uploadType={this.state.uploadType}
              v3={this.state.v3}
            />
          </div>
        </div>
      </div>

    );
  }
}

export default App;
