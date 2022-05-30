import React from 'react';
import ExportHeader from './ExportHeader';
import PurchaseOrder from '../PurchaseOrder';
import '../../index.scss';

export const ComponentToPrint = React.forwardRef((props, ref) => {
    return (
        <div ref={ref} className='component-to-print'>
            <ExportHeader dataExport={props.props.dataExport} />
            <PurchaseOrder props={props.props.props} />
        </div >

    );
});