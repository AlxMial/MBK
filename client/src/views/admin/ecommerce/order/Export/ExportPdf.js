import React, { useRef } from 'react';
import ReactToPrint from 'react-to-print';
import { ComponentToPrint } from './ComponentToPrint';

const ExportPdf = ({ props, openExport, setOpenExport }) => {
    const componentRef = useRef();
    return (
        <div>
            <ComponentToPrint props={props} ref={componentRef} />
            <ReactToPrint
                trigger={() =>
                    <button
                        className={
                            "text-gold-mbk bg-white active:bg-gold-mbk font-bold uppercase text-sm px-2 py-2 rounded shadow hover:shadow-md outline-gold-mbk mr-1 ease-linear transition-all duration-150"
                        }
                        type="button"
                    >
                        Export PDF
                    </button>
                }
                content={() => componentRef.current}
            />
        </div>
    );
}

export default ExportPdf;