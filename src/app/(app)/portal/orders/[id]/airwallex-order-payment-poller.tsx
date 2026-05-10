"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { syncAirwallexPaymentsForOrderAction } from "@/actions/payments";

type Props = { orderId: string; enabled: boolean };

const INTERVAL_MS = 2500;
const MAX_TICKS = 48;

/**
 * While the shopper is back from Airwallex but our DB may lag webhooks, poll intent status via server action + refresh.
 */
export function AirwallexOrderPaymentPoller({ orderId, enabled }: Props) {
  const router = useRouter();
  const ticks = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    const tick = () => {
      ticks.current += 1;
      if (ticks.current > MAX_TICKS) return false;
      void (async () => {
        await syncAirwallexPaymentsForOrderAction(orderId);
        router.refresh();
      })();
      return true;
    };

    void tick();
    const id = setInterval(() => {
      if (!tick()) clearInterval(id);
    }, INTERVAL_MS);

    return () => clearInterval(id);
  }, [enabled, orderId, router]);

  return null;
}
