const fs = require("fs");
const path = require("path");

const SITE = path.resolve(__dirname, "..");
const CURRICULUM = path.resolve(SITE, "..", "PRJ_Curriculum", "KO_Korean");

const COURSES = {
  beginner: {
    id: "beginner",
    stage: "Stage 1",
    stageNum: "01",
    accent: "sky",
    badgeClass: "text-sky-400 bg-sky-950/80 border border-sky-800/80",
    activePill: "bg-sky-500 border-sky-500 text-slate-950",
    title: "왕초보 실전 교실",
    tag: "20강 기초 과정",
    desc: "시장의 언어부터 재무제표, 차트, 리스크 관리까지. 왕초보가 실전에 들어가기 전에 반드시 고정해야 할 기준을 순서대로 읽습니다.",
    tocFile: "beginner.html",
    dir: "academy/beginner",
    sourceDir: path.join(CURRICULUM, "01_Beginner_왕초보", "01_Drafts"),
    pattern: /^왕초보(\d+)_/,
    nextCourse: { href: "intermediate.html", label: "다음 단계: 중급자 과정" },
  },
  intermediate: {
    id: "intermediate",
    stage: "Stage 2",
    stageNum: "02",
    accent: "slate",
    badgeClass: "text-slate-300 bg-slate-800 border border-slate-700",
    activePill: "bg-slate-200 border-slate-200 text-slate-950",
    title: "중급자 시스템 원칙 과정",
    tag: "40강 시스템 과정",
    desc: "차트 심화부터 시장 구조, 전략 스위칭, 리스크 엔진, 규율까지. 감이 아니라 If-Then 규칙으로 매매 기준을 고정합니다.",
    tocFile: "intermediate.html",
    dir: "academy/intermediate",
    sourceDir: path.join(CURRICULUM, "02_Intermediate_중급", "01_Drafts"),
    pattern: /^중급(\d+)-(\d+)_/,
    nextCourse: { href: "advanced.html", label: "다음 단계: 고급 실전 마스터 과정" },
  },
  advanced: {
    id: "advanced",
    stage: "Stage 3",
    stageNum: "03",
    accent: "violet",
    badgeClass: "text-violet-400 bg-violet-950/80 border border-violet-800/80",
    activePill: "bg-violet-500 border-violet-500 text-slate-950",
    title: "고급 실전 마스터 과정",
    tag: "35강 마스터 과정",
    desc: "미시구조와 옵션 흐름, 고급 분석, 전략 엔진, 리스크 모델링까지. 수급 위에서 룰 기반 시스템을 운영하는 단계입니다.",
    tocFile: "advanced.html",
    dir: "academy/advanced",
    sourceDir: path.join(CURRICULUM, "03_Advanced_고급", "01_Drafts"),
    extraPattern: /^고급번외(\d+)_/,
    pattern: /^고급(\d+)-(\d+)_/,
    nextCourse: { href: "psychology.html", label: "다음 단계: 심리지혜 교재" },
  },
  psychology: {
    id: "psychology",
    stage: "Stage 4",
    stageNum: "04",
    accent: "amber",
    badgeClass: "text-amber-400 bg-amber-950/80 border border-amber-800/80",
    activePill: "bg-amber-400 border-amber-400 text-slate-950",
    title: "심리지혜 교재",
    tag: "20강 심리 과정",
    desc: "세 번의 승리가 만든 착각부터 손절 회피, FOMO, 규율까지. 숫자가 아니라 마음이 계좌를 무너뜨리는 장면을 따라 읽습니다.",
    tocFile: "psychology.html",
    dir: "academy/psychology",
    sourceDir: path.join(CURRICULUM, "04_Psychology_심리지혜", "01_Drafts", "심리지혜교재"),
    pattern: /^심리지혜(\d+)_/,
    nextCourse: null,
  },
};

const GROUPS = {
  beginner: [
    { title: "시장을 이해하다", hint: "Lesson 01–05", test: (l) => l.num <= 5 },
    { title: "숫자를 읽다", hint: "Lesson 06–10", test: (l) => l.num >= 6 && l.num <= 10 },
    { title: "차트를 읽다", hint: "Lesson 11–15", test: (l) => l.num >= 11 && l.num <= 15 },
    { title: "실전에 들어가다", hint: "Lesson 16–20", test: (l) => l.num >= 16 },
  ],
  intermediate: [
    { title: "차트 심화", hint: "Module 1", test: (l) => l.module === 1 },
    { title: "시장 구조와 유동성", hint: "Module 2", test: (l) => l.module === 2 },
    { title: "실전 매매 전략", hint: "Module 3", test: (l) => l.module === 3 },
    { title: "리스크·자금 관리", hint: "Module 4", test: (l) => l.module === 4 },
    { title: "심리와 규율", hint: "Module 5", test: (l) => l.module === 5 },
    { title: "시스템 트레이딩", hint: "Module 6", test: (l) => l.module === 6 },
  ],
  advanced: [
    { title: "미시구조와 옵션 흐름", hint: "Module 1", test: (l) => l.module === 1 },
    { title: "고급 시장 분석", hint: "Module 2", test: (l) => l.module === 2 },
    { title: "전략 엔진과 최적화", hint: "Module 3", test: (l) => l.module === 3 },
    { title: "리스크 모델링", hint: "Module 4", test: (l) => l.module === 4 },
    { title: "확률과 심리", hint: "Module 5", test: (l) => l.module === 5 },
    { title: "시스템 운영", hint: "Module 6", test: (l) => l.module === 6 },
    { title: "번외", hint: "Extra", test: (l) => l.module === 99 },
  ],
  psychology: [
    { title: "착각이 시작되는 순간", hint: "Chapter 01–05", test: (l) => l.num <= 5 },
    { title: "손실을 놓지 못하는 마음", hint: "Chapter 06–10", test: (l) => l.num >= 6 && l.num <= 10 },
    { title: "비교와 조바심", hint: "Chapter 11–15", test: (l) => l.num >= 11 && l.num <= 15 },
    { title: "규율로 돌아오다", hint: "Chapter 16–20", test: (l) => l.num >= 16 },
  ],
};

const PUBLIC_PREVIEW_COUNT = 5;
const MEMBER_GATE_MESSAGE =
  "DawnQT Intelligence Hub 멤버십 전용 강의입니다. 이메일 구독 시 순차적으로 열람 권한이 제공됩니다.";
const MEMBER_ACCESS_LABEL = "[ 🔒 Member Access ]";

const FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" role="img" aria-label="DawnQT">
  <rect width="32" height="32" rx="8" fill="#0f172a"/>
  <rect x="0.75" y="0.75" width="30.5" height="30.5" rx="7.25" fill="none" stroke="#164e63" stroke-width="1.5"/>
  <path fill="#38bdf8" fill-rule="evenodd" d="M8.6 6.8h8.55c5.05 0 8.65 3.45 8.65 9.2s-3.6 9.2-8.65 9.2H8.6V6.8zm3.2 3.15v12.1h5.35c3.2 0 5.25-2.2 5.25-6.05s-2.05-6.05-5.25-6.05H11.8z"/>
  <polyline fill="none" stroke="#7dd3fc" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" points="12.2 21.2 15.4 17.15 17.55 18.55 22.35 12.35"/>
  <circle cx="22.35" cy="12.35" r="1.45" fill="#22d3ee"/>
</svg>`;

function faviconDataUri() {
  return "data:image/svg+xml," + encodeURIComponent(FAVICON_SVG.replace(/\s+/g, " ").trim());
}

function faviconLinks() {
  const href = faviconDataUri();
  return `  <link rel="icon" type="image/svg+xml" href="${href}">
  <link rel="shortcut icon" href="${href}">`;
}

function writeFaviconAssets() {
  fs.writeFileSync(path.join(SITE, "favicon.svg"), FAVICON_SVG.trim() + "\n", "utf8");
  writeFaviconIco();
}

function writeFaviconIco() {
  const size = 16;
  const xor = Buffer.alloc(size * size * 4);
  function setPx(x, y, r, g, b, a) {
    if (x < 0 || y < 0 || x >= size || y >= size) return;
    const i = ((size - 1 - y) * size + x) * 4;
    xor[i] = b;
    xor[i + 1] = g;
    xor[i + 2] = r;
    xor[i + 3] = a;
  }
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = Math.min(x, size - 1 - x);
      const dy = Math.min(y, size - 1 - y);
      if (dx + dy < 2) {
        setPx(x, y, 0, 0, 0, 0);
        continue;
      }
      setPx(x, y, 15, 23, 42, 255);
    }
  }
  const cyan = [56, 189, 248];
  const sky = [125, 211, 252];
  for (let y = 3; y <= 12; y++) {
    setPx(4, y, cyan[0], cyan[1], cyan[2], 255);
    setPx(5, y, cyan[0], cyan[1], cyan[2], 255);
  }
  for (let x = 5; x <= 9; x++) {
    setPx(x, 3, cyan[0], cyan[1], cyan[2], 255);
    setPx(x, 12, cyan[0], cyan[1], cyan[2], 255);
  }
  for (let y = 4; y <= 11; y++) setPx(10, y, cyan[0], cyan[1], cyan[2], 255);
  for (let y = 5; y <= 10; y++) setPx(11, y, cyan[0], cyan[1], cyan[2], 255);
  [[6, 11], [7, 9], [8, 10], [9, 8], [10, 7]].forEach(([x, y]) => setPx(x, y, sky[0], sky[1], sky[2], 255));
  setPx(11, 6, 34, 211, 238, 255);

  const andRow = Math.ceil(size / 32) * 4;
  const andMask = Buffer.alloc(andRow * size);
  const dib = Buffer.alloc(40);
  dib.writeUInt32LE(40, 0);
  dib.writeInt32LE(size, 4);
  dib.writeInt32LE(size * 2, 8);
  dib.writeUInt16LE(1, 12);
  dib.writeUInt16LE(32, 14);
  const image = Buffer.concat([dib, xor, andMask]);
  const dir = Buffer.alloc(6 + 16);
  dir.writeUInt16LE(0, 0);
  dir.writeUInt16LE(1, 2);
  dir.writeUInt16LE(1, 4);
  dir[6] = size;
  dir[7] = size;
  dir.writeUInt16LE(1, 10);
  dir.writeUInt16LE(32, 12);
  dir.writeUInt32LE(image.length, 14);
  dir.writeUInt32LE(22, 18);
  fs.writeFileSync(path.join(SITE, "favicon.ico"), Buffer.concat([dir, image]));
}

function isLessonPublic(course, seqIndex) {
  // Stage 1 (beginner): lessons 1–20 all public.
  // Stages 2–4: Module 1 (lessons 1–5) public; lesson 6 onward locked.
  if (course.id === "beginner") return true;
  return seqIndex < PUBLIC_PREVIEW_COUNT;
}

function applyLessonAccess(course, lessons) {
  lessons.forEach((lesson, idx) => {
    lesson.public = isLessonPublic(course, idx);
    lesson.displayTitle = lesson.public ? lesson.title : maskTitle(lesson.title, course, lesson);
    if (!lesson.public) {
      lesson.summary = "";
      lesson.teaser = "";
      lesson.html = "";
      lesson.headings = [];
    }
  });
}

function maskTitle(title, course, lesson) {
  if (course.id === "psychology") {
    if (lesson.num <= 10) return `챕터 ${lesson.num}. 손실을 다루는 마음`;
    if (lesson.num <= 15) return `챕터 ${lesson.num}. 비교와 조바심`;
    return `챕터 ${lesson.num}. 규율과 원칙`;
  }

  const m = title.match(/^((?:중급|고급)\s+(?:번외(?:\s+\d+)?|[\d-]+)\.\s+)(.*)$/);
  const prefix = m ? m[1] : "";
  let core = m ? m[2] : title;
  core = core.split(/\s+[—–]\s+/)[0].trim();

  const generic = [
    [/피보나치\(Fibonacci\)/, "되돌림 비율 심화"],
    [/채널·패턴 심화/, "차트 패턴 심화"],
    [/미국 시장 구조 심화/, "시장 구조 심화"],
    [/알고리즘·HFT 행동 패턴/, "알고리즘 행동 패턴"],
    [/거래량 심화/, "거래량 심화"],
    [/변동성 심화/, "변동성 심화"],
    [/유동성\(Liquidity\) 분석/, "유동성 분석"],
    [/시장 참여자 구조/, "시장 참여자 구조"],
    [/상대강도\(Relative Strength\) 기반 종목 선정/, "상대강도 기반 종목 선정"],
    [/뉴스·실적 Catalyst 스크리닝/, "뉴스·실적 스크리닝"],
    [/Market Regime 식별/, "장세 식별"],
    [/장세별 전략 스위칭/, "장세별 전략 스위칭"],
    [/데이 트레이딩 심화/, "데이 트레이딩 심화"],
    [/스윙 트레이딩 심화/, "스윙 트레이딩 심화"],
    [/브레이크아웃 전략/, "돌파 전략"],
    [/리버설 전략/, "반전 전략"],
    [/트레이딩 툴 실전/, "트레이딩 툴 실전"],
    [/스크리너 세팅/, "스크리너 세팅"],
    [/변동성 기반 손절/, "변동성 기반 손절"],
    [/트레일링 스탑/, "트레일링 스탑"],
    [/포지션 사이징 심화/, "포지션 사이징 심화"],
    [/자금 관리/, "자금 관리"],
    [/Daily Max Loss \/ Daily Max Drawdown 설정/, "일일 손실 한도 설정"],
    [/계좌 보호 시스템/, "계좌 보호 시스템"],
    [/감정 통제 실전 대응/, "감정 통제 실전"],
    [/Daily Max Loss 준수 훈련/, "손실 한도 준수 훈련"],
    [/손실 후 복구 전략/, "손실 후 복구 전략"],
    [/매매 규율/, "매매 규율"],
    [/SNS·뉴스·레딧·트위터 감정 매매 차단/, "외부 자극 차단"],
    [/실수 방지 시스템/, "실수 방지 시스템"],
    [/나만의 매매 전략 설계/, "매매 전략 설계"],
    [/전략 백테스트 기초/, "전략 백테스트 기초"],
    [/전략 필터링/, "전략 필터링"],
    [/실전 적용/, "실전 적용"],
    [/시스템 트레이딩 사고방식/, "시스템 트레이딩 사고방식"],
    [/Max Pain·OI\(Open Interest\) 분석/, "만기 수급 분석"],
    [/옵션 흐름 기반 방향성 해석/, "옵션 흐름 해석"],
    [/Wyckoff Method/, "수급 사이클 분석"],
    [/Elliott Wave/, "파동 구조 분석"],
    [/Market Cycle/, "시장 사이클"],
    [/Volume Spread Analysis\(VSA\)/, "거래량·스프레드 분석"],
    [/고급 추세 분석/, "고급 추세 분석"],
    [/고급 지표 조합/, "고급 지표 조합"],
    [/Market Regime Classification/, "장세 분류"],
    [/전략 스위칭 엔진/, "전략 스위칭 엔진"],
    [/파라미터 최적화/, "파라미터 최적화"],
    [/과최적화 방지/, "과최적화 방지"],
    [/전략 포트폴리오 구축/, "전략 포트폴리오 구축"],
    [/VAR·CVaR·Max Drawdown 모델링/, "리스크 지표 모델링"],
    [/Kelly·Optimal f 기반 포지션 스케일링/, "포지션 스케일링"],
    [/피라미딩·스케일링 인\/아웃/, "분할 진입·청산"],
    [/변동성 기반 포지션 관리/, "변동성 기반 포지션 관리"],
    [/계좌 성장 모델/, "계좌 성장 모델"],
    [/Prospect Theory/, "의사결정 편향"],
    [/Loss Aversion/, "손실 회피"],
    [/Expected Value\(기댓값\) 기반 매매/, "기댓값 기반 매매"],
    [/Probabilistic Thinking/, "확률론적 사고"],
    [/승률보다 Expectancy 중심 사고/, "기댓값 중심 사고"],
    [/심리적 편향 제거 시스템/, "편향 제거 시스템"],
    [/규칙·조건·시나리오 기반 시스템 설계/, "규칙 기반 시스템 설계"],
    [/백테스트 심화/, "백테스트 심화"],
    [/자동화 사고방식/, "자동화 사고방식"],
    [/시스템 운영/, "시스템 운영"],
    [/프로 트레이더의 시스템 운영 루틴/, "시스템 운영 루틴"],
    [/전문 트레이더의 시간대별 실전 체크리스트/, "실전 체크리스트"],
  ];

  for (const [re, to] of generic) {
    if (re.test(core)) {
      core = core.replace(re, to);
      break;
    }
  }

  core = core.replace(/\b[A-Za-z][A-Za-z0-9/+.-]{1,}\b/g, "███");
  core = core.replace(/\s{2,}/g, " ").replace(/[·,;:]\s*$/g, "").trim();
  return (prefix + core).replace(/\s{2,}/g, " ").trim();
}

function memberAccessLabel() {
  return `<span class="member-access">${MEMBER_ACCESS_LABEL}</span>`;
}

function groupTitleHtml(g) {
  const lockedCount = g.items.filter((l) => !l.public).length;
  const lock =
    lockedCount === g.items.length
      ? ` <span class="lock-icon" aria-hidden="true">🔒</span>`
      : lockedCount
        ? ` <span class="text-[10px] font-medium text-amber-400/80">🔒 ${lockedCount}강 잠김</span>`
        : "";
  return `${escapeHtml(g.title)}${lock}`;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function slugify(s) {
  return String(s)
    .trim()
    .replace(/[^\w가-힣0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase()
    .slice(0, 80);
}

function inline(text) {
  const codes = [];
  let s = String(text).replace(/`([^`]+)`/g, (_, c) => {
    codes.push(`<code>${escapeHtml(c)}</code>`);
    return `\u0000C${codes.length - 1}\u0000`;
  });
  s = escapeHtml(s);
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
  s = s.replace(/\u0000C(\d+)\u0000/g, (_, i) => codes[Number(i)]);
  return s;
}

