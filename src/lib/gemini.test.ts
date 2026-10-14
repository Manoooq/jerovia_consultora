import { describe, it, expect } from 'vitest';
import { detectarInconsistencias } from './gemini';

describe('detectarInconsistencias', () => {
  it('should return an empty array if there are no inconsistencies', () => {
    const datos = {
      ingresosFamiliares: '5000000',
      egresosMensuales: '3000000',
      costoAlquiler: 1000000,
    };
    const result = detectarInconsistencias(datos);
    expect(result).toEqual([]);
  });

  it('should detect when egresos > ingresos', () => {
    const datos = {
      ingresosFamiliares: '2000000',
      egresosMensuales: '3000000',
    };
    const result = detectarInconsistencias(datos);
    expect(result).toContain('⚠️ Los egresos declarados (3.000.000 Gs.) superan a los ingresos familiares (2.000.000 Gs.).');
  });

  it('should format numbers properly when parsing egresos/ingresos string input', () => {
    const datos = {
      ingresosFamiliares: 'G. 2.000.000',
      egresosMensuales: 'Gs 3.000.000',
    };
    const result = detectarInconsistencias(datos);
    expect(result).toContain('⚠️ Los egresos declarados (3.000.000 Gs.) superan a los ingresos familiares (2.000.000 Gs.).');
  });

  it('should detect when alquiler > 50% de ingresos', () => {
    const datos = {
      ingresosFamiliares: '2000000',
      costoAlquiler: 1500000,
    };
    const result = detectarInconsistencias(datos);
    expect(result).toContain('⚠️ El costo de alquiler representa más del 50% de los ingresos familiares declarados.');
  });

  it('should detect when hijos are present but cantidadHijos is missing', () => {
    const datos = {
      hijos: true,
      // cantidadHijos is missing
    };
    const result = detectarInconsistencias(datos);
    expect(result).toContain('⚠️ Se indicaron hijos pero no se especificó la cantidad.');
  });

  it('should not warn about hijos if both are present', () => {
    const datos = {
      hijos: true,
      cantidadHijos: 2
    };
    const result = detectarInconsistencias(datos);
    expect(result).toEqual([]);
  });

  it('should detect when enfermedadBase is present but enfermedadBaseDetalle is missing', () => {
    const datos = {
      enfermedadBase: true,
      // enfermedadBaseDetalle is missing
    };
    const result = detectarInconsistencias(datos);
    expect(result).toContain('⚠️ Se indicó enfermedad de base sin detallar diagnóstico.');
  });

  it('should return multiple warnings if there are multiple inconsistencies', () => {
    const datos = {
      ingresosFamiliares: '2000000',
      egresosMensuales: '3000000',
      costoAlquiler: 1500000,
      hijos: true,
      enfermedadBase: true,
    };
    const result = detectarInconsistencias(datos);
    expect(result).toHaveLength(4);
    expect(result).toContain('⚠️ Los egresos declarados (3.000.000 Gs.) superan a los ingresos familiares (2.000.000 Gs.).');
    expect(result).toContain('⚠️ El costo de alquiler representa más del 50% de los ingresos familiares declarados.');
    expect(result).toContain('⚠️ Se indicaron hijos pero no se especificó la cantidad.');
    expect(result).toContain('⚠️ Se indicó enfermedad de base sin detallar diagnóstico.');
  });

  it('should handle edge case with no data gracefully', () => {
    const datos = {};
    const result = detectarInconsistencias(datos);
    expect(result).toEqual([]);
  });
});
