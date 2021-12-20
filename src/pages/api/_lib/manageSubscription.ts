import { query as q } from "faunadb";
import { fauna } from "../../../services/fauna";
import { stripe } from "../../../services/stripe";

export async function saveSubscription(
  subscriptionId: string,
  customerId: string,
  createAction = false
) {
  /*Buscar o usuário no banco do FaunaDB com o ID {customerId}*/
  const userRef = await fauna.query(
    q.Select(
      "ref",
      q.Get(q.Match(q.Index("user_by_stripe_customer_id"), customerId))
    )
  );

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  /* Salvar os dados na subscription no FaunaDB  */
  const subscriptionData = {
    id: subscription.id,
    userId: userRef,
    status: subscription.status,
    priceId: subscription.items.data[0].price.id,
  }; //dados que vou salvar

  ///talvez tirar try e catch
  if (createAction) {
    try {
      await fauna.query(
        q.Create(q.Collection("subscriptions"), { data: subscriptionData })
      );
    } catch (err) {
      console.log(err);
    }
  } else {
    await fauna.query(
      q.Replace(
        q.Select(
          "ref",
          q.Get(q.Match(q.Index("subscription_by_id"), subscriptionId))
        ),
        { data: subscriptionData } //replace é um método para atualizar um registro dentro do fauna por completo
      )
    );
  }
}
