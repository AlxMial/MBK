import React, { useRef, useState } from 'react';
import ReactToPrint from 'react-to-print';
import { ComponentToPrint } from './ComponentToPrint';

const ExportPdf = ({ props, dataExport,onClick,setClickExport }) => {
    const componentRef = useRef();
    const [openExport, setOpenExport] = useState(false);
    const propsExport = { props, dataExport };
    const display = openExport ? 'block' : 'none';
    const btnClassName = "btn-export-pdf text-gold-mbk bg-white active:bg-gold-mbk "
        + " font-bold uppercase text-sm px-2 py-2 rounded shadow hover:shadow-md "
        + " outline-gold-mbk mr-1 ease-linear transition-all duration-150";
    return (
        <div className='pt-4 px-0'>
            <div style={{ display: display }} className='mt-10'>
                <ComponentToPrint props={propsExport} ref={componentRef} />
            </div>
            <ReactToPrint
                trigger={() =>
                    <button className={btnClassName} onClick={onClick} type="button" >
                        Export คำสั่งซื้อ
                    </button>
                }
                content={() => componentRef.current}
                onBeforePrint={() => { setOpenExport(true); setClickExport(true); }}
                onAfterPrint={() => { setOpenExport(false); setClickExport(false);}}
            />
        </div>
    );
}

export default ExportPdf;