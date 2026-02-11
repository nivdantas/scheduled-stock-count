export type StatusItem = "A_CONFERIR" | "CONFERIDO" | "FALTANTE_EXCEDENTE";

export interface Produto {
  id: string;
  codigoSistema: string;
  nome: string;
}

export interface ItemContagem {
  id: string;
  quantidadeSistema: number;
  quantidadeContada: number | null;
  situacao: StatusItem;
  observacao: string | null;
  produto: Produto;
}

export interface Contagem {
  id: string;
  codigo: string;
  responsavel: {
    nome: string;
  };
  status: string;
  itens: ItemContagem[];
}

export interface CardItemProps {
  item: ItemContagem;
  isDivergente?: boolean;
  isConferido?: boolean;
  onContar?: (qtd: number) => void;
  onReset?: () => void;
  isFinalizada?: boolean;
}
