"use client";

import { useEffect, useState } from "react";
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

  const handleSubmit = (e?: React.ChangeEvent) => {
    e?.preventDefault();
    if (!obs.trim()) return alert("A observação é obrigatória.");
    onConfirm(obs);
    setObs("");
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div
        className="bg-white p-6 rounded-lg shadow-2xl w-125 max-w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold text-gray-800 mb-1">
          Registro de Divergência
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          É necessário justificar a diferença encontrada.
        </p>

        <div className="bg-gray-50 p-4 rounded border border-gray-200 mb-4">
          <div className="flex justify-between mb-1">
            <span className="font-mono text-xs text-gray-500">
              {produtoCodigo}
            </span>
          </div>
          <div className="font-medium text-gray-800 text-lg">{produtoNome}</div>
          <div className="mt-2 text-sm">
            Quantidade Informada:{" "}
            <strong className="text-blue-600 text-lg">{qtdInformada}</strong>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Motivo / Observação <span className="text-red-500">*</span>
          </label>
          <textarea
            className="w-full border border-gray-300 p-3 rounded-md mb-6 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-black placeholder-neutral-500"
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
              className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-md font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium shadow-sm transition-colors"
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
    return <div className="p-2 text-red-500">Erro: Produto desconhecido</div>;

  const jaFoiContado = isDivergente || isConferido;

  return (
    <div
      className={`p-3 rounded border flex justify-between items-start ${
        isDivergente
          ? "bg-red-50 border-red-200"
          : isConferido
            ? "border-green-100 bg-green-50"
            : "border-gray-100 bg-gray-50"
      }`}
    >
      <div>
        <span className="text-xs font-mono text-gray-500 block">
          {item.produto.codigoSistema}
        </span>
        <h3 className="font-medium text-gray-800">{item.produto.nome}</h3>

        {item.observacao && (
          <p className="mt-1 text-xs text-red-600">Obs: {item.observacao}</p>
        )}

        {!jaFoiContado && onContar && <CardInput onConfirm={onContar} />}
      </div>

      <div className="flex items-start gap-3">
        {jaFoiContado && (
          <span
            className={`font-bold ${isDivergente ? "text-red-600" : "text-green-600"}`}
          >
            {isConferido && "✓ "} {item.quantidadeContada}
          </span>
        )}

        {jaFoiContado && onReset && (
          <button
            onClick={onReset}
            title="Resetar item"
            className="text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full w-6 h-6 flex items-center justify-center transition-colors font-bold"
          >
            ✕
          </button>
        )}
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
        className="w-20 border rounded px-2 py-1 text-sm text-gray-700"
        value={qtd}
        onChange={(e) => setQtd(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
        autoFocus
      />
      <button
        onClick={handleConfirm}
        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
      >
        OK
      </button>
    </div>
  );
}

export default function PaginaContagem() {
  const params = useParams();
  const id = params.id as string;

  const [contagem, setContagem] = useState<Contagem | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [confirmarFinalizacao, setConfirmarFinalizacao] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [pendente, setPendente] = useState<{
    id: string;
    qtd: number;
    nome: string;
    codigo: string;
    qtdSistema: number;
  } | null>(null);

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:3000/contagens/${id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Erro ao buscar contagem");
        return res.json();
      })
      .then((data) => {
        setContagem(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setErro("Não foi possível carregar a contagem.");
        setLoading(false);
      });
  }, [id]);
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

  if (loading)
    return <div className="p-10 text-center">Carregando contagem...</div>;
  if (erro) return <div className="p-10 text-center text-red-500">{erro}</div>;
  if (!contagem) return null;

  const aConferir =
    contagem?.itens.filter((i) => i.situacao === "A_CONFERIR") || [];
  const conferidos =
    contagem?.itens.filter((i) => i.situacao === "CONFERIDO") || [];
  const divergentes =
    contagem?.itens.filter((i) => i.situacao === "FALTANTE_EXCEDENTE") || [];

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <header className="mb-8 bg-white p-6 shadow rounded-lg flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Contagem: {contagem.codigo}
          </h1>
          <p className="text-gray-500">
            Responsável: {contagem.responsavel.nome}
          </p>
        </div>
        <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-medium text-sm">
          {contagem.status}
        </div>
        {!isFinalizada && (
          <>
            <button
              onClick={handleSalvar}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded shadow transition-colors border border-gray-300"
            >
              Salvar contagem
            </button>
            <button
              onClick={() => setConfirmarFinalizacao(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow transition-colors"
            >
              Finalizar Conferência
            </button>
          </>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <section className="bg-white p-4 rounded-lg shadow border-t-4 border-blue-500">
          <h2 className="text-lg font-bold mb-4 flex justify-between">
            A Conferir
            <span className="bg-gray-100 px-2 rounded text-sm">
              {aConferir.length}
            </span>
          </h2>
          <div className="space-y-3">
            {aConferir.map((item) => (
              <CardItem
                key={item.id}
                item={item}
                onContar={
                  isFinalizada ? undefined : (qtd) => iniciarContagem(item, qtd)
                }
              />
            ))}
            {aConferir.length === 0 && (
              <p className="text-gray-400 text-sm">Nenhum item pendente.</p>
            )}
          </div>
        </section>
        {/* Seção Divergentes */}
        <section className="bg-white p-4 rounded-lg shadow border-t-4 border-red-500">
          <h2 className="text-lg font-bold mb-4 text-red-600 flex justify-between">
            Divergentes
            <span className="bg-red-50 px-2 rounded text-sm">
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
              <p className="text-gray-400 text-sm">Nenhuma divergência.</p>
            )}
          </div>
        </section>

        {/* Seção Conferidos */}
        <section className="bg-white p-4 rounded-lg shadow border-t-4 border-green-500 opacity-80">
          <h2 className="text-lg font-bold mb-4 text-green-700 flex justify-between">
            Conferidos
            <span className="bg-green-50 px-2 rounded text-sm">
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
              <p className="text-gray-400 text-sm">Nenhum item finalizado.</p>
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
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h3 className="text-lg font-bold mb-2">Tem certeza?</h3>
            <p className="text-gray-600 mb-6 text-sm">
              Ao finalizar, você <strong>não poderá mais alterar</strong>{" "}
              nenhuma quantidade. Confirma o encerramento da contagem{" "}
              <strong>{contagem.codigo}</strong>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmarFinalizacao(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleFinalizar}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
