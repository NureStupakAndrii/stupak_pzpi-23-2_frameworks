import type { ReactElement } from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchNotifications,
  markNotificationRead,
} from "../api/notifications";
import { fetchSubscriptions } from "../api/subscriptions";
import { fetchSharedVideos } from "../api/videos";
import { useAuth } from "../components/auth-context";
import { EditorialLayout } from "../components/EditorialLayout";
import { StateCard } from "../components/StateCard";
import { VideoCard } from "../components/VideoCard";
import type { Notification, Subscription, VideoSummary } from "../types";

export function ProfilePage(): ReactElement {
  const { currentUser, openAuthDialog } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [sharedVideos, setSharedVideos] = useState<VideoSummary[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (currentUser !== null) {
      return;
    }

    openAuthDialog("login");
    navigate("/", { replace: true });
  }, [currentUser, navigate, openAuthDialog]);

  useEffect(() => {
    let isMounted = true;

    const loadProfileData = async (): Promise<void> => {
      if (currentUser == null) {
        setNotifications([]);
        setSubscriptions([]);
        setSharedVideos([]);
        return;
      }

      setLoading(true);

      try {
        const [notificationItems, subscriptionItems, sharedVideoItems] =
          await Promise.all([
          fetchNotifications(),
          fetchSubscriptions(),
          fetchSharedVideos(),
        ]);

        if (!isMounted) {
          return;
        }

        setNotifications(notificationItems);
        setSubscriptions(subscriptionItems);
        setSharedVideos(sharedVideoItems);
        setErrorMessage("");
      } catch (error: unknown) {
        if (!isMounted) {
          return;
        }

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to load shared videos",
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadProfileData();

    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  const unreadCount = notifications.filter(
    (notification) => notification.readAt === null,
  ).length;

  const handleNotificationClick = async (
    notification: Notification,
  ): Promise<void> => {
    if (notification.readAt !== null) {
      return;
    }

    try {
      const updatedNotification = await markNotificationRead(notification.id);

      setNotifications((items) =>
        items.map((item) =>
          item.id === updatedNotification.id ? updatedNotification : item,
        ),
      );
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to mark notification as read",
      );
    }
  };

  return (
    <EditorialLayout
      activeSection="profile"
      title="Profile"
    >
      <section className="mx-auto w-full max-w-[1320px]">
        <div className="page-panel">
          <div className="space-y-6 p-4 sm:p-5">
            {currentUser == null ? (
              <StateCard title="Checking session" />
            ) : (
              <>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-accent">
                      Signed in as
                    </p>
                    <h2 className="mt-2 text-3xl font-black uppercase tracking-[-0.05em] text-accent">
                      {currentUser.username}
                    </h2>
                  </div>
                  <span className="rounded-full bg-accent px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-paper">
                    Shared {sharedVideos.length} / New {unreadCount}
                  </span>
                </div>

                {loading && <StateCard title="Loading profile" />}
                {!loading && errorMessage.length > 0 && (
                  <StateCard
                    title="Could not load profile"
                    description={errorMessage}
                  />
                )}
                {!loading && errorMessage.length === 0 && (
                  <div className="grid gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(20rem,0.7fr)]">
                    <section className="inner-panel p-5">
                      <h3 className="text-2xl font-black uppercase tracking-[-0.04em] text-accent">
                        Shared videos
                      </h3>
                      {sharedVideos.length === 0 ? (
                        <p className="mt-4 text-base font-semibold text-accent/70">
                          Videos shared with your account will appear here.
                        </p>
                      ) : (
                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                          {sharedVideos.map((video) => (
                            <VideoCard key={video.id} video={video} />
                          ))}
                        </div>
                      )}
                    </section>

                    <div className="flex flex-col gap-5">
                      <section className="inner-panel p-5">
                        <h3 className="text-2xl font-black uppercase tracking-[-0.04em] text-accent">
                          Subscriptions
                        </h3>
                        {subscriptions.length === 0 ? (
                          <p className="mt-4 text-base font-semibold text-accent/70">
                            Subscribe under a video to follow that channel.
                          </p>
                        ) : (
                          <div className="mt-4 flex flex-col gap-3">
                            {subscriptions.map((subscription) => (
                              <div
                                key={subscription.id}
                                className="rounded-2xl border-2 border-accent bg-paper-soft p-4"
                              >
                                <p className="text-lg font-black uppercase tracking-[-0.03em] text-accent">
                                  {subscription.username}
                                </p>
                                <p className="mt-1 text-xs font-black uppercase tracking-[0.2em] text-accent/60">
                                  Channel
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </section>

                      <section className="inner-panel p-5">
                        <h3 className="text-2xl font-black uppercase tracking-[-0.04em] text-accent">
                          Notifications
                        </h3>
                        {notifications.length === 0 ? (
                          <p className="mt-4 text-base font-semibold text-accent/70">
                            New videos from your subscriptions will appear here.
                          </p>
                        ) : (
                          <div className="mt-4 flex flex-col gap-3">
                            {notifications.map((notification) => (
                              <Link
                                key={notification.id}
                                to={`/videos/${notification.videoId}`}
                                onClick={() => {
                                  void handleNotificationClick(notification);
                                }}
                                className="rounded-2xl border-2 border-accent bg-paper-soft p-4 transition hover:bg-paper"
                              >
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                  <p className="text-lg font-black uppercase tracking-[-0.03em] text-accent">
                                    {notification.title}
                                  </p>
                                  {notification.readAt === null && (
                                    <span className="rounded-full bg-accent px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-paper">
                                      New
                                    </span>
                                  )}
                                </div>
                                <p className="mt-2 text-sm font-black uppercase tracking-[0.2em] text-accent/60">
                                  Channel {notification.channelUsername}
                                </p>
                              </Link>
                            ))}
                          </div>
                        )}
                      </section>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </EditorialLayout>
  );
}
