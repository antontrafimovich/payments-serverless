import { Button, Center } from "@mantine/core";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { apiPaths, popupCenter } from "../../shared";
import { useLocalStorage } from "../../shared/lib/hooks/local-storage";

export const Auth = () => {
  const [token] = useLocalStorage("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <Center>
      <Button
        onClick={() =>
          popupCenter({
            url: `${apiPaths.auth}/auth`,
            title: "Google Auth",
            w: 520,
            h: 570,
          })
        }
      >
        Login
      </Button>
    </Center>
  );
};
