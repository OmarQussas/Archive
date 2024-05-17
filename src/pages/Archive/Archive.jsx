import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css"; // Import CSS for annotation layer
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
// import PdfViewer from "../../components/PdfViewer/PdfViewer";
import { DatePicker } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import axios from "axios";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getAllDirectories, getAllSubjects } from "../../apis/index";
import { DOMAIN, TOKEN } from "../../config";

export default function Archive() {
  const [pdfFile, setPdfFile] = useState([]);
  const [pdfUrl, setPdfUrl] = useState(""); // New state to hold the URL of the PDF file
  const [iframeSrc, setIframeSrc] = useState("");
  const [directories, setDirectories] = useState("");
  const [subjects, setSubjects] = useState("");
  const [archiveErrMsg, setArchiveErrMsg] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [newDirectory, setNewDirectory] = useState("");
  const [code, setCode] = useState(""); // Add state for الكود
  const [images, setImages] = useState("");
  const navigate = useNavigate();
  const [imageUrls, setImageUrls] = useState([]);
  const [aboutFetchedSubjects, setAboutFetchedSubjects] = useState("");
  const [aboutInput, setAboutInput] = useState("");
  const [chosenDirectoryInAbout, setChosenDirectoryInAbout] = useState("");
  const [chosenSubjectInAbout, setChosenSubjectInAbout] = useState("");
  const [allFetchedAbouts, setAllFetchedAbouts] = useState("");
  const [fetchedAboutsBySubject, setFetchedAboutsBySubject] = useState("");

  function navigateSearch() {
    navigate("/search");
  }

  useEffect(() => {
    if (!TOKEN) {
      window.location.reload();
    }
  }, []);

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;
    const filesArray = Array.from(selectedFiles);

    // Check if any files are selected
    if (filesArray.length > 0) {
      const pdfFiles = [];
      const newImageUrls = [];

      filesArray.forEach((file) => {
        if (file.type === "application/pdf") {
          // If the file is a PDF
          const reader = new FileReader();
          reader.onload = () => {
            let pdfData = reader.result;
            setPdfFile(pdfData);

            // Convert ArrayBuffer to Blob
            const blob = new Blob([pdfData], { type: "application/pdf" });

            // Create a URL from Blob and set it to pdfUrl state
            const url = URL.createObjectURL(blob);
            setPdfUrl(url);
            setImages([]); // Clear images if PDF file is selected
            setIframeSrc(url); // Set iframe source to PDF URL
          };
          reader.readAsArrayBuffer(file);

          pdfFiles.push(file);
        } else if (file.type.startsWith("image/")) {
          // If the file is an image
          const imageUrl = URL.createObjectURL(file);
          newImageUrls.push(imageUrl);
          setPdfUrl(""); // Clear pdfFile if images are selected
          setIframeSrc(imageUrl); // Set iframe source to image URL
        }
      });

      // Set the files array to the formik field
      // Assuming formik is defined outside the component
      formik.setFieldValue("file", filesArray);

      // Set the state with PDF files and image URLs
      setPdfFile(pdfFiles);
      setImageUrls(newImageUrls);
    }
  };

  const handleInputChange = (event) => {
    setNewSubject(event.target.value);
    // getAllSubjects().then((data) => setSubjects(data));
  };
  const handleDirectoryChange = (event) => {
    setNewDirectory(event.target.value);
  };

  useEffect(() => {
    getAllDirectories().then((data) => setDirectories(data));
  }, [newSubject, newDirectory]);

  let formik = useFormik({
    initialValues: {
      file: "", // Pass pdfUrl as the initial value for file
      subject_name: "", // Initialize with empty strings
      directory_name: "",
      status: "", // Initialize status with an empty string
      date: "", // Initialize date with an empty string
      code: "", // Initialize code with an empty string
      about_name: "",
    },

    onSubmit: async (values) => {
      console.log(values);
      // Validate that required fields are filled
      const isValid =
        values.file &&
        values.file.length > 0 &&
        values.subject_name &&
        values.directory_name &&
        values.date &&
        values.about_name &&
        values.status !== "";

      // If all required fields are filled, send the form data to the API
      if (isValid) {
        function formatDate(date) {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0"); // Adding 1 because month is zero-based
          const day = String(date.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        }

        const formData = new FormData();

        // Append each file to the FormData object
        values.file.forEach((file) => {
          formData.append("file", file);
        });

        // Append other form fields to the FormData object
        formData.append("date", formatDate(values.date));
        formData.append("directory_name", values.directory_name);
        formData.append("status", values.status);
        formData.append("subject_name", values.subject_name);
        formData.append("about_name", values.about_name);

        // Conditionally append the code field with a default value of "0"
        if (
          values.code !== undefined &&
          values.code !== null &&
          values.code.trim() !== ""
        ) {
          // If code is provided and not empty, append it
          formData.append("code", values.code);
        } else {
          // If code is not provided or empty, append it with a default value of "0"
          formData.append("code", "0");
        }

        try {
          // Retrieve TOKEN from localStorage
          const response = await axios.post(
            `${DOMAIN}/api/v1/archive/add`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${TOKEN}`, // Include TOKEN in the request headers
              },
            }
          );

          console.log(response.data);
          notifySuccess();
          // formData.reset();

          // You can handle the response data here, such as displaying a success message or updating the UI
        } catch (error) {
          console.error("Error:", error);
          toast.error("حدث خطأ");
          console.log("values sent are");
          console.log(values);
          // You can handle the error here, such as displaying an error message to the user
        }
      } else {
        // If any required field is empty, display an error message
        console.log("Please fill all required fields.");
        toast.error("يرجي ملأ جميع الخانات");
      }
    },
  });

  // Function to handle radio button change
  const handleRadioChange = (e) => {
    formik.setFieldValue("status", e.target.id === "export" ? 1 : 0);
  };

  // Function to handle date change
  const handleDateChange = (date) => {
    formik.setFieldValue("date", date);
  };

  // notifications

  function notifySuccess() {
    console.log("notification working");
    toast.success("تمت الإضافة بنجاح");
  }

  function notifyFailure() {
    toast.error(" الأسم مضاف بالفعل");
  }
  // function addDirectory

  const addDirectory = async () => {
    console.log(newDirectory);
    console.log(TOKEN);

    if (newDirectory) {
      try {
        // Retrieve TOKEN from localStorage

        // Send request to add directory with TOKEN included in the headers
        let res = await axios.post(
          `${DOMAIN}/api/v1/directory/add`,
          {
            name: newDirectory,
          },
          {
            headers: {
              Authorization: `Bearer ${TOKEN}`, // Include TOKEN in the request headers
            },
          }
        );

        console.log(res);
        notifySuccess();
        setNewDirectory("");
      } catch (error) {
        console.error(error);
        console.log(TOKEN);
        notifyFailure();
      }
    } else {
      toast.error("حدث خطأ");
    }
  };

  const choosingDirectory = (event, newValue) => {
    console.log(newValue); // Logging the selected option to the console
    setNewDirectory(newValue);
  };

  const addSubject = async (e) => {
    if (newSubject) {
      try {
        // Retrieve TOKEN from localStorage

        // Send request to add subject with TOKEN included in the headers
        let res = await axios.post(
          `${DOMAIN}/api/v1/subject/add`,
          {
            subject_name: newSubject,
            directory_name: newDirectory,
          },
          {
            headers: {
              Authorization: `Bearer ${TOKEN}`, // Include TOKEN in the request headers
            },
          }
        );

        console.log(res);
        notifySuccess();
        setNewSubject("");
      } catch (error) {
        console.error(error);
        toast.error("يرجي اختيار  الجهة لإضافة اسم");
      }
    } else {
      toast.error("حدث خطأ");
    }
  };

  async function getAllSubjects(directory) {
    try {
      // Retrieve TOKEN from localStorage

      // Send request to fetch subjects with TOKEN included in the headers
      const res = await axios.get(
        `${DOMAIN}/api/v1/directory/${directory}/subjects`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`, // Include TOKEN in the request headers
          },
        }
      );

      setSubjects(res.data);
      console.log("Subjects fetched:", res.data);
      console.log("subjects are: ");
      console.log(subjects);
      console.log("directories are: ");
      console.log(directories); // Logging fetched subjects
      return res.data;
    } catch (error) {
      console.log("Error fetching subjects:", error); // Logging error
      setSubjects(["اختر جهة", ""]);
      throw error; // Rethrow the error to propagate it further if needed
    }
  }

  const assigningDirectory = async (event, value, formik) => {
    formik.setFieldValue("directory_name", value || "");
    {
      value && (await getAllSubjects(value));
    }
  };

  // Assuming you're using functional components with hooks

  const handleCodeChange = (event) => {
    console.log(event.target.value);
    setCode(event.target.value);
    formik.setFieldValue("code", event.target.value);
  };

  setTimeout(() => {
    if (archiveErrMsg) {
      setArchiveErrMsg(false);
    }
  }, 2000);

  function logout(event) {
    event.preventDefault(); // Prevent default form submission behavior

    // Remove TOKEN from localStorage
    localStorage.clear();
    localStorage.setItem("TOKEN", null);
    localStorage.removeItem("TOKEN");

    // Navigate back to /login
    navigate("/login");
  }
  // NEW CODE ****************** NEW CODE *******

  async function addAbout() {
    console.log("about added");
    if (aboutInput && chosenSubjectInAbout) {
      try {
        let res = await axios.post(
          `${DOMAIN}/api/v1/about/add`,
          {
            about_name: aboutInput,
            subject_name: chosenSubjectInAbout,
          },
          {
            headers: {
              Authorization: `Bearer ${TOKEN}`,
            },
          }
        );
        console.log(res);
        toast.success("تمت الإضافة بنجاح");
      } catch (err) {
        console.log(err);
        toast.error("الأسم مضاف بالفعل");
      }
    } else {
      toast.error("يرجي ملأ جميع الخانات");
    }
  }

  async function getSubjectsInAbout(event, value) {
    try {
      let res = await axios.get(
        `${DOMAIN}/api/v1/directory/${value}/subjects`,

        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      console.log(res.data);
      setAboutFetchedSubjects(res.data);
      setChosenDirectoryInAbout(value);
    } catch (err) {
      console.log(err);
    }
  }

  function aboutInputOnChange(e) {
    console.log(e.target.value);
    setAboutInput(e.target.value);
  }

  function aboutSubjectOnChange(e, value) {
    console.log(value);
    setChosenSubjectInAbout(value);
  }

  async function getAllAbouts() {
    setTimeout(async () => {
      try {
        let res = await axios.get(`${DOMAIN}/api/v1/about/all`, {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        });
        setAllFetchedAbouts(res.data);
      } catch (error) {
        console.log(error);
      }
    }, 1000);
  }

  useEffect(() => {
    getAllAbouts();
  }, []);

  async function getAboutsBySubject(event, value) {
    console.log(value);

    console.log("get all abouts for this subject" + value);
    if (value) {
      try {
        let res = await axios.get(
          `${DOMAIN}/api/v1/subject/abouts?subject_name=${value}`,

          {
            headers: {
              Authorization: `Bearer ${TOKEN}`,
            },
          }
        );
        console.log(res.data);

        setFetchedAboutsBySubject(res.data);
      } catch (error) {
        console.log(error);
        toast.error("حدث خطأ");
      }
    }
    formik.setFieldValue("subject_name", value || "");
  }

  function aboutComboBoxOnChange(event, value) {
    formik.setFieldValue("about_name", value || "");
  }

  return (
    <>
      {/* archive container */}
      <div className="archive-container container-xl  ">
        {/* search button */}
        <button
          onClick={navigateSearch}
          className="archive-search-btn btn main-btn  w-100 my-2"
        >
          البحث عن موضوع موجود
        </button>
        <div className="archive-search-container ">
          <div className="archive-btns-container w-100">
            <div className="side-btns flex-column justify-content-center align-items-start  d-flex gap-3 ">
              {/* adding subject */}
              <h2 className=" addition-title mx-auto  ">
                إضافة جهة جديدة / اسم موضوع جديد
              </h2>
              <div className="add-directory-container  d-flex   gap-2">
                <button
                  type=""
                  onClick={addDirectory}
                  className="  btn main-btn "
                >
                  إضافة جهة جديدة
                </button>
                <input
                  type="text"
                  placeholder="جهة"
                  className="form-control-sm w-50"
                  // value={newDirectory}
                  onChange={handleDirectoryChange}
                />
              </div>
              <div className="add-subject-container d-flex gap-2   ">
                <button
                  type="button"
                  onClick={addSubject}
                  className="btn main-btn"
                >
                  إضافة أسم موضوع جديد
                </button>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={directories}
                  sx={{ width: 200 }}
                  renderInput={(params) => (
                    <TextField {...params} label="الجهة" />
                  )}
                  className="archive-select"
                  onChange={choosingDirectory} // Pass the function as onChange handler
                />
                <input
                  type="text"
                  placeholder="أسم موضوع"
                  className="form-control-sm"
                  value={newSubject}
                  onChange={handleInputChange}
                />
              </div>

              <div className="add-subject-container d-flex gap-2   ">
                <button
                  type="button"
                  onClick={addAbout}
                  className="btn main-btn"
                >
                  إضافة شأن لأسم الموضوع
                </button>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={directories}
                  sx={{ width: 200 }}
                  renderInput={(params) => (
                    <TextField {...params} label="الجهة" />
                  )}
                  className="archive-select"
                  onChange={getSubjectsInAbout} // Pass the function as onChange handler
                />
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={
                    aboutFetchedSubjects ? aboutFetchedSubjects : ["اختر جهة"]
                  }
                  sx={{ width: 200 }}
                  renderInput={(params) => (
                    <TextField {...params} label="اسم الموضوع " />
                  )}
                  className="archive-select"
                  onChange={aboutSubjectOnChange} // Pass the function as onChange handler
                />
                <input
                  type="text"
                  placeholder="الشأن"
                  className="form-control-sm"
                  value={aboutInput}
                  onChange={aboutInputOnChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* archive options component */}
        <form onSubmit={formik.handleSubmit}>
          {/* filterbar */}

          <div className="filter-bar-container  ">
            <h2 className=" addition-title mx-auto  ">
              إضافة ملف جديد إلي موضوع موجود
            </h2>
            <div className=" d-flex justify-content-start align-items-center gap-3 flex-wrap">
              <div className="filter-upper-container w-100 d-flex align-items-center gap-3">
                <div className="radio-container">
                  <input
                    className="mx-2"
                    type="radio"
                    id="export"
                    name="importsRadio"
                    onChange={handleRadioChange}
                  />
                  <label htmlFor="export">صادر</label>
                </div>
                <div className="radio-container">
                  <input
                    className="mx-2 "
                    type="radio"
                    id="import"
                    name="importsRadio"
                    onChange={handleRadioChange}
                  />
                  <label htmlFor="import">وارد</label>
                </div>
                {/* Date Range Picker */}
                <DatePicker
                  placeholder="التاريخ"
                  style={{ width: 200 }}
                  format="yyyy-MM-dd"
                  onChange={handleDateChange}
                />
                {/*  */}
                <div className="code-container">
                  <input
                    type="text"
                    placeholder="الكود"
                    className="form-control w-100 "
                    value={code}
                    onChange={handleCodeChange}
                  />
                </div>
              </div>

              <div className="directory-container">
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={directories}
                  sx={{ width: 200 }}
                  renderInput={(params) => (
                    <TextField {...params} label="الجهة" />
                  )}
                  className="archive-select"
                  onChange={(event, value) =>
                    assigningDirectory(event, value, formik)
                  }
                />
              </div>
              {/* today's tasks 
                1- make the default value of this combo box to be "اختر موضوع اولا"
                2 - make a new function to fetch all abouts 
                3- link the new function to the onChange of subjects combo box 
                4- save the value of the subjects combo box to send it in the request
                to get the abouts, by creating a state of course 
                
              */}
              <div className="topic-container">
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={subjects ? subjects : ["اختر جهة"]}
                  sx={{ width: 200 }}
                  renderInput={(params) => (
                    <TextField {...params} label="أسم الموضوع" />
                  )}
                  className="archive-select"
                  onChange={getAboutsBySubject}
                />
              </div>

              <div className="topic-container">
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={
                    fetchedAboutsBySubject
                      ? fetchedAboutsBySubject
                      : ["اختر موضوع"]
                  }
                  sx={{ width: 200 }}
                  renderInput={(params) => (
                    <TextField {...params} label="بشأن" />
                  )}
                  className="archive-select"
                  onChange={aboutComboBoxOnChange}
                />
              </div>
            </div>
          </div>
          <div className="archive-main-section-container">
            <div className="archive-btns-container">
              <label className="btn main-btn">
                <span>اختر ملف</span>
                <input
                  onChange={handleFileChange}
                  type="file"
                  style={{ display: "none" }}
                  name="file"
                  multiple
                />
              </label>

              <button type="submit" className=" btn mt-1 save-btn ">
                حفظ
              </button>

              <button onClick={logout} className=" btn mt-auto logout-btn  ">
                تسجيل الخروج
              </button>
              {/* {archiveErrMsg && (
                <alert className="alert-secondary alert  mt-auto text-center">
                  يرجي ملأ جميع الخانات
                </alert>
              )} */}
            </div>
            {/* placeholder */}
            <div className="file-placeholder-container">
              <div className="file-placeholder row">
                {/* here */}
                {pdfUrl && (
                  <iframe
                    src={iframeSrc}
                    width="600"
                    height="500"
                    title="File Preview"
                  ></iframe>
                )}
                {imageUrls.map((imageUrl, index) => (
                  <div className="wrap">
                    <iframe
                      key={index}
                      src={imageUrl}
                      title={`Image Preview ${index}`}
                      className="frame"
                    >
                      {" "}
                    </iframe>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
