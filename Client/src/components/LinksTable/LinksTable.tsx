import { TableCard } from "./TableCard";
import { LinkContext } from "../../context/linkContext";
import { useContext, useEffect, useState } from "react";
import { BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import { AlertContext } from "../../context/alertContext";
import { EmptyTable } from "./EmptyTable";
const apiUrl = import.meta.env.VITE_API_URL;

export const LinksTable = () => {
  const { links, setLinks } = useContext(LinkContext);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { showAlert } = useContext(AlertContext);

  useEffect(() => {
    fetch(`${apiUrl}/link?email=${user?.email}`, { credentials: "include" })
      .then((response) => {
        if (!response.ok) {
          response.json().then((data) =>
            showAlert({
              type: "info",
              title: "Info",
              message: (data.message as string) || "Failed to fetch links",
            }),
          );
          return [];
        }
        return response.json();
      })
      .then((data) => {
        setLinks(data);
        setIsLoading(false);
      })
      .catch((error) => {
        showAlert({
          type: "error",
          title: "Error",
          message: error.message || "Failed to fetch links",
        });
      });
  }, [setLinks, user?.email]);

  return (
    <motion.div
      initial={{ opacity: 0, transform: "translateY(-20px)" }}
      animate={{ opacity: 1, transform: "translateY(0px)" }}
      exit={{ opacity: 0, transform: "translateY(20px)" }}
      transition={{ duration: 0.3 }}
      className="text-center flex flex-col justify-center rounded-lg p-4 max-w-2xl w-full"
    >
      {isLoading ? (
        <div className=" p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="text-slate-400 mt-4">Loading your links...</p>
        </div>
      ) : links.length != 0 ? (
        <>
          <h2 className="text-2xl font-semibold pb-2 flex items-center gap-2">
            <BarChart3 className="text-emerald-400" />
            Manage your Links
          </h2>
          <section className="rounded-lg flex gap-2 flex-col">
            {links.map((link) => {
              return (
                <TableCard
                  id={link.id}
                  key={link.code}
                  code={link.code}
                  originalLink={link.originalLink}
                  shortLink={`${apiUrl}/${link.code}`}
                  clicks={link.clicks}
                  date={new Date(link.createdAt).toLocaleDateString()}
                />
              );
            })}
          </section>
        </>
      ) : (
        <EmptyTable />
      )}
    </motion.div>
  );
};
