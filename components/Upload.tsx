import { useMemo, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

export type CustomFile = FileWithPath & {
  preview: string;
};

type Props = {
  onUpload: (file: File) => void;
};

export default function Upload({ onUpload }: Props) {
  const [localFile, setLocalFile] = useState<CustomFile>();

  const {
    getRootProps,
    getInputProps,
    acceptedFiles,
    isFocused,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: { "image/*": [] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      onUpload(acceptedFiles[0]);
    },
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  return (
    <div {...getRootProps({ style: style as React.CSSProperties })}>
      <input {...getInputProps()} />
      <p>Drop a image, or click to select one</p>
    </div>
  );
}