function isHr(line) {
  return /^(-{3,}|\*{3,}|_{3,})$/.test(line.trim());
}

function isHeading(line) {
  return /^(#{1,4})\s+/.test(line);
}

function isListLine(line) {
  return /^(\s*)(?:[-*+] |\d+\.\s+)/.test(line);
}

function isTableSep(line) {
  return /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line);
}

function isTableStart(lines, i) {
  return lines[i].includes("|") && Boolean(lines[i + 1]) && isTableSep(lines[i + 1]);
}

function splitCells(line) {
  let s = line.trim();
  if (s.startsWith("|")) s = s.slice(1);
  if (s.endsWith("|")) s = s.slice(0, -1);
  return s.split("|").map((c) => c.trim());
}

function parseListItem(line) {
  const m = line.match(/^(\s*)(?:[-*+] |(\d+)\.\s+)(?:\[([ xX])\]\s+)?(.*)$/);
  if (!m) return null;
  return {
    indent: m[1].replace(/\t/g, "    ").length,
    ordered: Boolean(m[2]),
    task: m[3] !== undefined,
    checked: m[3] === "x" || m[3] === "X",
    text: m[4],
  };
}

function renderList(items) {
  if (!items.length) return "";
  const ordered = items[0].ordered;
  const tag = ordered ? "ol" : "ul";
  const parts = [`<${tag}>`];
  for (const item of items) {
    const cls = item.task ? ' class="task"' : "";
    const box = item.task
      ? `<input type="checkbox" disabled${item.checked ? " checked" : ""}>`
      : "";
    const nested = item.children && item.children.length ? renderList(item.children) : "";
    parts.push(`<li${cls}>${box}${inline(item.text)}${nested}</li>`);
  }
  parts.push(`</${tag}>`);
  return parts.join("");
}

