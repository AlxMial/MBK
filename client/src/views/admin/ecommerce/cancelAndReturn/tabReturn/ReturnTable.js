import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import SelectUC from "components/SelectUC";
import ValidateService from "services/validateValue";
import moment from "moment";

const ReturnTable = ({ listData, handleChangeStatus }) => {
  const thClass =
    "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 ";
  const tdClass =
    "border-t-0 px-2 align-middle border-b border-l-0 border-r-0 p-3 text-sm whitespace-nowrap";
  const tdSpan = "text-gray-mbk  hover:text-gray-mbk ";

  const [pageNumber, setPageNumber] = useState(0);
  const usersPerPage = 8;
  const pagesVisited = pageNumber * usersPerPage;
  const pageCount = Math.ceil(listData.length / usersPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const getoption = (value) => {
    if (value == 1) {
      return [
        { value: 1, label: "รอดำเนินการ", isDisabled: true },
        { value: 2, label: "คืนสำเร็จ" },
        { value: 3, label: "ปฎิเสธ" },
      ];
    } else {
      return [
        { value: 1, label: "รอดำเนินการ", isDisabled: true },
        { value: 2, label: "คืนสำเร็จ", isDisabled: true },
        { value: 3, label: "ปฎิเสธ", isDisabled: true },
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
    "สาเหตุที่คืนสินค้า",
    "รายละเอียด",
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
                      thClass + (item === "ลำดับที่" ? " text-center" : (item==="ยอดสุทธิ") ? " text-right pr-8" :  "")
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
                    <td className={tdClass +" text-right pr-8"}>
                      <span className={tdSpan}>{value.sumPrice}</span>
                    </td>
                    <td className={tdClass}>
                      <span className={tdSpan}>
                        <SelectUC
                          name="returnStatus"
                          onChange={(e) => {
                            handleChangeStatus(value, e.value);
                          }}
                          options={getoption(value.returnStatus)}
                          value={ValidateService.defaultValue(
                            getoption(value.returnStatus),
                            value.returnStatus
                          )}
                          isDisabled={value.returnStatus != 1}
                          customStyles={getCss(value.returnStatus)}
                        />
                      </span>
                    </td>
                    <td className={tdClass}>
                      <span className={tdSpan}>{value.returnDetail}</span>
                    </td>
                    <td className={tdClass}>
                      <span className={tdSpan}>{value.returnOtherRemark}</span>
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
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ReturnTable;
