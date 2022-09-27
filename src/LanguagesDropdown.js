import {languageOptions} from "./languageOptions";
import Select from "react-select";
import {customStyles} from "./customStyles";

const LanguagesDropdown = ({ onSelectChange }) => {
  return (
    <>
      <Select
        placeholder={`Filter By Category`}
        options={languageOptions}
        styles={customStyles}
        defaultValue={languageOptions[25]}
        onChange={(selectedOption) => onSelectChange(selectedOption)}
      />
    </>
  );
}

export default LanguagesDropdown;