function nestList(flat) {
  const root = [];
  const stack = [{ indent: -1, children: root }];
  for (const item of flat) {
    item.children = [];
    while (stack.length && item.indent <= stack[stack.length - 1].indent) stack.pop();
    stack[stack.length - 1].children.push(item);
    stack.push(item);
  }
  return root;
}

function collectList(lines, start) {
  const flat = [];
  let i = start;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      if (lines[i + 1] && isListLine(lines[i + 1])) {
        i += 1;
        continue;
      }
      break;
    }
    if (isHeading(line) || isHr(line) || isTableStart(lines, i) || line.startsWith(">")) break;
    if (isListLine(line)) {
      const item = parseListItem(line);
      if (item) flat.push(item);
      i += 1;
      continue;
    }
    if (flat.length && /^\s{2,}\S/.test(line)) {
      flat[flat.length - 1].text += " " + line.trim();
      i += 1;
      continue;
    }
    break;
  }
  return { html: renderList(nestList(flat)), next: i };
}

function collectTable(lines, start) {
  const header = splitCells(lines[start]);
  let i = start + 2;
  const rows = [];
  while (i < lines.length && lines[i].includes("|") && !isHr(lines[i]) && !isHeading(lines[i])) {
    rows.push(splitCells(lines[i]));
    i += 1;
  }
  const thead = `<thead><tr>${header.map((c) => `<th>${inline(c)}</th>`).join("")}</tr></thead>`;
  const tbody = `<tbody>${rows
    .map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`)
    .join("")}</tbody>`;
  return { html: `<div class="table-wrap"><table>${thead}${tbody}</table></div>`, next: i };
}

function collectQuote(lines, start) {
  const buf = [];
  let i = start;
  while (i < lines.length && (lines[i].startsWith(">") || (buf.length && lines[i].trim() && !isHeading(lines[i]) && !isHr(lines[i]) && !isListLine(lines[i])))) {
    buf.push(lines[i].replace(/^>\s?/, ""));
    i += 1;
  }
  const html = `<blockquote>${buf
    .filter((l) => l.trim())
    .map((l) => `<p>${inline(l)}</p>`)
    .join("")}</blockquote>`;
  return { html, next: i };
}

function mdToHtml(md) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i += 1;
      continue;
    }
    if (isHr(line)) {
      out.push("<hr>");
      i += 1;
      continue;
    }
    const hm = line.match(/^(#{1,4})\s+(.*)$/);
    if (hm) {
      const level = hm[1].length;
      const title = hm[2].trim();
      const id = slugify(title);
      out.push(`<h${level} id="${id}">${inline(title)}</h${level}>`);
      i += 1;
      continue;
    }
    if (line.startsWith(">")) {
      const q = collectQuote(lines, i);
      out.push(q.html);
      i = q.next;
      continue;
    }
    if (isTableStart(lines, i)) {
      const t = collectTable(lines, i);
      out.push(t.html);
      i = t.next;
      continue;
    }
    if (isListLine(line)) {
      const l = collectList(lines, i);
      out.push(l.html);
      i = l.next;
      continue;
    }
    const para = [line];
    i += 1;
    while (i < lines.length) {
      const n = lines[i];
      if (!n.trim()) break;
      if (isHr(n) || isHeading(n) || n.startsWith(">") || isListLine(n) || isTableStart(lines, i)) break;
      para.push(n);
      i += 1;
    }
    out.push(`<p>${inline(para.join(" "))}</p>`);
  }
  return out.join("\n");
}

function extractTitle(md) {
  const m = md.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : "Untitled";
}

function extractSummary(md) {
  const m = md.match(/\*\*한눈에 답:\*\*\s*([\s\S]+?)(?:\n\s*\n|\n---)/);
  return m ? m[1].replace(/\s+/g, " ").trim() : "";
}

function extractTeaser(md, summary) {
  if (summary) return summary;
  const lines = md.split(/\n/).map((l) => l.trim()).filter(Boolean);
  for (const line of lines) {
    if (line.startsWith("#") || line.startsWith("---") || line.startsWith(">")) continue;
    if (line.startsWith("## ")) continue;
    return line.replace(/\*\*/g, "").slice(0, 180);
  }
  return "";
}

function stripTitleAndSummary(md) {
  let body = md.replace(/^#\s+.+\n+/, "");
  body = body.replace(/\*\*한눈에 답:\*\*\s*[\s\S]+?(?:\n---\s*\n|\n\s*\n)/, "\n");
  body = body.replace(/^\s*---\s*\n+/, "");
  return body.trim();
}

function extractHeadings(html) {
  const found = [];
  const re = /<h2 id="([^"]+)">([\s\S]*?)<\/h2>/g;
  let m;
  while ((m = re.exec(html))) {
    found.push({ id: m[1], title: m[2].replace(/<[^>]+>/g, "") });
  }
  return found;
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function listMarkdown(dir) {
  if (!fs.existsSync(dir)) {
    throw new Error(`Source folder not found: ${dir}`);
  }
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md") && !/\(\d+\)\.md$/.test(f))
    .map((f) => path.join(dir, f));
}

function parseLessonFile(course, filePath) {
  const base = path.basename(filePath);
  const md = fs.readFileSync(filePath, "utf8");
  const title = extractTitle(md);
  const summary = extractSummary(md);
  const teaser = extractTeaser(md, summary);
  const bodyMd = stripTitleAndSummary(md);
  const html = mdToHtml(bodyMd);
  const headings = extractHeadings(html);

  let module = 1;
  let num = 1;
  let slug = "01";
  let label = "01";

  if (course.id === "beginner") {
    const m = base.match(course.pattern);
    num = m ? Number(m[1]) : 0;
    slug = pad2(num);
    label = pad2(num);
  } else if (course.id === "psychology") {
    const m = base.match(course.pattern);
    num = m ? Number(m[1]) : 0;
    slug = pad2(num);
    label = pad2(num);
  } else if (course.id === "advanced" && course.extraPattern && course.extraPattern.test(base)) {
    const m = base.match(course.extraPattern);
    module = 99;
    num = m ? Number(m[1]) : 1;
    slug = `extra-${num}`;
    label = `번외 ${num}`;
  } else {
    const m = base.match(course.pattern);
    module = m ? Number(m[1]) : 0;
    num = m ? Number(m[2]) : 0;
    slug = `${module}-${num}`;
    label = `${module}-${num}`;
  }

  const lesson = {
    courseId: course.id,
    filePath,
    title,
    summary,
    teaser,
    html,
    headings,
    module,
    num,
    slug,
    label,
    filename: `${slug}.html`,
    href: `${course.dir}/${slug}.html`,
    sort: [module, num],
  };
  return lesson;
}

function siteNav(prefix) {
  return `
      <nav class="hidden md:flex space-x-8 text-sm font-medium text-slate-300">
        <a href="${prefix}index.html#daily" class="hover:text-sky-400 transition">Daily Brew</a>
        <a href="${prefix}academy.html" class="hover:text-sky-400 transition flex items-center space-x-1">
          <span class="text-xs text-sky-400">★</span> <span>트레이딩 교실</span>
        </a>
        <a href="${prefix}themes.html" class="hover:text-sky-400 transition">Themes & Alpha</a>
        <a href="${prefix}data-arc.html" class="hover:text-sky-400 transition">Data Arc</a>
        <a href="${prefix}trader-note.html" class="hover:text-sky-400 transition">Trader's Note</a>
      </nav>`;
}

function langSwitcherHtml() {
  return `<div class="lang-switcher notranslate" id="lang-switcher" translate="no">
          <select class="lang-switcher-select notranslate" aria-label="Language" translate="no">
            <option value="en">English</option>
            <option value="ko">한국어</option>
            <option value="zh-CN">简体中文</option>
            <option value="ja">日本語</option>
            <option value="hi">हिन्दी</option>
            <option value="pt">Português (Brasil)</option>
          </select>
        </div>`;
}

function siteHeader(prefix) {
  return `
  <header class="border-b border-slate-800 bg-[#0b0f17]/95 sticky top-0 z-[9999] backdrop-blur-md">
    <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <a href="${prefix}index.html" class="text-2xl font-bold tracking-tight font-serif-title text-white">Dawn<span class="text-sky-400">QT</span> Academy</a>
      ${siteNav(prefix)}
      <div class="lang-switcher-cluster">
        ${langSwitcherHtml()}
        <button type="button" class="js-subscribe subscribe-btn bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold px-4 py-2 rounded-lg transition" data-member-open>Subscribe</button>
      </div>
    </div>
  </header>`;
}

function memberGateModal() {
  return `
  <div id="member-gate-modal" class="member-modal" hidden>
    <div class="member-modal-backdrop" data-member-close></div>
    <div class="member-modal-card member-modal-card--beehiiv" role="dialog" aria-modal="true" aria-labelledby="member-gate-title" tabindex="-1">
      <button type="button" class="member-modal-x" data-member-close aria-label="닫기">×</button>
      <p class="member-modal-kicker">Member Access</p>
      <h2 id="member-gate-title">멤버십 전용 강의</h2>
      <p class="member-modal-copy">${escapeHtml(MEMBER_GATE_MESSAGE)}</p>
      <div class="beehiiv-embed-wrap beehiiv-embed-wrap--modal" data-beehiiv-mount></div>
    </div>
  </div>`;
}

function siteFooter(prefix = "") {
  return `
  <footer class="border-t border-slate-800 py-8 mt-12 bg-[#0b0f17]">
    <div class="max-w-7xl mx-auto px-6 text-center text-xs text-slate-500 space-y-4">
      <nav class="flex flex-wrap items-center justify-center gap-x-5 gap-y-2" aria-label="Legal">
        <a href="${prefix}about.html" class="hover:text-sky-400 transition">About</a>
        <span class="text-slate-700 select-none" aria-hidden="true">·</span>
        <a href="${prefix}contact.html" class="hover:text-sky-400 transition">Contact</a>
        <span class="text-slate-700 select-none" aria-hidden="true">·</span>
        <a href="${prefix}privacy.html" class="hover:text-sky-400 transition">Privacy Policy</a>
        <span class="text-slate-700 select-none" aria-hidden="true">·</span>
        <a href="${prefix}terms.html" class="hover:text-sky-400 transition">Terms of Use</a>
      </nav>
      <p>© 2026 DawnQT Research. All rights reserved.</p>
    </div>
  </footer>
  ${memberGateModal()}
  <script src="${prefix}js/lang-selector.js" defer></script>
  <script src="${prefix}js/membership.js" defer></script>
  <script type="text/javascript" async src="https://subscribe-forms.beehiiv.com/attribution.js"></script>`;
}

const SITE_ORIGIN = "https://dawnqt-research.vercel.app";
const BRAND_NAME = "DawnQT Intelligence Hub";

function brandHeadTags(fullTitle, description, pagePath) {
  const url = pagePath
    ? `${SITE_ORIGIN}/${String(pagePath).replace(/^\/+/, "")}`
    : `${SITE_ORIGIN}/`;
  return `${faviconLinks()}
  <meta name="theme-color" content="#0f172a">
  <meta name="description" content="${escapeHtml(description)}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${BRAND_NAME}">
  <meta property="og:title" content="${escapeHtml(fullTitle)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${escapeHtml(url)}">
  <meta property="og:image" content="${SITE_ORIGIN}/og-image.svg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(fullTitle)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">`;
}

function head(title, cssHref, extra = "", pagePath = "") {
  const protectCss = String(cssHref).replace(/academy\.css$/, "content-protect.css");
  const memberCss = String(cssHref).replace(/academy\.css$/, "membership.css");
  const beehiivCss = String(cssHref).replace(/academy\.css$/, "beehiiv.css");
  const protectJs = String(cssHref).replace(/css\/academy\.css$/, "js/content-protect.js");
  const fullTitle = `${title} | ${BRAND_NAME}`;
  const description = `${title} — DawnQT Intelligence Hub. Global market intelligence and rule-based trading academy.`;
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(fullTitle)}</title>
${brandHeadTags(fullTitle, description, pagePath)}
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${cssHref}">
  <link rel="stylesheet" href="${protectCss}">
  <link rel="stylesheet" href="${memberCss}">
  <link rel="stylesheet" href="${beehiivCss}">
  <script src="${protectJs}"></script>
  ${extra}
</head>`;
}

