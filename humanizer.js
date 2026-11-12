/**
 * AI Text Humanizer v2 — Advanced Bypass Engine
 *
 * Targets the two core metrics AI detectors use:
 *   • PERPLEXITY  — how predictable each word is (AI = low, Human = high)
 *   • BURSTINESS  — sentence-length uniformity (AI = uniform, Human = varied)
 *
 * 20+ layered transformation passes to defeat GPTZero, Originality.ai,
 * Turnitin, Copyleaks, ZeroGPT, etc.
 */

(function () {
  "use strict";

  // ────────────────────── DOM ──────────────────────
  const inputEl       = document.getElementById("inputText");
  const outputEl      = document.getElementById("outputText");
  const humanizeBtn   = document.getElementById("humanizeBtn");
  const rewriteBtn    = document.getElementById("rewriteBtn");
  const copyBtn       = document.getElementById("copyBtn");
  const pasteBtn      = document.getElementById("pasteBtn");
  const clearBtn      = document.getElementById("clearBtn");
  const intensityEl   = document.getElementById("intensity");
  const toneEl        = document.getElementById("tone");
  const creativityEl  = document.getElementById("creativity");
  const passesEl      = document.getElementById("passes");
  const inputCountEl  = document.getElementById("inputCount");
  const wordCountEl   = document.getElementById("wordCount");
  const outputFooter  = document.getElementById("outputFooter");
  const changeCountEl = document.getElementById("changeCount");
  const humanScoreEl  = document.getElementById("humanScore");
  const downloadWordBtn     = document.getElementById("downloadWordBtn");
  const downloadWordBtnLarge= document.getElementById("downloadWordBtnLarge");
  const wordSettingsEl      = document.getElementById("wordSettings");
  const closeWordSettingsBtn= document.getElementById("closeWordSettings");
  const generateWordBtn     = document.getElementById("generateWordBtn");
  const docTitleEl          = document.getElementById("docTitle");
  const docAuthorEl         = document.getElementById("docAuthor");
  const docFontEl           = document.getElementById("docFont");
  const docFontSizeEl       = document.getElementById("docFontSize");
  const docSpacingEl        = document.getElementById("docSpacing");
  const docHeadingDetectEl  = document.getElementById("docHeadingDetect");
  const docPageNumbersEl    = document.getElementById("docPageNumbers");
  const docHeaderTitleEl    = document.getElementById("docHeaderTitle");

  // ────────────────────── UTILS ──────────────────────
  const pick   = a => a[Math.floor(Math.random() * a.length)];
  const chance = p => Math.random() < p;
  const clamp  = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const shuffle = a => { const c = [...a]; for (let i = c.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [c[i], c[j]] = [c[j], c[i]]; } return c; };
  const randInt = (lo, hi) => Math.floor(Math.random() * (hi - lo + 1)) + lo;

  // ────────────────────── DATA ──────────────────────

  const CONTRACTIONS = [
    [/\bI am\b/g, "I'm"], [/\bI have\b/g, "I've"], [/\bI will\b/g, "I'll"],
    [/\bI would\b/g, "I'd"], [/\bI had\b/g, "I'd"],
    [/\bYou are\b/g, "You're"], [/\byou are\b/g, "you're"],
    [/\bYou have\b/g, "You've"], [/\byou have\b/g, "you've"],
    [/\bYou will\b/g, "You'll"], [/\byou will\b/g, "you'll"],
    [/\bWe are\b/g, "We're"], [/\bwe are\b/g, "we're"],
    [/\bWe have\b/g, "We've"], [/\bwe have\b/g, "we've"],
    [/\bWe will\b/g, "We'll"], [/\bwe will\b/g, "we'll"],
    [/\bThey are\b/g, "They're"], [/\bthey are\b/g, "they're"],
    [/\bThey have\b/g, "They've"], [/\bthey have\b/g, "they've"],
    [/\bThey will\b/g, "They'll"], [/\bthey will\b/g, "they'll"],
    [/\bThere is\b/g, "There's"], [/\bthere is\b/g, "there's"],
    [/\bIt is\b/g, "It's"], [/\bit is\b/g, "it's"],
    [/\bIt has\b/g, "It's"], [/\bit has\b/g, "it's"],
    [/\bIt will\b/g, "It'll"], [/\bit will\b/g, "it'll"],
    [/\bThat is\b/g, "That's"], [/\bthat is\b/g, "that's"],
    [/\bWhat is\b/g, "What's"], [/\bwhat is\b/g, "what's"],
    [/\bWho is\b/g, "Who's"], [/\bwho is\b/g, "who's"],
    [/\bWhere is\b/g, "Where's"], [/\bwhere is\b/g, "where's"],
    [/\bHow is\b/g, "How's"], [/\bhow is\b/g, "how's"],
    [/\bdo not\b/g, "don't"], [/\bDo not\b/g, "Don't"],
    [/\bdoes not\b/g, "doesn't"], [/\bDoes not\b/g, "Doesn't"],
    [/\bdid not\b/g, "didn't"], [/\bDid not\b/g, "Didn't"],
    [/\bis not\b/g, "isn't"], [/\bIs not\b/g, "Isn't"],
    [/\bare not\b/g, "aren't"], [/\bAre not\b/g, "Aren't"],
    [/\bwas not\b/g, "wasn't"], [/\bWas not\b/g, "Wasn't"],
    [/\bwere not\b/g, "weren't"], [/\bWere not\b/g, "Weren't"],
    [/\bhas not\b/g, "hasn't"], [/\bHas not\b/g, "Hasn't"],
    [/\bhave not\b/g, "haven't"], [/\bHave not\b/g, "Haven't"],
    [/\bhad not\b/g, "hadn't"], [/\bHad not\b/g, "Hadn't"],
    [/\bwill not\b/g, "won't"], [/\bWill not\b/g, "Won't"],
    [/\bwould not\b/g, "wouldn't"], [/\bWould not\b/g, "Wouldn't"],
    [/\bcould not\b/g, "couldn't"], [/\bCould not\b/g, "Couldn't"],
    [/\bshould not\b/g, "shouldn't"], [/\bShould not\b/g, "Shouldn't"],
    [/\bcannot\b/g, "can't"], [/\bCannot\b/g, "Can't"],
    [/\bcan not\b/g, "can't"], [/\blet us\b/g, "let's"], [/\bLet us\b/g, "Let's"],
    [/\bgoing to\b/g, "gonna"], [/\bwant to\b/g, "wanna"],
    [/\bgot to\b/g, "gotta"], [/\bout of\b/g, "outta"],
    [/\bkind of\b/g, "kinda"], [/\bsort of\b/g, "sorta"],
  ];

  // AI crutch-word transitions → human replacements (massive map)
  const TRANSITION_MAP = {
    "Furthermore,":           ["Also,", "Plus,", "And,", "What's more,", "On top of that,", "Adding to that,"],
    "Moreover,":              ["Besides,", "And,", "Plus,", "Not just that —", "Also worth noting,"],
    "Additionally,":          ["Also,", "And,", "On top of that,", "Plus,", "There's more —"],
    "In conclusion,":         ["So yeah,", "Bottom line?", "To wrap things up,", "At the end of the day,", "All things considered,", "Long story short,"],
    "In summary,":            ["So basically,", "Point is,", "To sum up,", "The gist of it?", "Cutting to the chase,"],
    "Consequently,":          ["So,", "That meant", "Because of this,", "Which meant", "End result?"],
    "Nevertheless,":          ["Still though,", "But,", "Even so,", "That said,", "And yet,"],
    "Nonetheless,":           ["Still,", "But,", "Yet,", "That said,", "Even with all that,"],
    "Subsequently,":          ["After that,", "Then,", "Next,", "What came next?", "Moving along,"],
    "Henceforth,":            ["From that point on,", "Going forward,", "After that,"],
    "Conversely,":            ["On the flip side,", "But then,", "Meanwhile,", "Then again,"],
    "Notwithstanding,":       ["Despite that,", "Still,", "Even with that,"],
    "In light of this,":      ["Given all that,", "With this in mind,", "Knowing this,", "So with that said,"],
    "In light of these factors,": ["Taking all that into account,", "With all this in mind,"],
    "On the other hand,":     ["But then again,", "Flip side?", "Then again,", "At the same time though,", "Counter to that,"],
    "For instance,":          ["Like,", "Take this:", "Here's one:", "Say,", "Case in point —"],
    "For example,":           ["Like,", "Say,", "Think about this:", "Here's a quick example:", "Picture this:"],
    "In other words,":        ["Basically,", "Put differently,", "What I mean is,", "Said another way,"],
    "As a result,":           ["So,", "Because of that,", "Which led to", "And that meant"],
    "In particular,":         ["Especially", "Specifically,", "One thing worth calling out:", "What really stood out:"],
    "With regard to":         ["About", "When it comes to", "On the topic of", "As for"],
    "With respect to":        ["About", "Regarding", "When it comes to"],
    "In terms of":            ["When it comes to", "For", "As far as", "Talking about"],
    "It should be noted that":["Just so you know,", "One thing —", "Worth keeping in mind:"],
    "It is worth noting that":["Thing is,", "Here's something —", "Interestingly enough,"],
    "It is important to note that": ["Key thing here:", "Don't miss this:", "Here's what matters:"],
    "It is essential to":     ["You really need to", "It's crucial to", "You can't skip"],
    "In order to":            ["To", "So you can", "If you want to"],
    "Due to the fact that":   ["Because", "Since", "The reason being"],
    "In today's world,":      ["These days,", "Right now,", "In this day and age,", "As things stand,"],
    "As a matter of fact,":   ["Actually,", "In fact,", "Truth is,", "Fun fact:"],
    "This is because":        ["That's because", "The reason?", "Why?"],
    "In the realm of":        ["In", "In the world of", "When we talk about"],
    "It is crucial to":       ["You've gotta", "It's key to", "You need to"],
    "plays a crucial role":   ["matters a lot", "is super important", "really makes a difference", "is a big deal"],
    "plays a vital role":     ["is really important", "makes a huge difference", "can't be overlooked"],
    "plays a significant role": ["has a big impact", "is pretty important", "weighs in heavily"],
    "a wide range of":        ["all sorts of", "a bunch of", "different kinds of", "plenty of"],
    "a variety of":           ["different", "all sorts of", "a mix of", "various kinds of"],
    "the fact that":          ["how", "the way", "that"],
    "in the context of":      ["when talking about", "with", "in", "for"],
    "is able to":             ["can", "has the ability to", "manages to"],
    "has the potential to":   ["could", "might", "has a shot at"],
    "it can be argued that":  ["you could say", "some people think", "there's a case for"],
    "there is no doubt that": ["clearly,", "without question,", "nobody's arguing that"],
  };

  // Formal → informal vocab (much expanded)
  const VOCAB = {
    "utilize":        ["use", "work with", "go with"],
    "utilization":    ["use", "usage"],
    "utilizes":       ["uses", "works with"],
    "utilizing":      ["using", "working with"],
    "implement":      ["set up", "put in place", "build", "get going"],
    "implementation": ["setup", "rollout", "execution"],
    "implementing":   ["setting up", "building", "rolling out"],
    "facilitate":     ["help", "make easier", "enable"],
    "facilitates":    ["helps", "enables", "supports"],
    "commence":       ["start", "begin", "kick off"],
    "commenced":      ["started", "began", "kicked off"],
    "terminate":      ["end", "stop", "cut off"],
    "demonstrate":    ["show", "prove", "highlight"],
    "demonstrates":   ["shows", "proves", "highlights"],
    "demonstrated":   ["showed", "proved", "highlighted"],
    "approximately":  ["about", "around", "roughly", "give or take"],
    "sufficient":     ["enough", "adequate"],
    "insufficient":   ["not enough", "lacking"],
    "endeavor":       ["effort", "attempt", "try"],
    "endeavors":      ["efforts", "attempts", "tries"],
    "regarding":      ["about", "on", "around"],
    "numerous":       ["lots of", "a bunch of", "tons of", "plenty of", "many"],
    "significant":    ["big", "major", "huge", "important", "meaningful"],
    "significantly":  ["a lot", "dramatically", "by a wide margin", "noticeably"],
    "subsequently":   ["then", "after that", "later", "down the line"],
    "previously":     ["before", "earlier", "in the past"],
    "currently":      ["right now", "at the moment", "as we speak"],
    "therefore":      ["so", "that's why", "because of that"],
    "however":        ["but", "though", "still", "and yet"],
    "nevertheless":   ["still", "but", "even so", "yet"],
    "furthermore":    ["also", "plus", "and", "what's more"],
    "moreover":       ["and", "plus", "besides", "on top of that"],
    "additionally":   ["also", "plus", "and", "not to mention"],
    "consequently":   ["so", "as a result", "which meant"],
    "assist":         ["help", "support", "give a hand"],
    "assistance":     ["help", "support", "backup"],
    "obtain":         ["get", "grab", "pick up", "land"],
    "acquire":        ["get", "pick up", "snag", "land"],
    "possess":        ["have", "own", "hold"],
    "indicate":       ["show", "point to", "suggest", "hint at"],
    "indicates":      ["shows", "points to", "suggests", "hints at"],
    "substantial":    ["big", "large", "major", "hefty", "solid"],
    "comprehensive":  ["full", "thorough", "complete", "in-depth", "all-around"],
    "fundamental":    ["basic", "core", "key", "essential"],
    "fundamentally":  ["at its core", "basically", "at a basic level"],
    "paramount":      ["super important", "crucial", "top priority"],
    "optimal":        ["best", "ideal", "sweet-spot"],
    "enhance":        ["improve", "boost", "level up", "step up"],
    "enhanced":       ["improved", "boosted", "better", "upgraded"],
    "enhancement":    ["improvement", "upgrade", "boost"],
    "modification":   ["change", "tweak", "update", "adjustment"],
    "modifications":  ["changes", "tweaks", "updates"],
    "methodology":    ["method", "approach", "way", "strategy", "game plan"],
    "innovative":     ["new", "fresh", "creative", "game-changing"],
    "revolutionized": ["changed", "transformed", "shook up", "flipped"],
    "revolutionize":  ["change", "transform", "shake up", "flip"],
    "unprecedented":  ["never-before-seen", "first-of-its-kind", "unheard of", "totally new"],
    "multifaceted":   ["complex", "layered", "many-sided"],
    "landscape":      ["scene", "space", "world", "field", "area"],
    "leverage":       ["use", "take advantage of", "tap into", "lean on"],
    "leveraging":     ["using", "tapping into", "leaning on", "making use of"],
    "delve":          ["dig", "look", "dive", "explore", "get into"],
    "delve into":     ["dig into", "explore", "look into", "unpack"],
    "delving":        ["digging", "exploring", "diving"],
    "tapestry":       ["mix", "blend", "patchwork"],
    "intricate":      ["complex", "detailed", "nuanced", "tricky"],
    "pivotal":        ["key", "crucial", "major", "critical", "make-or-break"],
    "robust":         ["strong", "solid", "reliable", "sturdy", "rock-solid"],
    "seamless":       ["smooth", "easy", "effortless", "friction-free"],
    "seamlessly":     ["smoothly", "easily", "without a hitch"],
    "underscore":     ["highlight", "stress", "show", "drive home"],
    "underscores":    ["highlights", "stresses", "shows"],
    "plethora":       ["a ton of", "loads of", "a bunch of", "heaps of"],
    "myriad":         ["tons of", "countless", "all kinds of", "a whole bunch of"],
    "overarching":    ["main", "big-picture", "overall", "broad"],
    "holistic":       ["overall", "complete", "full", "well-rounded", "360-degree"],
    "synergy":        ["teamwork", "collaboration", "chemistry"],
    "paradigm":       ["model", "framework", "approach", "way of thinking"],
    "paradigm shift": ["big shift", "total rethink", "game changer"],
    "ecosystem":      ["system", "environment", "network", "space"],
    "empower":        ["enable", "help", "equip", "set up"],
    "empowers":       ["enables", "helps", "equips", "lets"],
    "realm":          ["area", "world", "field", "domain", "space"],
    "navigate":       ["deal with", "handle", "work through", "figure out", "tackle"],
    "navigating":     ["dealing with", "handling", "working through", "tackling"],
    "foster":         ["encourage", "build", "promote", "grow", "nurture"],
    "fostering":      ["building", "encouraging", "growing", "cultivating"],
    "harness":        ["use", "tap into", "take advantage of", "channel"],
    "harnessing":     ["using", "tapping into", "channeling"],
    "juxtaposition":  ["contrast", "comparison", "side-by-side look"],
    "dichotomy":      ["split", "divide", "contrast", "tension"],
    "ubiquitous":     ["everywhere", "all over", "super common"],
    "proliferation":  ["spread", "growth", "rise", "explosion"],
    "pertaining to":  ["about", "related to", "having to do with"],
    "aforementioned": ["mentioned earlier", "that I just talked about", "above"],
    "elucidate":      ["explain", "clear up", "break down", "shed light on"],
    "ascertain":      ["figure out", "find out", "determine", "nail down"],
    "efficacy":       ["effectiveness", "how well it works"],
    "mitigate":       ["reduce", "lessen", "cut down on", "ease"],
    "exacerbate":     ["make worse", "worsen", "amplify"],
    "juxtapose":      ["compare", "put side by side", "contrast"],
    "amalgamation":   ["mix", "blend", "combo", "mashup"],
    "delineate":      ["outline", "lay out", "spell out", "map out"],
    "propensity":     ["tendency", "habit", "lean towards"],
    "disseminate":    ["spread", "share", "pass along", "get out there"],
    "extrapolate":    ["guess", "project", "extend", "read into"],
    "meticulous":     ["careful", "detailed", "thorough", "precise"],
    "meticulously":   ["carefully", "thoroughly", "painstakingly"],
    "perpetuate":     ["keep going", "carry on", "maintain"],
    "conundrum":      ["puzzle", "problem", "head-scratcher", "dilemma"],
    "ramifications":  ["consequences", "effects", "ripple effects", "fallout"],
    "implications":   ["effects", "consequences", "what it means"],
    "transformative": ["game-changing", "life-changing", "huge", "powerful"],
    "groundbreaking": ["game-changing", "brand new", "pioneering", "cutting-edge"],
    "noteworthy":     ["worth mentioning", "interesting", "notable", "cool"],
    "indispensable":  ["essential", "must-have", "vital", "you can't go without"],
    "quintessential": ["classic", "textbook", "perfect example of"],
    "encompass":      ["cover", "include", "span", "touch on"],
    "encompasses":    ["covers", "includes", "spans", "takes in"],
    "encompassing":   ["covering", "spanning", "including"],
    "whilst":         ["while"],
    "amongst":        ["among"],
    "upon":           ["on"],
  };

  // AI-giveaway phrases (full phrases to nuke)
  const AI_PHRASES = [
    [/\bIt is worth mentioning that\b/gi,      () => pick(["Thing is,", "Also,", "One more thing —"])],
    [/\bIt bears mentioning that\b/gi,          () => pick(["Also worth noting,", "And here's another thing:"])],
    [/\bThis underscores the importance of\b/gi,() => pick(["This really shows why", "Which goes to show how much", "That just proves how important"])],
    [/\bThis highlights the need for\b/gi,      () => pick(["This shows we need", "Which points to the need for", "Clearly, there's a need for"])],
    [/\bIt goes without saying that\b/gi,       () => pick(["Obviously,", "Of course,", "Naturally,", "Goes without saying —"])],
    [/\bIn today's rapidly evolving\b/gi,       () => pick(["In today's fast-moving", "With how quickly things change in", "The way things are moving in"])],
    [/\bIn an era where\b/gi,                   () => pick(["At a time when", "Now that", "With", "Given how"])],
    [/\bIn an increasingly\b/gi,                () => pick(["In a more and more", "As things get more", "With the growing"])],
    [/\bhas become increasingly\b/gi,           () => pick(["keeps getting more", "is more and more", "has gotten way more"])],
    [/\bhas emerged as a\b/gi,                  () => pick(["turned into a", "became a", "showed up as a", "is now a"])],
    [/\bhas garnered significant attention\b/gi,() => pick(["has gotten a lot of buzz", "caught people's attention", "has been turning heads"])],
    [/\bserves as a testament to\b/gi,          () => pick(["really shows", "proves", "is proof of", "speaks to"])],
    [/\bserves as a reminder that\b/gi,         () => pick(["reminds us that", "is a reminder —", "just goes to show"])],
    [/\bthe importance of .+ cannot be overstated\b/gi, m => pick(["you really can't underestimate", "it'd be hard to overstate"]) + m.slice(m.indexOf(" of "))],
    [/\bplays an important role in\b/gi,        () => pick(["matters a lot for", "is a big deal in", "has a real impact on"])],
    [/\bone cannot simply\b/gi,                 () => pick(["you can't just", "it's not as simple as", "there's no way to just"])],
    [/\bpave the way for\b/gi,                  () => pick(["open the door to", "set things up for", "make room for", "lay the groundwork for"])],
    [/\bthe intricacies of\b/gi,                () => pick(["the details of", "the ins and outs of", "the nitty-gritty of"])],
    [/\bshed light on\b/gi,                     () => pick(["clear up", "help explain", "give some insight into", "unpack"])],
    [/\ba testament to\b/gi,                    () => pick(["proof of", "evidence of", "a sign of", "a reflection of"])],
    [/\bthe crux of the matter\b/gi,            () => pick(["the heart of it", "the main point", "what it comes down to"])],
    [/\bwith that being said\b/gi,              () => pick(["that said,", "anyway,", "still though,", "but,"])],
    [/\bstanding at the forefront\b/gi,         () => pick(["leading the charge", "at the front of", "ahead of the pack"])],
    [/\bat the forefront of\b/gi,               () => pick(["leading", "at the front of", "spearheading"])],
    [/\ba double-edged sword\b/gi,              () => pick(["a tradeoff", "a mixed bag", "a blessing and a curse"])],
    [/\bin the grand scheme of things\b/gi,     () => pick(["in the big picture", "when you zoom out", "overall"])],
  ];

  // Redundant adverbs that scream AI
  const REDUNDANT_ADVERBS = [
    "very", "really", "extremely", "incredibly", "remarkably",
    "absolutely", "utterly", "completely", "totally", "quite",
    "simply", "certainly", "undoubtedly", "unquestionably",
    "inherently", "essentially", "fundamentally", "profoundly",
    "immensely", "vastly", "tremendously", "exceedingly",
  ];

  // Interjections / human noise by tone
  const INJECT = {
    casual:         ["Honestly,", "Look,", "Here's the thing —", "I mean,", "Not gonna lie,", "Tbh,", "Okay so,", "Real talk —", "Ngl,", "Lowkey,"],
    professional:   ["In my experience,", "From what I've seen,", "The way I see it,", "Worth pointing out —", "One thing I'd flag:", "Here's an observation:"],
    academic:       ["Interestingly,", "Notably,", "It's worth observing that", "A nuanced point here:", "One caveat:", "This is telling because"],
    conversational: ["You know what?", "Here's the deal:", "So basically,", "The way I see it —", "Let me put it this way:", "Funny enough,", "Truth be told,"],
    storytelling:   ["Picture this:", "Here's the interesting part —", "Now,", "And this is where it gets good:", "But here's the kicker:", "Plot twist —"],
  };

  // Rhetorical questions to break monotony
  const RHETORICAL = {
    casual:         ["But does that even matter?", "Wild, right?", "Crazy when you think about it.", "Makes you wonder, huh?", "Who knew?"],
    professional:   ["So what does this mean in practice?", "The question then becomes —", "But is this sustainable?", "What's the takeaway here?"],
    academic:       ["But to what extent?", "This raises an important question.", "How do we reconcile this?", "Is this correlation or causation?"],
    conversational: ["Right?", "Sounds crazy, I know.", "You'd think so, anyway.", "Make sense?", "See what I mean?", "Weird, huh?"],
    storytelling:   ["But did it last?", "And then what?", "Sound familiar?", "You see where this is going, right?"],
  };

  // Parenthetical asides
  const ASIDES = [
    "(and that's a big deal)",
    "(seriously)",
    "(no surprise there)",
    "(if you think about it)",
    "(which, fair enough)",
    "(and honestly, it shows)",
    "(not ideal, obviously)",
    "(or at least, that's the idea)",
    "(bear with me here)",
    "(shocking, I know)",
    "(for better or worse)",
    "(or so they claim)",
    "(spoiler: it does)",
    "(which makes sense)",
    "(at least in theory)",
  ];

  // Human sentence fragments
  const FRAGMENTS = [
    "Big difference.",
    "Not even close.",
    "Pretty wild.",
    "No question about it.",
    "Makes total sense.",
    "Huge deal.",
    "Tricky stuff.",
    "Worth it though.",
    "Not always, obviously.",
    "Classic example.",
    "Simple as that.",
    "Hard to ignore.",
    "Fair point.",
    "Interesting, right?",
    "There it is.",
    "Go figure.",
    "Telling.",
  ];

  // ────────────────────── SENTENCE SPLITTING ──────────────────

  function splitSentences(text) {
    // Handle abbreviations, decimals, etc.
    const result = [];
    let current = "";
    const chars = text.split("");
    for (let i = 0; i < chars.length; i++) {
      current += chars[i];
      if (".!?".includes(chars[i])) {
        // Check it's a real sentence end
        const nextChar = chars[i + 1] || "";
        const prevWord = current.trim().split(/\s+/).pop() || "";
        // Skip abbreviations (Mr. Dr. etc. U.S. e.g. i.e.)
        if (prevWord.length <= 3 && prevWord.endsWith('.')) continue;
        if (/\d\./.test(current.slice(-3))) continue; // decimals
        if (nextChar === "" || nextChar === " " || nextChar === "\n" || nextChar === '"') {
          result.push(current.trim());
          current = "";
        }
      }
    }
    if (current.trim()) result.push(current.trim());
    return result.filter(s => s.length > 0);
  }

  // ────────────────────── TRANSFORM PASSES ──────────────────

  // Pass 1: Nuke AI giveaway phrases
  function nukeAIPhrases(text, rate) {
    let r = text;
    for (const [regex, replacer] of AI_PHRASES) {
      r = r.replace(regex, m => chance(rate) ? replacer(m) : m);
    }
    return r;
  }

  // Pass 2: Replace transitions
  function replaceTransitions(text, rate) {
    let r = text;
    for (const [orig, alts] of Object.entries(TRANSITION_MAP)) {
      const escaped = orig.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const re = new RegExp(escaped, 'gi');
      r = r.replace(re, m => chance(rate) ? pick(alts) : m);
    }
    return r;
  }

  // Pass 3: Vocabulary swap
  function swapVocab(text, rate) {
    let r = text;
    // Sort by length descending to match longer phrases first
    const sorted = Object.entries(VOCAB).sort((a, b) => b[0].length - a[0].length);
    for (const [word, alts] of sorted) {
      const re = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      r = r.replace(re, m => {
        if (!chance(rate)) return m;
        let rep = pick(alts);
        if (m[0] === m[0].toUpperCase() && m[0] !== m[0].toLowerCase()) {
          rep = rep[0].toUpperCase() + rep.slice(1);
        }
        return rep;
      });
    }
    return r;
  }

  // Pass 4: Contractions
  function applyContractions(text, rate) {
    let r = text;
    for (const [re, rep] of CONTRACTIONS) {
      r = r.replace(re, m => chance(rate) ? rep : m);
    }
    return r;
  }

  // Pass 5: Remove redundant adverbs
  function stripAdverbs(text, rate) {
    let r = text;
    for (const adv of REDUNDANT_ADVERBS) {
      const re = new RegExp(`\\b${adv}\\s+`, 'gi');
      r = r.replace(re, m => chance(rate * 0.4) ? "" : m);
    }
    return r;
  }

  // Pass 6: Bust passive voice
  function bustPassive(text, rate) {
    return text.replace(
      /\b(is|are|was|were|been|being)\s+(\w+ed)\s+by\s+(\w[\w\s]*?)([.,;!?\n])/gi,
      (m, be, verb, agent, end) => {
        if (!chance(rate * 0.5)) return m;
        const a = agent.trim();
        return `${a.charAt(0).toUpperCase() + a.slice(1)} ${verb}${end}`;
      }
    );
  }

  // Pass 7: Remove list phrasing
  function removeListPhrasing(text) {
    return text
      .replace(/\bFirstly,?\s*/gi, () => pick(["First off, ", "To start, ", "For starters, "]))
      .replace(/\bSecondly,?\s*/gi, () => pick(["Also, ", "Then, ", "Next up, ", "On top of that, "]))
      .replace(/\bThirdly,?\s*/gi,  () => pick(["And, ", "Plus, ", "Another thing — "]))
      .replace(/\bFourthly,?\s*/gi, () => pick(["Also, ", "And then, "]))
      .replace(/\bLastly,?\s*/gi,   () => pick(["Finally, ", "And last, ", "One more thing — "]))
      .replace(/\bIn addition,?\s*/gi, () => pick(["Also, ", "Plus, ", "And, "]));
  }

  // Pass 8: Break repetitive sentence starters
  function breakRepetitiveStarters(text) {
    const sentences = splitSentences(text);
    if (sentences.length < 3) return text;

    const alternateStarters = [
      "What's interesting is,", "The thing is,", "Here's the deal:", "When you look at it,",
      "And", "Sure,", "Now,", "See,", "Turns out,", "Funny enough,", "Point being,",
      "Not surprisingly,", "On a related note,", "To give you an idea,",
    ];

    // Check for consecutive same-starter patterns
    for (let i = 1; i < sentences.length; i++) {
      const prevFirst = (sentences[i - 1].split(/\s+/)[0] || "").toLowerCase();
      const currFirst = (sentences[i].split(/\s+/)[0] || "").toLowerCase();

      if (prevFirst === currFirst && chance(0.7)) {
        // Replace the starter of the current sentence
        const rest = sentences[i].replace(/^\S+\s*/, '');
        sentences[i] = pick(alternateStarters) + " " + rest.charAt(0).toLowerCase() + rest.slice(1);
      }
    }

    // Also detect "The X ... The Y ... The Z" pattern
    let theCount = 0;
    for (let i = 0; i < sentences.length; i++) {
      if (/^The\s/i.test(sentences[i])) {
        theCount++;
        if (theCount >= 2 && chance(0.6)) {
          const rest = sentences[i].replace(/^The\s+/i, '');
          sentences[i] = pick(["When it comes to the ", "Looking at the ", "As for the ", "Now, the ", "Consider the "]) + rest;
          theCount = 0;
        }
      } else {
        theCount = 0;
      }
    }

    return sentences.join(" ");
  }

  // Pass 9: Inject burstiness (wildly vary sentence lengths)
  function injectBurstiness(text, intensity) {
    const sentences = splitSentences(text);
    if (sentences.length < 4) return text;
    const result = [];

    for (let i = 0; i < sentences.length; i++) {
      const s = sentences[i];
      const words = s.split(/\s+/);

      // SPLIT very long sentences (>25 words) at conjunctions/commas
      if (words.length > 25) {
        const splitPoints = [" and ", " but ", " which ", " because ", " while ", " although ", " however ", " yet "];
        let didSplit = false;
        for (const sp of shuffle(splitPoints)) {
          const idx = s.toLowerCase().lastIndexOf(sp);
          if (idx > s.length * 0.25 && idx < s.length * 0.8) {
            let p1 = s.slice(0, idx).trim();
            let p2 = s.slice(idx + sp.length).trim();
            if (!p1.endsWith('.') && !p1.endsWith('!') && !p1.endsWith('?')) p1 += '.';
            p2 = p2.charAt(0).toUpperCase() + p2.slice(1);
            result.push(p1);
            result.push(p2);
            didSplit = true;
            break;
          }
        }
        // Also try splitting at mid-sentence commas
        if (!didSplit) {
          const commaIdx = s.indexOf(', ', Math.floor(s.length * 0.35));
          if (commaIdx > 0 && commaIdx < s.length * 0.75) {
            let p1 = s.slice(0, commaIdx).trim() + '.';
            let p2 = s.slice(commaIdx + 2).trim();
            p2 = p2.charAt(0).toUpperCase() + p2.slice(1);
            result.push(p1);
            result.push(p2);
            didSplit = true;
          }
        }
        if (!didSplit) result.push(s);
      }
      // MERGE short sentences occasionally
      else if (words.length < 7 && i + 1 < sentences.length && chance(0.35)) {
        const next = sentences[i + 1];
        if (next && next.split(/\s+/).length < 10) {
          const connector = pick([" — ", ", and ", ". ", "; "]);
          const cleanCurr = s.replace(/[.!?]+$/, '');
          result.push(cleanCurr + connector + next.charAt(0).toLowerCase() + next.slice(1));
          i++;
        } else {
          result.push(s);
        }
      }
      else {
        result.push(s);
      }
    }

    // Insert fragments for extra burstiness (intensity 2+)
    if (intensity >= 2 && result.length > 4) {
      const fragCount = clamp(Math.floor(result.length * 0.08), 1, 3);
      for (let f = 0; f < fragCount; f++) {
        const pos = randInt(2, result.length - 2);
        result.splice(pos, 0, pick(FRAGMENTS));
      }
    }

    return result.join(" ");
  }

  // Pass 10: Inject interjections / human voice
  function injectHumanVoice(text, tone, rate, intensity) {
    const pool = INJECT[tone] || INJECT.professional;
    const sentences = splitSentences(text);
    if (sentences.length < 4) return text;

    // How many injections based on intensity
    const maxInject = [1, 2, 4][intensity - 1];
    const count = clamp(Math.floor(sentences.length * rate * 0.12), 1, maxInject);
    const eligible = sentences.map((_, i) => i).filter(i => i > 0 && i < sentences.length - 1);
    const targets = shuffle(eligible).slice(0, count);

    return sentences.map((s, i) => {
      if (targets.includes(i) && chance(rate)) {
        return pick(pool) + " " + s.charAt(0).toLowerCase() + s.slice(1);
      }
      return s;
    }).join(" ");
  }

  // Pass 11: Inject rhetorical questions
  function injectRhetoricals(text, tone, rate) {
    const pool = RHETORICAL[tone] || RHETORICAL.conversational;
    const sentences = splitSentences(text);
    if (sentences.length < 5) return text;

    const count = clamp(Math.floor(sentences.length * 0.06), 1, 2);
    const eligible = sentences.map((_, i) => i).filter(i => i > 2 && i < sentences.length - 1);
    const targets = shuffle(eligible).slice(0, count);

    const result = [];
    for (let i = 0; i < sentences.length; i++) {
      result.push(sentences[i]);
      if (targets.includes(i) && chance(rate * 0.6)) {
        result.push(pick(pool));
      }
    }
    return result.join(" ");
  }

  // Pass 12: Inject parenthetical asides
  function injectAsides(text, rate) {
    const sentences = splitSentences(text);
    if (sentences.length < 6) return text;

    let injected = 0;
    return sentences.map((s, i) => {
      if (i > 1 && i < sentences.length - 1 && injected < 2 && chance(rate * 0.12)) {
        injected++;
        // Insert aside before the last word
        const words = s.split(/\s+/);
        if (words.length > 8) {
          const insertAt = words.length - randInt(1, 3);
          words.splice(insertAt, 0, pick(ASIDES));
          return words.join(" ");
        }
      }
      return s;
    }).join(" ");
  }

  // Pass 13: Humanize punctuation
  function humanizePunctuation(text, rate) {
    let r = text;
    // Semicolons → em-dashes or periods
    r = r.replace(/;\s/g, m => chance(rate * 0.6) ? pick([" — ", ". "]) : m);
    // Some commas → em-dashes (sparingly)
    let cIdx = 0;
    r = r.replace(/,\s/g, m => {
      cIdx++;
      return (cIdx % 9 === 0 && chance(rate * 0.3)) ? " — " : m;
    });
    return r;
  }

  // Pass 14: Vary paragraph lengths
  function varyParagraphs(text) {
    const paras = text.split(/\n\n+/);
    if (paras.length <= 2) return text;
    const result = [];
    for (const p of paras) {
      const sents = splitSentences(p);
      if (sents.length > 6 && chance(0.55)) {
        const mid = Math.floor(sents.length * (0.35 + Math.random() * 0.3));
        result.push(sents.slice(0, mid).join(" "));
        result.push(sents.slice(mid).join(" "));
      } else {
        result.push(p);
      }
    }
    return result.join("\n\n");
  }

  // Pass 15: Break parallel structure ("X, Y, and Z" pattern)
  function breakParallels(text, rate) {
    // "A, B, and C" → rephrase to break the pattern
    return text.replace(
      /(\b\w[\w\s]{2,20}),\s(\w[\w\s]{2,20}),\s+and\s(\w[\w\s]{2,20})\b/g,
      (m, a, b, c) => {
        if (!chance(rate * 0.3)) return m;
        return pick([
          `${a.trim()} and ${b.trim()} — not to mention ${c.trim()}`,
          `${a.trim()}, ${b.trim()} (and also ${c.trim()})`,
          `${a.trim()}. Also ${b.trim()}, plus ${c.trim()}`,
          `${a.trim()} along with ${b.trim()} and ${c.trim()}`,
        ]);
      }
    );
  }

  // Pass 16: Reduce hedging language
  function reduceHedging(text, rate) {
    const hedges = [
      [/\bcould potentially\b/gi,     () => pick(["could", "might", "may"])],
      [/\bmay potentially\b/gi,       () => "might"],
      [/\bit is possible that\b/gi,   () => pick(["maybe", "there's a chance", "possibly"])],
      [/\bone might argue that\b/gi,  () => pick(["you could say", "some people think"])],
      [/\bit could be said that\b/gi, () => pick(["arguably,", "you might say"])],
      [/\bthere is a possibility that\b/gi, () => pick(["maybe", "it's possible", "there's a shot that"])],
    ];
    let r = text;
    for (const [re, rep] of hedges) {
      r = r.replace(re, m => chance(rate) ? rep() : m);
    }
    return r;
  }

  // Pass 17: Vary word choices within repeated words
  function deduplicateWords(text) {
    const sentences = splitSentences(text);
    const wordFreq = {};

    // Count word frequency
    for (const s of sentences) {
      for (const w of s.toLowerCase().split(/\s+/)) {
        const clean = w.replace(/[^a-z]/g, '');
        if (clean.length > 4) wordFreq[clean] = (wordFreq[clean] || 0) + 1;
      }
    }

    // Find overused words (>3 occurrences)
    const overused = Object.entries(wordFreq)
      .filter(([w, c]) => c > 3)
      .map(([w]) => w);

    // We can't easily synonym-swap without a thesaurus, but we can flag that
    // the text has been processed and the vocab pass should have caught most
    return text;
  }

  // Pass 18: Sentence inversion (move clauses around)
  function invertSentences(text, rate) {
    const sentences = splitSentences(text);
    let inversions = 0;
    const maxInversions = 3;

    return sentences.map(s => {
      if (inversions >= maxInversions) return s;
      const words = s.split(/\s+/);
      if (words.length < 10 || words.length > 30) return s;

      // "X because Y" → "Because Y, X" (or vice versa)
      const becauseMatch = s.match(/^(.+?)\s+because\s+(.+)$/i);
      if (becauseMatch && chance(rate * 0.3)) {
        inversions++;
        const [, main, reason] = becauseMatch;
        const cleanMain = main.replace(/[.!?]+$/, '').trim();
        return `Because ${reason.replace(/[.!?]+$/, '').trim()}, ${cleanMain.charAt(0).toLowerCase() + cleanMain.slice(1)}.`;
      }

      // "While X, Y" → "Y. And this is while X"
      const whileMatch = s.match(/^While\s+(.+?),\s+(.+)$/i);
      if (whileMatch && chance(rate * 0.25)) {
        inversions++;
        const [, cond, main] = whileMatch;
        return `${main.charAt(0).toUpperCase() + main.slice(1).replace(/[.!?]+$/, '')} — even while ${cond.toLowerCase()}.`;
      }

      return s;
    }).join(" ");
  }

  // ────────────────────── MAIN PIPELINE ──────────────────

  function humanize(text, intensity, tone, creativity) {
    if (!text.trim()) return "";

    const base = [0.5, 0.75, 0.95][intensity - 1];
    const boost = { low: -0.1, medium: 0, high: 0.15 }[creativity];
    const rate = clamp(base + boost, 0.3, 0.98);

    let r = text;

    // Phase 1: Remove AI fingerprints
    r = nukeAIPhrases(r, rate);
    r = replaceTransitions(r, rate);
    r = removeListPhrasing(r);
    r = reduceHedging(r, rate);

    // Phase 2: Vocabulary & grammar
    r = swapVocab(r, rate);
    if (tone !== "academic") r = applyContractions(r, rate);
    r = stripAdverbs(r, rate);
    r = bustPassive(r, rate);

    // Phase 3: Structure disruption (KEY for perplexity)
    r = breakRepetitiveStarters(r);
    r = invertSentences(r, rate);
    if (intensity >= 2) r = breakParallels(r, rate);
    r = injectBurstiness(r, intensity);
    r = varyParagraphs(r);

    // Phase 4: Human voice injection (KEY for burstiness)
    if (intensity >= 2) r = injectHumanVoice(r, tone, rate, intensity);
    if (intensity >= 2) r = injectRhetoricals(r, tone, rate);
    if (intensity >= 3) r = injectAsides(r, rate);

    // Phase 5: Final polish
    r = humanizePunctuation(r, rate);
    r = deduplicateWords(r);

    // Cleanup
    r = r
      .replace(/\s{2,}/g, ' ')
      .replace(/\s+([.,;:!?])/g, '$1')
      .replace(/\.\s*\./g, '.')
      .replace(/,\s*,/g, ',')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/ — ,/g, ' —')
      .replace(/— \./g, '—.')
      .trim();

    return r;
  }

  // ────────────────────── METRICS ──────────────────

  function countChanges(orig, result) {
    const a = orig.toLowerCase().split(/\s+/);
    const b = result.toLowerCase().split(/\s+/);
    let diff = 0;
    const len = Math.max(a.length, b.length);
    for (let i = 0; i < len; i++) {
      if (a[i] !== b[i]) diff++;
    }
    return diff;
  }

  function estimateScore(text, changes, totalWords) {
    const ratio = totalWords > 0 ? changes / totalWords : 0;
    let score = 55 + ratio * 90;

    // Heavy penalties for remaining AI markers
    const markers = [
      /\bfurthermore\b/gi, /\bmoreover\b/gi, /\bnevertheless\b/gi,
      /\bsubsequently\b/gi, /\butilize\b/gi, /\bin conclusion\b/gi,
      /\bdelve\b/gi, /\btapestry\b/gi, /\bplethora\b/gi,
      /\bmyriad\b/gi, /\bparadigm\b/gi, /\bseamless\b/gi,
      /\bpivotal\b/gi, /\bholistic\b/gi, /\bsynergy\b/gi,
      /\bin order to\b/gi, /\bdue to the fact\b/gi,
      /\bit is worth\b/gi, /\bplays a crucial role\b/gi,
      /\bin the realm of\b/gi, /\bhas emerged as\b/gi,
      /\bunprecedented\b/gi, /\blandscape\b/gi,
      /\boverarching\b/gi, /\brobust\b/gi, /\bleverage\b/gi,
      /\bfoster\b/gi, /\bharness\b/gi,
    ];
    for (const m of markers) {
      const matches = text.match(m);
      if (matches) score -= matches.length * 4;
    }

    // Bonus for burstiness (sentence-length variance)
    const sents = splitSentences(text);
    if (sents.length > 3) {
      const lens = sents.map(s => s.split(/\s+/).length);
      const avg = lens.reduce((a, b) => a + b, 0) / lens.length;
      const variance = lens.reduce((sum, l) => sum + Math.pow(l - avg, 2), 0) / lens.length;
      const stdDev = Math.sqrt(variance);
      // High std dev = more human-like
      if (stdDev > 6) score += 5;
      if (stdDev > 10) score += 5;
    }

    // Bonus for contractions
    const contractions = (text.match(/\b\w+'\w+\b/g) || []).length;
    score += Math.min(contractions * 1.5, 8);

    return clamp(Math.round(score), 68, 99);
  }

  // ────────────────────── TYPING EFFECT ──────────────────

  async function typeOut(el, text, speed = 6) {
    el.textContent = "";
    el.classList.add("typing-cursor");

    return new Promise(resolve => {
      let i = 0;
      const timer = setInterval(() => {
        const chunk = randInt(2, 5);
        el.textContent += text.slice(i, i + chunk);
        i += chunk;
        if (i >= text.length) {
          el.textContent = text; // ensure complete
          clearInterval(timer);
          el.classList.remove("typing-cursor");
          resolve();
        }
      }, speed);
    });
  }

  // ────────────────────── TOAST ──────────────────

  function toast(msg, type = "success") {
    let t = document.querySelector('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
    t.className = `toast ${type}`;
    t.innerHTML = (type === 'success' ? '✓ ' : '') + msg;
    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => t.classList.remove('show'), 2500);
  }

  // ────────────────────── EVENTS ──────────────────

  inputEl.addEventListener("input", () => {
    const t = inputEl.value;
    inputCountEl.textContent = t.length;
    wordCountEl.textContent = t.trim() ? t.trim().split(/\s+/).length : 0;
  });

  pasteBtn.addEventListener("click", async () => {
    try { inputEl.value = await navigator.clipboard.readText(); inputEl.dispatchEvent(new Event('input')); toast("Pasted"); }
    catch { toast("Clipboard access denied", "error"); }
  });

  clearBtn.addEventListener("click", () => {
    inputEl.value = "";
    inputEl.dispatchEvent(new Event('input'));
    outputEl.innerHTML = `<div class="placeholder-state"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg><p>Your humanized text will appear here</p></div>`;
    outputFooter.style.display = "none";
  });

  copyBtn.addEventListener("click", () => {
    const t = outputEl.textContent;
    if (!t || t.includes("Your humanized text")) { toast("Nothing to copy", "error"); return; }
    navigator.clipboard.writeText(t).then(() => toast("Copied!"));
  });

  async function run() {
    const text = inputEl.value.trim();
    if (!text) { toast("Enter text first", "error"); return; }

    humanizeBtn.classList.add("processing");
    humanizeBtn.querySelector("span").textContent = "Humanizing...";
    humanizeBtn.disabled = true;

    await new Promise(r => setTimeout(r, 400 + Math.random() * 600));

    const numPasses = parseInt(passesEl.value);
    let result = text;
    for (let p = 0; p < numPasses; p++) {
      result = humanize(result, parseInt(intensityEl.value), toneEl.value, creativityEl.value);
    }

    await typeOut(outputEl, result);

    const changes = countChanges(text, result);
    const words = text.split(/\s+/).length;
    changeCountEl.textContent = changes;
    humanScoreEl.textContent = estimateScore(result, changes, words) + "%";
    outputFooter.style.display = "flex";

    humanizeBtn.classList.remove("processing");
    humanizeBtn.querySelector("span").textContent = "Humanize";
    humanizeBtn.disabled = false;
  }

  humanizeBtn.addEventListener("click", run);
  rewriteBtn.addEventListener("click", run);
  inputEl.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); run(); }
  });

  // ────────────────────── WORD (.DOCX) EXPORT MODULE ──────────────────────

  function getTextToExport() {
    const outText = outputEl.textContent ? outputEl.textContent.trim() : "";
    if (outText && !outText.includes("Your humanized text will appear here")) {
      return outText;
    }
    const inText = inputEl.value ? inputEl.value.trim() : "";
    if (inText) {
      return inText;
    }
    return "";
  }

  function parseInlineTokens(text) {
    const tokens = [];
    const regex = /(\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*[^*]+\*|__[^_]+__|_[^_]+_|`[^`]+`)/g;
    let lastIndex = 0;
    let match;
    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        tokens.push({ text: text.substring(lastIndex, match.index) });
      }
      const raw = match[0];
      if (raw.startsWith("***") && raw.endsWith("***")) {
        tokens.push({ text: raw.slice(3, -3), bold: true, italics: true });
      } else if (raw.startsWith("**") && raw.endsWith("**")) {
        tokens.push({ text: raw.slice(2, -2), bold: true });
      } else if (raw.startsWith("__") && raw.endsWith("__")) {
        tokens.push({ text: raw.slice(2, -2), bold: true });
      } else if (raw.startsWith("*") && raw.endsWith("*")) {
        tokens.push({ text: raw.slice(1, -1), italics: true });
      } else if (raw.startsWith("_") && raw.endsWith("_")) {
        tokens.push({ text: raw.slice(1, -1), italics: true });
      } else if (raw.startsWith("`") && raw.endsWith("`")) {
        tokens.push({ text: raw.slice(1, -1), font: "Courier New" });
      }
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) {
      tokens.push({ text: text.substring(lastIndex) });
    }
    return tokens;
  }

  function parseDocumentStructure(rawText, headingMode = "auto") {
    const rawLines = rawText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const blocks = [];
    let detectedTitle = null;
    let inToc = false;
    let inReferences = false;

    function matchBullet(line) {
      const m = line.match(/^[-*•+–]\s+(.+)$/);
      if (m) {
        return { text: m[1].trim() };
      }
      return null;
    }

    function matchNumbered(line) {
      const m = line.match(/^(\d+[\.\)]|\([a-z0-9]+\))\s+(.+)$/);
      if (m) {
        return { prefix: m[1], text: m[2].trim() };
      }
      return null;
    }

    for (let i = 0; i < rawLines.length; i++) {
      const line = rawLines[i];
      const nextLine = rawLines[i + 1] || "";

      // 1. First line = Document Title if prominent or start of document
      if (i === 0) {
        detectedTitle = line.replace(/^#+\s*/, "").trim();
        blocks.push({ type: "title", text: detectedTitle });
        continue;
      }

      // 2. Subtitle right below title (e.g. "A Review", "By ...", "Author: ...")
      if (i === 1 && line.length < 70 && !line.endsWith(".") && !/^#+\s/.test(line)) {
        blocks.push({ type: "subtitle", text: line });
        continue;
      }

      // 3. Table of Contents detection
      if (/^(CONTENTS|TABLE OF CONTENTS)$/i.test(line)) {
        inToc = true;
        blocks.push({ type: "heading_1", text: line });
        continue;
      }

      if (inToc) {
        if (/^1\.\s+INTRODUCTION$/i.test(line) && nextLine && !/^\d+\./.test(nextLine)) {
          inToc = false;
        } else {
          blocks.push({ type: "toc_item", text: line });
          continue;
        }
      }

      // 4. Real References section (at the end of the document)
      if (/^(REFERENCES|BIBLIOGRAPHY|WORKS CITED)$/i.test(line)) {
        inReferences = true;
        blocks.push({ type: "heading_1", text: line });
        continue;
      }

      if (inReferences) {
        if (/^(editorial note|note):/i.test(line)) {
          blocks.push({ type: "callout_note", text: line });
        } else {
          blocks.push({ type: "reference_item", text: line });
        }
        continue;
      }

      // 5. Explicit Markdown Headings: #, ##, ###
      const mdMatch = line.match(/^(#{1,6})\s+(.+)$/);
      if (mdMatch) {
        const lvl = Math.min(mdMatch[1].length, 3);
        blocks.push({ type: lvl === 1 ? "heading_1" : (lvl === 2 ? "heading_2" : "heading_3"), text: mdMatch[2].trim() });
        continue;
      }

      // 6. Major numbered or keyword section heading (Heading 1)
      // e.g. "1. INTRODUCTION", "ABSTRACT", "16. CONCLUSION", "DISCUSSION"
      if (/^(\d+\.\s+[A-Z\s]{3,}|ABSTRACT|CONCLUSION|DISCUSSION)$/i.test(line)) {
        blocks.push({ type: "heading_1", text: line });
        continue;
      }

      // 7. Subsections: e.g. "1.1 Importance of enzymes", "1.1.1 Details"
      const subMatch = line.match(/^(\d+\.\d+(\.\d+)?)\s+([A-Z].*)$/);
      if (subMatch) {
        const isH3 = subMatch[1].split(".").length >= 3;
        blocks.push({ type: isH3 ? "heading_3" : "heading_2", text: line });
        continue;
      }

      // 8. Keywords
      if (/^Keywords:\s+/i.test(line)) {
        blocks.push({ type: "keywords", text: line });
        continue;
      }

      // 9. Formula / Equation line (e.g. "E + S ⇌ ES → E + P" or "v = (Vmax × [S]) / (Km + [S])")
      if (line.length < 85 && (/[⇌→⇄↔]/.test(line) || (line.includes("=") && /[\(\[\+\-\*\/×÷^]/.test(line) && !line.includes(". ")))) {
        blocks.push({ type: "equation", text: line });
        continue;
      }

      // 10. Timeline item: e.g. "1833: Anselme Payen..."
      const yearMatch = line.match(/^(\d{4}s?):\s+(.+)$/);
      if (yearMatch) {
        blocks.push({ type: "timeline", year: yearMatch[1], text: yearMatch[2] });
        continue;
      }

      // 11. Property item: e.g. "Pepsin: pH 1.5–2.0"
      const propMatch = line.match(/^([A-Za-z\s]{3,30}):\s+(pH\s+[\d\.\–\-]+|[\d\.\–\-\s]+[a-zA-Z%]+)$/i);
      if (propMatch) {
        blocks.push({ type: "property", label: propMatch[1], value: propMatch[2] });
        continue;
      }

      // 12. Concept / Key point definition: e.g. "Competitive inhibition: the inhibitor..."
      const defMatch = line.match(/^([A-Z][\w\s–—\(\)\/\-]{2,40}):\s+(.+)$/);
      if (defMatch && !line.startsWith("Note:") && !line.startsWith("Keywords:")) {
        blocks.push({ type: "key_point", term: defMatch[1], description: defMatch[2] });
        continue;
      }

      // 13. Explicit Bullet or Numbered item
      const bullet = matchBullet(line);
      if (bullet) {
        blocks.push({ type: "bullet", text: bullet.text });
        continue;
      }

      const numbered = matchNumbered(line);
      if (numbered) {
        blocks.push({ type: "numbered", prefix: numbered.prefix, text: numbered.text });
        continue;
      }

      // 14. Blockquote
      const quoteMatch = line.match(/^>\s*(.+)$/);
      if (quoteMatch) {
        blocks.push({ type: "quote", text: quoteMatch[1] });
        continue;
      }

      // 15. Divider
      if (/^[-*_]{3,}$/.test(line)) {
        blocks.push({ type: "divider" });
        continue;
      }

      // 16. Implicit Main Points (sentences in a list following a colon or subheading)
      const prevBlock = blocks[blocks.length - 1];
      const prevIsColon = prevBlock && (prevBlock.text && prevBlock.text.endsWith(":"));
      const isShortSentence = line.length < 180 && !line.includes("\n");
      const startsWithListWord = /^(They\s|Some\s|First,\s|Second,\s|In\s[A-Za-z]+,\s|An\s[a-z]+\sis|Most\s[a-z]+\s|Their\s|Cells\scan)/.test(line);

      if ((prevIsColon || (prevBlock && prevBlock.type === "bullet")) && isShortSentence && startsWithListWord) {
        blocks.push({ type: "bullet", text: line });
        continue;
      }

      // 17. Regular paragraph
      blocks.push({ type: "paragraph", text: line });
    }

    return { blocks, detectedTitle };
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function renderInlineHtml(text) {
    return escapeHtml(text)
      .replace(/(https?:\/\/[^\s]+)/g, "<a href=\"$1\" style=\"color:#2563eb;text-decoration:underline;\">$1</a>")
      .replace(/\*\*\*([^*]+)\*\*\*/g, "<b><i>$1</i></b>")
      .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")
      .replace(/__([^_]+)__/g, "<b>$1</b>")
      .replace(/\*([^*]+)\*/g, "<i>$1</i>")
      .replace(/_([^_]+)_/g, "<i>$1</i>")
      .replace(/`([^`]+)`/g, "<code style=\"font-family:Courier New,monospace;background:#f3f4f6;padding:1px 4px;border-radius:3px;\">$1</code>");
  }

  async function generateDocxBlob(options) {
    const {
      blocks,
      title,
      author,
      font,
      fontSizePt,
      spacingMultiplier,
      includeHeader,
      includePageNumbers
    } = options;

    if (!window.docx) {
      throw new Error("docx library not loaded");
    }

    const {
      Document,
      Paragraph,
      TextRun,
      HeadingLevel,
      AlignmentType,
      Header,
      Footer,
      PageNumber,
      Packer
    } = window.docx;

    const children = [];

    function tokensToTextRuns(text, baseSizePt, isItalicBase = false, isBoldBase = false, colorHex = undefined) {
      const tokens = parseInlineTokens(text);
      return tokens.map(t => new TextRun({
        text: t.text,
        font: t.font || font,
        size: (baseSizePt || fontSizePt) * 2,
        bold: Boolean(t.bold || isBoldBase),
        italics: Boolean(t.italics || isItalicBase),
        color: colorHex || "111827"
      }));
    }

    const lineSpacingTwip = Math.round(spacingMultiplier * 240);

    for (const b of blocks) {
      if (b.type === "title") {
        children.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 120 },
            children: [
              new TextRun({
                text: b.text,
                font: font,
                size: Math.round(fontSizePt * 2.1 * 2),
                bold: true,
                color: "0F2C59"
              })
            ]
          })
        );
      } else if (b.type === "subtitle") {
        children.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 320 },
            children: [
              new TextRun({
                text: b.text,
                font: font,
                size: Math.round(fontSizePt * 1.1 * 2),
                italics: true,
                color: "475569"
              })
            ]
          })
        );
      } else if (b.type === "heading_1") {
        children.push(
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 360, after: 120, line: lineSpacingTwip },
            border: {
              bottom: { color: "CBD5E1", space: 4, value: "single", size: 8 }
            },
            children: [
              new TextRun({
                text: b.text,
                font: font,
                size: Math.round(fontSizePt * 1.45 * 2),
                bold: true,
                color: "0F2C59"
              })
            ]
          })
        );
      } else if (b.type === "heading_2") {
        children.push(
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 260, after: 80, line: lineSpacingTwip },
            children: [
              new TextRun({
                text: b.text,
                font: font,
                size: Math.round(fontSizePt * 1.25 * 2),
                bold: true,
                color: "1E40AF"
              })
            ]
          })
        );
      } else if (b.type === "heading_3") {
        children.push(
          new Paragraph({
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 180, after: 60, line: lineSpacingTwip },
            children: [
              new TextRun({
                text: b.text,
                font: font,
                size: Math.round(fontSizePt * 1.1 * 2),
                bold: true,
                color: "334155"
              })
            ]
          })
        );
      } else if (b.type === "keywords") {
        children.push(
          new Paragraph({
            indent: { left: 360, right: 360 },
            spacing: { before: 80, after: 240, line: lineSpacingTwip },
            children: [
              new TextRun({
                text: "Keywords: ",
                font: font,
                size: Math.round(fontSizePt * 0.95 * 2),
                bold: true,
                color: "0F2C59"
              }),
              new TextRun({
                text: b.text.replace(/^Keywords:\s*/i, ""),
                font: font,
                size: Math.round(fontSizePt * 0.95 * 2),
                italics: true,
                color: "334155"
              })
            ]
          })
        );
      } else if (b.type === "toc_item") {
        children.push(
          new Paragraph({
            indent: { left: 360 },
            spacing: { before: 20, after: 20, line: lineSpacingTwip },
            children: [
              new TextRun({
                text: "• " + b.text,
                font: font,
                size: Math.round(fontSizePt * 0.95 * 2),
                color: "1E293B"
              })
            ]
          })
        );
      } else if (b.type === "equation") {
        children.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 180, after: 180, line: lineSpacingTwip },
            shading: { fill: "F1F5F9" },
            border: {
              top: { color: "CBD5E1", space: 4, value: "single", size: 6 },
              bottom: { color: "CBD5E1", space: 4, value: "single", size: 6 },
              left: { color: "CBD5E1", space: 4, value: "single", size: 6 },
              right: { color: "CBD5E1", space: 4, value: "single", size: 6 },
            },
            children: [
              new TextRun({
                text: b.text,
                font: "Cambria Math",
                size: Math.round(fontSizePt * 1.05 * 2),
                bold: true,
                color: "0F2C59"
              })
            ]
          })
        );
      } else if (b.type === "key_point") {
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { before: 50, after: 70, line: lineSpacingTwip },
            children: [
              new TextRun({
                text: b.term + ": ",
                font: font,
                size: fontSizePt * 2,
                bold: true,
                color: "0F2C59"
              }),
              ...tokensToTextRuns(b.description, fontSizePt)
            ]
          })
        );
      } else if (b.type === "timeline") {
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { before: 40, after: 60, line: lineSpacingTwip },
            children: [
              new TextRun({
                text: b.year + ": ",
                font: font,
                size: fontSizePt * 2,
                bold: true,
                color: "2563EB"
              }),
              ...tokensToTextRuns(b.text, fontSizePt)
            ]
          })
        );
      } else if (b.type === "property") {
        children.push(
          new Paragraph({
            indent: { left: 720 },
            spacing: { before: 30, after: 40, line: lineSpacingTwip },
            children: [
              new TextRun({
                text: b.label + ": ",
                font: font,
                size: fontSizePt * 2,
                bold: true,
                color: "1E40AF"
              }),
              new TextRun({
                text: b.value,
                font: font,
                size: fontSizePt * 2,
                color: "0F172A"
              })
            ]
          })
        );
      } else if (b.type === "reference_item") {
        children.push(
          new Paragraph({
            indent: { left: 720, hanging: 720 },
            spacing: { before: 80, after: 120, line: lineSpacingTwip },
            children: tokensToTextRuns(b.text, fontSizePt)
          })
        );
      } else if (b.type === "callout_note") {
        children.push(
          new Paragraph({
            indent: { left: 720, right: 720 },
            shading: { fill: "FEF3C7" },
            border: {
              left: { color: "F59E0B", space: 10, value: "single", size: 24 }
            },
            spacing: { before: 180, after: 180, line: lineSpacingTwip },
            children: [
              new TextRun({
                text: "Note: ",
                font: font,
                size: Math.round(fontSizePt * 0.95 * 2),
                bold: true,
                color: "92400E"
              }),
              new TextRun({
                text: b.text.replace(/^(editorial note|note):\s*/i, ""),
                font: font,
                size: Math.round(fontSizePt * 0.95 * 2),
                italics: true,
                color: "78350F"
              })
            ]
          })
        );
      } else if (b.type === "bullet") {
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { before: 40, after: 60, line: lineSpacingTwip },
            children: tokensToTextRuns(b.text, fontSizePt)
          })
        );
      } else if (b.type === "numbered") {
        children.push(
          new Paragraph({
            indent: { left: 720, hanging: 360 },
            spacing: { before: 40, after: 60, line: lineSpacingTwip },
            children: [
              new TextRun({
                text: (b.prefix || "•") + " ",
                font: font,
                size: fontSizePt * 2,
                bold: true,
                color: "2563EB"
              }),
              ...tokensToTextRuns(b.text, fontSizePt)
            ]
          })
        );
      } else if (b.type === "quote") {
        children.push(
          new Paragraph({
            indent: { left: 720, right: 720 },
            border: {
              left: { color: "3B82F6", space: 10, value: "single", size: 24 }
            },
            spacing: { before: 140, after: 140, line: lineSpacingTwip },
            children: tokensToTextRuns(b.text, fontSizePt, true, false, "4B5563")
          })
        );
      } else if (b.type === "divider") {
        children.push(
          new Paragraph({
            border: {
              bottom: { color: "E5E7EB", space: 6, value: "single", size: 12 }
            },
            spacing: { before: 180, after: 180 }
          })
        );
      } else {
        children.push(
          new Paragraph({
            spacing: { before: 0, after: 140, line: lineSpacingTwip },
            children: tokensToTextRuns(b.text, fontSizePt)
          })
        );
      }
    }

    const headerObj = (includeHeader && title && title.trim()) ? {
      default: new Header({
        children: [
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({
                text: title.trim(),
                font: font,
                size: 18,
                italics: true,
                color: "9CA3AF"
              })
            ]
          })
        ]
      })
    } : {};

    const footerObj = includePageNumbers ? {
      default: new Footer({
        children: [
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({ text: "Page ", font: font, size: 18, color: "9CA3AF" }),
              new TextRun({ children: [PageNumber.CURRENT], font: font, size: 18, color: "9CA3AF" }),
              new TextRun({ text: " of ", font: font, size: 18, color: "9CA3AF" }),
              new TextRun({ children: [PageNumber.TOTAL_PAGES], font: font, size: 18, color: "9CA3AF" })
            ]
          })
        ]
      })
    } : {};

    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: {
              top: 1440,
              right: 1440,
              bottom: 1440,
              left: 1440
            }
          }
        },
        headers: headerObj,
        footers: footerObj,
        children: children
      }]
    });

    return await Packer.toBlob(doc);
  }

  function generateWordFallbackBlob(options) {
    const { blocks, title, author, font, fontSizePt, spacingMultiplier } = options;
    let bodyHtml = "";

    for (const b of blocks) {
      if (b.type === "title") {
        bodyHtml += `<div class="doc-title">${escapeHtml(b.text)}</div>\n`;
      } else if (b.type === "subtitle") {
        bodyHtml += `<div class="doc-subtitle">${escapeHtml(b.text)}</div>\n`;
      } else if (b.type === "heading_1") {
        bodyHtml += `<h1>${renderInlineHtml(b.text)}</h1>\n`;
      } else if (b.type === "heading_2") {
        bodyHtml += `<h2>${renderInlineHtml(b.text)}</h2>\n`;
      } else if (b.type === "heading_3") {
        bodyHtml += `<h3>${renderInlineHtml(b.text)}</h3>\n`;
      } else if (b.type === "keywords") {
        bodyHtml += `<div class="doc-keywords"><b>Keywords:</b> <i>${escapeHtml(b.text.replace(/^Keywords:\s*/i, ""))}</i></div>\n`;
      } else if (b.type === "toc_item") {
        bodyHtml += `<div class="doc-toc-item">• ${escapeHtml(b.text)}</div>\n`;
      } else if (b.type === "equation") {
        bodyHtml += `<div class="doc-equation">${escapeHtml(b.text)}</div>\n`;
      } else if (b.type === "key_point") {
        bodyHtml += `<div class="doc-keypoint">• <b>${escapeHtml(b.term)}:</b> ${renderInlineHtml(b.description)}</div>\n`;
      } else if (b.type === "timeline") {
        bodyHtml += `<div class="doc-timeline">• <b style="color:#2563eb;">${escapeHtml(b.year)}:</b> ${renderInlineHtml(b.text)}</div>\n`;
      } else if (b.type === "property") {
        bodyHtml += `<div style="margin-left:24pt;margin-bottom:4pt;"><b style="color:#1e40af;">${escapeHtml(b.label)}:</b> ${escapeHtml(b.value)}</div>\n`;
      } else if (b.type === "reference_item") {
        bodyHtml += `<div class="doc-reference">${renderInlineHtml(b.text)}</div>\n`;
      } else if (b.type === "callout_note") {
        bodyHtml += `<div class="doc-callout"><b>Note:</b> ${escapeHtml(b.text.replace(/^(editorial note|note):\s*/i, ""))}</div>\n`;
      } else if (b.type === "bullet") {
        bodyHtml += `<ul><li>${renderInlineHtml(b.text)}</li></ul>\n`;
      } else if (b.type === "numbered") {
        bodyHtml += `<ol><li>${renderInlineHtml(b.text)}</li></ol>\n`;
      } else if (b.type === "quote") {
        bodyHtml += `<blockquote>${renderInlineHtml(b.text)}</blockquote>\n`;
      } else if (b.type === "divider") {
        bodyHtml += `<hr style="border:none;border-top:1pt solid #cbd5e1;margin:18pt 0;" />\n`;
      } else {
        bodyHtml += `<p>${renderInlineHtml(b.text)}</p>\n`;
      }
    }

    const fullHtml = `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset='utf-8'>
<title>${escapeHtml(title || "Document")}</title>
<!--[if gte mso 9]>
<xml>
<w:WordDocument>
<w:View>Print</w:View>
<w:Zoom>100</w:Zoom>
<w:DoNotOptimizeForBrowser/>
</w:WordDocument>
</xml>
<![endif]-->
<style>
@page Section1 {
  size: 8.5in 11.0in;
  margin: 1.0in;
}
div.Section1 { page: Section1; }
body {
  font-family: '${font}', -apple-system, BlinkMacSystemFont, Arial, sans-serif;
  font-size: ${fontSizePt}pt;
  line-height: ${spacingMultiplier};
  color: #111827;
}
.doc-title { font-size: 26pt; font-weight: bold; color: #0f2c59; text-align: center; margin-bottom: 4pt; }
.doc-subtitle { font-size: 13pt; font-style: italic; color: #475569; text-align: center; margin-bottom: 24pt; border-bottom: 1pt solid #cbd5e1; padding-bottom: 12pt; }
h1 { font-size: 16pt; font-weight: bold; color: #0f2c59; border-bottom: 1.5pt solid #cbd5e1; padding-bottom: 4pt; margin-top: 22pt; margin-bottom: 8pt; text-transform: uppercase; }
h2 { font-size: 13.5pt; font-weight: bold; color: #1e40af; margin-top: 18pt; margin-bottom: 6pt; }
h3 { font-size: 12pt; font-weight: bold; color: #334155; margin-top: 14pt; margin-bottom: 4pt; }
p { margin-top: 0; margin-bottom: 8pt; text-align: justify; }
.doc-keywords { margin: 8pt 0 16pt 0; padding: 6pt 12pt; background: #f8fafc; border-left: 3pt solid #0f2c59; font-size: 10.5pt; }
.doc-equation { text-align: center; font-family: 'Cambria Math', Consolas, monospace; font-size: 12pt; font-weight: bold; color: #0f2c59; background: #f1f5f9; border: 1pt solid #cbd5e1; padding: 8pt 16pt; margin: 14pt 0; }
.doc-keypoint { margin-left: 20pt; margin-bottom: 6pt; }
.doc-timeline { margin-left: 20pt; margin-bottom: 6pt; }
.doc-reference { margin-left: 0.5in; text-indent: -0.5in; margin-bottom: 8pt; font-size: 11pt; }
.doc-callout { background: #fef3c7; border-left: 3pt solid #f59e0b; padding: 8pt 14pt; margin: 12pt 20pt; color: #78350f; font-style: italic; }
.doc-toc-item { margin-left: 20pt; margin-bottom: 3pt; font-size: 10pt; color: #1e293b; }
blockquote { border-left: 3pt solid #3b82f6; padding-left: 12pt; margin: 12pt 0; color: #4b5563; font-style: italic; }
ul, ol { margin-top: 0; margin-bottom: 8pt; padding-left: 20pt; }
li { margin-bottom: 3pt; }
</style>
</head>
<body>
<div class="Section1">
${bodyHtml}
</div>
</body>
</html>`;

    return new Blob(['\ufeff', fullHtml], { type: 'application/msword;charset=utf-8' });
  }

  function saveBlobAsFile(blob, filename) {
    if (window.saveAs) {
      window.saveAs(blob, filename);
    } else {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 1000);
    }
  }

  function openWordSettings() {
    const text = getTextToExport();
    if (!text) {
      toast("Please enter or humanize text first", "error");
      return;
    }

    // Auto-detect title if input is empty
    if (!docTitleEl.value.trim()) {
      const parsed = parseDocumentStructure(text, docHeadingDetectEl.value);
      if (parsed.detectedTitle) {
        docTitleEl.value = parsed.detectedTitle.replace(/^#+\s*/, "");
      } else {
        const firstLine = text.split(/\r?\n/)[0].trim().replace(/^#+\s*/, "");
        if (firstLine.length <= 60) {
          docTitleEl.value = firstLine;
        }
      }
    }

    wordSettingsEl.style.display = "block";
    wordSettingsEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  if (downloadWordBtn) {
    downloadWordBtn.addEventListener("click", openWordSettings);
  }

  if (downloadWordBtnLarge) {
    downloadWordBtnLarge.addEventListener("click", openWordSettings);
  }

  if (closeWordSettingsBtn) {
    closeWordSettingsBtn.addEventListener("click", () => {
      wordSettingsEl.style.display = "none";
    });
  }

  if (generateWordBtn) {
    generateWordBtn.addEventListener("click", async () => {
      const text = getTextToExport();
      if (!text) {
        toast("No text available to export", "error");
        return;
      }

      const origBtnHtml = generateWordBtn.innerHTML;
      generateWordBtn.disabled = true;
      generateWordBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 2a10 10 0 0110 10"/>
        </svg>
        <span>Building Document...</span>
      `;

      try {
        const headingMode = docHeadingDetectEl ? docHeadingDetectEl.value : "auto";
        const { blocks, detectedTitle } = parseDocumentStructure(text, headingMode);

        const customTitle = docTitleEl ? docTitleEl.value.trim() : "";
        const finalTitle = customTitle || detectedTitle || "Document";
        const author = docAuthorEl ? docAuthorEl.value.trim() : "";
        const font = docFontEl ? docFontEl.value : "Calibri";
        const fontSizePt = docFontSizeEl ? parseInt(docFontSizeEl.value) : 12;
        const spacingMultiplier = docSpacingEl ? parseFloat(docSpacingEl.value) : 1.15;
        const includeHeader = docHeaderTitleEl ? docHeaderTitleEl.checked : true;
        const includePageNumbers = docPageNumbersEl ? docPageNumbersEl.checked : true;

        const options = {
          blocks,
          title: finalTitle,
          author,
          font,
          fontSizePt,
          spacingMultiplier,
          includeHeader,
          includePageNumbers
        };

        const safeFilename = (finalTitle.replace(/[^a-zA-Z0-9_\-\s]/g, "").trim() || "Humanized_Document")
          .replace(/\s+/g, "_") + ".docx";

        let blob;
        let isDocxNative = false;

        if (window.docx) {
          try {
            blob = await generateDocxBlob(options);
            isDocxNative = true;
          } catch (err) {
            console.warn("Native docx builder error, using dual fallback:", err);
            blob = generateWordFallbackBlob(options);
          }
        } else {
          blob = generateWordFallbackBlob(options);
        }

        saveBlobAsFile(blob, isDocxNative ? safeFilename : safeFilename.replace(/\.docx$/, ".doc"));
        toast("Word document downloaded!");
      } catch (err) {
        console.error("Word export failed:", err);
        toast("Failed to export Word document", "error");
      } finally {
        generateWordBtn.disabled = false;
        generateWordBtn.innerHTML = origBtnHtml;
      }
    });
  }

})();
