import {
  useEffect,
  useState,
} from "react";

import {
  Plus,
  MessageSquare,
  Trash2,
  FileText,
  Clock,
  RefreshCw,
  Search,
} from "lucide-react";

import toast from "react-hot-toast";

import {
  useNavigate,
} from "react-router-dom";

import api from "../api/api";


function Chats() {

  const navigate =
    useNavigate();


  const [sessions, setSessions] =
    useState([]);


  const [loading, setLoading] =
    useState(true);


  const [search, setSearch] =
    useState("");


  const [deleting, setDeleting] =
    useState(null);


  /* =============================================== */
  /* GET CURRENT USER                                 */
  /* =============================================== */

  const getUser = () => {

    try {

      return JSON.parse(
        localStorage.getItem("user") || "{}"
      );

    } catch {

      return {};

    }

  };


  /* =============================================== */
  /* LOAD CONVERSATIONS                               */
  /* =============================================== */

  const loadChats = async () => {

    const user =
      getUser();


    if (!user?.id) {

      setLoading(false);

      return;

    }


    try {

      setLoading(true);


      const res =
        await api.get(
          `/history/user/${user.id}`
        );


      setSessions(
        res.data.sessions || []
      );


    } catch (err) {

      console.error(
        "Load chats error:",
        err
      );


      toast.error(
        "Failed to load conversations."
      );


    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    loadChats();


    /* Listen for new chat messages */

    const handleUpdate = () => {

      loadChats();

    };


    window.addEventListener(
      "chat-updated",
      handleUpdate
    );


    return () => {

      window.removeEventListener(
        "chat-updated",
        handleUpdate
      );

    };

  }, []);


  /* =============================================== */
  /* NEW CHAT                                         */
  /* =============================================== */

  const createNewChat = () => {

    const newSessionId =
      crypto.randomUUID();


    navigate(
      `/dashboard?session=${newSessionId}`
    );

  };


  /* =============================================== */
  /* OPEN CHAT                                        */
  /* =============================================== */

  const openChat = (
    session
  ) => {

    navigate(
      `/dashboard?session=${session.session_id}`
    );

  };


  /* =============================================== */
  /* DELETE CHAT                                      */
  /* =============================================== */

  const deleteChat = async (
    event,
    session
  ) => {

    event.stopPropagation();


    const confirmed =
      window.confirm(
        `Delete "${session.title}"?`
      );


    if (!confirmed) {

      return;

    }


    try {

      setDeleting(
        session.session_id
      );


      await api.delete(
        `/history/session/${session.session_id}`
      );


      setSessions((prev) =>
        prev.filter(
          (item) =>
            item.session_id !==
            session.session_id
        )
      );


      toast.success(
        "Conversation deleted."
      );


    } catch (err) {

      console.error(
        "Delete chat error:",
        err
      );


      toast.error(
        "Failed to delete conversation."
      );


    } finally {

      setDeleting(null);

    }

  };


  /* =============================================== */
  /* FORMAT DATE                                      */
  /* =============================================== */

  const formatDate = (
    dateValue
  ) => {

    if (!dateValue) {

      return "";

    }


    const date =
      new Date(dateValue);


    return date.toLocaleString(
      undefined,
      {

        month: "short",

        day: "numeric",

        hour: "numeric",

        minute: "2-digit",

      }
    );

  };


  /* =============================================== */
  /* FILTER                                           */
  /* =============================================== */

  const filteredSessions =
    sessions.filter(
      (session) => {

        const query =
          search.toLowerCase();


        return (

          session.title
            ?.toLowerCase()
            .includes(query) ||

          session.document
            ?.toLowerCase()
            .includes(query)

        );

      }
    );


  /* =============================================== */
  /* UI                                               */
  /* =============================================== */

  return (

    <div
      className="
        min-h-screen
        bg-slate-50
        text-slate-900
        dark:bg-slate-950
        dark:text-white
      "
    >

      {/* HEADER */}

      <div
        className="
          border-b
          border-slate-200
          bg-white
          dark:border-slate-800
          dark:bg-slate-900
        "
      >

        <div
          className="
            mx-auto
            flex
            max-w-6xl
            items-center
            justify-between
            gap-4
            px-4
            py-5
            sm:px-6
          "
        >

          <div>

            <div className="flex items-center gap-3">

              <div
                className="
                  rounded-xl
                  bg-blue-500/10
                  p-2.5
                  text-blue-600
                  dark:text-blue-400
                "
              >

                <MessageSquare
                  size={24}
                />

              </div>


              <div>

                <h1
                  className="
                    text-xl
                    font-bold
                    sm:text-2xl
                  "
                >
                  Conversations
                </h1>


                <p
                  className="
                    mt-0.5
                    text-sm
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  Your saved AI conversations
                </p>

              </div>

            </div>

          </div>


          <button
            type="button"
            onClick={createNewChat}
            className="
              flex
              items-center
              gap-2
              rounded-xl
              bg-blue-600
              px-4
              py-2.5
              font-medium
              text-white
              transition
              hover:bg-blue-700
            "
          >

            <Plus size={19} />

            <span className="hidden sm:inline">
              New Chat
            </span>

          </button>

        </div>

      </div>


      {/* CONTENT */}

      <main
        className="
          mx-auto
          w-full
          max-w-6xl
          px-4
          py-6
          sm:px-6
        "
      >


        {/* SEARCH */}

        <div
          className="
            mb-6
            flex
            flex-col
            gap-3
            sm:flex-row
            sm:items-center
          "
        >

          <div
            className="
              flex
              flex-1
              items-center
              rounded-xl
              border
              border-slate-200
              bg-white
              px-4
              py-3
              dark:border-slate-700
              dark:bg-slate-900
            "
          >

            <Search
              size={19}
              className="
                shrink-0
                text-slate-400
              "
            />

            <input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="
                ml-3
                w-full
                bg-transparent
                text-sm
                outline-none
                placeholder:text-slate-400
              "
            />

          </div>


          <button
            type="button"
            onClick={loadChats}
            disabled={loading}
            title="Refresh conversations"
            className="
              flex
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-slate-200
              bg-white
              px-4
              py-3
              text-slate-600
              transition
              hover:bg-slate-100
              disabled:opacity-50
              dark:border-slate-700
              dark:bg-slate-900
              dark:text-slate-300
              dark:hover:bg-slate-800
            "
          >

            <RefreshCw
              size={19}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            <span className="hidden sm:inline">
              Refresh
            </span>

          </button>

        </div>


        {/* COUNT */}

        {!loading && (

          <p
            className="
              mb-4
              text-sm
              text-slate-500
              dark:text-slate-400
            "
          >

            {filteredSessions.length}
            {" "}
            conversation
            {filteredSessions.length !== 1
              ? "s"
              : ""}

          </p>

        )}


        {/* LOADING */}

        {loading ? (

          <div
            className="
              flex
              min-h-[300px]
              items-center
              justify-center
            "
          >

            <RefreshCw
              size={30}
              className="
                animate-spin
                text-blue-500
              "
            />

          </div>

        ) : filteredSessions.length === 0 ? (

          /* EMPTY STATE */

          <div
            className="
              flex
              min-h-[350px]
              flex-col
              items-center
              justify-center
              rounded-2xl
              border
              border-dashed
              border-slate-300
              bg-white
              p-8
              text-center
              dark:border-slate-700
              dark:bg-slate-900
            "
          >

            <div
              className="
                mb-4
                rounded-full
                bg-blue-500/10
                p-5
                text-blue-500
              "
            >

              <MessageSquare
                size={40}
              />

            </div>


            <h2
              className="
                text-lg
                font-semibold
              "
            >
              No conversations yet
            </h2>


            <p
              className="
                mt-2
                max-w-md
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              Start a new conversation and your
              chat history will appear here.
            </p>


            <button
              type="button"
              onClick={createNewChat}
              className="
                mt-6
                flex
                items-center
                gap-2
                rounded-xl
                bg-blue-600
                px-5
                py-3
                font-medium
                text-white
                transition
                hover:bg-blue-700
              "
            >

              <Plus size={19} />

              Start New Chat

            </button>

          </div>

        ) : (

          /* CHAT LIST */

          <div
            className="
              grid
              gap-4
              sm:grid-cols-2
              xl:grid-cols-3
            "
          >

            {filteredSessions.map(
              (session) => (

                <article
                  key={
                    session.session_id
                  }
                  onClick={() =>
                    openChat(session)
                  }
                  className="
                    group
                    cursor-pointer
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-5
                    transition
                    hover:-translate-y-0.5
                    hover:border-blue-400
                    hover:shadow-lg
                    dark:border-slate-800
                    dark:bg-slate-900
                    dark:hover:border-blue-500
                  "
                >

                  <div
                    className="
                      flex
                      items-start
                      justify-between
                      gap-3
                    "
                  >

                    <div
                      className="
                        min-w-0
                        flex-1
                      "
                    >

                      <h3
                        className="
                          truncate
                          font-semibold
                        "
                      >

                        {session.title ||
                          "New Conversation"}

                      </h3>


                      <div
                        className="
                          mt-3
                          flex
                          items-center
                          gap-2
                          text-sm
                          text-slate-500
                          dark:text-slate-400
                        "
                      >

                        <FileText
                          size={16}
                          className="
                            shrink-0
                            text-blue-500
                          "
                        />

                        <span className="truncate">

                          {session.document ||
                            "No document"}

                        </span>

                      </div>

                    </div>


                    <button
                      type="button"
                      title="Delete conversation"
                      disabled={
                        deleting ===
                        session.session_id
                      }
                      onClick={(event) =>
                        deleteChat(
                          event,
                          session
                        )
                      }
                      className="
                        shrink-0
                        rounded-lg
                        p-2
                        text-slate-400
                        opacity-0
                        transition
                        hover:bg-red-500/10
                        hover:text-red-500
                        group-hover:opacity-100
                        disabled:opacity-50
                      "
                    >

                      {deleting ===
                      session.session_id ? (

                        <RefreshCw
                          size={17}
                          className="animate-spin"
                        />

                      ) : (

                        <Trash2
                          size={17}
                        />

                      )}

                    </button>

                  </div>


                  <div
                    className="
                      mt-5
                      flex
                      items-center
                      gap-2
                      border-t
                      border-slate-100
                      pt-4
                      text-xs
                      text-slate-400
                      dark:border-slate-800
                    "
                  >

                    <Clock
                      size={14}
                    />

                    {formatDate(
                      session.updated_at ||
                      session.created_at
                    )}

                  </div>

                </article>

              )
            )}

          </div>

        )}

      </main>

    </div>

  );

}


export default Chats;