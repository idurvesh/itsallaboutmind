(function () {
  var questions = [
    {
      q: "1. Your phone buzzes with an urgent message right before bed.",
      opts: [
        { t: "I read it, decide it can wait, and go back to sleep", v: 4 },
        { t: "I read it, feel a flicker of worry, then let it go", v: 3 },
        { t: "I reply immediately even though it could wait", v: 2 },
        { t: "I lie awake replaying it for a while", v: 1 }
      ]
    },
    {
      q: "2. Traffic stalls and you're going to be late for something important.",
      opts: [
        { t: "I accept it, there's nothing I can do", v: 4 },
        { t: "I feel tense but stay quiet", v: 3 },
        { t: "I get visibly frustrated, honking or muttering", v: 2 },
        { t: "My heart races and I can't think about anything else", v: 1 }
      ]
    },
    {
      q: "3. A friend cancels plans on you at the last minute.",
      opts: [
        { t: "I shrug it off and rearrange my day", v: 4 },
        { t: "I'm mildly annoyed, then move on", v: 3 },
        { t: "I overthink whether I did something wrong", v: 2 },
        { t: "It ruins my mood for hours", v: 1 }
      ]
    },
    {
      q: "4. You get unexpected critical feedback on something you worked hard on.",
      opts: [
        { t: "I take a breath, then look at it objectively", v: 4 },
        { t: "I feel a sting, then start problem solving", v: 3 },
        { t: "I get defensive before I've fully read it", v: 2 },
        { t: "I replay it in my head for days", v: 1 }
      ]
    },
    {
      q: "5. Multiple small deadlines land on the same day.",
      opts: [
        { t: "I make a quick list and work through it calmly", v: 4 },
        { t: "I feel the pressure but push through", v: 3 },
        { t: "I jump between tasks without finishing any", v: 2 },
        { t: "I freeze and struggle to start at all", v: 1 }
      ]
    },
    {
      q: "6. Something goes wrong that's completely out of your control.",
      opts: [
        { t: "I focus on what I can still influence", v: 4 },
        { t: "I vent briefly, then adjust", v: 3 },
        { t: "I stay irritated for the rest of the day", v: 2 },
        { t: "I spiral and it affects everything else I do", v: 1 }
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
      tier = "Reactive Alarm";
      desc = "Your stress response fires fast, often before your mind has caught up with what's happening. Noticing the gap between the trigger and the reaction is a useful first step.";
    } else if (total <= 18) {
      tier = "Balanced Responder";
      desc = "You handle normal pressure well and stay fairly steady day to day. The strain shows up when several things stack at once.";
    } else {
      tier = "Steady Under Pressure";
      desc = "You rarely spike, and when you do, you recover quickly. That's a genuine strength, though it can mean you underestimate how much you're carrying.";
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
