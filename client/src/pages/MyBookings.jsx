import React, { useEffect, useState } from "react";
import Loading from "../components/Loading";
import BlurCircle from "../components/BlurCircle";
import dateFormat from "../lib/dateFormat";
import { useAppContext } from "../context/AppContext";
import timeFormat from "../lib/timeFormat";
import { Link } from "react-router-dom";

const MyBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const { axios, getToken, user, image_base_url } = useAppContext();

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getMyBookings = async () => {
    try {
      const { data } = await axios.get("/api/user/bookings", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (user) {
      getMyBookings();
    }
  }, [user]);

  return !isLoading ? (
    <div className="relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[85vh] overflow-hidden text-white">
      <BlurCircle top="80px" right="80px" />
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              My Bookings
            </h1>
          </div>
        </div>

        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-900/20 border border-gray-900/60 rounded-3xl backdrop-blur-sm">
            <svg
              className="w-16 h-16 text-gray-600 stroke-[1.5] mb-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
              <line x1="7" y1="2" x2="7" y2="22" />
              <line x1="17" y1="2" x2="17" y2="22" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <line x1="2" y1="7" x2="7" y2="7" />
              <line x1="2" y1="17" x2="7" y2="17" />
              <line x1="17" y1="17" x2="22" y2="17" />
              <line x1="17" y1="7" x2="22" y2="7" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-300">
              No bookings found
            </h3>
            <p className="text-sm text-gray-500 mt-1 mb-6 max-w-xs text-center">
              You haven't booked any movie tickets yet.
            </p>
            <Link
              to="/movies"
              className="bg-primary hover:bg-primary-dull text-white px-6 py-2.5 rounded-full font-medium transition duration-300 flex items-center gap-2"
            >
              Explore Movies
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {bookings.map((item, index) => {
              const formattedDate = dateFormat(item.show.showDateTime);
              return (
                <div
                  key={index}
                  className="group relative flex flex-col md:flex-row bg-gray-900/40 border border-gray-800/80 hover:border-primary/30 rounded-2xl overflow-hidden backdrop-blur-md shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5"
                >
                  {/* Decorative Ticket Side Cuts (Classic Ticket Stub notch effect) */}
                  <div className="hidden md:block absolute left-[calc(100%_-_180px)] -top-3 w-6 h-6 bg-[#09090e] rounded-full border border-gray-800 z-10"></div>
                  <div className="hidden md:block absolute left-[calc(100%_-_180px)] -bottom-3 w-6 h-6 bg-[#09090e] rounded-full border border-gray-800 z-10"></div>

                  {/* Left Section: Poster & Main Info */}
                  <div className="flex flex-col sm:flex-row flex-1 p-5 gap-5">
                    {/* Poster */}
                    <div className="relative w-full sm:w-28 h-40 flex-shrink-0 overflow-hidden rounded-xl border border-gray-800 group-hover:scale-[1.02] transition-transform duration-300">
                      <img
                        src={image_base_url + item.show.movie.poster_path}
                        alt={item.show.movie.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent"></div>
                    </div>

                    {/* Movie Info */}
                    <div className="flex flex-col justify-between py-1">
                      <div>
                        <h2 className="text-xl font-bold tracking-tight text-white group-hover:text-primary transition duration-300">
                          {item.show.movie.title}
                        </h2>

                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <span className="text-xs font-semibold bg-gray-800 text-gray-300 px-2.5 py-0.5 rounded-full border border-gray-700">
                            {timeFormat(item.show.movie.runtime)}
                          </span>
                          {item.show.movie.genres
                            ?.slice(0, 2)
                            .map((genre, i) => (
                              <span
                                key={i}
                                className="text-xs bg-primary/10 text-primary-dull px-2.5 py-0.5 rounded-full"
                              >
                                {genre.name}
                              </span>
                            ))}
                        </div>
                      </div>

                      {/* Showtime & Date */}
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center gap-2.5 text-sm text-gray-300">
                          <svg
                            className="w-4 h-4 text-primary"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect
                              x="3"
                              y="4"
                              width="18"
                              height="18"
                              rx="2"
                              ry="2"
                            />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                          <span>
                            {formattedDate.split(" at ")[0] || formattedDate}
                          </span>
                        </div>
                        <div className="flex items-center gap-2.5 text-sm text-gray-300">
                          <svg
                            className="w-4 h-4 text-primary"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                          <span>
                            {formattedDate.split(" at ")[1] ||
                              "Showtime Details"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Vertical dashed divider */}
                  <div className="relative border-t-2 border-dashed border-gray-800 my-2 md:my-0 md:border-t-0 md:border-l-2 md:left-[-1px] self-stretch opacity-60"></div>

                  {/* Right Section: Ticket details and Actions */}
                  <div className="flex flex-col justify-between p-5 md:w-[180px] bg-gray-900/20 backdrop-blur-sm min-h-[160px]">
                    <div className="space-y-4">
                      {/* Status Badge */}
                      <div className="flex justify-start md:justify-end">
                        {item.isPaid ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <svg
                              className="w-3.5 h-3.5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                              <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                            Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <svg
                              className="w-3.5 h-3.5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <line x1="12" y1="8" x2="12" y2="12" />
                              <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            Unpaid
                          </span>
                        )}
                      </div>

                      {/* Ticket Seats Details */}
                      <div className="text-sm space-y-1 text-left md:text-right">
                        <div className="text-gray-400 flex items-center gap-1.5 md:justify-end">
                          <svg
                            className="w-3.5 h-3.5 text-gray-500"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                            <line x1="13" y1="5" x2="13" y2="19" />
                          </svg>
                          <span>
                            {item.bookedSeats.length}{" "}
                            {item.bookedSeats.length > 1 ? "Tickets" : "Ticket"}
                          </span>
                        </div>
                        <p className="font-semibold text-white tracking-wide">
                          Seats:{" "}
                          <span className="text-primary">
                            {item.bookedSeats.join(", ")}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Total Price and Action */}
                    <div className="mt-6 md:mt-0 space-y-3 text-left md:text-right">
                      <div>
                        <span className="text-xs text-gray-500 block">
                          Total Amount
                        </span>
                        <p className="text-2xl font-extrabold text-white">
                          {currency}
                          {item.amount}
                        </p>
                      </div>

                      {!item.isPaid && item.paymentLink && (
                        <Link
                          to={item.paymentLink}
                          className="inline-flex items-center justify-center gap-1.5 w-full bg-gradient-to-r from-primary to-rose-600 hover:from-primary-dull hover:to-rose-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition duration-300 shadow-md shadow-primary/10 cursor-pointer"
                        >
                          Pay Now
                          <svg
                            className="w-3.5 h-3.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                          </svg>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default MyBookings;
