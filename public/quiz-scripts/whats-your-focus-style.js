(function () {
  var questions = [
    {
      q: "1. Your phone buzzes with a notification while you're mid-task.",
      opts: [
        { t: "I keep working and check it later", v: 4 },
        { t: "I glance at the screen but go back to work", v: 3 },
        { t: "I check it, then need a minute to get back into the task", v: 2 },
        { t: "I check it and end up scrolling for a while", v: 1 }
      ]
    },
    {
      q: "2. You're two hours into a task that needs to be finished today.",
      opts: [
        { t: "I'm usually still locked in, time passes fast", v: 4 },
        { t: "I'm going strong but starting to feel restless", v: 3 },
        { t: "I need a short break to reset", v: 2 },
        { t: "I've already switched to something else", v: 1 }
      ]
    },
    {
      q: "3. Someone starts talking nearby while you're working.",
      opts: [
        { t: "I barely notice, I'm in my own world", v: 4 },
        { t: "I notice but keep going", v: 3 },
        { t: "I lose my thread and have to re-read what I wrote", v: 2 },
        { t: "I end up joining the conversation", v: 1 }
      ]
    },
    {
      q: "4. You open your laptop to do one specific task.",
      opts: [
        { t: "I go straight to it and start", v: 4 },
        { t: "I check one or two things first, then start", v: 3 },
        { t: "I open several tabs and pick whichever feels easiest", v: 2 },
        { t: "Somehow 40 minutes disappear before I start", v: 1 }
      ]
    },
    {
      q: "5. A task is boring but has to get done.",
      opts: [
        { t: "I push through in one sitting", v: 4 },
        { t: "I break it into chunks and get through it steadily", v: 3 },
        { t: "I do a bit, drift off, then come back later", v: 2 },
        { t: "I keep putting it off for something more interesting", v: 1 }
      ]
    },
    {
      q: "6. You're interrupted mid-task by a question from someone else.",
      opts: [
        { t: "I answer quickly and pick up exactly where I left off", v: 4 },
        { t: "I answer, then take a moment to find my place again", v: 3 },
        { t: "I answer, and the interruption lingers in my head", v: 2 },
        { t: "I answer and often forget what I was doing before", v: 1 }
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
      tier = "The Scattered Sprinter";
      desc = "Your focus arrives in short, intense bursts. Notifications and new tabs pull you off course easily, and getting back into a task takes real effort.";
    } else if (total <= 18) {
      tier = "The Steady Switcher";
      desc = "You can hold a task for a good while, but interruptions still cost you something, usually a minute or two to find your place again.";
    } else {
      tier = "The Deep Diver";
      desc = "You can disappear into a task for long stretches without much effort. Surfacing for interruptions is the part that feels jarring.";
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
