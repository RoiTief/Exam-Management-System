const PdfViewer = ({ pdfUrl }) => {
  return (
    <div style={{ height: '100vh' }}>
      <embed
        src={pdfUrl}
        type="application/pdf"
        width="100%"
        height="100%"
      />
    </div>
  );
};

export default PdfViewer;
