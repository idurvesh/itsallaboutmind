(function () {
  var questions = [
    {
      q: "1. You're assembling furniture with confusing instructions. You:",
      opts: [
        { t: "Skip the instructions and figure it out by feel", v: 1 },
        { t: "Skim the steps once, then improvise as you build", v: 2 },
        { t: "Lay out every part first, then follow the steps in order", v: 3 },
        { t: "Study each diagram and match every screw to its slot", v: 4 }
      ]
    },
    {
      q: "2. A friend describes a new restaurant. What sticks with you most?",
      opts: [
        { t: "The mood, the lighting, how the place felt", v: 1 },
        { t: "The one dish they raved about and why", v: 2 },
        { t: "Whether the layout and service made sense", v: 3 },
        { t: "The exact address and what it cost", v: 4 }
      ]
    },
    {
      q: "3. Your desk drawer has turned into a mess. Your move:",
      opts: [
        { t: "Shove it shut and deal with it another day", v: 1 },
        { t: "Group things loosely by what you use most", v: 2 },
        { t: "Build a quick system, then adjust as it fills up", v: 3 },
        { t: "Sort everything into clearly labeled sections", v: 4 }
      ]
    },
    {
      q: "4. You get a free hour with no plan. You'd rather:",
      opts: [
        { t: "Doodle, write, or just let your mind wander", v: 1 },
        { t: "Start something creative and see where it goes", v: 2 },
        { t: "Plan out the rest of your week", v: 3 },
        { t: "Knock three items off your to-do list", v: 4 }
      ]
    },
    {
      q: "5. In a group project, you naturally end up:",
      opts: [
        { t: "Connecting ideas nobody else quite saw", v: 1 },
        { t: "Pitching new directions the group hadn't tried", v: 2 },
        { t: "Double-checking details before anything ships", v: 3 },
        { t: "Tracking deadlines and who is doing what", v: 4 }
      ]
    },
    {
      q: "6. When you recall a conversation from last week, you remember:",
      opts: [
        { t: "The feeling in the room", v: 1 },
        { t: "The general gist and a funny moment", v: 2 },
        { t: "The decision that came out of it, and next steps", v: 3 },
        { t: "What was actually said, almost word for word", v: 4 }
      ]
    }
  ];
  var scores = new Array(questions.length).fill(null);
  var qDiv = document.getElementById('q-questions');
  var submitBtn = document.getElementById('q-submit');
  var progressBar = document.getElementById('q-progress-bar');
  function render() {
    qDiv.innerHTML = '';
    questions.forEach(function (item, i) {
      var card = document.createElement('div');
      card.className = 'q-card';
      var title = document.createElement('div');
      title.className = 'q-title';
      title.textContent = item.q;
      card.appendChild(title);
      item.opts.forEach(function (opt) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'q-opt';
        btn.textContent = opt.t;
        if (scores[i] === opt.v) btn.classList.add('selected');
        btn.addEventListener('click', function () {
          scores[i] = opt.v;
          render();
        });
        card.appendChild(btn);
      });
      qDiv.appendChild(card);
    });
    var answered = scores.filter(function (s) { return s !== null; }).length;
    progressBar.style.width = (answered / questions.length * 100) + '%';
    submitBtn.style.display = answered === questions.length ? 'block' : 'none';
  }
  submitBtn.addEventListener('click', function () {
    var total = scores.reduce(function (a, b) { return a + b; }, 0);
    var tier, desc;
    if (total <= 12) {
      tier = "The Right-Brain Explorer";
      desc = "You lead with feel, image, and instinct. Structure comes second, if it comes at all.";
    } else if (total <= 18) {
      tier = "The Balanced Thinker";
      desc = "You move between logic and instinct depending on what the moment needs.";
    } else {
      tier = "The Left-Brain Strategist";
      desc = "You lead with structure, sequence, and detail. Instinct comes second, if it comes at all.";
    }
    document.getElementById('q-result-tier').textContent = tier;
    document.getElementById('q-result-desc').textContent = desc;
    document.getElementById('q-questions').style.display = 'none';
    document.getElementById('q-progress').style.display = 'none';
    submitBtn.style.display = 'none';
    document.getElementById('q-result').style.display = 'block';
  });
  render();
})();
