import { useNavigate } from "react-router-dom";
import { getArchiveData } from "../../apis";
import Table from "../../components/table/Table";

const Search = () => {
  const tableHeaders = [
    { key: "date", value: "التاريخ" },
    { key: "subjectName", value: "إسم الموضوع" },
    { key: "aboutName", value: "إسم الموضوع" },
    { key: "directoryName", value: "الجهة" },
    { key: "code", value: "الكود" },
    { key: "status", value: "صادر / وارد", type: "boolean" },
  ];

  const filters = [
    {
      key: "status",
      type: "radio",
      options: [
        { label: "وارد", value: 0 },
        { label: "صادر", value: 1 },
      ],
      id: "المصدر",
    },
    {
      key: "code",
      type: "text",
      id: "الكود",
    },
    {
      key: "date_from",
      type: "date",
      id: "من تاريخ",
    },
    {
      key: "date_to",
      type: "date",
      id: "إلى تاريخ",
    },
  ];

  const navigateToArchive = useNavigate(); // Renamed the navigate function to navigateToArchive

  return (
    <div className="search-container">
      {/* Use navigateToArchive instead of navigate */}
      <button
        onClick={() => navigateToArchive("/archive")}
        className="back-btn btn main-btn"
      >
        عودة
      </button>

      <Table
        headers={tableHeaders}
        title="الأرشيف"
        filters={filters}
        fetchData={(filterValues, currentPage) =>
          getArchiveData(filterValues, currentPage)
        }
      >
        <button>عرض</button>
      </Table>
    </div>
  );
};

export default Search;
