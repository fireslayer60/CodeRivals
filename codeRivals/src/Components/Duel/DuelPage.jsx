import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import styles from "./DuelPageStyles.module.css";
import socket from "../../socket.js";
import { languageOptions, handleLanguageChange, question } from "./Judge0/Judge0.js";

const DuelPage = () => {
  const [language, setLanguage] = useState("JavaScript");
  const [code, setCode] = useState(languageOptions[language].boilerplate);
  const [testResults, setTestResults] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  const testCases = [
    { input: "hello\n", expected: "olleh\n" },
    { input: "balls\n", expected: "sllab\n" },
    { input: "bruv\n", expected: "vurb\n" },
  ];
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const room_id = queryParams.get("room");

  useEffect(() => {
    const handleMatchOver = ({ winner }) => {
      if (winner === socket.id) {
        alert("Congrats! You Won ");
      } else {
        alert("Sorry, You Lost ");
      }
      setTimeout(() => navigate("/home"), 10000);
    };

    socket.on("Match Over", handleMatchOver);
    return () => {
      socket.off("Match Over", handleMatchOver);
    };
  }, [navigate]);

  const runCode = async () => {
    try {
      let results = [];
      let allPassed = true;
      
      for (const testCase of testCases) {
        const payload = {
          language: "java",
          version: "15.0.2",
          files: [{ name: "my_cool_code.java", content: code }],
          stdin: testCase.input,
          args: [],
          compile_timeout: 10000,
          run_timeout: 3000,
        };

        const response = await fetch("https://emkc.org/api/v2/piston/execute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const result = await response.json();
        const passed = result.run.stdout.trim() === testCase.expected.trim();
        if (!passed) allPassed = false;

        results.push({
          input: testCase.input,
          expected: testCase.expected,
          actual: result.run.stdout.trim(),
          passed,
        });
      }

      setTestResults(results);
      if (allPassed) {
        socket.emit("Won", { room_id, winner: socket.id });
        
      }
      setError("");
    } catch (err) {
      console.error("Execution error:", err);
      setError("An error occurred while executing the code.");
      setTestResults([]);
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
          <CodeMirror value={code} onChange={setCode} extensions={[language === "JavaScript" ? javascript() : language === "Python" ? python() : java()]} height="350px" />
          <button onClick={runCode} className={styles.runButton}>Run Code</button>
        </div>
        <div className={styles.outputSection}>
          <h3>Test Cases</h3>
          {testResults.length > 0 ? (
            testResults.map((test, index) => (
              <div key={index} className={styles.testCase}>
                <p><strong>Input:</strong> {test.input}</p>
                <p><strong>Expected Output:</strong> {test.expected}</p>
                <p><strong>Actual Output:</strong> {test.actual}</p>
                <p className={test.passed ? styles.passed : styles.failed}>{test.passed ? "✅ Passed" : "❌ Failed"}</p>
              </div>
            ))
          ) : (
            <p>No test cases run yet.</p>
          )}
          {error && <pre className={styles.error}>{error}</pre>}
        </div>
      </div>
    </div>
  );
};

export default DuelPage;
