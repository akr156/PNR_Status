import { Button, TextField } from "@mui/material";
import { useEffect, useState, forwardRef } from "react";
import TrainIcon from "@mui/icons-material/Train";
import "./Form.css";
interface IFormProps {
  isFormVisible: boolean;
  onSubmitForm: (inputValue: string) => void;
}
export const Form = forwardRef((props: IFormProps, ref) => {
  const [inputValue, setInputValue] = useState("");
  const onKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      props.onSubmitForm(inputValue);
    }
  };
  useEffect(() => setInputValue(""), [props]);
  return props.isFormVisible ? (
    <div className="form-container">
      <TextField
        className="input"
        onChange={(event) => setInputValue(event.target.value)}
        onKeyDown={(event) => onKeyDown(event)}
        placeholder={"Please enter your PNR"}
        inputRef={ref}
      ></TextField>
      <Button
        onClick={() => props.onSubmitForm(inputValue)}
        color="success"
        startIcon={<TrainIcon></TrainIcon>}
        variant="outlined"
        className="button"
      >
        Check
      </Button>
    </div>
  ) : (
    <></>
  );
});
