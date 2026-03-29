import { X } from "lucide-react";
import { Input } from "../UI/Input";
import { Button } from "../UI/Button";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import type { EditModalProps } from "../../types";
import { useContext } from "react";
import { LinkContext } from "../../context/linkContext";
import { AlertContext } from "../../context/alertContext";
const apiUrl = import.meta.env.VITE_API_URL;

export const EditModal = ({
  shortCode,
  originalLink,
  setEditModal,
  id,
}: EditModalProps) => {
  const { links, setLinks } = useContext(LinkContext);
  const { showAlert } = useContext(AlertContext);
  const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setEditModal(false);
  };
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const updatedShortCode = formData.get("shortCode")?.toString() ?? "";
    const updatedOriginalLink = formData.get("originalLink")?.toString() ?? "";

    try {
      const res = await fetch(`${apiUrl}/link/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: updatedShortCode,
          originalLink: updatedOriginalLink,
        }),
        credentials: "include",
      });

      if (res.ok) {
        showAlert({
          type: "success",
          title: "Link Updated",
          message: "The link has been successfully updated.",
        });
        setEditModal(false);
        setLinks(
          links.map((link) =>
            link.id === id
              ? {
                  ...link,
                  code: updatedShortCode,
                  originalLink: updatedOriginalLink,
                }
              : link,
          ),
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return createPortal(
    <motion.section
      initial={{ opacity: 0, filter: "blur(8px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(8px)" }}
      transition={{ duration: 0.15 }}
      className="bg-gray-700/30 border z-30 border-slate-700 rounded-xl shadow-2xl max-w-md w-full fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 "
    >
      <div className="flex items-center justify-between p-6 border-b border-slate-700">
        <h2 className="text-xl font-bold text-white">Edit Link</h2>
        <Button
          icon={<X className="text-slate-400" />}
          className="p-1! bg-transparent! hover:bg-gray-600!"
          gradient={false}
          onClick={handleClose}
        />
      </div>
      <form className="p-6 flex flex-col gap-2" onSubmit={handleUpdate}>
        <Input
          placeholder="Short code"
          text="Short code"
          name="shortCode"
          defaultValue={shortCode}
        />
        <Input
          placeholder="Original URL"
          text="Original URL"
          name="originalLink"
          defaultValue={originalLink}
        />
        <nav className="flex gap-2 mt-4">
          <Button
            gradient={false}
            className="bg-slate-700! flex-1 hover:bg-slate-600!"
            text="Cancel"
            onClick={handleClose}
          />
          <Button text="Save changes" className="flex-1" type="submit" />
        </nav>
      </form>
    </motion.section>,
    document.body,
  );
};
