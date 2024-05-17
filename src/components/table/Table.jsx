import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { DatePicker } from "rsuite";
import Autocomplete from "@mui/material/Autocomplete";
import { getAllDirectories } from "../../apis";
import { DOMAIN, TOKEN } from "../../config";
import axios from "axios";
import { Pagination } from "antd";
import "./Table.scss";
import toast from "react-hot-toast";

const Table = ({ headers, title, filters, fetchData, children }) => {
  const [data, setData] = useState([]);
  const [directories, setDirectories] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [filterValues, setFilterValues] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [allFetchedAbouts, setAllFetchedAbouts] = useState("");
  const [allFetchedSubjects, setAllFetchedSubjects] = useState("");
  const [fetchedAboutsBySubject, setFetchedAboutsBySubject] = useState("");

  const navigate = useNavigate();

  // New Code ***************************

  async function getAllSubjects() {
    try {
      let res = await axios.get(`${DOMAIN}/api/v1/subject/getAll`, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      });
      setAllFetchedSubjects(res.data);
      console.log(res.data);
    } catch (error) {
      console.log(error);
      toast.error("خطأ في السيرفر");
    }
  }

  async function getAllAbouts() {
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
  }

  async function getAboutsBySubject(event, value) {
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
  }

  function subjectsFilterOnChange(event, newValue) {
    handleFilterChange("subject_name", newValue);
    getAboutsBySubject(event, newValue);
  }

  // Old code **********************
  useEffect(() => {
    const getDirectories = async () => {
      const res = await getAllDirectories();
      setDirectories(res);
    };

    fetchData({ ...filterValues, page: currentPage }).then((result) => {
      console.log(filterValues);

      console.log(result);
      setData(result);
    });
    getDirectories();
    getAllAbouts();
    getAllSubjects();
  }, [fetchData, filterValues, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const openFile = (filePath) => {
    console.log(filePath);
    const formattedFilePath = filePath.replace(/\\/g, "/");
    window.open(formattedFilePath, "_blank");
  };
  const handleFilterChange = (key, value) => {
    console.log(value);
    setFilterValues((prevFilterValues) => ({
      ...prevFilterValues,
      [key]: value,
    }));

    setCurrentPage(1);
  };
  const handleDirectoryChange = async (key, directoryValue) => {
    if (!directoryValue) {
      setFilterValues((prevFilterValues) => ({
        ...prevFilterValues,
        [key]: directoryValue,
      }));
      return;
    }
    // Send request to fetch subjects with token included in the headers
    const res = await axios.get(
      `${DOMAIN}/api/v1/directory/${directoryValue}/subjects`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`, // Include token in the request headers
        },
      }
    );
    setSubjects(res.data);
    setFilterValues((prevFilterValues) => ({
      ...prevFilterValues,
      [key]: directoryValue,
    }));
    setCurrentPage(1);
  };

  const handleItemClick = (itemId, route) => {
    if (route) {
      navigate(route.replace(":id", itemId));
    }
  };

  const renderFilterInput = (filter) => {
    const { key, type, placeholder, options } = filter;
    if (type === "number") {
      // Render input for number type
      return (
        <input
          className="form-control filter-input"
          type="number"
          placeholder={placeholder}
          value={filterValues[key] || ""}
          onChange={(e) => handleFilterChange(key, e.target.value)}
        />
      );
    } else if (type === "selection") {
      // Render select dropdown for selection type
      return (
        <select
          className="form-select filter-input "
          value={filterValues[key] || ""}
          onChange={(e) => handleFilterChange(key, e.target.value)}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    } else if (type === "radio") {
      return (
        <select
          className="form-select filter-input mx-1"
          value={filterValues[key] || ""} // Set default value to 'كلاهما' if no value is selected
          onChange={(e) => handleFilterChange(key, e.target.value)}
        >
          <option value="">كلاهما</option> {/* Default option */}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    } else if (type === "date") {
      // Render input for date type
      return (
        <DatePicker
          value={filterValues[key] ? new Date(filterValues[key]) : null}
          onChange={(newValue) => handleFilterChange(key, newValue)}
          className={"filter-date-picker"}
        />
      );
    } else {
      // Render input for text type
      return (
        <>
          <input
            id={key}
            className="form-control filter-input"
            type="text"
            value={filterValues[key] || ""}
            onChange={(e) => handleFilterChange(key, e.target.value)}
            // className={"date-picker"}
          />
        </>
      );
    }
  };

  return (
    <section className="content-area-table outer-table-container">
      <div className="data-table-info  fs-5 ">
        <h4 className="data-table-title table-title ">{title}</h4>

        {filters && (
          <div className="data-table-filters ">
            <span className="  ">
              <label htmlFor="">إسم الجهة</label>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={directories}
                sx={{ width: 200 }}
                renderInput={(params) => (
                  <TextField {...params} label="الجهة" />
                )}
                className="archive-select"
                onChange={(event, newValue) => {
                  handleDirectoryChange("directory_name", newValue);
                }}
              />
            </span>

            {/* 1- make the default value of about to be choose subject first
                    2- make a request that console.logs the subject onChange   
                    3- 

                */}
            <span className="">
              <label htmlFor="">إسم الموضوع</label>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={subjects.length === 0 ? allFetchedSubjects : subjects}
                sx={{ width: 200 }}
                renderInput={(params) => (
                  <TextField {...params} label="الموضوع" />
                )}
                className="archive-select"
                onChange={subjectsFilterOnChange}
              />
            </span>
            <span className="">
              <label htmlFor="">الموضوع بشأن</label>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={
                  fetchedAboutsBySubject
                    ? fetchedAboutsBySubject
                    : ["اختر موضوع اولا"]
                }
                sx={{ width: 200 }}
                renderInput={(params) => <TextField {...params} label="بشأن" />}
                className="archive-select"
                onChange={(event, newValue) => {
                  handleFilterChange("about_name", newValue);
                }}
              />
            </span>
            {filters?.map((filter) => (
              <span className="  " key={filter.id}>
                <label htmlFor="" style={{ display: "block" }}>
                  {filter.id}
                </label>
                {renderFilterInput(filter)}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="data-table-diagram">
        <table className="data-table">
          <thead className="text-white bg-darkblue">
            <tr>
              {headers.map((header, index) => (
                <th key={index}>{header.value}</th>
              ))}
              {children && <th>الإجراءات</th>}
            </tr>
          </thead>
          <tbody>
            {data?.archiveResponseDtoList &&
              data?.archiveResponseDtoList.map((item) => (
                <tr key={item.id}>
                  {headers.map((header) => {
                    return (
                      <td
                        key={header.key}
                        onClick={() =>
                          header.clickable &&
                          handleItemClick(item.id, header.route)
                        }
                        className={header.clickable ? "clickable-cell" : ""}
                      >
                        {header.key === "status" ? (
                          <p>{item.status ? "صادر" : "وارد"}</p>
                        ) : (
                          item[header.key]
                        )}
                      </td>
                    );
                  })}
                  {children && (
                    <td>
                      <div className="buttons">
                        {React.Children.map(children, (child) => {
                          return React.cloneElement(child, {
                            onClick: () => openFile(item.filePath),
                          });
                        })}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            {data &&
            data.archiveResponseDtoList &&
            data.archiveResponseDtoList.length ? null : (
              <tr>
                <td colSpan={headers.length + 1}>لا يوجد نتائج</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {data?.archiveResponseDtoList?.length > 0 && (
        <Pagination
          className="pagination"
          current={currentPage}
          onChange={handlePageChange}
          total={data?.totalRecords}
          showSizeChanger={false}
        />
      )}
    </section>
  );
};

export default Table;
