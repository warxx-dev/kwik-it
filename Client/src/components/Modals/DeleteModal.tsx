import { AlertTriangle, X } from "lucide-react";
import { Button } from "../UI/Button";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import { useContext, type Dispatch, type SetStateAction } from "react";
import { LinkContext } from "../../context/linkContext";
import { AlertContext } from "../../context/alertContext";
const apiUrl = import.meta.env.VITE_API_URL;

export const DeleteModal = ({
  setDeleteModal,
  id,
}: {
  setDeleteModal: Dispatch<SetStateAction<boolean>>;
  id: number;
}) => {
  const { links, setLinks } = useContext(LinkContext);
  const { showAlert } = useContext(AlertContext);

  const handleClose = () => {
    setDeleteModal(false);
  };
  const handleDelete = () => {
    fetch(`${apiUrl}/link/${id}`, {
      method: "DELETE",
      credentials: "include",
    }).then((response) => {
      if (!response.ok) {
        console.error("Error deleting link");
      }
      setLinks(links.filter((link) => link.id !== id));
      showAlert({
        type: "success",
        title: "Link Deleted",
        message: "The link has been successfully deleted.",
      });
    });

    setDeleteModal(false);
  };
  return createPortal(
    <motion.section
      initial={{ opacity: 0, filter: "blur(8px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(8px)" }}
      transition={{ duration: 0.15 }}
      className="bg-gray-700/30 border border-slate-700 rounded-xl shadow-2xl max-w-md w-full fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col gap-6 p-6"
    >
      <div className="bg-red-500/20 p-4 rounded-xl self-center border border-red-500/40">
        <AlertTriangle className="text-red-400" />
      </div>
      <Button
        icon={<X className="text-slate-400" />}
        className="p-1! absolute right-4 bg-transparent! hover:bg-gray-600!"
        gradient={false}
        onClick={handleClose}
      />
      <h2 className="text-white font-bold text-2xl mt-2">Delete Link?</h2>
      <p>Are you sure you want to delete this link?</p>
      <span className="text-slate-400">This action can't be undone.</span>
      <nav className="flex gap-2 mt-4">
        <Button
          className="flex-1 bg-slate-700! hover:bg-slate-600!"
          gradient={false}
          text="Cancel"
          onClick={handleClose}
        />
        <Button
          onClick={handleDelete}
          className="flex-1 hover:bg-red-400/30! hover:text-red-500 hover:ring-2 ring-red-500! bg-red-500!"
          gradient={false}
          text="Delete"
        />
      </nav>
    </motion.section>,
    document.body,
  );
};
