"use client";

export default function NewsContentPanel({ isActive }: { isActive: boolean }) {
  if (!isActive) return null;

  return (
    <div className="mt-6">
      <h2 className="text-[#FFF3DF] text-xl font-microextend font-bold">
        News
      </h2>
      <div className="bg-[#554943] p-4 mt-4 text-black">
        <p className="text-[#FFF3DF] font-minecraft text-sm">
          Manage news and timeline content for the <a href="/news" className="text-[#fec776] underline hover:no-underline">/news</a> page.
        </p>
        <p className="text-gray-400 text-sm mt-2">
          News content management can be extended here (e.g. add, edit, reorder timeline items).
        </p>
      </div>
    </div>
  );
}
