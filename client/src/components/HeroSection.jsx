import { assets } from "../assets/assets";
import { ArrowRight, CalendarIcon, ClockIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36 h-screen bg-[linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.6)),url('/backgroundImage.png')] bg-cover bg-center">
      <img
        src={assets.syncopy_logo}
        alt="syncopy_logo"
        className="max-h-11 lg:h-11 mt-20"
      />
      <h1 className="text-white text-5xl md:text-[70px] font-semibold">
        Interstellar
      </h1>
      <div className="flex items-center gap-4 text-gray-300 font-medium">
        <span>Action | Adventure | Sci-Fi</span>
        <div className="flex items-center gap-1">
          <CalendarIcon className="w-4.5 h-4.5" /> 2014
        </div>
        <div className="flex items-center gap-1">
          <ClockIcon className="w-4.5 h-4.5" /> 2h 49m
        </div>
      </div>
      <p className="max-w-md text-gray-300">
        A team of explorers travel through a wormhole in space in an attempt to
        ensure humanity's survival.
      </p>
      <button
        onClick={() => navigate("/movies")}
        className="flex items-center gap-1 px-6 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medirm cursor-pointer"
      >
        Explore Movies
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default HeroSection;
