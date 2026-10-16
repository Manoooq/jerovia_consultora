import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('fs', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    existsSync: vi.fn(() => false),
    readFileSync: vi.fn(() => ''),
    writeFileSync: vi.fn(),
    mkdirSync: vi.fn()
  };
});

import {
  listarEntrevistas,
  listarEntrevistasPorEvaluador,
  crearEntrevista,
  eliminarEntrevista,
  obtenerEntrevista,
  actualizarEntrevista
} from './store';

describe('store - listarEntrevistas', () => {

  beforeEach(() => {
    // Clear the store manually by deleting each entry
    const all = listarEntrevistas();
    all.forEach(e => eliminarEntrevista(e.token));
  });

  afterEach(() => {
    const all = listarEntrevistas();
    all.forEach(e => eliminarEntrevista(e.token));
  });

  it('should return empty list when store has been cleared', () => {
    const all = listarEntrevistas();
    expect(all.length).toBe(0);
  });

  it('should return them sorted by actualizadoEn desc', async () => {
    crearEntrevista("Entity 1", "token-1", "Evaluator A");

    // We need to delay slightly so updated time is strictly greater
    await new Promise(r => setTimeout(r, 10));

    crearEntrevista("Entity 2", "token-2", "Evaluator B");

    // Wait slightly more, then update token-1
    await new Promise(r => setTimeout(r, 10));
    actualizarEntrevista("token-1", { ciudad: "TestCity" });

    const all = listarEntrevistas();

    // Since token-1 was updated last, it should be at the top
    expect(all.length).toBe(2);
    expect(all[0].token).toBe("token-1");
    expect(all[1].token).toBe("token-2");

    // Explicitly verify the sorting logic
    const dateA = new Date(all[0].actualizadoEn).getTime();
    const dateB = new Date(all[1].actualizadoEn).getTime();
    expect(dateA).toBeGreaterThan(dateB);
  });

});

describe('store - listarEntrevistasPorEvaluador', () => {

  beforeEach(() => {
    // Clear the store
    const all = listarEntrevistas();
    all.forEach(e => eliminarEntrevista(e.token));
  });

  afterEach(() => {
    const all = listarEntrevistas();
    all.forEach(e => eliminarEntrevista(e.token));
  });

  it('should return only the interviews assigned to the specific evaluator', () => {
    crearEntrevista("Entity A", "token-a", "Evaluator X");
    crearEntrevista("Entity B", "token-b", "Evaluator Y");
    crearEntrevista("Entity C", "token-c", "Evaluator X");

    const evaluatorXList = listarEntrevistasPorEvaluador("Evaluator X");
    expect(evaluatorXList.length).toBe(2);
    expect(evaluatorXList.some(e => e.token === "token-a")).toBe(true);
    expect(evaluatorXList.some(e => e.token === "token-c")).toBe(true);

    const evaluatorYList = listarEntrevistasPorEvaluador("Evaluator Y");
    expect(evaluatorYList.length).toBe(1);
    expect(evaluatorYList[0].token).toBe("token-b");
  });

  it('should be case-insensitive and ignore trailing/leading whitespaces', () => {
    crearEntrevista("Entity D", "token-d", "EVALUATOR Z");

    const list1 = listarEntrevistasPorEvaluador("evaluator z");
    expect(list1.length).toBe(1);

    const list2 = listarEntrevistasPorEvaluador("  EVALUATOR Z  ");
    expect(list2.length).toBe(1);
  });

  it('should return empty list if evaluator is not found', () => {
    crearEntrevista("Entity E", "token-e", "Evaluator 1");

    const list = listarEntrevistasPorEvaluador("Evaluator 2");
    expect(list.length).toBe(0);
  });
});
