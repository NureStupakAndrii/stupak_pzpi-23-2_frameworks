import type { ReactElement } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  fetchSubscriptions,
  subscribeToUser,
  unsubscribeFromUser,
} from "../api/subscriptions";
import type { Subscription } from "../types";
import { useAuth } from "./auth-context";

interface SubscribeButtonProps {
  channelUserId: number | null | undefined;
  username: string | null | undefined;
}

export function SubscribeButton({
  channelUserId,
  username,
}: SubscribeButtonProps): ReactElement | null {
  const { currentUser, openAuthDialog } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadSubscriptions = async (): Promise<void> => {
      if (currentUser == null) {
        setSubscriptions([]);
        return;
      }

      try {
        const items = await fetchSubscriptions();

        if (isMounted) {
          setSubscriptions(items);
        }
      } catch (error: unknown) {
        if (isMounted) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Unable to load subscriptions",
          );
        }
      }
    };

    void loadSubscriptions();

    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  const isOwnChannel = useMemo(() => {
    if (currentUser == null || channelUserId == null) {
      return false;
    }

    return String(currentUser.id) === String(channelUserId);
  }, [channelUserId, currentUser]);

  const isSubscribed = subscriptions.some(
    (subscription) => String(subscription.userId) === String(channelUserId),
  );

  if (channelUserId == null || username == null || isOwnChannel) {
    return null;
  }

  const handleClick = async (): Promise<void> => {
    if (currentUser == null) {
      openAuthDialog("login");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      if (isSubscribed) {
        await unsubscribeFromUser(username);
        setSubscriptions((items) =>
          items.filter(
            (subscription) =>
              String(subscription.userId) !== String(channelUserId),
          ),
        );
      } else {
        const subscription = await subscribeToUser(username);
        setSubscriptions((items) => [...items, subscription]);
      }
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to update subscription",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-accent/70">
          Channel: {username}
        </p>
        <button
          type="button"
          onClick={() => {
            void handleClick();
          }}
          disabled={loading}
          className={isSubscribed ? "button-secondary" : "button-primary"}
        >
          {isSubscribed ? "Subscribed" : "Subscribe"}
        </button>
      </div>
      {errorMessage.length > 0 && (
        <p className="text-sm font-semibold text-red-900">{errorMessage}</p>
      )}
    </div>
  );
}
