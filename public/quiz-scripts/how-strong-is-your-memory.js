(function () {
  var questions = [
    {
      q: "1. You meet someone new at a gathering. An hour later, do you remember their name?",
      opts: [
        { t: "Usually yes, without effort", v: 4 },
        { t: "Yes, if I repeated it back when we met", v: 3 },
        { t: "Sometimes, only if the name was unusual", v: 2 },
        { t: "Rarely, names slip fast", v: 1 }
      ]
    },
    {
      q: "2. You park in a large, unfamiliar lot. How easily do you find your car later?",
      opts: [
        { t: "Straight away, I clock the spot as I park", v: 4 },
        { t: "Fairly easily, I remember a nearby landmark", v: 3 },
        { t: "I wander a bit before it clicks", v: 2 },
        { t: "I often have no idea where I left it", v: 1 }
      ]
    },
    {
      q: "3. Someone gives you a short list of 4-5 things to pick up. Do you need to write it down?",
      opts: [
        { t: "No, I can hold it in my head easily", v: 4 },
        { t: "I can, but I double-check mentally on the way", v: 3 },
        { t: "I usually forget one item", v: 2 },
        { t: "I always need to write it down", v: 1 }
      ]
    },
    {
      q: "4. You watch a film. A week later, could you explain the plot to a friend?",
      opts: [
        { t: "Yes, in real detail", v: 4 },
        { t: "Yes, the main story but not small details", v: 3 },
        { t: "Only the broad idea", v: 2 },
        { t: "I'd struggle to explain much at all", v: 1 }
      ]
    },
    {
      q: "5. You walk into a room to get something. How often do you forget what it was?",
      opts: [
        { t: "Rarely, if ever", v: 4 },
        { t: "Occasionally, when I'm distracted", v: 3 },
        { t: "Fairly often", v: 2 },
        { t: "Almost every time this happens", v: 1 }
      ]
    },
    {
      q: "6. You're given directions verbally, no map. How well can you follow them?",
      opts: [
        { t: "I follow them exactly, first time", v: 4 },
        { t: "I follow most of it, with a wrong turn or two", v: 3 },
        { t: "I need to ask again partway through", v: 2 },
        { t: "I get lost unless I have it written down", v: 1 }
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
      tier = "Memory In Progress";
      desc = "Your recall works better with structure than with pressure. Lists, routines, and repetition make a real difference for you.";
    } else if (total <= 18) {
      tier = "Steady Recall";
      desc = "You remember what matters most of the time, especially when you're paying attention. Distraction is your main leak point.";
    } else {
      tier = "Sharp Recall";
      desc = "You hold onto names, details, and sequences with little effort. Your memory works well under normal, everyday conditions.";
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
