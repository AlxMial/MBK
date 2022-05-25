export const customStyles = (width = '') => ({
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    padding: '0%',
    transform: 'translate(-50%, -50%)',
    overflowY: 'auto',
    overflowX: 'auto',
    backgroundColor: "white",
    border: "1px solid #047a40",
    //   height:"80vh",
    width: width ? width : "65vw",
  }, overlay: { zIndex: 100, backgroundColor: 'rgba(70, 70, 70, 0.5)', }
});

export const customEcomStyles = () => ({
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    padding: '0%',
    transform: 'translate(-50%, -50%)',
    overflowY: 'auto',
    overflowX: 'auto',
    backgroundColor: "white",
    border: "1px solid #047a40",
    //   height:"80vh",
    width: "55vw",
  }, overlay: { zIndex: 100, backgroundColor: 'rgba(70, 70, 70, 0.5)', }
});

export const customStylesMobile = () => ({
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    padding: '0%',
    transform: 'translate(-50%, -50%)',
    overflowY: 'auto',
    overflowX: 'auto',
    backgroundColor: "white",
    border: "1px solid #047a40",
    //   height:"90vh",
    width: "95vw",
  }, overlay: { zIndex: 100, backgroundColor: 'rgba(70, 70, 70, 0.5)', }
});
