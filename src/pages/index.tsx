import { GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import avatarSvg from "../../public/images/avatar.svg";
import { SubscribeButton } from "../components/SubscribeButton";
import { stripe } from "../services/stripe";
import styles from "./home.module.scss";

/*formas de consumir api:*/

// client-side
// server-side
// static site generation

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  };
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span> Hey, welcome</span>
          <h1>
            News about the <span>React</span> world.
          </h1>
          <p>
            Get access to all the publications <br />
            <span>for {product.amount} monthly</span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>

        <Image src={avatarSvg} alt="Girl coding" />
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve("price_1K4CM8DKqEXhie57IPbnh4dR", {
    expand: ["product"], //busca infpormações do produto
  }); //retrieve quando quero um só

  const product = {
    priceId: price.id, //pega id do preço do produto
    amount: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price.unit_amount / 100), // price.unit_amount = pega o preço do produto em centavos
  };

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, //quanto tempo em seg. eu quero que essa pg se mantenha sem ser recarregada //24h
  };
};
