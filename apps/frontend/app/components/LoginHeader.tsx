import Image from "next/image"
export function LoginHeader() {
  return (
    <div className="flex flex-col items-center mb-8 text-center">
      <div className="p-3 bg-blue-50 rounded-full mb-4">
      <Image src="./pack.svg" alt="pack" width={50} height={50} className=" "></Image>
      </div>
      <h1 className="text-2xl font-bold text-stock-red-1 tracking-tight">Contagem de Estoque!</h1>
      <p className="text-gray-500 mt-2 text-sm max-w-70">
        Sistema de controle de estoque e conferência.
      </p>
    </div>
  )
}
