import { useEffect, useState } from "react";

import {
  BrainCircuit,
  Moon,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  Check,
  Trash2,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import api from "../../api/api";


function Navbar() {

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const [notificationsOpen, setNotificationsOpen] =
    useState(false);

  const [notifications, setNotifications] =
    useState([]);

  const [unreadCount, setUnreadCount] =
    useState(0);

  const user = JSON.parse(
    localStorage.getItem("user")
  );


  // -----------------------------------------
  // Fetch unread count
  // -----------------------------------------

  const fetchUnreadCount = async () => {

    if (!user?.id) {
      return;
    }

    try {

      const response = await api.get(
        `/notifications/${user.id}/unread-count`
      );

      setUnreadCount(
        response.data.count
      );

    } catch (error) {

      console.error(
        "Failed to fetch notification count:",
        error
      );

    }

  };


  // -----------------------------------------
  // Fetch notifications
  // -----------------------------------------

  const fetchNotifications = async () => {

    if (!user?.id) {
      return;
    }

    try {

      const response = await api.get(
        `/notifications/${user.id}`
      );

      setNotifications(
        response.data.notifications
      );

    } catch (error) {

      console.error(
        "Failed to fetch notifications:",
        error
      );

    }

  };


  // -----------------------------------------
  // Initial notification check
  // -----------------------------------------

  useEffect(() => {

    fetchUnreadCount();

    fetchNotifications();

    const interval = setInterval(
      fetchUnreadCount,
      10000
    );

    return () => {
      clearInterval(interval);
    };

  }, [user?.id]);


  // -----------------------------------------
  // Open notification panel
  // -----------------------------------------

  const toggleNotifications = async () => {

    const newState = !notificationsOpen;

    setNotificationsOpen(
      newState
    );

    if (newState) {

      await fetchNotifications();

    }

  };


  // -----------------------------------------
  // Mark notification as read
  // -----------------------------------------

  const markAsRead = async (
    notificationId
  ) => {

    try {

      await api.put(
        `/notifications/${notificationId}/read`
      );

      await fetchNotifications();

      await fetchUnreadCount();

    } catch (error) {

      console.error(
        "Failed to mark notification:",
        error
      );

    }

  };


  // -----------------------------------------
  // Mark all as read
  // -----------------------------------------

  const markAllAsRead = async () => {

    if (!user?.id) {
      return;
    }

    try {

      await api.put(
        `/notifications/${user.id}/read-all`
      );

      await fetchNotifications();

      await fetchUnreadCount();

    } catch (error) {

      console.error(
        "Failed to mark notifications:",
        error
      );

    }

  };


  // -----------------------------------------
  // Delete notification
  // -----------------------------------------

  const deleteNotification = async (
    notificationId
  ) => {

    try {

      await api.delete(
        `/notifications/${notificationId}`
      );

      await fetchNotifications();

      await fetchUnreadCount();

    } catch (error) {

      console.error(
        "Failed to delete notification:",
        error
      );

    }

  };


  // -----------------------------------------
  // Logout
  // -----------------------------------------

  const logout = () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    navigate(
      "/login"
    );

  };


  return (

    <header className="h-16 bg-slate-900 border-b border-slate-700 flex items-center justify-between px-8 relative">

      {/* -------------------------------- */}
      {/* LEFT */}
      {/* -------------------------------- */}

      <div className="flex items-center gap-3">

        <div className="bg-blue-600 p-2 rounded-xl shadow-lg">

          <BrainCircuit
            size={26}
            color="white"
          />

        </div>

        <div>

          <h1 className="text-xl font-bold text-white">
            Enterprise RAG
          </h1>

          <p className="text-xs text-slate-400">
            AI Document Assistant
          </p>

        </div>

      </div>


      {/* -------------------------------- */}
      {/* CENTER */}
      {/* -------------------------------- */}

      <div className="flex items-center gap-3">

        <span className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />

        <p className="text-green-400 font-medium">
          AI Ready
        </p>

      </div>


      {/* -------------------------------- */}
      {/* RIGHT */}
      {/* -------------------------------- */}

      <div className="flex items-center gap-5 relative">


        {/* ================================= */}
        {/* NOTIFICATION */}
        {/* ================================= */}

        <button
          onClick={toggleNotifications}
          className="relative p-2 rounded-lg hover:bg-slate-800 transition"
        >

          <Bell
            size={22}
            className="text-slate-300 hover:text-white transition"
          />


          {/* Unread badge */}

          {unreadCount > 0 && (

            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center">

              {unreadCount > 99
                ? "99+"
                : unreadCount}

            </span>

          )}

        </button>


        {/* ================================= */}
        {/* NOTIFICATION PANEL */}
        {/* ================================= */}

        {notificationsOpen && (

          <div className="absolute right-20 top-14 w-96 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">


            {/* Header */}

            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">

              <div>

                <h3 className="text-white font-semibold">
                  Notifications
                </h3>

                <p className="text-xs text-slate-400">
                  {unreadCount} unread
                </p>

              </div>


              {unreadCount > 0 && (

                <button
                  onClick={markAllAsRead}
                  className="text-blue-400 hover:text-blue-300 text-xs"
                >
                  Mark all as read
                </button>

              )}

            </div>


            {/* Notifications */}

            <div className="max-h-96 overflow-y-auto">

              {notifications.length === 0 ? (

                <div className="p-8 text-center">

                  <Bell
                    size={30}
                    className="mx-auto text-slate-600 mb-3"
                  />

                  <p className="text-slate-400 text-sm">
                    No notifications
                  </p>

                </div>

              ) : (

                notifications.map(
                  (notification) => (

                    <div
                      key={notification.id}
                      className={`px-5 py-4 border-b border-slate-800 hover:bg-slate-800 transition ${
                        !notification.is_read
                          ? "bg-slate-800/50"
                          : ""
                      }`}
                    >

                      <div className="flex gap-3">

                        {/* Icon */}

                        <div className="w-9 h-9 rounded-lg bg-blue-600/20 flex items-center justify-center flex-shrink-0">

                          <Bell
                            size={17}
                            className="text-blue-400"
                          />

                        </div>


                        {/* Content */}

                        <div className="flex-1 min-w-0">

                          <div className="flex items-start justify-between gap-2">

                            <h4 className="text-sm font-semibold text-white">

                              {notification.title}

                            </h4>

                            {!notification.is_read && (

                              <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />

                            )}

                          </div>

                          <p className="text-xs text-slate-400 mt-1">

                            {notification.message}

                          </p>

                          <div className="flex gap-3 mt-3">

                            {!notification.is_read && (

                              <button
                                onClick={() =>
                                  markAsRead(
                                    notification.id
                                  )
                                }
                                className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
                              >

                                <Check size={13} />

                                Mark read

                              </button>

                            )}

                            <button
                              onClick={() =>
                                deleteNotification(
                                  notification.id
                                )
                              }
                              className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300"
                            >

                              <Trash2 size={13} />

                              Delete

                            </button>

                          </div>

                        </div>

                      </div>

                    </div>

                  )
                )

              )}

            </div>

          </div>

        )}


        {/* ================================= */}
        {/* THEME */}
        {/* ================================= */}

        <Moon
          size={22}
          className="cursor-pointer text-slate-300 hover:text-white transition"
        />


        {/* ================================= */}
        {/* SETTINGS */}
        {/* ================================= */}

        <Settings
          size={22}
          className="cursor-pointer text-slate-300 hover:text-white transition"
        />


        {/* ================================= */}
        {/* USER */}
        {/* ================================= */}

        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-3 hover:bg-slate-800 px-3 py-2 rounded-xl transition"
        >

          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
              user?.name || "User"
            )}&background=2563eb&color=fff`}
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-blue-500"
          />


          <div className="hidden md:block text-left">

            <p className="text-white text-sm font-semibold">
              {user?.name || "User"}
            </p>

            <p className="text-slate-400 text-xs">
              {user?.email || ""}
            </p>

          </div>


          <ChevronDown
            size={18}
            className={`text-slate-400 transition-transform ${
              open
                ? "rotate-180"
                : ""
            }`}
          />

        </button>


        {/* ================================= */}
        {/* USER DROPDOWN */}
        {/* ================================= */}

        {open && (

          <div className="absolute right-0 top-16 w-60 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50">

            <div className="px-5 py-4 border-b border-slate-700">

              <p className="font-semibold text-white">
                {user?.name}
              </p>

              <p className="text-sm text-slate-400">
                {user?.email}
              </p>

            </div>


            <button
              onClick={logout}
              className="flex items-center gap-3 w-full px-5 py-4 text-red-400 hover:bg-slate-800 transition"
            >

              <LogOut
                size={18}
              />

              Logout

            </button>

          </div>

        )}

      </div>

    </header>

  );

}

export default Navbar;