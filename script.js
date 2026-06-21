const LINE_URL = "https://lin.ee/o5cQkJn";

const getLineUrlWithUtm = () => {
  const currentParams = new URLSearchParams(window.location.search);
  const target = new URL(LINE_URL, window.location.href);

  currentParams.forEach((value, key) => {
    if (key.toLowerCase().startsWith("utm_")) {
      target.searchParams.set(key, value);
    }
  });

  return target.toString();
};

const applyLineLinks = () => {
  const lineUrl = getLineUrlWithUtm();
  document.querySelectorAll("[data-line-cta]").forEach((link) => {
    link.setAttribute("href", lineUrl);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
  });
};

const FREE_INITIAL_FEES = [
  { label: "入会金", original: "30,000円", campaign: "0円" },
  { label: "事務手数料", original: "3,000円", campaign: "0円" },
];

const JUNE_CAMPAIGN_CONTENT = {
  status: "june",
  title: "6月プレオープン先行受付中",
  subtitle: "先着10名様限定",
  lead: "6月中にご入会の方は、継続期間中ずっと月会費1,000円OFF",
  fees: FREE_INITIAL_FEES,
  extras: ["初月0円", "2・3か月目 各1,000円"],
  note: "",
};

const createMonthlyCampaignContent = (month, isJulyPreOpen = false) => ({
  status: isJulyPreOpen ? "july" : "monthly",
  title: isJulyPreOpen ? "7月プレオープンキャンペーン" : `${month}月キャンペーン`,
  subtitle: "先着10名様限定",
  lead: `${month}月中にご入会された方限定で、セミパーソナルジム1ヶ月無料`,
  fees: FREE_INITIAL_FEES,
  extras: [],
  note: "完全個室・貸切型セルフジムを使いながら、セミパーソナルも試せるキャンペーンです。運動を続けられるか不安な方も、この機会にまずは見学からご相談ください。",
});

// JST midnight boundaries converted to UTC timestamps.
// This keeps the date switch independent from the visitor's browser time zone setting.
const JULY_CAMPAIGN_START_UTC_MS = Date.UTC(2026, 5, 30, 15, 0, 0);
const AUGUST_CAMPAIGN_START_UTC_MS = Date.UTC(2026, 6, 31, 15, 0, 0);

const getJstMonth = (date) => {
  const monthPart = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    month: "numeric",
  })
    .formatToParts(date)
    .find((part) => part.type === "month");

  return Number(monthPart?.value);
};

const getCampaignContent = (now = new Date()) => {
  const currentTime = now.getTime();

  if (currentTime < JULY_CAMPAIGN_START_UTC_MS) {
    return JUNE_CAMPAIGN_CONTENT;
  }

  const month = getJstMonth(now);
  const isJulyPreOpen = currentTime < AUGUST_CAMPAIGN_START_UTC_MS;
  return createMonthlyCampaignContent(month, isJulyPreOpen);
};

const getCampaignEvaluationDate = () => {
  const params = new URLSearchParams(window.location.search);
  const previewDate = params.get("campaign_preview_date");
  const isLocalPreview = ["localhost", "127.0.0.1"].includes(window.location.hostname);

  if (isLocalPreview && previewDate) {
    const date = new Date(previewDate);
    if (!Number.isNaN(date.getTime())) return date;
  }

  return new Date();
};

const renderCampaign = (campaign) => {
  const panel = document.querySelector("[data-campaign-panel]");
  const title = document.querySelector("[data-campaign-title]");
  const subtitle = document.querySelector("[data-campaign-subtitle]");
  const lead = document.querySelector("[data-campaign-lead]");
  const fees = document.querySelector("[data-campaign-fees]");
  const extras = document.querySelector("[data-campaign-extras]");
  const note = document.querySelector("[data-campaign-note]");
  const cta = document.querySelector("[data-campaign-cta]");

  if (!panel || !title || !lead || !fees || !extras || !note) return;

  panel.dataset.campaignStatus = campaign.status;
  title.textContent = campaign.title;

  if (subtitle) {
    subtitle.textContent = campaign.subtitle;
    subtitle.hidden = !campaign.subtitle;
  }

  lead.textContent = campaign.lead;

  fees.replaceChildren(
    ...campaign.fees.map((fee) => {
      const item = document.createElement("div");
      item.className = "hero-campaign__fee";

      const label = document.createElement("span");
      label.textContent = fee.label;

      const price = document.createElement("p");
      const original = document.createElement("del");
      const arrow = document.createElement("em");
      const campaignPrice = document.createElement("strong");
      original.textContent = fee.original;
      arrow.textContent = "→";
      campaignPrice.textContent = fee.campaign;
      price.append(original, arrow, campaignPrice);

      item.append(label, price);
      return item;
    })
  );

  extras.replaceChildren(
    ...campaign.extras.map((extra) => {
      const item = document.createElement("span");
      item.textContent = extra;
      return item;
    })
  );
  extras.hidden = campaign.extras.length === 0;

  note.textContent = campaign.note;
  note.hidden = !campaign.note;

  if (cta) cta.textContent = "今すぐ見学予約をする";
};

const setupCampaignSwitch = () => {
  const apply = () => renderCampaign(getCampaignContent(getCampaignEvaluationDate()));

  apply();
  window.setInterval(apply, 60 * 1000);
};

window.gyotokuGym24Campaign = {
  getCampaignContent,
  renderCampaign,
};

const setupHeader = () => {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const toggle = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  toggle();
  window.addEventListener("scroll", toggle, { passive: true });
};

const setupReveal = () => {
  const targets = document.querySelectorAll("[data-reveal]");
  if (!targets.length) return;

  if (!("IntersectionObserver" in window)) {
    targets.forEach((target) => target.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
  );

  targets.forEach((target) => observer.observe(target));
};

const setupFaq = () => {
  const items = document.querySelectorAll(".faq-list details");
  items.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      items.forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });
};

const setupFloatingCta = () => {
  const floatingCta = document.querySelector(".floating-cta");
  const hero = document.querySelector(".hero");
  if (!floatingCta || !hero) return;

  const toggle = () => {
    const heroBottom = hero.getBoundingClientRect().bottom;
    floatingCta.classList.toggle("is-hidden", heroBottom > 120);
  };

  toggle();
  window.addEventListener("scroll", toggle, { passive: true });
};

setupCampaignSwitch();
applyLineLinks();
setupHeader();
setupReveal();
setupFaq();
setupFloatingCta();
