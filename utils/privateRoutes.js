import { useRouter } from "next/router";
import { getToken } from "./token";

const PrivateRoutes = (WrappedComponent) => {
  return (props) => {
    if (typeof window !== "undefined") {
      const Router = useRouter();
      const accessToken = getToken("token");

      if (!accessToken) {
        Router.replace("/login");
        return null;
      }
      return <WrappedComponent {...props} />;
    }
    return null;
  };
};

export default PrivateRoutes;
