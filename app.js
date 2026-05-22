document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 🌌 MODULE 1: HOLOGRAPHIC STARFIELD ENGINE
  // ==========================================
  const spaceCanvas = document.getElementById("space-canvas");
  const ctx = spaceCanvas.getContext("2d");
  
  let width = (spaceCanvas.width = window.innerWidth);
  let height = (spaceCanvas.height = window.innerHeight);
  
  window.addEventListener("resize", () => {
    width = spaceCanvas.width = window.innerWidth;
    height = spaceCanvas.height = window.innerHeight;
  });
  
  const particles = [];
  const particleCount = 60;
  const maxDistance = 120;
  let mouse = { x: null, y: null, radius: 140 };
  
  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  
  window.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });
  
  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = Math.random() * 0.3 - 0.15;
      this.speedY = Math.random() * 0.3 - 0.15;
      this.color = Math.random() > 0.5 ? "rgba(0, 247, 255, 0.3)" : "rgba(255, 0, 255, 0.3)";
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      
      if (mouse.x !== null && mouse.y !== null) {
        let dx = this.x - mouse.x;
        let dy = this.y - mouse.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          let force = (mouse.radius - dist) / mouse.radius;
          let angle = Math.atan2(dy, dx);
          this.x += Math.cos(angle) * force * 1.2;
          this.y += Math.sin(angle) * force * 1.2;
        }
      }
      
      if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
        this.reset();
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }
  
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
  
  function animateSpace() {
    ctx.clearRect(0, 0, width, height);
    
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
      
      for (let j = i + 1; j < particles.length; j++) {
        let dx = particles[i].x - particles[j].x;
        let dy = particles[i].y - particles[j].y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < maxDistance) {
          let alpha = (maxDistance - dist) / maxDistance * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 247, 255, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animateSpace);
  }
  animateSpace();

  // ==========================================
  // 🥞 MODULE 2: INTERACTIVE 3D STACK TOWER
  // ==========================================
  const stackContainer = document.querySelector(".stack-container");
  const stackTower = document.querySelector(".stack-tower");
  const stackLayers = document.querySelectorAll(".stack-layer");
  
  let targetRotX = 60;
  let targetRotZ = -40;
  let currentRotX = 60;
  let currentRotZ = -40;
  
  let isDragging = false;
  let previousMouseX = 0;
  let previousMouseY = 0;
  
  // Custom drag mechanics
  stackContainer.addEventListener("mousedown", (e) => {
    isDragging = true;
    previousMouseX = e.clientX;
    previousMouseY = e.clientY;
  });
  
  window.addEventListener("mouseup", () => {
    isDragging = false;
  });
  
  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - previousMouseX;
    const deltaY = e.clientY - previousMouseY;
    
    targetRotZ += deltaX * 0.35;
    targetRotX = Math.max(30, Math.min(80, targetRotX - deltaY * 0.35));
    
    previousMouseX = e.clientX;
    previousMouseY = e.clientY;
  });

  // Touch Support
  stackContainer.addEventListener("touchstart", (e) => {
    isDragging = true;
    previousMouseX = e.touches[0].clientX;
    previousMouseY = e.touches[0].clientY;
  });
  
  window.addEventListener("touchend", () => { isDragging = false; });
  window.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - previousMouseX;
    const deltaY = e.touches[0].clientY - previousMouseY;
    
    targetRotZ += deltaX * 0.35;
    targetRotX = Math.max(30, Math.min(80, targetRotX - deltaY * 0.35));
    
    previousMouseX = e.touches[0].clientX;
    previousMouseY = e.touches[0].clientY;
  });
  
  function easeRotation() {
    const k = 0.12;
    currentRotX += (targetRotX - currentRotX) * k;
    currentRotZ += (targetRotZ - currentRotZ) * k;
    
    if (!stackTower.classList.contains("focused")) {
      stackTower.style.transform = `rotateX(${currentRotX}deg) rotateZ(${currentRotZ}deg)`;
    }
    requestAnimationFrame(easeRotation);
  }
  easeRotation();

  // Color layers data
  const layerVisuals = {
    1: { name: "FRONTEND CORE", color: "var(--neon-cyan)", glow: "neon-glow-cyan", cpu: 96, speed: 96, nodes: 92 },
    2: { name: "BACKEND API", color: "var(--neon-magenta)", glow: "neon-glow-magenta", cpu: 92, speed: 95, nodes: 88 },
    3: { name: "DATABASE LAYER", color: "var(--neon-purple)", glow: "neon-glow-purple", cpu: 94, speed: 95, nodes: 90 },
    4: { name: "DEVOPS GRID", color: "var(--neon-green)", glow: "neon-glow-green", cpu: 91, speed: 96, nodes: 85 }
  };

  const detailPanel = document.querySelector(".detail-panel");
  const detailHeader = document.querySelector(".detail-header");
  const detailContent = document.querySelector(".detail-content");

  stackLayers.forEach(layer => {
    layer.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = parseInt(layer.getAttribute("data-id"));
      
      if (stackTower.classList.contains(`focus-${id}`)) {
        resetStack();
        return;
      }
      
      stackTower.className = "stack-tower focused";
      stackTower.classList.add(`focus-${id}`);
      stackTower.style.transform = "none";
      
      loadLayerVisuals(id);
    });
  });

  stackContainer.addEventListener("click", () => {
    resetStack();
  });

  function resetStack() {
    stackTower.className = "stack-tower exploded";
    setTimeout(() => {
      if (!stackTower.classList.contains("focused")) {
        stackTower.className = "stack-tower";
      }
    }, 500);
    loadGlobalVisuals();
  }

  function animateSVGCircle(element, val) {
    if (!element) return;
    const circumference = 220;
    const offset = circumference - (val / 100) * circumference;
    element.style.strokeDashoffset = offset;
  }

  function loadLayerVisuals(id) {
    const data = layerVisuals[id];
    detailPanel.className = "detail-panel cyber-card";
    detailPanel.classList.add(data.glow);
    playBeep(480 + id * 100);
    
    detailHeader.innerHTML = `
      <span style="color: ${data.color}; font-size: 11px;">⚡ INTERACTIVE HUD GRID: ${data.name}</span>
      <button class="btn-cyber" style="padding: 2px 8px; font-size: 8px;" id="btn-close-detail">X</button>
    `;
    
    detailContent.innerHTML = `
      <div class="hud-dials-row">
        <div class="hud-dial-container cyan">
          <svg class="hud-svg-ring">
            <circle class="bg" cx="36" cy="36" r="35"></circle>
            <circle class="fill" id="ring-cpu" cx="36" cy="36" r="35"></circle>
          </svg>
          <div class="hud-dial-value" id="val-cpu">0%</div>
          <div class="hud-dial-label">LOAD</div>
        </div>
        <div class="hud-dial-container magenta">
          <svg class="hud-svg-ring">
            <circle class="bg" cx="36" cy="36" r="35"></circle>
            <circle class="fill" id="ring-speed" cx="36" cy="36" r="35"></circle>
          </svg>
          <div class="hud-dial-value" id="val-speed">0%</div>
          <div class="hud-dial-label">EFFICIENCY</div>
        </div>
        <div class="hud-dial-container purple">
          <svg class="hud-svg-ring">
            <circle class="bg" cx="36" cy="36" r="35"></circle>
            <circle class="fill" id="ring-nodes" cx="36" cy="36" r="35"></circle>
          </svg>
          <div class="hud-dial-value" id="val-nodes">0%</div>
          <div class="hud-dial-label">STABILITY</div>
        </div>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr; gap: 8px; margin-top: 5px;">
        <div class="metric-bar-group">
          <div class="metric-bar-info">
            <span>SYNAPSE_SIGNAL_FLOW</span>
            <span>${data.cpu}%</span>
          </div>
          <div class="metric-bar-wrapper">
            <div class="metric-bar-fill" style="width: ${data.cpu}%; background-color: ${data.color};"></div>
          </div>
        </div>
      </div>
    `;

    // Trigger ring fill transitions after layout load
    setTimeout(() => {
      animateSVGCircle(document.getElementById("ring-cpu"), data.cpu);
      animateSVGCircle(document.getElementById("ring-speed"), data.speed);
      animateSVGCircle(document.getElementById("ring-nodes"), data.nodes);
      
      document.getElementById("val-cpu").innerText = `${data.cpu}%`;
      document.getElementById("val-speed").innerText = `${data.speed}%`;
      document.getElementById("val-nodes").innerText = `${data.nodes}%`;
    }, 50);

    document.getElementById("btn-close-detail").addEventListener("click", (e) => {
      e.stopPropagation();
      resetStack();
    });
  }

  function loadGlobalVisuals() {
    detailPanel.className = "detail-panel cyber-card";
    detailHeader.innerHTML = `<span>📊 REAL-TIME CORE OBSERVABILITY</span>`;
    
    detailContent.innerHTML = `
      <div class="hud-dials-row">
        <div class="hud-dial-container cyan">
          <svg class="hud-svg-ring">
            <circle class="bg" cx="36" cy="36" r="35"></circle>
            <circle class="fill" id="ring-cpu-global" cx="36" cy="36" r="35"></circle>
          </svg>
          <div class="hud-dial-value" id="val-cpu-global">98%</div>
          <div class="hud-dial-label">LIGHTHOUSE</div>
        </div>
        <div class="hud-dial-container magenta">
          <svg class="hud-svg-ring">
            <circle class="bg" cx="36" cy="36" r="35"></circle>
            <circle class="fill" id="ring-speed-global" cx="36" cy="36" r="35"></circle>
          </svg>
          <div class="hud-dial-value" id="val-speed-global">94%</div>
          <div class="hud-dial-label">COVERAGE</div>
        </div>
        <div class="hud-dial-container purple">
          <svg class="hud-svg-ring">
            <circle class="bg" cx="36" cy="36" r="35"></circle>
            <circle class="fill" id="ring-nodes-global" cx="36" cy="36" r="35"></circle>
          </svg>
          <div class="hud-dial-value" id="val-nodes-global">99%</div>
          <div class="hud-dial-label">UPTIME</div>
        </div>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr; gap: 4px;">
        <div class="metric-bar-group">
          <div class="metric-bar-info">
            <span>MULTI_REGION_OBSERVABILITY_GRID</span>
            <span>ACTIVE</span>
          </div>
          <div class="metric-bar-wrapper">
            <div class="metric-bar-fill" style="width: 95%; background-color: var(--neon-cyan);"></div>
          </div>
        </div>
      </div>
    `;
    
    setTimeout(() => {
      animateSVGCircle(document.getElementById("ring-cpu-global"), 98);
      animateSVGCircle(document.getElementById("ring-speed-global"), 94);
      animateSVGCircle(document.getElementById("ring-nodes-global"), 99);
    }, 50);
  }

  // ==========================================
  // 🖥️ MODULE 3: INTERACTIVE CRT TERMINAL
  // ==========================================
  const terminalBody = document.querySelector(".terminal-body");
  const quickCmdBtns = document.querySelectorAll(".quick-cmd-btn");

  function writeToTerminal(text, type = "stdout", delay = 0) {
    return new Promise((resolve) => {
      const line = document.createElement("div");
      if (type === "prompt") {
        line.innerHTML = `<span class="term-prompt">aviral@dev-os ~ $</span> <span class="term-cmd">${text}</span>`;
        terminalBody.appendChild(line);
        terminalBody.scrollTop = terminalBody.scrollHeight;
        resolve();
      } else {
        line.className = `term-stdout term-${type}`;
        terminalBody.appendChild(line);
        
        let charIndex = 0;
        function typeChar() {
          if (charIndex < text.length) {
            line.innerHTML += text.charAt(charIndex);
            charIndex++;
            terminalBody.scrollTop = terminalBody.scrollHeight;
            setTimeout(typeChar, delay);
          } else {
            resolve();
          }
        }
        
        if (delay > 0) {
          typeChar();
        } else {
          line.innerHTML = text;
          terminalBody.scrollTop = terminalBody.scrollHeight;
          resolve();
        }
      }
    });
  }

  function playBeep(pitch = 440, duration = 0.05) {
    if (document.getElementById("btn-sound").classList.contains("active")) {
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(pitch, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + duration);
      } catch (e) {}
    }
  }

  const commands = {
    neofetch: async () => {
      playBeep(520);
      await writeToTerminal("neofetch --visuals", "prompt");
      await writeToTerminal("-----------------------------------------", "stdout", 1);
      await writeToTerminal("👨💻 IDENTITY : Aviral Mishra v5.0.0", "stdout", 1);
      await writeToTerminal("⚡ ROLES    : Full Stack Engineer • SaaS Architect", "stdout", 1);
      await writeToTerminal("🌐 PORTFOLIO: aviral-portfolio-pcym.vercel.app", "success", 1);
      await writeToTerminal("📦 PACKS    : Next.js • React • NestJS • Docker", "stdout", 1);
      await writeToTerminal("☁️ HOST     : AWS ECS Container Cluster", "stdout", 1);
      await writeToTerminal("🚀 ACTIVE   : 50,000+ Synaptic Operations Daily", "success", 1);
      await writeToTerminal("-----------------------------------------", "stdout", 1);
    },
    deploy: async () => {
      playBeep(480);
      document.querySelector(".status-dot").classList.add("active");
      await writeToTerminal("deploy --env production --visualize-flow", "prompt");
      await writeToTerminal("▸ Synchronizing with AWS production ECR node...", "stdout", 2);
      await writeToTerminal("▸ Running static build pipelines: Vite ➔ Next.js ➔ CSS compiles", "stdout", 2);
      
      // Simulate code lines streaming
      for (let i = 0; i < 5; i++) {
        let codeChunk = "COMPILE STAGE: " + Array.from({length: 25}, () => String.fromCharCode(Math.floor(Math.random() * 60) + 65)).join("");
        await writeToTerminal(codeChunk, "success", 1);
      }
      
      await writeToTerminal("▸ Container created successfully: aviral/saas-engine:v5.0", "success", 2);
      await writeToTerminal("▸ Routing traffic to production tasks (ECS Swapping)...", "stdout", 2);
      await writeToTerminal("✅ DEPLOY SUCCESSFUL | ROUTING ACTIVE | ZERO DOWNTIME", "success", 4);
      document.querySelector(".status-dot").classList.remove("active");
      playBeep(840, 0.12);
    },
    matrix: async () => {
      playBeep(640);
      await writeToTerminal("matrix-rain.sh", "prompt");
      for (let i = 0; i < 15; i++) {
        let columns = Array.from({length: 30}, () => String.fromCharCode(Math.floor(Math.random() * 90) + 33)).join(" ");
        await writeToTerminal(columns, "success", 1);
      }
    },
    clear: async () => {
      playBeep(320);
      terminalBody.innerHTML = "";
    }
  };

  quickCmdBtns.forEach(btn => {
    btn.addEventListener("click", async () => {
      const cmd = btn.getAttribute("data-cmd");
      if (commands[cmd]) {
        btn.disabled = true;
        await commands[cmd]();
        btn.disabled = false;
      }
    });
  });

  document.getElementById("btn-sound").addEventListener("click", () => {
    const btn = document.getElementById("btn-sound");
    btn.classList.toggle("active");
    if (btn.classList.contains("active")) {
      btn.innerHTML = '🔊 SOUND ACTIVE';
      playBeep(440);
    } else {
      btn.innerHTML = '🔇 SOUND MUTED';
    }
  });

  // ==========================================
  // 🧠 MODULE 4: PULSATING SYNAPTIC CANVAS
  // ==========================================
  const synapticCanvas = document.getElementById("synaptic-hub-canvas");
  const synCtx = synapticCanvas.getContext("2d");
  
  let sWidth = (synapticCanvas.width = synapticCanvas.parentElement.clientWidth);
  let sHeight = (synapticCanvas.height = 240);
  
  window.addEventListener("resize", () => {
    if (synapticCanvas.parentElement) {
      sWidth = synapticCanvas.width = synapticCanvas.parentElement.clientWidth;
    }
  });

  const nodes = [];
  const nodeCount = 24;
  
  class SynNode {
    constructor() {
      this.x = Math.random() * sWidth;
      this.y = Math.random() * sHeight;
      this.radius = Math.random() * 2 + 1;
      this.vx = Math.random() * 0.4 - 0.2;
      this.vy = Math.random() * 0.4 - 0.2;
      this.pulse = Math.random() * Math.PI;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.pulse += 0.03;
      
      if (this.x < 0 || this.x > sWidth) this.vx *= -1;
      if (this.y < 0 || this.y > sHeight) this.vy *= -1;
    }
    draw() {
      const alpha = 0.4 + Math.sin(this.pulse) * 0.3;
      synCtx.beginPath();
      synCtx.arc(this.x, this.y, this.radius + Math.sin(this.pulse) * 1.5, 0, Math.PI * 2);
      synCtx.fillStyle = `rgba(0, 247, 255, ${alpha})`;
      synCtx.shadowBlur = 10;
      synCtx.shadowColor = "rgba(0, 247, 255, 0.6)";
      synCtx.fill();
      synCtx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < nodeCount; i++) {
    nodes.push(new SynNode());
  }

  // Energy signals passing between synaptic nodes
  let signals = [];

  function animateSynapse() {
    synCtx.clearRect(0, 0, sWidth, sHeight);
    
    // Draw background HUD nodes
    synCtx.strokeStyle = "rgba(138, 43, 226, 0.05)";
    synCtx.lineWidth = 1;
    for (let i = 20; i < sWidth; i += 40) {
      synCtx.beginPath();
      synCtx.moveTo(i, 0);
      synCtx.lineTo(i, sHeight);
      synCtx.stroke();
    }
    
    // Draw interconnected routes
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].update();
      nodes[i].draw();
      
      for (let j = i + 1; j < nodes.length; j++) {
        let dx = nodes[i].x - nodes[j].x;
        let dy = nodes[i].y - nodes[j].y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 80) {
          let alpha = (80 - dist) / 80 * 0.15;
          synCtx.beginPath();
          synCtx.moveTo(nodes[i].x, nodes[i].y);
          synCtx.lineTo(nodes[j].x, nodes[j].y);
          synCtx.strokeStyle = `rgba(138, 43, 226, ${alpha})`;
          synCtx.lineWidth = 0.5;
          synCtx.stroke();
        }
      }
    }

    // Spawn visual signal pulses along nodes
    if (Math.random() > 0.95 && nodes.length > 2) {
      let startIdx = Math.floor(Math.random() * nodes.length);
      let endIdx = Math.floor(Math.random() * nodes.length);
      if (startIdx !== endIdx) {
        signals.push({
          start: nodes[startIdx],
          end: nodes[endIdx],
          progress: 0,
          speed: 0.015
        });
      }
    }

    // Process pulses
    signals.forEach((s, idx) => {
      s.progress += s.speed;
      if (s.progress >= 1) {
        signals.splice(idx, 1);
        return;
      }
      let px = s.start.x + (s.end.x - s.start.x) * s.progress;
      let py = s.start.y + (s.end.y - s.start.y) * s.progress;
      
      synCtx.beginPath();
      synCtx.arc(px, py, 3, 0, Math.PI * 2);
      synCtx.fillStyle = "hsl(var(--neon-magenta))";
      synCtx.shadowBlur = 8;
      synCtx.shadowColor = "hsl(var(--neon-magenta))";
      synCtx.fill();
      synCtx.shadowBlur = 0;
    });

    // Draw central spinning graphic HUD compass
    synCtx.strokeStyle = "rgba(0, 247, 255, 0.08)";
    synCtx.lineWidth = 1;
    synCtx.beginPath();
    synCtx.arc(sWidth / 2, sHeight / 2, 45, 0, Math.PI * 2);
    synCtx.stroke();

    synCtx.save();
    synCtx.translate(sWidth / 2, sHeight / 2);
    synCtx.rotate(Date.now() * 0.0005);
    synCtx.beginPath();
    synCtx.moveTo(-35, 0); synCtx.lineTo(35, 0);
    synCtx.moveTo(0, -35); synCtx.lineTo(0, 35);
    synCtx.stroke();
    synCtx.restore();

    requestAnimationFrame(animateSynapse);
  }
  animateSynapse();

  // ==========================================
  // 📼 MODULE 5: LOFI CASSETTE PLAYER
  // ==========================================
  const cassetteWheels = document.querySelectorAll(".cassette-wheel");
  const musicEqCanvas = document.getElementById("music-eq-canvas");
  const eqCtx = musicEqCanvas.getContext("2d");
  const btnMusicPlay = document.getElementById("btn-music-play");
  const trackTitle = document.querySelector(".track-title");
  
  let isMusicPlaying = false;
  let synthBars = Array.from({length: 22}, () => Math.random() * 8);
  
  function drawEqualizer() {
    eqCtx.clearRect(0, 0, musicEqCanvas.width, musicEqCanvas.height);
    const barWidth = (musicEqCanvas.width / synthBars.length) - 2;
    
    for (let i = 0; i < synthBars.length; i++) {
      if (isMusicPlaying) {
        synthBars[i] += (Math.random() * 4 - 2);
        synthBars[i] = Math.max(2, Math.min(musicEqCanvas.height - 3, synthBars[i]));
      } else {
        synthBars[i] += (0 - synthBars[i]) * 0.15;
      }
      
      const gradient = eqCtx.createLinearGradient(0, musicEqCanvas.height, 0, 0);
      gradient.addColorStop(0, "rgba(0, 247, 255, 0.8)");
      gradient.addColorStop(1, "rgba(255, 0, 255, 0.8)");
      
      eqCtx.fillStyle = gradient;
      eqCtx.fillRect(
        i * (barWidth + 2), 
        musicEqCanvas.height - synthBars[i], 
        barWidth, 
        synthBars[i]
      );
    }
    requestAnimationFrame(drawEqualizer);
  }
  drawEqualizer();

  btnMusicPlay.addEventListener("click", () => {
    isMusicPlaying = !isMusicPlaying;
    playBeep(isMusicPlaying ? 580 : 380);
    
    if (isMusicPlaying) {
      btnMusicPlay.innerHTML = '<i class="fas fa-pause"></i> PAUSE';
      btnMusicPlay.style.borderColor = "var(--neon-magenta)";
      btnMusicPlay.style.color = "var(--neon-magenta)";
      btnMusicPlay.style.boxShadow = "var(--glow-magenta)";
      trackTitle.innerHTML = "⚡ aviral-lofi-beats-v5.mp3";
      cassetteWheels.forEach(w => w.classList.add("spinning"));
    } else {
      btnMusicPlay.innerHTML = '<i class="fas fa-play"></i> PLAY SYSTEM BEATS';
      btnMusicPlay.style.borderColor = "hsl(var(--neon-purple) / 0.4)";
      btnMusicPlay.style.color = "hsl(var(--neon-purple))";
      btnMusicPlay.style.boxShadow = "none";
      trackTitle.innerHTML = "SYSTEM STANDBY";
      cassetteWheels.forEach(w => w.classList.remove("spinning"));
    }
  });

  // Default Boot logs
  writeToTerminal("SYSTEM COMMAND SEQUENCE LOADED SUCCESS.", "success");
  writeToTerminal("Initialized visual digital HUD console twin.", "success");
  writeToTerminal("Port node mapping pointing to aviral-portfolio-pcym.vercel.app", "success");
  writeToTerminal("Click /neofetch or /deploy action bars below to boot graphs.", "stdout");
  
  loadGlobalVisuals();
});
