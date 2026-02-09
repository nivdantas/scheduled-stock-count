import { describe, expect, test } from "bun:test";

function calcularSituacao(qtdSistema: number, qtdContada: number | null): string {
	if (qtdContada === null || qtdContada === undefined) return 'A_CONFERIR';
	if (qtdContada === qtdSistema) return 'CONFERIDO';
	return 'FALTANTE_EXCEDENTE';
}

describe("Cálculo situação", () => {
	test("Retornar CONFERIDO se qtdSistema === qtdContada", () => {
		const resultado = calcularSituacao(10, 10);
		expect(resultado).toBe(("CONFERIDO"));
	})

	test("Retornar FALTANTE_EXCEDENTE se qtdSistema !== qtdContada", () => {
    const resultado = calcularSituacao(10, 8);
    expect(resultado).toBe("FALTANTE_EXCEDENTE");
  });

  test("Retornar A_CONFERIR quando não foi contado", () => {
    const resultado = calcularSituacao(10, null);
    expect(resultado).toBe("A_CONFERIR");
  });
})
