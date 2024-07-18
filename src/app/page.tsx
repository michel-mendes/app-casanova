import fundo from "../app/images/casa-nova-acabamentos-frente.jpg"
import styles from "./page.module.css";

export default function Home() {

  return (
    <main className={styles.main}>
      <img src={fundo.src} alt="" className={styles.fundo} />
    </main>
  )

}
