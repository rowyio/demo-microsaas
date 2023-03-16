import { AlertCircle } from "tabler-icons-react";

export default function UnauthorizedDomainError() {
  return (
    <div className="fixed left-0 bottom-0 z-50 w-full bg-red-400 py-2 text-center text-zinc-900">
      <div className="flex justify-center gap-1">
        <AlertCircle />
        <h1>Firebase unauthorized domain</h1>
      </div>

      <div className="text-sm">
        If you are the app developer{" "}
        <a
          className="link underline"
          target="_blank"
          href={`https://console.firebase.google.com/u/0/project/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}/authentication/settings`}
        >
          click here
        </a>{" "}
        to whitelist this domain.
      </div>
    </div>
  );
}
