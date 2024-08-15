/**
 * Color as returned from /api/store/v1/colors
 * @see https://api.bricklink.com/api/store/v1/colors
 */
export type Color = {
  /** The color ID */
  color_id: number;

  /** The color name */
  color_name: string;

  /** The parent color ID */
  color_code: string;

  /** The color type */
  color_type: string;
}
