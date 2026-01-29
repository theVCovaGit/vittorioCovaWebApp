"use client";

import { useState } from "react";
import Link from "next/link";

const BARCODE_PATH =
  "M5.14062 41.6719H0.328125V0.296875H5.14062V41.6719ZM9.84896 41.6719H7.44271V0.296875H9.84896V41.6719ZM16.6719 41.6719H14.2656V0.296875H16.6719V41.6719ZM28.0729 41.6719H25.6667V0.296875H28.0729V41.6719ZM39.5312 41.6719H34.776V0.296875H39.5312V41.6719ZM48.4844 41.6719H46.1094V0.296875H48.4844V41.6719ZM55.4792 41.6719H50.9948V0.296875H55.4792V41.6719ZM64.5677 41.6719H62.3281V0.296875H64.5677V41.6719ZM78.3438 41.6719H76.1042V0.296875H78.3438V41.6719ZM94.4167 41.6719H89.9792V0.296875H94.4167V41.6719ZM112.625 41.6719H105.995V0.296875H112.625V41.6719ZM83.0104 41.6719H80.7708V0.296875H83.0104V41.6719ZM103.714 41.6719H101.474V0.296875H103.714V41.6719ZM119.641 41.6719H115.057V0.296875H119.641V41.6719ZM140.359 41.6719H135.776V0.296875H140.359V41.6719ZM156.391 41.6719H151.807V0.296875H156.391V41.6719ZM163.177 41.6719H158.589V0.296875H163.177V41.6719ZM172.547 41.6719H167.964V0.296875H172.547V41.6719ZM181.427 41.6719H176.844V0.296875H181.427V41.6719ZM206.583 41.6719H202V0.296875H206.583V41.6719ZM241.052 41.6719H236.464V0.296875H241.052V41.6719ZM257.151 41.6719H252.568V0.296875H257.151V41.6719ZM264.234 41.6719H259.646V0.296875H264.234V41.6719ZM273.219 41.6719H268.635V0.296875H273.219V41.6719ZM284.708 41.6719H277.781V0.296875H284.708V41.6719ZM341.969 41.6719H335.042V0.296875H341.969V41.6719ZM296.089 41.6719H291.5V0.296875H296.089V41.6719ZM307.521 41.6719H302.932V0.296875H307.521V41.6719ZM332.734 41.6719H328.151V0.296875H332.734V41.6719ZM357.87 41.6719H353.286V0.296875H357.87V41.6719ZM190.599 41.6719H183.87V0.296875H190.599V41.6719ZM128.74 41.6719H126.5V0.296875H128.74V41.6719ZM144.896 41.6719H142.656V0.296875H144.896V41.6719ZM199.771 41.6719H197.531V0.296875H199.771V41.6719ZM215.927 41.6719H213.688V0.296875H215.927V41.6719ZM220.552 41.6719H218.312V0.296875H220.552V41.6719ZM229.557 41.6719H227.318V0.296875H229.557V41.6719ZM289.161 41.6719H286.922V0.296875H289.161V41.6719ZM316.604 41.6719H314.365V0.296875H316.604V41.6719ZM325.755 41.6719H323.516V0.296875H325.755V41.6719ZM346.516 41.6719H344.276V0.296875H346.516V41.6719ZM366.88 41.6719H364.641V0.296875H366.88V41.6719ZM245.63 41.6719H243.391V0.296875H245.63V41.6719ZM73.7656 41.6719H66.9948V0.296875H73.7656V41.6719Z";

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
      className="fixed left-0 right-0 z-[60] flex items-center justify-center p-4 bg-[#FFF3DF]/90 art-expanded-below-header"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
      role="dialog"
      aria-label="Inquire about artwork"
    >
      <div
        className="relative w-full max-w-lg bg-[#FFF3DF] border-2 border-[#4A413C] rounded-sm shadow-lg overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-bold text-lg leading-none rounded-sm transition-colors"
          onClick={onClose}
          aria-label="Close"
        >
          +
        </button>

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

        <div className="flex flex-col items-center pt-4 pb-6 px-6 border-t border-[#4A413C]/20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 367 42"
            fill="none"
            width={280}
            height={32}
            className="block"
          >
            <path d={BARCODE_PATH} fill="#847263" />
          </svg>
          <div className="flex items-center gap-1 mt-2 text-[#847263] font-blurlight text-sm">
            <Link href="/contact" className="text-[#847263] no-underline hover:underline">
              CONTACT
            </Link>
            <span> / </span>
            <Link href="/about" className="text-[#847263] no-underline hover:underline">
              ABOUT
            </Link>
            <span> / </span>
            <Link href="/news" className="text-[#847263] no-underline hover:underline">
              NEWS
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
