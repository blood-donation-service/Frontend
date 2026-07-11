import PageLoader from "./PageLoader";
import { useRequests } from "./useRequests";
import { useUserInfo } from "./useUserInfo";

export default function RestrictedArea({ children, variant = "landing" }) {
  const { data, isLoading } = useUserInfo();
  const { data2, isLoading2 } = useRequests();

  if (isLoading || isLoading2 || data === null || data2 === null)
    return <PageLoader variant={variant} />;
  return <>{children}</>;
}