function coursePills(prefix, activeId) {
  return Object.values(COURSES)
    .map((c) => {
      const active = c.id === activeId;
      const cls = active ? `course-pill is-active ${c.activePill}` : "course-pill";
      return `<a href="${prefix}${c.tocFile}" class="${cls} text-[11px] font-semibold px-3 py-1.5 rounded-full transition border">${escapeHtml(c.title.replace(" 실전 교실", "").replace(" 시스템 원칙 과정", "").replace(" 실전 마스터 과정", "").replace(" 교재", ""))}</a>`;
    })
    .join("\n        ");
}

function groupedLessons(courseId, lessons) {
  return GROUPS[courseId]
    .map((g) => ({ ...g, items: lessons.filter(g.test) }))
    .filter((g) => g.items.length);
}

function lessonCards(lessons, hrefPrefix = "") {
  return lessons
    .map((l) => {
      if (l.public) {
        return `
        <a href="${hrefPrefix}${l.href}" class="lesson-link rounded-xl p-4 space-y-2 block transition">
          <div class="flex items-center justify-between gap-3">
            <span class="text-[11px] font-semibold text-slate-500">${escapeHtml(l.label)}</span>
            <span class="text-[11px] text-slate-500">읽기 &rarr;</span>
          </div>
          <h3 class="text-sm font-semibold text-white leading-snug">${escapeHtml(l.displayTitle)}</h3>
          ${l.teaser ? `<p class="text-xs text-slate-400 leading-relaxed line-clamp-2">${escapeHtml(l.teaser)}</p>` : ""}
        </a>`;
      }
      return `
        <button type="button" class="lesson-link lesson-locked rounded-xl p-4 space-y-2 block w-full text-left transition" data-member-gate>
          <div class="flex items-center justify-between gap-3">
            <span class="text-[11px] font-semibold text-slate-500">${escapeHtml(l.label)}</span>
            ${memberAccessLabel()}
          </div>
          <h3 class="text-sm font-semibold text-slate-300 leading-snug"><span class="lock-icon" aria-hidden="true">🔒</span>${escapeHtml(l.displayTitle)}</h3>
          <p class="text-xs text-slate-500 leading-relaxed">${escapeHtml(MEMBER_GATE_MESSAGE)}</p>
        </button>`;
    })
    .join("\n");
}

