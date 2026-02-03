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
  const artworkImage = project.images?.[0] || project.icon;

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
        className="relative w-full flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile: single column. Desktop: left column = inquiry text + artwork image (left, bigger) */}
        <div className="flex flex-col flex-shrink-0 md:min-w-0 md:flex-1 md:overflow-hidden">
          <div className="flex flex-wrap gap-2 md:gap-4 p-2 md:p-6 pb-1 md:pb-4 flex-shrink-0 items-start md:flex-col md:items-center md:text-center">
            <div className="min-w-0 flex-1 md:flex-none">
              <p className="text-[#524b44] font-electrolize text-[10px] md:text-sm mb-0.5">Inquire about:</p>
              <h2 className="text-[#4A413C] font-blurlight font-bold text-base md:text-xl uppercase tracking-wider leading-tight">
                {displayTitle}
              </h2>
              {(project.author || "").trim() ? (
                <p className="text-[#4A413C]/80 font-blurlight text-xs md:text-sm mt-1 md:mt-2">By {(project.author || "").trim()}</p>
              ) : null}
            </div>
            {thumbnail ? (
              <div className="w-14 h-14 md:hidden flex-shrink-0 rounded-sm overflow-hidden bg-[#e8e0d5]">
                <img src={thumbnail} alt="" className="w-full h-full object-cover" />
              </div>
            ) : null}
          </div>
          {/* Desktop only: artwork image on the left, bigger */}
          {artworkImage && (
            <div className="hidden md:flex flex-1 min-h-0 px-6 pb-6 pt-0 overflow-hidden">
              <div className="w-full h-full max-h-[70vh] rounded-sm overflow-hidden bg-[#e8e0d5]">
                <img src={artworkImage} alt={displayTitle} className="w-full h-full object-contain" />
              </div>
            </div>
          )}
        </div>

        {/* Form: mobile full width. Desktop: 3/4 width, pivot right (right edge fixed) */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 min-h-0 flex flex-col overflow-hidden p-3 md:p-6 md:pl-4 md:flex md:flex-col md:items-end"
        >
          <div className="w-full md:w-[75%] md:max-w-[315px] flex-1 min-h-0 flex flex-col gap-2 md:gap-4 overflow-hidden">
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
            <div className="flex-1 min-h-0 flex flex-col">
              <label htmlFor="inq-comments" className="block text-[#524b44] font-electrolize text-[10px] md:text-sm mb-0.5 flex-shrink-0">
                Comments (required)
              </label>
              <textarea
                id="inq-comments"
                required
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full flex-1 min-h-[4rem] md:min-h-[6rem] px-2 md:px-3 py-1 md:py-2 bg-white border border-[#4A413C]/40 rounded-sm text-[#524b44] font-electrolize text-xs md:text-sm focus:outline-none focus:border-[#4A413C] resize-none"
              />
            </div>
          </div>
          <div className="w-full md:w-[75%] md:max-w-[315px] flex-shrink-0 mt-3 md:mt-6 flex justify-center md:justify-start">
            <button
              type="submit"
              className="bg-[#524b44] hover:bg-[#48423c] text-[#FFF3DF] font-electrolize font-bold uppercase tracking-wider py-2 md:py-2.5 px-6 md:px-8 rounded-sm transition-colors text-xs md:text-sm"
            >
              SUBMIT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
