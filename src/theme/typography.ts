/**
 * Typography tokens for consistent text styling
 */
export const typography = {
  title: {
    fontSize: 30,
    fontWeight: '600' as const,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 22,
  },
  body: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 21,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 22,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  status: {
    fontSize: 21,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
} as const;

