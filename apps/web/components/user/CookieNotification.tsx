import { Icon } from "@brickninja-org/ui/icons";

import { withSuspense } from "@/lib/with-suspense";
import { useUser } from "@/components/user/use-user";

export const CookieNotification = withSuspense(() => {
  const user = useUser();

  if (user) {
    return;
  }

  return (
    <div className="flex gap-3 items-center py-1 px-4 max-w-[264px] min-w-full mb-2 bg-(--color-background-light) rounded-xs border border-(--color-border-dark) leading-normal">
      <Icon icon="cookie" />
      Changing settings will store cookies in your browser.
    </div>
  );
});
