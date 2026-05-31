/* ============================================
   Meridian College — Student Feedback Form
   script.js
   ============================================ */

(function () {

  /* ── State ── */
  let currentStep = 1;
  const TOTAL_STEPS = 4;
  const starRatings = {};   // { teaching: 3, curriculum: 4, ... }

  /* ══════════════════════════════════════════
     STAR RATINGS
  ══════════════════════════════════════════ */
  document.querySelectorAll('.stars').forEach(function (group) {
    const aspect = group.dataset.aspect;
    starRatings[aspect] = 0;
    const btns = group.querySelectorAll('.star-btn');

    btns.forEach(function (btn) {
      /* Hover preview */
      btn.addEventListener('mouseenter', function () {
        const v = +btn.dataset.v;
        btns.forEach(function (b) {
          b.classList.toggle('lit', +b.dataset.v <= v);
        });
      });

      /* Permanent selection on click */
      btn.addEventListener('click', function () {
        starRatings[aspect] = +btn.dataset.v;
        btns.forEach(function (b) {
          b.classList.toggle('lit', +b.dataset.v <= starRatings[aspect]);
        });
      });
    });

    /* Reset to saved value on mouse-leave */
    group.addEventListener('mouseleave', function () {
      btns.forEach(function (b) {
        b.classList.toggle('lit', +b.dataset.v <= starRatings[aspect]);
      });
    });
  });

  /* ══════════════════════════════════════════
     MOOD PICKER
  ══════════════════════════════════════════ */
  document.querySelectorAll('.mood-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.mood-btn').forEach(function (b) {
        b.classList.remove('sel');
      });
      btn.classList.add('sel');
    });
  });

  /* ══════════════════════════════════════════
     CHARACTER COUNTERS
  ══════════════════════════════════════════ */
  function bindCharCounter(textareaId, counterId, max) {
    var ta = document.getElementById(textareaId);
    var ct = document.getElementById(counterId);
    if (!ta || !ct) return;
    ta.addEventListener('input', function () {
      var len = ta.value.length;
      ct.textContent = len + ' / ' + max;
      ct.classList.toggle('warn', len > max * 0.9);
    });
  }
  bindCharCounter('academic-highlight', 'cc-hl', 300);
  bindCharCounter('campus-suggestion',  'cc-cs', 300);
  bindCharCounter('dean-msg',           'cc-dm', 500);

  /* ══════════════════════════════════════════
     RANGE SLIDER (Wi-Fi rating)
  ══════════════════════════════════════════ */
  var wifiRange  = document.getElementById('wifiRange');
  var wifiBubble = document.getElementById('wifiBubble');
  var wifiVal    = document.getElementById('wifiVal');

  function updateRange() {
    var val = wifiRange.value;
    var pct = (val - 1) / 9;
    wifiBubble.textContent   = val;
    wifiBubble.style.left    = 'calc(' + (pct * 94 + 3) + '%)';
    wifiVal.textContent      = val + ' / 10';
  }
  wifiRange.addEventListener('input', updateRange);
  updateRange(); // init on load

  /* ══════════════════════════════════════════
     STEP NAVIGATION
  ══════════════════════════════════════════ */
  function goToStep(n) {
    var panels = document.querySelectorAll('.step-panel');
    var nodes  = document.querySelectorAll('.step-node');
    var cons   = document.querySelectorAll('.step-connector');

    // Hide current panel
    panels[currentStep - 1].classList.remove('active');
    currentStep = n;
    // Show target panel
    panels[currentStep - 1].classList.add('active');

    // Update step nodes (active / done)
    nodes.forEach(function (node, i) {
      var s = i + 1;
      node.classList.remove('active', 'done');
      if (s < currentStep)      node.classList.add('done');
      else if (s === currentStep) node.classList.add('active');
    });

    // Fill connectors for completed steps
    cons.forEach(function (con, i) {
      con.classList.toggle('filled', i + 1 < currentStep);
    });

    // Update badge text
    document.getElementById('stepBadge').textContent =
      'Step ' + currentStep + ' of ' + TOTAL_STEPS;

    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ══════════════════════════════════════════
     VALIDATION
  ══════════════════════════════════════════ */
  function markErr(groupId, show) {
    var el = document.getElementById(groupId);
    if (el) el.classList.toggle('err', show);
    return show;
  }

  function validateStep1() {
    var fname = document.getElementById('fname').value.trim();
    var lname = document.getElementById('lname').value.trim();
    var email = document.getElementById('email').value.trim();
    var fail  = false;

    if (!fname) { markErr('fg-fname', true);  fail = true; }
    else          markErr('fg-fname', false);

    if (!lname) { markErr('fg-lname', true);  fail = true; }
    else          markErr('fg-lname', false);

    var emailOk = email && email.includes('@') && email.includes('.');
    if (!emailOk) { markErr('fg-email', true);  fail = true; }
    else            markErr('fg-email', false);

    return !fail;
  }

  /* Shake animation on invalid submit attempt */
  function shakeBtn(id) {
    var btn = document.getElementById(id);
    btn.classList.remove('shake');
    void btn.offsetWidth; // force reflow to restart animation
    btn.classList.add('shake');
    setTimeout(function () { btn.classList.remove('shake'); }, 400);
  }

  /* ══════════════════════════════════════════
     BUTTON WIRING — Next / Back
  ══════════════════════════════════════════ */
  document.getElementById('next1').addEventListener('click', function () {
    if (validateStep1()) goToStep(2);
    else shakeBtn('next1');
  });

  document.getElementById('back2').addEventListener('click', function () { goToStep(1); });
  document.getElementById('next2').addEventListener('click', function () { goToStep(3); });

  document.getElementById('back3').addEventListener('click', function () { goToStep(2); });
  document.getElementById('next3').addEventListener('click', function () { goToStep(4); });

  document.getElementById('back4').addEventListener('click', function () { goToStep(3); });

  /* ══════════════════════════════════════════
     SUBMIT
  ══════════════════════════════════════════ */
  document.getElementById('submitBtn').addEventListener('click', function () {
    // Hide all panels and the step badge
    document.querySelectorAll('.step-panel').forEach(function (p) {
      p.style.display = 'none';
    });
    document.getElementById('stepBadge').style.display = 'none';

    // Show success screen
    var successScreen = document.getElementById('successScreen');
    successScreen.classList.add('show');

    // Generate random reference number
    document.getElementById('refNum').textContent =
      Math.random().toString(36).substr(2, 7).toUpperCase();

    // Mark all step nodes as done
    document.querySelectorAll('.step-node').forEach(function (n) {
      n.classList.remove('active');
      n.classList.add('done');
    });
    document.querySelectorAll('.step-connector').forEach(function (c) {
      c.classList.add('filled');
    });
  });

  /* ══════════════════════════════════════════
     RESTART
  ══════════════════════════════════════════ */
  document.getElementById('restartBtn').addEventListener('click', function () {
    location.reload();
  });

})();
