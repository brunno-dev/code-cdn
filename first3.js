<script>
document.addEventListener("DOMContentLoaded", async function() {
    try {
        const deviceInfo = getDeviceInfo();
        const [userIP, subidData, brasilTime] = await Promise.all([
            getUserIP(),
            getDynamicSubids(),
            Promise.resolve(getBrasilTime()) // Como não é assíncrono, apenas resolvemos imediatamente
        ]);

        const userCity = await fetchLocation(userIP); // Pode ser paralelizado se não depender de userIP

        const postData = {
            ip: userIP,
            city: userCity,
            device: deviceInfo,
            params: subidData,
            datetime: brasilTime
        };

        sendToWebhook(postData);
    } catch (error) {
        console.error('Error in loading data:', error);
    }
});

function getDeviceInfo() {
    const userAgent = navigator.userAgent;
    return {
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        userAgent: userAgent,
        deviceType: getDeviceType(userAgent),
        language: navigator.language
    };
}

async function getUserIP() {
    const response = await fetch('https://api.ipify.org?format=json');
    if (!response.ok) throw new Error('Failed to fetch IP');
    const data = await response.json();
    return data.ip;
}

async function fetchLocation(ip) {
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    if (!response.ok) throw new Error('Failed to fetch location');
    const data = await response.json();
    return data.city || 'Cidade não encontrada';
}

function getDynamicSubids() {
    const queryParams = new URLSearchParams(window.location.search);
    const paramsData = {};
    for (const [key, value] of queryParams.entries()) {
        paramsData[key] = value;
    }
    return paramsData;
}

function getDeviceType(userAgent) {
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
        return 'tablet';
    }
    if (/mobile|iphone|ipod|iemobile|blackberry|android/i.test(userAgent)) {
        return 'mobile';
    }
    return 'desktop';
}

function getBrasilTime() {
    const now = new Date();
    return now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' });
}

async function sendToWebhook(data) {
    const webhookUrl = 'https://hook.us1.make.com/58293fzkswxqwvnf2lvomeywpmrcqtmh';
    const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to send data to webhook');
    console.log('Dados enviados com sucesso.');
}
</script>
