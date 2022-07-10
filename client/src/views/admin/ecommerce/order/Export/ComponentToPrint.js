import React from 'react';
import ExportHeader from './ExportHeader';
import PurchaseOrderExport from './PurchaseOrderExport';
import '../CustomerName';

export const ComponentToPrint = React.forwardRef((props, ref) => {
    return (
        <div ref={ref} className='component-to-print'>
            <ExportHeader dataExport={props.props.dataExport} />
            <PurchaseOrderExport props={props.props.props} />
        </div >

    );
});