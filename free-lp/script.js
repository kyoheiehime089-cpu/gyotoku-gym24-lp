const LINE_URL = "https://line.me/R/ti/p/@700svyku";

const faqs = [
  ["本当に入会金も月会費もかかりませんか？", "無料利用の対象となる方は、入会金0円・月会費0円で利用できます。対象地域や利用条件は公式LINEで確認します。"],
  ["今すぐ利用できますか？", "人数制限を設けておりますので、現在の空き状況は公式LINEからご確認ください。"],
  ["初心者でも利用できますか？", "はい。予約した時間は貸切なので、人目を気にせず自分のペースで利用できます。"],
  ["小さな子どもを連れて行けますか？", "貸切空間のため、お子さまと一緒に利用できます。安全を最優先にし、保護者の方の目が届く範囲でお願いします。"],
  ["行徳周辺のどこまでが対象ですか？", "施設からおおむね約1km圏内が目安です。対象地域の境界の場合は公式LINEから確認してください。"],
  ["無料利用にはルールがありますか？", "利用後の簡単な清掃、器具を元の位置へ戻すこと、時間を守ることなどをお願いしています。開始前に利用規約をご確認いただきます。"],
  ["予約枠が埋まった場合はどうなりますか？", "無料利用枠が上限に達した場合は、受付を一時停止することがあります。"],
];

const withUtm = () => {
  const target = new URL(LINE_URL);
  new URLSearchParams(location.search).forEach((value, key) => {
    if (key.toLowerCase().startsWith("utm_")) target.searchParams.set(key, value);
  });
  return target.href;
};

document.querySelectorAll("[data-line-cta]").forEach((link) => {
  link.href = withUtm();
  link.target = "_blank";
  link.rel = "noopener noreferrer";
});

const faqRoot = document.querySelector("[data-faq]");
faqRoot.replaceChildren(...faqs.map(([question, answer]) => {
  const details = document.createElement("details");
  const summary = document.createElement("summary");
  summary.textContent = question;
  summary.setAttribute("role", "button");
  summary.setAttribute("aria-expanded", "false");
  const copy = document.createElement("p");
  copy.textContent = answer;
  details.append(summary, copy);
  details.addEventListener("toggle", () => summary.setAttribute("aria-expanded", String(details.open)));
  return details;
}));
