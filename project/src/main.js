import Reveal from "reveal.js";
import "reveal.js/dist/reveal.css";
import "./theme.css";

const validAudiences = new Set(["generic", "school", "institution"]);
const requestedAudience =
  new URLSearchParams(window.location.search).get("audience") ||
  window.__DECK_AUDIENCE__ ||
  "generic";
const audience = validAudiences.has(requestedAudience) ? requestedAudience : "generic";

const audienceMeta = {
  generic: {
    title: "AI未来通识课 | 课程介绍",
    description: "面向学校与教育机构负责人的 AI 通识课程介绍"
  },
  school: {
    title: "AI未来通识课 | 学校合作版",
    description: "面向校长、教学主任与学校项目负责人的 AI 通识课程介绍"
  },
  institution: {
    title: "AI未来通识课 | 教育机构合作版",
    description: "面向培训机构负责人、项目主管与课程决策者的 AI 通识课程介绍"
  }
};

const audienceCopy = {
  school: {
    "cover-chip": "学校合作版课程介绍",
    "audience-card-title": "学校负责人",
    "audience-card-line-1": "校长 / 教学主任",
    "audience-card-line-2": "课程项目决策者",
    "focus-card-line-3": "如何进入学校课程体系",
    "fit-heading": "为什么这套课适合学校",
    "fit-subhead":
      "对学校来说，这门课既能回应时代变化，也容易形成校本特色、项目成果与对外展示。",
    "fit-thesis-title": "学校今天要回答的，是如何把 AI 时代能力转化为可落地课程。",
    "fit-thesis-body":
      "课程既要体现未来性，也要兼顾校内实施、成果展示与教师成长。",
    "fit-panel-footnote":
      "它能进入校本课、社团课、综合实践、项目周等多种校内场景。",
    "fit-chip-1": "校本特色",
    "fit-chip-2": "综合实践",
    "fit-chip-3": "成果展示",
    "fit-1-title": "回应时代需求",
    "fit-1-body":
      "把 AI 时代核心能力转化为学校能讲、能做、能展示的课程方案。",
    "fit-2-title": "形成校本特色",
    "fit-2-body":
      "课程成果能支持校园开放日、项目汇报与特色课程表达。",
    "fit-3-title": "适配校内组织",
    "fit-3-body":
      "可按学期、年级、班型与项目周节奏灵活组合，进入真实教学场景。",
    "fit-4-title": "支持教师成长",
    "fit-4-body":
      "配套师资培训与教学指导，帮助教师把任务式课堂真正带起来。",
    "fit-footer": "建议学校落地形态：校本课 / 社团课 / 综合实践 / 项目周",
    "partner-heading": "校本合作方案",
    "partner-subhead":
      "除课程体系外，也支持学校从开课准备到教师培训再到正式实施的完整落地。",
    "partner-thesis":
      "从课程准备到校本实施，可形成一套适配学校场景的支持方案。",
    "partner-support-text":
      "适合用于校本课、社团课、综合实践项目、项目周等学校场景。",
    "partner-pill-1": "综合实践",
    "partner-pill-2": "校本课",
    "partner-pill-3": "社团课",
    "partner-pill-4": "项目周",
    "partner-support-caption":
      "支持重点：课程架构、教师准备、AI 学习工具、校内实施支持。",
    "partner-support-1-body": "模块地图、学期编排与校内开课结构支持。",
    "partner-support-2-body":
      "帮助教师理解任务式课堂节奏与 AI 协同教学方式，并系统掌握提示词、AIGC、智能体、知识库等核心内容。",
    "partner-support-3-body":
      "提供适合学生上手的 AI 学习工具与任务支架。",
    "partner-support-4-body":
      "支持开课、正课、复盘与迭代，协助学校形成稳定项目。",
    "partner-ribbon": "可支持：课程介绍 / 校内筹备 / 项目实施 / 教师培训 / 校园成果展示",
    "closing-deck-mark": "欢迎继续交流校本课程体系、合作方式与教师培训方案"
  },
  institution: {
    "cover-chip": "教育机构合作版课程介绍",
    "audience-card-title": "培训机构负责人",
    "audience-card-line-1": "校区校长 / 项目主管",
    "audience-card-line-2": "课程产品决策者",
    "focus-card-line-3": "如何支持招生与项目落地",
    "fit-heading": "为什么这套课适合培训机构",
    "fit-subhead":
      "对机构来说，这门课既有差异化，也具备展示性、转化价值与持续运营空间。",
    "fit-thesis-title": "对机构来说，关键在于形成清晰、稳定、可持续的课程项目。",
    "fit-thesis-body":
      "课程既要建立差异化，也要兼顾体验、转化与长期运营。",
    "fit-panel-footnote":
      "它兼顾课程体验、项目包装、成果展示与品牌表达。",
    "fit-chip-1": "差异化项目",
    "fit-chip-2": "招生表达",
    "fit-chip-3": "持续运营",
    "fit-1-title": "做出差异化",
    "fit-1-body":
      "从单次工具体验走向完整课程项目，形成少儿课程线的鲜明辨识度。",
    "fit-2-title": "支持招生转化",
    "fit-2-body":
      "任务成果和作品展示更便于家长理解课程价值，也适合用于招生表达。",
    "fit-3-title": "便于主题化运营",
    "fit-3-body":
      "可做体验营、周末班、主题营、项目营和长期班级产品。",
    "fit-4-title": "便于长期开展",
    "fit-4-body":
      "模块可组合、可分层，适合按阶段持续开课与延展。",
    "fit-footer": "建议机构落地形态：体验营 / 周末班 / 主题营 / 长线班 / 项目营",
    "partner-heading": "项目合作方案",
    "partner-subhead":
      "除课程内容外，也支持机构从课程介绍、试课设计到正式开班的完整落地。",
    "partner-thesis":
      "从课程介绍到正式开班，可形成一套可启动、可转化、可持续实施的支持方案。",
    "partner-support-text":
      "适合用于体验营、周末班、主题营、长期班等不同开课场景。",
    "partner-pill-1": "体验营",
    "partner-pill-2": "周末班",
    "partner-pill-3": "主题营",
    "partner-pill-4": "长期班",
    "partner-support-caption":
      "支持重点：课程产品、师训准备、AI 学习工具、开班陪跑。",
    "partner-support-1-body": "模块地图、班型设计与项目产品结构支持。",
    "partner-support-2-body":
      "帮助教师建立任务式课堂节奏和 AI 协同带班方式，并系统掌握提示词、AIGC、智能体、知识库等核心内容。",
    "partner-support-3-body":
      "确保孩子每节课都能真实上手，并形成可展示成果。",
    "partner-support-4-body":
      "支持试课、正课、复盘与持续开班，形成可持续运行的项目方案。",
    "partner-ribbon": "可支持：课程介绍 / 试课体验 / 正式开班 / 师资培训 / 持续开课",
    "closing-deck-mark": "欢迎继续交流项目设计、课程方案与开班合作方式"
  }
};

