// --- Application State ---
const state = {
    apiKey: 'AIzaSyDcNN12gMFCUxdF-dOjm0v5d-XDQSbdBUk', // Pre-filled Key
    sheetUrl: 'https://docs.google.com/spreadsheets/d/1Ajn0VVRqQfpjEimzmW7yorf7ecL9RKpXWpsCNj2QhsE/edit?gid=0#gid=0', // Pre-filled Sheet
    marketData: '',
    listings: [], // Array of listing objects
    chatHistory: [], // For Gemini context
};

// --- DOM Elements ---
const els = {
    apiKeyInput: document.getElementById('apiKeyInput'),
    sheetUrlInput: document.getElementById('sheetUrlInput'),
    marketFileInput: document.getElementById('marketFileInput'),
    saveSettingsBtn: document.getElementById('saveSettingsBtn'),
    statusMsg: document.getElementById('statusMsg'),

    userInput: document.getElementById('userInput'),
    sendBtn: document.getElementById('sendBtn'),
    chatHistory: document.getElementById('chatHistory'),
    clearChatBtn: document.getElementById('clearChatBtn'),

    compareBtn: document.getElementById('compareBtn'),
    comparisonModal: document.getElementById('comparisonModal'),
    closeModalBtn: document.getElementById('closeModalBtn'),
    loadImagesBtn: document.getElementById('loadImagesBtn'),

    // Slider elems -- Removed as we use IFrame now
    container: document.getElementById('comparisonContainer'), // Will be null now, but safe
};

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();

    // Auto-login logic
    if (state.apiKey && state.sheetUrl) {
        els.apiKeyInput.value = state.apiKey;
        els.sheetUrlInput.value = state.sheetUrl;
        els.saveSettingsBtn.click();
    }

    // Auto-load Knowledge Base (for deployed app)
    fetchKnowledgeBase();
});

async function fetchKnowledgeBase() {
    try {
        const res = await fetch('./knowledge_base.md');
        if (res.ok) {
            state.marketData = await res.text();
            console.log('Knowledge Base loaded from server');
        }
    } catch (e) {
        console.log('Knowledge Base fetch failed (local mode maybe?)');
    }
}

// --- Mobile Menu Logic ---
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const closeSidebarBtn = document.getElementById('closeSidebarBtn');
const sidebar = document.querySelector('.sidebar');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.add('active');
    });
}

if (closeSidebarBtn) {
    closeSidebarBtn.addEventListener('click', () => {
        sidebar.classList.remove('active');
    });
}

// --- Settings Management ---
els.saveSettingsBtn.addEventListener('click', async () => {
    const key = els.apiKeyInput.value.trim();
    const url = els.sheetUrlInput.value.trim();
    const file = els.marketFileInput.files[0];

    if (!key) {
        showStatus('API Key를 입력해주세요.', 'error');
        return;
    }

    state.apiKey = key;
    state.sheetUrl = url;
    localStorage.setItem('gemini_api_key', key);
    localStorage.setItem('sheet_url', url);

    // Load Market Data if file provided
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            state.marketData = e.target.result;
            showStatus('설정 저장 및 시장 데이터 로드 완료!', 'success');
        };
        reader.readAsText(file);
    } else {
        showStatus('설정 저장 중... (시장 데이터 없음)', 'success');
    }

    // Load Listings if URL provided
    if (url) {
        try {
            // Smart URL Conversion
            let csvUrl = url;
            if (url.includes('docs.google.com/spreadsheets') && !url.includes('export')) {
                // Convert /edit to /export?format=csv
                csvUrl = url.replace(/\/edit.*$/, '/export?format=csv');
            }

            await fetchListings(csvUrl);
        } catch (e) {
            console.error(e);
            showStatus('매물 데이터 로드 실패. 공유 설정을 확인하세요.', 'error');
        }
    }
});

function loadSettings() {
    const key = localStorage.getItem('gemini_api_key');
    const url = localStorage.getItem('sheet_url');
    // If local storage has values, use them. Otherwise use hardcoded defaults.
    if (key) els.apiKeyInput.value = key;
    if (url) els.sheetUrlInput.value = url;

    if (key) state.apiKey = key;
    if (url) state.sheetUrl = url;
}

function showStatus(msg, type) {
    els.statusMsg.textContent = msg;
    els.statusMsg.className = `status-msg ${type}`;
    // Clear success messages after 3s, keep errors longer
    if (type === 'success') setTimeout(() => els.statusMsg.textContent = '', 3000);
}

// --- Data Fetching ---
async function fetchListings(csvUrl) {
    const res = await fetch(csvUrl);
    if (!res.ok) throw new Error('Network response was not ok');
    const text = await res.text();
    state.listings = parseCSV(text);
    console.log('Loaded Listings:', state.listings);
    showStatus(`매물 ${state.listings.length}개 로드 성공! 준비 완료.`, 'success');
}

