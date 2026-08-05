const textArea = document.getElementById('emotionText');
const charCount = document.getElementById('charCount');
const levelIndicator = document.getElementById('levelIndicator');
const btn = document.getElementById('shredBtn');
const container = document.getElementById('particleContainer');
const mainContainer = document.getElementById('mainContainer');

// 入力時に文字数をカウントし、レベルを更新
function updateLevel() {
    const len = textArea.value.trim().length;
    charCount.innerText = `${len} 文字`;

    if (len === 0) {
        levelIndicator.innerText = 'レベル: -';
        levelIndicator.style.color = '#718096';
        btn.innerText = 'シュレッダーにかける';
        btn.style.backgroundColor = '#e53e3e';
    } else if (len <= 20) {
        levelIndicator.innerText = 'レベル: 弱 (モヤモヤ)';
        levelIndicator.style.color = '#4a5568';
        btn.innerText = 'シュレッダーにかける';
        btn.style.backgroundColor = '#e53e3e';
    } else if (len <= 50) {
        levelIndicator.innerText = 'レベル: 中 (イライラ)';
        levelIndicator.style.color = '#dd6b20';
        btn.innerText = '少し強めにシュレッダー';
        btn.style.backgroundColor = '#c53030';
    } else if (len <= 100) {
        levelIndicator.innerText = 'レベル: 強 (プッツン)';
        levelIndicator.style.color = '#e53e3e';
        btn.innerText = '強・シュレッダー';
        btn.style.backgroundColor = '#9b2c2c';
    } else {
        levelIndicator.innerText = 'レベル: 激 (爆発寸前!!)';
        levelIndicator.style.color = '#822727';
        btn.innerText = '超・激怒モードで破壊する！！';
        btn.style.backgroundColor = '#742a2a';
    }
}

// テキスト入力のたびに更新
textArea.addEventListener('input', updateLevel);

btn.addEventListener('click', function() {
    const text = textArea.value.trim();
    const len = text.length;

    if (!text) {
        alert('まずはモヤモヤを書き出してみてください。');
        return;
    }

    // 文字数によるパラメーターの初期化
    let particleCount = 40;
    let spreadX = 300;
    let spreadY = 300;
    let durationBase = 1.5;
    let useTextAsParticle = false;
    let isShake = false;

    // レベル判定による演出強化
    if (len <= 20) {
        // 弱
        particleCount = 50;
        spreadX = 300;
    } else if (len <= 50) {
        // 中
        particleCount = 120;
        spreadX = 500;
        spreadY = 400;
    } else if (len <= 100) {
        // 強: 文字も飛び散るようになる
        particleCount = 250;
        spreadX = 800;
        spreadY = 600;
        durationBase = 1.2;
        useTextAsParticle = true;
    } else {
        // 激: 画面揺れ + 背景赤化 + 大量のパーティクル
        particleCount = 500;
        spreadX = 1200;
        spreadY = 800;
        durationBase = 1.0;
        useTextAsParticle = true;
        isShake = true;
    }

    // UIをロック
    textArea.style.opacity = '0';
    btn.disabled = true;
    btn.innerText = '浄化中...';

    // 激モード時のエフェクト適用
    if (isShake) {
        mainContainer.classList.add('shake-animation');
        document.body.style.backgroundColor = '#fed7d7'; // 背景を少し赤く
    }

    // 入力された文字の配列
    const textChars = text.split('');

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // 30%の確率で紙くずではなく「文字」を飛ばす（強・激モードのみ）
        if (useTextAsParticle && Math.random() > 0.7 && textChars.length > 0) {
            particle.innerText = textChars[Math.floor(Math.random() * textChars.length)];
            particle.style.color = '#2d3748';
            particle.style.fontSize = `${Math.random() * 16 + 12}px`; // ランダムな文字サイズ
            particle.style.fontWeight = 'bold';
            particle.style.backgroundColor = 'transparent';
            particle.style.boxShadow = 'none';
        } else {
            // 通常の紙くず
            const size = Math.random() * 10 + 5;
            particle.style.width = `${size}px`;
            particle.style.height = `${size * (Math.random() * 2 + 1)}px`;
            const shade = Math.floor(Math.random() * 50) + 200;
            particle.style.backgroundColor = `rgb(${shade}, ${shade}, ${shade})`;
        }
        
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;

        // 飛ぶ方向と速度をランダムに計算
        const tx = (Math.random() - 0.5) * spreadX;
        const ty = Math.random() * spreadY + (isShake ? -200 : 100); // 激モードは上にも飛び散る
        const rot = (Math.random() - 0.5) * 1080; 
        const scale = Math.random() * 1.5 + 0.5;
        const duration = durationBase + Math.random() * 0.5;
        
        // CSS変数に値をセット
        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);
        particle.style.setProperty('--rot', `${rot}deg`);
        particle.style.setProperty('--scale', scale);
        particle.style.setProperty('--duration', `${duration}s`);

        container.appendChild(particle);
    }

    // アニメーション終了後のリセット処理
    setTimeout(() => {
        textArea.value = '';
        textArea.style.opacity = '1';
        container.innerHTML = '';
        btn.disabled = false;
        
        if (isShake) {
            mainContainer.classList.remove('shake-animation');
            document.body.style.backgroundColor = '#f4f6f9';
        }
        
        updateLevel();
    }, durationBase * 1000 + 600);
});