function sidebarNav(course, lessons, currentSlug, prefix) {
  const groups = groupedLessons(course.id, lessons);
  return groups
    .map((g) => {
      const links = g.items
        .map((l) => {
          const current = l.slug === currentSlug ? " is-current" : "";
          const title = `${escapeHtml(l.label)}. ${escapeHtml(l.displayTitle)}`;
          if (l.public) {
            return `<a class="sidebar-link${current} block text-[12px] px-2.5 py-1.5 rounded-lg border border-transparent truncate" href="${prefix}${l.filename}">${title}</a>`;
          }
          return `<button type="button" class="sidebar-link lesson-locked${current} block w-full text-left text-[12px] px-2.5 py-1.5 rounded-lg border border-transparent" data-member-gate><span class="lock-icon" aria-hidden="true">🔒</span><span class="truncate">${title}</span> ${memberAccessLabel()}</button>`;
        })
        .join("\n            ");
      return `
          <div class="space-y-1.5">
            <p class="text-[10px] font-semibold uppercase tracking-wider text-slate-500 px-2.5 pt-2">${groupTitleHtml(g)}</p>
            ${links}
          </div>`;
    })
    .join("\n");
}

function lessonNavCard(lesson, { href, label, align = "left" }) {
  const alignCls = align === "right" ? " md:text-right" : "";
  if (lesson.public) {
    return `<a href="${href}" class="lesson-link rounded-xl p-4 space-y-1 transition${alignCls}">
            <p class="text-[11px] text-slate-500">${label}</p>
            <p class="text-sm text-white font-medium">${escapeHtml(lesson.displayTitle)}</p>
          </a>`;
  }
  return `<button type="button" class="lesson-link lesson-locked rounded-xl p-4 space-y-1 transition w-full${alignCls}" data-member-gate>
            <p class="text-[11px] text-amber-400/80">${label}</p>
            <p class="text-sm text-slate-300 font-medium"><span class="lock-icon" aria-hidden="true">🔒</span>${escapeHtml(lesson.displayTitle)}</p>
            <p class="text-[11px] text-amber-400">${MEMBER_ACCESS_LABEL}</p>
          </button>`;
}