function parseCSV(text) {
    const lines = text.split('\n').filter(l => l.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
        // Handle simple CSV splitting. 
        // Note: This breaks if cells contain commas. For a robust app, use a CSV library.
        // For this MVP, we assume simple data.
        const row = lines[i].split(',');
        if (row.length < headers.length) continue;

        const obj = {};
        headers.forEach((h, idx) => {
            obj[h] = (row[idx] || '').trim();
        });
        data.push(obj);
    }
    return data;
}

// --- Chat Logic ---
els.sendBtn.addEventListener('click', sendMessage);
els.userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});
els.clearChatBtn.addEventListener('click', () => {
    els.chatHistory.innerHTML = '';
    state.chatHistory = [];
    addSystemMessage('대화 내용이 초기화되었습니다.');
});

async function sendMessage() {
    const text = els.userInput.value.trim();
    if (!text) return;

    // UI
    addMessage(text, 'user');
    els.userInput.value = '';

    // Check for "Image Compare" command override
    if (text.includes('비교') && text.includes('이미지')) {
        els.comparisonModal.classList.remove('hidden');
        addSystemMessage('이미지 비교 창을 열었습니다.');
        return;
    }

    // Call Gemini
    toggleLoading(true);
    try {
        const response = await callGemini(text);
        addMessage(response, 'ai');
    } catch (e) {
        addSystemMessage('오류가 발생했습니다: ' + e.message);
    }
    toggleLoading(false);
}

// Auto-discover model if not set
let cachedModel = 'gemini-1.5-flash';

async function getValidModel(apiKey) {
    // If we already have a working model, try it first (optimistic)
    // But if we are here because of an error, we might want to re-validate.

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        if (!data.models) return 'gemini-1.5-flash'; // Fallback

        // Find a model that supports generateContent and seems reliable
        // Priority: 1.5-flash -> 1.5-pro -> 1.0-pro
        const candidates = data.models.filter(m => m.supportedGenerationMethods.includes('generateContent'));

        // Try to find specific preferred models
        const preferred = ['gemini-1.5-flash', 'gemini-1.5-flash-001', 'gemini-1.5-pro', 'gemini-pro'];

        for (const p of preferred) {
            const found = candidates.find(c => c.name.endsWith(p));
            if (found) return found.name.replace('models/', '');
        }

        // If no preferred found, take the first valid one
        if (candidates.length > 0) return candidates[0].name.replace('models/', '');

        return 'gemini-1.5-flash';
    } catch (e) {
        console.error('Model discovery failed:', e);
        return 'gemini-1.5-flash';
    }
}

