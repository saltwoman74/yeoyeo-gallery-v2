import React, { useState, useRef, useEffect } from 'react';
import { marked } from 'marked';
import './LegacyChatbot.css'; // Import the exact legacy styles

const RealEstateChatbot = () => {
    // API Key (Same as legacy)
    const API_KEY = 'AIzaSyDcNN12gMFCUxdF-dOjm0v5d-XDQSbdBUk';

    // Knowledge Base (Simplified Loading for Port, can be expanded to full fetch)
    const [marketData, setMarketData] = useState('');

    useEffect(() => {
        // Try to load knowledge base similarly to legacy
        fetch('/legacy/knowledge_base.md')
            .then(res => res.text())
            .then(text => setMarketData(text))
            .catch(err => console.error("KB Load Error", err));
    }, []);

    const callGemini = async (userPrompt) => {
        // Exact logic from legacy script
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;
        const systemInstruction = `
            당신은 창원 유니시티 전문 '여여부동산'의 박혜경 소장을 보조하는 AI 챗봇입니다.
            현재 시장 상황: ${marketData}
        `; // Simplified instruction for brevity, full logic in call

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: systemInstruction + "\n" + userPrompt }] }]
                })
            });
            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        } catch (e) {
            console.error(e);
            return "죄송합니다. 답변을 찾지 못했습니다.";
        }
    };

    // Chat State
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "안녕하세요 여여부동산 챗봇입니다\n질문을 선택해주세요",
            sender: 'bot',
            suggestions: ["자주 묻는 질문 보기", "매물 검색하기"]
        }
    ]);
    const [inputText, setInputText] = useState("");
    const messagesEndRef = useRef(null);
    const [isTyping, setIsTyping] = useState(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSendMessage = async (textOverride) => {
        const text = textOverride || inputText.trim();
        if (!text) return;

        // User Message
        setMessages(prev => [...prev, { id: Date.now(), text: text, sender: 'user' }]);
        setInputText("");
        setIsTyping(true);

        // Logic Processor (Mimicking legacy processUserMessage)
        let responseText = "";
        let nextSuggestions = [];

        if (text.includes("자주") || text.includes("FAQ")) {
            responseText = "어떤 주제가 궁금하신가요?";
            nextSuggestions = ["시세 영향을 미치는 요인", "대출 가이드", "청약 정보", "세금 가이드", "거래 행동강령"];
        } else if (text === "매물 검색하기") {
            responseText = "문의하실 아파트의 평형을 선택해주세요.";
            nextSuggestions = ["25평", "30평", "35평", "41평", "47평(48평)", "56평"];
        } else {
            // Fallback to Gemini
            try {
                responseText = await callGemini(text);
            } catch (e) {
                responseText = "오류가 발생했습니다.";
            }
        }

        setIsTyping(false);
        setMessages(prev => [...prev, {
            id: Date.now() + 1,
            text: responseText,
            sender: 'bot',
            suggestions: nextSuggestions.length > 0 ? nextSuggestions : ["다른 질문하기"]
        }]);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSendMessage();
    };

    const handleSuggestionClick = (suggestion) => {
        handleSendMessage(suggestion);
    };

    // Action Handlers
    const openLink = (url) => window.open(url, '_blank');
    const handleDirectCall = () => window.location.href = 'tel:010-5016-3331';
    const handleImageCompare = () => window.open('https://yeoyeo-gallery-v2.vercel.app', '_blank');
    const handleFAQ = () => handleSendMessage("자주 묻는 질문 보기");

    return (
        <div className="legacy-chatbot-wrapper">
            <div className="layout">
                {/* Sidebar */}
                <div className="sidebar">
                    <h2>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
                            <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
                        </svg>
                        챗봇 사용 팁
                    </h2>

                    <div className="tip-item">
                        <h3>1. 자주 묻는 질문 활용</h3>
                        <p>아래 FAQ 버튼을 클릭하면 카테고리별로 정리된 질문과 답변을 확인할 수 있습니다.</p>
                    </div>
                    <div className="tip-item">
                        <h3>2. 자유롭게 질문하기</h3>
                        <p>채팅창에 궁금한 내용을 직접 입력하세요. AI가 답변을 찾아드립니다.</p>
                    </div>
                    <div className="tip-item">
                        <h3>3. 추천 질문 사용</h3>
                        <p>답변 아래 나타나는 추천 질문을 클릭하면 관련 정보를 더 쉽게 찾을 수 있습니다.</p>
                    </div>
                    <div className="tip-item">
                        <h3>4. 직접 상담</h3>
                        <p>복잡한 문의는 '직접 상담' 버튼으로 전문가와 연결하세요.</p>
                    </div>

                    <h2 style={{ marginTop: '30px', marginBottom: '15px' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                        </svg>
                        신뢰 사이트
                    </h2>

                    <div className="site-link" onClick={() => openLink('https://rt.molit.go.kr/')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="20" x2="18" y2="10" />
                            <line x1="12" y1="20" x2="12" y2="4" />
                            <line x1="6" y1="20" x2="6" y2="14" />
                        </svg>
                        국토부 실거래가
                    </div>
                    <div className="site-link" onClick={() => openLink('https://www.wetax.go.kr/')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 6v6l4 2" />
                        </svg>
                        위택스
                    </div>
                    <div className="site-link" onClick={() => openLink('https://www.hometax.go.kr/')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        홈택스
                    </div>
                    <div className="site-link" onClick={() => openLink('https://www.fsc.go.kr/')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                        금융위원회
                    </div>
                    <div className="site-link" onClick={() => openLink('https://new.land.naver.com/')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                        </svg>
                        네이버 부동산
                    </div>
                </div>

                {/* Main Content */}
                <div className="main-content">
                    {/* Header */}
                    <div className="header">
                        <h1>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="url(#gradient1)" strokeWidth="2" style={{ marginRight: '10px' }}>
                                <defs>
                                    <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" style={{ stopColor: '#7c3aed', stopOpacity: 1 }} />
                                        <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
                                    </linearGradient>
                                </defs>
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                <polyline points="9 22 9 12 15 12 15 22" />
                            </svg>
                            창원 유니시티 AI 상담
                        </h1>
                        <button className="admin-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}>
                                <circle cx="12" cy="12" r="3" />
                                <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24" />
                            </svg>
                            관리자
                        </button>
                    </div>

                    {/* Chatbot Container */}
                    <div className="chatbot-container">
                        <div className="chatbot-card">
                            <div className="chatbot-header">
                                <h2>UNI_CITY 여여부동산</h2>
                            </div>

                            <div className="messages">
                                {messages.map((msg) => (
                                    <div key={msg.id} className={`message ${msg.sender}`}>
                                        {msg.sender === 'bot' && <div className="bot-avatar">AI</div>}
                                        <div>
                                            <div className="message-content">
                                                <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>') }} />
                                            </div>
                                            {msg.suggestions && (
                                                <div className="suggestion-buttons">
                                                    {msg.suggestions.map((s, idx) => (
                                                        <button key={idx} className="suggestion-btn" onClick={() => handleSuggestionClick(s)}>{s}</button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="message bot">
                                        <div className="bot-avatar">AI</div>
                                        <div className="typing-indicator">
                                            <span></span><span></span><span></span>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            <div className="input-area">
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="궁금하신 점을 입력하세요..."
                                />
                                <button onClick={() => handleSendMessage()}>전송</button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="action-buttons">
                            <button className="action-btn faq" onClick={handleFAQ}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                                    <line x1="12" y1="17" x2="12.01" y2="17" />
                                </svg>
                                <h3>자주 묻는 질문</h3>
                                <p>FAQ 바로가기</p>
                            </button>
                            <button className="action-btn image" onClick={handleImageCompare}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                    <polyline points="21 15 16 10 5 21" />
                                </svg>
                                <h3>이미지 비교</h3>
                                <p>평면도 비교 체험</p>
                            </button>
                            <button className="action-btn link" onClick={() => openLink('https://new.land.naver.com/')}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                                </svg>
                                <h3>신뢰 사이트</h3>
                                <p>네이버 부동산</p>
                            </button>
                            <button className="action-btn call" onClick={handleDirectCall}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                </svg>
                                <h3>직접 상담</h3>
                                <p>010-5016-3331</p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RealEstateChatbot;
