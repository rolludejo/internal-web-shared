export class ComputedColor {
  constructor(
    public r: number,
    public g: number,
    public b: number,
    public a: number | null,
  ) {}

  /**
   * 来自 `getComputedStyle` 结果中 `color` 的值。
   *
   * NOTE: 来自 `getComputedStyle` 的颜色总是 rgb 或 rgba。
   * see: https://stackoverflow.com/a/67006298
   */
  static fromComputedString(str: string) {
    const result =
      /^rgba?\([^\d]*(\d+)[^\d]*(\d+)[^\d]*(\d+)[^\d]*(?:(\d+)[^\d]*)?\)$/.exec(
        str,
      );
    if (!result) {
      console.warn(`unknown computed color: ${str}`);
      return null;
    }

    const [_, r, g, b, a] = result;

    return new ComputedColor(
      parseInt(r!),
      parseInt(g!),
      parseInt(b!),
      a ? parseInt(a) : null,
    );
  }
}
