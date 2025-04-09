import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-white fixed bottom-0 left-0 w-full h-[200px] flex justify-center items-end m-0 p-0">
      <div className="w-full">
        <Image
          src="/assets/titleblock.svg"  // Adjusted path
          alt="Architectural Title Block"
          width={1440}
          height={200}
          className="w-full h-full object-cover m-0 p-0"  // Ensures full coverage without margins
        />
      </div>
    </footer>
  );
}
