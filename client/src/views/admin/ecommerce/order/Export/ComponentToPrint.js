import React from 'react';
import ExportHeader from '../ExportHeader';
import PurchaseOrder from '../PurchaseOrder';

export const ComponentToPrint = React.forwardRef((props, ref) => {
    return (
        <div ref={ref}>
            {/* <ExportHeader dataExport={dataExport} /> */}
            <PurchaseOrder props={props.props} />
        </div>
    );
});