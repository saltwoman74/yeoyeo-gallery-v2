import React, { useState, useEffect } from 'react';
import { X, Save, Key, Lock, FileText, Database } from 'lucide-react';

const ChatbotSettings = ({ onClose, onSave, defaultSettings, onUpload }) => {
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [settings, setSettings] = useState({
        apiKey: '',
        sheetId: '',
        adminPassword: '1234' // Default, can be changed
    });

    useEffect(() => {
        // Load settings from localStorage if available
        const storedSettings = localStorage.getItem('chatbot_settings');
        if (storedSettings) {
            setSettings(JSON.parse(storedSettings));
        } else if (defaultSettings) {
            setSettings(prev => ({ ...prev, ...defaultSettings }));
        }
    }, [defaultSettings]);

    const handleLogin = (e) => {
        e.preventDefault();
        // Check against current stored password
        if (password === settings.adminPassword) {
            setIsAuthenticated(true);
        } else {
            alert('비밀번호가 올바르지 않습니다.');
        }
    };

    const handleSave = () => {
        localStorage.setItem('chatbot_settings', JSON.stringify(settings));
        if (onSave) onSave(settings);
        alert('설정이 저장되었습니다.');
        onClose();
    };

    if (!isAuthenticated) {
        return (
            <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 rounded-[2.5rem]">
                <button onClick={onClose} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600">
                    <X className="w-6 h-6" />
                </button>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                    <Lock className="w-8 h-8 text-purple-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">관리자 인증</h2>
                <p className="text-gray-500 text-sm mb-6">챗봇 설정을 변경하려면 비밀번호를 입력하세요.</p>
                <form onSubmit={handleLogin} className="w-full max-w-xs space-y-4">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="관리자 비밀번호"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all text-center text-gray-900"
                        autoFocus
                    />
                    <button
                        type="submit"
                        className="w-full py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200"
                    >
                        인증하기
                    </button>
                    <p className="text-xs text-center text-gray-400 mt-4">초기 비밀번호: 1234</p>
                </form>
            </div>
        );
    }

    return (
        <div className="absolute inset-0 bg-white z-50 flex flex-col p-6 rounded-[2.5rem] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <div className="w-2 h-6 bg-purple-600 rounded-full"></div>
                    챗봇 설정
                </h2>
                <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                    <X className="w-5 h-5 text-gray-600" />
                </button>
            </div>

            <div className="space-y-6 flex-1">
                {/* 1. Google Sheet ID */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                        <Database className="w-4 h-4 text-green-600" />
                        Google Sheet ID
                    </label>
                    <p className="text-xs text-gray-400">매물 데이터가 있는 구글 시트 ID입니다.</p>
                    <input
                        type="text"
                        value={settings.sheetId}
                        onChange={(e) => setSettings({ ...settings, sheetId: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 outline-none text-sm font-mono bg-gray-50 text-gray-900"
                        placeholder="1J12E..."
                    />
                </div>

                {/* 2. API Key */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                        <Key className="w-4 h-4 text-orange-500" />
                        Gemini API Key
                    </label>
                    <p className="text-xs text-gray-400">Google AI Studio에서 발급받은 키입니다.</p>
                    <input
                        type="password"
                        value={settings.apiKey}
                        onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 outline-none text-sm font-mono bg-gray-50 text-gray-900"
                        placeholder="AIza..."
                    />
                </div>

                {/* 3. Knowledge Base Upload (New) */}
                <div className="space-y-2 pt-4 border-t border-gray-100">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-500" />
                        지식 문서 업로드 (Knowledge Base)
                    </label>
                    <p className="text-xs text-gray-400">AI가 참고할 문서(.txt, .md)를 업로드하세요.</p>
                    <div className="flex gap-2">
                        <input
                            type="file"
                            accept=".txt,.md,.csv,.json"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file && onUpload) {
                                    const reader = new FileReader();
                                    reader.onload = (ev) => {
                                        onUpload(ev.target.result);
                                        alert('문서가 로드되었습니다.');
                                    };
                                    reader.readAsText(file);
                                }
                            }}
                            className="w-full text-sm text-gray-500
                              file:mr-4 file:py-2 file:px-4
                              file:rounded-full file:border-0
                              file:text-xs file:font-semibold
                              file:bg-purple-50 file:text-purple-700
                              hover:file:bg-purple-100"
                        />
                    </div>
                </div>

                {/* 4. Admin Password */}
                <div className="space-y-2 pt-4 border-t border-gray-100">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                        <Lock className="w-4 h-4 text-gray-500" />
                        관리자 비밀번호 변경
                    </label>
                    <input
                        type="text"
                        value={settings.adminPassword}
                        onChange={(e) => setSettings({ ...settings, adminPassword: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 outline-none text-sm font-mono bg-gray-50 text-gray-900"
                        placeholder="새 비밀번호"
                    />
                </div>
            </div>

            <button
                onClick={handleSave}
                className="w-full py-4 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200 flex items-center justify-center gap-2 mt-6"
            >
                <Save className="w-5 h-5" />
                설정 저장하기
            </button>
        </div>
    );
};

export default ChatbotSettings;
