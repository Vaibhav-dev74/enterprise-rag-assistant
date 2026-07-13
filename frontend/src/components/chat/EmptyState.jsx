import { FileText } from "lucide-react";

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-slate-500">

      <FileText size={70} />

      <h2 className="text-3xl font-bold mt-5">

        Enterprise RAG

      </h2>

      <p className="mt-3">

        Upload a document and start asking questions.

      </p>

    </div>
  );
}

export default EmptyState;