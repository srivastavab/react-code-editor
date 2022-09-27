import {useState} from "react";
import Editor from "@monaco-editor/react";

const CodeEditorWindow = ({ onChange, language, code, theme }) => {
  const [value, setValue] = useState(code || '');

  const handleCodeChange = (value) => {
    setValue(value);
    onChange('code', value);
  }

  return (
    <>
      <Editor
        height="85vh"
        width="100%"
        language={language || "java"}
        value={value}
        theme={theme}
        defaultValue={`
          public class Main {
              public static void main(String[] args) {
                  System.out.println("Hello World!");
              }
          }
        `}
        onChange={handleCodeChange}
      />
    </>
  );
}

export default CodeEditorWindow;
