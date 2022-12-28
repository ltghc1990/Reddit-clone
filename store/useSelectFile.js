import { useState } from "react";

// onChange will trigger the onFileSelect
export const useSelectFile = () => {
  //setSelectedFile is used to delete/clear the selectedFile
  const [selectedFile, setSelectedFile] = useState("");

  const onSelectFile = (event) => {
    // read data from the file, process it into something manageable
    const reader = new FileReader();
    // check if a file exist
    if (event.target.files?.[0]) {
      reader.readAsDataURL(event.target.files[0]);
    }

    // reader.onload is a event listener that fires off when reader.readAsdataURL completes. we can then use the results as params
    reader.onload = (readerEvent) => {
      if (readerEvent.target?.result) {
        // set to state
        console.log(readerEvent);
        setSelectedFile(readerEvent.target.result);
      }
    };
  };

  return {
    selectedFile,
    setSelectedFile,
    onSelectFile,
  };
};
