import { Box } from "@chakra-ui/react";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useState } from "react";
import DATA from "../../data";

const columns = [
  {
    accessorKey: "task",
    header: "Task",
    cell: (props) => <p>{props.getValue}</p>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (props) => <p>{props.getValue}</p>,
  },
  {
    accessorKey: "due",
    header: "Due",
    cell: (props) => <p>{props.getValue}</p>,
  },
  {
    accessorKey: "notes",
    header: "Notes",
    cell: (props) => <p>{props.getValue}</p>,
  },
];

const ArchiveTable = () => {
  const [data, setData] = useState(DATA);
  const table = useReactTable({
    data,
    columns,
    getCoreModel: getCoreRowModel(),
  });
  console.log(table.getHeaderGroups());

  return (
    <Box>
      <Box className="table"></Box>
    </Box>
  );
};
export default ArchiveTable;
