"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import type {
  Contagem,
  ItemContagem,
  CardItemProps,
} from "@/app/types/contagem";
import { getBaseUrl } from "../utils/api";

// --- Componentes Auxiliares ---

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
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => textAreaRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!obs.trim()) return alert("A observação é obrigatória.");
    onConfirm(obs);
    setObs("");
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-divergencia-title"
    >
      <div
        className="bg-stock-1 p-5 rounded-lg shadow-2xl w-full max-w-lg border border-stock-3"
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          id="modal-divergencia-title"
          className="text-2xl md:text-3xl text-left font-averia text-stock-7 mb-2.5"
        >
          Registro de Divergência
        </h3>
        <p className="text-sm md:text-base font-lato text-stock-4 mb-6">
          É necessário justificar a diferença encontrada.
        </p>

        <div
          className="bg-stock-neutral-light p-4 rounded mb-4 grid grid-cols-2 w-full gap-y-2"
          role="group"
          aria-label="Detalhes do produto"
        >
          <div className="flex justify-between mb-1 col-span-2">
            <span className="font-lato text-xs text-stock-2 font-bold tracking-wider">
              CÓDIGO: {produtoCodigo}
            </span>
          </div>

          <div className="font-lato text-stock-6 text-sm md:text-base pr-2 self-center">
            {produtoNome}
          </div>

          <div className="flex flex-col items-end justify-self-end">
            <span className="font-lato text-xs text-stock-2 mb-1">
              Qtd Informada
            </span>
            <span className="font-lato text-lg md:text-xl text-stock-red-1 font-bold">
              {qtdInformada}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <label
            htmlFor="obs-textarea"
            className="block text-base font-medium text-stock-5 mb-2 font-lato"
          >
            Observação{" "}
            <span className="text-stock-red-2" aria-hidden="true">
              *
            </span>
            <span className="sr-only">(obrigatório)</span>
          </label>
          <textarea
            id="obs-textarea"
            ref={textAreaRef}
            className="w-full border border-stock-2 p-3 rounded-md mb-6 text-base focus:ring-2 focus:ring-stock-4 focus:border-stock-4 outline-none transition-all text-stock-6 placeholder-stock-2 font-lato bg-stock-1 min-h-[100px]"
            rows={3}
            placeholder="Ex: Produto avariado, caixa vazia..."
            value={obs}
            onChange={(e) => setObs(e.target.value)}
            required
          />

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-3 sm:py-2 text-stock-5 hover:bg-stock-neutral-light border border-transparent hover:border-stock-3 rounded-md font-medium transition-colors font-lato min-h-[44px]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-3 sm:py-2 bg-stock-red-2 text-stock-1 rounded-md hover:bg-stock-red-3 font-lato font-medium shadow-sm transition-colors cursor-pointer min-h-[44px]"
            >
              Confirmar
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
  isFinalizada,
}: CardItemProps) {
  if (!item.produto)
    return (
      <div
        className="p-2 text-stock-red-2 border border-stock-red-2 rounded"
        role="alert"
      >
        Erro: Produto desconhecido
      </div>
    );

  const jaFoiContado = isDivergente || isConferido;

  const borderClass = isDivergente
    ? "border-stock-red-1 bg-red-50/10"
    : isConferido
      ? "border-stock-green-light bg-green-50/10"
      : "border-stock-3 bg-stock-1";

  return (
    <article
      className={`p-4 rounded-lg border flex flex-col relative transition-all ${borderClass}`}
      aria-label={`Item: ${item.produto.nome}`}
    >
      <div className="font-lato flex flex-col w-full">
        <div className="text-center mb-3">
          <span className="text-xs font-mono text-stock-2 mb-1 bg-stock-neutral-light inline-block px-2 py-0.5 rounded">
            {item.produto.codigoSistema}
          </span>
          <h3 className="font-medium text-stock-6 text-base md:text-lg wrap-break-word leading-tight">
            {item.produto.nome}
          </h3>

          {item.observacao && (
            <div className="mt-2 text-xs md:text-sm text-stock-red-1 bg-red-50 p-2 rounded border border-red-100 text-left">
              <strong>Obs:</strong> {item.observacao}
            </div>
          )}
        </div>

        <div className="mt-auto flex justify-center w-full">
          {!jaFoiContado && onContar ? (
            <CardInput onConfirm={onContar} labelId={`label-${item.id}`} />
          ) : null}
        </div>

        <div className="flex gap-2 absolute top-2 right-2">
          {jaFoiContado && (
            <span
              className={`font-bold text-sm px-2 py-1 rounded ${
                isDivergente
                  ? "text-stock-red-1 bg-red-100"
                  : "text-stock-green-2 bg-green-100"
              }`}
              role="status"
              aria-label={isDivergente ? "Divergente" : "Conferido"}
            >
              {isConferido && "✓ "} {item.quantidadeContada}
            </span>
          )}

          {jaFoiContado && onReset && (
            <button
              onClick={onReset}
              title="Resetar item"
              aria-label={`Resetar contagem de ${item.produto.nome}`}
              disabled={isFinalizada}
              className="text-stock-4 hover:text-stock-red-3 hover:bg-stock-red-light rounded-full w-8 h-8 flex items-center justify-center transition-colors font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-stock-red-3"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function CardInput({
  onConfirm,
  labelId,
}: {
  onConfirm: (qtd: number) => void;
  labelId: string;
}) {
  const [qtd, setQtd] = useState("");

  const handleConfirm = () => {
    if (qtd === "") return;
    onConfirm(Number(qtd));
    setQtd("");
  };

  return (
    <div className="mt-2 flex gap-2 w-full max-w-[200px]">
      <label htmlFor={labelId} className="sr-only">
        Quantidade
      </label>
      <input
        id={labelId}
        type="number"
        placeholder="Qtd"
        className="flex-1 border border-stock-2 rounded px-3 py-2 text-base text-stock-6 bg-stock-1 outline-none focus:ring-2 focus:ring-stock-blue-1 min-h-[44px]"
        value={qtd}
        onChange={(e) => setQtd(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
        inputMode="numeric"
      />
      <button
        onClick={handleConfirm}
        className="bg-stock-blue-1 text-white font-bold px-4 py-2 rounded text-sm hover:bg-stock-blue-2 cursor-pointer transition-colors min-h-[44px] min-w-[50px] focus:ring-2 focus:ring-offset-2 focus:ring-stock-blue-1"
        aria-label="Confirmar quantidade"
      >
        OK
      </button>
    </div>
  );
}

// --- Componente Principal ---

export default function ContagemPage({ data }: { data: Contagem }) {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const baseUrl = getBaseUrl();

  const [contagem, setContagem] = useState<Contagem | null>(data);
  const [confirmarFinalizacao, setConfirmarFinalizacao] = useState(false);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [pendente, setPendente] = useState<{
    id: string;
    qtd: number;
    nome: string;
    codigo: string;
    qtdSistema: number;
  } | null>(null);

  // --- Lógicas ---
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
      const res = await fetch(`${baseUrl}/itens-contagem/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

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
      alert("Erro ao salvar contagem. Verifique sua conexão.");
      console.error(err);
    }
  };

  const handleResetItem = async (itemId: string) => {
    if (isFinalizada) return;
    try {
      const res = await fetch(`${baseUrl}/itens-contagem/${itemId}/reset`, {
        method: "PATCH",
      });
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
      const res = await fetch(`${baseUrl}/contagens/${id}/finalizar`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Erro ao finalizar");
      const contagemAtualizada = await res.json();
      setContagem(contagemAtualizada);
      setConfirmarFinalizacao(false);
      alert("Contagem finalizada!");
    } catch (err) {
      alert(`Erro ao finalizar: ${err}`);
    }
  };

  const handleSalvar = async () => {
    try {
      const res = await fetch(`${baseUrl}/contagens/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "EM_ANDAMENTO" }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      alert("Progresso salvo com sucesso!");
    } catch (err) {
      alert(`Erro ao salvar: ${err}`);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${baseUrl}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Erro ao deslogar:", error);
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("stock_user");
      }
      router.refresh();
      router.push("/");
    }
  };

  if (!contagem)
    return (
      <div className="p-10 text-center animate-pulse">
        Carregando contagem...
      </div>
    );

  const isFinalizada = contagem.status === "FINALIZADA";

  const itensFiltrados = contagem.itens.filter((item) => {
    if (!search) return true;
    const t = search.toLowerCase();
    return (
      item.produto.nome.toLowerCase().includes(t) ||
      item.produto.codigoSistema.toLowerCase().includes(t)
    );
  });

  const aConferir =
    itensFiltrados.filter((i) => i.situacao === "A_CONFERIR") || [];
  const conferidos =
    itensFiltrados.filter((i) => i.situacao === "CONFERIDO") || [];
  const divergentes = itensFiltrados.filter(
    (i) => i.situacao === "FALTANTE_EXCEDENTE",
  );

  return (
    <main className="min-h-screen bg-stock-1 p-3 md:p-6 flex justify-center">
      <div className="w-full xl:max-w-340 lg:max-w-4xl md:max-w-2xl">
        <header className="bg-stock-1 p-4 md:p-5 shadow-sm rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center border border-stock-3 font-lato gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-stock-7 mb-1 flex flex-wrap items-center gap-2">
              Contagem:{" "}
              <strong className="font-averia bg-stock-neutral-light px-2 py-1 rounded text-base md:text-xl">
                {contagem.codigo}
              </strong>
            </h1>
            <p className="text-sm md:text-base text-stock-4">
              Responsável: <strong>{contagem.responsavel.nome}</strong>
            </p>
          </div>
          <div className="self-start sm:self-center px-4 py-1.5 md:px-6 md:py-2 border border-stock-4 text-stock-red-3 rounded-lg font-averia text-base md:text-xl whitespace-nowrap">
            {contagem.status}
          </div>
        </header>

        <div className="my-4 md:my-5 relative">
          <label htmlFor="search-input" className="sr-only">
            Buscar produto
          </label>
          <input
            id="search-input"
            type="text"
            placeholder="Buscar por nome ou código..."
            className="block w-full pl-4 pr-3 py-3 border border-stock-3 rounded-md leading-5 bg-stock-1 text-stock-7 placeholder-stock-5 focus:outline-none focus:ring-2 focus:ring-stock-red-3 focus:border-stock-red-3 text-base transition duration-150 ease-in-out font-lato shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="my-4 flex flex-col sm:flex-row justify-start gap-3 md:gap-5 font-averia">
          {!isFinalizada && (
            <>
              <button
                onClick={handleSalvar}
                className="w-full sm:w-auto bg-stock-1 hover:bg-stock-neutral-light text-stock-5 px-4 py-3 md:py-2 rounded shadow transition-colors border border-stock-2 uppercase cursor-pointer min-h-[44px] flex items-center justify-center font-bold"
              >
                Salvar
              </button>
              <button
                onClick={() => setConfirmarFinalizacao(true)}
                className="w-full sm:w-auto bg-stock-red-1 hover:bg-stock-red-3 text-stock-1 px-4 py-3 md:py-2 rounded shadow transition-colors uppercase cursor-pointer min-h-[44px] flex items-center justify-center font-bold"
              >
                Finalizar
              </button>
            </>
          )}
          <button
            onClick={handleLogout}
            className="w-full sm:w-auto bg-stock-1 hover:bg-red-50 text-stock-red-3 px-4 py-3 md:py-2 rounded shadow transition-colors border border-stock-red-3 uppercase cursor-pointer sm:ml-auto min-h-[44px] flex items-center justify-center font-bold"
          >
            Sair
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {/* Coluna A Conferir */}
          <section
            className="bg-stock-1 p-3 md:p-4 rounded-lg shadow border-t-4 border-stock-blue-1"
            aria-labelledby="heading-a-conferir"
          >
            <h2
              id="heading-a-conferir"
              className="text-lg md:text-xl font-bold mb-4 flex justify-between text-stock-blue-2 font-averia uppercase items-center"
            >
              A Conferir
              <span className="bg-stock-blue-light text-stock-blue-2 px-2.5 py-0.5 rounded-full text-sm font-bold min-w-[24px] text-center">
                {aConferir.length}
              </span>
            </h2>
            <div className="space-y-3">
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
                <p className="text-stock-4 text-sm text-center py-4 italic">
                  Nenhum item pendente.
                </p>
              )}
            </div>
          </section>

          {/* Coluna Divergentes */}
          <section
            className="bg-stock-1 p-3 md:p-4 rounded-lg shadow border-t-4 border-stock-red-2"
            aria-labelledby="heading-divergentes"
          >
            <h2
              id="heading-divergentes"
              className="text-lg md:text-xl font-bold mb-4 text-stock-red-2 flex justify-between font-averia uppercase items-center"
            >
              Divergentes
              <span className="bg-red-100 text-stock-red-1 px-2.5 py-0.5 rounded-full text-sm font-bold min-w-[24px] text-center">
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
                  isFinalizada={isFinalizada}
                />
              ))}
              {divergentes.length === 0 && (
                <p className="text-stock-4 text-sm text-center py-4 italic">
                  Nenhuma divergência.
                </p>
              )}
            </div>
          </section>

          {/* Coluna Conferidos */}
          <section
            className="bg-stock-1 p-3 md:p-4 rounded-lg shadow border-t-4 border-stock-green-2 opacity-90"
            aria-labelledby="heading-conferidos"
          >
            <h2
              id="heading-conferidos"
              className="text-lg md:text-xl font-bold mb-4 text-stock-green-2 flex justify-between font-averia uppercase items-center"
            >
              Conferidos
              <span className="bg-green-100 text-stock-green-2 px-2.5 py-0.5 rounded-full text-sm font-bold min-w-[24px] text-center">
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
                  isFinalizada={isFinalizada}
                />
              ))}
              {conferidos.length === 0 && (
                <p className="text-stock-4 text-sm text-center py-4 italic">
                  Nenhum item finalizado.
                </p>
              )}
            </div>
          </section>
        </div>

        {/* Modais */}
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
          <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4"
            role="alertdialog"
            aria-labelledby="alert-finalizar-title"
            aria-describedby="alert-finalizar-desc"
          >
            <div className="bg-stock-1 p-6 rounded-lg shadow-xl w-full max-w-sm border border-stock-3">
              <h3
                id="alert-finalizar-title"
                className="text-xl font-bold mb-2 text-stock-7"
              >
                Tem certeza?
              </h3>
              <p
                id="alert-finalizar-desc"
                className="text-stock-5 mb-6 text-base leading-relaxed"
              >
                Ao finalizar, você{" "}
                <strong className="text-stock-red-2 font-bold">
                  não poderá mais alterar
                </strong>{" "}
                nenhuma quantidade desta contagem.
              </p>
              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button
                  onClick={() => setConfirmarFinalizacao(false)}
                  className="w-full sm:w-auto px-4 py-3 sm:py-2 text-stock-5 hover:bg-stock-neutral-light rounded transition-colors border border-transparent hover:border-stock-3 font-medium min-h-[44px]"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleFinalizar}
                  className="w-full sm:w-auto px-4 py-3 sm:py-2 bg-stock-red-2 text-stock-1 rounded hover:bg-stock-red-3 transition-colors shadow-sm font-bold min-h-[44px]"
                >
                  Confirmar Encerramento
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
