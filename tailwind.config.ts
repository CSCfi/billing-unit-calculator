import type { Config } from 'tailwindcss';
import containerQueries from '@tailwindcss/container-queries';
// @ts-ignore
import { theme } from '@cscfi/csc-ui/tailwind';

export default <Partial<Config>>{
  theme: {
    fontFamily: {
      sans: ['Noto Sans', 'sans-serif'],
    },
    extend: {
      colors: {
        ...theme.colors,
      },

      gridTemplateColumns: {
        '1-auto': '1fr auto',
        'auto-1': 'auto 1fr',
        'auto-1-auto': 'auto 1fr auto',
      },
    },
  },

  plugins: [
    ({ addBase, theme }: { addBase: Function; theme: Function }) => {
      const extractColorVars = (
        colorObj: Record<string, string | Record<string, string>>,
        colorGroup = '',
      ): Record<string, string> =>
        Object.keys(colorObj).reduce(
          (vars: Record<string, string>, colorKey: string) => {
            const value = colorObj[colorKey];

            const newVars =
              typeof value === 'string'
                ? { [`--tw${colorGroup}-${colorKey}`]: value }
                : extractColorVars(value, `-${colorKey}`);

            return { ...vars, ...newVars };
          },
          {},
        );

      addBase({
        ':root': extractColorVars(theme('colors')),
      });
    },

    containerQueries,
  ],
};
