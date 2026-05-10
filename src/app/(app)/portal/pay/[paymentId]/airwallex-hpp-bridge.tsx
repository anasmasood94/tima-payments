"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { prepareAirwallexHostedPaymentAction } from "@/actions/payments";

type Props = { paymentId: string };

export function AirwallexHppBridge({ paymentId }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const prep = await prepareAirwallexHostedPaymentAction(paymentId);
      if (cancelled) return;

      if (prep.ok && "redirect" in prep) {
        router.replace(prep.redirect);
        return;
      }

      if (!prep.ok) {
        setError(prep.error);
        return;
      }

      try {
        const { init } = await import("@airwallex/components-sdk");
        const { payments } = await init({
          env: prep.awxEnv,
          locale: "en",
          enabledElements: ["payments"],
        });
        if (!payments?.redirectToCheckout) {
          setError("Airwallex.js did not load the Hosted Payment Page module.");
          return;
        }
        // Hosted page options include fields not yet in the bundled TS (e.g. cancelUrl); keep runtime shape from docs.
        (payments.redirectToCheckout as unknown as (props: Record<string, unknown>) => void)({
          intent_id: prep.intentId,
          client_secret: prep.clientSecret,
          currency: prep.currency,
          country_code: prep.countryCode,
          successUrl: prep.successUrl,
          cancelUrl: prep.cancelUrl,
          shopper_email: prep.shopperEmail,
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not open Airwallex checkout.");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [paymentId, router]);

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        <p>{error}</p>
        <p className="mt-2 text-xs text-red-700">Card details are entered only on Airwallex; this app keeps the payment intent id and status.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-center text-sm text-zinc-600">
      Redirecting to Airwallex secure checkout…
    </div>
  );
}
