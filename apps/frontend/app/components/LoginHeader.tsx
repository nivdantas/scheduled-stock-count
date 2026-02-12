import Image from "next/image";

export function LoginHeader() {
  return (
    <header className="flex flex-col items-center mb-8 md:mb-10 text-center w-full px-4">
      <div
        className="p-4 bg-blue-50/80 rounded-full mb-5 shadow-sm border border-blue-100"
        aria-hidden="true"
      >
        <Image
          src="/pack.svg"
          alt=""
          width={50}
          height={50}
          className="w-12 h-12 md:w-14 md:h-14 text-stock-blue-1"
          priority
        />
      </div>

      <h1 className="text-2xl md:text-3xl font-bold text-stock-red-1 tracking-tight mb-2 font-averia">
        Contagem de Estoque
      </h1>

      <p className="text-stock-4 mt-1 text-base md:text-lg max-w-xs md:max-w-md font-lato leading-relaxed">
        Sistema de controle de estoque e conferência.
      </p>
    </header>
  );
}
