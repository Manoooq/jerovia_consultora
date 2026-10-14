import { describe, it, expect } from 'vitest';
import { detectarInconsistencias } from './gemini';

describe('detectarInconsistencias', () => {
  it('should return no alerts for valid, consistent data (Happy path)', () => {
    const data = {
      ingresosFamiliares: "3000000",
      egresosMensuales: "2000000",
      costoAlquiler: 1000000,
      hijos: true,
      cantidadHijos: 2,
      enfermedadBase: true,
      enfermedadBaseDetalle: "Diabetes"
    };

    expect(detectarInconsistencias(data)).toEqual([]);
  });

  it('should return no alerts for empty or minimal data', () => {
    expect(detectarInconsistencias({})).toEqual([]);
    expect(detectarInconsistencias({ ingresosFamiliares: null, egresosMensuales: undefined })).toEqual([]);
  });

  describe('Rule violations', () => {
    it('should alert when egresos > ingresos', () => {
      const data = {
        ingresosFamiliares: "2000000",
        egresosMensuales: "2500000"
      };

      const result = detectarInconsistencias(data);
      expect(result.length).toBe(1);
      expect(result[0]).toContain("superan a los ingresos familiares");
      expect(result[0]).toContain("2.500.000 Gs.");
      expect(result[0]).toContain("2.000.000 Gs.");
    });

    it('should alert when costo de alquiler > 50% of ingresos', () => {
      const data = {
        ingresosFamiliares: "2000000",
        costoAlquiler: 1100000
      };

      const result = detectarInconsistencias(data);
      expect(result.length).toBe(1);
      expect(result[0]).toContain("El costo de alquiler representa más del 50%");
    });

    it('should alert when hijos is true but cantidadHijos is missing or falsy', () => {
      const data1 = { hijos: true };
      const data2 = { hijos: "Sí", cantidadHijos: 0 };
      const data3 = { hijos: true, cantidadHijos: "" };

      expect(detectarInconsistencias(data1)[0]).toContain("Se indicaron hijos pero no se especificó la cantidad");
      expect(detectarInconsistencias(data2)[0]).toContain("Se indicaron hijos pero no se especificó la cantidad");
      expect(detectarInconsistencias(data3)[0]).toContain("Se indicaron hijos pero no se especificó la cantidad");
    });

    it('should alert when enfermedadBase is true but enfermedadBaseDetalle is missing or falsy', () => {
      const data1 = { enfermedadBase: true };
      const data2 = { enfermedadBase: "Sí", enfermedadBaseDetalle: "" };

      expect(detectarInconsistencias(data1)[0]).toContain("Se indicó enfermedad de base sin detallar diagnóstico");
      expect(detectarInconsistencias(data2)[0]).toContain("Se indicó enfermedad de base sin detallar diagnóstico");
    });

    it('should return multiple alerts if multiple rules are violated', () => {
       const data = {
        ingresosFamiliares: "2000000",
        egresosMensuales: "3000000",
        costoAlquiler: 1500000,
        hijos: true,
        enfermedadBase: true
      };

      const result = detectarInconsistencias(data);
      expect(result.length).toBe(4);
    });
  });

  describe('Garbage input / Edge cases', () => {
    it('should correctly parse formatted strings with text, symbols and mixed numbers', () => {
      const data = {
        ingresosFamiliares: "Gs. 3.500.000,00", // Will be parsed as 350000000 because all non-digits are removed
        egresosMensuales: "1.500.000 Gs", // 1500000
      };

      const result = detectarInconsistencias(data);
      expect(result).toEqual([]);

      const data2 = {
        ingresosFamiliares: "1.000.000", // 1000000
        egresosMensuales: "1.500.000"    // 1500000
      };
      const result2 = detectarInconsistencias(data2);
      expect(result2.length).toBe(1);
      expect(result2[0]).toContain("superan a los ingresos familiares");
    });

    it('should default to 0 for invalid, non-numeric strings or unexpected types', () => {
      const cases = [
        { ingresosFamiliares: "no tiene", egresosMensuales: "mil quinientos" },
        { ingresosFamiliares: {}, egresosMensuales: [] },
        { ingresosFamiliares: null, egresosMensuales: undefined },
        { ingresosFamiliares: true, egresosMensuales: false },
        { ingresosFamiliares: NaN, egresosMensuales: Infinity }
      ];

      for (const data of cases) {
        expect(detectarInconsistencias(data)).toEqual([]);
      }
    });

    it('should handle negative numbers in strings by removing the negative sign (absolute value)', () => {
       const data = {
        ingresosFamiliares: "-2000000", // Will be 2000000
        egresosMensuales: "-2500000"  // Will be 2500000
      };
      const result = detectarInconsistencias(data);
      expect(result.length).toBe(1);
    });

    it('should handle costoAlquiler as string or unexpected type gracefully', () => {
      const data = {
        ingresosFamiliares: "1000",
        costoAlquiler: "600" // Number("600") is 600
      };
      expect(detectarInconsistencias(data).length).toBe(1); // 600 > 500

      const data2 = {
        ingresosFamiliares: "1000",
        costoAlquiler: "not a number" // Number("not a number") is NaN
      };
      expect(detectarInconsistencias(data2).length).toBe(0); // NaN > 500 is false

      const data3 = {
         ingresosFamiliares: "1000",
         costoAlquiler: {} // Number({}) is NaN
      };
      expect(detectarInconsistencias(data3).length).toBe(0);
    });
  });
});
