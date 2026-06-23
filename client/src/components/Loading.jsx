import React from "react";
import { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const Loading = () => {
  const { nextUrl } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { axios, getToken } = useAppContext();

  useEffect(() => {
    const verifyAndNavigate = async () => {
      if (sessionId) {
        try {
          await axios.post(
            "/api/booking/verify",
            { sessionId },
            { headers: { Authorization: `Bearer ${await getToken()}` } }
          );
        } catch (error) {
          console.error("Error verifying payment:", error);
        }
      }
      navigate("/" + nextUrl);
    };

    if (nextUrl) {
      if (sessionId) {
        verifyAndNavigate();
      } else {
        const timer = setTimeout(() => {
          navigate("/" + nextUrl);
        }, 8000);
        return () => clearTimeout(timer);
      }
    }
  }, [nextUrl, sessionId]);
  return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="animate-spin rounded-full h-14 w-14 border-2 border-t-primary"></div>
    </div>
  );
};

export default Loading;
