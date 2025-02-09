import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import axios from 'axios'; 

// Language options
export const languageOptions = {
  JavaScript: { id: 63, boilerplate: "// Write your JavaScript code here...", language: javascript() },
  Python: { id: 71, boilerplate: "# Write your Python code here...\n", language: python() },
  Java: { id: 62, boilerplate: "public class Main {\n  public static void main(String[] args) {\n    System.out.println(\"Hello, World!\");\n  }\n}", language: java() }
};

// Question data
export const question = {
  title: "Reverse a String",
  description: "Write a function that takes a string as input and returns the reversed string.",
  example: 'Input: "hello" → Output: "olleh"',
};

// Mapping for Piston language codes
const languageMap = {
  JavaScript: "js",
  Python: "python",
  Java: "java"
};



// Handle language change in the editor
export const handleLanguageChange = (e, setLanguage, setCode) => {
  const newLanguage = e.target.value;
  setLanguage(newLanguage);
  setCode(languageOptions[newLanguage].boilerplate);
};
