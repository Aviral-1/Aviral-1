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
  const particleCount = 75;
  const maxDistance = 110;
  let mouse = { x: null, y: null, radius: 150 };
  
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
      this.speedX = Math.random() * 0.4 - 0.2;
      this.speedY = Math.random() * 0.4 - 0.2;
      this.color = Math.random() > 0.6 ? "rgba(0, 247, 255, 0.4)" : "rgba(138, 43, 226, 0.4)";
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      
      // Repel from mouse
      if (mouse.x !== null && mouse.y !== null) {
        let dx = this.x - mouse.x;
        let dy = this.y - mouse.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          let force = (mouse.radius - dist) / mouse.radius;
          let angle = Math.atan2(dy, dx);
          this.x += Math.cos(angle) * force * 1.5;
          this.y += Math.sin(angle) * force * 1.5;
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
      ctx.shadowBlur = 5;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }
  
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
  
  function animateSpace() {
    ctx.clearRect(0, 0, width, height);
    
    // Draw constellation lines
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
      
      for (let j = i + 1; j < particles.length; j++) {
        let dx = particles[i].x - particles[j].x;
        let dy = particles[i].y - particles[j].y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < maxDistance) {
          let alpha = (maxDistance - dist) / maxDistance * 0.15;
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
  
  // Custom spring mechanics for rotation
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
    
    // Restrict rotation bounds
    targetRotZ += deltaX * 0.35;
    targetRotX = Math.max(30, Math.min(85, targetRotX - deltaY * 0.35));
    
    previousMouseX = e.clientX;
    previousMouseY = e.clientY;
  });
  
  // Touch support for mobiles
  stackContainer.addEventListener("touchstart", (e) => {
    isDragging = true;
    previousMouseX = e.touches[0].clientX;
    previousMouseY = e.touches[0].clientY;
  });
  
  window.addEventListener("touchend", () => {
    isDragging = false;
  });
  
  window.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - previousMouseX;
    const deltaY = e.touches[0].clientY - previousMouseY;
    
    targetRotZ += deltaX * 0.35;
    targetRotX = Math.max(30, Math.min(85, targetRotX - deltaY * 0.35));
    
    previousMouseX = e.touches[0].clientX;
    previousMouseY = e.touches[0].clientY;
  });
  
  // Ease rotation inside requestAnimationFrame
  function easeRotation() {
    const k = 0.12; // Easing constant
    currentRotX += (targetRotX - currentRotX) * k;
    currentRotZ += (targetRotZ - currentRotZ) * k;
    
    // Only apply rotation matrix if stack isn't locked in focus mode
    if (!stackTower.classList.contains("focused")) {
      stackTower.style.transform = `rotateX(${currentRotX}deg) rotateZ(${currentRotZ}deg)`;
    }
    requestAnimationFrame(easeRotation);
  }
  easeRotation();

  // Layer details configuration
  const layerData = {
    1: {
      title: "⚛️ FRONTEND CORE SYSTEMS",
      color: "var(--neon-cyan)",
      glowClass: "neon-glow-cyan",
      skills: [
        { name: "React.js (v18.x)", level: 96 },
        { name: "Next.js (v14.x)", level: 96 },
        { name: "TypeScript (v5.x)", level: 92 },
        { name: "Tailwind CSS", level: 96 },
        { name: "Framer Motion", level: 88 },
        { name: "Redux Toolkit", level: 91 }
      ],
      info: "Expertise in designing high-fidelity dashboards, SEO optimized server-side rendered (SSR) web applications, and fluid micro-interactions with perfect lighthouse scores."
    },
    2: {
      title: "🚀 BACKEND GATEWAY INFRASTRUCTURE",
      color: "var(--neon-magenta)",
      glowClass: "neon-glow-magenta",
      skills: [
        { name: "Node.js v20 LTS", level: 96 },
        { name: "NestJS (v10.x)", level: 92 },
        { name: "Express.js", level: 95 },
        { name: "GraphQL APIs", level: 88 },
        { name: "REST APIs (OpenAPI)", level: 96 },
        { name: "WebSockets", level: 85 }
      ],
      info: "Advanced knowledge in building distributed API architectures, multi-tier guards, high-throughput microservices, real-time message brokers, and highly-secure authentication nodes."
    },
    3: {
      title: "🗄️ DATABASE & CACHE ARCHITECTURE",
      color: "var(--neon-purple)",
      glowClass: "neon-glow-purple",
      skills: [
        { name: "PostgreSQL", level: 94 },
        { name: "MongoDB Document Store", level: 91 },
        { name: "Redis In-Memory Cache", level: 88 },
        { name: "Prisma ORM", level: 95 },
        { name: "TypeORM", level: 90 },
        { name: "Supabase & Firebase", level: 88 }
      ],
      info: "Specialized in index optimization, query performance tuning, connection pooling management, vector indexing (pgvector), redis-backed job queues, and advanced migrations."
    },
    4: {
      title: "☁️ DEVOPS & PRODUCTION ORCHESTRATION",
      color: "var(--neon-green)",
      glowClass: "neon-glow-green",
      skills: [
        { name: "AWS Solutions Architecture", level: 91 },
        { name: "Docker Containerization", level: 95 },
        { name: "GitHub Actions CI/CD", level: 96 },
        { name: "Kubernetes K8s Cluster", level: 85 },
        { name: "Terraform IaC", level: 82 },
        { name: "Vercel & Cloud Deployments", level: 96 }
      ],
      info: "Experienced in setting up multi-region high-availability server grids, automated test pipelines, blue-green zero-downtime updates, infrastructure-as-code, and system observability."
    }
  };

  // Stack Layer click interactions
  const detailPanel = document.querySelector(".detail-panel");
  const detailHeader = document.querySelector(".detail-header");
  const detailContent = document.querySelector(".detail-content");

  stackLayers.forEach((layer) => {
    layer.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = parseInt(layer.getAttribute("data-id"));
      
      // If clicked again on a focused layer, collapse it
      if (stackTower.classList.contains(`focus-${id}`)) {
        resetStack();
        return;
      }
      
      // Focus stack animation
      stackTower.className = "stack-tower focused";
      stackTower.classList.add(`focus-${id}`);
      stackTower.style.transform = "none";
      
      // Update details panel
      loadLayerDetails(id);
    });
  });

  // Click outside tower to reset
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
    loadGlobalDashboard();
  }

  function loadLayerDetails(id) {
    const data = layerData[id];
    detailPanel.className = "detail-panel cyber-card";
    detailPanel.classList.add(data.glowClass);
    
    detailHeader.innerHTML = `
      <span style="color: ${data.color}">${data.title}</span>
      <button class="btn-cyber" style="padding: 2px 8px; font-size: 10px;" id="btn-close-detail">X</button>
    `;
    
    let skillsHTML = "";
    data.skills.forEach(skill => {
      skillsHTML += `
        <div class="metric-bar-group">
          <div class="metric-bar-info">
            <span>${skill.name}</span>
            <span>${skill.level}%</span>
          </div>
          <div class="metric-bar-wrapper">
            <div class="metric-bar-fill" style="width: ${skill.level}%; background-color: ${data.color}; color: ${data.color}"></div>
          </div>
        </div>
      `;
    });
    
    detailContent.innerHTML = `
      <p style="font-size: 12px; line-height: 1.4; color: var(--text-secondary); border-left: 2px solid ${data.color}; padding-left: 10px; margin-bottom: 10px;">${data.info}</p>
      <div style="display: grid; grid-template-columns: 1fr; gap: 8px; max-height: 180px; overflow-y: auto; padding-right: 5px;">
        ${skillsHTML}
      </div>
    `;

    document.getElementById("btn-close-detail").addEventListener("click", (e) => {
      e.stopPropagation();
      resetStack();
    });
  }

  function loadGlobalDashboard() {
    detailPanel.className = "detail-panel cyber-card";
    detailHeader.innerHTML = `<span>⚡ GLOBAL SYSTEM PERFORMANCE</span>`;
    detailContent.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-family: 'JetBrains Mono', monospace; font-size: 11px;">
        <div class="status-indicator">🚀 SAAS PLATFORM: <span class="term-success">PRODUCTION</span></div>
        <div class="status-indicator">🧠 NEURAL ENGINE: <span class="term-success">ACTIVE</span></div>
        <div class="status-indicator">☁️ CLOUD STATUS: <span class="term-success">NOMINAL</span></div>
        <div class="status-indicator">🕒 SYSTEM UPTIME: <span>99.97%</span></div>
      </div>
      <div class="architecture-flow">
        <canvas class="flow-canvas" id="flow-canvas"></canvas>
      </div>
      <div style="text-align: center; font-size: 10px; color: hsl(var(--text-secondary)/0.6); margin-top: 5px;">
        Interactive Pipeline: Client ➔ CDN Edge ➔ NestJS API ➔ pgvector ➔ AWS ECS
      </div>
    `;
    initPipelineFlow();
  }

  // ==========================================
  // 🖥️ MODULE 3: INTERACTIVE CRT TERMINAL
  // ==========================================
  const terminalBody = document.querySelector(".terminal-body");
  const quickCmdBtns = document.querySelectorAll(".quick-cmd-btn");
  
  let terminalHistory = [];
  
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

  // Play audio sound effects
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
        gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + duration);
      } catch (e) {}
    }
  }

  // Preset execution paths for Terminal Commands
  const commands = {
    neofetch: async () => {
      playBeep(600);
      await writeToTerminal("neofetch --developer", "prompt");
      await writeToTerminal("--------------------------------------------", "stdout", 2);
      await writeToTerminal("👨💻 NAME      : Aviral Mishra", "stdout", 2);
      await writeToTerminal("⚡ ARCHITECT : Full Stack Engineer & SaaS Architect", "stdout", 2);
      await writeToTerminal("📍 LOCATION  : India 🇮🇳", "stdout", 2);
      await writeToTerminal("🧠 BRAIN CORE: OpenAI GPT-4o + LangChain.js", "stdout", 2);
      await writeToTerminal("💻 SHELL     : macOS Sonoma + Zsh + Warp Terminal", "stdout", 2);
      await writeToTerminal("🚀 PRODUCTION: 10k+ active users | AWS ECS Grid", "stdout", 2);
      await writeToTerminal("🔥 MISSION   : Code • Build • Scale • Repeat", "stdout", 2);
      await writeToTerminal("--------------------------------------------", "stdout", 2);
    },
    deploy: async () => {
      playBeep(500);
      document.querySelector(".status-dot").classList.add("active");
      await writeToTerminal("deploy --env production --strategy blue-green", "prompt");
      await writeToTerminal("▸ Initializing docker daemon handshake...", "stdout", 5);
      await writeToTerminal("▸ Authenticating with AWS ECR production registry... [CONNECTED]", "stdout", 5);
      await writeToTerminal("▸ Building production distribution bundle (Next.js v14 + TypeScript)...", "stdout", 5);
      await writeToTerminal("▸ Code Quality Check (SonarQube A+): 94% coverage, 0 vulnerabilities", "success", 5);
      await writeToTerminal("▸ Creating Docker container layer (aviral/saas-app:v5.0.0)...", "stdout", 5);
      await writeToTerminal("▸ Pushing image tags to AWS ECR... 100% SUCCESS", "success", 5);
      await writeToTerminal("▸ Launching ECS blue task definitions... Auto-scaling active", "stdout", 5);
      await writeToTerminal("▸ Exposing cluster routers (Zero-Downtime Swap)...", "stdout", 5);
      await writeToTerminal("▸ Triggering live system diagnostics...", "stdout", 5);
      await writeToTerminal("✅ PRODUCTION ROUTING EXPOSED. avg latency: 118ms", "success", 5);
      await writeToTerminal("🎉 DEPLOYMENT COMPLETED SECURELY. VERSION 5.0.0 IS ACTIVE!", "success", 8);
      document.querySelector(".status-dot").classList.remove("active");
      playBeep(880, 0.15);
    },
    matrix: async () => {
      playBeep(700);
      await writeToTerminal("matrix-rain.sh", "prompt");
      let steps = 15;
      for (let i = 0; i < steps; i++) {
        let code = Array.from({length: 40}, () => String.fromCharCode(Math.floor(Math.random() * 93) + 33)).join("");
        await writeToTerminal(code, "success", 1);
      }
    },
    clear: async () => {
      playBeep(300);
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

  // Sound system active status
  document.getElementById("btn-sound").addEventListener("click", () => {
    const btn = document.getElementById("btn-sound");
    btn.classList.toggle("active");
    if (btn.classList.contains("active")) {
      btn.innerHTML = '🔊 SOUND ON';
      playBeep(440);
    } else {
      btn.innerHTML = '🔇 SOUND MUTED';
    }
  });

  // ==========================================
  // 🧠 MODULE 4: AI BRAIN TWIN (CHATBOT)
  // ==========================================
  const aiChatArea = document.querySelector(".ai-chat-area");
  const aiInput = document.getElementById("ai-input");
  const btnSend = document.getElementById("btn-send");
  
  const responses = {
    hello: "Greetings, voyager! I am Aviral's digital twin node. Ask me about my tech arsenal, active production SaaS platforms, or DevOps credentials! How shall I assist your inquiry?",
    skills: "Aviral's architecture focuses on **Full Stack Systems**: Frontend core includes React/Next.js and TypeScript (Expert). Backend gateway runs NestJS and Node.js. Database architecture is PG/MongoDB/Redis, and DevOps relies on AWS/Docker/K8s/Terraform.",
    projects: "Active operations: 1) **Production SaaS Platform** scaled with Next.js/NestJS/AWS ECS container matrices (10k+ users). 2) **AI Automation Orchestrator** powered by GPT-4 and vector pipelines resolving 50k+ daily transactions. 3) **Multi-region Cloud Infrastructure** written in Terraform IaC.",
    contact: "Establish connection via email at `aviral@email.com`, network via LinkedIn at `linkedin.com/in/aviral`, read tweets on Twitter at `@aviral`, or launch my home node at `aviral.dev`.",
    motto: "Aviral's core engineering command: *'Code • Build • Scale • Repeat'*. Delivering high-performance software structures with zero downtime.",
    deploy: "To trigger a full containerized CI/CD build, click on the `/deploy` action tab in the terminal grid to your left!"
  };

  function appendChatBubble(text, sender) {
    const bubble = document.createElement("div");
    bubble.className = `ai-bubble ${sender}`;
    bubble.innerHTML = text;
    aiChatArea.appendChild(bubble);
    aiChatArea.scrollTop = aiChatArea.scrollHeight;
    playBeep(sender === "user" ? 620 : 520, 0.04);
  }

  async function handleAIChat() {
    const text = aiInput.value.trim().toLowerCase();
    if (!text) return;
    
    appendChatBubble(aiInput.value, "user");
    aiInput.value = "";
    
    // Typing indicator
    const typing = document.createElement("div");
    typing.className = "ai-bubble assistant";
    typing.innerHTML = "... linking synaptic models ...";
    aiChatArea.appendChild(typing);
    aiChatArea.scrollTop = aiChatArea.scrollHeight;
    
    setTimeout(() => {
      typing.remove();
      let reply = "I've processed your query across Aviral's knowledge repositories. Connect to his main link at linkedin.com/in/aviral, or ask me specific prompts like 'skills', 'projects', or 'contact'!";
      
      for (let key in responses) {
        if (text.includes(key)) {
          reply = responses[key];
          break;
        }
      }
      
      appendChatBubble(reply, "assistant");
    }, 1000);
  }

  btnSend.addEventListener("click", handleAIChat);
  aiInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleAIChat();
  });

  // ==========================================
  // 📼 MODULE 5: LOFI CASSETTE PLAYER
  // ==========================================
  const cassetteWheels = document.querySelectorAll(".cassette-wheel");
  const musicEqCanvas = document.getElementById("music-eq-canvas");
  const eqCtx = musicEqCanvas.getContext("2d");
  const btnMusicPlay = document.getElementById("btn-music-play");
  const trackTitle = document.querySelector(".track-title");
  
  let isMusicPlaying = false;
  let musicAnimId = null;
  
  // Custom audio synthesizer for simulated visualizer spectrum when offline/blocked
  let synthBars = Array.from({length: 22}, () => Math.random() * 10);
  
  function drawEqualizer() {
    eqCtx.clearRect(0, 0, musicEqCanvas.width, musicEqCanvas.height);
    const barWidth = (musicEqCanvas.width / synthBars.length) - 2;
    
    for (let i = 0; i < synthBars.length; i++) {
      if (isMusicPlaying) {
        // dynamic noise
        synthBars[i] += (Math.random() * 4 - 2);
        synthBars[i] = Math.max(2, Math.min(musicEqCanvas.height - 4, synthBars[i]));
      } else {
        // smooth collapse to flatline
        synthBars[i] += (0 - synthBars[i]) * 0.15;
      }
      
      const gradient = eqCtx.createLinearGradient(0, musicEqCanvas.height, 0, 0);
      gradient.addColorStop(0, "rgba(138, 43, 226, 0.8)");
      gradient.addColorStop(1, "rgba(255, 0, 255, 0.8)");
      
      eqCtx.fillStyle = gradient;
      eqCtx.fillRect(
        i * (barWidth + 2), 
        musicEqCanvas.height - synthBars[i], 
        barWidth, 
        synthBars[i]
      );
    }
    musicAnimId = requestAnimationFrame(drawEqualizer);
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

  // ==========================================
  // ⚡ MODULE 6: ARCHITECTURE FLOW ENGINE
  // ==========================================
  function initPipelineFlow() {
    const fCanvas = document.getElementById("flow-canvas");
    if (!fCanvas) return;
    const fCtx = fCanvas.getContext("2d");
    
    fCanvas.width = fCanvas.parentElement.clientWidth;
    fCanvas.height = 100;
    
    const nodes = [
      { name: "CLIENT", x: 40, y: 50, color: "var(--neon-cyan)" },
      { name: "CDN", x: 120, y: 50, color: "var(--neon-magenta)" },
      { name: "GATEWAY", x: 210, y: 50, color: "var(--neon-purple)" },
      { name: "NEURAL API", x: 310, y: 30, color: "var(--neon-cyan)" },
      { name: "DATABASE", x: 310, y: 70, color: "var(--neon-green)" }
    ];
    
    let packets = [];
    
    function drawFlow() {
      fCtx.clearRect(0, 0, fCanvas.width, fCanvas.height);
      
      // Draw grid paths
      fCtx.strokeStyle = "rgba(255, 255, 255, 0.03)";
      fCtx.lineWidth = 1;
      for (let i = 0; i < fCanvas.width; i += 20) {
        fCtx.beginPath();
        fCtx.moveTo(i, 0);
        fCtx.lineTo(i, fCanvas.height);
        fCtx.stroke();
      }
      
      // Draw connections
      fCtx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      fCtx.lineWidth = 1.5;
      
      // Client to CDN
      fCtx.beginPath(); fCtx.moveTo(nodes[0].x, nodes[0].y); fCtx.lineTo(nodes[1].x, nodes[1].y); fCtx.stroke();
      // CDN to Gateway
      fCtx.beginPath(); fCtx.moveTo(nodes[1].x, nodes[1].y); fCtx.lineTo(nodes[2].x, nodes[2].y); fCtx.stroke();
      // Gateway to AI
      fCtx.beginPath(); fCtx.moveTo(nodes[2].x, nodes[2].y); fCtx.lineTo(nodes[3].x, nodes[3].y); fCtx.stroke();
      // Gateway to DB
      fCtx.beginPath(); fCtx.moveTo(nodes[2].x, nodes[2].y); fCtx.lineTo(nodes[4].x, nodes[4].y); fCtx.stroke();
      
      // Spawn packet triggers
      if (Math.random() > 0.94) {
        packets.push({
          sourceIndex: 0,
          targetIndex: 1,
          progress: 0,
          speed: 0.02
        });
      }
      
      // Process packets
      packets.forEach((p, idx) => {
        p.progress += p.speed;
        if (p.progress >= 1) {
          // Route to next node
          if (p.sourceIndex === 0) {
            p.sourceIndex = 1; p.targetIndex = 2; p.progress = 0;
          } else if (p.sourceIndex === 1) {
            p.sourceIndex = 2; p.targetIndex = Math.random() > 0.5 ? 3 : 4; p.progress = 0;
          } else {
            packets.splice(idx, 1);
            return;
          }
        }
        
        const start = nodes[p.sourceIndex];
        const end = nodes[p.targetIndex];
        const px = start.x + (end.x - start.x) * p.progress;
        const py = start.y + (end.y - start.y) * p.progress;
        
        fCtx.beginPath();
        fCtx.arc(px, py, 4, 0, Math.PI * 2);
        fCtx.fillStyle = end.color;
        fCtx.shadowBlur = 8;
        fCtx.shadowColor = end.color;
        fCtx.fill();
        fCtx.shadowBlur = 0;
      });
      
      // Draw nodes
      nodes.forEach(node => {
        fCtx.beginPath();
        fCtx.arc(node.x, node.y, 6, 0, Math.PI * 2);
        fCtx.fillStyle = node.color;
        fCtx.fill();
        
        fCtx.font = "8px 'Orbitron'";
        fCtx.fillStyle = "rgba(255, 255, 255, 0.6)";
        fCtx.fillText(node.name, node.x - 18, node.y - 12);
      });
      
      if (document.getElementById("flow-canvas")) {
        requestAnimationFrame(drawFlow);
      }
    }
    drawFlow();
  }

  // Set default terminal display
  writeToTerminal("SYSTEM COMMAND SEQUENCE LOADED SUCCESS.", "success");
  writeToTerminal("Initialized connection twin successfully.", "success");
  writeToTerminal("Double-click layers to inspect specific stack vectors.", "stdout");
  writeToTerminal("Try clicking the '/neofetch' button below to boot readouts.", "warn");
  
  // Launch standard view
  loadGlobalDashboard();
});
