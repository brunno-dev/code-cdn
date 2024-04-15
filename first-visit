document.addEventListener("DOMContentLoaded", async function() {
    const deviceInfo = getDeviceInfo(); // Coleta informações sobre o dispositivo.
    const userIP = await getUserIP(); // Obtém o IP do usuário.
    const userCity = await fetchLocation(userIP); // Obtém a cidade do usuário baseada no IP.
    const subidData = getDynamicSubids(); // Extrai os subids da URL.
    const brasilTime = getBrasilTime(); // Obtém a data e hora no horário de Brasília

    const postData = {
        ip: userIP,
        city: userCity,
        device: deviceInfo,
        subids: subidData,
        datetime: brasilTime // Adiciona a data e hora no payload enviado.
    };

    sendToWebhook(postData); // Envia os dados coletados para um webhook.
});

// Retorna informações detalhadas sobre o dispositivo do usuário.
function getDeviceInfo() {
    const userAgent = navigator.userAgent;
    return {
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        userAgent: userAgent,
        deviceType: getDeviceType(userAgent), // Identifica o tipo de dispositivo.
        botInfo: isLikelyBot(userAgent), // Verifica se o usuário é um bot.
        language: navigator.language
    };
}

// Função assíncrona para obter o IP público do usuário.
async function getUserIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error('Error fetching IP:', error);
        return 'IP not found';
    }
}

// Função assíncrona para obter a localização do IP do usuário.
async function fetchLocation(ip) {
    try {
        const response = await fetch(`https://ipapi.co/${ip}/json/`);
        const data = await response.json();
        return data.city || 'Cidade não encontrada';
    } catch (error) {
        console.error('Erro ao buscar localização:', error);
        return 'Erro ao localizar';
    }
}

// Captura parâmetros dinâmicos da URL, identificando quaisquer 'subid's.
function getDynamicSubids() {
    const queryParams = new URLSearchParams(window.location.search);
    let subidData = {};
    for (const [key, value] of queryParams.entries()) {
        if (key.startsWith('subid')) {
            subidData[key] = value;
        }
    }
    return subidData;
}

// Determina o tipo de dispositivo com base no user agent.
function getDeviceType(userAgent) {
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
        return 'tablet';
    }
    if (/mobile|iphone|ipod|iemobile|blackberry|android/i.test(userAgent)) {
        return 'mobile';
    }
    return 'desktop';
}

// Verifica o user agent para determinar se o acesso é de um bot.
function isLikelyBot(userAgent) {
    const botSignatures = [
        'bot', 'crawl', 'slurp', 'spider', 'curl', 'wget', 'python', 'php',
        'httpclient', 'java', 'ruby', 'perl', 'monitor', 'archive', 'spinn3r',
        'httprequest', 'getright', 'bingbot', 'googlebot', 'yandexbot', 'duckduckbot','facebot','adsbot-google'
    ];
    const botDetected = botSignatures.find(bot => userAgent.toLowerCase().includes(bot));
    return botDetected ? `Bot detected: ${botDetected}` : 'No bot detected';
}

// Envia os dados coletados para um webhook especificado.
async function sendToWebhook(data) {
    const webhookUrl = 'https://hook.us1.make.com/58293fzkswxqwvnf2lvomeywpmrcqtmh';
    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
        console.log('Dados enviados com sucesso.');
    } catch (error) {
        console.error('Erro ao enviar dados:', error);
    }
}

// Obtém a data e hora no horário de Brasília
function getBrasilTime() {
    const now = new Date();
    return now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' });
}
