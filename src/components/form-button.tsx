"use Client";
import { Button } from "@nextui-org/react";
import React, { FC } from "react";
import { useFormStatus } from "react-dom";

interface IFormButton {
  children: React.ReactNode;
}

const FormButton: FC<IFormButton> = ({ children }) => {
  const { pending } = useFormStatus();

  return (
    <Button isLoading={pending} type="submit">
      {children}
    </Button>
  );
};

export default FormButton;
