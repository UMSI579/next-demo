// Any import in _app.js will be imported for every page.
// So this allows the loading of a global stylesheet.
import '../styles/global.css'

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}