"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import type {
  Contagem,
  ItemContagem,
  CardItemProps,
} from "@/app/types/contagem";

function ModalObservacao({
  isOpen,
  onClose,
  onConfirm,
  qtdInformada,
  produtoNome,
  produtoCodigo,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (obs: string) => void;
  qtdInformada: number;
  produtoNome: string;
  produtoCodigo: string;
}) {
  const [obs, setObs] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e?: React.SubmitEvent) => {
    e?.preventDefault();
    if (!obs.trim()) return alert("A observação é obrigatória.");
    onConfirm(obs);
    setObs("");
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div
        className="bg-stock-1 p-5 rounded-lg shadow-2xl w-125 max-w-full border border-stock-3"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-3xl text-left font-averia text-stock-7 mb-2.5">
          Registro de Divergência
        </h3>
        <p className="text-[16px] font-lato text-stock-4 mb-6">
          É necessário justificar a diferença encontrada.
        </p>

        <div className="p-4 rounded mb-4 grid grid-cols-2 w-full">
          <div className="flex justify-between mb-1">
            <span className="font-lato text-xs text-stock-2">
              {produtoCodigo}
            </span>
          </div>
          <span className="font-lato text-xs text-stock-2 justify-self-end">
            Qtd.
          </span>
          <div className="font-lato text-stock-6 text-sm">{produtoNome}</div>
          <span className="font-lato text-xs text-stock-red-1 justify-self-end mr-2 font-bold">
            {qtdInformada}
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="block text-[16px] font-medium text-stock-5 mb-2 font-lato">
            Observação <span className="text-stock-red-2">*</span>
          </label>
          <textarea
            className="w-full border border-stock-2 p-3 rounded-md mb-6 text-sm focus:ring-1 focus:ring-stock-4 focus:border-stock-4 outline-none transition-all text-stock-6 placeholder-stock-2 font-lato bg-stock-1"
            rows={3}
            placeholder="Ex: Produto avariado, caixa vazia, erro de entrada anterior..."
            value={obs}
            onChange={(e) => setObs(e.target.value)}
            autoFocus
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-stock-5 hover:ring-1 hover:ring-stock-4 cursor-pointer rounded-md font-medium transition-colors font-lato"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-stock-red-2 text-stock-1 rounded-md hover:bg-stock-red-3 font-lato font-medium shadow-sm transition-colors cursor-pointer"
            >
              Confirmar Divergência
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CardItem({
  item,
  isDivergente,
  isConferido,
  onContar,
  onReset,
}: CardItemProps) {
  if (!item.produto)
    return (
      <div className="p-2 text-stock-red-2">Erro: Produto desconhecido</div>
    );

  const jaFoiContado = isDivergente || isConferido;

  return (
    <div
      className={`p-3 rounded border flex justify-center relative ${
        isDivergente
          ? "border-stock-red-1"
          : isConferido
            ? "border-stock-green-light"
            : "border-stock-3"
      }`}
    >
      <div className="font-lato flex flex-col">
	      <div className="justify-self-center text-center">
        <span className="text-xs font-mono text-stock-2 block mb-1">
          {item.produto.codigoSistema}
        </span>
        <h3 className="font-medium text-stock-6 text-[16px]">
          {item.produto.nome}
        </h3>

        {item.observacao && (
          <p className="mt-1 text-xs text-stock-red-1">
            Obs: {item.observacao}
          </p>
        )}
      </div>
        {!jaFoiContado && onContar && <CardInput onConfirm={onContar} />}
        <div className="flex gap-3 absolute top-2 right-2">
                     {jaFoiContado && (
                       <span
                         className={`font-bold ${isDivergente ? "text-stock-red-1" : "text-stock-green-2"}`}
                       >
                         {isConferido && "✓ "} {item.quantidadeContada}
                       </span>
                     )}

                     {jaFoiContado && onReset && (
                       <button
                         onClick={onReset}
                         title="Resetar item"
                         className="text-stock-2 hover:text-stock-red-3 hover:bg-stock-red-light rounded-full w-6 h-6 flex items-center justify-center transition-colors font-bold cursor-pointer"
                       >
                         ✕
                       </button>
                     )}
                   </div>

      </div>
    </div>
  );
}

function CardInput({ onConfirm }: { onConfirm: (qtd: number) => void }) {
  const [qtd, setQtd] = useState("");

  const handleConfirm = () => {
    if (qtd === "") return;
    onConfirm(Number(qtd));
    setQtd("");
  };

  return (
    <div className="mt-3 flex gap-2">
      <input
        type="number"
        placeholder="Qtd"
        className="w-30 border border-stock-2 rounded px-2 py-2 text-sm text-stock-6 bg-stock-1 outline-none"
        value={qtd}
        onChange={(e) => setQtd(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
        autoFocus
      />
      <button
        onClick={handleConfirm}
        className="border border-stock-blue-1 text-stock-blue-2 font-bold px-4 py-2 rounded text-sm hover:bg-stock-blue-light hover:cursor-pointer transition-colors"
      >
        OK
      </button>
    </div>
  );
}

export default function ContagemPage({ data }: { data: Contagem }) {
  const params = useParams();
  const id = params.id as string;

  const [contagem, setContagem] = useState<Contagem | null>(data);
  const [confirmarFinalizacao, setConfirmarFinalizacao] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [pendente, setPendente] = useState<{
    id: string;
    qtd: number;
    nome: string;
    codigo: string;
    qtdSistema: number;
  } | null>(null);

  const iniciarContagem = (item: ItemContagem, qtdDigitada: number) => {
    if (qtdDigitada === item.quantidadeSistema) {
      salvarNoBackend(item.id, qtdDigitada, null);
    } else {
      setPendente({
        id: item.id,
        qtd: qtdDigitada,
        qtdSistema: item.quantidadeSistema,
        nome: item.produto.nome,
        codigo: item.produto.codigoSistema,
      });
      setModalOpen(true);
    }
  };

  const confirmarDivergencia = (observacao: string) => {
    if (pendente) {
      salvarNoBackend(pendente.id, pendente.qtd, observacao);
      setModalOpen(false);
      setPendente(null);
    }
  };

  const salvarNoBackend = async (
    itemId: string,
    qtd: number,
    obs: string | null,
  ) => {
    if (!contagem) return;

    try {
      const body = { quantidadeContada: qtd, observacao: obs };

      const res = await fetch(
        `http://localhost:3000/itens-contagem/${itemId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );

      if (!res.ok) throw new Error("Falha ao salvar");

      const itemAtualizado: ItemContagem = await res.json();

      setContagem((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          itens: prev.itens.map((item) =>
            item.id === itemId ? itemAtualizado : item,
          ),
        };
      });
    } catch (err) {
      alert("Erro ao salvar contagem. Tente novamente.");
      console.error(err);
    }
  };

  const handleResetItem = async (itemId: string) => {
    if (isFinalizada) return;

    try {
      const res = await fetch(
        `http://localhost:3000/itens-contagem/${itemId}/reset`,
        {
          method: "PATCH",
        },
      );

      if (!res.ok) throw new Error("Erro ao resetar");

      const itemResetado = await res.json();

      setContagem((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          itens: prev.itens.map((item) =>
            item.id === itemId ? itemResetado : item,
          ),
        };
      });
    } catch (err) {
      alert(err);
    }
  };

  const handleFinalizar = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/contagens/${id}/finalizar`,
        {
          method: "PATCH",
        },
      );

      if (!res.ok) throw new Error("Erro ao finalizar");

      const contagemAtualizada = await res.json();
      setContagem(contagemAtualizada);
      setConfirmarFinalizacao(false);
      alert("Contagem finalizada!");
    } catch (err) {
      alert(`Erro ao finalizar: ${err}`);
    }
  };

  const isFinalizada = contagem?.status === "FINALIZADA";

  const handleSalvar = async () => {
    try {
      const res = await fetch(`http://localhost:3000/contagens/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "EM_ANDAMENTO" }),
      });
      const text = await res.text();
      if (!res.ok) {
        console.error("Salvar falhou:", res.status, text);
        throw new Error(text || `HTTP ${res.status}`);
      }

      alert(
        "Progresso salvo com sucesso! (Seus itens já são salvos automaticamente)",
      );
    } catch (err) {
      alert(`Erro ao salvar: ${err}`);
    }
  };

  if (!contagem) return null;

  const aConferir =
    contagem?.itens.filter((i) => i.situacao === "A_CONFERIR") || [];
  const conferidos =
    contagem?.itens.filter((i) => i.situacao === "CONFERIDO") || [];
  const divergentes =
    contagem?.itens.filter((i) => i.situacao === "FALTANTE_EXCEDENTE") || [];

  return (
    <main className="min-h-screen bg-stock-1 p-6 flex justify-center">
      <div className="w-full py-5 xl:max-w-340 lg:max-w-2xl md:max-w-xl">
        <header className="bg-stock-1 p-5 shadow-xs rounded-lg flex justify-between items-center border border-stock-3 font-lato">
          <div>
            <h1 className="text-2xl font-bold text-stock-7 mb-1">
              Contagem:{" "}
              <strong className="font-averia">{contagem.codigo}</strong>
            </h1>
            <p className="text-stock-4">
              Responsável: <strong>{contagem.responsavel.nome}</strong>
            </p>
          </div>
          <div className="px-6 py-2 border border-stock-4 text-stock-red-3 rounded-lg font-averia text-xl">
            {contagem.status}
          </div>
        </header>

        {!isFinalizada && (
                 <div className="my-4 flex justify-start gap-5 font-averia">
                   <button
                     onClick={handleSalvar}
                     className="bg-stock-1 hover:ring-1 text-stock-5 px-4 py-2 rounded shadow transition-colors border border-stock-2 uppercase cursor-pointer"
                   >
                     Salvar
                   </button>
                   <button
                     onClick={() => setConfirmarFinalizacao(true)}
                     className="bg-stock-red-1 hover:bg-stock-red-3 text-stock-1 px-4 py-2 rounded shadow transition-colors uppercase cursor-pointer"
                   >
                     Finalizar
                   </button>
                 </div>
               )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <section className="bg-stock-1 p-4 rounded-lg shadow border-t-4 border-stock-blue-1">
            <h2 className="text-xl font-bold mb-4 flex justify-between text-stock-blue-2 font-averia uppercase">
              A Conferir
              <span className="bg-stock-1 px-2 rounded text-sm text-stock-blue-2">
                {aConferir.length}
              </span>
            </h2>
            <div className="space-y-3 grid justify-center">
              {aConferir.map((item) => (
                <CardItem
                  key={item.id}
                  item={item}
                  onContar={
                    isFinalizada
                      ? undefined
                      : (qtd) => iniciarContagem(item, qtd)
                  }
                />
              ))}
              {aConferir.length === 0 && (
                <p className="text-stock-4 text-sm">Nenhum item pendente.</p>
              )}
            </div>
          </section>

          <section className="bg-stock-1 p-4 rounded-lg shadow border-t-4 border-stock-red-2">
            <h2 className="text-lg font-bold mb-4 text-stock-red-2 flex justify-between font-averia uppercase">
              Divergentes
              <span className="bg-stock-red-light px-2 rounded text-sm text-stock-red-1">
                {divergentes.length}
              </span>
            </h2>
            <div className="space-y-3">
              {divergentes.map((item) => (
                <CardItem
                  key={item.id}
                  item={item}
                  isDivergente
                  onReset={() => handleResetItem(item.id)}
                />
              ))}
              {divergentes.length === 0 && (
                <p className="text-stock-4 text-sm">Nenhuma divergência.</p>
              )}
            </div>
          </section>

          <section className="bg-stock-1 p-4 rounded-lg shadow border-t-4 border-stock-green-2 opacity-80">
            <h2 className="text-xl font-bold mb-4 text-stock-green-2 flex justify-between font-averia uppercase">
              Conferidos
              <span className="bg-stock-green-light px-2 rounded text-sm text-stock-green-1">
                {conferidos.length}
              </span>
            </h2>
            <div className="space-y-3">
              {conferidos.map((item) => (
                <CardItem
                  key={item.id}
                  item={item}
                  isConferido
                  onReset={() => handleResetItem(item.id)}
                />
              ))}
              {conferidos.length === 0 && (
                <p className="text-stock-4 text-sm">Nenhum item finalizado.</p>
              )}
            </div>
          </section>
        </div>

        {pendente && (
          <ModalObservacao
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onConfirm={confirmarDivergencia}
            qtdInformada={pendente.qtd}
            produtoNome={pendente.nome}
            produtoCodigo={pendente.codigo}
          />
        )}

        {confirmarFinalizacao && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-stock-1 p-6 rounded-lg shadow-xl w-96 border border-stock-3">
              <h3 className="text-lg font-bold mb-2 text-stock-7">
                Tem certeza?
              </h3>
              <p className="text-stock-5 mb-6 text-sm">
                Ao finalizar, você{" "}
                <strong className="text-stock-6">
                  não poderá mais alterar
                </strong>{" "}
                nenhuma quantidade. Confirma o encerramento da contagem{" "}
                <strong className="text-stock-6">{contagem.codigo}</strong>?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setConfirmarFinalizacao(false)}
                  className="px-4 py-2 text-stock-5 hover:ring-1 hover:ring-stock-4 rounded transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleFinalizar}
                  className="px-4 py-2 bg-stock-green-2 text-stock-1 rounded hover:bg-stock-green-3 transition-colors"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
