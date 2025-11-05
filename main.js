// Main site JS: products, cart, checkout, UI interactions, background animation, chat demo, dashboard
(() => {
  // --- Utilities ---
  const qs = s => document.querySelector(s);
  const qsa = s => document.querySelectorAll(s);
  const money = v => 'Rp' + Number(v).toLocaleString('id-ID');

  // --- Product data (demo) ---
  const PRODUCTS = [
    {id:'p1',name:'Ferarri SF90xx',price:56000000000, img:'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=800&q=60'},
    {id:'p2',name:'Mc laren 720s',price:69000000000, img:'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=800&q=60'},
    {id:'p3',name:'Lamborghini',price:72000000000, img:'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=60'},
    {id:'p4',name:'Porche GT3',price:2600000000, img:'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=60'}
  ];

  // --- Cart ---
  const CART_KEY = 'speedline_cart_v1';
  function loadCart(){ try{ return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }catch(e){ return [] } }
  function saveCart(c){ localStorage.setItem(CART_KEY, JSON.stringify(c)); updateCartUI(); }
  function addToCart(id){ const p = PRODUCTS.find(x=>x.id===id); if(!p) return; const c = loadCart(); const found = c.find(i=>i.id===id); if(found) found.qty += 1; else c.push({id,qty:1}); saveCart(c); }

  function updateCartUI(){
    const c = loadCart();
    const count = c.reduce((s,i)=>s+i.qty,0);
    const total = c.reduce((s,i)=>{
      const p = PRODUCTS.find(x=>x.id===i.id);
      return s + (p? p.price * i.qty : 0);
    },0);
    const countEls = [qs('#cart-count'), qs('#cart-count-top')].filter(Boolean);
    countEls.forEach(el => el.textContent = count);
    const totalEl = qs('#cart-total'); if(totalEl) totalEl.textContent = money(total);
    // cart items list
    const list = qs('#cart-items');
    if(list){
      list.innerHTML = '';
      c.forEach(it=>{
        const p = PRODUCTS.find(x=>x.id===it.id);
        const div = document.createElement('div'); div.className='cart-item';
        div.innerHTML = `<div>${p.name} x ${it.qty}</div><div>${money(p.price*it.qty)}</div>`;
        list.appendChild(div);
      });
    }
  }
  updateCartUI();

  // --- Render products on products page ---
  const prodContainer = qs('#products');
  if(prodContainer){
    PRODUCTS.forEach(p=>{
      const card = document.createElement('div'); card.className='product';
      card.innerHTML = `<img src="${p.img}" alt=""><div class="name">${p.name}</div><div class="price">${money(p.price)}</div><div><button data-id="${p.id}" class="btn-add">Tambah ke Keranjang</button></div>`;
      prodContainer.appendChild(card);
    });
    prodContainer.addEventListener('click', e => {
      if(e.target.matches('.btn-add')){
        addToCart(e.target.dataset.id);
      }
    });
  }

  // Cart button toggles panel
  const cartBtn = qs('#cart-btn') || qs('#cart-btn-top');
  const cartPanel = qs('#cart-panel');
  if(cartBtn && cartPanel){
    cartBtn.addEventListener('click', ()=> cartPanel.classList.toggle('open'));
  }

  // Checkout modal
  const checkoutBtn = qs('#checkout-btn');
  const checkoutModal = qs('#checkout-modal');
  const closeCheckout = qs('#close-checkout');
  if(checkoutBtn && checkoutModal){
    checkoutBtn.addEventListener('click', ()=>{
      const c = loadCart();
      if(c.length===0){ alert('Keranjang kosong'); return; }
      const summary = qs('#order-summary');
      let html = '<ul>';
      let total = 0;
      c.forEach(it=>{
        const p = PRODUCTS.find(x=>x.id===it.id);
        html += `<li>${p.name} x ${it.qty} — ${money(p.price*it.qty)}</li>`;
        total += p.price*it.qty;
      });
      html += `</ul><p>Total: <strong>${money(total)}</strong></p>`;
      summary.innerHTML = html;
      checkoutModal.classList.remove('hidden');
    });
    closeCheckout.addEventListener('click', ()=> checkoutModal.classList.add('hidden'));
    qs('#checkout-form').addEventListener('submit', e => {
      e.preventDefault();
      const form = new FormData(e.target);
      const order = {id:'ord_'+Date.now(),name:form.get('name'),email:form.get('email'),address:form.get('address'),items:loadCart(),total:Date.now()};
      // save to orders
      const orders = JSON.parse(localStorage.getItem('speedline_orders_v1')||'[]');
      orders.push(order);
      localStorage.setItem('speedline_orders_v1', JSON.stringify(orders));
      // clear cart
      localStorage.removeItem(CART_KEY);
      updateCartUI();
      checkoutModal.classList.add('hidden');
      alert('Pesanan diterima (demo). Riwayat akan muncul di Dashboard.');
    });
  }

  // Dashboard: simulate login and show orders
  const loginSim = qs('#login-sim');
  if(loginSim){
    loginSim.addEventListener('click', ()=>{
      const demoUser = {name:'rava', email:'rava@gmail.com'};
      localStorage.setItem('speedline_user_v1', JSON.stringify(demoUser));
      qs('#profile-info').textContent = `Nama: ${demoUser.name} — ${demoUser.email}`;
      renderOrders();
    });
    // render existing
    const user = JSON.parse(localStorage.getItem('speedline_user_v1')||'null');
    if(user) qs('#profile-info').textContent = `Nama: ${user.name} — ${user.email}`;
    renderOrders();
  }
  function renderOrders(){
    const list = qs('#orders-list');
    if(!list) return;
    const orders = JSON.parse(localStorage.getItem('speedline_orders_v1')||'[]');
    if(orders.length===0) list.innerHTML = '<p>Belum ada pesanan.</p>';
    else{
      list.innerHTML = orders.map(o=>`<div class="order"><strong>${o.id}</strong><div>${o.name} — ${o.email}</div><div>Items: ${o.items.length}</div></div>`).join('');
    }
  }

  // Support form + chat demo
  const supportForm = qs('#support-form');
  if(supportForm){
    supportForm.addEventListener('submit', e=>{
      e.preventDefault();
      alert('Pesan terkirim (demo). Kami akan menghubungi melalui email.');
      supportForm.reset();
    });
  }
  const chatSend = qs('#chat-send');
  if(chatSend){
    chatSend.addEventListener('click', ()=>{
      const input = qs('#chat-input');
      if(!input.value) return;
      const body = qs('#chat-body');
      const div = document.createElement('div'); div.className='msg user'; div.textContent = input.value;
      body.appendChild(div);
      input.value = '';
      setTimeout(()=>{
        const reply = document.createElement('div'); reply.className='msg'; reply.textContent = 'Terima kasih. Tim CS akan membalas segera (demo).';
        body.appendChild(reply);
        body.scrollTop = body.scrollHeight;
      },700);
    });
  }

  // Background canvas animation (blue streaks)
  const canvas = qs('#bg-canvas');
  if(canvas){
    const ctx = canvas.getContext('2d');
    function resize(){ canvas.width = canvas.clientWidth * devicePixelRatio; canvas.height = canvas.clientHeight * devicePixelRatio; ctx.scale(devicePixelRatio, devicePixelRatio); }
    resize(); window.addEventListener('resize', resize);
    const particles = [];
    for(let i=0;i<40;i++) particles.push({x:Math.random()*window.innerWidth, y:Math.random()*200, vx:-0.6 - Math.random()*1.4, size: 60+Math.random()*160, alpha:0.06+Math.random()*0.12});
    function draw(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      particles.forEach(p=>{
        p.x += p.vx;
        if(p.x < -200) p.x = window.innerWidth + 200;
        ctx.beginPath();
        const grad = ctx.createLinearGradient(p.x, p.y, p.x + p.size, p.y + 10);
        grad.addColorStop(0,'rgba(0,140,255,'+p.alpha+')');
        grad.addColorStop(1,'rgba(0,80,200,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(p.x, p.y, p.size, 8);
      });
      requestAnimationFrame(draw);
    }
    draw();
  }

  // initialize cart UI on page load
  updateCartUI();

})();

// --- Payment simulation, notifications, and background music synth ---
(() => {
  const qs = s => document.querySelector(s);

  // Notification helper
  function showSystemNotification(title, body){
    if(typeof Notification !== 'undefined'){
      if(Notification.permission === 'granted'){
        new Notification(title, {body});
      } else if(Notification.permission !== 'denied'){
        Notification.requestPermission().then(p => { if(p==='granted') new Notification(title, {body}); });
      }
    }
  }

  // Toast (in-page) helper
  function toast(msg, timeout=3500){
    let t = document.createElement('div');
    t.textContent = msg;
    t.style.position = 'fixed';
    t.style.right = '18px';
    t.style.top = '18px';
    t.style.background = 'rgba(0,0,0,0.7)';
    t.style.color = 'white';
    t.style.padding = '10px 14px';
    t.style.borderRadius = '8px';
    t.style.zIndex = 1000;
    document.body.appendChild(t);
    setTimeout(()=>{ t.style.transition='opacity 400ms'; t.style.opacity=0; setTimeout(()=>t.remove(),420); }, timeout);
  }

  // Simple WebAudio synth as background music
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  let audioCtx = null;
  let masterGain = null;
  let isMusicPlaying = false;
  let musicNodes = [];

  function startMusic(){
    if(!AudioCtx) return;
    if(audioCtx==null){
      audioCtx = new AudioCtx();
      masterGain = audioCtx.createGain();
      masterGain.gain.value = 0.12;
      masterGain.connect(audioCtx.destination);

      // create a simple repeating pattern
      const now = audioCtx.currentTime;
      const baseFreq = 110;
      for(let i=0;i<4;i++){
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.value = baseFreq * (1 + i*0.5);
        g.gain.value = 0.0015 + i*0.001;
        osc.connect(g); g.connect(masterGain);
        osc.start(now + i*0.05);
        musicNodes.push({osc,g,offset:i*0.8});
      }

      // create light percussive noise
      const bufferSize = 2*audioCtx.sampleRate;
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for(let i=0;i<bufferSize;i++) data[i] = (Math.random()*2-1)*0.15;
      const playNoise = () => {
        const src = audioCtx.createBufferSource();
        src.buffer = noiseBuffer;
        const g = audioCtx.createGain();
        g.gain.value = 0.0009;
        src.connect(g); g.connect(masterGain);
        src.start();
      };
      // schedule occasional noise
      musicNodes.push({playNoise});
    }
    isMusicPlaying = true;
    tickMusic();
  }

  function tickMusic(){
    if(!isMusicPlaying || !audioCtx) return;
    // slowly adjust frequencies for movement
    const t = audioCtx.currentTime;
    musicNodes.forEach((n, idx)=>{
      if(n.osc) n.osc.frequency.setValueAtTime(110*(1+idx*0.45+Math.sin(t*0.1+idx)*0.02), t);
      if(n.playNoise && Math.random()<0.02) n.playNoise();
    });
    requestAnimationFrame(tickMusic);
  }

  function stopMusic(){
    isMusicPlaying = false;
    if(masterGain) masterGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.1);
  }

  // success sound
  function playSuccessTone(){
    if(!AudioCtx) return;
    if(!audioCtx) audioCtx = new AudioCtx();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type='sine'; o.frequency.value=880;
    g.gain.value = 0.0008;
    o.connect(g); g.connect(audioCtx.destination);
    o.start();
    o.frequency.linearRampToValueAtTime(1320, audioCtx.currentTime + 0.18);
    g.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.6);
    setTimeout(()=>{ o.stop(); }, 700);
  }

  // Bind music control buttons
  const musicToggle = qs('#music-toggle');
  const muteToggle = qs('#mute-toggle');
  if(musicToggle){
    musicToggle.addEventListener('click', ()=>{
      if(!isMusicPlaying){ startMusic(); musicToggle.textContent = 'Pause Music'; }
      else { stopMusic(); musicToggle.textContent = 'Play Music'; }
    });
  }
  if(muteToggle){
    muteToggle.addEventListener('click', ()=>{
      if(!audioCtx || !masterGain) return;
      if(masterGain.gain.value > 0.001){ masterGain.gain.setValueAtTime(0, audioCtx.currentTime); muteToggle.textContent='Unmute'; }
      else { masterGain.gain.setValueAtTime(0.12, audioCtx.currentTime); muteToggle.textContent='Mute'; }
    });
  }

  // Payment flow: show payment modal after checkout summary, simulate processing, then mark order paid
  const checkoutModal = qs('#checkout-modal');
  const paymentModal = qs('#payment-modal');
  const checkoutForm = qs('#checkout-form');
  const paymentForm = qs('#payment-form');
  const closePayment = qs('#close-payment');

  if(paymentForm){
    paymentForm.addEventListener('submit', e => {
      e.preventDefault();
      // simple validation pass-through
      const btn = paymentForm.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Memproses...';
      // simulate network/payment delay
      setTimeout(()=>{
        // mark order as paid and save to orders with paid:true
        const form = new FormData(checkoutForm);
        const order = {id:'ord_'+Date.now(), name:form.get('name'), email:form.get('email'), address:form.get('address'), items: JSON.parse(localStorage.getItem('speedline_cart_v1')||'[]'), paid:true, paidAt: new Date().toISOString()};
        const orders = JSON.parse(localStorage.getItem('speedline_orders_v1')||'[]');
        orders.push(order);
        localStorage.setItem('speedline_orders_v1', JSON.stringify(orders));
        localStorage.removeItem('speedline_cart_v1');
        // UI updates
        updateCartUI();
        checkoutModal.classList.add('hidden');
        paymentModal.classList.add('hidden');
        btn.disabled = false;
        btn.textContent = 'Bayar Sekarang';
        playSuccessTone();
        toast('Pembayaran berhasil. Terima kasih!');
        showSystemNotification('Pembayaran Berhasil', `Pesanan ${order.id} telah diterima.`);
      }, 1600);
    });
  }

  if(closePayment){
    closePayment.addEventListener('click', ()=> paymentModal.classList.add('hidden'));
  }

  // Hook checkout button to open payment modal instead of immediate order creation
  const checkoutBtn = document.getElementById('checkout-btn');
  if(checkoutBtn){
    checkoutBtn.addEventListener('click', ()=>{
      const c = JSON.parse(localStorage.getItem('speedline_cart_v1')||'[]');
      if(c.length===0){ alert('Keranjang kosong'); return; }
      // show checkout summary then payment modal
      const summary = qs('#order-summary');
      let html = '<ul>';
      let total = 0;
      c.forEach(it=>{
        const p = (window.PRODUCTS || []).find(x=>x.id===it.id) || null;
        if(p){ html += `<li>${p.name} x ${it.qty} — Rp${(p.price*it.qty).toLocaleString('id-ID')}</li>`; total += p.price*it.qty; }
      });
      html += `</ul><p>Total: <strong>Rp${total.toLocaleString('id-ID')}</strong></p>`;
      if(summary) summary.innerHTML = html;
      checkoutModal.classList.remove('hidden');
      // immediately request notification permission so we can notify after payment
      if(typeof Notification !== 'undefined' && Notification.permission !== 'granted') Notification.requestPermission();
      // show payment modal shortly after user opens checkout (to simulate flow)
      setTimeout(()=> paymentModal.classList.remove('hidden'), 600);
    });
  }

  // expose PRODUCTS to window for payment rendering (used above)
  if(!window.PRODUCTS){
    try{ window.PRODUCTS = JSON.parse(JSON.stringify([].concat([]))); }catch(e){};
  }

})();

// ---- Custom Product Image Upload ----
function handleCustomImage(productId){
    const input = document.getElementById('custom-image-input');
    input.onchange = e => {
        const file = e.target.files[0];
        if(file){
            const reader = new FileReader();
            reader.onload = ev => {
                const images = JSON.parse(localStorage.getItem('product_custom_images')||'{}');
                images[productId] = ev.target.result;
                localStorage.setItem('product_custom_images', JSON.stringify(images));
                const img = document.querySelector(`#product-img-${productId}`);
                if(img) img.src = ev.target.result;
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}

// assign click event after product render
document.addEventListener('DOMContentLoaded', () => {
    const images = JSON.parse(localStorage.getItem('product_custom_images')||'{}');
    document.querySelectorAll('[data-product-id]').forEach(card => {
        const id = card.getAttribute('data-product-id');
        const btn = card.querySelector('.change-img-btn');
        const img = card.querySelector('img');
        if(img) img.id = `product-img-${id}`;
        if(images[id] && img) img.src = images[id];
        if(btn) btn.onclick = () => handleCustomImage(id);
    });
});
