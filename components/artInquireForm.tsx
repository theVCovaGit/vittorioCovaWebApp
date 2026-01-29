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

  const displayTitle = [project.collection, project.title].filter(Boolean).join(" ").trim() || project.title;
  const thumbnail = project.icon || project.images?.[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: send inquiry (e.g. API)
  };

  return (
    <div
      className="fixed left-0 right-0 z-[60] flex flex-col w-full art-expanded-below-header bg-[#FFF3DF]"
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
        <div className="flex flex-wrap gap-4 p-6 pb-4 border-b border-[#4A413C]/20">
          <div className="min-w-0 flex-1">
            <p className="text-[#C6898F] font-blurlight text-sm mb-1">Inquire about:</p>
            <h2 className="text-[#4A413C] font-blurlight font-bold text-xl uppercase tracking-wider leading-tight">
              {displayTitle}
            </h2>
            {(project.author || "").trim() ? (
              <p className="text-[#4A413C]/80 font-blurlight text-sm mt-2">By {(project.author || "").trim()}</p>
            ) : null}
          </div>
          {thumbnail ? (
            <div className="w-20 h-20 flex-shrink-0 rounded-sm overflow-hidden border-2 border-[#4A413C] bg-[#e8e0d5]">
              <img src={thumbnail} alt="" className="w-full h-full object-cover" />
            </div>
          ) : null}
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="inq-name" className="block text-[#4A413C] font-blurlight text-sm mb-1">
                Name (required)
              </label>
              <input
                id="inq-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#4A413C]/40 rounded-sm text-[#4A413C] font-blurlight text-sm focus:outline-none focus:border-[#4A413C]"
              />
            </div>
            <div>
              <label htmlFor="inq-email" className="block text-[#4A413C] font-blurlight text-sm mb-1">
                Email Address (required)
              </label>
              <input
                id="inq-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#4A413C]/40 rounded-sm text-[#4A413C] font-blurlight text-sm focus:outline-none focus:border-[#4A413C]"
              />
            </div>
            <div>
              <label htmlFor="inq-phone" className="block text-[#4A413C] font-blurlight text-sm mb-1">
                Phone Number
              </label>
              <input
                id="inq-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#4A413C]/40 rounded-sm text-[#4A413C] font-blurlight text-sm focus:outline-none focus:border-[#4A413C]"
              />
            </div>
            <div>
              <label htmlFor="inq-comments" className="block text-[#4A413C] font-blurlight text-sm mb-1">
                Comments (required)
              </label>
              <textarea
                id="inq-comments"
                required
                rows={4}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#4A413C]/40 rounded-sm text-[#4A413C] font-blurlight text-sm focus:outline-none focus:border-[#4A413C] resize-y min-h-[80px]"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              className="bg-[#524b44] hover:bg-[#48423c] text-[#FFF3DF] font-blurlight font-bold uppercase tracking-wider py-2.5 px-8 rounded-sm transition-colors text-sm"
            >
              SUBMIT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
