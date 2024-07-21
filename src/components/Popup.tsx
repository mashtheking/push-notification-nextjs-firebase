import type { AlertColor } from "@mui/material";
import { Alert, AlertTitle, Snackbar } from "@mui/material";
import { SyntheticEvent } from "react";

export type Props = {
  isOpen: boolean;
  severity?: AlertColor;
  title?: string;
  message?: string;
  autoHideDuration?: number | null;
  onClose?: (event: SyntheticEvent) => void;
};

export default function Popup(props: Props) {
  return (
    <Snackbar open={props.isOpen} autoHideDuration={props.autoHideDuration}>
      <Alert
        onClose={props.onClose}
        severity={props.severity}
        variant="filled"
        sx={{ width: "100%" }}
      >
        <AlertTitle>{props?.title}</AlertTitle>
        {props?.message}
      </Alert>
    </Snackbar>
  );
}
