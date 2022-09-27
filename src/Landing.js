import CodeEditorWindow from "./CodeEditorWindow";
import {useEffect, useState} from "react";
import {languageOptions} from "./languageOptions";
import useKeyPress from "./useKeyPress";
import {defineTheme} from "./defineTheme";
import LanguagesDropdown from "./LanguagesDropdown";
import ThemeDropdown from "./ThemeDropdown";
import OutputWindow from "./OutputWindow";
import CustomInput from "./CustomInput";
import {Button} from "@mui/material";
import OutputDetails from "./OutputDetails";
import axios from "axios";

const javaDefault = `
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World!");
    }
}
`

const Landing = () => {

  const [code, setCode] = useState(javaDefault);
  const [customInput, setCustomInput] = useState('');
  const [outputDetails, setOutputDetails] = useState(null);
  const [processing, setProcessing] = useState(null);
  const [theme, setTheme] = useState("cobalt");
  const [language, setLanguage] = useState(languageOptions[25]);

  const enterPress = useKeyPress("Enter");
  const ctrlPress = useKeyPress("Control");

  const onSelectChange = (sl) => {
    console.log("selected Option...", sl);
    setLanguage(sl);
  };

  useEffect(() => {
    if (enterPress && ctrlPress) {
      console.log("enterPress", enterPress);
      console.log("ctrlPress", ctrlPress);
      handleCompile();
    }
  }, [ctrlPress, enterPress]);

  const onChange = (action, data) => {
    switch (action) {
      case "code": {
        setCode(data);
        break;
      }
      default: {
        console.warn("case not handled!", action, data);
      }
    }
  };

  const handleCompile = () => {
    setProcessing(true);
    const formData = {
      language_id: language.id,
      // encode source code in base64
      source_code: btoa(code),
      stdin: btoa(customInput),
    };
    const options = {
      method: "POST",
      url: 'https://judge0-ce.p.rapidapi.com/submissions',
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "content-type": "application/json",
        "Content-Type": "application/json",
        "X-RapidAPI-Host": 'judge0-ce.p.rapidapi.com',
        "X-RapidAPI-Key": 'YOUR_KEY',
      },
      data: formData,
    };

    axios
      .request(options)
      .then(function (response) {
        console.log("res.data", response.data);
        const token = response.data.token;
        checkStatus(token).then(() => {});
      })
      .catch((err) => {
        let error = err.response ? err.response.data : err;
        // get error status
        let status = err.response.status;
        console.log("status", status);
        if (status === 429) {
          console.log("too many requests", status);
        }
        setProcessing(false);
        console.log("catch block...", error);
      });
  };

  const checkStatus = async (token) => {
    const options = {
      method: "GET",
      url: `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "X-RapidAPI-Host": 'judge0-ce.p.rapidapi.com',
        "X-RapidAPI-Key": 'YOUR_KEY',
      },
    };
    try {
      let response = await axios.request(options);
      let statusId = response.data.status?.id;

      // Processed - we have a result
      if (statusId === 1 || statusId === 2) {
        // still processing
        setTimeout(() => {
          checkStatus(token);
        }, 2000);

      } else {
        setProcessing(false);
        setOutputDetails(response.data);
        console.log("response.data", response.data);
      }
    } catch (err) {
      console.log("err", err);
      setProcessing(false);
    }
  };

  function handleThemeChange(th) {
    const theme = th;
    console.log("theme...", theme);

    if (["light", "vs-dark"].includes(theme.value)) {
      setTheme(theme);
    } else {
      defineTheme(theme.value).then((_) => setTheme(theme));
    }
  }
  useEffect(() => {
    defineTheme("oceanic-next").then((_) =>
      setTheme({ value: "oceanic-next", label: "Oceanic Next" })
    );
  }, []);

  return (
    <>
      <LanguagesDropdown onSelectChange={onSelectChange} />
      <ThemeDropdown handleThemeChange={handleThemeChange} theme={theme} />
      <CodeEditorWindow onChange={onChange} language={language?.value} code={code} theme={theme.value}/>
      <OutputWindow outputDetails={outputDetails} />
      <CustomInput customInput={customInput} setCustomInput={setCustomInput}/>
      <Button
        onClick={handleCompile}
        disabled={!code}
      >
        {processing ? 'Processing' : 'Compile and Execute'}
      </Button>
      {outputDetails && <OutputDetails outputDetails={outputDetails} />}
    </>
  );
}

export default Landing;
