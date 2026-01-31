"use client";

import { useState } from "react";

export interface ArtInquireProject {
  title: string;
  collection?: string;
  author?: string;
  icon?: string;
  images?: string[];
}

interface ArtInquireFormProps {
  project: ArtInquireProject;
  onClose: () => void;
}

export default function ArtInquireForm({ project, onClose }: ArtInquireFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [comments, setComments] = useState("");

  const displayTitle = project.title?.trim() || "";
  const thumbnail = project.icon || project.images?.[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: send inquiry (e.g. API)
  };

  return (
    <div
      className="fixed left-0 right-0 z-[60] flex flex-col w-full art-expanded-below-header art-inquire-form-content bg-[#FFF3DF]"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
      role="dialog"
      aria-label="Inquire about artwork"
    >
      <div
        className="relative w-full flex-1 min-h-0 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-wrap gap-2 md:gap-4 p-2 md:p-6 pb-1 md:pb-4 flex-shrink-0">
          <div className="min-w-0 flex-1">
            <p className="text-[#524b44] font-electrolize text-[10px] md:text-sm mb-0.5">Inquire about:</p>
            <h2 className="text-[#4A413C] font-blurlight font-bold text-base md:text-xl uppercase tracking-wider leading-tight">
              {displayTitle}
            </h2>
            {(project.author || "").trim() ? (
              <p className="text-[#4A413C]/80 font-blurlight text-xs md:text-sm mt-1 md:mt-2">By {(project.author || "").trim()}</p>
            ) : null}
          </div>
          {thumbnail ? (
            <div className="w-14 h-14 md:w-20 md:h-20 flex-shrink-0 rounded-sm overflow-hidden bg-[#e8e0d5]">
              <img src={thumbnail} alt="" className="w-full h-full object-cover" />
            </div>
          ) : null}
        </div>

        <form onSubmit={handleSubmit} className="flex-1 min-h-0 flex flex-col overflow-hidden p-2 md:p-6">
          <div className="flex-1 min-h-0 flex flex-col gap-1 md:gap-4 overflow-hidden">
            <div className="flex-shrink-0">
              <label htmlFor="inq-name" className="block text-[#524b44] font-electrolize text-[10px] md:text-sm mb-0.5">
                Name (required)
              </label>
              <input
                id="inq-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-2 md:px-3 py-1 md:py-2 bg-white border border-[#4A413C]/40 rounded-sm text-[#524b44] font-electrolize text-xs md:text-sm focus:outline-none focus:border-[#4A413C]"
              />
            </div>
            <div className="flex-shrink-0">
              <label htmlFor="inq-email" className="block text-[#524b44] font-electrolize text-[10px] md:text-sm mb-0.5">
                Email Address (required)
              </label>
              <input
                id="inq-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-2 md:px-3 py-1 md:py-2 bg-white border border-[#4A413C]/40 rounded-sm text-[#524b44] font-electrolize text-xs md:text-sm focus:outline-none focus:border-[#4A413C]"
              />
            </div>
            <div className="flex-shrink-0">
              <label htmlFor="inq-phone" className="block text-[#524b44] font-electrolize text-[10px] md:text-sm mb-0.5">
                Phone Number
              </label>
              <input
                id="inq-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-2 md:px-3 py-1 md:py-2 bg-white border border-[#4A413C]/40 rounded-sm text-[#524b44] font-electrolize text-xs md:text-sm focus:outline-none focus:border-[#4A413C]"
              />
            </div>
            <div className="flex-shrink-0 md:flex-1 md:min-h-0 md:flex md:flex-col">
              <label htmlFor="inq-comments" className="block text-[#524b44] font-electrolize text-[10px] md:text-sm mb-0.5 flex-shrink-0">
                Comments (required)
              </label>
              <textarea
                id="inq-comments"
                required
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full min-h-[2.25rem] h-10 md:h-auto md:flex-1 md:min-h-0 px-2 md:px-3 py-1 md:py-2 bg-white border border-[#4A413C]/40 rounded-sm text-[#524b44] font-electrolize text-xs md:text-sm focus:outline-none focus:border-[#4A413C] resize-none"
              />
            </div>
          </div>
          <div className="flex-shrink-0 mt-2 md:mt-6 flex justify-center">
            <button
              type="submit"
              className="bg-[#524b44] hover:bg-[#48423c] text-[#FFF3DF] font-blurlight font-bold uppercase tracking-wider py-1.5 md:py-2.5 px-5 md:px-8 rounded-sm transition-colors text-[10px] md:text-sm"
            >
              SUBMIT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
