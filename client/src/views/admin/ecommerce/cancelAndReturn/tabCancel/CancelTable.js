import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import SelectUC from "components/SelectUC";
import ValidateService from "services/validateValue";
import moment from "moment";

const CancelTable = ({
  listData,
  handleChangeStatus,
  pageNumber,
  setPageNumber,
  forcePage,
  setForcePage,
}) => {
  const thClass =
    "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 ";
  const tdClass =
    "border-t-0 px-2 align-middle border-b border-l-0 border-r-0 p-3 text-sm whitespace-nowrap";
  const tdSpan = "text-gray-mbk ";

  // const [pageNumber, setPageNumber] = useState(0);
  const usersPerPage = 8;
  const pagesVisited = pageNumber * usersPerPage;
  const pageCount = Math.ceil(listData.length / usersPerPage) || 1;

  const changePage = ({ selected }) => {
    setPageNumber(selected);
    setForcePage(selected);
  };

  const getoption = (value) => {
    if (value == 1) {
      return [
        { value: 1, label: "รอยกเลิก", isDisabled: true },
        { value: 2, label: "คืนเงิน" },
        { value: 3, label: "ไม่คืนเงิน" },
      ];
    } else {
      return [
        { value: 1, label: "รอยกเลิก", isDisabled: true },
        { value: 2, label: "คืนเงิน", isDisabled: true },
        { value: 3, label: "ไม่คืนเงิน", isDisabled: true },
      ];
    }
  };
  const getCss = (value) => {
    if (value && value == 1)
      return {
        control: (base, state) => ({
          ...base,
          background: "hsl(57deg 87% 91%)",
        }),
      };
    else if (value && value == 2)
      return {
        control: (base, state) => ({
          ...base,
          background: "hsl(148deg 48% 83%)",
        }),
      };
    else
      return {
        control: (base, state) => ({
          ...base,
          background: "hsl(1deg 82% 87%)",
        }),
      };
  };

  const _thList = [
    "ลำดับที่",
    "เลขที่ใบสั่งซื้อ",
    "วันที่สั่งซื้อ",
    "ผู้สั่งซื้อ",
    "ยอดสุทธิ",
    "สถานะ",
    "สาเหตุที่ยกเลิกสินค้า",
    "รายละเอียดที่ยกเลิกสินค้า",
  ];

  return (
    <>
      <div className="block w-full overflow-x-auto  px-4 py-2">
        {/* Projects table */}
        <table className="items-center w-full border ">
          <thead>
            <tr>
              {_thList.map((item, index) => {
                return (
                  <th
                    key={index}
                    className={
                      thClass +
                      (item === "ลำดับที่"
                        ? " text-center"
                        : item === "ยอดสุทธิ"
                        ? " text-right pr-8"
                        : "")
                    }
                  >
                    {item}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {listData
              .slice(pagesVisited, pagesVisited + usersPerPage)
              .map(function (value, key) {
                return (
                  <tr key={key}>
                    <td className={tdClass + " text-center"}>
                      <span className="px-4 margin-a">
                        {pagesVisited + key + 1}
                      </span>
                    </td>
                    <td className={tdClass}>
                      <span className={tdSpan}>{value.orderNumber}</span>
                    </td>
                    <td className={tdClass}>
                      <span className={tdSpan}>
                        {moment(value.orderDate).format("DD/MM/YYYY HH:mm:ss") +
                          " น."}
                      </span>
                    </td>
                    <td className={tdClass}>
                      <span className={tdSpan}>{value.memberName}</span>
                    </td>
                    <td className={tdClass + " text-right pr-8"}>
                      <span className={tdSpan}>{value.sumPrice}</span>
                    </td>
                    <td className={tdClass} style={{ minWidth: "135px" }}>
                      <span className={tdSpan} >
                        <SelectUC
                          name="cancelStatus"
                          onChange={(e) => {
                            handleChangeStatus(value, e.value);
                          }}
                          options={getoption(value.cancelStatus)}
                          value={ValidateService.defaultValue(
                            getoption(value.cancelStatus),
                            value.cancelStatus
                          )}
                          isDisabled={value.cancelStatus != 1}
                          customStyles={getCss(value.cancelStatus)}
                        />
                      </span>
                    </td>
                    <td className={tdClass}>
                      <span className={tdSpan}>{value.cancelDetail}</span>
                    </td>
                    <td className={tdClass}>
                      <span className={tdSpan}>{value.cancelOtherRemark}</span>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <div className="px-4">
        <div className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap ">
          <div className="lg:w-6/12 font-bold" style={{ alignSelf: "stretch" }}>
            {pagesVisited + 8 > listData.length
              ? listData.length
              : pagesVisited + 8}{" "}
            {"/"}
            {listData.length} รายการ
          </div>
          <div className="lg:w-6/12">
            <ReactPaginate
              previousLabel={" < "}
              nextLabel={" > "}
              pageCount={pageCount}
              onPageChange={changePage}
              containerClassName={"paginationBttns"}
              previousLinkClassName={"previousBttn"}
              nextLinkClassName={"nextBttn"}
              disabledClassName={"paginationDisabled"}
              activeClassName={"paginationActive"}
              forcePage={forcePage}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CancelTable;
