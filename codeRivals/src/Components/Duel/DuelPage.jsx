import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import styles from "./DuelPageStyles.module.css";

// Import functions and question from duelUtils.js
import { languageOptions, handleLanguageChange, question } from './Judge0/Judge0.js';

const DuelPage = () => {
  const [language, setLanguage] = useState("JavaScript");
  const [code, setCode] = useState(languageOptions[language].boilerplate);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  // Run code and get execution result from Piston
  const runCode = async () => {
    try {
      // Prepare the request payload with the correct Java version
      const payload = {
        language: "java", // Specify Java as the language
        version: "15.0.2", // Use the valid version you found
        files: [
          {
            name: "my_cool_code.java", // File name
            content: code // Simple Java code
          }
        ],
        stdin: "", // Empty stdin
        args: [], // No arguments
        compile_timeout: 10000, // Time limit for compilation
        run_timeout: 3000, // Time limit for execution
        compile_cpu_time: 10000, // Max CPU time during compile
        run_cpu_time: 3000, // Max CPU time during run
        compile_memory_limit: -1, // No memory limit for compilation
        run_memory_limit: -1 // No memory limit for execution
      };
  
      console.log("Payload being sent to API:", JSON.stringify(payload, null, 2));
  
      // Send POST request to Piston API
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
  
      // Handle the response and display output or error
      if (result && result.run) {
        setOutput(result.run.stdout); // Display output
        setError(result.run.stderr || ""); // Display any errors
      } else {
        setError("Error in executing the code.");
        setOutput("");
      }
    } catch (err) {
      console.error("Execution error:", err);
      setError("An error occurred while executing the code.");
      setOutput("");
    }
  };
  
  

  return (
    <div className={styles.duelContainer}>
      <div className={styles.leftSection}>
        <h2>{question.title}</h2>
        <p>{question.description}</p>
        <p><strong>Example:</strong> {question.example}</p>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.ideSection}>
          <h3>Code Editor</h3>
          <select onChange={(e) => handleLanguageChange(e, setLanguage, setCode)} value={language} className={styles.languageDropdown}>
            {Object.keys(languageOptions).map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
          {/* Dynamically choose the right language extension based on selected language */}
          <CodeMirror
            value={code}
            onChange={setCode}
            extensions={[
              language === "JavaScript" ? javascript() :
              language === "Python" ? python() :
              java()
            ]}
            height="350px"
          />
          <button onClick={runCode} className={styles.runButton}>Run Code</button>
        </div>

        <div className={styles.outputSection}>
          <h3>Output</h3>
          {output && <pre className={styles.output}>{output}</pre>}
          {error && <pre className={styles.error}>{error}</pre>}
        </div>
      </div>
    </div>
  );
};

export default DuelPage;
