import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlignCenter, PanelLeft, CircleX } from "lucide-react";
import Lottie from "lottie-react";
import water from "./assets/water.json";
import { useContext } from "react";
import { FileContext } from "./FileContext";
// import AddCategoryModal from "./AddCategoryModal";
import CreateCategoryModal from "./CreateCategoryModal";
import {
  CloudUpload,
  FileUp,
  FolderOpen,
  Upload,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import { DragTextContext } from "./DragTextContext";

export default function Home() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [scanned, setscanned] = useState(false);
  const { dragtext, setDragtext } = useContext(DragTextContext);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSafe, setisSafe] = useState(null);
  const [riskLevel, setRiskLevel] = useState(null);
  const [report, setReport] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const { files = [], setFiles } = useContext(FileContext);
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    setDragtext("Drag & drop your files here or click to browse");
  setscanned(false);
  setisSafe(null);
  setReport(null);
  setRiskLevel(null);
  setFiles([]);
}, []);
  //uploading file
  async function uploadFile(file) {
    setDragtext("Uploading file...");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:3000/upload/", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `bearer ${accessToken}`,
        },
      });

      const data = await res.json();
      console.log(data);
      setFiles((prev) => [
        ...prev,
        {
          _id: data.pdf._id,
          name: file.name,
          originalFile: file,
        },
      ]);

      setDragtext("File uploaded and ready for scan");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  function handleChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    uploadFile(file);
  }
  function handledrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    uploadFile(file);
  }

  //scanning file
  function handleScan(e) {
  e.stopPropagation();
  if (!files?.length) return;
  if (!files?.length || loading || scanned) return;

  // بدل ما يبدأ الفحص مباشرة، نفتح مودال الكاتيجوري
  setShowCategoryModal(true);
}
async function startScan() {
  if (!files?.length) return;
  setLoading(true);
  setscanned(false);

  try {
    const currentFile = files[files.length - 1];
    const fileId = currentFile?._id;
    const res = await fetch(`http://localhost:3000/security/scan/${fileId}`, {
      method: "POST",
      headers: {
        Authorization: `bearer ${accessToken}`,
      },
    });
    const data = await res.json();

    setisSafe(data.fileIsSafe);
    setReport(data.updatedFile);
    setRiskLevel(data.updatedFile.security.riskLevel);
    setscanned(true);
    setDragtext("Scan completed");
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
}
const handleNewScan = () => {
  if (inputRef.current) {
   

    // إعادة تهيئة input
    inputRef.current.value = null;

    // listener للملف الجديد
    const handleFileSelected = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setLoading(true);
      setDragtext("Uploading file...");

      try {
        // رفع الملف
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("http://localhost:3000/upload/", {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `bearer ${accessToken}`,
          },
        });
        const data = await res.json();

        const newFile = {
          _id: data.pdf._id,
          name: file.name,
          originalFile: file,
        };

        setFiles([newFile]); // نخليها ملف واحد فقط
        setDragtext("File uploaded, scanning...");

        // عمل scan مباشر
        const scanRes = await fetch(
          `http://localhost:3000/security/scan/${data.pdf._id}`,
          {
            method: "POST",
            headers: { Authorization: `bearer ${accessToken}` },
          }
        );
        const scanData = await scanRes.json();

        setisSafe(scanData.fileIsSafe);
        setReport(scanData.updatedFile);
        setRiskLevel(scanData.updatedFile.security.riskLevel);
        setscanned(true);
        setDragtext("Scan completed");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        // إزالة الـ listener بعد انتهاء المهمة
        inputRef.current.removeEventListener("change", handleFileSelected);
      }
    };

    // إضافة listener قبل فتح نافذة اختيار الملف
    inputRef.current.addEventListener("change", handleFileSelected);
    inputRef.current.click();
  }
};
  const handleCancel = (e) => {
    e.stopPropagation();

    setisSafe(null);
    setscanned(false);
    setFiles([]);

    setDragtext("Drag & drop your files here or click to browse");

    if (inputRef.current) {
      inputRef.current.value = null;
    }
  };

  function handlenavigate(e) {
    e.preventDefault();

    if (!files?.length) return;

    // بنستخدم الـ originalFile اللي خزنناه في الـ uploadFile
    const currentFile = files[files.length - 1];
    const fileToOpen = currentFile.originalFile;
    if (fileToOpen) {
      const fileUrl = URL.createObjectURL(fileToOpen);

      navigate("/Chat", {
        state: {
          fileUrl,
          fileId: currentFile?._id,
          accessToken: accessToken,
        },
      });
    }
  }

  function handledrag(e) {
    e.preventDefault();
    setDragtext("drop your files here ");
  }

  function handledragleave(e) {
    e.preventDefault();
    setDragtext("Drag & drop your files here or click to browse");
  }

  function handleenter(e) {
    e.preventDefault();
    setDragtext("Drop your file here");
  }
