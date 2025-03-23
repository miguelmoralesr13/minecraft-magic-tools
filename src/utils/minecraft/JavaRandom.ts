
/**
 * Implementación de Java Random en TypeScript para asegurar
 * que la generación de números aleatorios sea idéntica a Java
 */
export class JavaRandom {
  private seed: bigint;
  private multiplier: bigint = BigInt("0x5DEECE66D");
  private addend: bigint = BigInt("0xB");
  private mask: bigint = (BigInt(1) << BigInt(48)) - BigInt(1);

  constructor(seed: number | string) {
    // Convertir el seed a bigint y aplicar el mismo procesamiento inicial que Java
    let seedValue: bigint;
    
    if (typeof seed === "string") {
      // Convertir string a un número para la semilla
      seedValue = BigInt(this.hashString(seed));
    } else {
      seedValue = BigInt(seed);
    }
    
    this.seed = (seedValue ^ this.multiplier) & this.mask;
  }

  private hashString(str: string): number {
    // Implementación sencilla de hash para convertir strings a números
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0; // Convertir a entero de 32 bits
    }
    return hash;
  }

  // Genera el siguiente número pseudoaleatorio
  private next(bits: number): number {
    this.seed = (this.seed * this.multiplier + this.addend) & this.mask;
    return Number((this.seed >> BigInt(48 - bits)) & ((BigInt(1) << BigInt(bits)) - BigInt(1)));
  }

  // Métodos públicos equivalentes a los de Java Random
  public nextInt(bound?: number): number {
    if (bound === undefined) {
      return this.next(32);
    }
    
    if (bound <= 0) {
      throw new Error("bound must be positive");
    }

    // Asegurarse de tener una distribución uniforme
    const boundM1 = bound - 1;
    if ((bound & boundM1) === 0) {
      // Si bound es potencia de dos
      return this.next(31) & boundM1;
    }

    let bits: number;
    let val: number;
    do {
      bits = this.next(31);
      val = bits % bound;
    } while (bits - val + boundM1 < 0);

    return val;
  }

  public nextLong(): number {
    return ((this.next(32) << 32) + this.next(32));
  }

  public nextBoolean(): boolean {
    return this.next(1) !== 0;
  }

  public nextFloat(): number {
    return this.next(24) / (1 << 24);
  }

  public nextDouble(): number {
    return (((BigInt(this.next(26)) << BigInt(27)) + BigInt(this.next(27))) / (BigInt(1) << BigInt(53))) as unknown as number;
  }

  // Avanza n pasos el generador
  public skip(n: number): void {
    for (let i = 0; i < n; i++) {
      this.next(1);
    }
  }
}
