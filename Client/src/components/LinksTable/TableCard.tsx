import { BarChart3, Clock, Copy, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { EditModal } from "../Modals/EditModal";
import { ModalBackground } from "../Modals/ModalBackground";
import { AnimatePresence, motion } from "framer-motion";
import { DeleteModal } from "../Modals/DeleteModal";
import { useScrollLock } from "../../hooks/useScrollLock";
import type { TableCardProps } from "../../types";

export const TableCard = ({
  originalUrl,
  shortCode,
  clicks,
  date,
  code,
  id,
}: TableCardProps) => {
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(shortCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  const handleEditClick = () => {
    setEditModal(true);
  };
  const handleDeleteClick = () => {
    setDeleteModal(true);
  };

  useScrollLock(editModal || deleteModal);

  return (
    <div>
      <article className="relative flex flex-col justify-between rounded-xl border border-gray-700 hover:border-emerald-700 items-center gap-2 bg-gradient-to-br from-slate-800 to-slate-900 p-3 max-w ">
        <section className="flex justify-between w-full">
          <div className="flex gap-2 items-center">
            <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full max-w-64 sm:max-w-none">
              <a
                href={shortCode}
                rel="noopener noreferrer"
                title={shortCode}
                className="text-emerald-400 font-mono text-sm font-semibold truncate block"
                target="_blank"
              >
                {shortCode}
              </a>
            </div>
            <button
              onClick={handleCopy}
              className="group p-2 hover:bg-slate-700 rounded-lg transition-colors hover:cursor-pointer"
            >
              <Copy
                className="group-hover:text-white text-gray-400"
                size={16}
              />
            </button>
            <AnimatePresence>
              {copied && (
                <motion.span
                  initial={{ opacity: 0, x: "-20px" }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: "-20px" }}
                  className="sm:ml-2 text-xs text-emerald-400"
                >
                  Copied!
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <nav
            className="flex gap-2 absolute right-2.5 bottom-2.5"
            aria-label="Acciones del enlace"
          >
            <button
              onClick={handleEditClick}
              className="group p-2 hover:bg-slate-700 rounded-lg transition-colors hover:cursor-pointer"
            >
              <Edit
                className="group-hover:text-emerald-400 text-gray-400"
                size={16}
              />
            </button>
            <button
              onClick={handleDeleteClick}
              className="group p-2 hover:bg-red-500/10 rounded-lg transition-colors hover:cursor-pointer"
            >
              <Trash2
                className="group-hover:text-red-400 text-gray-400"
                size={16}
              />
            </button>
          </nav>
        </section>
        <div className="flex flex-col text-gray-300 items-start self-start">
          <p className="truncate max-w-64 sm:max-w-96" title={originalUrl}>
            {originalUrl}
          </p>
        </div>
        <section className="flex items-center gap-4 text-xs text-slate-400 self-start">
          <div className="flex items-center gap-1">
            <BarChart3 size={12} />
            <span>{clicks} clicks</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={12} />
            <span>{date}</span>
          </div>
        </section>
      </article>
      <AnimatePresence>
        {editModal && (
          <>
            <ModalBackground onClick={() => setEditModal(false)} />
            <EditModal
              shortCode={code}
              originalUrl={originalUrl}
              setEditModal={setEditModal}
              id={id}
            />
          </>
        )}
        {deleteModal && (
          <>
            <ModalBackground onClick={() => setDeleteModal(false)} />
            <DeleteModal id={id} setDeleteModal={setDeleteModal} />
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
