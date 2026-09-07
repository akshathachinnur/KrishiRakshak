import React, { useState, useEffect, useRef } from "react";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import FarmerChatbotStats from "./FarmerChatbotStats";
import FeaturesSection from "./FeaturesSection";
import Footer from "./Footer";
import SuccessStories from "./SuccessStories";
import {
  MessageCircle,
  X,
  Menu,
  Sprout,
  Bot,
  Upload,
  Mic,
  Send,
  Square,
  Volume2,
} from "lucide-react";

function HomeIndex() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState("Fastbots AI");
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);

  // Plant Disease Prediction states
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState("English");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Marathi Chatbot states
  const [marathiChatMessages, setMarathiChatMessages] = useState([]);
  const [marathiUserInput, setMarathiUserInput] = useState("");
  const [marathiLoading, setMarathiLoading] = useState(false);

  // Speech assistant states
  const [isListening, setIsListening] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState(null);
  const [speechSynthesis, setSpeechSynthesis] = useState(null);

  // Use a ref to hold the final transcription
  const transcriptionRef = useRef("");

  // Google API Key from env or active key
  const API_KEY = process.env.REACT_APP_GEMINI_API_KEY || "AQ.Ab8RN6KCtvmg6khsidW5aYMc5qOOyLAt8OmpvU_pco0Q9LWxLw";

  // Initialize Speech APIs on component mount
  useEffect(() => {
    if ("speechSynthesis" in window) {
      setSpeechSynthesis(window.speechSynthesis);
    } else {
      console.warn("Speech Synthesis API not supported in this browser.");
    }

    if ("webkitSpeechRecognition" in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "mr-IN";
      setSpeechRecognition(recognition);
    } else {
      console.warn("Speech Recognition API not supported in this browser.");
    }
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });

  const handleVoiceInputMarathi = () => {
    if (!speechRecognition) return;

    if (isListening) {
      speechRecognition.stop();
      setIsListening(false);
      if (transcriptionRef.current.trim()) {
        handleMarathiChatSubmit(transcriptionRef.current.trim());
      }
    } else {
      speechRecognition.lang = "mr-IN";

      speechRecognition.onstart = () => {
        setIsListening(true);
        transcriptionRef.current = "";
        setMarathiUserInput("");
      };

      speechRecognition.onend = () => {
        setIsListening(false);
      };

      speechRecognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      speechRecognition.onresult = (event) => {
        let interimTranscript = "";
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.resultIndex !== undefined && event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setMarathiUserInput(finalTranscript + interimTranscript);
        transcriptionRef.current = finalTranscript;
      };

      speechRecognition.start();
    }
  };

  const handleVoiceOutput = (text, langCode = "mr-IN") => {
    if (speechSynthesis && text) {
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = speechSynthesis.getVoices();
      const selectedVoice = voices.find((voice) =>
        voice.lang.startsWith(langCode)
      );

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      utterance.lang = langCode;

      speechSynthesis.speak(utterance);
    }
  };

  const handleDiseasePrediction = async () => {
    if (!file) {
      alert("Please upload a plant image first!");
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const base64 = await toBase64(file);

      const prompt = `
You are a skilled plant pathologist.
Analyze the uploaded plant image and provide:
- Plant name
- Disease (if any)
- Causes
- Prevention & Treatment methods
Respond in ${language}.
`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  { text: prompt },
                  {
                    inlineData: {
                      mimeType: file.type || "image/jpeg",
                      data: base64,
                    },
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      console.log("Plant disease response:", data);
      
      let botReply = "No response received from model.";
      if (data?.candidates?.[0]?.content?.parts) {
        // Find text part (ignoring thinking parts if any)
        const textParts = data.candidates[0].content.parts
          .filter(p => p.text)
          .map(p => p.text);
        if (textParts.length > 0) {
          botReply = textParts[textParts.length - 1];
        }
      } else if (data?.error?.message) {
        botReply = `API Error: ${data.error.message}`;
      }

      setResult(botReply);
      handleVoiceOutput(botReply, "mr-IN");
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = "Failed to connect to Google Gemini API.";
      setResult(errorMessage);
      handleVoiceOutput(errorMessage, "mr-IN");
    } finally {
      setLoading(false);
    }
  };

  const handleMarathiChatSubmit = async (message) => {
    if (!message.trim()) return;

    const userMessage = { role: "user", text: message };
    const newChatHistory = [...marathiChatMessages, userMessage];
    setMarathiChatMessages(newChatHistory);
    setMarathiUserInput("");
    setMarathiLoading(true);

    try {
      const chatHistoryForAPI = newChatHistory.map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      }));

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              ...chatHistoryForAPI,
              {
                role: "user",
                parts: [{ text: "You are an agricultural expert. Respond in clean, farmer-friendly Marathi." }],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      const botReply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "माफ करा, प्रतिसाद मिळवता आला नाही.";

      const botMessage = { role: "model", text: botReply };
      setMarathiChatMessages((prevMessages) => [...prevMessages, botMessage]);
      handleVoiceOutput(botReply, "mr-IN");
    } catch (error) {
      console.error("Marathi Chat Error:", error);
      const errorMessage = "सर्व्हरशी संपर्क होऊ शकला नाही. कृपया पुन्हा प्रयत्न करा.";
      setMarathiChatMessages((prevMessages) => [
        ...prevMessages,
        { role: "model", text: errorMessage },
      ]);
      handleVoiceOutput(errorMessage, "mr-IN");
    } finally {
      setMarathiLoading(false);
    }
  };

  const formatOutput = (text) => {
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    return lines.map((line, idx) => {
      if (line.toLowerCase().startsWith("plant name")) {
        return (
          <p key={idx} className="text-purple-700 font-bold">
            Plant Name:{" "}
            <span className="font-normal text-black">
              {line.replace(/Plant Name:/i, "").trim()}
            </span>
          </p>
        );
      }
      if (line.toLowerCase().startsWith("disease")) {
        return (
          <p key={idx} className="text-purple-700 font-bold">
            Disease:{" "}
            <span className="font-normal text-black">
              {line.replace(/Disease:/i, "").trim()}
            </span>
          </p>
        );
      }
      if (line.toLowerCase().startsWith("causes")) {
        return (
          <p key={idx} className="text-purple-700 font-bold mt-2">
            Causes:
          </p>
        );
      }
      if (line.toLowerCase().startsWith("prevention")) {
        return (
          <p key={idx} className="text-purple-700 font-bold mt-2">
            Prevention and Treatment:
          </p>
        );
      }
      if (line.toLowerCase().startsWith("disclaimer")) {
        return (
          <p key={idx} className="text-purple-700 font-bold mt-2">
            Disclaimer:{" "}
            <span className="italic text-gray-700 font-normal">
              {line.replace(/Disclaimer:/i, "").trim()}
            </span>
          </p>
        );
      }
      if (line.startsWith("-") || line.startsWith("*")) {
        return (
          <li key={idx} className="ml-6 list-disc text-black">
            {line.replace(/^[-*]\s*/, "").trim()}
          </li>
        );
      }
      return <p key={idx}>{line}</p>;
    });
  };

  return (
    <div>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <FarmerChatbotStats />
      <FeaturesSection />
      <SuccessStories />
      <Footer />

      {/* Floating Bot + Speech Buttons */}
      <div className="fixed bottom-6 right-6 flex gap-3 z-50">
        {/* Chatbot Floating Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-lg transition-all duration-300"
        >
          <MessageCircle size={28} />
        </button>

        {/* Speech Floating Button */}
        <button
          onClick={() => {
            let textToRead = "";

            if (
              selectedModel === "Marathi Chatbot" &&
              marathiChatMessages.length > 0
            ) {
              textToRead = marathiChatMessages.map((msg) => msg.text).join(" ");
            } else if (
              selectedModel === "Plant Disease Prediction" &&
              result
            ) {
              textToRead = result;
            }

            if (textToRead.trim()) {
              handleVoiceOutput(textToRead, "mr-IN");
            } else {
              // 🔊 Marathi intro about crops, weather, disease doctor
              const defaultIntro =
                "आमची वेबसाइट शेतकऱ्यांना मदत करण्यासाठी तयार करण्यात आली आहे. " +
                "येथे पिकांचे रोग निदान, खत व्यवस्थापन, हवामान अंदाज आणि बाजारभावाची अचूक माहिती उपलब्ध आहे. " +
                "शेतकरी पिकांच्या पानांचा फोटो काढून तात्काळ रोग निदान आणि त्यावर सुरक्षित औषधे व उपाय मिळवू शकतात.";
              handleVoiceOutput(defaultIntro, "mr-IN");
            }
          }}
          className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-all duration-300"
        >
          <Volume2 size={28} />
        </button>
      </div>

      {/* Sidebar Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-[9999] transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b bg-purple-600 text-white">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsModelMenuOpen(!isModelMenuOpen)}>
              <Menu size={24} />
            </button>
            <h2 className="text-lg font-semibold">{selectedModel}</h2>
          </div>
          <button onClick={() => setIsOpen(false)}>
            <X size={24} />
          </button>
        </div>

        {/* Model Selection Dropdown */}
        {isModelMenuOpen && (
          <div className="absolute top-14 right-0 w-64 bg-white shadow-lg border rounded-md z-[10000]">
            <button
              onClick={() => {
                setSelectedModel("Fastbots AI");
                setIsModelMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full p-3 hover:bg-purple-100 text-left"
            >
              <Bot size={18} /> Fastbots AI
            </button>
            <button
              onClick={() => {
                setSelectedModel("Plant Disease Prediction");
                setIsModelMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full p-3 hover:bg-purple-100 text-left"
            >
              <Sprout size={18} /> Plant Disease Prediction
            </button>
            <button
              onClick={() => {
                setSelectedModel("Marathi Chatbot");
                setIsModelMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full p-3 hover:bg-purple-100 text-left"
            >
              <Mic size={18} /> Marathi Chatbot (मराठी)
            </button>
          </div>
        )}

        {/* Content Area */}
        <div className="flex flex-col h-[calc(100%-60px)] p-3 overflow-y-auto">
          {selectedModel === "Fastbots AI" && (
            <iframe
              style={{ width: "100%", height: "100%", border: "none" }}
              src="https://app.fastbots.ai/embed/cmfjuk57u07nrqv1kh1wj43ed"
              title="Fastbots Chat"
            ></iframe>
          )}

          {selectedModel === "Plant Disease Prediction" && (
            <div className="flex flex-col gap-3">
              <label className="font-semibold">Upload Plant Image:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="border p-2 rounded"
              />

              <label className="font-semibold">Select Language:</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="border p-2 rounded"
              >
                <option>English</option>
                <option>Hindi</option>
                <option>Telugu</option>
                <option>Tamil</option>
                <option>Bengali</option>
                <option>Kannada</option>
              </select>

              <div className="flex gap-2">
                <button
                  onClick={handleDiseasePrediction}
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 flex items-center justify-center gap-2 flex-grow"
                  disabled={loading}
                >
                  <Upload size={18} />
                  {loading ? "Analyzing..." : "Predict Disease"}
                </button>
              </div>

              {result && (
                <div className="mt-3 flex flex-col gap-3">
                  {file && (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Uploaded Plant"
                      className="max-h-60 object-contain rounded border self-center"
                    />
                  )}
                  <div className="p-4 border rounded bg-gray-50 text-sm leading-relaxed text-left space-y-2">
                    {formatOutput(result)}
                  </div>
                </div>
              )}
            </div>
          )}

          {selectedModel === "Marathi Chatbot" && (
            <div className="flex flex-col h-full">
              <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {marathiChatMessages.length === 0 && (
                  <div className="text-center text-gray-500 italic">
                    मी तुम्हाला कशी मदत करू शकतो? (How can I help you?)
                  </div>
                )}
                {marathiChatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`p-3 rounded-xl max-w-[80%] flex items-center justify-between gap-2 ${
                        msg.role === "user"
                          ? "bg-purple-200 text-right"
                          : "bg-gray-200 text-left"
                      }`}
                    >
                      <span>{msg.text}</span>
                      {msg.role === "model" && (
                        <button
                          onClick={() => handleVoiceOutput(msg.text, "mr-IN")}
                          className="ml-2 text-purple-600 hover:text-purple-800"
                        >
                          <Volume2 size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {marathiLoading && (
                  <div className="flex justify-start">
                    <div className="p-3 rounded-xl max-w-[80%] bg-gray-200 text-left animate-pulse">
                      कृषी सल्ला तयार होत आहे...
                    </div>
                  </div>
                )}
              </div>
              <div className="flex p-4 border-t bg-white">
                <button
                  onClick={handleVoiceInputMarathi}
                  className={`p-2 rounded-full mr-2 ${
                    isListening
                      ? "bg-red-500 text-white"
                      : "bg-purple-600 text-white"
                  }`}
                >
                  {isListening ? <Square size={24} /> : <Mic size={24} />}
                </button>
                <input
                  type="text"
                  value={marathiUserInput}
                  onChange={(e) => setMarathiUserInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleMarathiChatSubmit(marathiUserInput);
                    }
                  }}
                  placeholder="तुमचा प्रश्न येथे विचारा किंवा बोला..."
                  className="flex-grow p-2 border rounded-full"
                  disabled={marathiLoading || isListening}
                />
                <button
                  onClick={() => handleMarathiChatSubmit(marathiUserInput)}
                  className="bg-purple-600 text-white p-2 rounded-full ml-2"
                  disabled={marathiLoading || isListening}
                >
                  <Send size={24} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomeIndex;
