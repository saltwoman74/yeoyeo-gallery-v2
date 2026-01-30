import React, { useState, useEffect } from 'react';
import { Lock, Key, CheckCircle, AlertCircle, Save, LogOut } from 'lucide-react';

import ImageManager from './ImageManager';

const AdminDashboard = ({ onLogout }) => {
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [apiKey, setApiKey] = useState('');
    const [savedKey, setSavedKey] = useState('');
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('settings'); // settings, images


    useEffect(() => {
        // Check local storage for existing key
        const existingKey = localStorage.getItem('gemini_api_key');
        if (existingKey) {
            setSavedKey(existingKey);
            setApiKey(existingKey);
        }
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === '1234') {
            setIsAuthenticated(true);
            setError('');
        } else {
            setError('비밀번호가 올바르지 않습니다.');
        }
    };


    const handleSaveKey = () => {
        if (!apiKey.trim()) {
            setError('API 키를 입력해주세요.');
            return;
        }
        localStorage.setItem('gemini_api_key', apiKey.trim());
        setSavedKey(apiKey.trim());
        alert('API 키가 저장되었습니다.');
    };

    const handleClearKey = () => {
        if (window.confirm('저장된 API 키를 삭제하시겠습니까?')) {
            localStorage.removeItem('gemini_api_key');
            setSavedKey('');
            setApiKey('');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full">
                    <div className="flex justify-center mb-6">
                        <div className="p-3 bg-indigo-100 rounded-full">
                            <Lock className="w-8 h-8 text-indigo-600" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">관리자 로그인</h2>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="비밀번호 입력"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                        >
                            로그인
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <div className="flex justify-between items-center mb-8 border-b pb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">관리자 대시보드</h1>
                            <p className="text-gray-500">챗봇 및 이미지 라이브러리를 관리합니다.</p>
                        </div>
                        <button
                            onClick={onLogout}
                            className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            로그아웃
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex p-1 bg-gray-100 rounded-xl mb-8">
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'settings' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            챗봇 설정 (AI)
                        </button>
                        <button
                            onClick={() => setActiveTab('images')}
                            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'images' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            이미지/영상 관리
                        </button>
                    </div>

                    {activeTab === 'settings' ? (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <Key className="w-6 h-6 text-indigo-600" />
                                <h2 className="text-lg font-bold text-gray-800">Gemini API Key 설정</h2>
                            </div>


                            <div className={`p-4 rounded-xl border ${savedKey ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'} flex items-start gap-3`}>
                                {savedKey ? (
                                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                                ) : (
                                    <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
                                )}
                                <div>
                                    <h3 className={`font-semibold ${savedKey ? 'text-green-800' : 'text-amber-800'}`}>
                                        {savedKey ? 'API 키가 설정되어 있습니다' : 'API 키가 설정되지 않았습니다'}
                                    </h3>
                                    <p className={`text-sm mt-1 ${savedKey ? 'text-green-600' : 'text-amber-600'}`}>
                                        {savedKey
                                            ? '챗봇이 정상적으로 Gemini AI를 사용할 수 있습니다.'
                                            : 'AI 기능을 사용하려면 API 키를 입력해주세요.'}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Google Gemini API Key
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="password"
                                        value={apiKey}
                                        onChange={(e) => setApiKey(e.target.value)}
                                        placeholder="AIzaSy..."
                                        className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none font-mono"
                                    />
                                    <button
                                        onClick={handleSaveKey}
                                        className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 flex items-center gap-2 font-medium transition-colors"
                                    >
                                        <Save className="w-4 h-4" />
                                        저장
                                    </button>
                                </div>

                                {savedKey && (
                                    <button
                                        onClick={handleClearKey}
                                        className="text-sm text-red-500 hover:text-red-700 underline"
                                    >
                                        저장된 키 삭제하기
                                    </button>
                                )}
                            </div>

                            <div className="mt-8 p-4 bg-gray-100 rounded-xl text-sm text-gray-600">
                                <h4 className="font-bold mb-2">참고사항</h4>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>API 키는 브라우저 내부(Local Storage)에만 저장됩니다.</li>
                                    <li>서버로 전송되지 않으므로 개별 기기마다 설정해야 합니다.</li>
                                    <li>Google AI Studio에서 키를 발급받을 수 있습니다.</li>
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <ImageManager />
                    )}
                </div>
            </div>
        </div>
    );
};


export default AdminDashboard;
