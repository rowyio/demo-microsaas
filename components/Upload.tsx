import { useMemo, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  padding: "40px 20px",
  borderWidth: 1,
  borderRadius: 8,
  borderColor: "transparent",
  color: "#3f3f46",
  outline: "none",
  transition: "border .24s ease-in-out",
  backgroundColor: "#f3f4f6",
};

const focusedStyle = {
  borderStyle: "dashed",
  borderColor: "#a1a1aa",
};

const acceptStyle = {
  borderColor: "#a1a1aa",
  borderStyle: "dashed",
};

const rejectStyle = {
  borderColor: "#ef4444",
  borderStyle: "dashed",
};

export type CustomFile = FileWithPath & {
  preview: string;
};

type Props = {
  disabled?: boolean;
  onUpload: (file: File) => void;
};

export default function Upload({ onUpload, disabled = false }: Props) {
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
    disabled,
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
