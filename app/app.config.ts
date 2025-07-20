export default defineAppConfig({
  // https://ui.nuxt.com/getting-started/theme#design-system
  ui: {
    colors: {
      primary: 'violet',
      neutral: 'neutral',
    },
    modal: {
      slots: {
        footer: 'flex items-center justify-end gap-1.5 p-4 sm:px-6',
        close: 'absolute top-4 end-4 cursor-pointer',
      },
      variants: {
        transition: {
          true: {
            overlay:
              'data-[state=open]:animate-[fade-in_75ms_ease-out] data-[state=closed]:animate-[fade-out_75ms_ease-in]',
            content:
              'data-[state=open]:animate-[scale-in_75ms_ease-out] data-[state=closed]:animate-[scale-out_75ms_ease-in]',
          },
        },
      },
    },
    button: {
      base: 'cursor-pointer',
      defaultVariants: {},
    },
  },
})