useEffect(() => {
  async function fetchCategories() {
    try {
      const res = await fetch("http://localhost:3000/upload/categories", {
        headers: {
          Authorization: `bearer ${accessToken}`,
        },
      });
      const data = await res.json();
setCategories(data.categories || []);console.log("API RESPONSE:", data);        } catch (err) {
      console.error(err);
    }
  }

  fetchCategories();
}, []);
  return (
    
    <div className="homecom">
    {showCategoryModal && (
  <CreateCategoryModal
    categories={categories}   // 👈 IMPORTANT

    file={files[files.length - 1]}   // 👈 مهم جدًا
    accessToken={accessToken}        // 👈 مهم جدًا
    onClose={() => setShowCategoryModal(false)}
    onSave={() => {
      setShowCategoryModal(false);
      startScan(); // دالة جديدة تبدأ الفحص فعليًا بعد اختيار الكاتيجوري
    }}
  />
)}
      <div className="title">
        <PanelLeft size={20} />
        <span>Home</span>
      </div>
      {/* <div style={{width:100,height:100 }}>
              <Lottie animationData={water} speed={0.25} loop={true} className="lottie-water" />
          </div> */}
      <div className="home-content">
        {/* <div className="options">
          <div className="option upload">
            <Upload size={24} />
            <br />
            upload
          </div>
          <div className="option filechat">
            <FileUp size={24} />
            <br /> chat with file
          </div>
          <div className="option folderchat">
            <FolderOpen size={24} />
            <br />
            chat with folder
          </div>
        </div> */}
        <div
          className={`drag 
  ${loading ? "drag-loading" : ""} 
  ${scanned && isSafe ? "drag-safe" : ""} 
  ${scanned && !isSafe ? "drag-unsafe" : ""} 
  ${!scanned && !loading && files.length > 0 ? "drag-prescan" : ""} 
  ${scanned ? "no-hover" : ""}
`}
        >
          {scanned && !loading && (
            <div
              className={`scan-result-text ${isSafe ? "safe" : "unsafe"}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginLeft: "30px",
              }}
            >
              {isSafe ? (
                <>
                  <ShieldCheck size={30} />
                  <span>
                    File name shows no signs of a virus or malware signatures
                  </span>
                </>
              ) : (
                <>
                  <ShieldAlert size={20} />
                  <span>File Contains Malicious Signatures</span>
                </>
              )}
            </div>
          )}

          <div
            style={{ cursor: "pointer" }}
            className={`draginner
               ${scanned ? "draginner-small" : ""}
               ${loading ? "innerloading" : ""}
                 ${files.length > 0 && !scanned && !loading ? "draginner-prescan" : ""}`}
            onClick={() => {
              if (files.length === 0) {
                inputRef.current.click();
              }
            }}
            onDragOver={handledrag}
            onDrop={handledrop}
            onDragEnter={handleenter}
            onDragLeave={handledragleave}
          >
            {/* {loading && (
              <div className="text-center mt-3">
                <div style={{ position: "relative", width: 100, height: 100 }}>
                 
                  <Lottie
                    animationData={water}
                    loop={true}
                    style={{ width: "100%", height: "100%" }}
                  />

               
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",

                      background:
                        "linear-gradient(45deg, #43729F, #6E92AB, #92A8B7)",
                      mixBlendMode: "color", 
                      pointerEvents: "none", 
                      borderRadius: "50%", 
                    }}
                  />
                </div>

                <p>Scanning...</p>
              </div>
            )} */}
{loading && <span className="loader"></span>}
            {/* قبل اختيار أي ملف */}
            {!scanned && !loading && files.length === 0 && (
              <>
                <CloudUpload size={48} color="grey" />
                <div className="dragtext">{dragtext}</div>
              </>
            )}

            {/* بعد اختيار ملف (pre-scan) */}
            {!scanned && !loading && files?.length > 0 && (
              <>
                <div className="dragtext">{dragtext}</div>

                <div className="file-name">
                  {files[files.length - 1]?.name?.length > 20
                    ? files[files.length - 1]?.name.slice(0, 20) + "..."
                    : files[files.length - 1]?.name}
                </div>

                <div className="btns">
                  <button className="cancel-btn" onClick={handleCancel}>
                    Cancel
                  </button>
                  <button className="scan-btn" onClick={handleScan}>
                    Scan Now
                  </button>
                </div>
              </>
            )}

            {/* بعد الـ scan */}
            {scanned && !loading && (
              
              <div className="d-flex flex-column align-items-center gap-3">
                <div className="d-flex gap-3">
                  <button className=" another-scan-btn" onClick={handleNewScan}>
                    scan another file
                  </button>
                  <button
                    className={`summarize-btn ${!isSafe ? "disabled-btn" : ""}`}
                    onClick={handlenavigate}
                    disabled={!isSafe}
                  >
                    Summarize & Discuss
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {scanned && riskLevel && (
          <div
            style={{
              display: "flex",
              flexDirection: "Column",
              gap: "3px",
              fontWeight: "600",
              fontSize: "18px",
            }}
          >
            {riskLevel === 3 ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "2px",
                  fontWeight: "600",
                  fontSize: "18px",
                }}
              >
                <div>Risk Level:</div>
                <div style={{ color: "red" }}>HIGH</div>
              </div>
            ) : (
              "Comprehensive Threat Analysis"
            )}
            {report && (
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setShowReport(!showReport);
                }}
                style={{
                  color: "#113567",
                  textDecoration: "underline",
                  cursor: "pointer",
                  fontSize: "18px",
                  fontWeight: "600",
                }}
              >
                {showReport ? "Hide report" : "View full report"}
              </a>
            )}
          </div>
        )}

        {showReport && report && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div
                style={{ backgroundColor: "#EAEAEA" }}
                className="modal-header"
              >
                <h3 style={{ color: "#113567" }}>Technical Analysis Report</h3>
                <button
                  className="close-btn"
                  onClick={() => setShowReport(false)}
                >
                  <CircleX />
                </button>
              </div>

              <div className="modal-body">
                <div className="report-grid">
                  <div className="report-item">
                    <span>file_id</span> <br />
                    <div>{report?._id}</div>
                  </div>
                  <div className="report-item">
                    <span>file_name</span> <br />
                    <div>{report?.fileName}</div>
                  </div>
                  <div className="report-item">
                    <span>file_path</span> <br />
                    <div>{report?.path}</div>
                  </div>
                  <div className="report-item">
                    <span>scan_status</span> <br />
                    <div>{report?.scanStatus}</div>
                  </div>
                  <div className="report-item">
                    <span>ScanTextSummary</span> <br />
                    <div>{report?.scanTextSummary}</div>
                  </div>
                  <div className="report-item">
                    <span>Risk_Score</span>
                    <span
                      style={{
                        color:
                          report?.security?.riskScore > 70 ? "red" : "green",
                      }}
                    >
                      <br />
                      <div>{report?.security?.riskScore}%</div>
                    </span>
                  </div>
                  <div className="report-item">
                    <span>Malware_Analysis</span> <br />
                    <div>{report?.security?.malwareRisk}</div>
                  </div>
                  <div className="report-item">
                    <span>Prompt_Injection</span> <br />
                    <div> {report?.security?.promptInjectionRisk}</div>
                  </div>
                  <div className="report-item">
                    <span>Content_Moderation</span> <br />{" "}
                    <div>{report?.security?.contentModeration}</div>
                  </div>
                  <div className="report-item">
                    <span>Risk_Label</span> <br />
                    <div>{report?.security?.riskLabel}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* input */}
        <input
          type="file"
          ref={inputRef}
          hidden
          onChange={(e) => {
            console.log("📁 file selected", e.target.files);
            handleChange(e);
          }}
        />
      </div>
    </div>
  );
}