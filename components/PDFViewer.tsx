import React from "react";

const PDFViewer = () => {
  return (
    <div className="flex flex-col border-r bg-background relative">
      {/* Controls - Made sticky to stay on top of the PDF section */}
      <div className="sticky top-0 z-10 border-b bg-background">
        <div className="flex p-1 items-center gap-2">
          <Button
            variant={"ghost"}
            className="h-8 w-8"
            onClick={zoomIn}
            aria-label="Zoom In"
          >
            <Plus className="size-4" />
          </Button>
          <Button
            variant={"ghost"}
            className="h-8 w-8"
            onClick={zoomOut}
            aria-label="Zoom Out"
          >
            <Minus className="size-4" />
          </Button>
          <span className="text-sm font-medium px-2">{`${(scale * 100).toFixed(0)}%`}</span>
          <input
            type="text"
            placeholder="Search..."
            className="flex-1 px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label="Search PDF content"
          />
          <Button
            variant={"ghost"}
            className="h-8 w-8"
            onClick={goToPreviousPage}
            disabled={pageNumber <= 1}
            aria-label="Previous Page"
          >
            {"<"}
          </Button>
          <span className="text-sm font-medium px-2">{`${pageNumber} / ${numPages || "-"}`}</span>
          <Button
            variant={"ghost"}
            className="h-8 w-8"
            onClick={goToNextPage}
            disabled={pageNumber >= (numPages || 1)}
            aria-label="Next Page"
          >
            {">"}
          </Button>
        </div>
      </div>
      {/* PDF Viewer */}
      <div className="flex-1 overflow-auto p-4 flex justify-center items-start">
        <div className="w-full max-w-full h-full">
          {url && (
            <Document
              file={url}
              onLoadSuccess={onDocumentLoadSuccess}
              className="flex justify-center" // Center the document within its container
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                renderAnnotationLayer={true}
                renderTextLayer={true}
                className="shadow-lg" // Add some shadow for visual separation
              />
            </Document>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
