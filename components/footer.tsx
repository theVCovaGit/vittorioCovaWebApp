"use client";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-2 md:gap-4">
        {/* Contact Info */}
        <div className="text-center md:text-left">
          <h3 className="text-sm font-semibold md:text-lg">Contacto</h3>
          <p className="text-xs md:text-sm">Teléfono: +52 (placeholder)</p>
          <p className="text-xs md:text-sm">Correo: correo@placeholder.com</p>
        </div>

        {/* Divider (Optional for subtlety) */}
        <div className="hidden md:block h-px w-full bg-gray-700 md:hidden"></div>

        {/* Seal */}
        <div className="text-center mt-2 md:mt-0">
          <p className="text-xs md:text-sm">
            Made by <span className="font-semibold">JRF Technologies</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
