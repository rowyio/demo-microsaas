import { useMemo, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  padding: "30px 20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#a1a1aa",
  borderStyle: "dashed",
  color: "#3f3f46",
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
