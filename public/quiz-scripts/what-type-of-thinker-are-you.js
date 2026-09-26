(function () {
  var questions = [
    {
      q: "1. You're handed a messy problem with no clear brief. You:",
      opts: [
        { t: "List ten possible directions before picking one", v: 1 },
        { t: "Sketch a few options, then start narrowing", v: 2 },
        { t: "Look for the constraints first, then work inward", v: 3 },
        { t: "Find the one workable answer and commit to it", v: 4 }
      ]
    },
    {
      q: "2. In a group brainstorm, you're usually the one who:",
      opts: [
        { t: "Keeps throwing out new, unrelated ideas", v: 1 },
        { t: "Builds on other people's ideas out loud", v: 2 },
        { t: "Steers the group toward picking one", v: 3 },
        { t: "Checks which idea can actually ship", v: 4 }
      ]
    },
    {
      q: "3. Learning a new skill, you'd rather:",
      opts: [
        { t: "Experiment freely and see what happens", v: 1 },
        { t: "Try a few methods, then settle into one", v: 2 },
        { t: "Follow the one method that's proven to work", v: 3 },
        { t: "Find the fastest route to a usable result", v: 4 }
      ]
    },
    {
      q: "4. A plan you were counting on falls apart. Your first move:",
      opts: [
        { t: "Brainstorm a pile of new options right away", v: 1 },
        { t: "Weigh a couple of backup routes", v: 2 },
        { t: "Pick the closest replacement and adjust it", v: 3 },
        { t: "Go straight to the most reliable fallback", v: 4 }
      ]
    },
    {
      q: "5. When you're stuck on a problem, you make progress by:",
      opts: [
        { t: "Stepping away and letting your mind wander", v: 1 },
        { t: "Talking it through out loud with someone", v: 2 },
        { t: "Breaking it into smaller, solvable pieces", v: 3 },
        { t: "Re-reading the constraints until one answer fits", v: 4 }
      ]
    },
    {
      q: "6. Your desk or workspace usually looks like:",
      opts: [
        { t: "Scattered notes and half-started ideas", v: 1 },
        { t: "A mix of loose notes and one active project", v: 2 },
        { t: "One project at a time, mostly tidy", v: 3 },
        { t: "A single clear checklist, nothing extra", v: 4 }
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
      tier = "The Divergent Thinker";
      desc = "You open problems up before you narrow them down. Fresh options come easily, closing them out takes more effort.";
    } else if (total <= 18) {
      tier = "The Adaptive Thinker";
      desc = "You widen or narrow depending on what the problem actually needs, switching modes as the moment calls for it.";
    } else {
      tier = "The Convergent Thinker";
      desc = "You narrow in fast, working toward the one answer that satisfies the constraints in front of you.";
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
