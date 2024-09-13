/* eslint-disable react/prop-types */
import { useState } from 'react';
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";

const Table = ({ columns, data, itemsPerPage = 2 }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((page) => Math.max(page - 1, 1));
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-200">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.accessor}
                  className="py-2 px-4 border-b border-gray-200 text-left text-gray-600"
                >
                  {column.Header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.map((row, rowIndex) => (
              <tr key={rowIndex} className="even:bg-gray-50">
                {columns.map((column) => (
                  <td
                    key={column.accessor}
                    className="py-2 px-4 border-b border-gray-200 text-gray-800"
                  >
                    {typeof row[column.accessor] === "function"
                      ? row[column.accessor]()
                      : row[column.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          <FaChevronLeft  className="w-5 h-5 mr-2" />
          Previous
        </button>
        <span className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          Next
          <FaChevronRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default Table;