function writeLessonPage(course, lessons, lesson, idx) {
  const prefix = "../../";
  const prev = lessons[idx - 1];
  const next = lessons[idx + 1];
  const pageTitle = lesson.displayTitle;
  const extraHead = lesson.public ? "" : '<meta name="robots" content="noindex, nofollow">';
  const bodyAttr = lesson.public ? "" : " data-member-auto-open";
  const summaryBox =
    lesson.public && lesson.summary
      ? `<div class="inner-box-bg rounded-xl p-5 border-l-2 border-${course.accent}-500 space-y-2">
          <p class="text-[11px] font-semibold uppercase tracking-wider text-${course.accent}-400">한눈에 답</p>
          <p class="text-sm text-slate-300 leading-relaxed">${escapeHtml(lesson.summary)}</p>
        </div>`
      : "";
  const miniToc =
    lesson.public && lesson.headings.length >= 3
      ? `<nav class="toc-mini inner-box-bg rounded-xl p-4 space-y-2">
          <p class="text-[11px] font-semibold uppercase tracking-wider text-slate-500">이 강의에서</p>
          <ol class="space-y-1.5 text-xs">
            ${lesson.headings.map((h) => `<li><a href="#${h.id}">${escapeHtml(h.title)}</a></li>`).join("\n            ")}
          </ol>
        </nav>`
      : "";
  const bodyHtml = lesson.public
    ? `<div class="lesson-body">
          ${lesson.html}
        </div>`
    : `<div class="inner-box-bg rounded-2xl p-8 space-y-4 text-center">
          <p class="text-2xl" aria-hidden="true">🔒</p>
          <p class="text-sm text-slate-300 leading-relaxed">${escapeHtml(MEMBER_GATE_MESSAGE)}</p>
          <button type="button" class="member-access inline-flex items-center justify-center rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-2" data-member-gate>${MEMBER_ACCESS_LABEL}</button>
        </div>`;
  const prevCard = prev
    ? lessonNavCard(prev, { href: prev.filename, label: "&larr; 이전 강의" })
    : `<a href="${prefix}${course.tocFile}" class="lesson-link rounded-xl p-4 space-y-1 transition">
            <p class="text-[11px] text-slate-500">&larr; 목차</p>
            <p class="text-sm text-white font-medium">${escapeHtml(course.title)}</p>
          </a>`;
  const nextCard = next
    ? lessonNavCard(next, { href: next.filename, label: "다음 강의 &rarr;", align: "right" })
    : course.nextCourse
      ? `<a href="${prefix}${course.nextCourse.href}" class="lesson-link rounded-xl p-4 space-y-1 transition md:text-right">
            <p class="text-[11px] text-slate-500">다음 과정 &rarr;</p>
            <p class="text-sm text-white font-medium">${escapeHtml(course.nextCourse.label)}</p>
          </a>`
      : `<a href="${prefix}academy.html" class="lesson-link rounded-xl p-4 space-y-1 transition md:text-right">
            <p class="text-[11px] text-slate-500">교실 목차 &rarr;</p>
            <p class="text-sm text-white font-medium">트레이딩 교실</p>
          </a>`;
  const titleHtml = lesson.public
    ? escapeHtml(pageTitle)
    : `<span class="lock-icon" aria-hidden="true">🔒</span>${escapeHtml(pageTitle)}`;

  const html = `${head(pageTitle, prefix + "css/academy.css", extraHead, `${course.dir}/${lesson.filename}`)}
<body class="antialiased min-h-screen flex flex-col justify-between"${bodyAttr}>
  ${siteHeader(prefix)}
  <main class="max-w-7xl mx-auto px-6 py-10 w-full">
    <div class="lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-8">
      <article class="space-y-6 min-w-0">
        <div class="text-xs text-slate-500 space-x-2">
          <a href="${prefix}academy.html" class="hover:text-sky-400">트레이딩 교실</a>
          <span>/</span>
          <a href="${prefix}${course.tocFile}" class="hover:text-sky-400">${escapeHtml(course.title)}</a>
          <span>/</span>
          <span class="text-slate-400">${escapeHtml(lesson.label)}</span>
        </div>
        <div class="flex flex-wrap gap-2">
          ${coursePills(prefix, course.id)}
        </div>
        <section class="space-y-3">
          <div class="flex items-center gap-2">
            <span class="text-[11px] font-semibold ${course.badgeClass} px-2 py-0.5 rounded">${course.stage}</span>
            <span class="text-xs text-slate-500">${idx + 1} / ${lessons.length}</span>
          </div>
          <h1 class="text-2xl md:text-3xl font-normal font-serif-title text-white leading-snug">${titleHtml}</h1>
        </section>
        ${summaryBox}
        ${miniToc}
        ${bodyHtml}
        <div class="pt-6 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-3">
          ${prevCard}
          ${nextCard}
        </div>
      </article>
      <aside class="hidden lg:block">
        <div class="sticky top-24 space-y-3">
          <div class="flex items-center justify-between px-1">
            <p class="text-[11px] font-semibold uppercase tracking-wider text-slate-500">과정 목차</p>
            <a href="${prefix}${course.tocFile}" class="text-[11px] text-sky-400 hover:text-sky-300">전체 보기</a>
          </div>
          <div class="card-bg rounded-2xl p-3 max-h-[calc(100vh-8rem)] overflow-y-auto space-y-3">
            ${sidebarNav(course, lessons, lesson.slug, "")}
          </div>
        </div>
      </aside>
    </div>
  </main>
  ${siteFooter(prefix)}
</body>
</html>
`;
  const outDir = path.join(SITE, course.dir);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, lesson.filename), html, "utf8");
}

function writeTocPage(course, lessons) {
  const groups = groupedLessons(course.id, lessons);
  const publicCount = lessons.filter((l) => l.public).length;
  const accessNote =
    course.id === "beginner"
      ? `<p class="text-xs text-slate-500">${lessons.length}강 · 전체 공개</p>`
      : `<p class="text-xs text-slate-500">${lessons.length}강 · Module 1 앞 ${publicCount}강 공개 · 6강부터 멤버십 전용</p>
      <p class="text-xs text-amber-400/90">잠긴 강의는 이메일 구독 시 순차적으로 열람 권한이 제공됩니다.</p>`;
  const groupHtml = groups
    .map(
      (g) => `
    <section class="space-y-3">
      <div class="flex items-end justify-between gap-3">
        <div>
          <h2 class="text-lg font-bold text-white">${groupTitleHtml(g)}</h2>
          <p class="text-xs text-slate-500">${escapeHtml(g.hint)} · ${g.items.length}강</p>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        ${lessonCards(g.items)}
      </div>
    </section>`
    )
    .join("\n");

  const next = course.nextCourse
    ? `<a href="${course.nextCourse.href}" class="text-sm text-slate-300 hover:text-sky-400 font-medium transition">${escapeHtml(course.nextCourse.label)} &rarr;</a>`
    : `<a href="academy.html" class="text-sm text-slate-300 hover:text-sky-400 font-medium transition">트레이딩 교실 목차로 &rarr;</a>`;

  const html = `${head(course.title, "css/academy.css", "", course.tocFile)}
<body class="antialiased min-h-screen flex flex-col justify-between">
  ${siteHeader("")}
  <main class="max-w-7xl mx-auto px-6 py-10 space-y-8 w-full">
    <div class="flex flex-wrap gap-2">
      ${coursePills("", course.id)}
    </div>
    <section class="space-y-3">
      <span class="text-[11px] font-semibold ${course.badgeClass} px-2 py-0.5 rounded">${course.stage}</span>
      <h1 class="text-2xl md:text-3xl font-normal font-serif-title text-white">${escapeHtml(course.title)}</h1>
      <p class="text-sm text-slate-400 leading-relaxed max-w-3xl">${escapeHtml(course.desc)}</p>
      ${accessNote}
    </section>
    ${groupHtml}
    <div class="pt-4 border-t border-slate-800 flex justify-between items-center">
      <a href="academy.html" class="text-sm text-slate-500 hover:text-slate-300 font-medium transition">&larr; 트레이딩 교실 목차</a>
      ${next}
    </div>
  </main>
  ${siteFooter("")}
</body>
</html>
`;
  fs.writeFileSync(path.join(SITE, course.tocFile), html, "utf8");
}

