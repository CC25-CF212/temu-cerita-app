import { teamMembers } from "@/data/mockData";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
const Footer: React.FC = () => {
  const [focusedImage, setFocusedImage] = useState<string | null>(null);

  return (
    <footer className="bg-gray-100 py-8">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-6 md:mb-0">
            <h2 className="font-bold text-xl mb-2">TemuCerita</h2>
            <p className="text-sm text-gray-600 mb-4">
              Discover and share stories that matter.
            </p>
            <div className="flex space-x-4">
              {teamMembers.map((member) => (
                <img
                  key={member.id}
                  src={member.avatarUrl}
                  alt={member.name}
                  onClick={() => setFocusedImage(member.avatarUrl)}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ))}
            </div>
            <AnimatePresence>
              {focusedImage && (
                <motion.div
                  className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setFocusedImage(null)}
                >
                  <motion.img
                    src={focusedImage}
                    alt="Focused"
                    className="max-w-[90%] max-h-[90%] rounded-lg shadow-lg cursor-grab"
                    drag
                    dragConstraints={{
                      top: -100,
                      bottom: 100,
                      left: -100,
                      right: 100,
                    }}
                    dragElastic={0.2}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            © 2025 TemuCerita. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
