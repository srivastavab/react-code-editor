import {TextField} from "@mui/material";

const CustomInput = ({ customInput, setCustomInput }) => {
  return (
    <>
      {''}
      <TextField
        rows={5}
        multiline
        value={customInput}
        onChange={(e) => setCustomInput(e.target.value)}
        placeholder="Custom Input"
      />
    </>
  );
}

export default CustomInput;