function writeHub(all) {
  const cards = Object.values(COURSES)
    .map((c) => {
      const lessons = all[c.id];
      const groups = groupedLessons(c.id, lessons);
      const modules = groups
        .map((g) => `<li class="text-xs text-slate-400">${groupTitleHtml(g)} <span class="text-slate-600">· ${g.items.length}강</span></li>`)
        .join("");
      return `
      <article class="card-bg rounded-2xl p-6 space-y-4 flex flex-col">
        <div class="stage-head">
          <span class="stage-badge text-[11px] font-semibold ${c.badgeClass} px-2 py-0.5 rounded">${c.stage}</span>
          <span class="stage-tag text-xs text-slate-500">${lessons.length}강</span>
        </div>
        <h2 class="text-lg font-bold text-white">${escapeHtml(c.title)}</h2>
        <p class="text-xs text-slate-400 leading-relaxed">${escapeHtml(c.desc)}</p>
        <ul class="inner-box-bg rounded-xl p-4 space-y-1.5">${modules}</ul>
        <div class="pt-1 mt-auto">
          <a href="${c.tocFile}" class="text-xs text-slate-300 hover:text-sky-400 font-medium">커리큘럼 열람하기 &rarr;</a>
        </div>
      </article>`;
    })
    .join("\n");

  const catalogs = Object.values(COURSES)
    .map((c) => {
      const groups = groupedLessons(c.id, all[c.id]);
      const blocks = groups
        .map(
          (g) => `
        <div class="space-y-2">
          <h3 class="text-sm font-semibold text-white">${groupTitleHtml(g)} <span class="text-slate-500 font-normal">${escapeHtml(g.hint)}</span></h3>
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
            ${g.items
              .map((l) =>
                l.public
                  ? `<a href="${l.href}" class="lesson-link rounded-lg px-3 py-2.5 text-xs text-slate-300 hover:text-white transition truncate">${escapeHtml(l.label)}. ${escapeHtml(l.displayTitle)}</a>`
                  : `<button type="button" class="lesson-link lesson-locked rounded-lg px-3 py-2.5 text-xs text-slate-400 hover:text-white transition w-full text-left flex items-center justify-between gap-2" data-member-gate><span class="truncate min-w-0"><span class="lock-icon" aria-hidden="true">🔒</span>${escapeHtml(l.label)}. ${escapeHtml(l.displayTitle)}</span>${memberAccessLabel()}</button>`
              )
              .join("\n            ")}
          </div>
        </div>`
        )
        .join("\n");
      return `
    <section id="${c.id}" class="space-y-4">
      <div class="flex items-end justify-between gap-3">
        <div class="space-y-1">
          <span class="text-[11px] font-semibold ${c.badgeClass} px-2 py-0.5 rounded">${c.stage}</span>
          <h2 class="text-xl font-normal font-serif-title text-white">${escapeHtml(c.title)}</h2>
        </div>
        <a href="${c.tocFile}" class="text-xs text-slate-400 hover:text-sky-400">과정 페이지 &rarr;</a>
      </div>
      ${blocks}
    </section>`;
    })
    .join("\n");

  const html = `${head("트레이딩 교실", "css/academy.css", "", "academy.html")}
<body class="antialiased min-h-screen flex flex-col justify-between">
  ${siteHeader("")}
  <main class="max-w-7xl mx-auto px-6 py-10 space-y-10 w-full">
    <section class="space-y-3">
      <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Academy Framework</span>
      <p id="academy-catchphrase" class="notranslate text-sm md:text-base font-normal leading-relaxed max-w-3xl" style="color:#94a3b8" data-i18n="academy.catchphrase" translate="no">Simply reading and listening to this course builds disciplined trading habits and clear standards.</p>
      <h1 class="text-2xl md:text-3xl font-normal font-serif-title text-white">트레이딩 교실</h1>
      <p class="text-sm text-slate-400 leading-relaxed max-w-3xl">왕초보 20강은 전체 공개입니다. 중급·고급·심리지혜는 각 과정 Module 1(1~5강)만 미리 볼 수 있으며, 6강부터는 DawnQT Intelligence Hub 멤버십 전용입니다.</p>
    </section>
    <section class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      ${cards}
    </section>
    ${catalogs}
  </main>
  ${siteFooter("")}
</body>
</html>
`;
  fs.writeFileSync(path.join(SITE, "academy.html"), html, "utf8");
}

function main() {
  const all = {};
  let total = 0;
  for (const course of Object.values(COURSES)) {
    const files = listMarkdown(course.sourceDir);
    const lessons = files
      .map((f) => parseLessonFile(course, f))
      .sort((a, b) => a.sort[0] - b.sort[0] || a.sort[1] - b.sort[1]);
    if (!lessons.length) throw new Error(`No lessons found for ${course.id} in ${course.sourceDir}`);
    applyLessonAccess(course, lessons);
    all[course.id] = lessons;
    fs.mkdirSync(path.join(SITE, course.dir), { recursive: true });
    lessons.forEach((lesson, idx) => writeLessonPage(course, lessons, lesson, idx));
    writeTocPage(course, lessons);
    total += lessons.length;
    const open = lessons.filter((l) => l.public).length;
    console.log(`${course.id}: ${lessons.length} lessons (${open} public, ${lessons.length - open} member)`);
  }
  writeFaviconAssets();
  writeHub(all);
  applyInlineFaviconToAllHtml();
  console.log(`Wrote ${total} lesson pages + TOC + academy hub`);
}

function applyInlineFaviconToAllHtml() {
  const skip = new Set(["node_modules", ".git", "dawnqt-lab"]);
  const files = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (skip.has(entry.name)) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith(".html")) files.push(full);
    }
  }
  walk(SITE);
  const iconBlock = faviconLinks() + "\n";
  const iconRe = /(?:[ \t]*<link\s+rel="(?:shortcut )?icon"[^>]*>\s*\r?\n)+/i;
  for (const file of files) {
    let html = fs.readFileSync(file, "utf8");
    if (iconRe.test(html)) html = html.replace(iconRe, iconBlock);
    else html = html.replace(/<\/title>\s*/i, `</title>\n${iconBlock}`);
    fs.writeFileSync(file, html, "utf8");
  }
}

main();
