import PageLoader from "./PageLoader";
import { useUserInfo } from "./useUserInfo";

export default function RestrictedArea({ children, variant = "landing" }) {
  const { data, isLoading } = useUserInfo();

  if (isLoading || data === null) return <PageLoader variant={variant} />;
  return <>{children}</>;
}
