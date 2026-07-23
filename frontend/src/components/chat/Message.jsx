import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function Message({
  role,
  text,
  sources,
  setSelectedDocument,
  setSelectedPage,
}) {
  const isUser = role === "user";

  return (
    <div
      className={`mb-6 flex ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-4xl rounded-2xl px-5 py-4 shadow-lg ${
          isUser
            ? "bg-blue-600 text-white"
            : "bg-slate-800 border border-slate-700 text-gray-100"
        }`}
      >
        {isUser ? (
          <p>{text}</p>
        ) : (
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {text}
            </ReactMarkdown>
          </div>
        )}

        {!isUser && sources?.length > 0 && (
          <div className="mt-6">

            <h4 className="text-xs uppercase tracking-widest text-slate-400 mb-3">
              Sources
            </h4>

            <div className="space-y-3">

              {sources.map((source, index) => (

                <button
                  key={index}
                  onClick={() => {
                    setSelectedDocument(source.filename);
                    setSelectedPage(source.page);
                  }}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 hover:border-blue-500 hover:bg-slate-800 transition-all p-4 text-left"
                >
                  <div className="font-semibold text-white">
                    📄 {source.filename}
                  </div>

                  <div className="text-blue-400 text-sm">
                    Page {source.page}
                  </div>

                  {source.text && (
                    <p className="mt-3 text-sm text-slate-400 line-clamp-3">
                      {source.text}
                    </p>
                  )}
                </button>

              ))}

            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default Message;