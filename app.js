/* Cover Letter Builder — hand-written templates filled from the form. No AI, no network; saved via S3.store. */
(function () {
  "use strict";
  var $ = S3.$, $$ = S3.$$;
  var KEY = "cvletter.data";
  var FIELDS = ["role", "company", "manager", "source", "why", "name", "current", "years", "start", "email", "phone", "s1", "s2", "s3", "a1", "a2"];
  var TONES = ["formal", "warm", "confident", "concise"];
  var st;

  // ---------- grammar helpers (tested) ----------
  function joinList(a) {
    a = a.filter(Boolean);
    return a.length < 2 ? a[0] || "" : a.slice(0, -1).join(", ") + " and " + a[a.length - 1];
  }
  function an(w) {
    w = String(w || "").trim();
    if (!w) return "a";
    if (/^[A-Z]{2,}\b/.test(w)) return /^[AEFHILMNORSX]/.test(w) ? "an" : "a"; // acronyms are spelled out: "an SEO…", "a UX…"
    if (/^(hour|honest|heir|honou?r)/i.test(w)) return "an";
    if (/^(uni|use|usu|eu|one\b)/i.test(w)) return "a";
    return /^[aeiou]/i.test(w) ? "an" : "a";
  }
  function sentence(s) { s = String(s || "").trim(); return !s ? "" : /[.!?…]$/.test(s) ? s : s + "."; }
  function bullets(a) { return a.filter(Boolean).map(function (x) { return "•  " + sentence(x); }).join("\n"); }

  // ---------- templates: each returns the letter body from data d ----------
  function ctx(d) {
    var R = d.role || "[Role]", C = d.company || "[Company]";
    var yrs = +d.years > 0 ? (+d.years === 1 ? "one year" : d.years + " years") : "";
    var S = joinList([d.s1, d.s2, d.s3]) || "[your key strengths]";
    var A = [d.a1, d.a2].filter(Boolean);
    var reach = joinList([d.email, d.phone]).replace(" and ", " or ");
    return {
      R: R, C: C, aR: an(R) + " " + R, S: S, A: A, yrs: yrs,
      greet: d.manager ? "Dear " + d.manager + "," : "Dear Hiring Manager,",
      src: d.source ? ", as advertised on " + d.source : "", on: d.source ? " on " + d.source : "",
      cur: d.current ? an(d.current) + " " + d.current : "",
      why: sentence(d.why),
      start: d.start ? "I am available to start " + d.start.replace(/[.\s]+$/, "") + "." : "",
      reach: reach, name: d.name || "[Your name]"
    };
  }
  function exp(c, lead, tail) {
    tail = tail == null ? " of experience" : tail;
    if (c.yrs && c.cur) return lead + c.yrs + tail + ", most recently as " + c.cur;
    if (c.yrs) return lead + c.yrs + tail;
    if (c.cur) return "In my current role as " + c.cur;
    return "";
  }
  var T = {
    formal: [
      function (d) {
        var c = ctx(d), e = exp(c, "With ");
        return [c.greet,
          "I am writing to apply for the position of " + c.R + " at " + c.C + c.src + ". " + (e ? e + ", I" : "I") + " am confident that I can make a meaningful contribution to your team.",
          "Throughout my career I have developed particular strength in " + c.S + "." + (c.A.length ? " Highlights of my record include:\n" + bullets(c.A) : ""),
          c.why ? "I am particularly drawn to " + c.C + " for the following reason: " + c.why : "I am particularly drawn to " + c.C + "'s reputation and would value the opportunity to contribute to its continued success.",
          "I would welcome the opportunity to discuss how my experience matches your needs. " + (c.start ? c.start + " " : "") + (c.reach ? "I can be reached at " + c.reach + ". " : "") + "Thank you for your time and consideration.",
          (d.manager ? "Yours sincerely," : "Yours faithfully,") + "\n" + c.name].join("\n\n");
      },
      function (d) {
        var c = ctx(d), e = exp(c, "I bring ");
        return [c.greet,
          "Please accept this letter as my application for the role of " + c.R + " at " + c.C + c.src + ". " + (e ? e + ", and I" : "I") + " believe my background aligns closely with the requirements of the position.",
          "My key strengths are " + c.S + "." + (c.A.length ? " In particular:\n" + bullets(c.A) : "") ,
          c.why ? c.why + " It is for this reason that I am keen to join " + c.C + "." : "I would be pleased to bring these skills to " + c.C + ".",
          "Thank you for considering my application. " + (c.start ? c.start + " " : "") + "I look forward to the opportunity to discuss it with you" + (c.reach ? "; I can be contacted at " + c.reach : "") + ".",
          "Yours sincerely,\n" + c.name].join("\n\n");
      }
    ],
    warm: [
      function (d) {
        var c = ctx(d), e = exp(c, "I have spent ", " in the field");
        return [c.greet.replace("Dear Hiring Manager,", "Dear " + c.C + " team,"),
          "I was excited to see that " + c.C + " is looking for " + c.aR + c.src + ", and I would love to be considered. " + (e ? e + ", and I" : "I") + " genuinely enjoy the kind of work this role involves.",
          "People I work with tend to rely on me for " + c.S + "." + (c.A.length ? " A couple of things I'm proud of:\n" + bullets(c.A) : ""),
          c.why ? "What draws me to " + c.C + " is simple. " + c.why : "I admire what " + c.C + " is building, and I would be glad to help it grow.",
          "I'd really enjoy talking about how I could help your team. " + (c.start ? c.start + " " : "") + (c.reach ? "You can reach me any time at " + c.reach + ". " : "") + "Thank you so much for reading.",
          "Warm regards,\n" + c.name].join("\n\n");
      },
      function (d) {
        var c = ctx(d), e = exp(c, "Over ", "");
        return [c.greet,
          "When I came across the " + c.R + " opening at " + c.C + c.on + ", it felt like a natural next step for me. " + (e ? e + ", I" : "I") + " have found that I do my best work when I can combine " + c.S + ".",
          c.A.length ? "Here are a few results I'm proud of:\n" + bullets(c.A) : "I care about doing good work and about the people I do it with.",
          c.why ? c.why + " That is exactly the kind of place where I want to grow." : "I would be thrilled to bring that energy to " + c.C + ".",
          "Thank you for taking the time to read my letter. " + (c.start ? c.start + " " : "") + "I would love the chance to meet and talk further" + (c.reach ? " (" + c.reach + ")" : "") + ".",
          "With best wishes,\n" + c.name].join("\n\n");
      }
    ],
    confident: [
      function (d) {
        var c = ctx(d), e = exp(c, "With ");
        return [c.greet,
          c.C + " needs " + c.aR + " who delivers results from day one. That is what I do. " + (e ? e + ", I" : "I") + " have built a track record in " + c.S + ".",
          c.A.length ? "The results speak for themselves:\n" + bullets(c.A) : "I set clear goals, measure what matters and follow through.",
          c.why ? "I chose to apply to " + c.C + " deliberately. " + c.why : "I want to bring that focus to " + c.C + ".",
          "I'd welcome a conversation about what I can achieve for your team. " + (c.start ? c.start + " " : "") + (c.reach ? "Reach me at " + c.reach + "." : ""),
          "Best regards,\n" + c.name].join("\n\n").replace(/ +\n/g, "\n");
      },
      function (d) {
        var c = ctx(d), e = exp(c, "With ");
        return [c.greet,
          "I am applying for the " + c.R + " role at " + c.C + " because I am confident I can raise the bar for your team. " + (e ? e + ", I" : "I") + " combine " + c.S + " to get things done.",
          c.A.length ? "Recent wins:\n" + bullets(c.A) : "I take ownership, move quickly and leave things better than I found them.",
          c.why ? c.why + " I want to be part of that, and I am ready to contribute immediately." : "I am ready to contribute to " + c.C + " immediately.",
          (c.start ? c.start + " " : "") + "Let's talk about how I can help" + (c.reach ? ": " + c.reach : "") + ".",
          "Best regards,\n" + c.name].join("\n\n");
      }
    ],
    concise: [
      function (d) {
        var c = ctx(d), e = exp(c, "I bring ");
        return [c.greet,
          "I'm applying for the " + c.R + " role at " + c.C + c.src + ". " + (e ? e + ", with strengths in " + c.S + "." : "My strengths are " + c.S + "."),
          c.A.length ? bullets(c.A) : "",
          (c.why ? c.why + " " : "") + (c.start ? c.start + " " : "") + "I'd welcome the chance to talk" + (c.reach ? " (" + c.reach + ")" : "") + ".",
          "Kind regards,\n" + c.name].filter(Boolean).join("\n\n");
      },
      function (d) {
        var c = ctx(d);
        return [c.greet,
          "Please consider me for the " + c.R + " position at " + c.C + ". " + (c.cur ? "I'm currently " + c.cur + (c.yrs ? " with " + c.yrs + " of experience" : "") + ", and my" : "My") + " strengths are " + c.S + ".",
          c.A.length ? "Two results:\n" + bullets(c.A) : "",
          "Thank you for your time. " + (c.start ? c.start + " " : "") + (c.reach ? "Contact: " + c.reach + "." : ""),
          "Regards,\n" + c.name].filter(Boolean).join("\n\n").replace(/ +\n/g, "\n");
      }
    ]
  };
  function build(d) { return T[d.tone][d.ver](d).replace(/ +(\n|$)/g, "$1"); }

  // ---------- state ----------
  function clean(o) {
    o = o && typeof o === "object" && !Array.isArray(o) ? o : {};
    var r = { tone: TONES.indexOf(o.tone) >= 0 ? o.tone : "formal", ver: o.ver === 1 ? 1 : 0, edited: o.edited === true, body: typeof o.body === "string" ? o.body.slice(0, 20000) : "" };
    FIELDS.forEach(function (k) { r[k] = typeof o[k] === "string" ? o[k].slice(0, 220) : typeof o[k] === "number" && isFinite(o[k]) ? String(o[k]) : ""; });
    return r;
  }
  var saveSoon = S3.debounce(function () { if (S3.store(KEY, st) === undefined) S3.toast("Couldn't save — browser storage is blocked or full", "error"); }, 300);

  // ---------- view ----------
  var body = $("#body");
  function grow() { body.style.height = "auto"; body.style.height = body.scrollHeight + 4 + "px"; }
  function header() {
    $("#lName").textContent = st.name || "Your Name";
    $("#lName").classList.toggle("ph", !st.name);
    $("#lContact").textContent = [st.email, st.phone].filter(Boolean).join("  ·  ");
    $("#lDate").textContent = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    var miss = [["role", "the role"], ["company", "the company"], ["name", "your name"], ["s1", "a strength"], ["a1", "an achievement"]].filter(function (m) { return !st[m[0]]; }).map(function (m) { return m[1]; });
    $("#todo").textContent = miss.length ? "Still to fill in: " + joinList(miss) + ". Anything in [brackets] is a placeholder." : "Looks complete. Read it once out loud, then print or copy.";
  }
  function sync() {
    if (!st.edited) body.value = st.body = build(st);
    $("#bodyPrint").textContent = body.value;
    $("#edited").hidden = $("#rebuild").hidden = !st.edited;
    $$("#tone button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.v === st.tone)); });
    $$("#ver button").forEach(function (b) { b.setAttribute("aria-pressed", String(+b.dataset.v === st.ver)); });
    header(); grow(); saveSoon();
  }
  $("#form").addEventListener("input", function (e) {
    var k = e.target.dataset.k; if (!k) return;
    st[k] = e.target.value; sync();
  });
  body.addEventListener("input", function () { st.body = body.value; st.edited = true; sync(); });
  function pick(id, key, conv) {
    $$("#" + id + " button").forEach(function (b) {
      b.addEventListener("click", function () {
        if (st.edited) { var old = st.body; keepUndo(old); }
        st[key] = conv(b.dataset.v); st.edited = false; sync();
      });
    });
  }
  function keepUndo(old) {
    var t = S3.toast("Rebuilt from the form ");
    t.appendChild(S3.h("button", { "class": "btn small", text: "Undo", onclick: function () { st.body = body.value = old; st.edited = true; sync(); t.remove(); } }));
  }
  pick("tone", "tone", String); pick("ver", "ver", Number);
  $("#rebuild").addEventListener("click", function () { keepUndo(st.body); st.edited = false; sync(); });

  function plain() { return body.value; }
  $("#copy").addEventListener("click", function () { S3.copy(plain(), "Letter copied"); S3.done(); });
  $("#txt").addEventListener("click", function () { S3.download(plain(), "cover-letter.txt", "text/plain;charset=utf-8"); S3.done(); });
  $("#print").addEventListener("click", function () { $("#bodyPrint").textContent = body.value; window.print(); S3.done(); });
  window.addEventListener("resize", S3.debounce(grow, 150));

  // ---------- boot ----------
  st = clean(S3.store(KEY));
  FIELDS.forEach(function (k) { var el = $("[data-k=" + k + "]"); if (el) el.value = st[k]; });
  if (st.edited) body.value = st.body;
  sync();

  window.S3_DEMO = function () {
    st = clean({ tone: "warm", ver: 0, role: "Marketing Coordinator", company: "Brightleaf", manager: "Ms. Rana Khalil", source: "LinkedIn",
      why: "Your mission to make healthy food affordable for every family is one I care about personally.",
      name: "Omar Nasser", current: "Social Media Specialist", years: "4", start: "in two weeks", email: "omar.nasser@example.com", phone: "+962 7 9000 0000",
      s1: "content strategy", s2: "data analysis", s3: "clear writing",
      a1: "Grew our Instagram audience from 4k to 25k followers in 12 months", a2: "Cut campaign reporting time by 60% with a shared dashboard" });
    FIELDS.forEach(function (k) { var el = $("[data-k=" + k + "]"); if (el) el.value = st[k]; });
    sync();
  };

  window.S3_SELFTEST = function () {
    var okJ = joinList(["a"]) === "a" && joinList(["a", "", "b"]) === "a and b" && joinList(["a", "b", "c"]) === "a, b and c" && joinList([]) === "";
    var okA = an("engineer") === "an" && an("Designer") === "a" && an("SEO specialist") === "an" && an("UX designer") === "a" && an("hour") === "an" && an("user researcher") === "a";
    var okS = sentence("done") === "done." && sentence("Wow!") === "Wow!" && sentence("  ") === "";
    var full = clean({ role: "Data Analyst", company: "Acme", name: "Sam", years: 3, current: "Analyst", s1: "SQL", s2: "Python", a1: "Cut costs 10%", a2: "Built X", why: "I love your product", start: "now", email: "s@x.io", manager: "Mr. Lee" });
    var empty = clean({});
    var okT = TONES.every(function (tone) {
      return [0, 1].every(function (v) {
        var f = build(Object.assign({}, full, { tone: tone, ver: v })), e = build(Object.assign({}, empty, { tone: tone, ver: v }));
        return /Acme/.test(f) && /Data Analyst/.test(f) && /Sam$/.test(f) && !/undefined|null|NaN|\s{3,}\S|\.\./.test(f) &&
          /\[Company\]|\[Role\]/.test(e) && /\[Your name\]$/.test(e) && !/undefined|null|NaN|\.\./.test(e);
      });
    });
    var formal = build(Object.assign({}, full, { tone: "formal", ver: 0 })), noMgr = build(Object.assign({}, full, { manager: "", tone: "formal", ver: 0 }));
    var okF = /^Dear Mr\. Lee,/.test(formal) && /Yours sincerely,/.test(formal) && /^Dear Hiring Manager,/.test(noMgr) && /Yours faithfully,/.test(noMgr) &&
      /With 3 years of experience, most recently as an Analyst, I am/.test(formal) && /•  Cut costs 10%\./.test(formal);
    var bad = clean({ tone: "<x>", ver: 7, role: { a: 1 }, body: 5 });
    return okJ && okA && okS && okT && okF && bad.tone === "formal" && bad.ver === 0 && bad.role === "" && bad.body === "";
  };
})();
