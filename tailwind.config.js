export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        card: 'var(--card)',
        accent: 'var(--accent)',
        accent2: 'var(--accent2)',
        text: 'var(--text)',
        muted: 'var(--muted)',
        border: 'var(--border)',
        green: 'var(--green)',
        blue: 'var(--blue)',
        pink: 'var(--pink)'
      },
      borderRadius: {
        theme: 'var(--radius)',
        btn: 'var(--btn-radius)'
      },
      fontFamily: {
        main: ['var(--font-main)'],
        body: ['var(--font-body)']
      }
    }
  },
  plugins: []
}
