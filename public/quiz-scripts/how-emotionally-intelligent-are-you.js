(function () {
  var questions = [
    {
      q: "1. A friend seems off, but says they're \"fine\" when you ask.",
      opts: [
        { t: "I gently push a little, since I can tell something's wrong", v: 4 },
        { t: "I let it go but check in again later", v: 3 },
        { t: "I take them at their word and move on", v: 2 },
        { t: "I don't usually notice unless it's said directly", v: 1 }
      ]
    },
    {
      q: "2. You get criticized in front of others at work.",
      opts: [
        { t: "I feel the sting but stay composed and respond calmly", v: 4 },
        { t: "I feel embarrassed but hold it together until later", v: 3 },
        { t: "I get defensive and push back right away", v: 2 },
        { t: "I shut down and can't think of anything to say", v: 1 }
      ]
    },
    {
      q: "3. Someone close to you is clearly frustrated with something unrelated to you.",
      opts: [
        { t: "I notice the shift in their mood before they say anything", v: 4 },
        { t: "I pick up on it once they mention what's wrong", v: 3 },
        { t: "I assume it's about me and get defensive", v: 2 },
        { t: "I usually don't notice until it's pointed out", v: 1 }
      ]
    },
    {
      q: "4. You make a mistake that affects other people.",
      opts: [
        { t: "I own it, apologize, and focus on fixing it", v: 4 },
        { t: "I feel bad but explain my side first", v: 3 },
        { t: "I get defensive and look for reasons it wasn't fully my fault", v: 2 },
        { t: "I avoid the conversation as long as I can", v: 1 }
      ]
    },
    {
      q: "5. You're in a disagreement that's getting heated.",
      opts: [
        { t: "I slow down and try to understand their point first", v: 4 },
        { t: "I stay mostly calm but want to be heard too", v: 3 },
        { t: "I raise my voice or talk over them", v: 2 },
        { t: "I go quiet and disengage completely", v: 1 }
      ]
    },
    {
      q: "6. You feel a strong emotion, like anger or anxiety, building up.",
      opts: [
        { t: "I notice it early and can name what I'm feeling", v: 4 },
        { t: "I notice it once it's fairly strong", v: 3 },
        { t: "I only realize it after I've already reacted", v: 2 },
        { t: "It builds quietly until it comes out all at once", v: 1 }
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
      tier = "Still Tuning In";
      desc = "Emotions, yours and other people's, aren't always easy for you to read in the moment. Reading emotions is a skill, and it sharpens with practice and attention.";
    } else if (total <= 18) {
      tier = "Steady And Aware";
      desc = "You pick up on most emotional cues and generally respond well, even if a strong reaction sometimes catches you off guard.";
    } else {
      tier = "Highly Attuned";
      desc = "You read rooms quickly and often know what someone needs before they say it. Just watch that you're checking in on your own feelings too.";
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
