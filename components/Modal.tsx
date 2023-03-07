import { ReactNode, useEffect } from "react";
import ReactModal from "react-modal";

const customStyles = {
  content: {
    top: "40%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

ReactModal.setAppElement("#modal");

ReactModal.defaultStyles.content!.background = "none";
ReactModal.defaultStyles.content!.minWidth = "500px";
ReactModal.defaultStyles.content!.maxWidth = "600px";
ReactModal.defaultStyles.content!.border = "none";
ReactModal.defaultStyles.overlay!.background = "rgba(0, 0, 0, 0.3)";

type Props = {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children?: ReactNode;
};

export default function Modal({ isOpen, title, children, onClose }: Props) {
  useEffect(() => {
    const body = document.querySelector("body");
    if (body) body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);
  return (
    <div>
      <ReactModal
        isOpen={isOpen}
        onRequestClose={onClose}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className="relative h-full w-full max-w-2xl md:h-auto">
          <div className="relative rounded-lg bg-white">
            <div className="flex items-start justify-between rounded-t border-b border-zinc-200 px-4 py-3">
              <h4 className="text-lg">{title}</h4>
              <button
                type="button"
                className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-zinc-400"
                onClick={onClose}
              >
                <svg
                  aria-hidden="true"
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="p-4">{children}</div>
          </div>
        </div>
      </ReactModal>
    </div>
  );
}