function applyAudienceVariant(currentAudience) {
  document.documentElement.dataset.audience = currentAudience;
  document.body.dataset.audience = currentAudience;

  const meta = audienceMeta[currentAudience] || audienceMeta.generic;
  document.title = meta.title;
  const description = document.querySelector('meta[name="description"]');
  if (description) {
    description.setAttribute("content", meta.description);
  }

  const copy = audienceCopy[currentAudience];
  if (!copy) {
    return;
  }

  Object.entries(copy).forEach(([key, value]) => {
    document.querySelectorAll(`[data-copy="${key}"]`).forEach((node) => {
      node.textContent = value;
    });
  });
}

applyAudienceVariant(audience);

const isPrintView =
  /print-pdf/gi.test(window.location.search) ||
  /view=print/gi.test(window.location.search);

const deck = new Reveal({
  hash: true,
  controls: false,
  progress: false,
  center: false,
  autoAnimate: !isPrintView,
  autoAnimateEasing: "cubic-bezier(0.22, 1, 0.36, 1)",
  autoAnimateDuration: 0.7,
  width: 1600,
  height: 900,
  margin: 0.02,
  transition: isPrintView ? "none" : "fade",
  backgroundTransition: isPrintView ? "none" : "fade",
  navigationMode: "linear",
  pdfMaxPagesPerSlide: 1,
  pdfSeparateFragments: false,
  showNotes: false
});

deck.initialize();
