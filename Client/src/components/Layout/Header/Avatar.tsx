import { Button } from "../../UI/Button";
import { LogOut, User2 } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";

export const Avatar = () => {
  const { logout, user } = useAuth();
  const [showLogOut, setShowLogOut] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShowLogOut(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowLogOut(false);
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onClick={() => {
        setShowLogOut(true);
        setTimeout(() => setShowLogOut(false), 3000);
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative flex items-center gap-4 rounded-3xl"
    >
      <AnimatePresence mode="wait">
        {showLogOut && (
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 60 }}
            exit={{ opacity: 0, y: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0"
          >
            <Button
              text="Log out"
              gradient={false}
              className="hover:bg-red-500/20! hover:ring-2 ring-red-600 hover:text-red-300 transition-all duration-200 min-w-32"
              icon={<LogOut size={16} />}
              onClick={logout}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="group-hover:shadow-[0px_0px_20px_#00d492] flex bg-slate-800 items-center gap-4 text-emerald-400 text-lg font-semibold rounded-full group-hover:bg-slate-900 sm:pl-4  border-2 border-emerald-500">
        <p className="hidden sm:block">{user?.name}</p>
        <div className="flex items-center justify-center w-12 h-12 rounded-full group-hover:bg-slate-900 ring-3 ring-emerald-500 cursor-pointer transition-all duration-200 bg-slate-800  text-gray-600 font-bold">
          {user?.picture ? (
            <img
              src={user?.picture}
              alt="User avatar"
              className="w-12 h-12 rounded-full object-cover"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
          ) : (
            <User2 className="text-emerald-500"></User2>
          )}
        </div>
      </div>
    </div>
  );
};