async function callGemini(userPrompt) {
    if (!state.apiKey) throw new Error('API 키가 설정되지 않았습니다.');

    // Dynamic Model Selection
    // If previous attempts failed, we might want to re-discover, but for now let's just use the cached one
    // or lazily discover if we get a 404.

    let currentModel = cachedModel;

    // Helper to request
    const performRequest = async (modelName) => {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${state.apiKey}`;
        const systemInstruction = `
            당신은 창원 유니시티 전문 '여여부동산'의 박혜경 소장을 보조하는 AI 챗봇입니다.
            
            [데이터베이스]
            1. 현재 시장 상황: ${state.marketData || '데이터 없음'}
            2. 보유 매물 리스트: ${JSON.stringify(state.listings)}
            
            [핵심 지침]
            1. **매물 추천 출력 양식 (엄격 준수)**:
               매물을 보여줄 때는 반드시 아래 포맷으로 깔끔하게 정리하세요. (이미지 첨부 양식 참고)
               
               [거래종류]
               • 동 (층수): 가격 / 평형or타입 (방향) - 특징
               
               (예시)
               [매매]
               • 111동 (중/37층): 11억 2천만원 / 35평A (남동향) - 탁트인 사화공원 뷰, 입주 협의 가능
               • 108동 (고/40층): 12억 1천만원 / 35평B (남동향) - 인테리어 된 집, 전망 트여 있음
               
            2. **질문 구체화 (중요)**:
               사용자가 대충 "35평 있어?"라고 물으면, 그냥 다 보여주지 말고 먼저 되물어야 합니다.
               - "35평과 56평은 A타입/B타입이 있습니다. 찾으시는 타입이 있으신가요?"
               - "매매, 전세, 월세 중 어떤 거래를 원하시나요?"
               확인 후, 조건에 맞는 매물만 필터링해서 보여주세요.
            
            3. **기타**:
               - 실거래가는 국토부 실거래가 사이트(http://rt.molit.go.kr/) 링크 안내
               - 대출은 금융위원회(https://www.fsc.go.kr/) 참조 안내
               - 세금은 위택스/홈택스 링크 안내
        `;

        const body = {
            contents: [{ role: "user", parts: [{ text: systemInstruction + "\n\n" + userPrompt }] }]
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        return data.candidates[0].content.parts[0].text;
    };

    try {
        return await performRequest(currentModel);
    } catch (e) {
        // If error suggests model not found/supported, try to find a valid one
        if (e.message.includes('not found') || e.message.includes('not supported')) {
            addSystemMessage('모델을 다시 찾고 있습니다... 잠시만요.');
            const newModel = await getValidModel(state.apiKey);
            if (newModel !== currentModel) {
                cachedModel = newModel;
                return await performRequest(newModel);
            }
        }
        throw e;
    }
}

// --- UI Helpers ---
function addMessage(text, type) {
    const div = document.createElement('div');
    div.className = `message ${type}-message`;

    const bubble = document.createElement('div');
    bubble.className = 'bubble';

    // Parse Markdown for AI messages
    if (type === 'ai') {
        bubble.innerHTML = marked.parse(text);
    } else {
        bubble.textContent = text;
    }

    div.appendChild(bubble);
    els.chatHistory.appendChild(div);
    els.chatHistory.scrollTop = els.chatHistory.scrollHeight;
}

function addSystemMessage(text) {
    const div = document.createElement('div');
    div.className = 'message system-message';
    div.innerHTML = `<div class="bubble">${text}</div>`;
    els.chatHistory.appendChild(div);
}

function toggleLoading(isLoading) {
    if (isLoading) {
        els.sendBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
        els.sendBtn.disabled = true;
    } else {
        els.sendBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i>';
        els.sendBtn.disabled = false;
    }
}

// --- Image Comparison Logic ---
els.compareBtn.addEventListener('click', () => {
    els.comparisonModal.classList.remove('hidden');
});
els.closeModalBtn.addEventListener('click', () => {
    els.comparisonModal.classList.add('hidden');
    els.comparisonModal.classList.remove('fullscreen'); // Reset on close
});

// Fullscreen Toggle
const fullscreenBtn = document.getElementById('fullscreenBtn');
if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
        els.comparisonModal.classList.toggle('fullscreen');
        const icon = fullscreenBtn.querySelector('i');
        if (els.comparisonModal.classList.contains('fullscreen')) {
            icon.classList.replace('fa-expand', 'fa-compress');
        } else {
            icon.classList.replace('fa-compress', 'fa-expand');
        }
    });
}

// --- Case Studies Logic ---
const caseStudyBtn = document.getElementById('caseStudyBtn');
const caseStudyModal = document.getElementById('caseStudyModal');
const closeCaseBtn = document.getElementById('closeCaseBtn');

if (caseStudyBtn) {
    caseStudyBtn.addEventListener('click', () => {
        caseStudyModal.classList.remove('hidden');
    });
}

if (closeCaseBtn) {
    closeCaseBtn.addEventListener('click', () => {
        caseStudyModal.classList.add('hidden');
    });
}

// --- FAQ Interaction logic ---
// Exposed to global scope so HTML onclick works
// --- FAQ Interaction logic ---
// Exposed to global scope so HTML onclick works
window.askFAQ = function (topic) {
    // 1. Close Modal (if open, though buttons are now in sidebar)
    if (typeof caseStudyModal !== 'undefined') caseStudyModal.classList.add('hidden');

    // 2. Trigger Chat with specific instructions for AI to ASK BACK
    let prompt = "";
    switch (topic) {
        case '시세': prompt = "자주 묻는 시세 흐름에 대해 알고 싶습니다. 제가 궁금한 점이 무엇인지 먼저 물어봐주세요. (예: 매매/전세 중 무엇인지)"; break;
        case '대출': prompt = "자주 묻는 대출 질문을 확인하고 싶습니다. 대출 종류(구입/전세/사업자)가 무엇인지 물어봐주세요."; break;
        case '청약': prompt = "자주 묻는 청약 질문입니다. 특별공급인지 일반공급인지, 혹은 무순위인지 물어봐주세요."; break;
        case '세금': prompt = "자주 묻는 세금 질문입니다. 취득세, 양도세, 종부세 중 무엇이 궁금한지 물어봐주세요."; break;
        case '거래': prompt = "자주 묻는 거래 행동강령을 보고 싶습니다. 제가 '매수자'인지 '매도자'인지 먼저 확인하고 그에 맞는 강령을 알려주세요."; break;
    }

    if (prompt) {
        // UI Feedback
        els.userInput.value = "질문 선택 중...";

        setTimeout(() => {
            els.userInput.value = prompt;
            els.sendBtn.click();
        }, 300);
    }
};
// loadImagesBtn and slider logic removed as we use Vercel App Iframe
